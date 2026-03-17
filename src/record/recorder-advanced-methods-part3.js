class RecorderAdvancedMethodsPart3 {
  buildFFmpegCommand(inputFile, outputFile) {
    // DIAGNOSTIC: Log video duration and trim values
    console.log('�x}� [FFmpeg] Building command with:');
    console.log('   - videoDuration:', this.videoDuration);
    console.log('   - trimStart:', this.trimStart);
    console.log('   - trimEnd:', this.trimEnd);
    console.log('   - lastExportDuration:', this.lastExportDuration);
    console.log('   - format:', this.formatSelect.value);

    // FIX: Calculate the ACTUAL duration to use
    // Priority: 1) lastExportDuration (from canvas composition), 2) trimEnd-trimStart, 3) recorded time
    let outputDuration = null;

    // First try: use the stored export duration from canvas composition
    if (this.lastExportDuration && Number.isFinite(this.lastExportDuration) && this.lastExportDuration > 0) {
      outputDuration = this.lastExportDuration;
      console.log('�x}� [FFmpeg] Using lastExportDuration:', outputDuration);
    }
    // Second try: calculate from trim values if they're valid
    else if (Number.isFinite(this.trimEnd) && Number.isFinite(this.trimStart) && this.trimEnd > this.trimStart) {
      outputDuration = this.trimEnd - this.trimStart;
      console.log('�x}� [FFmpeg] Using trimEnd-trimStart:', outputDuration);
    }
    // Third try: use videoDuration if valid
    else if (Number.isFinite(this.videoDuration) && this.videoDuration > 0) {
      outputDuration = this.videoDuration - (this.trimStart || 0);
      console.log('�x}� [FFmpeg] Using videoDuration:', outputDuration);
    }
    // Last resort: use recorded duration from timer
    else {
      outputDuration = this.getRecordedDuration();
      console.log('�x}� [FFmpeg] Using getRecordedDuration() fallback:', outputDuration);
    }

    // Final validation - ensure we have a reasonable duration
    if (!outputDuration || !Number.isFinite(outputDuration) || outputDuration <= 0) {
      outputDuration = 10; // Absolute minimum fallback
      console.log('�x}� [FFmpeg] WARNING: All duration methods failed, using fallback:', outputDuration);
    }

    console.log('�x}� [FFmpeg] Final output duration:', outputDuration);

    // FIX FOR X/TWITTER: Input flags MUST come BEFORE -i to fix corrupted WebM timestamps
    // The WebM from MediaRecorder often has broken duration metadata (causing "241 minutes" error)
    const command = [
      // Input analysis flags - handle corrupted WebM timestamps
      "-fflags", "+genpts+igndts+discardcorrupt",  // Regenerate PTS, ignore DTS, discard corrupt
      "-i", inputFile,
      // CRITICAL FIX: Strip ALL source metadata to prevent corrupted duration propagation
      // Without this, the broken WebM duration (Infinity/241 min) bleeds into MP4
      "-map_metadata", "-1"
    ];

    // Trimming - seek to start position if needed
    if (this.trimStart > 0) {
      command.push("-ss", this.trimStart.toString());
    }

    // FIX: ALWAYS add explicit duration to fix the X/Twitter "241 minutes" bug
    // This is critical because WebM from MediaRecorder has corrupted duration metadata
    command.push("-t", outputDuration.toFixed(3));
    console.log('�x}� [FFmpeg] Added explicit duration -t:', outputDuration.toFixed(3));

    // Since visual effects are now handled by canvas composition,
    // this method focuses on format conversion and trimming only
    // with optimized settings for speed

    // Output settings based on format - optimized for speed
    if (this.formatSelect.value === "mp4") {
      command.push("-c:v", "libx264");
      command.push("-preset", "superfast");
      // Use baseline profile for maximum compatibility (X/Twitter, older devices)
      command.push("-profile:v", "baseline");
      command.push("-level", "3.1");

      // FIX: Force Constant Frame Rate - ensures clean timestamp regeneration
      command.push("-vsync", "cfr");
      command.push("-r", "30");

      // FIX: Set explicit video timescale for proper duration calculation
      // This ensures the moov atom has correct timing info
      command.push("-video_track_timescale", "30000");

      // FIX: Add standard web video color metadata (bt709)
      command.push("-colorspace", "bt709");
      command.push("-color_primaries", "bt709");
      command.push("-color_trc", "bt709");
      command.push("-color_range", "tv");

      // Ensure even dimensions (required for yuv420p compatibility)
      // Also add fps=30 in video filter to ensure frame rate consistency
      command.push("-vf", "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2");

      // Simplified CRF calculation
      const baseCRF = this.qualitySelect.value === "high" ? 23 :
        this.qualitySelect.value === "medium" ? 28 : 32;

      command.push("-crf", baseCRF.toString());
      command.push("-pix_fmt", "yuv420p");

      // FIX: Critical movflags for X/Twitter compatibility
      // - faststart: moves moov atom to start for streaming
      // - write_colr: writes color info
      // - use_metadata_tags: ensures duration is written properly
      command.push("-movflags", "+faststart+write_colr+use_metadata_tags");
    } else {
      command.push("-c:v", "libvpx-vp9");

      // Simplified CRF for WebM
      const baseCRF = this.qualitySelect.value === "high" ? 32 :
        this.qualitySelect.value === "medium" ? 38 : 44;

      command.push("-crf", baseCRF.toString());
      command.push("-speed", "8"); // Fast encoding for VP9
      command.push("-tile-columns", "6");
      command.push("-frame-parallel", "1");
    }

    // Audio - simplified
    if (this.systemAudio) {
      command.push(
        "-c:a",
        this.formatSelect.value === "mp4" ? "aac" : "libopus"
      );
      command.push("-b:a", "128k"); // Fixed audio bitrate for consistency

      // Force stereo and standard sample rate for better compatibility
      if (this.formatSelect.value === "mp4") {
        command.push("-ac", "2");
        command.push("-ar", "44100");
      }
    } else {
      command.push("-an"); // No audio
    }

    // Add global options for faster processing
    command.push("-threads", "0"); // Use all available threads
    command.push("-avoid_negative_ts", "make_zero");

    command.push(outputFile);

    // Log full command for debugging
    console.log('�x}� [FFmpeg] Full command:', command.join(' '));

    return command;
  }


  generateFileName() {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const format = this.formatSelect.value;
    return `screensmooth-recording-${timestamp}.${format}`;
  }


  shareRecording() {
    if (!this.recordingBlob) {
      this.showError("No recording available to share");
      return;
    }

    if (navigator.share) {
      const file = new File([this.recordingBlob], this.generateFileName(), {
        type: this.recordingBlob.type,
      });

      navigator
        .share({
          title: "ScreenSmooth Recording",
          text: "Check out my screen recording made with ScreenSmooth!",
          files: [file],
        })
        .catch((error) => {
          ("Error sharing:", error);
          this.fallbackShare();
        });
    } else {
      this.fallbackShare();
    }
  }


  fallbackShare() {
    // Copy download link to clipboard or show share options
    const url = URL.createObjectURL(this.recordingBlob);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showSuccess("Recording link copied to clipboard!");
      });
    } else {
      this.showInfo(
        "Use the download button to save your recording and share it manually."
      );
    }
  }


  recordAgain() {
    // Clear all zoom data when recording again
    this.clearAllZoomData();

    // Cleanup before resetting
    this.cleanup();

    // Reset state
    this.recordingBlob = null;
    this.recordedChunks = [];
    this.videoDuration = 0;
    this.trimStart = 0;
    this.trimEnd = 0;
    this.currentTime = 0;
    this.isPlaying = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseStartTime = 0;

    // Clear video
    this.previewVideo.src = "";

    // Reset visual editing controls
    this.videoPadding.value = 8;
    this.videoBlur.value = 0;
    this.videoBorderRadius.value = 12;
    this.updateVideoPreview();

    // Reset screen effects
    if (this.screenBrightness) this.screenBrightness.value = 1;
    if (this.screenContrast) this.screenContrast.value = 1;
    if (this.screenSaturation) this.screenSaturation.value = 1;
    this.updateScreenEffects();

    // Clear status text
    this.updateStatusText("");

    // Show recording setup
    this.showRecordingSetup();
  }


  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isRecording && !this.isPaused && this.startTime) {
        const elapsed = Date.now() - this.startTime - this.pausedTime;
        this.recordingTimer.textContent = this.formatTime(elapsed / 1000);
      }
    }, 1000);
  }


  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }


  formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "00:00:00";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }


  updateFileInfo() {
    if (!this.recordingBlob) {
      return;
    }

    // Update file size
    const sizeInMB = (this.recordingBlob.size / (1024 * 1024)).toFixed(2);
    this.fileSize.textContent = `${sizeInMB} MB`;

    // Update file name
    this.fileName.textContent = this.generateFileName();
  }


  showRecordingSetup() {
    this.recordingSetup.style.display = "block";
    this.recordingControls.style.display = "none";

    // Remove has-recording class to hide the editor
    if (this.previewEditor) {
      this.previewEditor.classList.remove("has-recording");
    }

    // Hide panels container
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "none";
    }

    // Restore main-content visibility and add no-recording class for full-page setup UI
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.display = '';  // Restore default display
      mainContent.classList.add('no-recording');
    }
  }


  showRecordingControls() {
    this.recordingSetup.style.display = "none";
    this.recordingControls.style.display = "block";

    // Remove has-recording class to hide the editor
    if (this.previewEditor) {
      this.previewEditor.classList.remove("has-recording");
    }

    // Hide panels container
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "none";
    }

    // Restore main-content visibility and add no-recording class (still in recording phase)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.display = '';  // Restore default display
      mainContent.classList.add('no-recording');
    }
  }


  showPreviewEditor() {
    this.recordingSetup.style.display = "none";
    this.recordingControls.style.display = "none";

    // Add has-recording class to show the editor
    if (this.previewEditor) {
      this.previewEditor.classList.add("has-recording");
    }

    // Show panels container
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "flex";
    }

    // CRITICAL FIX: Hide the main-content element completely when showing editor
    // This prevents the recording setup area from taking up viewport space
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('no-recording');
      mainContent.style.display = 'none';  // Force hide with display:none
    }
  }


  hideEditor() {
    // Hide the preview editor and panels container
    if (this.previewEditor) {
      this.previewEditor.classList.remove("has-recording");
    }
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "none";
    }
  }


  resetRecordingButton() {
    this.startRecordingBtn.disabled = false;
    this.startRecordingBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
            </svg>
            Start Recording
        `;
  }


  async notifyContentScript(action, data = {}) {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]) {
        await chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
      }
    } catch (error) {
      ("Could not notify content script:", error.message);
    }
  }


  showError(message) {
    this.showNotification(message, "error");
  }


  showSuccess(message) {
    this.showNotification(message, "success");
  }


  showInfo(message) {
    this.showNotification(message, "info");
  }

}

export { RecorderAdvancedMethodsPart3 };
