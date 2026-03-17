class RecorderMediaExportMethodsPart2 {
  finalizeBlobCreation() {
    // Create blob from recorded chunks with validation
    const mimeType = this.mediaRecorder?.mimeType || "video/webm";
    ("Creating blob with mime type:", mimeType);
    ("Final chunks count:", this.recordedChunks.length);

    if (this.recordedChunks.length === 0) {
      ("No recorded chunks available!");
      this.showError("Recording failed: No data was captured. Please try recording again.");
      this.recordAgain();
      return;
    }

    this.recordingBlob = new Blob(this.recordedChunks, { type: mimeType });
    ("Recording blob created:", {
      size: this.recordingBlob.size,
      type: this.recordingBlob.type,
      sizeMB: (this.recordingBlob.size / 1024 / 1024).toFixed(2)
    });

    // Validate blob size
    if (this.recordingBlob.size === 0) {
      ("Created blob has zero size!");
      this.showError("Recording failed: Captured video is empty. Please try recording again.");
      this.recordAgain();
      return;
    }

    // Create object URL for preview with enhanced error handling
    try {
      const videoURL = URL.createObjectURL(this.recordingBlob);
      ("Video URL created:", videoURL);

      // Set up video with proper event handling
      this.previewVideo.src = videoURL;

      // Add one-time load handler to ensure video is ready
      const onVideoReady = () => {
        ("Preview video is ready for playback");
        // Update file info after video is ready
        this.updateFileInfo();
        // Show preview editor
        this.showPreviewEditor();
      };

      const onVideoError = (error) => {
        ("Preview video error:", error);
        this.showError("Failed to load recorded video. The recording may be corrupted.");
      };

      // Listen for when video can play
      this.previewVideo.addEventListener('canplay', onVideoReady, { once: true });
      this.previewVideo.addEventListener('error', onVideoError, { once: true });

      // Fallback: if video loads metadata but not data
      this.previewVideo.addEventListener('loadedmetadata', () => {
        ("Video metadata loaded, duration:", this.previewVideo.duration);
        // If duration is available, we can show the editor even if video can't play
        if (this.previewVideo.duration && Number.isFinite(this.previewVideo.duration)) {
          setTimeout(() => {
            if (this.previewEditor.style.display !== 'block') {
              ("Showing editor after metadata load");
              onVideoReady();
            }
          }, 1000);
        }
      }, { once: true });

    } catch (error) {
      ("Failed to create video URL:", error);
      this.showError("Failed to create video preview. Please try recording again.");
      this.recordAgain();
      return;
    }

    ("Recording processing complete");
  }


  onVideoLoaded() {
    ("Video metadata loaded");

    // Enhanced duration validation
    const duration = this.previewVideo.duration;
    ("Raw video duration:", duration);

    if (Number.isFinite(duration) && duration > 0) {
      this.videoDuration = duration;
      ("Valid video duration set:", this.videoDuration);
    } else {
      ("Invalid video duration detected, attempting fallback");
      // Try to get duration from recorded time
      const recordedDuration = this.getRecordedDuration();
      if (recordedDuration > 0) {
        this.videoDuration = recordedDuration;
        ("Using recorded duration as fallback:", this.videoDuration);
      } else {
        this.videoDuration = 10; // Minimal fallback
        ("Using minimal fallback duration:", this.videoDuration);
      }
    }

    this.trimStart = 0;
    this.trimEnd = this.videoDuration;

    // Update duration displays
    this.videoDurationDisplay.textContent = this.formatTime(this.videoDuration);
    this.totalTimeDisplay.textContent = this.formatTime(this.videoDuration);
    this.currentTimeDisplay.textContent = this.formatTime(0);

    // Initialize timeline
    this.initializeTimeline();

    // Initialize zoom functionality now that we have video duration
    ('Initializing zoom functionality after duration is set:', this.videoDuration);
    this.initializeZoomFunctionality();

    // Update selected duration
    this.updateSelectedDuration();

    // Hide default video controls and always show canvas immediately
    this.previewVideo.controls = false;
    this.previewVideo.style.display = 'none';
    this.previewCanvas.style.display = 'block';

    // Immediately render the first frame to canvas for instant display
    this.renderToCanvas();

    // Initialize zoom functionality after video is ready
    setTimeout(() => {
      this.initializeZoomFunctionality();
    }, 500); // Give some time for DOM to be ready

    // Ensure video is loaded with current data and render first frame
    const renderFirstFrame = () => {
      if (this.previewVideo.readyState >= 2) {
        // Ensure video is at beginning and render first frame
        this.previewVideo.currentTime = 0;
        // Wait a moment for seek to complete, then render
        setTimeout(() => {
          this.renderToCanvas();
          ('First frame rendered to canvas');
        }, 100);
      } else {
        // Wait for video to have current data
        ('Waiting for video data to render first frame...');
        const checkReady = () => {
          if (this.previewVideo.readyState >= 2) {
            this.previewVideo.currentTime = 0;
            setTimeout(() => {
              this.renderToCanvas();
              ('First frame rendered after waiting for video data');
            }, 100);
          } else {
            setTimeout(checkReady, 50); // Check every 50ms
          }
        };
        setTimeout(checkReady, 50);
      }
    };

    // Try to render first frame immediately or wait for video data
    renderFirstFrame();

    // Also listen for seeked event to ensure frame is available after seek
    this.previewVideo.addEventListener('seeked', () => {
      ('Video seeked event fired, rendering frame');
      this.renderToCanvas();
    }, { once: true });

    // Also listen for loadeddata event as backup
    this.previewVideo.addEventListener('loadeddata', () => {
      ('Video loadeddata event fired, rendering frame');
      this.renderToCanvas();
    }, { once: true });

    // Update zoom position preview aspect ratio to match video
    this.updateZoomPreviewAspectRatio();
  }

  // Update zoom position preview aspect ratio to match video dimensions

  updateZoomPreviewAspectRatio() {
    if (!this.previewVideo || !this.previewVideo.videoWidth || !this.previewVideo.videoHeight) return;

    const videoWidth = this.previewVideo.videoWidth;
    const videoHeight = this.previewVideo.videoHeight;
    const aspectRatio = videoWidth / videoHeight;

    ('Updating zoom preview aspect ratio:', videoWidth, 'x', videoHeight, 'ratio:', aspectRatio);

    // Update both preview elements with the correct aspect ratio
    if (this.zoomPositionPreview) {
      this.zoomPositionPreview.style.aspectRatio = `${videoWidth} / ${videoHeight}`;
    }
    if (this.zoomPositionPreviewRight) {
      this.zoomPositionPreviewRight.style.aspectRatio = `${videoWidth} / ${videoHeight}`;
    }
  }


  initializeZoomFunctionality() {
    console.log('�x� [INIT] =========================');
    console.log('�x� [INIT] initializeZoomFunctionality called');
    console.log('�x� [INIT] videoDuration:', this.videoDuration, 'typeof:', typeof this.videoDuration);
    console.log('�x� [INIT] zoomTrack element:', !!this.zoomTrack);
    console.log('�x� [INIT] Current zoom segments:', this.zoomSegments?.length || 0);

    // Don't load saved zoom data - start fresh
    // this.loadZoomData();

    // Show empty message initially
    this.showNoZoomMessage();

    // Check if video duration is ready - if not, retry later
    if (!this.videoDuration || this.videoDuration <= 0) {
      console.log('�x� [INIT] �a�️ Video duration not ready, will retry in 1 second');
      // Retry after 1 second
      setTimeout(() => {
        if (this.videoDuration > 0) {
          console.log('�x� [INIT] Retrying with duration:', this.videoDuration);
          this.initializeZoomFunctionality();
        } else {
          console.log('�x� [INIT] �R Video duration still not ready after retry');
        }
      }, 1000);
      return;
    }

    // Ensure zoom track is ready for interaction
    if (this.zoomTrack && this.videoDuration > 0) {
      console.log('�x� [INIT] �S& Zoom functionality ready!');

      // Make sure the zoom track is clickable
      this.zoomTrack.style.cursor = 'pointer';
      this.zoomTrack.style.pointerEvents = 'auto';

      // Add a test click handler to verify events are working
      this.zoomTrack.addEventListener('click', (e) => {
        console.log('�x� [INIT-LISTENER] ZOOM TRACK CLICKED - capture phase event');
        console.log('�x� [INIT-LISTENER] videoDuration at click time:', this.videoDuration);
      }, true); // Use capture phase to ensure it's called

      console.log('�x� [INIT] Zoom track configured for interaction');

      // Re-render any existing zoom segments
      this.renderZoomSegments();
    } else {
      console.log('�x� [INIT] �R Zoom track or video duration not ready');
    }
  }


  onVideoDurationChange() {
    ("Video duration changed event fired");
    const duration = this.previewVideo.duration;
    ("New duration from event:", duration);

    if (
      Number.isFinite(duration) &&
      duration > 0 &&
      duration !== this.videoDuration
    ) {
      this.videoDuration = duration;
      this.trimEnd = duration;

      // Update displays
      this.videoDurationDisplay.textContent = this.formatTime(
        this.videoDuration
      );
      this.totalTimeDisplay.textContent = this.formatTime(this.videoDuration);

      // Reinitialize timeline with correct duration
      this.initializeTimeline();
      this.updateSelectedDuration();

      // Reinitialize zoom functionality with new duration
      ('Reinitializing zoom functionality after duration change:', this.videoDuration);
      this.initializeZoomFunctionality();

      ("Video duration updated to:", this.videoDuration);
    }
  }


  getRecordedDuration() {
    // Enhanced duration calculation with multiple methods
    ("=== Calculating Recorded Duration ===");

    // Method 1: Calculate from recording time
    if (this.startTime) {
      const endTime = Date.now();
      const totalRecordingTime = (endTime - this.startTime - this.pausedTime) / 1000;
      const calculatedDuration = Math.max(0, totalRecordingTime);
      ("Calculated from recording time:", calculatedDuration, "seconds");

      if (calculatedDuration > 0 && calculatedDuration < 3600) { // Sanity check: less than 1 hour
        ("�S Using calculated duration:", calculatedDuration);
        return calculatedDuration;
      }
    }

    // Method 2: Estimate from blob size (rough approximation)
    if (this.recordingBlob && this.recordingBlob.size > 0) {
      // Very rough estimate: ~1MB per second for typical screen recordings
      const estimatedDuration = Math.max(1, this.recordingBlob.size / (1024 * 1024));
      ("Estimated from blob size:", estimatedDuration, "seconds");

      if (estimatedDuration > 0 && estimatedDuration < 3600) { // Sanity check
        ("�S Using blob size estimation:", estimatedDuration);
        return estimatedDuration;
      }
    }

    // Method 3: Use MediaRecorder timing if available
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      // If recording is still active, use current time
      const currentDuration = (Date.now() - this.startTime - this.pausedTime) / 1000;
      if (currentDuration > 0) {
        ("�S Using current recording time:", currentDuration);
        return currentDuration;
      }
    }

    ("�a� No reliable duration calculation method available");
    ("===================================");
    return 0;
  }


  onVideoTimeUpdate() {
    this.currentTime = this.previewVideo.currentTime;
    this.currentTimeDisplay.textContent = this.formatTime(this.currentTime);

    // Update progress bar
    this.updateProgressBar();

    // Update timeline playbook indicator
    this.updatePlaybackIndicator();

    // === FIX: DO NOT call getZoomStateAtTime here! renderToCanvas (line below)
    // already calls it. Calling it twice per frame double-steps the spring.

    // Only render to canvas when not playing (for seeking) to prevent excessive rendering
    if (!this.isPlaying) {
      this.renderToCanvas();
    }

    // Don't start continuous rendering here - it causes performance issues
    // Continuous rendering is handled in onVideoPlay()
  }

}

export { RecorderMediaExportMethodsPart2 };
