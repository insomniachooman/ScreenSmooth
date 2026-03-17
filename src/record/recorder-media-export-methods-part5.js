class RecorderMediaExportMethodsPart5 {
  renderToCanvas() {
    // PERFORMANCE: Add throttling to prevent excessive rendering
    const now = performance.now();
    if (this.lastRenderTime && (now - this.lastRenderTime) < 16) { // ~60 FPS limit
      return;
    }
    this.lastRenderTime = now;

    // Check if video has data with enhanced logging and retry
    if (this.previewVideo.readyState < 2) {
      ('Video not ready for rendering. ReadyState:', this.previewVideo.readyState, 'Expected: >= 2');

      // If video is not ready, try waiting a bit and retry
      if (!this.videoRetryAttempts) {
        this.videoRetryAttempts = 0;
      }

      if (this.videoRetryAttempts < 3) {
        this.videoRetryAttempts++;
        setTimeout(() => {
          this.renderToCanvas();
        }, 100 * this.videoRetryAttempts); // Exponential backoff
      }

      return; // HAVE_CURRENT_DATA
    }

    // Reset retry attempts when video is ready
    this.videoRetryAttempts = 0;

    // PERFORMANCE: Reduce debug logging
    // Get base video dimensions
    const baseWidth = this.previewVideo.videoWidth || 1920;
    const baseHeight = this.previewVideo.videoHeight || 1080;

    // Calculate canvas dimensions based on aspect ratio
    const canvasDimensions = this.calculateAspectRatioDimensions(baseWidth, baseHeight, this.currentAspectRatio);

    // Set canvas dimensions with padding
    this.previewCanvas.width = canvasDimensions.width + (this.currentPadding * 2);
    this.previewCanvas.height = canvasDimensions.height + (this.currentPadding * 2);

    // Clear canvas
    this.previewCanvasCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);

    // Check if we need to regenerate blurred background cache
    const needsBlurCache = this.currentBlur > 0 &&
      (this.lastBlurValue !== this.currentBlur ||
        this.lastBackgroundValue !== this.currentBackground ||
        this.lastCanvasWidth !== this.previewCanvas.width ||
        this.lastCanvasHeight !== this.previewCanvas.height);

    if (needsBlurCache) {
      ('Regenerating blurred background cache for performance - cache invalidated due to:');
      if (this.lastBlurValue !== this.currentBlur) ('  - Blur value changed:', this.lastBlurValue, '->', this.currentBlur);
      if (this.lastBackgroundValue !== this.currentBackground) ('  - Background changed:', this.lastBackgroundValue, '->', this.currentBackground);
      if (this.lastCanvasWidth !== this.previewCanvas.width) ('  - Canvas width changed:', this.lastCanvasWidth, '->', this.previewCanvas.width);
      if (this.lastCanvasHeight !== this.previewCanvas.height) ('  - Canvas height changed:', this.lastCanvasHeight, '->', this.previewCanvas.height);

      this.generateBlurredBackgroundCache();
      this.lastBlurValue = this.currentBlur;
      this.lastBackgroundValue = this.currentBackground;
      this.lastCanvasWidth = this.previewCanvas.width;
      this.lastCanvasHeight = this.previewCanvas.height;
    }

    // Draw background - use cached version if blur is applied
    if (this.currentBlur > 0 && this.blurredBackgroundCache) {
      // Use pre-rendered blurred background for better performance
      ('Using cached blurred background');
      this.previewCanvasCtx.drawImage(this.blurredBackgroundCache, 0, 0);
    } else {
      // Draw background normally without blur
      ('Drawing background directly without blur');
      this.drawBackgroundDirect(this.previewCanvasCtx, this.previewCanvas.width, this.previewCanvas.height);
    }

    // Calculate video position - center the original video in the new canvas
    const availableWidth = this.previewCanvas.width - (this.currentPadding * 2);
    const availableHeight = this.previewCanvas.height - (this.currentPadding * 2);

    // Keep original video dimensions
    const videoWidth = baseWidth;
    const videoHeight = baseHeight;

    // Center the video within available space
    const videoX = this.currentPadding + (availableWidth - videoWidth) / 2;
    const videoY = this.currentPadding + (availableHeight - videoHeight) / 2;

    // Apply only screen effects to video (brightness, contrast, saturation) - NOT blur
    const videoFilters = [];
    if (this.currentBrightness !== 1 || this.currentContrast !== 1 || this.currentSaturation !== 1) {
      videoFilters.push(`brightness(${this.currentBrightness}) contrast(${this.currentContrast}) saturate(${this.currentSaturation})`);
    }

    if (videoFilters.length > 0) {
      this.previewCanvasCtx.filter = videoFilters.join(' ');
    }

    // Apply zoom if we have any zoom segments OR if we're transitioning out of zoom OR during real-time recording
    const currentTime = this.previewVideo.currentTime;
    const activeZoom = this.getZoomSegmentAtTime(currentTime);
    const zoomState = this.getZoomStateAtTime(currentTime);

    // === SCREEN STUDIO MATCH === No real-time zoom during recording, only post-recording segments
    const useRealtimeZoom = false;

    // Apply zoom transformation if we have active zoom OR smooth transition is happening
    if (activeZoom || (zoomState && zoomState.isActive)) {
      // Apply zoom transformation with spring physics transitions
      this.applyZoomTransformation(activeZoom, videoX, videoY, videoWidth, videoHeight, useRealtimeZoom);
    } else {
      // No zoom - draw video frame normally
      try {
        this.drawVideoWithBorderRadius(
          this.previewCanvasCtx,
          this.previewVideo,
          videoX, videoY, videoWidth, videoHeight,
          this.currentBorderRadius
        );
      } catch (e) {
        ("Failed to draw video frame to canvas:", e);
      }
    }

    // Reset filter
    this.previewCanvasCtx.filter = 'none';

    // Draw cursor overlay on top of video
    this.drawCursorOverlay(
      this.previewCanvasCtx,
      videoX,
      videoY,
      videoWidth,
      videoHeight,
      // Pass zoom state for correct cursor positioning
      useRealtimeZoom ? this.currentZoomState : (zoomState?.isActive ? zoomState : (activeZoom || null))
    );
  }


  applyZoomTransformation(zoomSegment, videoX, videoY, videoWidth, videoHeight) {
    const ctx = this.previewCanvasCtx;

    // === FIX: DO NOT call getZoomStateAtTime again! It was already called in renderToCanvas.
    // Calling it twice per frame double-steps the spring, causing jitter.
    // Just read the already-computed state from this.currentZoomState.
    const zoomState = this.currentZoomState;

    // Use smooth zoom state if available, otherwise use direct segment values
    let zoomIntensity = 1;
    let zoomPosition = { x: 0.5, y: 0.5 };

    if (zoomState && zoomState.isActive) {
      // Use smooth transition values
      zoomIntensity = zoomState.intensity;
      zoomPosition = zoomState.position;
    } else if (zoomSegment) {
      // Use direct segment values as fallback
      zoomIntensity = zoomSegment.intensity || 1.5;
      zoomPosition = zoomSegment.position || { x: 0.5, y: 0.5 };
    }

    // If no zoom is needed, draw normally
    if (zoomIntensity <= 1.01) {
      try {
        this.drawVideoWithBorderRadius(
          ctx,
          this.previewVideo,
          videoX, videoY, videoWidth, videoHeight,
          this.currentBorderRadius
        );
      } catch (e) {
        ("Failed to draw video frame:", e);
      }
      return;
    }

    // Apply zoom transformation
    ctx.save();

    const zoomCenterX = videoX + (zoomPosition.x * videoWidth);
    const zoomCenterY = videoY + (zoomPosition.y * videoHeight);

    ctx.translate(zoomCenterX, zoomCenterY);
    ctx.scale(zoomIntensity, zoomIntensity);
    ctx.translate(-zoomCenterX, -zoomCenterY);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      this.drawVideoWithBorderRadius(
        ctx,
        this.previewVideo,
        videoX, videoY, videoWidth, videoHeight,
        this.currentBorderRadius
      );
    } catch (e) {
      ("Failed to draw zoomed video frame:", e);
    }

    ctx.restore();

    // Keep rendering during transitions (especially important for zoom out)
    if (this.transitionStartTime && !this.canvasRenderRequestId && !this.isPlaying) {
      this.startCanvasRendering();
    }
  }


  applyExportZoomTransformation(ctx, zoomState, video, videoX, videoY, videoWidth, videoHeight) {
    let intensity = 1;
    let position = { x: 0.5, y: 0.5 };

    // Use the smoothly interpolated zoomState from getZoomStateAtTime
    if (zoomState && zoomState.isActive) {
      intensity = zoomState.intensity || 1;
      position = zoomState.position || { x: 0.5, y: 0.5 };
    } else {
      // No zoom � draw normally
      this.drawVideoWithBorderRadius(ctx, video, videoX, videoY, videoWidth, videoHeight, this.currentBorderRadius);
      return;
    }

    // Apply zoom transformation if intensity > 1
    if (intensity <= 1.01) {
      this.drawVideoWithBorderRadius(ctx, video, videoX, videoY, videoWidth, videoHeight, this.currentBorderRadius);
      return;
    }

    ctx.save();

    const zoomCenterX = videoX + (position.x * videoWidth);
    const zoomCenterY = videoY + (position.y * videoHeight);

    ctx.translate(zoomCenterX, zoomCenterY);
    ctx.scale(intensity, intensity);
    ctx.translate(-zoomCenterX, -zoomCenterY);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    try {
      this.drawVideoWithBorderRadius(ctx, video, videoX, videoY, videoWidth, videoHeight, this.currentBorderRadius);
    } catch (e) {
      ("Export: Failed to draw zoomed video frame:", e);
    }

    ctx.restore();
  }




  drawBackgroundImage() {
    // Handle solid colors
    if (this.currentBackground.startsWith('#') || this.currentBackground.startsWith('rgb')) {
      this.previewCanvasCtx.fillStyle = this.currentBackground;
      this.previewCanvasCtx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      return;
    }

    if (!this.backgroundImageCache) {
      // Load background image if not cached
      let imageUrl = this.currentBackground;
      if (imageUrl.startsWith('url(')) {
        imageUrl = imageUrl.slice(4, -1).replace(/["']/g, ""); // Remove url() wrapper and quotes
      }
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        this.backgroundImageCache = img;
        this.drawBackgroundImageCover(this.previewCanvasCtx, img, this.previewCanvas.width, this.previewCanvas.height);
      };
      img.onerror = () => {
        ('Failed to load background image for preview');
        // Fallback to black background
        this.previewCanvasCtx.fillStyle = '#000000';
        this.previewCanvasCtx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
      };
      img.src = imageUrl;
    } else {
      // Use cached image with cover behavior
      this.drawBackgroundImageCover(this.previewCanvasCtx, this.backgroundImageCache, this.previewCanvas.width, this.previewCanvas.height);
    }
  }


  loadBackgroundImageAsync() {
    const imageUrl = this.currentBackground.slice(4, -1).replace(/["']/g, ''); // Remove url() wrapper and quotes

    // Special handling for local wallpapers
    let absoluteUrl = imageUrl;
    if (imageUrl.startsWith('./bg/')) {
      // Convert relative path to absolute path by removing the leading ./
      absoluteUrl = imageUrl.substring(2);
      ('Converting relative path to absolute:', absoluteUrl);
    }

    // Check if we already have this exact image cached and loaded with improved matching
    if (this.backgroundImageCache &&
      this.backgroundImageCache.complete &&
      this.backgroundImageCache.naturalWidth > 0 &&
      (this.backgroundImageCache.src.endsWith(imageUrl.replace(/^\.\//, '')) ||
        this.backgroundImageCache.src.endsWith(absoluteUrl) ||
        this.backgroundImageCache.src.includes(absoluteUrl) ||
        this.backgroundImageCache.src.includes(imageUrl))) {
      ('Background image already cached and valid:', imageUrl);
      return Promise.resolve(); // Already cached and valid
    }

    ('Loading background image asynchronously:', absoluteUrl);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        ('Background image loaded successfully:', absoluteUrl, 'Size:', img.naturalWidth + 'x' + img.naturalHeight);

        // Validate the loaded image
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          this.backgroundImageCache = img;

          // Invalidate blur caches when new background image loads
          this.blurredBackgroundCache = null;
          this.exportBlurredBackgroundCache = null;
          this.lastBackgroundValue = null; // Force cache regeneration
          this.lastCanvasWidth = null;
          this.lastCanvasHeight = null;

          ('Background caches invalidated, re-rendering canvas');
          // Re-render canvas with the loaded background
          this.renderToCanvas();
          resolve();
        } else {
          ('Loaded image has invalid dimensions:', img.naturalWidth, 'x', img.naturalHeight);
          reject(new Error('Invalid image dimensions'));
        }
      };

      img.onerror = (error) => {
        ('Failed to load background image:', absoluteUrl, error);
        // Try with a different path if it's a local wallpaper
        if (imageUrl.startsWith('./bg/')) {
          // Try without the leading slash
          const altUrl = imageUrl.substring(2);
          ('Trying alternative path:', altUrl);
          // Create a new image object for the retry
          const retryImg = new Image();
          retryImg.crossOrigin = "Anonymous";
          retryImg.onload = () => {
            ('Background image loaded successfully on retry:', altUrl);
            this.backgroundImageCache = retryImg;
            // Invalidate blur caches when new background image loads
            this.blurredBackgroundCache = null;
            this.exportBlurredBackgroundCache = null;
            this.lastBackgroundValue = null;
            this.lastCanvasWidth = null;
            this.lastCanvasHeight = null;
            ('Background caches invalidated, re-rendering canvas');
            this.renderToCanvas();
            resolve();
          };
          retryImg.onerror = () => {
            ('Failed to load background image on retry:', altUrl);
            // Clear the cache to prevent stale data
            this.backgroundImageCache = null;
            reject(new Error('Failed to load background image'));
          };
          retryImg.src = altUrl;
        } else {
          // Clear the cache to prevent stale data
          this.backgroundImageCache = null;
          reject(new Error('Failed to load background image'));
        }
      };

      // Set the source to start loading with improved path handling
      if (absoluteUrl.startsWith('/bg/')) {
        // For local wallpapers, we need to load them relative to the extension
        img.src = chrome.runtime.getURL(absoluteUrl);
      } else if (imageUrl.startsWith('./bg/')) {
        // For local wallpapers with relative path, use chrome.runtime.getURL
        img.src = chrome.runtime.getURL(absoluteUrl);
      } else {
        img.src = absoluteUrl;
      }
      ('Started loading background image from:', img.src);
    });
  }

}

export { RecorderMediaExportMethodsPart5 };
