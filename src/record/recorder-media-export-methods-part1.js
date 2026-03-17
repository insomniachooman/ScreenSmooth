class RecorderMediaExportMethodsPart1 {
  async startRecording() {
    ('�x}� START RECORDING METHOD CALLED!');
    ('�x� DEBUG: this object:', this);
    ('�x� DEBUG: window.simpleLicenseSystem:', window.simpleLicenseSystem);

    try {
      console.log('�x}� [RECORDING] startRecording() entered at', Date.now());
      
      // TEMPORARY FIX: Skip license check for beta testing
      ('�x� BETA: Skipping license check for testing');
      const isPremium = true; // Force premium for beta testing

      // License gate: require premium before recording
      // ('�x� Checking license system...');
      // const isPremium = await window.simpleLicenseSystem?.isPremium();
      // ('�x� Premium gate check result:', isPremium);

      if (!isPremium) {
        ('�x� Premium required for recording - redirecting to checkout');
        try {
          const checkoutUrl = 'https://screensmooth.lemonsqueezy.com/buy/f27c49be-d583-4f27-a733-5de61a44f8d8';
          ('�x Opening checkout URL:', checkoutUrl);
          // Open checkout in a new tab for extensions
          try {
            ('�x Trying chrome.tabs.create...');
            await chrome.tabs.create({ url: checkoutUrl, active: true });
            ('�S& Checkout tab opened successfully');
          } catch (chromeError) {
            ('�a�️ chrome.tabs.create failed, trying fallback:', chromeError);
            // Fallback for environments without chrome.tabs
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            ('�S& Checkout opened with window.open fallback');
          }
        } catch (e) {
          ('�R Could not open checkout tab:', e);
        }

        // Show user-friendly message
        ('�x� Showing user message...');
        if (window.screenSmoothRecorder?.showInfo) {
          window.screenSmoothRecorder.showInfo('Premium license required for recording. A checkout tab has been opened.');
        } else {
          alert('Premium license required for recording. Please complete your purchase in the new tab.');
        }
        this.resetRecordingButton?.();
        ('�xa� Recording blocked due to license requirement');
        return;
      }

      console.log('�x}� [RECORDING] License check passed, proceeding...');
      // Clear all zoom data when starting a new recording
      this.clearAllZoomData();

      console.log('�x}� [RECORDING] Updating button state...');
      this.startRecordingBtn.disabled = true;
      this.startRecordingBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                Starting...
            `;

      // STEP 1: Get screen capture constraints
      console.log('�x}� [RECORDING] STEP 1: Getting recording constraints');
      const constraints = this.getRecordingConstraints();

      // STEP 2: Request screen capture (shows browser dialog)
      console.log('�x}� [RECORDING] STEP 2: Calling getDisplayMedia (browser dialog will appear)');
      this.stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      console.log('�x}� [RECORDING] STEP 2 COMPLETE: Screen capture acquired');

      // STEP 2.5: Store the selected tab and bring focus back to record.html for countdown
      // Chrome automatically focuses the selected tab/window after getDisplayMedia,
      // so we need to: 1) remember which tab was selected, 2) switch back for countdown
      console.log('�x}� [RECORDING] STEP 2.5: Storing selected tab and bringing focus back for countdown');
      let selectedTabId = null;
      let selectedWindowId = null;
      try {
        // Small delay to ensure Chrome has finished focusing the selected tab
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get the currently active tab in any window (this is the tab the user selected to record)
        const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (activeTab) {
          selectedTabId = activeTab.id;
          selectedWindowId = activeTab.windowId;
          console.log('�x}� [RECORDING] Selected tab to record:', selectedTabId, 'in window:', selectedWindowId);
        }
        
        // Now switch back to the record page for the countdown
        const recordTab = await chrome.tabs.getCurrent();
        if (recordTab) {
          await chrome.tabs.update(recordTab.id, { active: true });
          if (chrome.windows) {
            await chrome.windows.update(recordTab.windowId, { focused: true });
          }
          // Small delay to ensure tab switch animation completes before countdown starts
          await new Promise(resolve => setTimeout(resolve, 150));
          console.log('�x}� [RECORDING] STEP 2.5 COMPLETE: Focus returned to record page');
        }
      } catch (focusError) {
        console.warn('�x}� [RECORDING] Could not return focus to record page:', focusError);
      }

      // Check if user cancelled the screen share
      if (!this.stream) {
        throw new Error("Screen capture was cancelled");
      }

      // Detect when user clicks "Stop sharing" in the browser UI
      this.stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('User clicked Stop sharing (video track ended)');

        // Use the proper stopRecording method to ensure all cleanup happens
        // (content script notification, cursor data processing, etc.)
        if (this.isRecording) {
          console.log('Calling stopRecording() from track ended event');
          this.stopRecording();
        } else {
          console.log('Recording already stopped or not active');
        }

        // Bring the recorder tab to front
        if (chrome.tabs && chrome.tabs.getCurrent) {
          chrome.tabs.getCurrent((tab) => {
            if (tab) {
              chrome.tabs.update(tab.id, { active: true });
              if (chrome.windows) {
                chrome.windows.update(tab.windowId, { focused: true });
              }
            }
          });
        }
      });

      // STEP 3: Start Countdown AFTER screen is selected
      console.log('�x}� [RECORDING] STEP 3: Starting countdown');
      await this.startCountdown();
      console.log('�x}� [RECORDING] STEP 3 COMPLETE: Countdown finished');

      // STEP 3.5: Switch back to the recorded tab so user can start their demo
      console.log('�x}� [RECORDING] STEP 3.5: Switching to recorded tab');
      try {
        if (selectedTabId) {
          await chrome.tabs.update(selectedTabId, { active: true });
          if (chrome.windows && selectedWindowId) {
            await chrome.windows.update(selectedWindowId, { focused: true });
          }
          console.log('�x}� [RECORDING] STEP 3.5 COMPLETE: Switched to recorded tab:', selectedTabId);
        } else {
          console.log('�x}� [RECORDING] STEP 3.5: No selected tab ID, skipping switch');
        }
      } catch (switchError) {
        console.warn('�x}� [RECORDING] Could not switch to recorded tab:', switchError);
      }

      // STEP 4: Inject cursor script AFTER countdown completes
      console.log('�x}� [RECORDING] STEP 4: Injecting cursor script');
      await this.injectCursorScript();
      console.log('�x}� [RECORDING] STEP 4 COMPLETE: Cursor script injected');

      // Set up MediaRecorder with optimized settings
      const options = this.getMediaRecorderOptions();
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      ("MediaRecorder created with options:", options);
      ("MediaRecorder supported:", MediaRecorder.isTypeSupported(options.mimeType || 'video/webm'));

      this.recordedChunks = [];

      // Enhanced data collection with frequent intervals for reliability
      this.mediaRecorder.ondataavailable = (event) => {
        ("Data available, chunk size:", event.data.size, "bytes");
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
          ("Total chunks collected:", this.recordedChunks.length);
        } else {
          ("Received empty chunk from MediaRecorder");
        }
      };

      this.mediaRecorder.onstop = () => {
        ("MediaRecorder stopped, final chunks:", this.recordedChunks.length);
        this.handleRecordingComplete();
      };

      this.mediaRecorder.onerror = (event) => {
        ("MediaRecorder error:", event.error);
        this.showError("Recording error: " + (event.error?.message || "Unknown error"));
        this.resetRecordingButton();
      };

      this.mediaRecorder.onstart = () => {
        ("MediaRecorder started successfully");
      };

      this.mediaRecorder.onpause = () => {
        ("MediaRecorder paused");
      };

      this.mediaRecorder.onresume = () => {
        ("MediaRecorder resumed");
      };

      // Handle stream ending (user stops sharing)
      this.stream.getVideoTracks()[0].addEventListener("ended", () => {
        if (this.isRecording) {
          this.stopRecording();
        }
      });

      // Start recording with frequent data collection (100ms intervals for reliability)
      ("Starting MediaRecorder with 100ms intervals...");
      // �x}� CRITICAL: Capture exact recording start timestamp for cursor synchronization
      // Using Date.now() (absolute Unix time) to match content script timestamps
      // Cannot use performance.now() - it has different time origins on different pages!
      this.recordingStartTimestamp = Date.now();
      console.log('�x}� [DEBUG] Starting MediaRecorder at timestamp:', this.recordingStartTimestamp);
      this.mediaRecorder.start(100); // Collect data every 100ms for reliable capture
      this.isRecording = true;
      this.startTime = Date.now();
      this.pausedTime = 0;
      this.pauseStartTime = 0;

      // Start timer
      this.startTimer();

      // Switch to recording controls view
      this.showRecordingControls();

      // Hide editor when recording starts
      this.hideEditor();

      // Notify content script with showCursor setting
      const cursorSettings = window.cursorSettingsManager?.getSettings();
      const showCursor = cursorSettings?.showCursor !== false; // Default to true
      this.notifyContentScript("recordingStarted", { showCursor });

      ("Recording started successfully");
    } catch (error) {
      ("Error starting recording:", error);
      this.showError(
        "Failed to start recording. Please ensure you grant screen capture permission."
      );
      this.resetRecordingButton();
    }
  }


  getRecordingConstraints() {
    const baseConstraints = {
      video: {
        mediaSource: this.selectedRecordingType,
        width: { ideal: this.selectedQuality === "high" ? 1920 : 1280 },
        height: { ideal: this.selectedQuality === "high" ? 1080 : 720 },
        frameRate: { ideal: 30 },
      },
      audio: this.systemAudio,
    };

    return baseConstraints;
  }


  getMediaRecorderOptions() {
    const mimeTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return {
          mimeType,
          videoBitsPerSecond:
            this.selectedQuality === "high" ? 5000000 : 2500000,
        };
      }
    }

    return {}; // Use default
  }


  togglePause() {
    if (!this.mediaRecorder) return;

    if (this.isPaused) {
      this.mediaRecorder.resume();
      this.isPaused = false;
      this.pausedTime += Date.now() - this.pauseStartTime;
      this.startTimer();
      this.pauseRecordingBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                Pause
            `;
    } else {
      this.mediaRecorder.pause();
      this.isPaused = true;
      this.pauseStartTime = Date.now();
      this.stopTimer();
      this.pauseRecordingBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
                Resume
            `;
    }
  }


  stopRecording() {
    if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
      return;
    }

    ("Stopping recording...");
    ("MediaRecorder state before stop:", this.mediaRecorder.state);
    ("Chunks collected so far:", this.recordedChunks.length);

    try {
      // Request final data before stopping (critical for capturing last chunks)
      if (this.mediaRecorder.state === "recording" || this.mediaRecorder.state === "paused") {
        ("Stopping MediaRecorder directly...");
        this.mediaRecorder.stop();
      }
    } catch (error) {
      ("Error during MediaRecorder stop:", error);
      // Force stop if there's an error
      try {
        this.mediaRecorder.stop();
      } catch (stopError) {
        ("Failed to stop MediaRecorder:", stopError);
      }
    }

    this.isRecording = false;
    this.isPaused = false;

    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
        ("Stopped track:", track.kind, track.label);
      });
    }

    this.stopTimer();

    // Notify content script and remove cursor overlay
    this.notifyContentScript("recordingStopped");
    this.removeCursorScript();

    // Process cursor data with Spring Physics
    this.processCursorDataWithSprings();

    ("Recording stop process completed");
  }


  handleRecordingComplete() {
    ("Recording completed, processing...");

    // Enhanced MediaRecorder data collection with final flush
    ("=== MediaRecorder Final Data Collection ===");
    ("Recorded chunks count:", this.recordedChunks.length);
    ("Chunks sizes:", this.recordedChunks.map(chunk => chunk.size));

    // Request final data if MediaRecorder is still available
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        ("Requesting final data from MediaRecorder...");
        this.mediaRecorder.requestData();
        // Wait a moment for final chunks
        setTimeout(() => this.finalizeBlobCreation(), 100);
        return;
      } catch (error) {
        ("Could not request final data:", error);
      }
    }

    this.finalizeBlobCreation();
  }

}

export { RecorderMediaExportMethodsPart1 };
