class RecorderZoomMethodsPart1 {
  ensureZoomSprings(context = this) {
    if (!context._zoomSprings) {
      // Presets � ALL overdamped (ζ > 1) so there is ZERO bounce / oscillation
      // Rapid: T=80, F=20 �  ζ=1.12   Quick: T=30, F=14 �  ζ=1.28
      // Default: T=10, F=8 �  ζ=1.26  Slow: T=4, F=5 �  ζ=1.25
      const presets = { rapid: [80, 20], quick: [30, 14], default: [10, 8], slow: [4, 5] };
      const preset = presets[this.zoomAnimationPreset || 'default'] || presets.default;
      const T = preset[0];
      const F = preset[1];

      context._zoomSprings = {
        scale: this.constructor.createSpring(1, T, F),
        x:     this.constructor.createSpring(0.5, T, F),
        y:     this.constructor.createSpring(0.5, T, F),
        lastTime: null  // last currentTime used to compute dt
      };
    }
    return context._zoomSprings;
  }

  // === SCREEN STUDIO CURSOR PREMIUM === Lazily initialize 4 cursor spring channels
  // X, Y for position smoothing; scale for click animation; rotation for tilt
  // Reuses the same createSpring() system for consistency with zoom

  ensureCursorSprings(context = this) {
    if (!context._cursorSprings) {
      // === SCREEN STUDIO MATCH === Map user's smoothness preset to tension/friction
      // Screen Studio default = tension:280, friction:22 (our "Quick" preset)
      const cursorPresets = {
        0.3:  [400, 28],   // Rapid   (near-instant)
        0.15: [280, 22],   // Quick   (Screen Studio default)
        0.08: [160, 18],   // Default (smooth)
        0.03: [80, 14],    // Slow    (buttery)
        0.01: [40, 10],    // Ultra   (dreamy)
      };
      const stiffnessVal = (context.stiffness !== undefined) ? context.stiffness : (this.spring || 0.15);
      let T = 280, F = 22; // Default = Screen Studio match
      let bestDist = Infinity;
      for (const [key, val] of Object.entries(cursorPresets)) {
        const dist = Math.abs(parseFloat(key) - stiffnessVal);
        if (dist < bestDist) { bestDist = dist; T = val[0]; F = val[1]; }
      }

      context._cursorSprings = {
        // Position springs � smooth cursor movement with natural momentum
        x:        this.constructor.createSpring(0, T, F),
        y:        this.constructor.createSpring(0, T, F),
        // === SCREEN STUDIO CURSOR PREMIUM === Click scale spring (snappy + bouncy)
        // Faster/bouncier than position springs: tension:420, friction:18
        // Slightly underdamped for natural overshoot on mouseup
        scale:    this.constructor.createSpring(1, 420, 18),
        // === SCREEN STUDIO CURSOR PREMIUM === Rotation spring (smooth tilt settle)
        rotation: this.constructor.createSpring(0, 200, 20),
        lastTime: null
      };
    }
    return context._cursorSprings;
  }


  calculateDynamicZoomTarget(baseX, baseY, targetScale, currentTime) {
    let targetX = Number.isFinite(baseX) ? baseX : 0.5;
    let targetY = Number.isFinite(baseY) ? baseY : 0.5;

    // Ensure valid scale
    if (!Number.isFinite(targetScale) || targetScale < 1) targetScale = 1;

    // Find current cursor position
    const cursorDataSource = (this.rawCursorData && this.rawCursorData.length > 0)
      ? this.rawCursorData
      : this.cursorData;

    if (!cursorDataSource || cursorDataSource.length === 0) {
      return { x: targetX, y: targetY };
    }

    const cursorState = this.cursorProcessor.getCursorAtTime(cursorDataSource, currentTime * 1000);
    if (!cursorState || !Number.isFinite(cursorState.x) || !Number.isFinite(cursorState.y)) {
      return { x: targetX, y: targetY };
    }

    // Calculate video bounds with safe fallbacks
    const fallbackW = (this.previewVideo && this.previewVideo.videoWidth) || 1920;
    const fallbackH = (this.previewVideo && this.previewVideo.videoHeight) || 1080;
    const vw = Math.max(1, cursorState.windowWidth || cursorState.viewportWidth || fallbackW);
    const vh = Math.max(1, cursorState.windowHeight || cursorState.viewportHeight || fallbackH);

    // Normalized cursor coordinates (0 to 1)
    const cx = cursorState.x / vw;
    const cy = cursorState.y / vh;

    // Visible area size in normalized units (0 to 1)
    const visibleW = 1 / targetScale;
    const visibleH = 1 / targetScale;

    // Safe zone padding (pan when cursor gets within 25% of the screen edge)
    const edgePaddingRatioX = 0.25;
    const edgePaddingRatioY = 0.25;
    const safeRadiusX = (visibleW / 2) - (visibleW * edgePaddingRatioX);
    const safeRadiusY = (visibleH / 2) - (visibleH * edgePaddingRatioY);

    // Distance of cursor from the currently requested camera center
    const diffX = cx - targetX;
    const diffY = cy - targetY;

    // Shift the target center if the cursor attempts to exit the safe radius
    if (diffX < -safeRadiusX) {
      targetX = cx + safeRadiusX;
    } else if (diffX > safeRadiusX) {
      targetX = cx - safeRadiusX;
    }

    if (diffY < -safeRadiusY) {
      targetY = cy + safeRadiusY;
    } else if (diffY > safeRadiusY) {
      targetY = cy - safeRadiusY;
    }

    // Clamp targets to prevent panning out of bounds (which would reveal black borders)
    const minX = visibleW / 2;
    const maxX = 1 - minX;
    const minY = visibleH / 2;
    const maxY = 1 - minY;

    if (targetScale >= 1) {
      targetX = Math.max(minX, Math.min(maxX, targetX));
      targetY = Math.max(minY, Math.min(maxY, targetY));
    }

    return { x: targetX, y: targetY };
  }

