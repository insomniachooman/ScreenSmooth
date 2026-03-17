class RecorderZoomMethodsPart3 {
  updateZoomIntensity() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const newIntensity = parseFloat(this.zoomIntensitySlider.value);
    this.zoomIntensity = newIntensity && newIntensity >= 1.25 ? newIntensity : 1.5;

    // Ensure intensity is within valid range
    this.zoomIntensity = Math.max(1.25, Math.min(4, this.zoomIntensity));

    if (this.zoomIntensityValue) {
      this.zoomIntensityValue.textContent = `${this.zoomIntensity.toFixed(1)}x`;
    }

    // Update ONLY the selected zoom segment if any (not all segments)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.intensity = this.zoomIntensity;
      this.renderZoomSegments();
      this.saveZoomData();
      (`Updated intensity for segment ${this.selectedZoomSegment.id}:`, this.zoomIntensity.toFixed(1));

      // Log the update for debugging
      (`Zoom segment intensity updated to ${this.zoomIntensity.toFixed(1)}x`);
    } else {
      // Update default value for new segments
      ('Updated default zoom intensity:', this.zoomIntensity.toFixed(1));
    }
  }

  updateZoomIntensityRight() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const newIntensity = parseFloat(this.zoomIntensitySliderRight.value);
    const validIntensity = newIntensity && newIntensity >= 1.25 ? newIntensity : 1.5;

    // Ensure intensity is within valid range
    const clampedIntensity = Math.max(1.25, Math.min(4, validIntensity));

    if (this.zoomIntensityValueRight) {
      this.zoomIntensityValueRight.textContent = `${clampedIntensity.toFixed(1)}x`;
    }

    // Update ONLY the selected zoom segment if any (not all segments)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.intensity = clampedIntensity;
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update the left sidebar to keep them synchronized
      if (this.zoomIntensitySlider) {
        this.zoomIntensitySlider.value = clampedIntensity;
      }
      if (this.zoomIntensityValue) {
        this.zoomIntensityValue.textContent = `${clampedIntensity.toFixed(1)}x`;
      }

      (`Updated intensity for segment ${this.selectedZoomSegment.id}:`, clampedIntensity.toFixed(1));
    } else {
      // Update default value for new segments
      this.zoomIntensity = clampedIntensity;
      ('Updated default zoom intensity:', clampedIntensity.toFixed(1));
    }
  }


  updateZoomModeRight(mode) {
    // Update ONLY the selected zoom segment if any (not global mode)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.mode = mode;
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update the left sidebar to keep them synchronized
      this.updateZoomMode(mode);

      (`Updated mode for segment ${this.selectedZoomSegment.id}:`, mode);
    } else {
      // Update default mode for new segments
      this.zoomMode = mode;

      // Also update the left sidebar to keep them synchronized
      this.updateZoomMode(mode);

      ('Updated default zoom mode:', mode);
    }

    // Show/hide manual controls based on current segment or default mode
    const currentMode = this.selectedZoomSegment ? this.selectedZoomSegment.mode : this.zoomMode;
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = currentMode === 'manual' ? 'block' : 'none';
    }

    // Also update left sidebar manual controls
    if (this.manualZoomControls) {
      this.manualZoomControls.style.display = currentMode === 'manual' ? 'block' : 'none';
    }
  }


  handleZoomPositionClickRight(event) {
    const rect = this.zoomPositionPreviewRight.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const newPosition = {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    };

    // Update position indicator
    if (this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${newPosition.x * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${newPosition.y * 100}%`;
    }

    // Also update left sidebar position indicator
    if (this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${newPosition.x * 100}%`;
      this.zoomPositionIndicator.style.top = `${newPosition.y * 100}%`;
    }

    // Update ONLY the selected zoom segment if any (not global position)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.position = { ...newPosition };
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update left sidebar segment
      // (This is handled by the renderZoomSegments method)

      (`Updated position for segment ${this.selectedZoomSegment.id}:`, newPosition);
    } else {
      // Update default position for new segments
      this.zoomPosition = { ...newPosition };
      ('Updated default zoom position:', newPosition);
    }
  }


  updateZoomMode(mode) {
    // Update ONLY the selected zoom segment if any (not global mode)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.mode = mode;
      this.renderZoomSegments();
      this.saveZoomData();
      (`Updated mode for segment ${this.selectedZoomSegment.id}:`, mode);
    } else {
      // Update default mode for new segments
      this.zoomMode = mode;
      ('Updated default zoom mode:', mode);

      // === SCREEN STUDIO MATCH === When switching to Auto mode, regenerate segments
      if (mode === 'auto') {
        this.handleAutoZoomButtonClick();
      }
    }

    // Show/hide manual controls based on current segment or default mode
    const currentMode = this.selectedZoomSegment ? this.selectedZoomSegment.mode : this.zoomMode;

    ('=== UPDATE ZOOM MODE ===');
    ('Current mode:', currentMode);
    ('Selected segment:', this.selectedZoomSegment ? this.selectedZoomSegment.id : 'none');
    ('Default zoom mode:', this.zoomMode);

    // Update manual zoom controls (left sidebar)
    if (this.manualZoomControls) {
      const shouldShow = currentMode === 'manual';
      ('Left manual controls - should show:', shouldShow);
      ('Left manual controls element:', this.manualZoomControls);
      this.manualZoomControls.style.display = shouldShow ? 'block' : 'none';
      ('Left manual controls display set to:', this.manualZoomControls.style.display);
    } else {
      ('Left manual zoom controls not found');
    }

    // Update manual zoom controls (right sidebar) 
    if (this.manualZoomControlsRight) {
      const shouldShow = currentMode === 'manual';
      ('Right manual controls - should show:', shouldShow);
      ('Right manual controls element:', this.manualZoomControlsRight);
      this.manualZoomControlsRight.style.display = shouldShow ? 'block' : 'none';
      ('Right manual controls display set to:', this.manualZoomControlsRight.style.display);
    } else {
      ('Right manual zoom controls not found');
    }

    ('=== END UPDATE ZOOM MODE ===');
  }


  handleZoomPositionClick(event) {
    const rect = this.zoomPositionPreview.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const newPosition = {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    };

    // Update position indicator
    if (this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${newPosition.x * 100}%`;
      this.zoomPositionIndicator.style.top = `${newPosition.y * 100}%`;
    }

    // Update ONLY the selected zoom segment if any (not global position)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.position = { ...newPosition };
      this.renderZoomSegments();
      this.saveZoomData();
      (`Updated position for segment ${this.selectedZoomSegment.id}:`, newPosition);
    } else {
      // Update default position for new segments
      this.zoomPosition = { ...newPosition };
      ('Updated default zoom position:', newPosition);
    }
  }


  renderZoomSegments() {
    ('=== RENDER ZOOM SEGMENTS START ===');
    ('Zoom track exists:', !!this.zoomTrack);
    ('Video duration:', this.videoDuration);
    ('Zoom segments to render:', this.zoomSegments.length);

    if (!this.zoomTrack || !this.videoDuration) {
      ('Cannot render zoom segments - missing track or duration');
      return;
    }

    // Clear existing segments
    const existingSegments = this.zoomTrack.querySelectorAll('.zoom-segment');
    ('Clearing existing segments:', existingSegments.length);
    existingSegments.forEach(segment => segment.remove());

    // Render each zoom segment
    this.zoomSegments.forEach((segment, index) => {
      (`Rendering segment ${index}:`, segment);
      const segmentElement = this.createZoomSegmentElement(segment);
      this.zoomTrack.appendChild(segmentElement);
    });

    ('=== RENDER ZOOM SEGMENTS END ===');
  }


  createZoomSegmentElement(segment) {
    const element = document.createElement('div');
    element.className = 'zoom-segment';
    element.dataset.segmentId = segment.id;

    const startPercent = (segment.startTime / this.videoDuration) * 100;
    const widthPercent = ((segment.endTime - segment.startTime) / this.videoDuration) * 100;

    element.style.left = `${startPercent}%`;
    element.style.width = `${widthPercent}%`;

    // Display the actual intensity value on the segment (minimum 1.25 for visible zoom)
    const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
    element.innerHTML = `
      <div class="zoom-handle left"></div>
      <div class="zoom-label">${segmentIntensity.toFixed(1)}x</div>
      <div class="zoom-delete" title="Delete zoom segment">&times;</div>
      <div class="zoom-handle right"></div>
    `;

    // Add event listeners
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectZoomSegment(segment);
    });

    // Delete button event listener
    const deleteBtn = element.querySelector('.zoom-delete');
    deleteBtn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.deleteZoomSegment(segment.id);
    });

    const leftHandle = element.querySelector('.zoom-handle.left');
    const rightHandle = element.querySelector('.zoom-handle.right');

    leftHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startZoomDrag(segment, 'left', e);
    });

    rightHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startZoomDrag(segment, 'right', e);
    });

    // Log the segment creation for debugging
    (`Zoom segment element created: ${segmentIntensity.toFixed(1)}x intensity`);

    return element;
  }


  selectZoomSegment(segment) {
    ('=== SELECT ZOOM SEGMENT START ===');
    ('Selecting segment:', segment.id);

    // Clear previous selection
    if (this.zoomTrack) {
      const prevSelected = this.zoomTrack.querySelector('.zoom-segment.selected');
      if (prevSelected) {
        prevSelected.classList.remove('selected');
      }
    } else {
      ('Zoom track not found during segment selection');
    }

    // Select new segment
    this.selectedZoomSegment = segment;
    if (this.zoomTrack) {
      const segmentElement = this.zoomTrack.querySelector(`[data-segment-id="${segment.id}"]`);
      if (segmentElement) {
        segmentElement.classList.add('selected');
        ('Segment element marked as selected');
      } else {
        ('Segment element not found in DOM');
      }
    }

    // Update zoom panel UI for both left and right sidebars
    try {
      ('About to update zoom panel for segment');
      this.updateZoomPanelForSegment(segment);
      ('Zoom panel updated successfully');
    } catch (error) {
      ('Error updating zoom panel:', error);
    }

    ('=== SELECT ZOOM SEGMENT END ===');
    this.updateZoomPanelForSegmentRight(segment);

    ('Selected zoom segment:', segment);
  }

}

export { RecorderZoomMethodsPart3 };
