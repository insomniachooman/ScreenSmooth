import { CursorProcessor } from './cursor-processor.js';
import { applyPrototypeMixin } from './recorder-mixin-utils.js';
import { ScreenSmoothRecorderMethodsPart1 } from './screen-smooth-recorder-methods-part1.js';
import { ScreenSmoothRecorderMethodsPart2 } from './screen-smooth-recorder-methods-part2.js';
import { ScreenSmoothRecorderMethodsPart3 } from './screen-smooth-recorder-methods-part3.js';
import { ScreenSmoothRecorderMethodsPart4 } from './screen-smooth-recorder-methods-part4.js';
import { RecorderMediaExportMethods } from './recorder-media-export-methods.js';
import { RecorderZoomMethods } from './recorder-zoom-methods.js';
import { RecorderAdvancedMethods } from './recorder-advanced-methods.js';

class ScreenSmoothRecorder {
  constructor() {
    console.log('�x� DEBUG: ScreenSmoothRecorder constructor called');

    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.stream = null;
    this.isRecording = false;
    this.isPaused = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseStartTime = 0; // Track when pause started
    this.timerInterval = null;
    this.recordingBlob = null;
    this.ffmpeg = null;
    this.isFFmpegLoaded = false;
    this.isExporting = false; // Export lock to prevent rapid re-exports
    this.exportCursorState = null; // Export-specific cursor state
    this.isPremium = false; // Premium status

    // Timeline state
    this.videoDuration = 0;
    this.trimStart = 0;
    this.trimEnd = 0;
    this.lastExportDuration = 0; // Stores the actual duration from canvas composition for FFmpeg
    this.isDragging = false;
    this.dragHandle = null;
    this.timelineWidth = 0;

    // Video player state
    this.isPlaying = false;
    this.currentTime = 0;
    this.isDraggingProgress = false;

    // Visual editing state
    this.currentPadding = 12; // Default padding
    this.currentBackground = "#000000";
    this.currentBorderRadius = 12; // Default border radius
    this.currentBlur = 0; // Default blur
    this.currentAspectRatio = "native"; // Default to native aspect ratio

    // Screen effects state
    this.currentBrightness = 1;
    this.currentContrast = 1;
    this.currentSaturation = 1;

    // Background image cache for canvas rendering
    this.backgroundImageCache = null;
    this.canvasRenderInterval = null;

    // Blur cache for performance optimization
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;
    this.lastBlurValue = null;
    this.lastBackgroundValue = null;
    this.lastCanvasWidth = null;
    this.lastCanvasHeight = null;

    // Cursor data storage
    this.cursorData = [];
    this.rawCursorData = []; // Store raw cursor data for real-time smoothing
    this.cursorDataIndex = 0;

    // Cursor processor
    this.cursorProcessor = new CursorProcessor();

    // === SCREEN STUDIO CURSOR PREMIUM === Cursor animation state
    this.cursorPressed = false;
    this.cursorScale = 1;
    this.cursorRotation = 0;
    this.cursorVelocity = { x: 0, y: 0 };
    this.smoothCursor = { x: 0, y: 0 };
    this.activeRipples = []; // Track active click ripples
    this.rawCursorPositions = []; // === SCREEN STUDIO MATCH === Store raw positions for velocity calc

    // Zoom feature state
    this.zoomMode = 'auto'; // 'auto' or 'manual'
    this.zoomIntensity = 1.5; // 1.25x to 4x (default 1.5x for subtle auto-zoom)
    this.zoomSegments = []; // Array of zoom segments {startTime, endTime, intensity, position}
    this.autoZoomIntentEvents = []; // Raw intent events (click, typing, selection) stored during recording for post-recording segment generation
    this.selectedZoomSegment = null;
    this.zoomPosition = { x: 0.5, y: 0.5 }; // Normalized position (0-1)
    this.isAddingZoom = false;
    this.isDraggingZoom = false;
    this.zoomDragHandle = null;

    // Spring physics for cursor smoothing (default value, will be updated by slider)
    this.spring = 0.15; // Default spring strength (matches slider default of 50)

    // Listen for cursor settings changes to update spring value in real-time
    window.addEventListener('cursor-settings-changed', (e) => {
      console.log('�x}a️ [ScreenSmoothRecorder] Received settings update:', e.detail);
      this.spring = e.detail.springStrength;
      // === SCREEN STUDIO CURSOR PREMIUM === Invalidate cursor springs so they
      // get recreated with the new tension/friction on next frame
      if (this._cursorSprings) {
        // Preserve current position/velocity so there's no visual jump
        const prevX = this._cursorSprings.x.position;
        const prevY = this._cursorSprings.y.position;
        const prevVx = this._cursorSprings.x.velocity;
        const prevVy = this._cursorSprings.y.velocity;
        this._cursorSprings = null; // Force recreation
        const newSprings = this.ensureCursorSprings(this);
        newSprings.x.position = prevX; newSprings.x.velocity = prevVx;
        newSprings.y.position = prevY; newSprings.y.velocity = prevVy;
      }
      console.log('�x}a️ [ScreenSmoothRecorder] Updated spring to:', this.spring);
      // Force re-render to show change immediately
      if (this.previewCanvas && this.previewCanvas.style.display !== 'none') {
        this.renderToCanvas();
      }
    });

    // Load initial spring value from settings if available
    if (window.cursorSettingsManager) {
      const settings = window.cursorSettingsManager.getSettings();
      this.spring = settings.springStrength;
      console.log('�x}a️ [ScreenSmoothRecorder] Initial spring value:', this.spring);
    }

    // Enhanced smooth zoom animation state
    this.currentZoomState = {
      intensity: 1,
      position: { x: 0.5, y: 0.5 },
      isActive: false
    };
    this.zoomTransitionDuration = 1.5; // seconds - Increased from 0.8 to 1.5 for smoother, more visible transitions
    this.lastZoomUpdate = 0;
    this.zoomAnimationStartState = null; // Track animation start state
    this.isSeekingMode = false; // Flag to distinguish between seeking and smooth playback

    // Local wallpaper images from ./bg directory
    this.wallpapers = [
      "../../assets/bg/sequoia-dark.png",
      "../../assets/bg/sequoia-light.png",
      "../../assets/bg/sonoma-dark.png",
      "../../assets/bg/sonoma-light.png",
      "../../assets/bg/tahoe-dark.png",
      "../../assets/bg/tahoe-light.png",
      "../../assets/bg/ventura-dark.png",
      "../../assets/bg/ventura-light.png",
      "../../assets/bg/windows-dark.png",
      "../../assets/bg/windows-light.png"
    ];

    console.log('�x� DEBUG: About to call initialize()');
    this.initialize();
  }