  // === SCREEN STUDIO MATCH === Get zoom state with STATEFUL spring physics
  // Forces 100% full view outside any segment � no cursor following

  getZoomStateAtTime(currentTime, context = this) {
    // Initialize state if needed
    if (!context.currentZoomState) {
      context.currentZoomState = {
        intensity: 1,
        position: { x: 0.5, y: 0.5 },
        isActive: false
      };
    }

    // Initialize export mode flag if not set
    if (typeof this.isExportMode === 'undefined') {
      this.isExportMode = false;
    }

    // === SCREEN STUDIO MATCH === Find active segment
    const activeZoom = this.getZoomSegmentAtTime(currentTime);
    const resolveSegmentPosition = (zoomSegment, intensity) => {
      const basePos = zoomSegment.position || { x: 0.5, y: 0.5 };
      if (zoomSegment.mode === 'auto') {
        return this.calculateDynamicZoomTarget(basePos.x, basePos.y, intensity, currentTime);
      }
      // Manual (or missing mode) keeps user-selected fixed position.
      return { x: basePos.x, y: basePos.y };
    };

    // ------- SEEKING MODE: instant jump, no spring -------
    if (this.isSeekingMode && !this.isExportMode) {
      const springs = this.ensureZoomSprings(context);
      if (activeZoom) {
        const si = activeZoom.intensity && activeZoom.intensity >= 1.25
          ? activeZoom.intensity
          : (this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5);
        const adjustedPos = resolveSegmentPosition(activeZoom, si);
        context.currentZoomState.intensity = si;
        context.currentZoomState.position = { x: adjustedPos.x, y: adjustedPos.y };
        context.currentZoomState.isActive = true;
        // Snap springs so playback resumes without a jump
        springs.scale.snap(si);
        springs.x.snap(adjustedPos.x);
        springs.y.snap(adjustedPos.y);
      } else {
        context.currentZoomState.intensity = 1;
        context.currentZoomState.position = { x: 0.5, y: 0.5 };
        context.currentZoomState.isActive = false;
        springs.scale.snap(1);
        springs.x.snap(0.5);
        springs.y.snap(0.5);
      }
      springs.lastTime = currentTime;
      return context.currentZoomState;
    }

    // ------- SPRING-DRIVEN PLAYBACK / EXPORT -------
    const springs = this.ensureZoomSprings(context);

    // Compute delta-time from video currentTime
    let dt;
    if (springs.lastTime === null || Math.abs(currentTime - springs.lastTime) > 2.0) {
      // First frame or large jump �  snap springs to correct state (no animation)
      dt = 0;
      if (activeZoom) {
        const si = activeZoom.intensity && activeZoom.intensity >= 1.25
          ? activeZoom.intensity
          : (this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5);
        const adjustedPos = resolveSegmentPosition(activeZoom, si);
        springs.scale.snap(si);
        springs.x.snap(adjustedPos.x);
        springs.y.snap(adjustedPos.y);
      } else {
        springs.scale.snap(1);
        springs.x.snap(0.5);
        springs.y.snap(0.5);
      }
      springs.lastTime = currentTime;
    } else {
      dt = currentTime - springs.lastTime;
      springs.lastTime = currentTime;
    }

    // Don't run physics for zero or negative dt
    if (dt <= 0) {
      // Return current spring position as-is
      context.currentZoomState.intensity = Math.max(1, springs.scale.position);
      context.currentZoomState.position = { x: springs.x.position, y: springs.y.position };
      context.currentZoomState.isActive = springs.scale.position > 1.01;
      return context.currentZoomState;
    }

    // --- Determine target values ---
    let targetScale = 1;
    let targetX = 0.5;
    let targetY = 0.5;

    if (activeZoom) {
      // === Inside a zoom segment �  target = zoomed values ===
      targetScale = activeZoom.intensity && activeZoom.intensity >= 1.25
        ? activeZoom.intensity
        : (this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5);
      const adjustedPos = resolveSegmentPosition(activeZoom, targetScale);
      targetX = adjustedPos.x;
      targetY = adjustedPos.y;
    }
    // Outside segment �  targets are already 1, 0.5, 0.5 (forced 100% view)

    // --- Step the springs ---
    springs.scale.update(targetScale, dt);
    springs.x.update(targetX, dt);
    springs.y.update(targetY, dt);

    // Populate output
    context.currentZoomState.intensity = Math.max(1, springs.scale.position);
    context.currentZoomState.position = { x: springs.x.position, y: springs.y.position };
    context.currentZoomState.isActive =
      !springs.scale.settled || !springs.x.settled || !springs.y.settled || targetScale > 1.01;

    // Start canvas rendering if zoom is active and not playing
    if (context.currentZoomState.isActive && !this.isPlaying && !this.canvasRenderRequestId) {
      this.startCanvasRendering();
    }

    return context.currentZoomState;
  }


