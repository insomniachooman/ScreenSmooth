class RecorderZoomMethodsPart4 {
  updateZoomPanelForSegment(segment) {
    // Hide empty message and show editing controls (left sidebar)
    if (this.noZoomMessage) {
      this.noZoomMessage.style.display = 'none';
    }
    if (this.zoomEditingControls) {
      this.zoomEditingControls.style.display = 'block';
    }

    // Update zoom info (left sidebar)
    if (this.zoomTiming) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTiming.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Temporarily remove event listeners to prevent triggering updates
    const originalIntensityHandler = this.zoomIntensitySlider?.oninput;
    const originalModeHandlers = [];

    // Store original mode handlers
    this.zoomModeRadios.forEach((radio, index) => {
      originalModeHandlers[index] = radio.onchange;
      radio.onchange = null;
    });

    // Update controls with segment data WITHOUT triggering events (left sidebar)
    if (this.zoomIntensitySlider) {
      this.zoomIntensitySlider.oninput = null;
      // Ensure we use the segment's actual intensity value (minimum 1.25 for visible zoom)
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySlider.value = segmentIntensity;
    }
    if (this.zoomIntensityValue) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValue.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update zoom mode radio buttons WITHOUT triggering events (left sidebar)
    this.zoomModeRadios.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update manual position if applicable (left sidebar)
    if (segment.mode === 'manual' && this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicator.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide manual controls based on segment mode (left sidebar)
    if (this.manualZoomControls) {
      this.manualZoomControls.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // ALSO UPDATE RIGHT SIDEBAR CONTROLS
    // Update right sidebar zoom info
    if (this.zoomTimingRight) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTimingRight.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Update right sidebar controls with segment data WITHOUT triggering events
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.oninput = null;
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySliderRight.value = segmentIntensity;
    }
    if (this.zoomIntensityValueRight) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValueRight.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update right sidebar zoom mode radio buttons
    this.zoomModeRadiosRight.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update right sidebar manual position if applicable
    if (segment.mode === 'manual' && this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide right sidebar manual controls
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // Restore event listeners after a brief delay
    setTimeout(() => {
      if (this.zoomIntensitySlider) {
        this.zoomIntensitySlider.oninput = originalIntensityHandler;
      }
      this.zoomModeRadios.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });

      // Restore right sidebar event listeners
      if (this.zoomIntensitySliderRight) {
        this.zoomIntensitySliderRight.oninput = this.zoomIntensitySliderRight.oninput;
      }
      this.zoomModeRadiosRight.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });
    }, 10);

    // Update zoom position preview with video frame at segment start time
    this.updateZoomPositionPreviewWithFrame(segment);

    ('Updated zoom panel for segment:', segment.id);
  }

  // Capture and display video frame at segment start time in zoom position preview

  updateZoomPositionPreviewWithFrame(segment) {
    if (!this.previewVideo || !this.previewVideo.src || !segment) return;

    const targetTime = segment.startTime;
    const video = this.previewVideo;

    // Create a temporary canvas to capture the frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate scaled dimensions for preview thumbnail (max 320px width)
    const maxPreviewWidth = 320;
    const videoWidth = video.videoWidth || 1920;
    const videoHeight = video.videoHeight || 1080;
    const scaleFactor = Math.min(1, maxPreviewWidth / videoWidth);

    canvas.width = videoWidth * scaleFactor;
    canvas.height = videoHeight * scaleFactor;

    // Store current video time
    const currentTime = video.currentTime;

    // Seek to segment start time
    const captureFrame = () => {
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      try {
        const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Update both position preview elements (left and right sidebars)
        if (this.zoomPositionPreview) {
          this.zoomPositionPreview.style.backgroundImage = `url(${frameDataUrl})`;
          this.zoomPositionPreview.classList.add('has-video-frame');
        }
        if (this.zoomPositionPreviewRight) {
          this.zoomPositionPreviewRight.style.backgroundImage = `url(${frameDataUrl})`;
          this.zoomPositionPreviewRight.classList.add('has-video-frame');
        }

        ('Updated zoom position preview with frame at time:', targetTime);

        // Update aspect ratio based on segment's screen dimensions
        if (segment.screenDimensions) {
          const { width, height } = segment.screenDimensions;
          const aspectRatio = width / height;

          if (this.zoomPositionPreview) {
            this.zoomPositionPreview.style.aspectRatio = `${width} / ${height}`;
          }
          if (this.zoomPositionPreviewRight) {
            this.zoomPositionPreviewRight.style.aspectRatio = `${width} / ${height}`;
          }

          ('Updated zoom preview aspect ratio to match screen:', width, 'x', height, 'ratio:', aspectRatio);
        }
      } catch (e) {
        console.error('Error capturing video frame:', e);
      }

      // Restore original video time
      video.currentTime = currentTime;
    };

    // Set up one-time seeked event listener
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      // Small delay to ensure frame is ready
      setTimeout(captureFrame, 50);
    };

    video.addEventListener('seeked', onSeeked);

    // Seek to target time
    video.currentTime = targetTime;
  }


  updateZoomPanelForSegmentRight(segment) {
    // Switch to zoom controls panel when a segment is selected
    this.showZoomControlsPanel();

    // Hide empty message and show editing controls
    if (this.noZoomMessageRight) {
      this.noZoomMessageRight.style.display = "none";
    }
    if (this.zoomEditingControlsRight) {
      this.zoomEditingControlsRight.style.display = "block";
    }

    // Update zoom info
    if (this.zoomTimingRight) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTimingRight.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Temporarily remove event listeners to prevent triggering updates
    const originalIntensityHandler = this.zoomIntensitySliderRight?.oninput;
    const originalModeHandlers = [];

    // Store original mode handlers
    this.zoomModeRadiosRight.forEach((radio, index) => {
      originalModeHandlers[index] = radio.onchange;
      radio.onchange = null;
    });

    // Update controls with segment data WITHOUT triggering events
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.oninput = null;
      // Ensure we use the segment's actual intensity value (minimum 1.25 for visible zoom)
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySliderRight.value = segmentIntensity;
    }
    if (this.zoomIntensityValueRight) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValueRight.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update zoom mode radio buttons WITHOUT triggering events
    this.zoomModeRadiosRight.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update manual position if applicable
    if (segment.mode === 'manual' && this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide manual controls based on segment mode
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // Restore event listeners after a brief delay
    setTimeout(() => {
      if (this.zoomIntensitySliderRight) {
        this.zoomIntensitySliderRight.oninput = originalIntensityHandler;
      }
      this.zoomModeRadiosRight.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });
    }, 10);

    ('Updated right sidebar zoom panel for segment:', segment.id);
  }


  showNoZoomMessageRight() {
    // Show empty message and hide editing controls
    if (this.noZoomMessageRight) {
      this.noZoomMessageRight.style.display = 'block';
    }
    if (this.zoomEditingControlsRight) {
      this.zoomEditingControlsRight.style.display = 'none';
    }

    // Switch back to export & advanced panel
    this.showExportAdvancedPanel();

    ('Showing no zoom message in right sidebar');
  }

  showNoZoomMessage() {
    // Show empty message and hide editing controls
    if (this.noZoomMessage) {
      this.noZoomMessage.style.display = 'block';
    }
    if (this.zoomEditingControls) {
      this.zoomEditingControls.style.display = 'none';
    }

    // Clear selection
    this.selectedZoomSegment = null;
    const prevSelected = this.zoomTrack?.querySelector('.zoom-segment.selected');
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }

    // Also show no zoom message in right sidebar
    this.showNoZoomMessageRight();
  }


  startZoomDrag(segment, handle, event) {
    this.isDraggingZoom = true;
    this.zoomDragHandle = handle;
    this.selectedZoomSegment = segment;

    const trackRect = this.zoomTrack.getBoundingClientRect();

    const handleMouseMove = (e) => {
      if (!this.isDraggingZoom) return;

      const mouseX = e.clientX - trackRect.left;
      const percentage = Math.max(0, Math.min(1, mouseX / trackRect.width));
      const time = percentage * this.videoDuration;

      if (handle === 'left') {
        segment.startTime = Math.max(0, Math.min(time, segment.endTime - 0.1));
      } else {
        segment.endTime = Math.max(segment.startTime + 0.1, Math.min(time, this.videoDuration));
      }

      this.renderZoomSegments();
      this.selectZoomSegment(segment);
    };

    const handleMouseUp = () => {
      this.isDraggingZoom = false;
      this.zoomDragHandle = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    event.preventDefault();
  }


  deleteZoomSegment(segment) {
    const index = this.zoomSegments.findIndex(s => s.id === segment.id);
    if (index !== -1) {
      this.zoomSegments.splice(index, 1);
      this.selectedZoomSegment = null;
      this.renderZoomSegments();
      // Show no zoom message in both sidebars
      this.showNoZoomMessage();
      // Update clear button state after deletion
      this.updateClearButtonState();
      ('Deleted zoom segment:', segment.id);
    }
  }


  getZoomSegmentAtTime(time) {
    // Find the zoom segment that contains this time
    const segment = this.zoomSegments.find(segment =>
      time >= segment.startTime && time <= segment.endTime
    );

    // Log for debugging - only occasionally to avoid spam
    if (this.isExportMode) {
      // Only log every 0.5 seconds approximately
      if (Math.random() < 0.02) {
        if (segment) {
          console.log('�x� [ZOOM] At time', time.toFixed(2), 's:', {
            id: segment.id,
            intensity: segment.intensity,
            position: segment.position
          });
        }
      }
    }

    return segment;
  }


  getZoomSegmentWithTransitionAtTime(time) {
    // Add transition buffer for smooth zoom in/out
    const transitionBuffer = this.zoomTransitionDuration || 0.5; // Default 0.5s transition

    // Find segments that include transition zones
    const segment = this.zoomSegments.find(segment => {
      const bufferStart = Math.max(0, segment.startTime - transitionBuffer);
      const bufferEnd = Math.min(this.videoDuration || Infinity, segment.endTime + transitionBuffer);
      const isInBuffer = time >= bufferStart && time <= bufferEnd;

      // Log for debugging
      if (isInBuffer) {
        (`Found zoom segment with transition at time ${time.toFixed(2)}s:`, {
          id: segment.id,
          startTime: segment.startTime,
          endTime: segment.endTime,
          bufferStart: bufferStart,
          bufferEnd: bufferEnd,
          intensity: segment.intensity
        });
      }

      return isInBuffer;
    });

    return segment;
  }


  saveZoomData() {
    const zoomData = {
      mode: this.zoomMode,
      intensity: this.zoomIntensity,
      position: this.zoomPosition,
      segments: this.zoomSegments
    };

    localStorage.setItem('screensmooth-zoom-data', JSON.stringify(zoomData));
    ('Zoom data saved:', zoomData);
  }

  // Load zoom data from localStorage (but don't auto-load on page refresh)

  loadZoomData() {
    // Don't auto-load zoom data - user should start fresh
    // This method is kept for potential future use
    ('Zoom data auto-loading disabled - starting with clean state');
  }


  updateZoomModeUI() {
    if (this.zoomModeRadios && this.zoomModeRadios.length > 0) {
      this.zoomModeRadios.forEach(radio => {
        if (radio) {
          radio.checked = radio.value === this.zoomMode;
        }
      });
    }
    this.updateZoomMode(this.zoomMode);
  }

}

export { RecorderZoomMethodsPart4 };
