class RecorderAdvancedMethodsPart1 {
  async createCompositedVideo() {
    // Redirect to optimized version
    return this.createOptimizedCompositedVideo();
  }


  async createCompositeVideoWithCanvas() {
    // Redirect to optimized version
    return this.createOptimizedCompositedVideo();
  }


  async createCompositedVideoWithCanvas() {
    // Redirect to optimized version
    return this.createOptimizedCompositedVideo();
  }

  // Inject cursor script into the recorded tab

  async injectCursorScript() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        console.warn('No active tab found for cursor injection');
        return;
      }

      console.log('�x}� Injecting cursor script into tab:', tab.id);

      const injectionCheck = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => !!window.screenSmoothContent
      });

      if (injectionCheck?.[0]?.result) {
        console.log('�S& Cursor/content script already available in tab');
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content.js']
      });

      console.log('�S& Cursor script injected successfully');
    } catch (error) {
      console.error('�R Failed to inject cursor script:', error);
    }
  }

  // Remove cursor script from the recorded tab

  async removeCursorScript() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        return;
      }

      console.log('�x�� Removing cursor script from tab:', tab.id);

      // Send cleanup message to content script
      await chrome.tabs.sendMessage(tab.id, { action: 'cleanup-cursor' });

      console.log('�S& Cursor script removed successfully');
    } catch (error) {
      console.warn('Failed to remove cursor script:', error);
    }
  }

  // === SCREEN STUDIO CURSOR PREMIUM === Fully spring-driven cursor update
  // Uses createSpring() channels for X, Y, scale, and rotation � same system as zoom
  // Click scale: 70% snap on mousedown, bouncy spring-back on mouseup (T:420, F:18)
  // Velocity rotation: ±12° tilt based on horizontal velocity, springs to 0° when stopped

  updateSmoothCursor(targetX, targetY, isPressed, state = null, dt = 1/60) {
    // Determine which state to update (custom state or this instance)
    const s = state || this;

    // === SCREEN STUDIO MATCH === Clamp dt to avoid explosion after tab-switch
    dt = Math.min(dt, 0.064);

    // Ensure cursor spring channels exist (lazy init, same pattern as zoom)
    const springs = this.ensureCursorSprings(s);

    // ������ POSITION: Step X and Y springs toward raw cursor target ������
    springs.x.update(targetX, dt);
    springs.y.update(targetY, dt);
    s.smoothCursor.x = springs.x.position;
    s.smoothCursor.y = springs.y.position;
    s.cursorVelocity.x = springs.x.velocity;
    s.cursorVelocity.y = springs.y.velocity;

    // ������ CLICK SCALE ANIMATION (Screen Studio Premium) ������
    // === SCREEN STUDIO CURSOR PREMIUM ===
    // mousedown �  instant snap to 70% (no spring, immediate)
    // mouseup   �  spring back to 100% with bouncy overshoot (T:420 F:18)
    if (isPressed && !s.wasCursorPressed) {
      // Mousedown just happened �  snap scale spring to 0.7 instantly
      springs.scale.position = 0.70;
      springs.scale.velocity = 0; // Kill any existing velocity
      springs.scale.target = 0.70;
    }
    // Target: 70% while pressed, 100% when released (spring handles the bounce)
    const scaleTarget = isPressed ? 0.70 : 1.0;
    springs.scale.update(scaleTarget, dt);
    s.cursorScale = springs.scale.position;

    // ������ VELOCITY-BASED ROTATION (Screen Studio Premium) ������
    // === SCREEN STUDIO CURSOR PREMIUM ===
    // Non-linear tilt: slow moves �  barely any rotation, fast moves �  full ±12°
    // Uses power curve (exponent 1.8) so tilt ramps up naturally with speed
    const velX = springs.x.velocity;
    const absVel = Math.abs(velX);
    // Dead zone: ignore very slow movement (< 2 px/frame) to prevent micro-jitter tilt
    if (absVel < 2) {
      springs.rotation.update(0, dt);
    } else {
      // Non-linear: normalize velocity, apply power curve, then scale to max angle
      // velNorm ~0-1 range (clamped), pow(1.8) makes slow = tiny, fast = big
      const velNorm = Math.min(1, absVel / 300); // 300 px/s = full tilt
      const tiltMagnitude = Math.pow(velNorm, 1.8) * 12; // max ±12 degrees
      const tiltDirection = velX > 0 ? 1 : -1;
      springs.rotation.update(tiltMagnitude * tiltDirection, dt);
    }
    s.cursorRotation = springs.rotation.position;
  }

  // === SCREEN STUDIO CURSOR PREMIUM === Draw cursor overlay with spring-driven position, scale, rotation

  drawCursorOverlay(ctx, videoX, videoY, videoWidth, videoHeight, zoomState = null, timeOverride = null, cursorStateOverride = null) {
    // Check if cursor should be shown (skip rendering if disabled)
    const cursorSettings = window.cursorSettingsManager?.getSettings();
    if (cursorSettings && cursorSettings.showCursor === false) {
      return;
    }
    const cursorStyle = cursorSettings?.cursorStyle || 'classic';

    // Validate prerequisites
    if (!this.cursorData || !Array.isArray(this.cursorData) || this.cursorData.length === 0) {
      return; // No cursor data available
    }

    if (!this.previewVideo || !this.previewVideo.videoWidth || !this.previewVideo.videoHeight) {
      return; // Video dimensions not available
    }

    // Determine which state to use
    const s = cursorStateOverride || this;

    // Get current video time to find corresponding cursor data
    const videoTime = timeOverride !== null ? timeOverride : this.previewVideo.currentTime;
    const currentTime = videoTime * 1000; // Convert to ms

    // Use raw cursor data for real-time smoothing
    const cursorDataSource = (this.rawCursorData && this.rawCursorData.length > 0)
      ? this.rawCursorData
      : this.cursorData;

    // Get cursor state from processor (raw position lookup)
    const cursorState = this.cursorProcessor.getCursorAtTime(cursorDataSource, currentTime);

    if (cursorState) {
      // Calculate cursor size early (used for ripples and cursor)
      const sizeMultiplier = Number.isFinite(cursorSettings?.cursorSize)
        ? cursorSettings.cursorSize
        : (parseFloat(document.getElementById('cursor-size')?.value) || 1);
      let size = 40 * sizeMultiplier;

      // Map coordinates to video dimensions
      const windowWidth = cursorState.windowWidth || cursorState.viewportWidth || this.previewVideo.videoWidth;
      const windowHeight = cursorState.windowHeight || cursorState.viewportHeight || this.previewVideo.videoHeight;
      
      const scaleX = windowWidth ? (videoWidth / windowWidth) : 1;
      const scaleY = windowHeight ? (videoHeight / windowHeight) : 1;

      // Raw target position in canvas coordinates
      const cursorX = videoX + (cursorState.x * scaleX);
      const cursorY = videoY + (cursorState.y * scaleY);

      // Track time/delta for time-independent physics
      // Use different time sources for preview and export
      const isExport = !!cursorStateOverride;
      const physicsTimeSource = isExport ? currentTime : performance.now();
      
      if (s.lastUpdateTime === undefined) s.lastUpdateTime = physicsTimeSource;
      const dt = (physicsTimeSource - s.lastUpdateTime) / 1000; // Delta in seconds
      
      // === SCREEN STUDIO CURSOR PREMIUM === Update all spring channels
      // Position + scale + rotation are all spring-driven via updateSmoothCursor
      if (dt > 0 || !isExport) {
        const effectiveDt = isExport ? dt : Math.min(0.05, dt);
        if (effectiveDt > 0) {
          this.updateSmoothCursor(cursorX, cursorY, cursorState.isPressed, s, effectiveDt);
        }
        s.lastUpdateTime = physicsTimeSource;
      }

      // === SCREEN STUDIO CURSOR PREMIUM === Click ripples at visual cursor position
      if (cursorState.isPressed && !s.wasCursorPressed) {
        s.activeRipples.push({
          x: s.smoothCursor.x,
          y: s.smoothCursor.y,
          startTime: currentTime
        });
      }
      s.wasCursorPressed = cursorState.isPressed;

      // Draw and update ripples
      const rippleDuration = 400; // ms

      // Filter out old ripples
      s.activeRipples = s.activeRipples.filter(ripple =>
        currentTime - ripple.startTime < rippleDuration
      );

      // Draw active ripples (behind cursor)
      s.activeRipples.forEach(ripple => {
        const progress = (currentTime - ripple.startTime) / rippleDuration;
        if (progress >= 0 && progress <= 1) {
          this.cursorProcessor.drawRipple(
            ctx,
            ripple.x,
            ripple.y,
            progress,
            size
          );
        }
      });

      // Classic style requires image; vector styles do not
      if (cursorStyle === 'classic' && !this.cursorProcessor.cursorImage) {
        console.warn('�a�️ Cursor image not loaded yet, attempting to load...');
        if (!this.cursorProcessor.isLoadingCursor) {
          this.cursorProcessor.loadCursorImageAsync();
        }
        return;
      }

      // Adjust size to remain constant visually when zoomed (inverse scaling)
      if (zoomState && (zoomState.isActive || (zoomState.intensity && zoomState.intensity > 1.01))) {
        const intensity = zoomState.intensity || 1;
        if (intensity > 1.01) {
          size = size / intensity;
        }
      }

      // Apply zoom transformation if active
      // This ensures the cursor moves correctly with the zoomed video
      if (zoomState && (zoomState.isActive || (zoomState.intensity && zoomState.intensity > 1.01))) {
        const intensity = zoomState.intensity || 1;
        const position = zoomState.position || { x: 0.5, y: 0.5 };

        if (intensity > 1.01) {
          ctx.save();

          const zoomCenterX = videoX + (position.x * videoWidth);
          const zoomCenterY = videoY + (position.y * videoHeight);

          ctx.translate(zoomCenterX, zoomCenterY);
          ctx.scale(intensity, intensity);
          ctx.translate(-zoomCenterX, -zoomCenterY);
        }
      }

      // === SCREEN STUDIO CURSOR PREMIUM === Draw cursor with spring-driven scale + rotation
      // s.cursorScale comes from the click scale spring (70% snap + bouncy return)
      // s.cursorRotation comes from the velocity rotation spring (±12° tilt)
      this.cursorProcessor.drawCursorAt(
        ctx,
        s.smoothCursor.x,
        s.smoothCursor.y,
        size,
        s.cursorScale,    // Spring-driven click scale (0.7 �  1.0 with bounce)
        s.cursorRotation, // Spring-driven velocity tilt (±12° max)
        s.cursorVelocity?.x || 0,
        s.cursorVelocity?.y || 0,
        Number.isFinite(cursorState.opacity) ? cursorState.opacity : 1,
        cursorStyle
      );

      // Restore context if we applied zoom
      if (zoomState && (zoomState.isActive || (zoomState.intensity && zoomState.intensity > 1.01))) {
        if ((zoomState.intensity || 1) > 1.01) {
          ctx.restore();
        }
      }
    }
  }


  // Method to store cursor data from content script

  storeCursorData(cursorEvent) {
    // DIAGNOSTIC: Log all calls to storeCursorData
    console.log('�x� [RECORD] storeCursorData called:', {
      hasEvent: !!cursorEvent,
      x: cursorEvent?.x,
      y: cursorEvent?.y,
      type: cursorEvent?.type,
      timestamp: cursorEvent?.timestamp
    });

    // Validate cursor event data
    if (!cursorEvent || typeof cursorEvent !== 'object') {
      console.warn('�R [RECORD] Invalid cursor event data:', cursorEvent);
      return;
    }

    // Ensure cursorData array exists
    if (!this.cursorData) {
      this.cursorData = [];
      console.log('�x� [RECORD] Initialized cursorData array');
    }

    // Validate required fields
    if (typeof cursorEvent.x !== 'number' || typeof cursorEvent.y !== 'number') {
      console.warn('�R [RECORD] Invalid cursor coordinates:', cursorEvent);
      return;
    }

    // Store cursor data with timestamp AND all dimensional data from content script
    const cursorData = {
      x: cursorEvent.x,
      y: cursorEvent.y,
      type: cursorEvent.type || 'move',
      timestamp: cursorEvent.timestamp || Date.now(),
      button: cursorEvent.button || 0,
      // CRITICAL: Preserve dimensional data from content script for accurate zoom positioning
      // Map windowWidth/Height (from content script) to viewportWidth/Height (expected by processor)
      viewportWidth: cursorEvent.windowWidth || cursorEvent.viewportWidth,
      viewportHeight: cursorEvent.windowHeight || cursorEvent.viewportHeight,
      // ALSO store as windowWidth/Height because cursor-processor.js reads these specific properties
      windowWidth: cursorEvent.windowWidth || cursorEvent.viewportWidth,
      windowHeight: cursorEvent.windowHeight || cursorEvent.viewportHeight,
      screenWidth: cursorEvent.screenWidth,
      screenHeight: cursorEvent.screenHeight,
      scrollX: cursorEvent.scrollX,
      scrollY: cursorEvent.scrollY,
      // Capture element dimensions for typing/selection zoom
      width: cursorEvent.width,
      height: cursorEvent.height
    };

    if (this.cursorData.length === 0) {
      console.log('�x� [DEBUG] First cursor data received:', {
        timestamp: cursorData.timestamp,
        recordingStart: this.recordingStartTimestamp,
        diff: cursorData.timestamp - (this.recordingStartTimestamp || 0)
      });
    }

    this.cursorData.push(cursorData);

    // �x� DIAGNOSTIC: Log first few cursor points with raw timestamps
    if (this.cursorData.length <= 3) {
      console.log(`�S& [RECORD] Cursor data stored #${this.cursorData.length}:`, {
        timestamp: cursorData.timestamp,
        x: cursorData.x,
        y: cursorData.y,
        recordingStartTimestamp: this.recordingStartTimestamp || 'NOT SET YET'
      });
    } else if (this.cursorData.length % 20 === 0) {
      console.log(`�S& [RECORD] Cursor data stored. Array length: ${this.cursorData.length}, latest timestamp: ${cursorData.timestamp}`);
    }

    // Debug logging for clicks to verify data flow
    if (cursorData.type === 'click') {
      console.log(`�x�️ CLICK EVENT RECEIVED:`, {
        position: { x: cursorData.x, y: cursorData.y },
        viewport: { w: cursorData.viewportWidth, h: cursorData.viewportHeight },
        screen: { w: cursorData.screenWidth, h: cursorData.screenHeight },
        scroll: { x: cursorData.scrollX, y: cursorData.scrollY },
        zoomMode: this.zoomMode,
        isRecording: this.isRecording
      });
    }

    // === SCREEN STUDIO MATCH === Store raw cursor positions for velocity calculation
    // Normalized coordinates (0-1) for resolution-independent velocity tracking
    if (!this.rawCursorPositions) this.rawCursorPositions = [];
    const vw = cursorData.viewportWidth || cursorData.windowWidth || 1920;
    const vh = cursorData.viewportHeight || cursorData.windowHeight || 1080;
    this.rawCursorPositions.push({
      x: cursorData.x / vw,   // Normalized 0-1
      y: cursorData.y / vh,   // Normalized 0-1
      t: cursorData.timestamp
    });
    // Keep only last 100 positions to avoid unbounded memory growth
    if (this.rawCursorPositions.length > 100) {
      this.rawCursorPositions = this.rawCursorPositions.slice(-50);
    }

    // === SCREEN STUDIO MATCH === Intent-based storage for post-recording segment generation
    // During recording: only store meaningful user intent events
    if (this.zoomMode === 'auto' && this.isRecording &&
        (cursorData.type === 'click' || cursorData.type === 'selection' || cursorData.type === 'typing')) {
      if (!this.autoZoomIntentEvents) this.autoZoomIntentEvents = [];
      this.autoZoomIntentEvents.push({
        x: cursorData.x,
        y: cursorData.y,
        timestamp: cursorData.timestamp,
        type: cursorData.type,
        viewportWidth: cursorData.viewportWidth,
        viewportHeight: cursorData.viewportHeight,
        screenWidth: cursorData.screenWidth,
        screenHeight: cursorData.screenHeight,
        scrollX: cursorData.scrollX,
        scrollY: cursorData.scrollY,
        width: cursorData.width,
        height: cursorData.height
      });
      console.log(`�x}� [AUTO-ZOOM] Stored ${cursorData.type} intent #${this.autoZoomIntentEvents.length} for post-recording processing`);
    }

    // === SCREEN STUDIO MATCH === No 30-second cutoff � keep ALL cursor data for the entire recording
    console.log(`�S& [RECORD] Cursor data stored. Total entries: ${this.cursorData.length}`);
  }

  // === SCREEN STUDIO MATCH === Generate zoom segments from stored intent events (post-recording)
}

export { RecorderAdvancedMethodsPart1 };
