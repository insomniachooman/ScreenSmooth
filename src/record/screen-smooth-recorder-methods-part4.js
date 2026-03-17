class ScreenSmoothRecorderMethodsPart4 {
  selectWallpaper(element, url) {
    // Remove selection from other items
    document
      .querySelectorAll(".wallpaper-item")
      .forEach((item) => item.classList.remove("selected"));

    // Add selection to the clicked item
    element.classList.add("selected");

    // Clear all background caches when changing background
    this.backgroundImageCache = null;
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;
    this.lastBackgroundValue = null;
    this.lastCanvasWidth = null;
    this.lastCanvasHeight = null;

    // Update the background
    this.currentBackground = `url(${url})`;

    // Load the image immediately and synchronously
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      // console.log('�S& Background wallpaper loaded successfully:', url);
      this.backgroundImageCache = img;
      // Force immediate canvas update
      this.updateVideoPreview();
    };

    img.onerror = (err) => {
      console.error('�R Failed to load background wallpaper:', url, err);
      // Try with chrome.runtime.getURL as fallback
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "Anonymous";
      fallbackImg.onload = () => {
        // console.log('�S& Background loaded via chrome.runtime.getURL');
        this.backgroundImageCache = fallbackImg;
        this.updateVideoPreview();
      };
      fallbackImg.onerror = () => {
        console.error('�R Fallback also failed, keeping black background');
      };
      // Extract path from url() wrapper
      let cleanUrl = url;
      if (cleanUrl.startsWith('../../assets/')) {
        cleanUrl = cleanUrl.replace('../../assets/', 'assets/');
      }
      fallbackImg.src = chrome.runtime.getURL(cleanUrl);
    };

    img.src = url;
  }


  pickRandomWallpaper() {
    const randomUrl = this.wallpapers[Math.floor(Math.random() * this.wallpapers.length)];

    // Clear all background caches when changing background
    this.backgroundImageCache = null;
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;
    this.lastBackgroundValue = null;
    this.lastCanvasWidth = null;
    this.lastCanvasHeight = null;

    this.currentBackground = `url(${randomUrl})`;

    // Force immediate canvas update
    this.updateVideoPreview();

    // Optional: update selection in the grid
    document.querySelectorAll(".wallpaper-item").forEach((item) => {
      item.classList.toggle(
        "selected",
        item.style.backgroundImage.includes(randomUrl)
      );
    });
  }


  showEditorPanel(panelId) {
    // Hide all panels
    document.querySelectorAll(".editor-panel").forEach((panel) => {
      panel.style.display = "none";
      panel.classList.remove("active");
    });

    // Remove active class from all sidebar buttons
    this.sidebarBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Show selected panel
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.style.display = "block";
      targetPanel.classList.add("active");

      // Special check for cursor panel
      if (panelId === 'cursor-panel') {
        // Try to re-initialize settings if needed
        if (window.cursorSettingsManager) {
          window.cursorSettingsManager.initialize();
        }
      }
    } else {
      console.error(`[DEBUG] Target panel not found: ${panelId}`);
    }

    // Add active class to corresponding sidebar button
    const targetBtn = document.querySelector(`[data-panel="${panelId}"]`);
    if (targetBtn) {
      targetBtn.classList.add("active");
    }
  }


  showExportAdvancedPanel() {
    // Hide zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "none";
    }

    // Show export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "block";
    }
  }


  showZoomControlsPanel() {
    // Hide export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "none";
    }

    // Show zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "block";
    }
  }

  // Add these methods to synchronize export controls

  syncExportControls() {
    // Synchronize format selector
    if (this.formatSelect && this.formatSelectRight) {
      this.formatSelectRight.value = this.formatSelect.value;
    }

    // Synchronize quality selector
    if (this.qualitySelect && this.qualitySelectRight) {
      this.qualitySelectRight.value = this.qualitySelect.value;
    }

    // Synchronize compression level
    if (this.compressionLevel && this.compressionLevelRight) {
      this.compressionLevelRight.value = this.compressionLevel.value;
    }
  }


  syncExportControlsRight() {
    // Synchronize format selector
    if (this.formatSelect && this.formatSelectRight) {
      this.formatSelect.value = this.formatSelectRight.value;
    }

    // Synchronize quality selector
    if (this.qualitySelect && this.qualitySelectRight) {
      this.qualitySelect.value = this.qualitySelectRight.value;
    }

    // Synchronize compression level
    if (this.compressionLevel && this.compressionLevelRight) {
      this.compressionLevel.value = this.compressionLevelRight.value;
    }
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


  handleKeyboardShortcuts(event) {
    if (!this.previewVideo.src) return;

    switch (event.code) {
      case "Space":
        if (
          event.target.tagName !== "INPUT" &&
          event.target.tagName !== "TEXTAREA"
        ) {
          event.preventDefault();
          this.togglePlayPause();
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.previewVideo.currentTime = Math.max(
          0,
          this.previewVideo.currentTime - 5
        );
        break;
      case "ArrowRight":
        event.preventDefault();
        this.previewVideo.currentTime = Math.min(
          this.videoDuration,
          this.previewVideo.currentTime + 5
        );
        break;
      case "Delete":
      case "Backspace":
        if (this.selectedZoomSegment &&
          event.target.tagName !== "INPUT" &&
          event.target.tagName !== "TEXTAREA") {
          event.preventDefault();
          this.deleteZoomSegment(this.selectedZoomSegment);
        }
        break;
    }
  }


  loadStoredSettings() {
    // Load any stored preferences
    const stored = localStorage.getItem("screensmooth-settings");
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.recordingType) {
          this.selectRecordingType(
            document.querySelector(`[data-type="${settings.recordingType}"]`)
          );
        }
      } catch (error) {
        ("Could not load stored settings:", error);
      }
    }
  }


  handleHashNavigation() {
    const hash = window.location.hash;
    if (hash === "#settings") {
      // Could implement settings panel here
      ("Settings requested");
    }
  }


  selectRecordingType(card) {
    this.optionCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    this.selectedRecordingType = card.dataset.type;

    localStorage.setItem(
      "screensmooth-settings",
      JSON.stringify({
        recordingType: this.selectedRecordingType,
      })
    );

    this.updateModeWarning(this.selectedRecordingType);

    ("Selected recording type:", this.selectedRecordingType);
  }


  updateModeWarning(recordingType) {
    const warningBox = document.getElementById("mode-warning");
    const autoZoomLabel = document.getElementById("auto-zoom")?.closest(".toggle-option");
    const showCursorLabel = document.getElementById("show-cursor")?.closest(".toggle-option");
    const autoZoomCheckbox = document.getElementById("auto-zoom");
    const showCursorCheckbox = document.getElementById("show-cursor");

    if (recordingType === "tab") {
      if (warningBox) warningBox.style.display = "none";
      if (autoZoomLabel) autoZoomLabel.classList.remove("disabled");
      if (showCursorLabel) showCursorLabel.classList.remove("disabled");
      if (autoZoomCheckbox) autoZoomCheckbox.disabled = false;
      if (showCursorCheckbox) showCursorCheckbox.disabled = false;
    } else {
      if (warningBox) warningBox.style.display = "flex";
      if (autoZoomLabel) autoZoomLabel.classList.add("disabled");
      if (showCursorLabel) showCursorLabel.classList.add("disabled");
      if (autoZoomCheckbox) autoZoomCheckbox.disabled = true;
      if (showCursorCheckbox) showCursorCheckbox.disabled = true;
    }
  }

}

export { ScreenSmoothRecorderMethodsPart4 };
