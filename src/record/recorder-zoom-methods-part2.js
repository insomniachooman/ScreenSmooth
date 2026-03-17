class RecorderZoomMethodsPart2 {
  showInfo(message) {
    (message);
    // You can enhance this with toast notifications
    if (this.updateStatusText) {
      this.updateStatusText(message);
      setTimeout(() => this.updateStatusText(''), 3000);
    }
  }

  // Clear all zoom data - used when starting new recording or on page refresh

  clearAllZoomData() {
    ('=== CLEAR ALL ZOOM DATA START ===');
    ('Clearing', this.zoomSegments.length, 'zoom segments');

    this.zoomSegments = [];
    this.selectedZoomSegment = null;
    this.isAddingZoom = false;

    // Update UI state - no more add button state management
    if (this.zoomTrack) {
      this.zoomTrack.style.cursor = 'pointer';
    }

    // Show empty message
    this.showNoZoomMessage();

    // Clear localStorage
    try {
      localStorage.removeItem('screensmooth-zoom-data');
      ('Zoom data cleared from localStorage');
    } catch (error) {
      ('Failed to clear zoom data from localStorage:', error);
    }

    // Re-render empty zoom timeline
    this.renderZoomSegments();

    // Update clear button state after clearing all segments
    this.updateClearButtonState();

    ('=== CLEAR ALL ZOOM DATA END ===');
  }

  // Clear all zoom segments - for manual clearing

  clearAllZoomSegments() {
    ('=== CLEAR ALL ZOOM SEGMENTS CLICKED ===');
    ('Current zoom segments:', this.zoomSegments.length);

    if (this.zoomSegments.length === 0) {
      this.showInfo('No zoom segments to clear');
      return;
    }

    // Confirm deletion
    if (confirm(`Are you sure you want to delete all ${this.zoomSegments.length} zoom segments?`)) {
      ('User confirmed deletion, clearing all zoom data');
      this.clearAllZoomData();
      this.showInfo('All zoom segments deleted');
      ('All zoom segments cleared successfully');
    } else {
      ('User cancelled zoom deletion');
    }
  }

  // Delete a specific zoom segment

  deleteZoomSegment(segmentId) {
    const segmentIndex = this.zoomSegments.findIndex(segment => segment.id === segmentId);
    if (segmentIndex === -1) {
      ('Zoom segment not found for deletion:', segmentId);
      return;
    }

    const segment = this.zoomSegments[segmentIndex];
    this.zoomSegments.splice(segmentIndex, 1);

    // Clear selection if deleted segment was selected
    if (this.selectedZoomSegment && this.selectedZoomSegment.id === segmentId) {
      this.showNoZoomMessage();
    }

    this.renderZoomSegments();
    this.saveZoomData();

    // If no segments left, show empty message
    if (this.zoomSegments.length === 0) {
      this.showNoZoomMessage();
    }

    // Update clear button state after deletion
    this.updateClearButtonState();

    ('Deleted zoom segment:', segment);
    this.showInfo(`Zoom segment deleted at ${this.formatTime(segment.startTime)}`);
  }


  handleZoomTrackClick(event) {
    console.log('�x� [TIMELINE] =========================');
    console.log('�x� [TIMELINE] Click event received!');
    console.log('�x� [TIMELINE] videoDuration:', this.videoDuration, 'typeof:', typeof this.videoDuration);
    console.log('�x� [TIMELINE] Number.isFinite(videoDuration):', Number.isFinite(this.videoDuration));
    console.log('�x� [TIMELINE] Event target:', event.target);
    console.log('�x� [TIMELINE] zoomTrack element:', !!this.zoomTrack);
    console.log('�x� [TIMELINE] isPlaying:', this.isPlaying);
    console.log('�x� [TIMELINE] Current zoom segments:', this.zoomSegments?.length || 0);

    // One-click zoom creation - no need for add mode
    if (!this.videoDuration) {
      console.log('�x� [TIMELINE] �R BLOCKED: videoDuration is falsy:', this.videoDuration);
      this.showError('Video not ready. Please wait for video to load completely.');
      return;
    }

    // Prevent event from bubbling up
    event.stopPropagation();
    event.preventDefault();

    const rect = this.zoomTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    console.log('�x� [TIMELINE] Track rect width:', rect.width);
    console.log('�x� [TIMELINE] Click X:', clickX);

    // Validate track dimensions
    if (rect.width <= 0) {
      console.log('�x� [TIMELINE] �R BLOCKED: Invalid track dimensions:', rect.width);
      this.showError('Timeline not ready. Please try again.');
      return;
    }

    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const clickTime = percentage * this.videoDuration;

    console.log('�x� [TIMELINE] Calculated clickTime:', clickTime);
    console.log('�x� [TIMELINE] Percentage:', (percentage * 100).toFixed(2) + '%');

    // Immediately create zoom segment (one-click functionality)
    try {
      console.log('�x� [TIMELINE] Calling createZoomSegmentAtTime with:', clickTime);
      this.createZoomSegmentAtTime(clickTime);
      console.log('�x� [TIMELINE] �S& createZoomSegmentAtTime completed');
    } catch (error) {
      console.log('�x� [TIMELINE] �R ERROR creating zoom segment:', error);
      console.log('�x� [TIMELINE] Error stack:', error.stack);
      this.showError('Failed to create zoom segment. Please try again.');
      return;
    }

    // Seek video to clicked time
    if (this.previewVideo) {
      this.previewVideo.currentTime = clickTime;

      // CRITICAL: Force immediate canvas render for paused video
      // This ensures zoom state changes are visible immediately after zoom click
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

      (`Video seeked to ${this.formatTime(clickTime)}`);
    }

    ('=== ZOOM TRACK CLICK END ===');
  }


  createZoomSegmentAtTime(clickTime) {
    console.log('�x� [ZOOM] =========================');
    console.log('�x� [ZOOM] createZoomSegmentAtTime called');
    console.log('�x� [ZOOM] clickTime:', clickTime);
    console.log('�x� [ZOOM] videoDuration:', this.videoDuration);
    console.log('�x� [ZOOM] Current zoom segments count:', this.zoomSegments.length);

    // Temporarily allow zoom functionality for testing
    // TODO: Re-enable premium check when needed
    // if (!this.isPremium) {
    //   this.showPremiumRequiredMessage();
    //   return;
    // }

    const defaultDuration = 3;

    // Calculate start and end times, centering around click position
    let startTime = Math.max(0, clickTime - defaultDuration / 2);
    let endTime = Math.min(this.videoDuration, startTime + defaultDuration);

    // Adjust if we hit the end boundary
    if (endTime === this.videoDuration && endTime - startTime < defaultDuration) {
      startTime = Math.max(0, endTime - defaultDuration);
    }

    const actualDuration = endTime - startTime;

    console.log('�x� [ZOOM] Calculated segment: start=' + this.formatTime(startTime) + ', end=' + this.formatTime(endTime) + ', duration=' + actualDuration.toFixed(1) + 's');

    // Check for overlapping segments
    console.log('�x� [ZOOM] Checking for overlapping segments...');

    const overlapping = this.zoomSegments.find(segment =>
      (startTime >= segment.startTime && startTime < segment.endTime) ||
      (endTime > segment.startTime && endTime <= segment.endTime) ||
      (startTime <= segment.startTime && endTime >= segment.endTime)
    );

    if (overlapping) {
      console.log('�x� [ZOOM] �R Overlapping segment found:', overlapping);
      this.showError('Cannot create overlapping zoom segments. Please choose a different time.');
      return;
    } else {
      console.log('�x� [ZOOM] �S& No overlapping segments, proceeding');
    }

    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const zoomIntensity = this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5;

    console.log('�x� [ZOOM] Creating segment with intensity:', zoomIntensity, 'position:', this.zoomPosition, 'mode:', this.zoomMode);

    const zoomSegment = {
      id: Date.now().toString(),
      startTime: startTime,
      endTime: endTime,
      intensity: zoomIntensity, // Use validated intensity value
      position: { ...this.zoomPosition }, // Use current default position
      mode: this.zoomMode, // Use current default mode
      screenDimensions: {
        width: window.screen.width,
        height: window.screen.height
      }
    };

    this.zoomSegments.push(zoomSegment);
    ('Zoom segment added to array successfully');

    // Hide the no zoom message since we now have a segment
    try {
      if (this.noZoomMessage) {
        this.noZoomMessage.style.display = 'none';
        ('Hidden noZoomMessage');
      } else {
        ('noZoomMessage element not found');
      }
      if (this.noZoomMessageRight) {
        this.noZoomMessageRight.style.display = 'none';
        ('Hidden noZoomMessageRight');
      } else {
        ('noZoomMessageRight element not found');
      }
    } catch (error) {
      ('Error hiding zoom messages:', error);
    }

    try {
      ('About to render zoom segments');
      this.renderZoomSegments();
      ('Zoom segments rendered successfully');
    } catch (error) {
      ('Error rendering zoom segments:', error);
    }

    try {
      ('About to save zoom data');
      this.saveZoomData();
      ('Zoom data saved successfully');
    } catch (error) {
      ('Error saving zoom data:', error);
    }

    // Automatically select the new segment
    try {
      ('About to select zoom segment:', zoomSegment.id);
      this.selectZoomSegment(zoomSegment);
      ('Zoom segment selected successfully');
    } catch (error) {
      ('Error selecting zoom segment:', error);
    }

    // Update clear button state after adding segment
    this.updateClearButtonState();

    ('Successfully created and selected zoom segment:', zoomSegment);
    this.showInfo(`Zoom created at ${this.formatTime(startTime)} (${actualDuration.toFixed(1)}s duration) with ${zoomIntensity.toFixed(1)}x intensity`);

    // Log the created segment for debugging
    (`New zoom segment created: ${zoomIntensity.toFixed(1)}x intensity from ${this.formatTime(startTime)} to ${this.formatTime(endTime)}`);
    ('Total segments after creation:', this.zoomSegments.length);
    ('=== CREATE ZOOM SEGMENT END ===');
  }


  handleZoomTrackHover(event) {
    if (!this.videoDuration || !this.zoomHoverIndicator) {
      ('Hover blocked: videoDuration =', this.videoDuration, 'hoverIndicator =', !!this.zoomHoverIndicator);
      return;
    }

    const rect = this.zoomTrack.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;

    // Ensure we have valid track dimensions
    if (rect.width <= 0) {
      ('Invalid track width:', rect.width);
      return;
    }

    const percentage = Math.max(0, Math.min(1, hoverX / rect.width));
    const hoverTime = percentage * this.videoDuration;

    ('=== ZOOM HOVER DEBUG ===');
    ('Mouse clientX:', event.clientX);
    ('Track rect:', { left: rect.left, width: rect.width, right: rect.right });
    ('Hover X (relative):', hoverX);
    ('Percentage:', (percentage * 100).toFixed(2) + '%');
    ('Hover time:', this.formatTime(hoverTime), '(' + hoverTime.toFixed(2) + 's)');
    ('Video duration:', this.videoDuration + 's');
    ('=========================');

    // Ensure coordinates are within bounds
    const clampedHoverX = Math.max(0, Math.min(rect.width, hoverX));

    // Update hover indicator position
    this.zoomHoverIndicator.style.left = `${clampedHoverX}px`;
    this.zoomHoverIndicator.style.opacity = '1';

    // Update time preview with better positioning
    if (this.zoomTimePreview) {
      this.zoomTimePreview.textContent = this.formatTime(hoverTime);
      // Center the preview on the hover position
      const previewWidth = this.zoomTimePreview.offsetWidth || 60; // estimated width
      let previewLeft = clampedHoverX - (previewWidth / 2);

      // Keep preview within track bounds
      previewLeft = Math.max(0, Math.min(rect.width - previewWidth, previewLeft));

      this.zoomTimePreview.style.left = `${previewLeft}px`;
      this.zoomTimePreview.style.opacity = '1';

      ('Time preview positioned at:', previewLeft + 'px', 'showing:', this.formatTime(hoverTime));
    }

    // Show placeholder zoom segment
    this.showZoomPlaceholder(hoverX, hoverTime, percentage);
  }


  showZoomPlaceholder(hoverX, hoverTime, percentage) {
    if (!this.zoomPlaceholder || !this.videoDuration) return;

    const defaultDuration = 3; // 3 seconds default

    // Calculate start and end times, centering around hover position
    let startTime = Math.max(0, hoverTime - defaultDuration / 2);
    let endTime = Math.min(this.videoDuration, startTime + defaultDuration);

    // Adjust if we hit the end boundary
    if (endTime === this.videoDuration && endTime - startTime < defaultDuration) {
      startTime = Math.max(0, endTime - defaultDuration);
    }

    const actualDuration = endTime - startTime;

    // Calculate position percentages
    const startPercent = (startTime / this.videoDuration) * 100;
    const widthPercent = (actualDuration / this.videoDuration) * 100;

    console.log(`Placeholder calculation:`);
    console.log(`  - Hover time: ${this.formatTime(hoverTime)} (${(hoverTime).toFixed(2)}s)`);
    console.log(`  - Start time: ${this.formatTime(startTime)} (${startTime.toFixed(2)}s)`);
    console.log(`  - End time: ${this.formatTime(endTime)} (${endTime.toFixed(2)}s)`);
    console.log(`  - Duration: ${actualDuration.toFixed(1)}s`);
    console.log(`  - Position: left=${startPercent.toFixed(1)}%, width=${widthPercent.toFixed(1)}%`);
    console.log(`  - Video duration: ${this.videoDuration}s`);

    this.zoomPlaceholder.style.left = `${startPercent}%`;
    this.zoomPlaceholder.style.width = `${widthPercent}%`;
    this.zoomPlaceholder.textContent = `${actualDuration.toFixed(1)}s`;
    this.zoomPlaceholder.style.opacity = '0.5'; // Always show with half opacity
  }


  showZoomTrackHover() {
    // Show time preview on hover
    if (this.zoomTimePreview) {
      this.zoomTimePreview.style.opacity = '1';
    }
  }


  hideZoomHoverIndicator() {
    if (this.zoomHoverIndicator) {
      this.zoomHoverIndicator.style.opacity = '0';
    }
    if (this.zoomTimePreview) {
      this.zoomTimePreview.style.opacity = '0';
    }
    if (this.zoomPlaceholder) {
      this.zoomPlaceholder.style.opacity = '0';
    }
  }

}

export { RecorderZoomMethodsPart2 };
