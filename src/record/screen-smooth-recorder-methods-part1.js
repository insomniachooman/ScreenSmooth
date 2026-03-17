class ScreenSmoothRecorderMethodsPart1 {
  async initialize() {
    console.log('�x� DEBUG: ScreenSmoothRecorder.initialize() called');
    try {
      console.log('�x� DEBUG: Calling initializeElements()');
      this.initializeElements();
      console.log('�x� DEBUG: Initializing mode warning state');
      this.updateModeWarning(this.selectedRecordingType);
      console.log('�x� DEBUG: Calling initializeWallpapers()');
      this.initializeWallpapers(); // Initialize wallpapers immediately after elements
      console.log('�x� DEBUG: Calling attachEventListeners()');
      this.attachEventListeners();
      console.log('�x� DEBUG: Calling loadStoredSettings()');
      this.loadStoredSettings();
      console.log('�x� DEBUG: Calling loadZoomData()');
      this.loadZoomData(); // Load saved zoom data
      console.log('�x� DEBUG: Calling handleHashNavigation()');
      this.handleHashNavigation();
      console.log('�x� DEBUG: Calling showEditorPanel()');
      this.showEditorPanel("background-panel"); // Show background panel by default
      console.log('�x� DEBUG: Calling initializeDemoPlayer()');
      this.initializeDemoPlayer();

      // Initialize FFmpeg - BLOCKING with timeout
      console.log('�x� DEBUG: Starting FFmpeg initialization (blocking)...');
      await this.initializeFFmpeg();
      console.log('�x� DEBUG: FFmpeg initialization complete, isLoaded:', this.isFFmpegLoaded);

      // Check premium status
      console.log('�x� DEBUG: Calling checkPremiumStatus()');
      await this.checkPremiumStatus();

      // Initialize license UI
      console.log('�x� DEBUG: Checking for licenseUI');
      if (window.licenseUI) {
        console.log('�x� DEBUG: Initializing licenseUI');
        await window.licenseUI.initialize();
      } else {
        console.log('�x� DEBUG: licenseUI not available');
      }

      // Make recorder available globally for debugging
      console.log('�x� DEBUG: Setting window.screenSmoothRecorder');
      window.screenSmoothRecorder = this;

      // Add global test functions
      window.testClearButton = () => {
        const btn = document.getElementById('clear-zoom-btn');
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';

          // Set appropriate opacity based on zoom segments
          const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
          btn.style.opacity = hasZoomSegments ? '1' : '0.5';

          btn.click();
        }
      };

      window.testManualMode = () => {
        const radios = document.querySelectorAll('input[name="zoom-mode"]');

        const manualRadio = document.querySelector('input[name="zoom-mode"][value="manual"]');
        if (manualRadio) {
          manualRadio.checked = true;
          manualRadio.dispatchEvent(new Event('change'));
        }

        const controls = document.querySelectorAll('.manual-zoom-controls');
      };

      // Add enhanced UI test function
      window.testUIButtons = () => {
        // Test clicking actual clear button
        const clearBtn = document.getElementById('clear-zoom-btn');
        if (clearBtn) {
          clearBtn.click();
        }

        setTimeout(() => {
          // Test actual radio button click
          const manualRadio = document.querySelector('input[name="zoom-mode"][value="manual"]');
          if (manualRadio) {
            manualRadio.click();

            setTimeout(() => {
              const controls = document.querySelectorAll('.manual-zoom-controls');
            }, 500);
          }
        }, 1000);
      };

      // Add function to force enable clear button
      window.forceClearButtonEnable = () => {
        const btn = document.getElementById('clear-zoom-btn');
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';

          // Set appropriate opacity based on zoom segments
          const hasZoomSegments = window.screenSmoothRecorder.zoomSegments && window.screenSmoothRecorder.zoomSegments.length > 0;
          btn.style.opacity = hasZoomSegments ? '1' : '0.5';
          btn.style.filter = 'none';
        } else {
        }
      };

      // CRITICAL FIX: Re-attach event listeners after full initialization
      // This ensures DOM is completely ready and elements are accessible
      setTimeout(() => {
        this.reattachCriticalEventListeners();
      }, 1000);

      // ADDITIONAL FIX: Keep monitoring and ensuring clear button stays enabled
      this.ensureClearButtonEnabled();

    } catch (error) {
      throw error; // Re-throw to allow caller to handle
    }
  }

  // Monitor and ensure clear button stays enabled

  ensureClearButtonEnabled() {
    const checkClearButton = () => {
      const clearBtn = document.getElementById('clear-zoom-btn');
      if (clearBtn) {
        // Always ensure it's not disabled
        if (clearBtn.disabled || clearBtn.style.pointerEvents === 'none' || clearBtn.style.cursor === 'not-allowed') {
          clearBtn.disabled = false;
          clearBtn.style.pointerEvents = 'auto';
          clearBtn.style.cursor = 'pointer';
        }

        // Set opacity based on whether there are zoom segments to clear
        const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
        const targetOpacity = hasZoomSegments ? '1' : '0.5';

        if (clearBtn.style.opacity !== targetOpacity) {
          clearBtn.style.opacity = targetOpacity;
        }
      }
    };

    // Check immediately and then every 3 seconds
    checkClearButton();
    setInterval(checkClearButton, 3000);
  }

  // Re-attach critical event listeners that might get lost during initialization

  reattachCriticalEventListeners() {
    // Re-attach clear button listener
    const clearBtn = document.getElementById('clear-zoom-btn');
    if (clearBtn) {
      // FORCE ENABLE the button
      clearBtn.disabled = false;
      clearBtn.style.pointerEvents = 'auto';
      clearBtn.style.cursor = 'pointer';
      clearBtn.style.opacity = '1';

      // Remove any existing listeners by cloning the element
      const newClearBtn = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);

      // FORCE ENABLE the new button too
      newClearBtn.disabled = false;
      newClearBtn.style.pointerEvents = 'auto';
      newClearBtn.style.cursor = 'pointer';

      // Set initial opacity based on zoom segments
      const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
      newClearBtn.style.opacity = hasZoomSegments ? '1' : '0.5';

      newClearBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearAllZoomSegments();
      });

      // Update reference
      this.clearZoomBtn = newClearBtn;
    } else {
    }

    // Re-attach zoom mode radio listeners
    const zoomRadios = document.querySelectorAll('input[name="zoom-mode"]');
    zoomRadios.forEach((radio, index) => {
      // Clone to remove existing listeners
      const newRadio = radio.cloneNode(true);
      radio.parentNode.replaceChild(newRadio, radio);

      newRadio.addEventListener('change', (e) => {
        this.updateZoomMode(e.target.value);
      });
    });

    // Re-attach right sidebar zoom mode radio listeners
    const zoomRadiosRight = document.querySelectorAll('input[name="zoom-mode-right"]');
    zoomRadiosRight.forEach((radio, index) => {
      // Clone to remove existing listeners
      const newRadio = radio.cloneNode(true);
      radio.parentNode.replaceChild(newRadio, radio);

      newRadio.addEventListener('change', (e) => {
        this.updateZoomModeRight(e.target.value);
      });
    });
  }

  // Update clear button appearance based on zoom segments

  updateClearButtonState() {
    const clearBtn = document.getElementById('clear-zoom-btn');
    if (clearBtn) {
      const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
      const targetOpacity = hasZoomSegments ? '1' : '0.5';

      clearBtn.style.opacity = targetOpacity;
      clearBtn.title = hasZoomSegments
        ? `Clear All Zoom Segments (${this.zoomSegments.length})`
        : 'Clear All Zoom Segments (No segments to clear)';
    }
  }

  // Check premium status from extension storage

  async checkPremiumStatus() {
    try {
      // Use the simple license system
      this.isPremium = await window.simpleLicenseSystem?.isPremium() || false;

      // Update UI based on premium status
      this.updatePremiumFeatures();

    } catch (error) {
      this.isPremium = false;
    }
  }

  // Update UI based on premium features

  updatePremiumFeatures() {
    // Update zoom controls visibility
    // MOVED: .zoom-track removed from here effectively to ensure it stays interactive
    // This aligns with createZoomSegmentAtTime where the premium check is commented out
    const zoomControls = document.querySelectorAll('.zoom-controls, .zoom-panel');
    const premiumOverlays = document.querySelectorAll('.premium-overlay');

    // Always ensure zoom track is interactive regardless of premium status
    // This fixes the bug where timeline clicks would be ignored (no logs)
    if (this.zoomTrack) {
      this.zoomTrack.style.cursor = 'pointer';
      this.zoomTrack.style.pointerEvents = 'auto';
      // Only adjust opacity if you want visual feedback, but 'auto' is key for events
      this.zoomTrack.style.opacity = '1';
    }

    if (this.isPremium) {
      // Enable premium features
      zoomControls.forEach(control => {
        control.style.opacity = '1';
        control.style.pointerEvents = 'auto';
      });

      premiumOverlays.forEach(overlay => {
        overlay.style.display = 'none';
      });
    } else {
      // Disable premium features with overlay
      zoomControls.forEach(control => {
        control.style.opacity = '0.5';
        control.style.pointerEvents = 'none';
      });


      premiumOverlays.forEach(overlay => {
        overlay.style.display = 'block';
      });
    }

    // Update license UI elements
    const licenseBadge = document.getElementById('license-badge');
    const upgradeBtn = document.getElementById('upgrade-premium-btn');
    const manageBtn = document.getElementById('manage-license-btn');

    if (this.isPremium) {
      if (licenseBadge) licenseBadge.style.display = 'inline-block';
      if (upgradeBtn) {
        upgradeBtn.textContent = 'License Active';
        upgradeBtn.disabled = true;
        upgradeBtn.style.background = '#10b981';
        upgradeBtn.style.cursor = 'default';
      }
      if (manageBtn) manageBtn.style.display = 'inline-block';
    } else {
      if (licenseBadge) licenseBadge.style.display = 'none';
      if (upgradeBtn) {
        upgradeBtn.textContent = 'Upgrade to Premium - $49 Lifetime';
        upgradeBtn.disabled = false;
        upgradeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        upgradeBtn.style.cursor = 'pointer';
      }
      if (manageBtn) manageBtn.style.display = 'none';
    }
  }

}

export { ScreenSmoothRecorderMethodsPart1 };
