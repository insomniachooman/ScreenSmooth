class RecorderMediaExportMethodsPart8 {
  drawExportFrameToCanvas({ ctx, canvas, video, state }) {
    if (state.isDrawing) {
      return false;
    }

    state.isDrawing = true;
    state.frameCount += 1;

    try {
      const currentTime = video.currentTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (this.currentBlur > 0 &&
        (!this.exportBlurredBackgroundCache ||
          this.exportBlurredBackgroundCache.width !== canvas.width ||
          this.exportBlurredBackgroundCache.height !== canvas.height)) {
        this.generateExportBlurredBackgroundCache(canvas.width, canvas.height);
      }

      if (this.currentBlur > 0 && this.exportBlurredBackgroundCache) {
        ctx.drawImage(this.exportBlurredBackgroundCache, 0, 0);
      } else {
        this.drawBackgroundDirect(ctx, canvas.width, canvas.height);
      }

      const padding = this.currentPadding || 0;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const availableWidth = canvas.width - (padding * 2);
      const availableHeight = canvas.height - (padding * 2);
      const videoX = padding + (availableWidth - videoWidth) / 2;
      const videoY = padding + (availableHeight - videoHeight) / 2;

      if (video.readyState >= 2 && videoWidth > 0 && videoHeight > 0) {
        let filterString = '';
        if (this.currentBrightness !== 1 || this.currentContrast !== 1 || this.currentSaturation !== 1) {
          filterString += 'brightness(' + this.currentBrightness + ') contrast(' + this.currentContrast + ') saturate(' + this.currentSaturation + ') ';
        }
        if (filterString) {
          ctx.filter = filterString.trim();
        }

        const wasSeekingMode = this.isSeekingMode;
        const wasExportMode = this.isExportMode;
        this.isSeekingMode = false;
        this.isExportMode = true;

        const zoomState = this.getZoomStateAtTime(currentTime, this.exportZoomContext);
        const activeZoom = this.getZoomSegmentAtTime(currentTime);

        if (activeZoom || (zoomState && zoomState.isActive)) {
          this.applyExportZoomTransformation(ctx, zoomState, video, videoX, videoY, videoWidth, videoHeight);
        } else {
          this.drawVideoWithBorderRadius(ctx, video, videoX, videoY, videoWidth, videoHeight, this.currentBorderRadius);
        }

        ctx.filter = 'none';
        this.drawCursorOverlay(ctx, videoX, videoY, videoWidth, videoHeight, zoomState, currentTime, this.exportCursorState);

        this.isSeekingMode = wasSeekingMode;
        this.isExportMode = wasExportMode;
      }

      return true;
    } catch (error) {
      console.warn('Draw error:', error);
      return false;
    } finally {
      state.isDrawing = false;
    }
  }


  startAudioExportCaptureLoop({
    video,
    canvas,
    ctx,
    state,
    mediaRecorder,
    videoTrack,
    startTime,
    endTime,
    recordingDuration,
    recordingEndTimeout
  }) {
    const TARGET_FPS = 30;
    let audioContext = null;
    let silentOscillator = null;
    let silentGain = null;

    const stopAudioKeepAlive = () => {
      if (silentOscillator) {
        try { silentOscillator.stop(); } catch (e) { }
      }
      if (audioContext) {
        try { audioContext.close(); } catch (e) { }
      }
    };

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      silentOscillator = audioContext.createOscillator();
      silentGain = audioContext.createGain();
      silentGain.gain.value = 0.001;
      silentOscillator.connect(silentGain);
      silentGain.connect(audioContext.destination);
      silentOscillator.start();
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }

    const stopAndFinalize = () => {
      if (!state.isRecordingActive) {
        return;
      }

      state.isRecordingActive = false;
      stopAudioKeepAlive();
      clearTimeout(recordingEndTimeout);

      if (mediaRecorder.state === 'recording') {
        mediaRecorder.requestData();
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 200);
      }
    };

    const captureInterval = setInterval(() => {
      if (!state.isRecordingActive) {
        clearInterval(captureInterval);
        return;
      }

      const currentTime = video.currentTime;
      if (video.ended || currentTime >= endTime) {
        clearInterval(captureInterval);
        stopAndFinalize();
        return;
      }

      const timeSinceLastCapture = currentTime - state.lastCapturedTime;
      if (timeSinceLastCapture >= (1 / TARGET_FPS) - 0.001) {
        if (this.drawExportFrameToCanvas({ ctx, canvas, video, state })) {
          videoTrack.requestFrame();
          state.lastCapturedTime = currentTime;

          const progressPercent = Math.floor(((currentTime - startTime) / recordingDuration) * 100);
          if (progressPercent !== state.lastProgressLog) {
            state.lastProgressLog = progressPercent;
            this.updateStatusText('Exporting... ' + progressPercent + '%');
            this.updateExportProgress(progressPercent);
          }
        }
      }
    }, 16);

    let playbackStarted = false;
    const startPlayback = async () => {
      if (playbackStarted) {
        return;
      }
      playbackStarted = true;

      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      this.drawExportFrameToCanvas({ ctx, canvas, video, state });
      videoTrack.requestFrame();
      state.lastCapturedTime = startTime;

      this.updateStatusText('Exporting... 0%');
      this.updateExportProgress(0);

      await video.play();
    };

    video.addEventListener('seeked', () => {
      startPlayback().catch((error) => {
        console.error('Playback start failed:', error);
        stopAndFinalize();
      });
    }, { once: true });

    setTimeout(() => {
      if (!playbackStarted) {
        startPlayback().catch((error) => {
          console.error('Playback fallback start failed:', error);
          stopAndFinalize();
        });
      }
    }, 400);

    video.currentTime = startTime;
    video.playbackRate = 1.0;
  }


  finalizeCanvasRecording({ recordedChunks, mimeType, canvasTimeout, video, state, resolve, reject }) {
    state.isRecordingActive = false;

    setTimeout(() => {
      if (recordedChunks.length === 0) {
        clearTimeout(canvasTimeout);
        reject(new Error('No video data was recorded. This may be due to browser limitations. Please try recording a longer video or use a different browser.'));
        return;
      }

      const compositeBlob = new Blob(recordedChunks, { type: mimeType });
      if (compositeBlob.size === 0) {
        clearTimeout(canvasTimeout);
        reject(new Error('Video processing failed to produce output. Please try again.'));
        return;
      }

      URL.revokeObjectURL(video.src);
      clearTimeout(canvasTimeout);
      this.isExportMode = false;
      resolve(compositeBlob);
    }, 1000);
  }

  // Always use canvas preview now that we have default border radius

  needsCanvasPreview() {
    return true; // Always use canvas for consistent rendering
  }


  needsCanvasComposition() {
    const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;

    return (
      this.currentPadding > 0 ||
      this.currentBackground !== "#000000" ||
      this.currentBrightness !== 1 ||
      this.currentContrast !== 1 ||
      this.currentSaturation !== 1 ||
      this.currentBlur > 0 ||
      this.currentBorderRadius > 0 ||
      this.currentAspectRatio !== "native" ||
      hasZoomSegments
    );
  }


  needsFFmpegProcessing() {
    const needsFormatConversion = this.formatSelect.value !== "webm";
    const needsTrimming = this.trimStart > 0 || this.trimEnd < this.videoDuration;
    const needsGifConversion = this.formatSelect.value === "gif";

    return needsFormatConversion || needsTrimming || needsGifConversion;
  }


  checkFFmpegAvailability() {
    if (!this.isFFmpegLoaded) {
      ('FFmpeg not loaded - some export features may be limited');
      return false;
    }
    return true;
  }


  updateStatusText(message) {
    // Update status text if element exists
    const statusElement = document.getElementById('status-text');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.style.display = message ? 'block' : 'none';
    }

    // Also show notification for important status updates
    if (message.includes('Processing') || message.includes('Converting') || message.includes('Export')) {
      this.showInfo(message);
    }
  }

}

export { RecorderMediaExportMethodsPart8 };
