class RecorderMediaExportMethodsPart3 {
  onVideoSeeked() {
    ('Video seeked to:', this.formatTime(this.previewVideo.currentTime));

    // CRITICAL: Force complete zoom state reset when manually seeking
    const currentTime = this.previewVideo.currentTime;

    // Clear ALL transition state to force immediate state calculation
    this.transitionStartTime = null;
    this.transitionStartState = null;
    this.targetIntensity = null;
    this.targetPosition = null;

    // Set flag to indicate we're in seeking mode (not smooth playback)
    this.isSeekingMode = true;

    // Force immediate state calculation without transitions
    const activeZoom = this.getZoomSegmentAtTime(currentTime);

    if (activeZoom) {
      // Inside zoom segment - apply zoom immediately
      const si = activeZoom.intensity || 1.5;
      const sp = activeZoom.position || { x: 0.5, y: 0.5 };
      this.currentZoomState = {
        intensity: si,
        position: { ...sp },
        isActive: true
      };
      // Snap springs to match so playback resumes cleanly
      const springs = this.ensureZoomSprings(this);
      springs.scale.snap(si);
      springs.x.snap(sp.x);
      springs.y.snap(sp.y);
      springs.lastTime = currentTime;
    } else {
      // Outside zoom segment - reset to normal immediately
      this.currentZoomState = {
        intensity: 1,
        position: { x: 0.5, y: 0.5 },
        isActive: false
      };
      // Snap springs to 100% view
      const springs = this.ensureZoomSprings(this);
      springs.scale.snap(1);
      springs.x.snap(0.5);
      springs.y.snap(0.5);
      springs.lastTime = currentTime;
    }

    // === SCREEN STUDIO CURSOR PREMIUM === Snap cursor springs on seek to prevent flyback
    const cursorSprings = this.ensureCursorSprings(this);
    const cursorDataSource = (this.rawCursorData && this.rawCursorData.length > 0)
      ? this.rawCursorData : this.cursorData;
    if (cursorDataSource && cursorDataSource.length > 0) {
      const seekCursor = this.cursorProcessor.getCursorAtTime(cursorDataSource, currentTime * 1000);
      if (seekCursor) {
        const videoWidth = this.previewVideo.videoWidth || 1920;
        const videoHeight = this.previewVideo.videoHeight || 1080;
        const windowWidth = seekCursor.windowWidth || seekCursor.viewportWidth || videoWidth;
        const windowHeight = seekCursor.windowHeight || seekCursor.viewportHeight || videoHeight;
        const canvasDimensions = this.calculateAspectRatioDimensions(videoWidth, videoHeight, this.currentAspectRatio);
        const videoX = (this.currentPadding || 0) + (canvasDimensions.width - videoWidth) / 2;
        const videoY = (this.currentPadding || 0) + (canvasDimensions.height - videoHeight) / 2;
        const snapX = videoX + (seekCursor.x * (videoWidth / windowWidth));
        const snapY = videoY + (seekCursor.y * (videoHeight / windowHeight));
        cursorSprings.x.snap(snapX);
        cursorSprings.y.snap(snapY);
      }
    }
    cursorSprings.scale.snap(1);
    cursorSprings.rotation.snap(0);
    cursorSprings.lastTime = null; // Reset so next frame computes fresh dt
    // Also reset the smoothCursor position to match snapped springs
    this.smoothCursor.x = cursorSprings.x.position;
    this.smoothCursor.y = cursorSprings.y.position;
    this.cursorScale = 1;
    this.cursorRotation = 0;
    this.lastUpdateTime = undefined; // Force dt recalculation

    ('Force reset zoom state after seek:', {
      time: this.formatTime(currentTime),
      isActive: this.currentZoomState.isActive,
      intensity: this.currentZoomState.intensity.toFixed(2),
      hasActiveSegment: !!activeZoom
    });

    // Force immediate canvas render with new zoom state
    this.renderToCanvas();

    // Clear seeking mode flag after a short delay to allow smooth transitions to resume
    setTimeout(() => {
      this.isSeekingMode = false;
    }, 100);

    // Update playback indicator and other timeline UI
    this.updatePlaybackIndicator();
  }