  async startCountdown() {
    return new Promise((resolve) => {
      const overlay = document.getElementById('countdown-overlay');
      console.log('�x" [COUNTDOWN] startCountdown called, overlay found:', !!overlay);
      
      if (!overlay) {
        console.log('�x" [COUNTDOWN] No overlay found, resolving immediately');
        resolve();
        return;
      }

      const number = overlay.querySelector('.countdown-number');
      const text = overlay.querySelector('.countdown-text');

      overlay.style.display = 'flex';
      let count = 3;
      const startTime = Date.now();
      console.log(`�x" [COUNTDOWN] Starting countdown at ${startTime}`);

      const update = () => {
        const elapsed = Date.now() - startTime;
        console.log(`�x" [COUNTDOWN] update() called - count: ${count}, elapsed: ${elapsed}ms`);
        
        if (count > 0) {
          if (number) number.textContent = count;
          if (text) text.textContent = 'Starting Recording...';
          document.title = `Starting in ${count}...`;
          console.log(`�x" [COUNTDOWN] Displaying: ${count}, scheduling next in 1000ms`);
          count--;
          setTimeout(update, 1000);
        } else {
          const totalTime = Date.now() - startTime;
          console.log(`�x" [COUNTDOWN] Countdown complete! Total time: ${totalTime}ms`);
          overlay.style.display = 'none';
          document.title = 'Recording...';
          resolve();
        }
      };

      update();
    });
  }