  static createSpring(initialValue = 1, tension = 120, friction = 20) {
    return {
      position: initialValue,
      velocity: 0,
      target: initialValue,
      tension,       // stiffness
      friction,      // damping
      mass: 1,
      settled: true, // true when spring has reached its target

      /** Advance the spring by dt seconds toward the current target. */
      update(target, dt) {
        // Clamp dt to avoid explosion after tab-switch / long pause
        dt = Math.min(dt, 0.064); // cap at ~15 fps equivalent

        this.target = target;

        // Sub-stepping: split large dt into small fixed steps for stability
        const STEP = 1 / 240; // 240 Hz physics
        let remaining = dt;
        while (remaining > 0) {
          const step = Math.min(remaining, STEP);
          const displacement = this.position - this.target;
          const springForce = -this.tension * displacement;
          const dampingForce = -this.friction * this.velocity;
          const acceleration = (springForce + dampingForce) / this.mass;
          // Semi-implicit Euler (velocity first, then position)
          this.velocity += acceleration * step;
          this.position += this.velocity * step;
          remaining -= step;
        }

        // Settle: snap to target when close enough & slow enough
        const displacement = Math.abs(this.position - this.target);
        const speed = Math.abs(this.velocity);
        this.settled = displacement < 0.0005 && speed < 0.001;
        if (this.settled) {
          this.position = this.target;
          this.velocity = 0;
        }

        return this.position;
      },

      /** Hard-set position & velocity (used on seek / reset). */
      snap(value) {
        this.position = value;
        this.velocity = 0;
        this.target = value;
        this.settled = true;
      }
    };
  }
}

applyPrototypeMixin(ScreenSmoothRecorder, ScreenSmoothRecorderMethodsPart1);
applyPrototypeMixin(ScreenSmoothRecorder, ScreenSmoothRecorderMethodsPart2);
applyPrototypeMixin(ScreenSmoothRecorder, ScreenSmoothRecorderMethodsPart3);
applyPrototypeMixin(ScreenSmoothRecorder, ScreenSmoothRecorderMethodsPart4);
applyPrototypeMixin(ScreenSmoothRecorder, RecorderMediaExportMethods);
applyPrototypeMixin(ScreenSmoothRecorder, RecorderZoomMethods);
applyPrototypeMixin(ScreenSmoothRecorder, RecorderAdvancedMethods);

export { ScreenSmoothRecorder };
