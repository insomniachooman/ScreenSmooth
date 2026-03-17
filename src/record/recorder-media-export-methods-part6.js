class RecorderMediaExportMethodsPart6 {
  updateScreenEffects() {
    // Get current values
    this.currentBrightness = parseFloat(this.screenBrightness.value) || 1;
    this.currentContrast = parseFloat(this.screenContrast.value) || 1;
    this.currentSaturation = parseFloat(this.screenSaturation.value) || 1;

    // Update value displays
    if (this.brightnessValue) {
      this.brightnessValue.textContent = `${Math.round(
        this.currentBrightness * 100
      )}%`;
    }
    if (this.contrastValue) {
      this.contrastValue.textContent = `${Math.round(
        this.currentContrast * 100
      )}%`;
    }
    if (this.saturationValue) {
      this.saturationValue.textContent = `${Math.round(
        this.currentSaturation * 100
      )}%`;
    }

    // Apply screen effects to video
    const video = this.previewVideo;
    const currentFilter = video.style.filter || "";

    // Remove existing brightness, contrast, saturate filters
    let newFilter = currentFilter
      .replace(/brightness\([^)]*\)/g, "")
      .replace(/contrast\([^)]*\)/g, "")
      .replace(/saturate\([^)]*\)/g, "")
      .trim();

    // Add new screen effects
    const screenEffects = [
      `brightness(${this.currentBrightness})`,
      `contrast(${this.currentContrast})`,
      `saturate(${this.currentSaturation})`,
    ];

    // Combine with existing filters (like blur)
    const allFilters = [newFilter, ...screenEffects].filter((f) => f).join(" ");
    video.style.filter = allFilters;

    ("Screen effects updated:", allFilters);
  }


  generateBlurredBackgroundCache() {
    // Create an off-screen canvas for the blurred background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.previewCanvas.width;
    tempCanvas.height = this.previewCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Apply blur filter
    tempCtx.filter = `blur(${this.currentBlur}px)`;

    // Draw background to temp canvas with blur
    this.drawBackgroundDirect(tempCtx, tempCanvas.width, tempCanvas.height);

    // Reset filter
    tempCtx.filter = 'none';

    // Cache the blurred result
    this.blurredBackgroundCache = tempCanvas;
  }


  drawBackgroundDirect(ctx, width, height) {
    // Handle solid colors first
    if (this.currentBackground && !this.currentBackground.startsWith("url(")) {
      ctx.fillStyle = this.currentBackground;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Handle background images
    if (this.currentBackground.startsWith("url(")) {
      // Check if we have a valid cached image
      if (this.backgroundImageCache &&
        this.backgroundImageCache.complete &&
        this.backgroundImageCache.naturalWidth > 0) {
        // Draw the cached background image
        this.drawBackgroundImageCover(ctx, this.backgroundImageCache, width, height);
      } else {
        // Draw black background as fallback while loading
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      // Default black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    }
  }


  generateExportBlurredBackgroundCache(width, height) {
    // Create an off-screen canvas for the export blurred background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    // Apply blur filter
    tempCtx.filter = `blur(${this.currentBlur}px)`;

    // Draw background to temp canvas with blur
    this.drawBackgroundDirect(tempCtx, width, height);

    // Reset filter
    tempCtx.filter = 'none';

    // Cache the blurred result for export
    this.exportBlurredBackgroundCache = tempCanvas;
    (`Generated export blur cache: ${width}x${height}`);
  }


  async downloadRecording() {
    // Check DodoPayments license from chrome.storage.local
    const licenseCheck = await new Promise((resolve) => {
      chrome.storage.local.get(['dodoLicenseData'], (result) => {
        if (result.dodoLicenseData && result.dodoLicenseData.isValid) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    if (!licenseCheck) {
      alert("Export requires an active license. Please enter your license key.");
      if (window.showLicenseOverlay) {
        window.showLicenseOverlay(true);
      }
      return;
    }
    // Strict null checks for all critical elements
    if (!this.recordingBlob) {
      this.showError("No recording available to download");
      return;
    }

    if (!this.downloadBtn) {
      this.showError("Download button not found");
      return;
    }

    if (!this.previewVideo) {
      this.showError("Preview video element not found");
      return;
    }

    // Check if export is already in progress
    if (this.isExporting) {
      console.log('�a�️ Export already in progress, ignoring request');
      this.showInfo("Export already in progress, please wait...");
      return;
    }

    try {
      // Set export lock
      this.isExporting = true;
      
      // Reset export state to ensure clean slate
      this.resetExportState();

      // Disable download buttons and show exporting state
      this.setDownloadButtonState('exporting', 0);

      ("Starting download process...");
      this.updateStatusText("Preparing video for export...");

      // Validate recording before processing
      if (!this.validateRecording()) {
        throw new Error("Recording validation failed. Please record again.");
      }

      let finalBlob = this.recordingBlob;

      // Set up global timeout for entire export process (30 minutes max)
      const exportTimeout = setTimeout(() => {
        throw new Error("Export process timed out after 30 minutes. Please try a simpler export or record a shorter video.");
      }, 30 * 60 * 1000);

      try {
        // Wait for video metadata to be fully loaded with enhanced validation
        await this.waitForVideoMetadata();

        // Validate video duration after loading
        if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
          throw new Error("Invalid video duration detected. Please try recording again.");
        }

        ("Video validated - duration:", this.videoDuration, "seconds");

        // Check if we need any processing at all
        const needsProcessing = this.needsProcessing();

        if (!needsProcessing) {
          ("No processing needed, using original recording");
          this.updateStatusText("Preparing download...");

          // Validate original recording blob
          if (!this.recordingBlob || this.recordingBlob.size === 0) {
            throw new Error("Original recording is empty or corrupted");
          }

          ("Using original recording, size:", this.recordingBlob.size);
        } else {
          // Decide on processing strategy based on complexity
          const processingStrategy = this.determineProcessingStrategy();

          if (processingStrategy === 'canvas') {
            ("Using canvas-based processing...");
            this.updateStatusText("Applying visual effects...");
            finalBlob = await this.createOptimizedCompositedVideo();

            // Validate processed blob
            if (!finalBlob || finalBlob.size === 0) {
              ("Canvas processing returned empty blob, falling back to original");
              finalBlob = this.recordingBlob;
            }

            ("Canvas composition completed, blob size:", finalBlob.size);
          } else if (processingStrategy === 'ffmpeg') {
            ("Using FFmpeg-only processing...");
            this.updateStatusText("Converting and applying effects...");
            finalBlob = await this.processVideoWithFFmpeg(finalBlob);

            // Validate processed blob
            if (!finalBlob || finalBlob.size === 0) {
              ("FFmpeg processing returned empty blob, falling back to original");
              finalBlob = this.recordingBlob;
            }

            ("FFmpeg processing completed, blob size:", finalBlob.size);
          } else {
            ("Using hybrid processing...");
            // Apply canvas effects first if needed
            if (this.needsCanvasComposition()) {
              this.updateStatusText("Applying visual effects...");
              finalBlob = await this.createOptimizedCompositedVideo();

              // Validate canvas output before proceeding to FFmpeg
              if (!finalBlob || finalBlob.size === 0) {
                ("Canvas processing failed, skipping to FFmpeg with original");
                finalBlob = this.recordingBlob;
              }
            }
            // Then apply FFmpeg processing if needed
            console.log('�x}� [EXPORT] Checking FFmpeg availability:', {
              isFFmpegLoaded: this.isFFmpegLoaded,
              ffmpegExists: !!this.ffmpeg,
              format: this.formatSelect?.value
            });

            if (this.isFFmpegLoaded) {
              console.log('�x}� [EXPORT] FFmpeg is loaded, starting conversion...');
              this.updateStatusText("Converting format...");
              finalBlob = await this.processVideoWithFFmpeg(finalBlob);

              // Final validation
              if (!finalBlob || finalBlob.size === 0) {
                console.log("FFmpeg processing failed, using previous blob");
                finalBlob = this.recordingBlob;
              }
            } else {
              console.log("�x}� [EXPORT] FFmpeg NOT available, skipping format conversion!");
              this.updateStatusText("Format conversion skipped - using original format");
            }
          }
        }

        // Final validation before download
        if (!finalBlob || finalBlob.size === 0) {
          ('Final blob is empty! Using original recording as fallback.');
          finalBlob = this.recordingBlob;

          if (!finalBlob || finalBlob.size === 0) {
            throw new Error('Both processed and original recordings are empty. Please record again.');
          }
        }

        ('Final blob validation - Size:', finalBlob.size, 'Type:', finalBlob.type);

        // Clear the timeout as processing completed successfully
        clearTimeout(exportTimeout);

        // Create download
        this.updateStatusText("Preparing download...");
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.generateFileName();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showSuccess("Recording downloaded successfully!");
        this.updateStatusText("Export completed!");
        ("Download initiated");
      } catch (processingError) {
        clearTimeout(exportTimeout);
        throw processingError;
      }
    } catch (error) {
      ("Error downloading recording:", error);

      // Offer fallback option for complex exports that failed
      if (error.message.includes("timeout") || error.message.includes("processing")) {
        this.showError(error.message + " Would you like to download the original recording instead?");
        setTimeout(() => {
          if (confirm("Export failed. Download original recording without effects?")) {
            this.downloadOriginalRecording();
          }
        }, 2000);
      } else if (error.message.includes("FFmpeg not available")) {
        this.showError("Video processing engine failed to load. Try refreshing the page or downloading as WebM format.");
        setTimeout(() => {
          if (confirm("FFmpeg not loaded. Download original recording instead?")) {
            this.downloadOriginalRecording();
          }
        }, 2000);
      } else {
        this.showError("Failed to process and download recording: " + error.message);
      }
      this.updateStatusText("Export failed");
    } finally {
      // Release export lock
      this.isExporting = false;
      
      // Re-enable download buttons
      this.setDownloadButtonState('ready');
    }
  }


  setDownloadButtonState(state, progress = 0) {
    const buttons = [this.downloadBtn, this.downloadBtnRight].filter(Boolean);
    
    buttons.forEach(btn => {
      const progressBar = btn.querySelector('.btn-progress-bar');
      const textSpan = btn.querySelector('.btn-text');
      
      if (state === 'exporting') {
        btn.classList.add('is-exporting');
        btn.disabled = true;
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }
        if (textSpan) {
          textSpan.textContent = progress > 0 ? `Exporting... ${progress}%` : 'Preparing...';
        }
      } else if (state === 'ready') {
        btn.classList.remove('is-exporting');
        btn.disabled = false;
        if (progressBar) {
          progressBar.style.width = '0%';
        }
        if (textSpan) {
          textSpan.textContent = 'Download Recording';
        }
      }
    });
  }


  updateExportProgress(progress) {
    const buttons = [this.downloadBtn, this.downloadBtnRight].filter(Boolean);
    
    buttons.forEach(btn => {
      const progressBar = btn.querySelector('.btn-progress-bar');
      const textSpan = btn.querySelector('.btn-text');
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      if (textSpan) {
        textSpan.textContent = `Exporting... ${progress}%`;
      }
    });
  }


  determineProcessingStrategy() {
    // Determine the best processing strategy based on the effects applied
    const hasVisualEffects = this.needsCanvasComposition();
    const needsFormatChange = this.needsFFmpegProcessing();

    // If only format/trim changes needed, use FFmpeg only
    if (!hasVisualEffects && needsFormatChange) {
      return 'ffmpeg';
    }

    // If only visual effects needed, use canvas only
    if (hasVisualEffects && !needsFormatChange) {
      return 'canvas';
    }

    // If both needed, use hybrid approach
    if (hasVisualEffects && needsFormatChange) {
      return 'hybrid';
    }

    // No processing needed
    return 'none';
  }

}

export { RecorderMediaExportMethodsPart6 };