  onVideoPlay() {
    this.isPlaying = true;
    this.playPauseBtn.innerHTML = `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        `;

    // Always use canvas for rendering with effects
    this.previewVideo.style.display = 'none';
    this.previewCanvas.style.display = 'block';
    this.startCanvasRendering();
  }


  onVideoPause() {
    this.isPlaying = false;
    this.playPauseBtn.innerHTML = `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
            </svg>
        `;

    this.stopCanvasRendering();

    // Always show canvas and render current frame
    this.previewVideo.style.display = 'none';
    this.previewCanvas.style.display = 'block';
    this.renderToCanvas();
  }


  onVideoEnded() {
    this.isPlaying = false;
    this.onVideoPause();
    // Stop canvas rendering
    this.stopCanvasRendering();
  }


  togglePlayPause() {
    if (!this.previewVideo.src) return;

    if (this.isPlaying) {
      this.previewVideo.pause();
    } else {
      this.previewVideo.play();
    }
  }


  rewind() {
    if (!this.previewVideo.src) return;
    this.previewVideo.currentTime = Math.max(
      0,
      this.previewVideo.currentTime - 10
    );
  }


  forward() {
    if (!this.previewVideo.src) return;
    this.previewVideo.currentTime = Math.min(
      this.videoDuration,
      this.previewVideo.currentTime + 10
    );
  }


