class RecorderAdvancedMethodsPart2 {
  generateAutoZoomSegments(intentEvents) {
    if (!intentEvents || intentEvents.length === 0) return [];

    console.log('<� [AUTO-ZOOM] === GENERATING SMART INTENT-BASED SEGMENTS ===');
    console.log('<� [AUTO-ZOOM] Input events:', intentEvents.length);

    const recordingStart = this.recordingStartTimestamp || intentEvents[0].timestamp;

    // Normalize and filter out noisy clicks
    const normalizedEvents = intentEvents.map(ev => {
      const relativeTime = (ev.timestamp - recordingStart) / 1000;
      const vw = ev.viewportWidth || ev.screenWidth || window.screen.width;
      const vh = ev.viewportHeight || ev.screenHeight || window.screen.height;
      const cx = ev.x + (ev.scrollX || 0);
      const cy = ev.y + (ev.scrollY || 0);

      return {
        time: Math.max(0, relativeTime),
        normalizedX: Math.max(0, Math.min(1, cx / vw)),
        normalizedY: Math.max(0, Math.min(1, cy / vh)),
        type: ev.type,
        width: ev.width || 0,
        height: ev.height || 0,
        original: ev
      };
    }).sort((a, b) => a.time - b.time);

    // Smart Clustering:
    // - Group rapid identical intents (e.g., spam clicking)
    // - Different weights/durations for typing vs clicking
    const clusters = [];
    let currentCluster = [normalizedEvents[0]];

    for (let i = 1; i < normalizedEvents.length; i++) {
      const ev = normalizedEvents[i];
      const lastEv = currentCluster[currentCluster.length - 1];
      const timeDiff = ev.time - lastEv.time;

      const distX = Math.abs(ev.normalizedX - lastEv.normalizedX);
      const distY = Math.abs(ev.normalizedY - lastEv.normalizedY);
      const dist = Math.sqrt(distX * distX + distY * distY);

      // Group if within 3.5s AND distance is small (< 15% viewport)
      // OR if user is continuously typing in the same area (extend cluster)
      if ((timeDiff <= 3.5 && dist < 0.15) || (ev.type === 'typing' && lastEv.type === 'typing' && timeDiff <= 5.0 && dist < 0.2)) {
        currentCluster.push(ev);
      } else {
        clusters.push([...currentCluster]);
        currentCluster = [ev];
      }
    }
    clusters.push(currentCluster);

    console.log('<� [AUTO-ZOOM] Clusters formed:', clusters.length);

    const baseIntensity = this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5;
    const maxTime = this.videoDuration || Infinity;

    const segments = [];

    clusters.forEach((cluster, index) => {
      const firstEv = cluster[0];
      const lastEv = cluster[cluster.length - 1];

      // Determine segment importance and type based on cluster contents
      const hasTyping = cluster.some(e => e.type === 'typing');
      const hasSelection = cluster.some(e => e.type === 'selection');
      const clickCount = cluster.filter(e => e.type === 'click').length;

      // Skip clusters that are just a single stray click near the edges (likely closing a dialog or navigating away)
      if (cluster.length === 1 && firstEv.type === 'click') {
        const nx = firstEv.normalizedX;
        const ny = firstEv.normalizedY;
        // If it's on the extreme edges (top 5%, bottom 5%, left 5%, right 5%) and just a single click, it might be a tab switch or closing window.
        if (nx < 0.05 || nx > 0.95 || ny < 0.05 || ny > 0.95) {
          console.log(`<� [AUTO-ZOOM] Ignoring likely edge navigation click at (${nx.toFixed(2)}, ${ny.toFixed(2)})`);
          return;
        }
      }

      // Base position on the last meaningful interaction in the cluster
      let position = { x: lastEv.normalizedX, y: lastEv.normalizedY };

      // Determine duration and intensity contextually
      let preAnticipation = 0.6; // Time before action to start zooming
      let postDwell = 1.5;       // Time after action to stay zoomed
      let intensity = baseIntensity;

      if (hasTyping) {
        // Typing usually implies sustained focus
        postDwell = 2.5;
        intensity = Math.min(4, baseIntensity * 1.15); // Slightly closer for typing
      } else if (hasSelection) {
        // Selection implies reading / focusing
        postDwell = 2.0;
        // Average the position of selection
        const selections = cluster.filter(e => e.type === 'selection');
        const lastSel = selections[selections.length - 1];
        position = { x: lastSel.normalizedX, y: lastSel.normalizedY };
      } else if (clickCount >= 3) {
        // Spam clicking -> keep it zoomed slightly longer to capture the chaos
        postDwell = 2.0;
      }

      const startTime = Math.max(0, firstEv.time - preAnticipation);
      const endTime = Math.min(lastEv.time + postDwell, maxTime);

      // Only add if it's a meaningful duration
      if (endTime - startTime > 1.0) {
        segments.push({
          id: `auto-intent-${Date.now()}-${index}`,
          startTime,
          endTime,
          intensity,
          position,
          mode: 'auto'
        });
      }
    });

    // Merge overlapping segments
    const merged = [];
    for (const seg of segments) {
      if (merged.length > 0 && seg.startTime <= merged[merged.length - 1].endTime + 0.5) {
        // Overlapping or very close (within 0.5s)  merge them
        const prev = merged[merged.length - 1];
        prev.endTime = Math.max(prev.endTime, seg.endTime);

        // Smooth out position transition by taking the latest intent's position
        prev.position = seg.position;
      } else {
        merged.push({ ...seg });
      }
    }

    console.log(' [AUTO-ZOOM] Final intent segments after merge:', merged.length);
    return merged;
  }
  // === SCREEN STUDIO MATCH === Auto button handler � works even after playback/scrubbing

