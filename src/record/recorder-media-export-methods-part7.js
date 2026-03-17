class RecorderMediaExportMethodsPart7 {
  async downloadOriginalRecording() {
    try {
      ("Downloading original recording without processing...");

      // Validate original recording
      if (!this.recordingBlob || this.recordingBlob.size === 0) {
        throw new Error("Original recording is empty or corrupted");
      }

      ("Original recording size:", this.recordingBlob.size, "Type:", this.recordingBlob.type);

      const url = URL.createObjectURL(this.recordingBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.generateFileName().replace(/\.(mp4|webm|gif)$/, '.webm'); // Use original format
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showSuccess("Original recording downloaded successfully!");
    } catch (error) {
      ("Error downloading original recording:", error);
      this.showError("Failed to download original recording: " + error.message);
    }
  }

  // Enhanced debug method to validate recording with comprehensive logging

  validateRecording() {
    ("=== Enhanced Recording Validation ====");
    ("Recording blob exists:", !!this.recordingBlob);
    ("Recording blob size:", this.recordingBlob?.size || 0, "bytes");
    ("Recording blob size (MB):", ((this.recordingBlob?.size || 0) / 1024 / 1024).toFixed(2));
    ("Recording blob type:", this.recordingBlob?.type || 'unknown');
    ("Video duration (current):", this.videoDuration);
    ("Video duration (finite check):", Number.isFinite(this.videoDuration));
    ("Video duration (positive check):", this.videoDuration > 0);
    ("Preview video src:", this.previewVideo?.src ? 'set' : 'not set');
    ("Preview video readyState:", this.previewVideo?.readyState || 'unknown');
    ("Recorded duration fallback:", this.getRecordedDuration());
    ("Trim start:", this.trimStart);
    ("Trim end:", this.trimEnd);
    ("Needs processing:", this.needsProcessing());

    // Validate recording blob
    const blobValid = this.recordingBlob && this.recordingBlob.size > 0;
    ("Blob validation:", blobValid ? "�S PASS" : "�S FAIL");

    // Validate duration
    const durationValid = Number.isFinite(this.videoDuration) && this.videoDuration > 0;
    ("Duration validation:", durationValid ? "�S PASS" : "�S FAIL");

    // Validate trim settings
    const trimValid = this.trimStart >= 0 && this.trimEnd > this.trimStart;
    ("Trim validation:", trimValid ? "�S PASS" : "�S FAIL");

    const overallValid = blobValid && (durationValid || this.getRecordedDuration() > 0);
    ("Overall validation:", overallValid ? "�S PASS" : "�S FAIL");
    ("======================================");

    // Provide detailed error information if validation fails
    if (!overallValid) {
      if (!blobValid) {
        ("�R Validation failed: Recording blob is missing or empty");
        ("   �  Please try recording again");
      }
      if (!durationValid && this.getRecordedDuration() <= 0) {
        ("�R Validation failed: Video duration is invalid and no fallback available");
        ("   �  Duration value:", this.videoDuration);
        ("   �  Recorded duration:", this.getRecordedDuration());
        ("   �  Try refreshing the page and recording again");
      }
    }

    return overallValid;
  }


  async createOptimizedCompositedVideo() {
    return new Promise((resolve, reject) => {
      ('Starting optimized canvas-based video composition...');

      const canvasTimeout = setTimeout(() => {
        this.isExportMode = false;
        reject(new Error("Canvas composition timed out after 30 minutes. Try reducing effects or video length."));
      }, 30 * 60 * 1000);

      if (!this.recordingBlob) {
        clearTimeout(canvasTimeout);
        reject(new Error("No recording blob available"));
        return;
      }

      if (!this.isCanvasRecordingSupported()) {
        ('Canvas recording not supported, falling back to original recording');
        clearTimeout(canvasTimeout);
        resolve(this.recordingBlob);
        return;
      }

      const tempVideo = this.createTempExportVideo(this.recordingBlob);

      const fail = (error, fallbackMessage) => {
        clearTimeout(canvasTimeout);
        this.isExportMode = false;
        const message = fallbackMessage || (error && error.message) || 'Unknown composition error';
        reject(new Error(message));
      };

      tempVideo.addEventListener('error', (error) => {
        ('Temp video error:', error);
        fail(error, "Failed to load video for processing. Please try with original recording.");
      }, { once: true });

      tempVideo.addEventListener('loadedmetadata', async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: false });
          if (!ctx) {
            throw new Error("Could not get canvas 2D context");
          }

          await this.processVideoOnCanvasForComposition({
            canvas,
            ctx,
            video: tempVideo,
            canvasTimeout,
            resolve,
            reject
          });
        } catch (error) {
          fail(error);
        }
      }, { once: true });
    });
  }


  isCanvasRecordingSupported() {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 100;
    testCanvas.height = 100;

    const testCtx = testCanvas.getContext('2d');
    if (!testCtx) {
      return false;
    }

    testCtx.fillStyle = 'red';
    testCtx.fillRect(0, 0, 100, 100);

    try {
      const testStream = testCanvas.captureStream(1);
      const supported = !!(testStream && testStream.getTracks().length > 0);
      if (testStream) {
        testStream.getTracks().forEach((track) => track.stop());
      }
      ('Canvas recording support:', supported);
      return supported;
    } catch (error) {
      ('Canvas recording not supported:', error);
      return false;
    }
  }


  createTempExportVideo(blob) {
    const tempVideo = document.createElement('video');
    tempVideo.src = URL.createObjectURL(blob);
    tempVideo.muted = true;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.preload = 'metadata';
    tempVideo.playsInline = true;
    return tempVideo;
  }


  async processVideoOnCanvasForComposition({ canvas, ctx, video, canvasTimeout, resolve, reject }) {
    const state = {
      isDrawing: false,
      frameCount: 0,
      isRecordingActive: true,
      lastCapturedTime: -1,
      lastProgressLog: -1
    };

    try {
      this.setupExportCanvasDimensions(canvas, video);
      await this.waitForExportVideoReady(video);

      const stream = canvas.captureStream(0);
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack || typeof videoTrack.requestFrame !== 'function') {
        console.warn('requestFrame() not supported, falling back to original recording');
        clearTimeout(canvasTimeout);
        resolve(this.recordingBlob);
        return;
      }

      const recordedChunks = [];
      const mimeType = this.getSupportedCanvasMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: this.selectedQuality === 'high' ? 2000000 : 1000000
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        this.finalizeCanvasRecording({
          recordedChunks,
          mimeType,
          canvasTimeout,
          video,
          state,
          resolve,
          reject
        });
      };

      mediaRecorder.onerror = (event) => {
        clearTimeout(canvasTimeout);
        this.isExportMode = false;
        reject(new Error('Recording failed: ' + ((event.error && event.error.message) || 'Unknown error')));
      };

      const startTime = this.trimStart || 0;
      const endTime = this.trimEnd || this.videoDuration;
      const recordingDuration = Math.max(0.1, endTime - startTime);

      this.lastExportDuration = Number.isFinite(recordingDuration) && recordingDuration > 0
        ? recordingDuration
        : this.getRecordedDuration() || 10;

      this.initializeExportContexts(video, startTime, canvas);
      this.drawExportFrameToCanvas({ ctx, canvas, video, state });

      mediaRecorder.start(50);
      this.isExportMode = true;

      const recordingEndTimeout = setTimeout(() => {
        state.isRecordingActive = false;
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.requestData();
          setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
          }, 200);
        }
      }, 30 * 60 * 1000);

      this.startAudioExportCaptureLoop({
        video,
        canvas,
        ctx,
        state,
        mediaRecorder,
        videoTrack,
        startTime,
        endTime,
        recordingDuration,
        recordingEndTimeout
      });
    } catch (error) {
      clearTimeout(canvasTimeout);
      this.isExportMode = false;
      reject(new Error('Canvas setup failed: ' + (error.message || error)));
    }
  }


  setupExportCanvasDimensions(canvas, video) {
    const baseWidth = video.videoWidth || 1920;
    const baseHeight = video.videoHeight || 1080;
    const canvasDimensions = this.calculateAspectRatioDimensions(baseWidth, baseHeight, this.currentAspectRatio);

    canvas.width = canvasDimensions.width + (this.currentPadding * 2);
    canvas.height = canvasDimensions.height + (this.currentPadding * 2);
  }


  waitForExportVideoReady(video) {
    return new Promise((videoResolve) => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        videoResolve();
        return;
      }

      const checkReady = () => {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          videoResolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      setTimeout(checkReady, 100);
    });
  }


  getSupportedCanvasMimeType() {
    const supportedTypes = [
      'video/webm;codecs=vp8',
      'video/webm;codecs=vp9',
      'video/webm',
      'video/mp4'
    ];

    for (const type of supportedTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm';
  }


  initializeExportContexts(video, startTime, canvas) {
    this.exportZoomContext = {
      currentZoomState: { intensity: 1, position: { x: 0.5, y: 0.5 }, isActive: false },
      targetIntensity: 1,
      targetPosition: { x: 0.5, y: 0.5 },
      transitionStartTime: null,
      transitionStartState: null
    };

    this.exportCursorState = {
      smoothCursor: { x: 0, y: 0 },
      cursorVelocity: { x: 0, y: 0 },
      cursorRotation: 0,
      cursorScale: 1,
      wasCursorPressed: false,
      activeRipples: [],
      stiffness: this.spring || 0.15,
      lastUpdateTime: startTime * 1000
    };
    this.ensureCursorSprings(this.exportCursorState);

    const initialCursorData = (this.rawCursorData && this.rawCursorData.length > 0)
      ? this.rawCursorData
      : this.cursorData;

    if (!initialCursorData || initialCursorData.length === 0) {
      return;
    }

    const initialCursor = this.cursorProcessor.getCursorAtTime(initialCursorData, startTime * 1000);
    if (!initialCursor || !initialCursor.windowWidth || !initialCursor.windowHeight) {
      return;
    }

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const scaleX = videoWidth / initialCursor.windowWidth;
    const scaleY = videoHeight / initialCursor.windowHeight;
    const padding = this.currentPadding || 0;
    const availableWidth = canvas.width - (padding * 2);
    const availableHeight = canvas.height - (padding * 2);
    const videoX = padding + (availableWidth - videoWidth) / 2;
    const videoY = padding + (availableHeight - videoHeight) / 2;

    this.exportCursorState.smoothCursor.x = videoX + (initialCursor.x * scaleX);
    this.exportCursorState.smoothCursor.y = videoY + (initialCursor.y * scaleY);
  }

}

export { RecorderMediaExportMethodsPart7 };
