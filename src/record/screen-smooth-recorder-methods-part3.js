class ScreenSmoothRecorderMethodsPart3 {
  attachEventListeners() {
    // Sidebar navigation
    this.sidebarBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelId = btn.dataset.panel;
        this.showEditorPanel(panelId);
      });
    });

    // Changelog toggle
    const changelogToggle = document.getElementById("changelog-toggle");
    const changelogSection = document.getElementById("changelog-section");
    if (changelogToggle && changelogSection) {
      changelogToggle.addEventListener("click", () => {
        changelogSection.classList.toggle("open");
      });
    }

    // Option card selection
    if (this.optionCards && this.optionCards.length > 0) {
      this.optionCards.forEach((card, index) => {
        card.addEventListener("click", () => {
          this.selectRecordingType(card);
        });
      });
    } else {
    }

    // Recording controls
    if (this.startRecordingBtn) {
      this.startRecordingBtn.addEventListener("click", (event) => {
        this.startRecording();
      });
    } else {
    }

    if (this.pauseRecordingBtn) {
      this.pauseRecordingBtn.addEventListener("click", () => this.togglePause());
    }
    if (this.stopRecordingBtn) {
      this.stopRecordingBtn.addEventListener("click", () => this.stopRecording());
    }
    if (this.recordAgainBtn) {
      this.recordAgainBtn.addEventListener("click", () => this.recordAgain());
    }
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.downloadRecording());
    }
    if (this.shareBtn) {
      this.shareBtn.addEventListener("click", () => this.shareRecording());
    }

    // Manage Subscription button
    const manageSubBtnNew = document.getElementById("manage-subscription-btn-new");
    if (manageSubBtnNew) {
      manageSubBtnNew.addEventListener("click", () => {
        window.open("https://customer.dodopayments.com/login/bus_wAEE2uSAiYkqlteBcSj4M", "_blank");
      });
    }

    // Quality and feature settings
    document.querySelectorAll('input[name="quality"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.selectedQuality = e.target.value;
      });
    });

    document
      .getElementById("cursor-tracking")
      .addEventListener("change", (e) => {
        this.cursorTracking = e.target.checked;
      });

    document.getElementById("system-audio").addEventListener("change", (e) => {
      this.systemAudio = e.target.checked;
    });

    // Video preview events
    if (this.previewVideo) {
      this.previewVideo.addEventListener("loadedmetadata", () => this.onVideoLoaded());
      this.previewVideo.addEventListener("timeupdate", () => this.onVideoTimeUpdate());
      this.previewVideo.addEventListener("ended", () => this.onVideoEnded());
      this.previewVideo.addEventListener("play", () => this.onVideoPlay());
      this.previewVideo.addEventListener("pause", () => this.onVideoPause());
      this.previewVideo.addEventListener("durationchange", () => this.onVideoDurationChange());
      // CRITICAL: Add seeked event to handle manual timeline seeking
      this.previewVideo.addEventListener("seeked", () => this.onVideoSeeked());
    }

    // Custom video player controls
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.rewindBtn.addEventListener("click", () => this.rewind());
    this.forwardBtn.addEventListener("click", () => this.forward());
    this.volumeBtn.addEventListener("click", () => this.toggleMute());
    this.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());

    // Progress bar events
    this.progressBarContainer.addEventListener("click", (e) =>
      this.seekToProgressPosition(e)
    );
    this.progressHandle.addEventListener("mousedown", (e) =>
      this.startProgressDrag(e)
    );

    // Timeline events
    this.timelineTrack.addEventListener("click", (e) =>
      this.seekToTimelinePosition(e)
    );
    this.trimHandleLeft.addEventListener("mousedown", (e) =>
      this.startDragging(e, "left")
    );
    this.trimHandleRight.addEventListener("mousedown", (e) =>
      this.startDragging(e, "right")
    );

    // Global mouse events for dragging
    document.addEventListener("mousemove", (e) => this.handleDragging(e));
    document.addEventListener("mouseup", () => this.stopDragging());

    // Background panel controls
    this.randomWallpaperBtn.addEventListener("click", () =>
      this.pickRandomWallpaper()
    );
    if (this.videoPadding) {
      this.videoPadding.addEventListener("input", () => this.updateVideoPreview());
    }
    if (this.videoBlur) {
      this.videoBlur.addEventListener("input", () => this.updateVideoPreview());
    }
    if (this.videoBorderRadius) {
      this.videoBorderRadius.addEventListener("input", () => this.updateVideoPreview());
    }
    if (this.aspectRatioSelect) {
      this.aspectRatioSelect.addEventListener("change", () => this.updateAspectRatio());
    }

    // Screen panel controls
    if (this.screenBrightness) {
      this.screenBrightness.addEventListener("input", () =>
        this.updateScreenEffects()
      );
    }
    if (this.screenContrast) {
      this.screenContrast.addEventListener("input", () =>
        this.updateScreenEffects()
      );
    }
    if (this.screenSaturation) {
      this.screenSaturation.addEventListener("input", () =>
        this.updateScreenEffects()
      );
    }

    // Demo Player - add null checks
    if (this.demoPlayPauseBtn) {
      this.demoPlayPauseBtn.addEventListener("click", () =>
        this.toggleDemoPlayPause()
      );
    }
    if (this.demoVideo) {
      this.demoVideo.addEventListener("timeupdate", () =>
        this.updateDemoTimeline()
      );
    }
    if (this.timelineBarTrack) {
      this.timelineBarTrack.addEventListener("click", (e) =>
        this.seekDemoTimeline(e)
      );
    }

    // Zoom controls - updated for one-click functionality
    // Commented out add zoom button as requested
    // if (this.addZoomBtn) {
    //   this.addZoomBtn.addEventListener("click", () => this.toggleAddZoomMode());
    // } else {
    //   ('Add zoom button not found');
    // }
    if (this.clearZoomBtn) {
      this.clearZoomBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearAllZoomSegments();
      });

      // Add backup click handler using direct DOM query
      setTimeout(() => {
        const backupBtn = document.getElementById('clear-zoom-btn');
        if (backupBtn && backupBtn !== this.clearZoomBtn) {
          backupBtn.addEventListener("click", () => {
            this.clearAllZoomSegments();
          });
        }
      }, 1000);
    } else {
      // Try backup query
      setTimeout(() => {
        const btn = document.getElementById('clear-zoom-btn');
        if (btn) {
          btn.addEventListener("click", () => {
            this.clearAllZoomSegments();
          });
        }
      }, 1000);
    }
    if (this.zoomTrack) {
      this.zoomTrack.addEventListener("click", (e) => this.handleZoomTrackClick(e));
      this.zoomTrack.addEventListener("mousemove", (e) => this.handleZoomTrackHover(e));
      this.zoomTrack.addEventListener("mouseleave", () => this.hideZoomHoverIndicator());
      this.zoomTrack.addEventListener("mouseenter", () => this.showZoomTrackHover());
    } else {
    }
    if (this.zoomIntensitySlider) {
      this.zoomIntensitySlider.addEventListener("input", () => {
        // Add small delay to prevent rapid firing
        clearTimeout(this.intensityUpdateTimeout);
        this.intensityUpdateTimeout = setTimeout(() => {
          this.updateZoomIntensity();
        }, 50);
      });
    }

    // === SCREEN STUDIO MATCH === Wire Animation Duration preset buttons (Rapid/Quick/Default/Slow)
    this.zoomAnimationPreset = 'default';
    const initAnimPresetControl = (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.querySelectorAll('.segment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active state in BOTH left and right panels
          document.querySelectorAll('.zoom-anim-preset .segment-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll(`.zoom-anim-preset .segment-btn[data-value="${btn.dataset.value}"]`).forEach(b => b.classList.add('active'));
          this.zoomAnimationPreset = btn.dataset.value;
          // Rebuild springs with new preset
          this._zoomSprings = null;
          if (this.exportZoomContext) this.exportZoomContext._zoomSprings = null;
          console.log(`�x}a️ [ZOOM] Animation preset changed to: ${btn.dataset.value}`);
        });
      });
    };
    initAnimPresetControl('zoom-anim-duration');
    initAnimPresetControl('zoom-anim-duration-right');
    if (this.zoomModeRadios && this.zoomModeRadios.length > 0) {
      this.zoomModeRadios.forEach((radio, index) => {
        if (radio && radio.addEventListener) {
          radio.addEventListener("change", (e) => {
            // Add small delay to prevent conflicts during panel updates
            clearTimeout(this.modeUpdateTimeout);
            this.modeUpdateTimeout = setTimeout(() => {
              this.updateZoomMode(e.target.value);
            }, 10);
          });
        }
      });
    } else {
    }
    if (this.zoomPositionPreview) {
      this.zoomPositionPreview.addEventListener("click", (e) => {
        // Add small delay to prevent conflicts
        clearTimeout(this.positionUpdateTimeout);
        this.positionUpdateTimeout = setTimeout(() => {
          this.handleZoomPositionClick(e);
        }, 10);
      });
    }

    // Prevent context menu on timeline - add null check
    if (this.timelineTrack) {
      this.timelineTrack.addEventListener("contextmenu", (e) =>
        e.preventDefault()
      );
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardShortcuts(e)
    );

    // Export controls synchronization (left to right)
    if (this.formatSelect) {
      this.formatSelect.addEventListener("change", () => {
        this.syncExportControls();
        // Save export format preference
        chrome.storage.local.set({ exportFormat: this.formatSelect.value }, () => {
          console.log('�S& Export format saved:', this.formatSelect.value);
        });
      });
    }
    if (this.qualitySelect) {
      this.qualitySelect.addEventListener("change", () => this.syncExportControls());
    }
    if (this.compressionLevel) {
      this.compressionLevel.addEventListener("input", () => {
        // Update compression value display
        if (this.compressionValue) {
          this.compressionValue.textContent = this.compressionLevel.value;
        }
        this.syncExportControls();
      });
    }

    // Export controls synchronization (right to left)
    if (this.formatSelectRight) {
      this.formatSelectRight.addEventListener("change", () => {
        this.syncExportControlsRight();
        // Save export format preference
        chrome.storage.local.set({ exportFormat: this.formatSelectRight.value }, () => {
          console.log('�S& Export format saved:', this.formatSelectRight.value);
        });
      });
    }
    if (this.qualitySelectRight) {
      this.qualitySelectRight.addEventListener("change", () => this.syncExportControlsRight());
    }
    if (this.compressionLevelRight) {
      this.compressionLevelRight.addEventListener("input", () => {
        // Update compression value display
        if (this.compressionValueRight) {
          this.compressionValueRight.textContent = this.compressionLevelRight.value;
        }
        this.syncExportControlsRight();
      });
    }

    // Right sidebar event listeners
    if (this.downloadBtnRight) {
      this.downloadBtnRight.addEventListener("click", () => this.downloadRecording());
    }

    if (this.closeZoomControlsBtn) {
      this.closeZoomControlsBtn.addEventListener("click", () => this.showExportAdvancedPanel());
    }

    // Right sidebar zoom controls
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.addEventListener("input", () => {
        clearTimeout(this.intensityUpdateTimeout);
        this.intensityUpdateTimeout = setTimeout(() => {
          this.updateZoomIntensityRight();
        }, 50);
      });
    }

    if (this.zoomModeRadiosRight && this.zoomModeRadiosRight.length > 0) {
      this.zoomModeRadiosRight.forEach((radio, index) => {
        if (radio) {
          radio.addEventListener("change", (e) => {
            clearTimeout(this.modeUpdateTimeout);
            this.modeUpdateTimeout = setTimeout(() => {
              this.updateZoomModeRight(e.target.value);
            }, 10);
          });
        }
      });
    }

    if (this.zoomPositionPreviewRight) {
      this.zoomPositionPreviewRight.addEventListener("click", (e) => {
        clearTimeout(this.positionUpdateTimeout);
        this.positionUpdateTimeout = setTimeout(() => {
          this.handleZoomPositionClickRight(e);
        }, 10);
      });
    }
  }


  initializeWallpapers() {
    this.populateWallpaperGrid();
    this.updateVideoPreview();
  }


  initializeDemoPlayer() {
    if (this.demoVideo) {
      this.demoVideo.play(); // Autoplay muted video
    }
  }


  toggleDemoPlayPause() {
    if (!this.demoVideo) {
      // ('Demo video element not found');
      return;
    }

    if (this.demoVideo.paused) {
      this.demoVideo.play();
      if (this.demoPlayIcon) this.demoPlayIcon.style.display = "none";
      if (this.demoPauseIcon) this.demoPauseIcon.style.display = "block";
    } else {
      this.demoVideo.pause();
      if (this.demoPlayIcon) this.demoPlayIcon.style.display = "block";
      if (this.demoPauseIcon) this.demoPauseIcon.style.display = "none";
    }
  }


  updateDemoTimeline() {
    if (!this.demoVideo || !this.timelineBarProgress || !this.timelineBarPlayhead) {
      return;
    }

    const progress =
      (this.demoVideo.currentTime / this.demoVideo.duration) * 100;
    this.timelineBarProgress.style.width = `${progress}%`;
    this.timelineBarPlayhead.style.left = `${progress}%`;
  }


  seekDemoTimeline(event) {
    if (!this.demoVideo || !this.timelineBarTrack) {
      return;
    }

    const rect = this.timelineBarTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    this.demoVideo.currentTime = percentage * this.demoVideo.duration;
  }


  populateWallpaperGrid() {
    this.wallpaperGrid.innerHTML = "";

    this.wallpapers.forEach((url) => {
      const item = document.createElement("div");
      item.className = "wallpaper-item";
      item.style.backgroundImage = `url(${url})`;
      item.addEventListener("click", () => this.selectWallpaper(item, url));
      this.wallpaperGrid.appendChild(item);
    });
  }

}

export { ScreenSmoothRecorderMethodsPart3 };