  handleAutoZoomButtonClick() {
    if (this.autoZoomIntentEvents?.length) {
      console.log('�x}� [AUTO-ZOOM] Auto button clicked � regenerating segments from', this.autoZoomIntentEvents.length, 'intent events');
      this.zoomSegments = this.generateAutoZoomSegments(this.autoZoomIntentEvents);
      this.renderZoomSegments();
      this.updateClearButtonState();
    } else {
      console.log('�x}� [AUTO-ZOOM] Auto button clicked but no intent events stored');
    }
  }


  async convertToGif(videoBlob) {
    this.updateStatusText("Converting to GIF...");

    // Set timeout for GIF conversion (2 minutes max)
    const gifTimeout = setTimeout(() => {
      throw new Error("GIF conversion timed out after 2 minutes. Try a shorter video.");
    }, 2 * 60 * 1000);

    try {
      const inputFileName = "input.webm";
      const outputFileName = "output.gif";

      // Write input file
      await this.ffmpeg.writeFile(
        inputFileName,
        await this.fetchFile(videoBlob)
      );

      // Calculate duration for trimming
      const duration = Math.min(this.trimEnd - this.trimStart, 10); // Limit GIFs to 10 seconds max

      // Build optimized GIF conversion command
      const command = [
        "-i", inputFileName,
        "-ss", this.trimStart.toString(),
        "-t", duration.toString(),
        "-vf", "fps=10,scale=480:-1:flags=lanczos", // Reduced FPS and size for faster conversion
        "-c:v", "gif",
        "-loop", "0", // Infinite loop
        outputFileName
      ];

      // Apply compression level
      const compressionLevel = parseInt(this.compressionLevel.value) || 5;
      if (compressionLevel > 5) {
        command.splice(-1, 0, "-compression_level", compressionLevel.toString());
      }

      // Execute FFmpeg
      await this.ffmpeg.exec(command);

      // Read output file
      const outputData = await this.ffmpeg.readFile(outputFileName);

      // Clean up
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      // Create blob from output
      const gifBlob = new Blob([outputData.buffer], { type: "image/gif" });

      clearTimeout(gifTimeout);
      return gifBlob;
    } catch (error) {
      clearTimeout(gifTimeout);
      throw error;
    }
  }


  async processVideoWithFFmpeg(inputBlob = null) {
    if (!this.ffmpeg || !this.isFFmpegLoaded) {
      throw new Error("FFmpeg not available. Video processing engine failed to load. Please try downloading the video without format conversion.");
    }

    // Set timeout for FFmpeg processing (3 minutes max)
    const ffmpegTimeout = setTimeout(() => {
      throw new Error("FFmpeg processing timed out after 3 minutes. Try a shorter video or simpler settings.");
    }, 3 * 60 * 1000);

    try {
      // Use provided blob or fall back to original recording
      let videoBlob = inputBlob || this.recordingBlob;

      // Handle GIF conversion specially
      if (this.formatSelect.value === "gif") {
        const result = await this.convertToGif(videoBlob);
        clearTimeout(ffmpegTimeout);
        return result;
      }

      // Write input file
      const inputFileName = "input.webm";
      const outputFileName = `output.${this.formatSelect.value}`;

      await this.ffmpeg.writeFile(
        inputFileName,
        await this.fetchFile(videoBlob)
      );

      // Build FFmpeg command for format conversion and trimming
      const command = this.buildFFmpegCommand(inputFileName, outputFileName);

      // DIAGNOSTIC: Log the full FFmpeg command
      console.log('�x}� [FFmpeg] Full command:', command.join(' '));

      // Set up progress logging - capture ALL ffmpeg output for diagnostics
      this.ffmpeg.on('log', ({ message }) => {
        // Log all FFmpeg messages for debugging
        console.log('�x}� [FFmpeg log]:', message);

        if (message.includes('time=')) {
          // Extract time progress from FFmpeg log
          const timeMatch = message.match(/time=(\d+:\d+:\d+)/);
          if (timeMatch) {
            this.updateStatusText(`Converting video... (${timeMatch[1]})`);
          }
        }

        // DIAGNOSTIC: Capture duration info from FFmpeg
        if (message.includes('Duration:')) {
          console.log('�x}� [FFmpeg] INPUT DURATION DETECTED:', message);
        }
      });

      // Execute FFmpeg
      await this.ffmpeg.exec(command);

      // Read output file
      const outputData = await this.ffmpeg.readFile(outputFileName);

      // Clean up
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      // Create blob from output
      const mimeType =
        this.formatSelect.value === "mp4" ? "video/mp4" : "video/webm";
      const processedBlob = new Blob([outputData.buffer], { type: mimeType });

      clearTimeout(ffmpegTimeout);
      return processedBlob;
    } catch (error) {
      clearTimeout(ffmpegTimeout);
      throw error;
    }
  }

}

export { RecorderAdvancedMethodsPart2 };
