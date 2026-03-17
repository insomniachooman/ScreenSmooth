class RecorderMediaExportMethodsPart4 {
  handleDragging(event) {
    // Handle progress bar dragging
    if (this.isDraggingProgress) {
      if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0)
        return;

      const rect = this.progressBarContainer.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
      const time = percentage * this.videoDuration;

      this.previewVideo.currentTime = time;
      this.progressFill.style.width = `${percentage * 100}%`;
      this.progressHandle.style.left = `${percentage * 100}%`;
      return;
    }

    // Handle timeline trim handle dragging
    if (
      !this.isDragging ||
      !Number.isFinite(this.videoDuration) ||
      this.videoDuration <= 0
    ) {
      return;
    }

    const rect = this.timelineTrack.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    const time = percentage * this.videoDuration;

    if (this.dragHandle === "left") {
      this.trimStart = Math.min(time, this.trimEnd - 0.1);
    } else {
      this.trimEnd = Math.max(time, this.trimStart + 0.1);
    }

    this.updateTrimHandles();
    this.updateSelectedRangeOverlay();
    this.updateSelectedDuration();

    // Update video current time to match the handle being dragged
    if (this.dragHandle === "left") {
      this.previewVideo.currentTime = this.trimStart;
    } else {
      this.previewVideo.currentTime = this.trimEnd;
    }
  }


  stopDragging() {
    if (this.isDraggingProgress) {
      this.isDraggingProgress = false;
      document.body.style.userSelect = "";
      return;
    }

    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    this.dragHandle = null;

    // Remove dragging classes
    this.trimHandleLeft.classList.remove("dragging");
    this.trimHandleRight.classList.remove("dragging");

    // Restore text selection
    document.body.style.userSelect = "";
  }


  updateTrimHandles() {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const leftPosition = (this.trimStart / this.videoDuration) * 100;
    const rightPosition = (this.trimEnd / this.videoDuration) * 100;

    this.trimHandleLeft.style.left = `${leftPosition}%`;
    this.trimHandleRight.style.left = `${rightPosition}%`;
  }


  updateSelectedRangeOverlay() {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const leftPosition = (this.trimStart / this.videoDuration) * 100;
    const rightPosition = (this.trimEnd / this.videoDuration) * 100;
    const width = rightPosition - leftPosition;

    this.selectedRangeOverlay.style.left = `${leftPosition}%`;
    this.selectedRangeOverlay.style.width = `${width}%`;
  }


  updateSelectedDuration() {
    const duration = this.trimEnd - this.trimStart;
    this.selectedDurationText.textContent = this.formatTime(duration);
  }


  updateVideoPreview() {
    // Get current values
    this.currentPadding = parseInt(this.videoPadding.value) || 0;
    this.currentBlur = parseFloat(this.videoBlur.value) || 0;
    this.currentBorderRadius = parseInt(this.videoBorderRadius.value) || 0;

    // Update value displays
    this.paddingValue.textContent = `${this.currentPadding}px`;
    this.blurValue.textContent = `${this.currentBlur}px`;
    this.borderRadiusValue.textContent = `${this.currentBorderRadius}px`;

    // Invalidate blur caches when blur value changes
    if (this.lastBlurValue !== this.currentBlur) {
      this.blurredBackgroundCache = null;
      this.exportBlurredBackgroundCache = null;
      ('Blur cache invalidated due to blur value change');
    }

    ("Video preview updated with visual effects");

    // Always use canvas for video preview since we have default border radius
    if (this.previewVideo.src) {
      this.previewVideo.style.display = 'none';
      this.previewCanvas.style.display = 'block';

      // Re-render current frame to canvas if video is loaded
      if (this.previewVideo.readyState >= 2) {
        this.renderToCanvas();
      }
    }
  }


  startCanvasRendering() {
    // PERFORMANCE: Clear any existing rendering to prevent crashes
    this.stopCanvasRendering();

    ('Starting enhanced canvas rendering for smooth zoom transitions');

    let frameCount = 0;
    let lastFrameTime = 0;

    const renderFrame = (currentFrameTime) => {
      // Enhanced FPS control for smooth zoom animations
      const deltaTime = currentFrameTime - lastFrameTime;

      // Target 30 FPS for smooth zoom animations (33.33ms per frame)
      if (deltaTime >= 33.33) {
        frameCount++;
        lastFrameTime = currentFrameTime;

        // Always render during zoom transitions for smoothness
        const hasActiveZoom = this.currentZoomState?.isActive;
        const isZoomTransitioning = this.currentZoomState?.intensity !== 1 && this.currentZoomState?.intensity !== undefined;
        const isTransitioning = hasActiveZoom || isZoomTransitioning || this.zoomAnimationStartState;

        if (this.isPlaying || isTransitioning) {
          this.renderToCanvas();
        }
      }

      // Continue rendering if video is playing or zoom is transitioning
      const shouldContinueRendering = this.isPlaying ||
        (this.currentZoomState?.intensity !== 1 && this.currentZoomState?.intensity !== undefined) ||
        (this.currentZoomState?.isActive && this.zoomSegments?.length > 0) ||
        this.zoomAnimationStartState; // Keep rendering during transitions

      if (shouldContinueRendering) {
        this.canvasRenderRequestId = requestAnimationFrame(renderFrame);
      } else {
        // Stop rendering when not needed
        this.canvasRenderRequestId = null;
        ('Stopped canvas rendering - no active animations');
      }
    };

    this.canvasRenderRequestId = requestAnimationFrame(renderFrame);
  }


  stopCanvasRendering() {
    if (this.canvasRenderInterval) {
      clearInterval(this.canvasRenderInterval);
      this.canvasRenderInterval = null;
    }
    if (this.canvasRenderRequestId) {
      cancelAnimationFrame(this.canvasRenderRequestId);
      this.canvasRenderRequestId = null;
    }
  }

  // Helper function to calculate aspect ratio dimensions

  calculateAspectRatioDimensions(baseWidth, baseHeight, aspectRatio) {
    if (aspectRatio === "native") {
      return { width: baseWidth, height: baseHeight };
    }

    // Parse aspect ratio string (e.g., "16:9" -> [16, 9])
    const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
    const targetRatio = ratioWidth / ratioHeight;

    // Calculate canvas dimensions based on video size and target aspect ratio
    let canvasWidth, canvasHeight;

    // Use the larger dimension to maintain video visibility
    const videoRatio = baseWidth / baseHeight;

    if (targetRatio > videoRatio) {
      // Target is wider - expand width, keep video height-based scaling
      canvasHeight = baseHeight;
      canvasWidth = canvasHeight * targetRatio;
    } else {
      // Target is taller - expand height, keep video width-based scaling  
      canvasWidth = baseWidth;
      canvasHeight = canvasWidth / targetRatio;
    }

    return {
      width: Math.round(canvasWidth),
      height: Math.round(canvasHeight)
    };
  }

  // Update aspect ratio and re-render

  updateAspectRatio() {
    this.currentAspectRatio = this.aspectRatioSelect.value;
    ('Aspect ratio changed to:', this.currentAspectRatio);
    this.updateVideoPreview();
  }

  // Helper function to draw background image with cover behavior (like CSS background-size: cover)

  drawBackgroundImageCover(ctx, image, canvasWidth, canvasHeight) {
    const imageAspect = image.width / image.height;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspect > canvasAspect) {
      // Image is wider than canvas - fit to height and crop sides
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageAspect;
      drawX = (canvasWidth - drawWidth) / 2; // Center horizontally
      drawY = 0;
    } else {
      // Image is taller than canvas - fit to width and crop top/bottom
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageAspect;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2; // Center vertically
    }

    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  // Helper function to draw rounded rectangle

  drawRoundedRect(ctx, x, y, width, height, radius) {
    if (radius <= 0) {
      ctx.rect(x, y, width, height);
      return;
    }

    // Ensure radius doesn't exceed half the width or height
    radius = Math.min(radius, Math.min(width, height) / 2);

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Helper function to draw video with rounded corners

  drawVideoWithBorderRadius(ctx, video, x, y, width, height, borderRadius) {
    if (borderRadius <= 0) {
      // No border radius, draw normally
      ctx.drawImage(video, x, y, width, height);
      return;
    }

    // Save the current context state
    ctx.save();

    // Create a clipping path with rounded corners
    this.drawRoundedRect(ctx, x, y, width, height, borderRadius);
    ctx.clip();

    // Draw the video within the clipped area
    ctx.drawImage(video, x, y, width, height);

    // Restore the context state
    ctx.restore();
  }

}

export { RecorderMediaExportMethodsPart4 };
