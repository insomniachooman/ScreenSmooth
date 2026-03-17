class SpringSmoother {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.scale = 1;
    this.scaleV = 0;
    this.rotation = 0;
    this.rotationV = 0;

    // Configuration - Tuned for "Heavy Dreamy" feel
    this.spring = 0.03; // Was 0.08 - Much weaker spring = slower catch-up
    this.friction = 0.6; // Was 0.75 - Lower friction = more glide/momentum

    // Scale Spring (Click Feedback + Speed)
    this.scaleSpring = 0.08; // Slower scale transition
    this.scaleFriction = 0.85;

    // Rotation Spring (Tilt)
    this.rotationSpring = 0.06; // Lazy rotation
    this.rotationFriction = 0.85;

    // Settings
    this.hideWhenIdle = false;

    // Load settings if available
    if (window.cursorSettingsManager) {
      const settings = window.cursorSettingsManager.getSettings();
      this.spring = settings.springStrength;
      this.hideWhenIdle = settings.hideWhenIdle;
    }

    // Listen for changes
    window.addEventListener('cursor-settings-changed', (e) => {
      this.spring = e.detail.springStrength;
      this.hideWhenIdle = e.detail.hideWhenIdle;
    });
  }

  process(data) {
    if (!data || data.length === 0) return data;

    const processed = [];
    let debugJumpCount = 0;
    let clickEventCount = 0;
    let jumpsNearClicks = 0;

    // Initialize with first point
    this.x = data[0].x;
    this.y = data[0].y;
    this.scale = 1;
    this.rotation = 0;

    console.log('�x}� SpringSmoother starting:', {
      firstPoint: { x: data[0].x, y: data[0].y, timestamp: data[0].timestamp },
      totalPoints: data.length,
      clickEvents: data.filter(p => p.type === 'click' || p.isPressed).length,
      timeRange: `${data[0].timestamp}ms �  ${data[data.length - 1].timestamp}ms`
    });

    // FIX: Start currentTime at the first timestamp, not 0
    // This prevents incorrect interpolation at the start
    let currentTime = data[0].timestamp;
    const step = 16; // ~60fps simulation steps

    // Hysteresis state
    let stopTimer = 0;
    let isMovingFast = false;

    // Track previous position for jump detection
    let prevX = this.x;
    let prevY = this.y;

    // Track idle time
    let lastMoveTime = data[0].timestamp;
    let lastTargetX = this.x;
    let lastTargetY = this.y;

    // Iterate through recorded points
    for (let i = 0; i < data.length - 1; i++) {
      const p1 = data[i];
      const p2 = data[i + 1];

      // Safety check for invalid points
      if (!Number.isFinite(p1.x) || !Number.isFinite(p1.y)) {
        console.warn(`�a�️ Invalid point at index ${i}:`, p1);
        continue;
      }

      // �x " ENHANCED: Validate p2 as well before interpolation
      if (!Number.isFinite(p2.x) || !Number.isFinite(p2.y)) {
        console.error(`�R Invalid p2 at index ${i + 1}:`, p2);
        continue;
      }

      // Check for suspicious data points in BOTH p1 and p2
      if (p1.x === 0 && p1.y === 0) {
        console.error(`�R (0,0) point found at p1 index ${i} despite filtering! Timestamp: ${p1.timestamp}ms`, {
          p1, p2,
          isClick: p1.type === 'click' || p1.isPressed
        });
      }
      if (p2.x === 0 && p2.y === 0) {
        console.error(`�R (0,0) point found at p2 index ${i + 1} despite filtering! Timestamp: ${p2.timestamp}ms`, {
          p1, p2,
          isClick: p2.type === 'click' || p2.isPressed
        });
      }

      // Detect large gaps in time (might cause interpolation issues)
      const timeGap = p2.timestamp - p1.timestamp;
      const hasClick = p1.isPressed || p2.isPressed || p1.type === 'click' || p2.type === 'click';

      if (timeGap > 200) {
        console.warn(`⏱️ Large time gap detected: ${timeGap}ms between index ${i} and ${i + 1}`, {
          hasClick,
          p1: { x: p1.x, y: p1.y, timestamp: p1.timestamp, isPressed: p1.isPressed },
          p2: { x: p2.x, y: p2.y, timestamp: p2.timestamp, isPressed: p2.isPressed }
        });
      }

      // Simulate frames between p1 and p2
      while (currentTime < p2.timestamp) {
        // Calculate target position (where mouse actually is)
        // Interpolate target between p1 and p2 based on current time
        const t = Math.max(0, Math.min(1, (currentTime - p1.timestamp) / (p2.timestamp - p1.timestamp)));
        const targetX = p1.x + (p2.x - p1.x) * t;
        const targetY = p1.y + (p2.y - p1.y) * t;
        const isPressed = p1.isPressed; // Use current segment's press state

        // Update idle tracking
        const moveDist = Math.sqrt(Math.pow(targetX - lastTargetX, 2) + Math.pow(targetY - lastTargetY, 2));
        if (moveDist > 0.1) {
          lastMoveTime = currentTime;
        }
        lastTargetX = targetX;
        lastTargetY = targetY;

        // Calculate opacity
        let opacity = 1;
        if (this.hideWhenIdle) {
          const timeSinceMove = currentTime - lastMoveTime;
          if (timeSinceMove > 2000) {
            opacity = Math.max(0, 1 - (timeSinceMove - 2000) / 500);
          }
        }

        // �x " Track click events
        if (isPressed) {
          clickEventCount++;
          // Log state when processing click frames (but not every single frame to avoid spam)
          if (clickEventCount % 5 === 1) { // Log every 5th click frame
            console.log(`�x�️ Processing click frame #${clickEventCount} at ${currentTime}ms:`, {
              interpolation: { t: t.toFixed(3), i },
              target: { x: targetX.toFixed(2), y: targetY.toFixed(2) },
              current: { x: this.x.toFixed(2), y: this.y.toFixed(2) },
              velocity: { vx: this.vx.toFixed(2), vy: this.vy.toFixed(2) },
              dataPoints: {
                p1: { x: p1.x, y: p1.y, timestamp: p1.timestamp },
                p2: { x: p2.x, y: p2.y, timestamp: p2.timestamp }
              }
            });
          }
        }

        // �x " ENHANCED: Check if interpolation produces near-zero OR suspiciously low values
        if (targetX < 10 && targetY < 10) {
          console.error(`�a�️ Interpolation produced near-zero target at ${currentTime}ms:`, {
            t,
            p1: { x: p1.x, y: p1.y, timestamp: p1.timestamp, isPressed: p1.isPressed },
            p2: { x: p2.x, y: p2.y, timestamp: p2.timestamp, isPressed: p2.isPressed },
            target: { x: targetX, y: targetY },
            isClickFrame: isPressed,
            currentTime
          });
        }

        // �x " CRITICAL: Detect if interpolation created invalid values
        if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
          console.error(`�R INTERPOLATION PRODUCED NaN/Infinity at ${currentTime}ms!`, {
            t,
            p1: { x: p1.x, y: p1.y, timestamp: p1.timestamp },
            p2: { x: p2.x, y: p2.y, timestamp: p2.timestamp },
            target: { x: targetX, y: targetY },
            division: p2.timestamp - p1.timestamp
          });
          // Skip this frame to avoid corruption
          currentTime += step;
          continue;
        }

        // Spring Physics for Position
        const ax = (targetX - this.x) * this.spring;
        const ay = (targetY - this.y) * this.spring;

        this.vx += ax;
        this.vy += ay;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        // Calculate speed for dynamic effects
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        // Dynamic Scale Logic with Hysteresis
        // "Wait to see if really stopped"

        let targetScale = 1.0;

        if (speed > 5) {
          // Moving fast - shrink immediately
          targetScale = 0.85;
          stopTimer = 0; // Reset stop timer
          isMovingFast = true;
        } else if (speed < 0.5) {
          // Stopped or very slow
          stopTimer += step;
          // Only grow if stopped for > 300ms (approx 20 frames)
          if (stopTimer > 300) {
            targetScale = 1.15;
            isMovingFast = false;
          } else {
            // Maintain current state (don't snap back to 1.0 immediately if we were fast)
            targetScale = isMovingFast ? 1.0 : 1.0;
          }
        } else {
          // Intermediate speed
          stopTimer = 0;
          targetScale = 1.0;
          isMovingFast = false;
        }

        // Click effect overrides everything
        if (isPressed) {
          targetScale *= 0.9;
        }

        const ds = targetScale - this.scale;
        this.scaleV += ds * this.scaleSpring;
        this.scaleV *= this.scaleFriction;
        this.scale += this.scaleV;

        // Dynamic Rotation Logic (Tilt based on movement)
        // Smoothed target rotation to prevent jitter
        // Tilt towards movement direction
        let targetRotation = this.vx * 1.2; // Slightly reduced multiplier

        // Clamp rotation to avoid extreme spins
        targetRotation = Math.max(-15, Math.min(15, targetRotation));

        const dr = targetRotation - this.rotation;
        this.rotationV += dr * this.rotationSpring;
        this.rotationV *= this.rotationFriction;
        this.rotation += this.rotationV;

        // ENHANCED DEBUG: Detect abrupt position changes (jumps)
        const deltaX = this.x - prevX;
        const deltaY = this.y - prevY;
        const distanceMoved = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // If cursor jumped more than 50 pixels in one frame, log it
        if (distanceMoved > 50) {
          debugJumpCount++;
          // �x " Check if this jump is near a click event
          const isNearClick = isPressed || p1.isPressed || p2.isPressed;
          if (isNearClick) {
            jumpsNearClicks++;
          }

          console.error(`�xa� ABRUPT JUMP #${debugJumpCount} at ${currentTime}ms (${(currentTime / 1000).toFixed(2)}s):`, {
            from: { x: prevX.toFixed(2), y: prevY.toFixed(2) },
            to: { x: this.x.toFixed(2), y: this.y.toFixed(2) },
            distance: distanceMoved.toFixed(2),
            velocity: { vx: this.vx.toFixed(2), vy: this.vy.toFixed(2) },
            target: { x: targetX.toFixed(2), y: targetY.toFixed(2) },
            interpolation: { t: t.toFixed(3), i },
            isClickRelated: isNearClick,
            clickState: { isPressed, p1Pressed: p1.isPressed, p2Pressed: p2.isPressed },
            dataPoints: {
              p1: { x: p1.x, y: p1.y, timestamp: p1.timestamp, isPressed: p1.isPressed },
              p2: { x: p2.x, y: p2.y, timestamp: p2.timestamp, isPressed: p2.isPressed }
            }
          });
        }

        // DEBUG: Catch near-(0,0) positions
        if (this.x < 10 && this.y < 10) {
          console.warn(`�a�️ Cursor near (0,0) at ${currentTime}ms (${(currentTime / 1000).toFixed(2)}s):`, {
            position: { x: this.x.toFixed(2), y: this.y.toFixed(2) },
            target: { x: targetX.toFixed(2), y: targetY.toFixed(2) },
            velocity: { vx: this.vx.toFixed(2), vy: this.vy.toFixed(2) },
            dataIndex: i,
            interpolationT: t.toFixed(3)
          });
        }

        // DEBUG: Catch high velocity
        if (Math.abs(this.vx) > 100 || Math.abs(this.vy) > 100) {
          console.warn(`�xa� High velocity at ${currentTime}ms (${(currentTime / 1000).toFixed(2)}s):`, {
            velocity: { vx: this.vx.toFixed(2), vy: this.vy.toFixed(2) },
            position: { x: this.x.toFixed(2), y: this.y.toFixed(2) },
            target: { x: targetX.toFixed(2), y: targetY.toFixed(2) }
          });
        }

        // Final Safety Check for NaN/Infinity
        if (!Number.isFinite(this.x)) {
          console.error(`�R NaN/Infinity detected in x at ${currentTime}ms, resetting to target:`, targetX);
          this.x = targetX;
        }
        if (!Number.isFinite(this.y)) {
          console.error(`�R NaN/Infinity detected in y at ${currentTime}ms, resetting to target:`, targetY);
          this.y = targetY;
        }

        processed.push({
          timestamp: currentTime,
          x: this.x,
          y: this.y,
          vx: this.vx,
          vy: this.vy,
          scale: this.scale,
          rotation: this.rotation,
          opacity: opacity,
          // �x " CRITICAL FIX: Use fallback chain for window dimensions
          // p1 might not have these (from interpolation), so try p2, then first point
          windowWidth: p1.windowWidth || p2.windowWidth || data[0].windowWidth,
          windowHeight: p1.windowHeight || p2.windowHeight || data[0].windowHeight,
          isPressed: isPressed
        });

        // Update previous position for next iteration
        prevX = this.x;
        prevY = this.y;

        currentTime += step;
      }
    }

    console.log(`�S& SpringSmoother complete:`, {
      framesGenerated: processed.length,
      jumpsDetected: debugJumpCount,
      clickFrames: clickEventCount,
      jumpsNearClicks: jumpsNearClicks,
      clickCorrelation: debugJumpCount > 0 ? `${((jumpsNearClicks / debugJumpCount) * 100).toFixed(1)}% of jumps near clicks` : 'N/A'
    });
    return processed;
  }
}


export { SpringSmoother };