  processCursorDataWithSprings() {
    if (!this.cursorData || this.cursorData.length === 0) return;

    console.log('�S� Processing cursor data with Spring Physics...');
    console.log('�x� Raw Data Start:', this.cursorData.slice(0, 5));

    // FILTER: Remove ALL (0,0) points which are likely glitches
    // Also remove points with invalid coordinates
    const originalLength = this.cursorData.length;
    const filteredOut = [];
    this.cursorData = this.cursorData.filter((p, index) => {
      const isValid = (p.x !== 0 || p.y !== 0) && Number.isFinite(p.x) && Number.isFinite(p.y);
      if (!isValid) {
        // Track what we're filtering out
        filteredOut.push({ index, x: p.x, y: p.y, timestamp: p.timestamp, type: p.type });
      }
      // Keep point if it's NOT (0,0) and has valid numbers
      return isValid;
    });

    const removedCount = originalLength - this.cursorData.length;
    if (removedCount > 0) {
      console.log(`�x️ Removed ${removedCount} invalid (0,0) or NaN points from the entire recording`);
      // Log details of filtered points to help identify patterns
      console.log('�x` Filtered points detail:', {
        total: removedCount,
        clickEvents: filteredOut.filter(p => p.type === 'click').length,
        samples: filteredOut.slice(0, 10) // Show first 10 filtered points
      });
    }

    // �x� DIAGNOSTIC: Track click events in the data
    const clickEvents = this.cursorData.filter(p => p.type === 'click');
    console.log(`�x�️ Click events in recording: ${clickEvents.length}`);
    if (clickEvents.length > 0) {
      console.log('�x�️ First few clicks:', clickEvents.slice(0, 5).map(c => ({
        x: c.x,
        y: c.y,
        timestamp: c.timestamp,
        isPressed: c.isPressed
      })));
    }

    // If no valid data left, return
    if (this.cursorData.length === 0) {
      console.warn('�a�️ No valid cursor data found after filtering (0,0) points');
      return;
    }

    // �x� FIX: Normalize timestamps to be relative to recording start
    // Cursor timestamps use absolute time (performance.now() or Date.now())
    // but video playback starts from 0, so we need to subtract the first timestamp
    if (this.cursorData.length > 0) {
      // �x}� Use the exact recording start timestamp instead of first cursor timestamp
      // This ensures cursor timestamps align perfectly with video playback time (which starts at 0)
      const recordingStart = this.recordingStartTimestamp || this.cursorData[0].timestamp;

      // Subtract recording start timestamp from all timestamps to make them relative to video start
      this.cursorData = this.cursorData.map(cursor => ({
        ...cursor,
        timestamp: cursor.timestamp - recordingStart
      }));

      // Ensure no negative timestamps (can happen if recordingStart > first cursor point)
      // This prevents the "time travel" effect where cursor might jump
      if (this.cursorData[0].timestamp < 0) {
        const offset = -this.cursorData[0].timestamp;
        console.log(`�a�️ First timestamp is negative (${this.cursorData[0].timestamp}ms), shifting all by +${offset}ms`);
        this.cursorData = this.cursorData.map(c => ({ ...c, timestamp: c.timestamp + offset }));
      }

      console.log('�S& [FIX] Timestamps normalized:', {
        firstNormalizedTimestamp: this.cursorData[0].timestamp,
        lastNormalizedTimestamp: this.cursorData[this.cursorData.length - 1].timestamp,
        totalDuration: this.cursorData[this.cursorData.length - 1].timestamp,
        videoDuration: this.videoDuration * 1000,
        timeDifference: Math.abs((this.cursorData[this.cursorData.length - 1].timestamp / 1000) - this.videoDuration)
      });
    }

    // �x� FIX: Also normalize zoom segment timestamps
    // Clamp to valid video duration only if videoDuration is actually set
    if (this.zoomSegments.length > 0 && this.videoDuration && this.videoDuration > 0) {
      console.log('�x� [ZOOM] Normalizing zoom segment timestamps to videoDuration:', this.videoDuration);
      this.zoomSegments = this.zoomSegments.map(segment => ({
        ...segment,
        startTime: Math.max(0, Math.min(segment.startTime, this.videoDuration)),
        endTime: Math.max(segment.startTime, Math.min(this.videoDuration, segment.endTime))
      }));
    }

    // === SCREEN STUDIO MATCH === Post-recording auto-zoom segment generation
    // Generate zoom segments from stored intent events AFTER recording stops
    if (this.zoomMode === 'auto' && this.autoZoomIntentEvents && this.autoZoomIntentEvents.length > 0) {
      console.log('�x}� [AUTO-ZOOM] Generating segments from', this.autoZoomIntentEvents.length, 'stored intent events');
      this.zoomSegments = this.generateAutoZoomSegments(this.autoZoomIntentEvents);
      this.renderZoomSegments();
      console.log('�S& [AUTO-ZOOM] Generated', this.zoomSegments.length, 'zoom segments post-recording');
    }

    // Store raw cursor data for real-time smoothing (before SpringSmoother processing)
    this.rawCursorData = JSON.parse(JSON.stringify(this.cursorData));
    console.log('�x� Raw cursor data stored:', this.rawCursorData.length, 'points');
    // Note: We no longer pre-process with SpringSmoother here
    // Spring physics are now applied in real-time during preview via updateSmoothCursor
    // This allows the cursor smoothness slider to work after recording
    console.log('�S� Cursor data ready for real-time smoothing');
  }


  showError(message) {
    (message);
    // You can enhance this with toast notifications or modal dialogs
    alert(`Error: ${message}`);
  }


  showPremiumRequiredMessage() {
    const message = 'Auto zoom is a premium feature. Please upgrade to ScreenSmooth Premium to use this feature.';
    this.showError(message);

    // Optionally show upgrade prompt
    if (confirm('Would you like to upgrade to Premium now?')) {
      // Get ngrok URL from environment variables
      const ngrokUrl = process.env.NGROK_URL || 'http://localhost:9000';
      // Open the checkout page
      window.open(ngrokUrl, '_blank');
    }
  }

}

export { RecorderZoomMethodsPart1 };