  toggleMute() {
    if (!this.previewVideo.src) return;

    this.previewVideo.muted = !this.previewVideo.muted;

    this.volumeBtn.innerHTML = this.previewVideo.muted
      ? `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>
            </svg>
        `
      : `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
            </svg>
        `;
  }


  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Use canvas for fullscreen instead of video wrapper
      this.previewCanvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }


  updateProgressBar() {
    if (!this.videoDuration || this.isDraggingProgress) return;

    const percentage = (this.currentTime / this.videoDuration) * 100;
    this.progressFill.style.width = `${percentage}%`;
    this.progressHandle.style.left = `${percentage}%`;
  }


  seekToProgressPosition(event) {
    if (!this.videoDuration) return;

    const rect = this.progressBarContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetTime = percentage * this.videoDuration;

    this.previewVideo.currentTime = Math.max(
      0,
      Math.min(targetTime, this.videoDuration)
    );

    // CRITICAL: Force immediate canvas render for paused video
    // This ensures zoom state changes are visible immediately after progress bar click
    if (!this.isPlaying) {
      // Force seeking mode and immediate zoom state update
      this.isSeekingMode = true;

      // Force zoom state recalculation at new position
      const currentTime = this.previewVideo.currentTime;
      const activeZoom = this.getZoomSegmentAtTime(currentTime);

      if (activeZoom) {
        this.currentZoomState = {
          intensity: activeZoom.intensity || 1.5,
          position: activeZoom.position || { x: 0.5, y: 0.5 },
          isActive: true
        };
      } else {
        this.currentZoomState = {
          intensity: 1,
          position: { x: 0.5, y: 0.5 },
          isActive: false
        };
      }

      // Force immediate canvas render
      this.renderToCanvas();

      // Clear seeking mode after render
      setTimeout(() => {
        this.isSeekingMode = false;
      }, 50);
    }
  }


  startProgressDrag(event) {
    event.preventDefault();
    this.isDraggingProgress = true;
    document.body.style.userSelect = "none";
  }


  initializeTimeline() {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      (
        "Invalid video duration, timeline not initialized:",
        this.videoDuration
      );
      return;
    }

    // Get timeline width
    this.timelineWidth = this.timelineTrack.offsetWidth;

    // Generate time markers
    this.generateTimeMarkers();

    // Position trim handles
    this.updateTrimHandles();

    // Update selected range overlay
    this.updateSelectedRangeOverlay();

    ("Timeline initialized with duration:", this.videoDuration);
  }


  generateTimeMarkers() {
    this.timelineMarkers.innerHTML = "";

    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const markerInterval = Math.max(1, Math.floor(this.videoDuration / 10));
    const markerCount = Math.floor(this.videoDuration / markerInterval);

    for (let i = 0; i <= markerCount; i++) {
      const time = i * markerInterval;
      const position = (time / this.videoDuration) * 100;

      const marker = document.createElement("div");
      marker.className = "timeline-marker";
      marker.style.left = `${position}%`;
      marker.textContent = this.formatTime(time);

      this.timelineMarkers.appendChild(marker);
    }
  }


  updatePlaybackIndicator() {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const currentTime = this.previewVideo.currentTime;
    const position = (currentTime / this.videoDuration) * 100;

    this.playbackIndicator.style.left = `${position}%`;

    // Update zoom timeline synchronization
    this.syncZoomTimeline();
  }


  syncZoomTimeline() {
    // Ensure zoom segments are visible and properly synchronized
    this.renderZoomSegments();

    // Enhanced highlighting with smooth transition awareness
    const currentTime = this.previewVideo.currentTime;
    const activeZoom = this.getZoomSegmentAtTime(currentTime);
    // === FIX: DO NOT call getZoomStateAtTime here! It advances the spring.
    // Only read the already-computed state for UI highlighting.
    const zoomState = this.currentZoomState;

    // Remove previous highlights
    const zoomSegments = this.zoomTrack.querySelectorAll('.zoom-segment');
    zoomSegments.forEach(segment => {
      segment.classList.remove('active', 'transitioning');
    });

    // Highlight active zoom segment or transitioning segment
    if (activeZoom) {
      const activeSegmentElement = this.zoomTrack.querySelector(`[data-segment-id="${activeZoom.id}"]`);
      if (activeSegmentElement) {
        activeSegmentElement.classList.add('active');

        // Add transitioning class if we're in a smooth transition
        if (zoomState && zoomState.isActive && this.zoomAnimationStartState) {
          activeSegmentElement.classList.add('transitioning');
        }
      }

      // Update right sidebar with the selected segment
      this.updateZoomPanelForSegmentRight(activeZoom);
    } else if (zoomState && zoomState.isActive) {
      // No active segment but still transitioning - could be zooming out
      // Find the most recent segment that might be transitioning out
      const recentSegments = this.zoomSegments.filter(seg => seg.endTime <= currentTime + 0.1);
      if (recentSegments.length > 0) {
        const lastSegment = recentSegments[recentSegments.length - 1];
        const lastSegmentElement = this.zoomTrack.querySelector(`[data-segment-id="${lastSegment.id}"]`);
        if (lastSegmentElement) {
          lastSegmentElement.classList.add('transitioning');
        }
      }
    } else {
      // No active zoom segment - show export & advanced panel
      this.showNoZoomMessageRight();
    }
  }


  seekToTimelinePosition(event) {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const rect = this.timelineTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percentage * this.videoDuration;

    this.previewVideo.currentTime = targetTime;

    // CRITICAL: Force immediate canvas render for paused video
    // This ensures zoom state changes are visible immediately after timeline click
    if (!this.isPlaying) {
      // Force seeking mode and immediate zoom state update
      this.isSeekingMode = true;

      // Force zoom state recalculation at new position
      const currentTime = this.previewVideo.currentTime;
      const activeZoom = this.getZoomSegmentAtTime(currentTime);

      if (activeZoom) {
        this.currentZoomState = {
          intensity: activeZoom.intensity || 1.5,
          position: activeZoom.position || { x: 0.5, y: 0.5 },
          isActive: true
        };
      } else {
        this.currentZoomState = {
          intensity: 1,
          position: { x: 0.5, y: 0.5 },
          isActive: false
        };
      }

      // Force immediate canvas render
      this.renderToCanvas();

      // Clear seeking mode after render
      setTimeout(() => {
        this.isSeekingMode = false;
      }, 50);
    }

    ("Seeking to timeline position:", targetTime, "seconds");
  }


  startDragging(event, handle) {
    event.preventDefault();
    this.isDragging = true;
    this.dragHandle = handle;

    // Add dragging class for visual feedback
    if (handle === "left") {
      this.trimHandleLeft.classList.add("dragging");
    } else {
      this.trimHandleRight.classList.add("dragging");
    }

    // Prevent text selection
    document.body.style.userSelect = "none";
  }

}

export { RecorderMediaExportMethodsPart3 };
