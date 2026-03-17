class RecorderMediaExportMethodsPart9 {
  async waitForVideoMetadata() {
    return new Promise((resolve, reject) => {
      if (!this.previewVideo) {
        reject(new Error("Preview video element not found"));
        return;
      }

      ("=== Video Metadata Validation Debug ===");
      ("Video readyState:", this.previewVideo.readyState);
      ("Video duration (raw):", this.previewVideo.duration);
      ("Recording blob size:", this.recordingBlob?.size || 0);
      ("Recorded duration fallback:", this.getRecordedDuration());
      ("=======================================");

      // Enhanced validation with multiple fallback strategies
      const validateDuration = (source = "unknown") => {
        const duration = this.previewVideo.duration;
        (`Duration validation from ${source}:`, duration);

        // Check for valid finite duration
        if (Number.isFinite(duration) && duration > 0 && duration !== Infinity) {
          this.videoDuration = duration;
          ("�S Valid video duration set:", this.videoDuration, "from", source);
          return true;
        }

        // Try fallback to recorded duration
        const recordedDuration = this.getRecordedDuration();
        (`Trying recorded duration fallback:`, recordedDuration);

        if (recordedDuration > 0 && Number.isFinite(recordedDuration)) {
          this.videoDuration = recordedDuration;
          ("�S Using recorded duration fallback:", this.videoDuration);
          return true;
        }

        // Last resort: use a reasonable default based on blob size
        if (this.recordingBlob && this.recordingBlob.size > 0) {
          // Estimate duration based on blob size (rough approximation)
          const estimatedDuration = Math.max(1, Math.min(300, this.recordingBlob.size / (1024 * 1024))); // 1MB per second rough estimate
          this.videoDuration = estimatedDuration;
          ("�a� Using estimated duration fallback:", this.videoDuration);
          return true;
        }

        ("�S All duration validation methods failed");
        return false;
      };

      // Check if metadata is already loaded
      if (this.previewVideo.readyState >= 1) { // HAVE_METADATA
        ("Video metadata already loaded");
        if (validateDuration("already-loaded")) {
          resolve();
        } else {
          reject(new Error("Video duration validation failed. Recording may be corrupted. Please try recording again."));
        }
        return;
      }

      ("Waiting for video metadata to load...");

      const timeout = setTimeout(() => {
        cleanup();
        ("Metadata loading timeout - attempting fallback validation");

        // Final attempt with recorded duration
        const recordedDuration = this.getRecordedDuration();
        if (recordedDuration > 0) {
          this.videoDuration = recordedDuration;
          ("Using recorded duration after timeout:", this.videoDuration);
          resolve();
        } else {
          reject(new Error("Timeout waiting for video metadata (20 seconds). Please try recording again."));
        }
      }, 20000); // Increased timeout to 20 seconds

      const cleanup = () => {
        clearTimeout(timeout);
        this.previewVideo.removeEventListener('loadedmetadata', onLoadedMetadata);
        this.previewVideo.removeEventListener('error', onError);
        this.previewVideo.removeEventListener('loadeddata', onLoadedData);
        this.previewVideo.removeEventListener('durationchange', onDurationChange);
      };

      const onLoadedMetadata = () => {
        ("Video metadata loaded via loadedmetadata event");
        if (validateDuration("loadedmetadata")) {
          cleanup();
          resolve();
        } else {
          ("Duration invalid after loadedmetadata, waiting for other events...");
        }
      };

      const onLoadedData = () => {
        if (this.previewVideo.readyState >= 2) { // HAVE_CURRENT_DATA
          ("Video data loaded via loadeddata event");
          if (validateDuration("loadeddata")) {
            cleanup();
            resolve();
          }
        }
      };

      const onDurationChange = () => {
        ("Duration changed event fired");
        if (validateDuration("durationchange")) {
          cleanup();
          resolve();
        }
      };

      const onError = (error) => {
        ("Video error during metadata loading:", error);
        cleanup();

        // Try fallback before rejecting
        const recordedDuration = this.getRecordedDuration();
        if (recordedDuration > 0) {
          this.videoDuration = recordedDuration;
          ("Using recorded duration after video error:", this.videoDuration);
          resolve();
        } else {
          reject(new Error("Failed to load video metadata and no fallback available: " + (error.message || "Unknown error")));
        }
      };

      // Add all event listeners
      this.previewVideo.addEventListener('loadedmetadata', onLoadedMetadata);
      this.previewVideo.addEventListener('error', onError);
      this.previewVideo.addEventListener('loadeddata', onLoadedData);
      this.previewVideo.addEventListener('durationchange', onDurationChange);

      // Force reload if necessary
      if (this.previewVideo.readyState === 0) {
        ("Video not started loading, triggering load...");
        try {
          this.previewVideo.load();
        } catch (loadError) {
          ("Failed to trigger video load:", loadError);
        }
      }

      // Additional fallback: check duration periodically
      let checkCount = 0;
      const durationChecker = setInterval(() => {
        checkCount++;
        (`Duration check attempt ${checkCount}:`, this.previewVideo.duration);

        if (validateDuration(`periodic-check-${checkCount}`)) {
          clearInterval(durationChecker);
          cleanup();
          resolve();
        } else if (checkCount >= 10) { // Stop after 10 attempts (5 seconds)
          clearInterval(durationChecker);
          ("Periodic duration checks failed");
        }
      }, 500); // Check every 500ms

      // Clear interval on cleanup
      const originalCleanup = cleanup;
      cleanup = () => {
        clearInterval(durationChecker);
        originalCleanup();
      };
    });
  }

  // Cleanup method to prevent memory leaks

  cleanup() {
    // Stop canvas rendering
    this.stopCanvasRendering();

    // Stop zoom animations
    if (this.zoomAnimationFrame) {
      cancelAnimationFrame(this.zoomAnimationFrame);
      this.zoomAnimationFrame = null;
    }

    // Clear zoom transition state
    this.zoomTransitionStartTime = null;
    this.zoomTransitionStartState = null;
    this.zoomTransitionTargetState = null;

    // Clear cursor data
    this.cursorData = [];
    this.cursorDataIndex = 0;

    // Clear background image cache
    this.backgroundImageCache = null;
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;

    // Revoke object URLs
    if (this.previewVideo.src && this.previewVideo.src.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewVideo.src);
    }

    // Clear video source
    this.previewVideo.src = '';

    ('Cleanup completed');
  }

  // Reset export-specific state before each export to prevent stale data issues

  resetExportState() {
    console.log('�x�� Resetting export state...');
    
    // Reset export mode flag
    this.isExportMode = false;
    
    // Clear export cursor state
    this.exportCursorState = null;
    
    // Clear export blur cache
    this.exportBlurredBackgroundCache = null;
    
    // Clear any pending FFmpeg files
    if (this.ffmpeg && this.isFFmpegLoaded) {
      try {
        // Attempt to clean up any leftover files in FFmpeg's virtual filesystem
        const filesToClean = ['input.webm', 'output.mp4', 'output.webm', 'output.gif'];
        for (const file of filesToClean) {
          try {
            this.ffmpeg.deleteFile(file);
          } catch (e) {
            // File may not exist, ignore error
          }
        }
      } catch (e) {
        console.log('FFmpeg cleanup skipped:', e.message);
      }
    }
    
    console.log('�S& Export state reset complete');
  }
}

export { RecorderMediaExportMethodsPart9 };
