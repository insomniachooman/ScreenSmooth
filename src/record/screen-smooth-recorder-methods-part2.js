class ScreenSmoothRecorderMethodsPart2 {
  initializeElements() {
    // Recording setup elements
    this.recordingSetup = document.getElementById("recording-setup");
    this.recordingControls = document.getElementById("recording-controls");
    this.previewEditor = document.getElementById("preview-editor");

    // Editor panels container
    this.editorPanelsContainer = document.querySelector(
      ".editor-panels-container"
    );

    // Sidebar elements
    this.sidebar = document.getElementById("sidebar");
    this.sidebarBtns = document.querySelectorAll(".sidebar-btn");

    // Option cards
    this.optionCards = document.querySelectorAll(".option-card");

    // Buttons
    this.startRecordingBtn = document.getElementById("start-recording-btn");
    this.pauseRecordingBtn = document.getElementById("pause-recording-btn");
    this.stopRecordingBtn = document.getElementById("stop-recording-btn");
    this.recordAgainBtn = document.getElementById("record-again-btn");
    this.downloadBtn = document.getElementById("download-btn");
    this.shareBtn = document.getElementById("share-btn");
    this.manageSubscriptionBtn = document.getElementById("manage-subscription-btn");

    // Validate critical elements
    if (!this.recordingSetup) {
    }
    if (!this.optionCards || this.optionCards.length === 0) {
    }
    if (!this.startRecordingBtn) {
    }
    if (!this.downloadBtn) {
    }

    // Timer
    this.recordingTimer = document.getElementById("recording-timer");

    // Video elements
    this.previewVideo = document.getElementById("preview-video");
    this.previewCanvas = document.getElementById("preview-canvas");
    this.previewCanvasCtx = this.previewCanvas ? this.previewCanvas.getContext("2d") : null;

    // Validate critical video elements
    if (!this.previewVideo) {
      ("Preview video element not found!");
    }
    if (!this.previewCanvas) {
      ("Preview canvas element not found!");
    }
    this.videoWrapper = document.getElementById("video-wrapper");
    this.videoInfo = document.getElementById("video-info");
    this.fileName = document.getElementById("file-name");
    this.fileSize = document.getElementById("file-size");
    this.videoDurationDisplay = document.getElementById("video-duration");

    // Custom video player controls
    this.playPauseBtn = document.getElementById("play-pause-btn");
    this.rewindBtn = document.getElementById("rewind-btn");
    this.forwardBtn = document.getElementById("forward-btn");
    this.currentTimeDisplay = document.getElementById("current-time");
    this.totalTimeDisplay = document.getElementById("total-time");
    this.progressBarContainer = document.getElementById(
      "progress-bar-container"
    );
    this.progressFill = document.getElementById("progress-fill");
    this.progressHandle = document.getElementById("progress-handle");
    this.volumeBtn = document.getElementById("volume-btn");
    this.fullscreenBtn = document.getElementById("fullscreen-btn");

    // Timeline elements
    this.timelineTrack = document.getElementById("timeline-track");
    this.timelineMarkers = document.getElementById("timeline-markers");
    this.selectedRangeOverlay = document.getElementById(
      "selected-range-overlay"
    );
    this.trimHandleLeft = document.getElementById("trim-handle-left");
    this.trimHandleRight = document.getElementById("trim-handle-right");
    this.playbackIndicator = document.getElementById("playback-indicator");
    this.selectedDurationText = document.getElementById(
      "selected-duration-text"
    );

    // Zoom elements
    this.zoomTrack = document.getElementById("zoom-track");
    // this.addZoomBtn = document.getElementById("add-zoom-btn"); // Commented out
    this.clearZoomBtn = document.getElementById("clear-zoom-btn");
    this.zoomHoverIndicator = document.getElementById("zoom-hover-indicator");
    this.zoomTimePreview = document.getElementById("zoom-time-preview");
    this.zoomPlaceholder = document.getElementById("zoom-placeholder");
    this.zoomIntensitySlider = document.getElementById("zoom-intensity");
    this.zoomIntensityValue = document.getElementById("zoom-intensity-value");
    // Zoom mode radios with fallback handling
    this.zoomModeRadios = document.querySelectorAll('input[name="zoom-mode"]');
    if (this.zoomModeRadios.length === 0) {
      ('No zoom-mode radios found, zoom functionality may be limited');
    } else {
      (`Found ${this.zoomModeRadios.length} zoom-mode radios`);
    }
    this.manualZoomControls = document.querySelectorAll('.manual-zoom-controls')[0]; // Get first (left sidebar)
    this.zoomPositionPreview = document.getElementById("zoom-position-preview");
    this.zoomPositionIndicator = document.getElementById("zoom-position-indicator");
    // New zoom panel elements
    this.noZoomMessage = document.getElementById("no-zoom-message");
    this.zoomEditingControls = document.getElementById("zoom-editing-controls");
    this.zoomInfo = document.getElementById("zoom-info");
    this.zoomTiming = document.getElementById("zoom-timing");

    // Debug: Check if elements exist
    ('Zoom panel elements check:');
    ('- noZoomMessage:', !!this.noZoomMessage);
    ('- zoomEditingControls:', !!this.zoomEditingControls);
    ('- zoomInfo:', !!this.zoomInfo);
    ('- zoomTiming:', !!this.zoomTiming);
    ('- manualZoomControls (left):', !!this.manualZoomControls);
    ('- zoomPositionPreview:', !!this.zoomPositionPreview);
    ('- zoomPositionIndicator:', !!this.zoomPositionIndicator);
    // New zoom panel elements for right sidebar
    this.noZoomMessageRight = document.getElementById("no-zoom-message-right");
    this.zoomEditingControlsRight = document.getElementById("zoom-editing-controls-right");
    this.zoomInfoRight = document.getElementById("zoom-info-right");
    this.zoomTimingRight = document.getElementById("zoom-timing-right");

    // Debug: Check if right sidebar elements exist
    ('Right sidebar zoom panel elements check:');
    ('- noZoomMessageRight:', !!this.noZoomMessageRight);
    ('- zoomEditingControlsRight:', !!this.zoomEditingControlsRight);
    ('- zoomInfoRight:', !!this.zoomInfoRight);
    ('- zoomTimingRight:', !!this.zoomTimingRight);
    ('- manualZoomControlsRight (right):', !!this.manualZoomControlsRight);
    ('- zoomPositionPreviewRight:', !!this.zoomPositionPreviewRight);
    ('- zoomPositionIndicatorRight:', !!this.zoomPositionIndicatorRight);
    ('- clearZoomBtn:', !!this.clearZoomBtn);
    this.zoomIntensitySliderRight = document.getElementById("zoom-intensity-right");
    this.zoomIntensityValueRight = document.getElementById("zoom-intensity-value-right");
    this.zoomModeRadiosRight = document.querySelectorAll('input[name="zoom-mode-right"]');
    this.manualZoomControlsRight = document.querySelectorAll('.manual-zoom-controls')[1]; // Get second (right sidebar)
    this.zoomPositionPreviewRight = document.getElementById("zoom-position-preview-right");
    this.zoomPositionIndicatorRight = document.getElementById("zoom-position-indicator-right");
    this.closeZoomControlsBtn = document.getElementById("close-zoom-controls");
    this.exportAdvancedPanel = document.getElementById("export-advanced-panel");
    this.zoomControlsPanel = document.getElementById("zoom-controls-panel");
    // Right sidebar export controls
    this.formatSelectRight = document.getElementById("format-select-right");
    this.qualitySelectRight = document.getElementById("quality-select-right");
    this.compressionLevelRight = document.getElementById("compression-level-right");
    this.compressionValueRight = document.getElementById("compression-value-right");
    this.downloadBtnRight = document.getElementById("download-btn-right");
    // Background panel controls
    this.randomWallpaperBtn = document.getElementById("random-wallpaper-btn");
    this.wallpaperGrid = document.getElementById("wallpaper-grid");
    this.videoPadding = document.getElementById("video-padding");
    this.paddingValue = document.getElementById("padding-value");
    this.videoBlur = document.getElementById("video-blur");
    this.blurValue = document.getElementById("blur-value");
    this.videoBorderRadius = document.getElementById("video-border-radius");
    this.borderRadiusValue = document.getElementById("border-radius-value");
    this.aspectRatioSelect = document.getElementById("aspect-ratio-select");

    // Validate control elements
    if (!this.videoPadding) {
      ("Video padding slider not found!");
    }
    if (!this.videoBlur) {
      ("Video blur slider not found!");
    }
    if (!this.videoBorderRadius) {
      ("Video border radius slider not found!");
    }
    if (!this.aspectRatioSelect) {
      ("Aspect ratio select not found!");
    }

    // Screen panel controls
    this.screenBrightness = document.getElementById("screen-brightness");
    this.brightnessValue = document.getElementById("brightness-value");
    this.screenContrast = document.getElementById("screen-contrast");
    this.contrastValue = document.getElementById("contrast-value");
    this.screenSaturation = document.getElementById("screen-saturation");
    this.saturationValue = document.getElementById("saturation-value");

    // Video Demo Panel
    this.demoVideo = document.getElementById("demo-video");
    this.demoPlayPauseBtn = document.getElementById("demo-play-pause-btn");
    this.demoPlayIcon = document.getElementById("demo-play-icon");
    this.demoPauseIcon = document.getElementById("demo-pause-icon");
    this.timelineBarTrack = document.getElementById("timeline-bar-track");
    this.timelineBarProgress = document.getElementById("timeline-bar-progress");
    this.timelineBarPlayhead = document.getElementById("timeline-bar-playhead");

    // Export controls
    this.formatSelect = document.getElementById("format-select");
    this.qualitySelect = document.getElementById("quality-select");
    this.compressionLevel = document.getElementById("compression-level");
    this.compressionValue = document.getElementById("compression-value");

    // Validate export controls
    if (!this.formatSelect) {
      ("Format select not found!");
    }
    if (!this.qualitySelect) {
      ("Quality select not found!");
    }
    if (!this.compressionLevel) {
      ("Compression level slider not found!");
    }
    if (!this.compressionValue) {
      ("Compression value display not found!");
    }

    // Load saved export format preference
    chrome.storage.local.get(['exportFormat'], (result) => {
      const savedFormat = result.exportFormat;
      
      // Validate saved value
      if (savedFormat && (savedFormat === 'mp4' || savedFormat === 'webm' || savedFormat === 'gif')) {
        // Apply to both dropdowns
        if (this.formatSelect) {
          this.formatSelect.value = savedFormat;
        }
        if (this.formatSelectRight) {
          this.formatSelectRight.value = savedFormat;
        }
        console.log('�S& Export format loaded:', savedFormat);
      } else {
        // First-time user or corrupted data - use default
        const defaultFormat = 'webm';
        if (this.formatSelect) {
          this.formatSelect.value = defaultFormat;
        }
        if (this.formatSelectRight) {
          this.formatSelectRight.value = defaultFormat;
        }
        console.log('��️ Using default export format:', defaultFormat);
      }
    });

    // Settings
    this.selectedRecordingType = "tab";
    this.selectedQuality = "high";
    this.cursorTracking = true;
    this.systemAudio = true;

    const tabCard = document.querySelector('.option-card[data-type="tab"]');
    if (tabCard) {
      tabCard.classList.add("selected");
    }
  }


  updateMp4Availability(isAvailable) {
    const selectors = [];
    if (this.formatSelect) selectors.push(this.formatSelect);
    if (this.formatSelectRight) selectors.push(this.formatSelectRight);

    const domLeft = document.getElementById('format-select');
    const domRight = document.getElementById('format-select-right');
    if (domLeft && !selectors.includes(domLeft)) selectors.push(domLeft);
    if (domRight && !selectors.includes(domRight)) selectors.push(domRight);

    selectors.forEach((selectEl) => {
      const mp4Option = selectEl.querySelector('option[value="mp4"]');
      if (!mp4Option) return;
      mp4Option.disabled = !isAvailable;
      mp4Option.textContent = isAvailable ? 'MP4' : 'MP4 (Unavailable)';

      if (!isAvailable && selectEl.value === 'mp4') {
        selectEl.value = 'webm';
      }
    });
  }


  async initializeFFmpeg() {
    console.log('�x}� [FFmpeg] Starting FFmpeg initialization...');
    try {
      let FFmpeg;
      let fetchFile;
      let toBlobURL;

      try {
        console.log('�x}� [FFmpeg] Trying dynamic import...');
        const ffmpegModule = await import('@ffmpeg/ffmpeg');
        const utilModule = await import('@ffmpeg/util');
        FFmpeg = ffmpegModule.FFmpeg;
        fetchFile = utilModule.fetchFile;
        toBlobURL = utilModule.toBlobURL;
        console.log('�x}� [FFmpeg] Dynamic import successful');
      } catch (moduleError) {
        console.log('�x}� [FFmpeg] Dynamic import failed:', moduleError.message);
        if (typeof window !== 'undefined' && window.FFmpegWASM && window.FFmpegWASM.FFmpeg) {
          console.log('�x}� [FFmpeg] Using window.FFmpegWASM.FFmpeg...');
          FFmpeg = window.FFmpegWASM.FFmpeg;
          fetchFile = async (file) => {
            if (file instanceof Blob || file instanceof File) {
              return new Uint8Array(await file.arrayBuffer());
            }
            if (typeof file === 'string') {
              const response = await fetch(file);
              return new Uint8Array(await response.arrayBuffer());
            }
            return file;
          };
          toBlobURL = async (url, mimeType) => {
            const response = await fetch(url);
            const blob = new Blob([await response.arrayBuffer()], { type: mimeType });
            return URL.createObjectURL(blob);
          };
        } else if (typeof window !== 'undefined' && window.FFmpeg) {
          console.log('�x}� [FFmpeg] Using window.FFmpeg...');
          FFmpeg = window.FFmpeg;
          fetchFile = window.fetchFile;
          toBlobURL = window.toBlobURL;
        } else {
          throw new Error('FFmpeg runtime not available');
        }
      }

      this.fetchFile = fetchFile;
      this.toBlobURL = toBlobURL;

      const baseURL = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
        ? chrome.runtime.getURL('assets/ffmpeg')
        : '/assets/ffmpeg';

      const classWorkerURL = `${baseURL}/814.ffmpeg.js`;
      console.log('�x}� [FFmpeg] Asset base URL:', baseURL);
      console.log('�x}� [FFmpeg] classWorkerURL:', classWorkerURL);

      const supportsSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
      console.log('�x}� [FFmpeg] SharedArrayBuffer available:', supportsSharedArrayBuffer);

      const stageConfigs = [];
      if (supportsSharedArrayBuffer) {
        stageConfigs.push({
          name: 'multi-thread',
          loadConfig: {
            classWorkerURL,
            coreURL: `${baseURL}/ffmpeg-core.js`,
            wasmURL: `${baseURL}/ffmpeg-core.wasm`,
            workerURL: `${baseURL}/ffmpeg-core.worker.js`
          },
          timeoutMs: 60000
        });
      }

      stageConfigs.push({
        name: 'single-thread',
        loadConfig: {
          classWorkerURL,
          coreURL: `${baseURL}/ffmpeg-core-st.js`,
          wasmURL: `${baseURL}/ffmpeg-core-st.wasm`
        },
        timeoutMs: 60000
      });

      let loaded = false;
      let lastError = null;

      for (const stage of stageConfigs) {
        const { name, loadConfig, timeoutMs } = stage;
        console.log(`�x}� [FFmpeg] ---- Stage: ${name} ----`);
        console.log('�x}� [FFmpeg] Load config:', loadConfig);

        try {
          const preflightUrls = [loadConfig.classWorkerURL, loadConfig.coreURL, loadConfig.wasmURL];
          if (loadConfig.workerURL) preflightUrls.push(loadConfig.workerURL);

          for (const url of preflightUrls) {
            const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
            if (!response.ok) {
              throw new Error(`Preflight failed for ${url} (HTTP ${response.status})`);
            }
            console.log(`�x}� [FFmpeg] Preflight OK: ${url}`);
          }

          this.ffmpeg = new FFmpeg();
          const loadPromise = this.ffmpeg.load(loadConfig);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`FFmpeg ${name} load timeout after ${timeoutMs / 1000} seconds`)), timeoutMs)
          );

          await Promise.race([loadPromise, timeoutPromise]);
          loaded = true;
          this.isFFmpegLoaded = true;
          this.updateMp4Availability(true);
          console.log(`�x}� [FFmpeg] �S& Loaded successfully via ${name} stage`);
          break;
        } catch (stageError) {
          lastError = stageError;
          console.error(`�x}� [FFmpeg] �R Stage ${name} failed:`, stageError.message || stageError);
          if (this.ffmpeg && typeof this.ffmpeg.terminate === 'function') {
            try {
              this.ffmpeg.terminate();
            } catch (terminateError) {
              console.warn('�x}� [FFmpeg] Failed to terminate FFmpeg instance:', terminateError.message);
            }
          }
          this.ffmpeg = null;
        }
      }

      if (!loaded) {
        throw lastError || new Error('FFmpeg failed to load in all stages');
      }
    } catch (error) {
      console.error('�x}� [FFmpeg] �R FFmpeg initialization FAILED:', error);
      console.warn('�x}� [FFmpeg] MP4 export will be unavailable. App will continue normally.');
      this.isFFmpegLoaded = false;
      this.ffmpeg = null;
      this.updateMp4Availability(false);
    }
  }

}

export { ScreenSmoothRecorderMethodsPart2 };
