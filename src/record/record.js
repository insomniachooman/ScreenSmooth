// record.js - Chrome Extension Compatible
// Don't use ES6 imports - use global variables from locally loaded scripts

// Register with background script immediately (replaces chrome.tabs.query)
chrome.runtime.sendMessage({ action: 'register_record_page' }).catch(() => {
  console.log('Background script not ready, will retry registration');
});
const SUPABASE_URL = 'https://gucnquopziweksmdfsbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Y25xdW9weml3ZWtzbWRmc2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NzExNTIsImV4cCI6MjA3NDM0NzE1Mn0.HDqOGRdHIOQ3E4WeSUoN-xllb0yHAcsPjivdZOMWJTw';
// Legacy license validation removed - handled by license gate in HTML head
// ScreenSmoothRecorder initialization continues below...
// Don't use ES6 imports - use global variables from locally loaded scripts
import { CursorProcessor } from './cursor-processor.js';
// Supabase will be available as window.supabase from locally loaded supabase.js

// Global error handler for debugging
window.addEventListener('error', function (e) {
  console.error('🔍 DEBUG: Global JavaScript error:', e.error);
  console.error('🔍 DEBUG: Error message:', e.message);
  console.error('🔍 DEBUG: Error filename:', e.filename);
  console.error('🔍 DEBUG: Error line:', e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
  console.error('🔍 DEBUG: Unhandled promise rejection:', e.reason);
});

// Simple license system configuration
const LICENSE_CONFIG = {
  validationEndpoint: 'https://your-domain.com/api/validate-license',
  checkoutUrl: 'https://screensmooth.lemonsqueezy.com/buy/f27c49be-d583-4f27-a733-5de61a44f8d8'
};

let loginView, dashboardView, emailInput, status, authForm, magicBtn, googleBtn, userInfo, logoutBtn;

// REMOVED: Supabase auth integration - using simple license system
// let supabase;

// REMOVED: Auth debugging functions - using simple license system
// window.forceShowDashboard = function () { ... };

// Test recorder functionality
window.testRecorder = function () {
  if (window.screenSmoothRecorder) {
    // Test option cards
    const cards = document.querySelectorAll('.option-card');

    // Test start button
    const startBtn = document.getElementById('start-recording-btn');

    // Test if buttons are clickable
    if (startBtn) {
      startBtn.click();
    }

    // Test option card selection
    if (cards.length > 0) {
      cards[0].click();
    }

  } else {
  }
};

// REMOVED: Auth debugging functions
// window.forceCreateRecorder = function () { ... };

// REMOVED: Auth debugging functions
// window.forceShowDashboardDirect = function () { ... };

// REMOVED: Auth session clearing function
// window.clearSession = function () { ... };

// REMOVED: Auth logout function
// window.manualLogout = function () { ... };

// REMOVED: Auth session checking function
// window.checkStoredSession = function () { ... };

// REMOVED: Auth bypass function
// window.simpleAuthBypass = function () { ... };

// REMOVED: Auth element checking function
// window.checkElements = function () { ... };

// REMOVED: Auth redirect URLs
// const redirectUrl = chrome.runtime.getURL('src/auth/callback.html');
// const extensionRecordUrl = chrome.runtime.getURL('src/record/record.html');

// REMOVED: Complex auth session checking - using simple license system
// async function checkSession() { ... }
// REMOVED: Auth login view - using simple license system
// function showLogin() { ... }

// Show dashboard view (recorder UI) - SIMPLIFIED for license system
async function showDashboard(session = null) {
  console.log('🔍 DEBUG: showDashboard() called');
  try {
    if (dashboardView) {
      dashboardView.style.display = 'block';
    } else {
      console.log('🔍 DEBUG: dashboardView not found');
    }

    // Check license status with error handling
    // Check license status - Assumed true due to header gate
    let hasLicense = true;

    // Update UI based on license status
    try {
      updateLicenseUI(hasLicense);
    } catch (uiError) {
      console.log('🔍 DEBUG: updateLicenseUI error:', uiError);
    }

    // Initialize the recorder with proper error handling
    console.log('🔍 DEBUG: Checking window.screenSmoothRecorder:', typeof window.screenSmoothRecorder);
    if (typeof window.screenSmoothRecorder === 'undefined') {
      console.log('🔍 DEBUG: window.screenSmoothRecorder is undefined, creating new instance');
      try {
        // Add a small delay to ensure dashboard DOM is fully rendered
        setTimeout(() => {
          console.log('🔍 DEBUG: Creating ScreenSmoothRecorder in setTimeout');
          try {
            window.screenSmoothRecorder = new ScreenSmoothRecorder();

            // Verify critical elements after initialization
            if (window.screenSmoothRecorder) {
              console.log('🔍 DEBUG: ScreenSmoothRecorder created successfully in setTimeout');
              // Test element availability
              const optionCards = document.querySelectorAll(".option-card");
              const startBtn = document.getElementById("start-recording-btn");
              console.log('🔍 DEBUG: Found option cards:', optionCards.length, 'start button:', !!startBtn);
            }
          } catch (delayedError) {
            console.log('🔍 DEBUG: Error creating ScreenSmoothRecorder in setTimeout:', delayedError);
          }
        }, 200); // 200ms delay to ensure DOM is ready
      } catch (error) {
        console.error('🔍 DEBUG: Error in setTimeout setup:', error);
      }
    } else {
      console.log('🔍 DEBUG: window.screenSmoothRecorder already exists');
      // Verify it's working
      if (window.screenSmoothRecorder) {
        console.log('🔍 DEBUG: Existing recorder is valid');
      }
    }

  } catch (error) {
    console.log('🔍 DEBUG: Error in showDashboard:', error);
  }
}

// REMOVED: Auth callback handling - using simple license system
// function handleAuthCallback() { ... }

// REMOVED: Magic link handler - using simple license system
// function setupMagicLinkHandler() { ... }

// REMOVED: Google OAuth handler - using simple license system
// function setupGoogleHandler() { ... }

// REMOVED: Logout handler - using simple license system
// function setupLogoutHandler() { ... }

// REMOVED: Auth user email helper - using simple license system
// async function getAuthenticatedUserEmail() { ... }

// Initialize LemonSqueezy when script loads - SIMPLIFIED for license system
function initializeLemonSqueezy() {
  // Check if we're in Chrome extension context
  const isExtension = window.location.protocol === 'chrome-extension:';

  if (isExtension) {
    // Set up the license upgrade button
    setTimeout(async () => {
      await setupLicenseUpgradeButton();
    }, 1000);

    // Mark as initialized
    window.lemonSqueezyInitialized = true;
    return;
  }

  // Web version - simplified for license system
  // Wait for LemonSqueezy script to load
  const checkLemonSqueezy = () => {
    if (typeof window.lemonsqueezy !== 'undefined' && window.lemonsqueezy.Loader) {
      // Set up global checkout success listener (only once)
      if (!window.lemonSqueezyInitialized) {
        window.addEventListener('lemonsqueezy:checkout:success', handleLicenseCheckoutSuccess);
        window.addEventListener('lemonsqueezy:checkout:error', (event) => {
          if (window.screenSmoothRecorder) {
            window.screenSmoothRecorder.showError('Checkout failed. Please try again.');
          }
        });

        window.lemonSqueezyInitialized = true;
      }

      return true;
    }
    return false;
  };

  // Try immediately
  if (checkLemonSqueezy()) return;

  // If not available, check every 200ms for up to 15 seconds
  let attempts = 0;
  const maxAttempts = 75;

  const interval = setInterval(() => {
    attempts++;
    if (checkLemonSqueezy() || attempts >= maxAttempts) {
      clearInterval(interval);
      if (attempts >= maxAttempts) {
        // Set up manual override even without LemonSqueezy loaded
        setTimeout(async () => {
          await setupLicenseUpgradeButton();
        }, 1000);
      }
    }
  }, 200);
}

// Setup license upgrade button - SIMPLIFIED for license system
async function setupLicenseUpgradeButton() {
  const upgradeBtn = document.getElementById('upgrade-premium-btn');
  if (!upgradeBtn) {
    return;
  }

  // Check if user already has license
  try {
    const hasLicense = true; // Assumed true due to header gate
    if (hasLicense) {
      upgradeBtn.textContent = '✅ License Active';
      upgradeBtn.disabled = true;
      upgradeBtn.style.background = '#10b981';
      upgradeBtn.style.cursor = 'default';

      // Update UI
      updateLicenseUI(true);

      if (window.screenSmoothRecorder) {
        window.screenSmoothRecorder.hasLicense = true;
        window.screenSmoothRecorder.updateLicenseFeatures();
      }

      return; // Exit early - no need to set up upgrade functionality
    }
  } catch (error) {
    // Continue with upgrade button setup
  }

  // Remove any existing event listeners
  const newBtn = upgradeBtn.cloneNode(true);
  upgradeBtn.parentNode.replaceChild(newBtn, upgradeBtn);

  // Add click handler - redirect to checkout
  newBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Get current license information
      const { licenseKey } = await chrome.storage.local.get('licenseKey');
      let userEmail = null;

      if (licenseKey) {
        // Try to extract email from license key if available
        // For now, we'll use a generic approach
        userEmail = 'user@screensmooth.app'; // Placeholder
      }

      // Build checkout URL
      const checkoutUrl = `${LICENSE_CONFIG.checkoutUrl}?checkout[email]=${encodeURIComponent(userEmail || '')}`;

      // Redirect immediately
      window.location.href = checkoutUrl;

    } catch (error) {
      // Fallback - redirect to basic checkout
      window.location.href = LICENSE_CONFIG.checkoutUrl;
    }
  });

  // Make sure button and section are visible
  const premiumSection = document.getElementById('premium-section');
  if (premiumSection) {
    premiumSection.style.display = 'block';
    premiumSection.style.visibility = 'visible';
  }

  // Ensure the new button is visible and enabled
  newBtn.style.display = 'inline-block';
  newBtn.style.visibility = 'visible';
  newBtn.disabled = false;
}

// REMOVED: Complex checkout polling - using simple license system
// function setupCheckoutPolling() { ... }

// REMOVED: Premium activation function - using simple license system
// async function activatePremiumSuccess(method) { ... }
// REMOVED: Supabase connection test - using simple license system
// window.testSupabaseConnection = async function () { ... };

// REMOVED: Checkout flow test - using simple license system
// window.testCheckoutFlow = async function () { ... };

// REMOVED: User existence check - using simple license system
// async function ensureUserExistsBeforeCheckout() { ... }

// REMOVED: LemonSqueezy button override - using simple license system
// function overrideLemonSqueezyButtons() { ... }

// REMOVED: Pending purchase record creation - using simple license system
// async function createPendingPurchaseRecord(checkoutSession) { ... }

// REMOVED: Enhanced payment detection - using simple license system
// function startEnhancedPaymentDetection() { ... }
// function stopEnhancedPaymentDetection() { ... }
// async function handlePaymentDetected() { ... }

// REMOVED: Enhanced manual activation - using simple license system
// function showEnhancedManualActivationOption() { ... }

// REMOVED: Force create purchase record - using simple license system
// window.forceCreatePurchaseRecord = async function () { ... };
// REMOVED: Payment Detection System - using simple license system
// function startPaymentDetection() { ... }
// function stopPaymentDetection() { ... }

// REMOVED: Enhanced database premium check - using simple license system
// async function checkUserPremiumStatusFromDB(userId) { ... }

// REMOVED: Show manual activation option - using simple license system
// function showManualActivationOption() { ... }

// REMOVED: Manual payment check function - using simple license system
// window.manuallyCheckPayment = async function () { ... };

// REMOVED: Enhanced database insertion - using simple license system
// async function activatePremiumForUser(userId) { ... }

// REMOVED: Handle Upgrade Click - using simple license system
// async function handleUpgradeClick() { ... }

// REMOVED: Enhanced Premium Upgrade Handler - using simple license system
// function setupPremiumUpgradeHandler() { ... }



// REMOVED: Handle successful checkout completion - using simple license system
// async function handleCheckoutSuccess(event) { ... }

// REMOVED: Create user from purchase data - using simple license system
// async function createUserFromPurchaseData(purchaseData) { ... }

// REMOVED: Reinitialize upgrade button - using simple license system
// function reinitializeUpgradeButton(isPremium) { ... }

// REMOVED: Check user premium status - using simple license system
// async function checkUserPremiumStatus(userId) { ... }

// REMOVED: Update UI based on premium status - using simple license system
// async function updatePremiumUI(isPremium, seatsPurchased = 0, seatsUsed = 0) { ... }

// REMOVED: Check Premium Status on Load - using simple license system
// async function checkPremiumStatusOnLoad() { ... }



// Initialize auth elements and handlers on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements with logging
  loginView = document.getElementById('loginView');
  dashboardView = document.getElementById('dashboardView');
  emailInput = document.getElementById('email');
  status = document.getElementById('status');
  authForm = document.getElementById('authForm');
  magicBtn = document.getElementById('magicBtn');
  googleBtn = document.getElementById('googleBtn');
  userInfo = document.getElementById('userInfo'); // May be null if commented out
  logoutBtn = document.getElementById('logoutBtn');

  // Verify critical elements exist
  if (!loginView) {
    return;
  }
  if (!dashboardView) {
    return;
  }

  setupMagicLinkHandler();
  setupGoogleHandler();
  setupLogoutHandler();

  // Initialize LemonSqueezy - SIMPLIFIED for license system
  initializeLemonSqueezy();

  // Check license status on load
  // License check handled by header gate
  // checkLicense();
});
class ScreenSmoothRecorder {
  constructor() {
    console.log('🔍 DEBUG: ScreenSmoothRecorder constructor called');

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
    this.autoZoomClickEvents = []; // Raw click events stored during recording for post-recording segment generation
    this.selectedZoomSegment = null;
    this.zoomPosition = { x: 0.5, y: 0.5 }; // Normalized position (0-1)
    this.isAddingZoom = false;
    this.isDraggingZoom = false;
    this.zoomDragHandle = null;

    // Spring physics for cursor smoothing (default value, will be updated by slider)
    this.spring = 0.15; // Default spring strength (matches slider default of 50)

    // Listen for cursor settings changes to update spring value in real-time
    window.addEventListener('cursor-settings-changed', (e) => {
      console.log('🎚️ [ScreenSmoothRecorder] Received settings update:', e.detail);
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
      console.log('🎚️ [ScreenSmoothRecorder] Updated spring to:', this.spring);
      // Force re-render to show change immediately
      if (this.previewCanvas && this.previewCanvas.style.display !== 'none') {
        this.renderToCanvas();
      }
    });

    // Load initial spring value from settings if available
    if (window.cursorSettingsManager) {
      const settings = window.cursorSettingsManager.getSettings();
      this.spring = settings.springStrength;
      console.log('🎚️ [ScreenSmoothRecorder] Initial spring value:', this.spring);
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

    console.log('🔍 DEBUG: About to call initialize()');
    this.initialize();
  }

  async initialize() {
    console.log('🔍 DEBUG: ScreenSmoothRecorder.initialize() called');
    try {
      console.log('🔍 DEBUG: Calling initializeElements()');
      this.initializeElements();
      console.log('🔍 DEBUG: Initializing mode warning state');
      this.updateModeWarning(this.selectedRecordingType);
      console.log('🔍 DEBUG: Calling initializeWallpapers()');
      this.initializeWallpapers(); // Initialize wallpapers immediately after elements
      console.log('🔍 DEBUG: Calling attachEventListeners()');
      this.attachEventListeners();
      console.log('🔍 DEBUG: Calling loadStoredSettings()');
      this.loadStoredSettings();
      console.log('🔍 DEBUG: Calling loadZoomData()');
      this.loadZoomData(); // Load saved zoom data
      console.log('🔍 DEBUG: Calling handleHashNavigation()');
      this.handleHashNavigation();
      console.log('🔍 DEBUG: Calling showEditorPanel()');
      this.showEditorPanel("background-panel"); // Show background panel by default
      console.log('🔍 DEBUG: Calling initializeDemoPlayer()');
      this.initializeDemoPlayer();

      // Initialize FFmpeg - BLOCKING with timeout
      console.log('🔍 DEBUG: Starting FFmpeg initialization (blocking)...');
      await this.initializeFFmpeg();
      console.log('🔍 DEBUG: FFmpeg initialization complete, isLoaded:', this.isFFmpegLoaded);

      // Check premium status
      console.log('🔍 DEBUG: Calling checkPremiumStatus()');
      await this.checkPremiumStatus();

      // Initialize license UI
      console.log('🔍 DEBUG: Checking for licenseUI');
      if (window.licenseUI) {
        console.log('🔍 DEBUG: Initializing licenseUI');
        await window.licenseUI.initialize();
      } else {
        console.log('🔍 DEBUG: licenseUI not available');
      }

      // Make recorder available globally for debugging
      console.log('🔍 DEBUG: Setting window.screenSmoothRecorder');
      window.screenSmoothRecorder = this;

      // Add global test functions
      window.testClearButton = () => {
        const btn = document.getElementById('clear-zoom-btn');
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';

          // Set appropriate opacity based on zoom segments
          const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
          btn.style.opacity = hasZoomSegments ? '1' : '0.5';

          btn.click();
        }
      };

      window.testManualMode = () => {
        const radios = document.querySelectorAll('input[name="zoom-mode"]');

        const manualRadio = document.querySelector('input[name="zoom-mode"][value="manual"]');
        if (manualRadio) {
          manualRadio.checked = true;
          manualRadio.dispatchEvent(new Event('change'));
        }

        const controls = document.querySelectorAll('.manual-zoom-controls');
      };

      // Add enhanced UI test function
      window.testUIButtons = () => {
        // Test clicking actual clear button
        const clearBtn = document.getElementById('clear-zoom-btn');
        if (clearBtn) {
          clearBtn.click();
        }

        setTimeout(() => {
          // Test actual radio button click
          const manualRadio = document.querySelector('input[name="zoom-mode"][value="manual"]');
          if (manualRadio) {
            manualRadio.click();

            setTimeout(() => {
              const controls = document.querySelectorAll('.manual-zoom-controls');
            }, 500);
          }
        }, 1000);
      };

      // Add function to force enable clear button
      window.forceClearButtonEnable = () => {
        const btn = document.getElementById('clear-zoom-btn');
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.style.cursor = 'pointer';

          // Set appropriate opacity based on zoom segments
          const hasZoomSegments = window.screenSmoothRecorder.zoomSegments && window.screenSmoothRecorder.zoomSegments.length > 0;
          btn.style.opacity = hasZoomSegments ? '1' : '0.5';
          btn.style.filter = 'none';
        } else {
        }
      };

      // CRITICAL FIX: Re-attach event listeners after full initialization
      // This ensures DOM is completely ready and elements are accessible
      setTimeout(() => {
        this.reattachCriticalEventListeners();
      }, 1000);

      // ADDITIONAL FIX: Keep monitoring and ensuring clear button stays enabled
      this.ensureClearButtonEnabled();

    } catch (error) {
      throw error; // Re-throw to allow caller to handle
    }
  }

  // Monitor and ensure clear button stays enabled
  ensureClearButtonEnabled() {
    const checkClearButton = () => {
      const clearBtn = document.getElementById('clear-zoom-btn');
      if (clearBtn) {
        // Always ensure it's not disabled
        if (clearBtn.disabled || clearBtn.style.pointerEvents === 'none' || clearBtn.style.cursor === 'not-allowed') {
          clearBtn.disabled = false;
          clearBtn.style.pointerEvents = 'auto';
          clearBtn.style.cursor = 'pointer';
        }

        // Set opacity based on whether there are zoom segments to clear
        const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
        const targetOpacity = hasZoomSegments ? '1' : '0.5';

        if (clearBtn.style.opacity !== targetOpacity) {
          clearBtn.style.opacity = targetOpacity;
        }
      }
    };

    // Check immediately and then every 3 seconds
    checkClearButton();
    setInterval(checkClearButton, 3000);
  }

  // Re-attach critical event listeners that might get lost during initialization
  reattachCriticalEventListeners() {
    // Re-attach clear button listener
    const clearBtn = document.getElementById('clear-zoom-btn');
    if (clearBtn) {
      // FORCE ENABLE the button
      clearBtn.disabled = false;
      clearBtn.style.pointerEvents = 'auto';
      clearBtn.style.cursor = 'pointer';
      clearBtn.style.opacity = '1';

      // Remove any existing listeners by cloning the element
      const newClearBtn = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);

      // FORCE ENABLE the new button too
      newClearBtn.disabled = false;
      newClearBtn.style.pointerEvents = 'auto';
      newClearBtn.style.cursor = 'pointer';

      // Set initial opacity based on zoom segments
      const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
      newClearBtn.style.opacity = hasZoomSegments ? '1' : '0.5';

      newClearBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearAllZoomSegments();
      });

      // Update reference
      this.clearZoomBtn = newClearBtn;
    } else {
    }

    // Re-attach zoom mode radio listeners
    const zoomRadios = document.querySelectorAll('input[name="zoom-mode"]');
    zoomRadios.forEach((radio, index) => {
      // Clone to remove existing listeners
      const newRadio = radio.cloneNode(true);
      radio.parentNode.replaceChild(newRadio, radio);

      newRadio.addEventListener('change', (e) => {
        this.updateZoomMode(e.target.value);
      });
    });

    // Re-attach right sidebar zoom mode radio listeners
    const zoomRadiosRight = document.querySelectorAll('input[name="zoom-mode-right"]');
    zoomRadiosRight.forEach((radio, index) => {
      // Clone to remove existing listeners
      const newRadio = radio.cloneNode(true);
      radio.parentNode.replaceChild(newRadio, radio);

      newRadio.addEventListener('change', (e) => {
        this.updateZoomModeRight(e.target.value);
      });
    });
  }

  // Update clear button appearance based on zoom segments
  updateClearButtonState() {
    const clearBtn = document.getElementById('clear-zoom-btn');
    if (clearBtn) {
      const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;
      const targetOpacity = hasZoomSegments ? '1' : '0.5';

      clearBtn.style.opacity = targetOpacity;
      clearBtn.title = hasZoomSegments
        ? `Clear All Zoom Segments (${this.zoomSegments.length})`
        : 'Clear All Zoom Segments (No segments to clear)';
    }
  }

  // Check premium status from extension storage
  async checkPremiumStatus() {
    try {
      // Use the simple license system
      this.isPremium = await window.simpleLicenseSystem?.isPremium() || false;

      // Update UI based on premium status
      this.updatePremiumFeatures();

    } catch (error) {
      this.isPremium = false;
    }
  }

  // Update UI based on premium features
  updatePremiumFeatures() {
    // Update zoom controls visibility
    // MOVED: .zoom-track removed from here effectively to ensure it stays interactive
    // This aligns with createZoomSegmentAtTime where the premium check is commented out
    const zoomControls = document.querySelectorAll('.zoom-controls, .zoom-panel');
    const premiumOverlays = document.querySelectorAll('.premium-overlay');

    // Always ensure zoom track is interactive regardless of premium status
    // This fixes the bug where timeline clicks would be ignored (no logs)
    if (this.zoomTrack) {
      this.zoomTrack.style.cursor = 'pointer';
      this.zoomTrack.style.pointerEvents = 'auto';
      // Only adjust opacity if you want visual feedback, but 'auto' is key for events
      this.zoomTrack.style.opacity = '1';
    }

    if (this.isPremium) {
      // Enable premium features
      zoomControls.forEach(control => {
        control.style.opacity = '1';
        control.style.pointerEvents = 'auto';
      });

      premiumOverlays.forEach(overlay => {
        overlay.style.display = 'none';
      });
    } else {
      // Disable premium features with overlay
      zoomControls.forEach(control => {
        control.style.opacity = '0.5';
        control.style.pointerEvents = 'none';
      });


      premiumOverlays.forEach(overlay => {
        overlay.style.display = 'block';
      });
    }

    // Update license UI elements
    const licenseBadge = document.getElementById('license-badge');
    const upgradeBtn = document.getElementById('upgrade-premium-btn');
    const manageBtn = document.getElementById('manage-license-btn');

    if (this.isPremium) {
      if (licenseBadge) licenseBadge.style.display = 'inline-block';
      if (upgradeBtn) {
        upgradeBtn.textContent = '✅ License Active';
        upgradeBtn.disabled = true;
        upgradeBtn.style.background = '#10b981';
        upgradeBtn.style.cursor = 'default';
      }
      if (manageBtn) manageBtn.style.display = 'inline-block';
    } else {
      if (licenseBadge) licenseBadge.style.display = 'none';
      if (upgradeBtn) {
        upgradeBtn.textContent = 'Upgrade to Premium - $49 Lifetime';
        upgradeBtn.disabled = false;
        upgradeBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        upgradeBtn.style.cursor = 'pointer';
      }
      if (manageBtn) manageBtn.style.display = 'none';
    }
  }

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
        console.log('✅ Export format loaded:', savedFormat);
      } else {
        // First-time user or corrupted data - use default
        const defaultFormat = 'webm';
        if (this.formatSelect) {
          this.formatSelect.value = defaultFormat;
        }
        if (this.formatSelectRight) {
          this.formatSelectRight.value = defaultFormat;
        }
        console.log('ℹ️ Using default export format:', defaultFormat);
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
    console.log('🎬 [FFmpeg] Starting FFmpeg initialization...');
    try {
      let FFmpeg;
      let fetchFile;
      let toBlobURL;

      try {
        console.log('🎬 [FFmpeg] Trying dynamic import...');
        const ffmpegModule = await import('@ffmpeg/ffmpeg');
        const utilModule = await import('@ffmpeg/util');
        FFmpeg = ffmpegModule.FFmpeg;
        fetchFile = utilModule.fetchFile;
        toBlobURL = utilModule.toBlobURL;
        console.log('🎬 [FFmpeg] Dynamic import successful');
      } catch (moduleError) {
        console.log('🎬 [FFmpeg] Dynamic import failed:', moduleError.message);
        if (typeof window !== 'undefined' && window.FFmpegWASM && window.FFmpegWASM.FFmpeg) {
          console.log('🎬 [FFmpeg] Using window.FFmpegWASM.FFmpeg...');
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
          console.log('🎬 [FFmpeg] Using window.FFmpeg...');
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
      console.log('🎬 [FFmpeg] Asset base URL:', baseURL);
      console.log('🎬 [FFmpeg] classWorkerURL:', classWorkerURL);

      const supportsSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
      console.log('🎬 [FFmpeg] SharedArrayBuffer available:', supportsSharedArrayBuffer);

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
        console.log(`🎬 [FFmpeg] ---- Stage: ${name} ----`);
        console.log('🎬 [FFmpeg] Load config:', loadConfig);

        try {
          const preflightUrls = [loadConfig.classWorkerURL, loadConfig.coreURL, loadConfig.wasmURL];
          if (loadConfig.workerURL) preflightUrls.push(loadConfig.workerURL);

          for (const url of preflightUrls) {
            const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
            if (!response.ok) {
              throw new Error(`Preflight failed for ${url} (HTTP ${response.status})`);
            }
            console.log(`🎬 [FFmpeg] Preflight OK: ${url}`);
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
          console.log(`🎬 [FFmpeg] ✅ Loaded successfully via ${name} stage`);
          break;
        } catch (stageError) {
          lastError = stageError;
          console.error(`🎬 [FFmpeg] ❌ Stage ${name} failed:`, stageError.message || stageError);
          if (this.ffmpeg && typeof this.ffmpeg.terminate === 'function') {
            try {
              this.ffmpeg.terminate();
            } catch (terminateError) {
              console.warn('🎬 [FFmpeg] Failed to terminate FFmpeg instance:', terminateError.message);
            }
          }
          this.ffmpeg = null;
        }
      }

      if (!loaded) {
        throw lastError || new Error('FFmpeg failed to load in all stages');
      }
    } catch (error) {
      console.error('🎬 [FFmpeg] ❌ FFmpeg initialization FAILED:', error);
      console.warn('🎬 [FFmpeg] MP4 export will be unavailable. App will continue normally.');
      this.isFFmpegLoaded = false;
      this.ffmpeg = null;
      this.updateMp4Availability(false);
    }
  }

  attachEventListeners() {
    // Sidebar navigation
    this.sidebarBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelId = btn.dataset.panel;
        this.showEditorPanel(panelId);
      });
    });

    // Changelog toggle
    const changelogToggle = document.getElementById("changelog-toggle");
    const changelogSection = document.getElementById("changelog-section");
    if (changelogToggle && changelogSection) {
      changelogToggle.addEventListener("click", () => {
        changelogSection.classList.toggle("open");
      });
    }

    // Option card selection
    if (this.optionCards && this.optionCards.length > 0) {
      this.optionCards.forEach((card, index) => {
        card.addEventListener("click", () => {
          this.selectRecordingType(card);
        });
      });
    } else {
    }

    // Recording controls
    if (this.startRecordingBtn) {
      this.startRecordingBtn.addEventListener("click", (event) => {
        this.startRecording();
      });
    } else {
    }

    if (this.pauseRecordingBtn) {
      this.pauseRecordingBtn.addEventListener("click", () => this.togglePause());
    }
    if (this.stopRecordingBtn) {
      this.stopRecordingBtn.addEventListener("click", () => this.stopRecording());
    }
    if (this.recordAgainBtn) {
      this.recordAgainBtn.addEventListener("click", () => this.recordAgain());
    }
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.downloadRecording());
    }
    if (this.shareBtn) {
      this.shareBtn.addEventListener("click", () => this.shareRecording());
    }

    // Manage Subscription button
    const manageSubBtnNew = document.getElementById("manage-subscription-btn-new");
    if (manageSubBtnNew) {
      manageSubBtnNew.addEventListener("click", () => {
        window.open("https://customer.dodopayments.com/login/bus_wAEE2uSAiYkqlteBcSj4M", "_blank");
      });
    }

    // Quality and feature settings
    document.querySelectorAll('input[name="quality"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.selectedQuality = e.target.value;
      });
    });

    document
      .getElementById("cursor-tracking")
      .addEventListener("change", (e) => {
        this.cursorTracking = e.target.checked;
      });

    document.getElementById("system-audio").addEventListener("change", (e) => {
      this.systemAudio = e.target.checked;
    });

    // Video preview events
    if (this.previewVideo) {
      this.previewVideo.addEventListener("loadedmetadata", () => this.onVideoLoaded());
      this.previewVideo.addEventListener("timeupdate", () => this.onVideoTimeUpdate());
      this.previewVideo.addEventListener("ended", () => this.onVideoEnded());
      this.previewVideo.addEventListener("play", () => this.onVideoPlay());
      this.previewVideo.addEventListener("pause", () => this.onVideoPause());
      this.previewVideo.addEventListener("durationchange", () => this.onVideoDurationChange());
      // CRITICAL: Add seeked event to handle manual timeline seeking
      this.previewVideo.addEventListener("seeked", () => this.onVideoSeeked());
    }

    // Custom video player controls
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.rewindBtn.addEventListener("click", () => this.rewind());
    this.forwardBtn.addEventListener("click", () => this.forward());
    this.volumeBtn.addEventListener("click", () => this.toggleMute());
    this.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());

    // Progress bar events
    this.progressBarContainer.addEventListener("click", (e) =>
      this.seekToProgressPosition(e)
    );
    this.progressHandle.addEventListener("mousedown", (e) =>
      this.startProgressDrag(e)
    );

    // Timeline events
    this.timelineTrack.addEventListener("click", (e) =>
      this.seekToTimelinePosition(e)
    );
    this.trimHandleLeft.addEventListener("mousedown", (e) =>
      this.startDragging(e, "left")
    );
    this.trimHandleRight.addEventListener("mousedown", (e) =>
      this.startDragging(e, "right")
    );

    // Global mouse events for dragging
    document.addEventListener("mousemove", (e) => this.handleDragging(e));
    document.addEventListener("mouseup", () => this.stopDragging());

    // Background panel controls
    this.randomWallpaperBtn.addEventListener("click", () =>
      this.pickRandomWallpaper()
    );
    if (this.videoPadding) {
      this.videoPadding.addEventListener("input", () => this.updateVideoPreview());
    }
    if (this.videoBlur) {
      this.videoBlur.addEventListener("input", () => this.updateVideoPreview());
    }
    if (this.videoBorderRadius) {
      this.videoBorderRadius.addEventListener("input", () => this.updateVideoPreview());
    }
    if (this.aspectRatioSelect) {
      this.aspectRatioSelect.addEventListener("change", () => this.updateAspectRatio());
    }

    // Screen panel controls
    if (this.screenBrightness) {
      this.screenBrightness.addEventListener("input", () =>
        this.updateScreenEffects()
      );
    }
    if (this.screenContrast) {
      this.screenContrast.addEventListener("input", () =>
        this.updateScreenEffects()
      );
    }
    if (this.screenSaturation) {
      this.screenSaturation.addEventListener("input", () =>
        this.updateScreenEffects()
      );
    }

    // Demo Player - add null checks
    if (this.demoPlayPauseBtn) {
      this.demoPlayPauseBtn.addEventListener("click", () =>
        this.toggleDemoPlayPause()
      );
    }
    if (this.demoVideo) {
      this.demoVideo.addEventListener("timeupdate", () =>
        this.updateDemoTimeline()
      );
    }
    if (this.timelineBarTrack) {
      this.timelineBarTrack.addEventListener("click", (e) =>
        this.seekDemoTimeline(e)
      );
    }

    // Zoom controls - updated for one-click functionality
    // Commented out add zoom button as requested
    // if (this.addZoomBtn) {
    //   this.addZoomBtn.addEventListener("click", () => this.toggleAddZoomMode());
    // } else {
    //   ('Add zoom button not found');
    // }
    if (this.clearZoomBtn) {
      this.clearZoomBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearAllZoomSegments();
      });

      // Add backup click handler using direct DOM query
      setTimeout(() => {
        const backupBtn = document.getElementById('clear-zoom-btn');
        if (backupBtn && backupBtn !== this.clearZoomBtn) {
          backupBtn.addEventListener("click", () => {
            this.clearAllZoomSegments();
          });
        }
      }, 1000);
    } else {
      // Try backup query
      setTimeout(() => {
        const btn = document.getElementById('clear-zoom-btn');
        if (btn) {
          btn.addEventListener("click", () => {
            this.clearAllZoomSegments();
          });
        }
      }, 1000);
    }
    if (this.zoomTrack) {
      this.zoomTrack.addEventListener("click", (e) => this.handleZoomTrackClick(e));
      this.zoomTrack.addEventListener("mousemove", (e) => this.handleZoomTrackHover(e));
      this.zoomTrack.addEventListener("mouseleave", () => this.hideZoomHoverIndicator());
      this.zoomTrack.addEventListener("mouseenter", () => this.showZoomTrackHover());
    } else {
    }
    if (this.zoomIntensitySlider) {
      this.zoomIntensitySlider.addEventListener("input", () => {
        // Add small delay to prevent rapid firing
        clearTimeout(this.intensityUpdateTimeout);
        this.intensityUpdateTimeout = setTimeout(() => {
          this.updateZoomIntensity();
        }, 50);
      });
    }

    // === SCREEN STUDIO MATCH === Wire Animation Duration preset buttons (Rapid/Quick/Default/Slow)
    this.zoomAnimationPreset = 'default';
    const initAnimPresetControl = (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.querySelectorAll('.segment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          // Update active state in BOTH left and right panels
          document.querySelectorAll('.zoom-anim-preset .segment-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll(`.zoom-anim-preset .segment-btn[data-value="${btn.dataset.value}"]`).forEach(b => b.classList.add('active'));
          this.zoomAnimationPreset = btn.dataset.value;
          // Rebuild springs with new preset
          this._zoomSprings = null;
          if (this.exportZoomContext) this.exportZoomContext._zoomSprings = null;
          console.log(`🎚️ [ZOOM] Animation preset changed to: ${btn.dataset.value}`);
        });
      });
    };
    initAnimPresetControl('zoom-anim-duration');
    initAnimPresetControl('zoom-anim-duration-right');
    if (this.zoomModeRadios && this.zoomModeRadios.length > 0) {
      this.zoomModeRadios.forEach((radio, index) => {
        if (radio && radio.addEventListener) {
          radio.addEventListener("change", (e) => {
            // Add small delay to prevent conflicts during panel updates
            clearTimeout(this.modeUpdateTimeout);
            this.modeUpdateTimeout = setTimeout(() => {
              this.updateZoomMode(e.target.value);
            }, 10);
          });
        }
      });
    } else {
    }
    if (this.zoomPositionPreview) {
      this.zoomPositionPreview.addEventListener("click", (e) => {
        // Add small delay to prevent conflicts
        clearTimeout(this.positionUpdateTimeout);
        this.positionUpdateTimeout = setTimeout(() => {
          this.handleZoomPositionClick(e);
        }, 10);
      });
    }

    // Prevent context menu on timeline - add null check
    if (this.timelineTrack) {
      this.timelineTrack.addEventListener("contextmenu", (e) =>
        e.preventDefault()
      );
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardShortcuts(e)
    );

    // Export controls synchronization (left to right)
    if (this.formatSelect) {
      this.formatSelect.addEventListener("change", () => {
        this.syncExportControls();
        // Save export format preference
        chrome.storage.local.set({ exportFormat: this.formatSelect.value }, () => {
          console.log('✅ Export format saved:', this.formatSelect.value);
        });
      });
    }
    if (this.qualitySelect) {
      this.qualitySelect.addEventListener("change", () => this.syncExportControls());
    }
    if (this.compressionLevel) {
      this.compressionLevel.addEventListener("input", () => {
        // Update compression value display
        if (this.compressionValue) {
          this.compressionValue.textContent = this.compressionLevel.value;
        }
        this.syncExportControls();
      });
    }

    // Export controls synchronization (right to left)
    if (this.formatSelectRight) {
      this.formatSelectRight.addEventListener("change", () => {
        this.syncExportControlsRight();
        // Save export format preference
        chrome.storage.local.set({ exportFormat: this.formatSelectRight.value }, () => {
          console.log('✅ Export format saved:', this.formatSelectRight.value);
        });
      });
    }
    if (this.qualitySelectRight) {
      this.qualitySelectRight.addEventListener("change", () => this.syncExportControlsRight());
    }
    if (this.compressionLevelRight) {
      this.compressionLevelRight.addEventListener("input", () => {
        // Update compression value display
        if (this.compressionValueRight) {
          this.compressionValueRight.textContent = this.compressionLevelRight.value;
        }
        this.syncExportControlsRight();
      });
    }

    // Right sidebar event listeners
    if (this.downloadBtnRight) {
      this.downloadBtnRight.addEventListener("click", () => this.downloadRecording());
    }

    if (this.closeZoomControlsBtn) {
      this.closeZoomControlsBtn.addEventListener("click", () => this.showExportAdvancedPanel());
    }

    // Right sidebar zoom controls
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.addEventListener("input", () => {
        clearTimeout(this.intensityUpdateTimeout);
        this.intensityUpdateTimeout = setTimeout(() => {
          this.updateZoomIntensityRight();
        }, 50);
      });
    }

    if (this.zoomModeRadiosRight && this.zoomModeRadiosRight.length > 0) {
      this.zoomModeRadiosRight.forEach((radio, index) => {
        if (radio) {
          radio.addEventListener("change", (e) => {
            clearTimeout(this.modeUpdateTimeout);
            this.modeUpdateTimeout = setTimeout(() => {
              this.updateZoomModeRight(e.target.value);
            }, 10);
          });
        }
      });
    }

    if (this.zoomPositionPreviewRight) {
      this.zoomPositionPreviewRight.addEventListener("click", (e) => {
        clearTimeout(this.positionUpdateTimeout);
        this.positionUpdateTimeout = setTimeout(() => {
          this.handleZoomPositionClickRight(e);
        }, 10);
      });
    }
  }

  initializeWallpapers() {
    this.populateWallpaperGrid();
    this.updateVideoPreview();
  }

  initializeDemoPlayer() {
    if (this.demoVideo) {
      this.demoVideo.play(); // Autoplay muted video
    }
  }

  toggleDemoPlayPause() {
    if (!this.demoVideo) {
      // ('Demo video element not found');
      return;
    }

    if (this.demoVideo.paused) {
      this.demoVideo.play();
      if (this.demoPlayIcon) this.demoPlayIcon.style.display = "none";
      if (this.demoPauseIcon) this.demoPauseIcon.style.display = "block";
    } else {
      this.demoVideo.pause();
      if (this.demoPlayIcon) this.demoPlayIcon.style.display = "block";
      if (this.demoPauseIcon) this.demoPauseIcon.style.display = "none";
    }
  }

  updateDemoTimeline() {
    if (!this.demoVideo || !this.timelineBarProgress || !this.timelineBarPlayhead) {
      return;
    }

    const progress =
      (this.demoVideo.currentTime / this.demoVideo.duration) * 100;
    this.timelineBarProgress.style.width = `${progress}%`;
    this.timelineBarPlayhead.style.left = `${progress}%`;
  }

  seekDemoTimeline(event) {
    if (!this.demoVideo || !this.timelineBarTrack) {
      return;
    }

    const rect = this.timelineBarTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    this.demoVideo.currentTime = percentage * this.demoVideo.duration;
  }

  populateWallpaperGrid() {
    this.wallpaperGrid.innerHTML = "";

    this.wallpapers.forEach((url) => {
      const item = document.createElement("div");
      item.className = "wallpaper-item";
      item.style.backgroundImage = `url(${url})`;
      item.addEventListener("click", () => this.selectWallpaper(item, url));
      this.wallpaperGrid.appendChild(item);
    });
  }

  selectWallpaper(element, url) {
    // Remove selection from other items
    document
      .querySelectorAll(".wallpaper-item")
      .forEach((item) => item.classList.remove("selected"));

    // Add selection to the clicked item
    element.classList.add("selected");

    // Clear all background caches when changing background
    this.backgroundImageCache = null;
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;
    this.lastBackgroundValue = null;
    this.lastCanvasWidth = null;
    this.lastCanvasHeight = null;

    // Update the background
    this.currentBackground = `url(${url})`;

    // Load the image immediately and synchronously
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      // console.log('✅ Background wallpaper loaded successfully:', url);
      this.backgroundImageCache = img;
      // Force immediate canvas update
      this.updateVideoPreview();
    };

    img.onerror = (err) => {
      console.error('❌ Failed to load background wallpaper:', url, err);
      // Try with chrome.runtime.getURL as fallback
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = "Anonymous";
      fallbackImg.onload = () => {
        // console.log('✅ Background loaded via chrome.runtime.getURL');
        this.backgroundImageCache = fallbackImg;
        this.updateVideoPreview();
      };
      fallbackImg.onerror = () => {
        console.error('❌ Fallback also failed, keeping black background');
      };
      // Extract path from url() wrapper
      let cleanUrl = url;
      if (cleanUrl.startsWith('../../assets/')) {
        cleanUrl = cleanUrl.replace('../../assets/', 'assets/');
      }
      fallbackImg.src = chrome.runtime.getURL(cleanUrl);
    };

    img.src = url;
  }

  pickRandomWallpaper() {
    const randomUrl = this.wallpapers[Math.floor(Math.random() * this.wallpapers.length)];

    // Clear all background caches when changing background
    this.backgroundImageCache = null;
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;
    this.lastBackgroundValue = null;
    this.lastCanvasWidth = null;
    this.lastCanvasHeight = null;

    this.currentBackground = `url(${randomUrl})`;

    // Force immediate canvas update
    this.updateVideoPreview();

    // Optional: update selection in the grid
    document.querySelectorAll(".wallpaper-item").forEach((item) => {
      item.classList.toggle(
        "selected",
        item.style.backgroundImage.includes(randomUrl)
      );
    });
  }

  showEditorPanel(panelId) {
    // Hide all panels
    document.querySelectorAll(".editor-panel").forEach((panel) => {
      panel.style.display = "none";
      panel.classList.remove("active");
    });

    // Remove active class from all sidebar buttons
    this.sidebarBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Show selected panel
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.style.display = "block";
      targetPanel.classList.add("active");

      // Special check for cursor panel
      if (panelId === 'cursor-panel') {
        // Try to re-initialize settings if needed
        if (window.cursorSettingsManager) {
          window.cursorSettingsManager.initialize();
        }
      }
    } else {
      console.error(`[DEBUG] Target panel not found: ${panelId}`);
    }

    // Add active class to corresponding sidebar button
    const targetBtn = document.querySelector(`[data-panel="${panelId}"]`);
    if (targetBtn) {
      targetBtn.classList.add("active");
    }
  }

  showExportAdvancedPanel() {
    // Hide zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "none";
    }

    // Show export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "block";
    }
  }

  showZoomControlsPanel() {
    // Hide export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "none";
    }

    // Show zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "block";
    }
  }

  // Add these methods to synchronize export controls
  syncExportControls() {
    // Synchronize format selector
    if (this.formatSelect && this.formatSelectRight) {
      this.formatSelectRight.value = this.formatSelect.value;
    }

    // Synchronize quality selector
    if (this.qualitySelect && this.qualitySelectRight) {
      this.qualitySelectRight.value = this.qualitySelect.value;
    }

    // Synchronize compression level
    if (this.compressionLevel && this.compressionLevelRight) {
      this.compressionLevelRight.value = this.compressionLevel.value;
    }
  }

  syncExportControlsRight() {
    // Synchronize format selector
    if (this.formatSelect && this.formatSelectRight) {
      this.formatSelect.value = this.formatSelectRight.value;
    }

    // Synchronize quality selector
    if (this.qualitySelect && this.qualitySelectRight) {
      this.qualitySelect.value = this.qualitySelectRight.value;
    }

    // Synchronize compression level
    if (this.compressionLevel && this.compressionLevelRight) {
      this.compressionLevel.value = this.compressionLevelRight.value;
    }
  }

  updateZoomPanelForSegmentRight(segment) {
    // Switch to zoom controls panel when a segment is selected
    this.showZoomControlsPanel();

    // Hide empty message and show editing controls
    if (this.noZoomMessageRight) {
      this.noZoomMessageRight.style.display = "none";
    }
    if (this.zoomEditingControlsRight) {
      this.zoomEditingControlsRight.style.display = "block";
    }

    // Update zoom info
    if (this.zoomTimingRight) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTimingRight.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Temporarily remove event listeners to prevent triggering updates
    const originalIntensityHandler = this.zoomIntensitySliderRight?.oninput;
    const originalModeHandlers = [];

    // Store original mode handlers
    this.zoomModeRadiosRight.forEach((radio, index) => {
      originalModeHandlers[index] = radio.onchange;
      radio.onchange = null;
    });

    // Update controls with segment data WITHOUT triggering events
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.oninput = null;
      // Ensure we use the segment's actual intensity value (minimum 1.25 for visible zoom)
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySliderRight.value = segmentIntensity;
    }
    if (this.zoomIntensityValueRight) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValueRight.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update zoom mode radio buttons WITHOUT triggering events
    this.zoomModeRadiosRight.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update manual position if applicable
    if (segment.mode === 'manual' && this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide manual controls based on segment mode
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // Restore event listeners after a brief delay
    setTimeout(() => {
      if (this.zoomIntensitySliderRight) {
        this.zoomIntensitySliderRight.oninput = originalIntensityHandler;
      }
      this.zoomModeRadiosRight.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });
    }, 10);
  }

  showNoZoomMessageRight() {
    // Show empty message and hide editing controls
    if (this.noZoomMessageRight) {
      this.noZoomMessageRight.style.display = 'block';
    }
    if (this.zoomEditingControlsRight) {
      this.zoomEditingControlsRight.style.display = 'none';
    }

    // Switch back to export & advanced panel
    this.showExportAdvancedPanel();

    ('Showing no zoom message in right sidebar');
  }

  updateZoomIntensityRight() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const newIntensity = parseFloat(this.zoomIntensitySliderRight.value);
    const validIntensity = newIntensity && newIntensity >= 1.25 ? newIntensity : 1.5;

    // Ensure intensity is within valid range
    const clampedIntensity = Math.max(1.25, Math.min(4, validIntensity));

    if (this.zoomIntensityValueRight) {
      this.zoomIntensityValueRight.textContent = `${clampedIntensity.toFixed(1)}x`;
    }

    // Update ONLY the selected zoom segment if any (not all segments)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.intensity = clampedIntensity;
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update the left sidebar to keep them synchronized
      if (this.zoomIntensitySlider) {
        this.zoomIntensitySlider.value = clampedIntensity;
      }
      if (this.zoomIntensityValue) {
        this.zoomIntensityValue.textContent = `${clampedIntensity.toFixed(1)}x`;
      }

      (`Updated intensity for segment ${this.selectedZoomSegment.id}:`, clampedIntensity.toFixed(1));
    } else {
      // Update default value for new segments
      this.zoomIntensity = clampedIntensity;
      ('Updated default zoom intensity:', clampedIntensity.toFixed(1));
    }
  }

  updateZoomModeRight(mode) {
    // Update ONLY the selected zoom segment if any (not global mode)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.mode = mode;
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update the left sidebar to keep them synchronized
      this.updateZoomMode(mode);

      (`Updated mode for segment ${this.selectedZoomSegment.id}:`, mode);
    } else {
      // Update default mode for new segments
      this.zoomMode = mode;

      // Also update the left sidebar to keep them synchronized
      this.updateZoomMode(mode);

      ('Updated default zoom mode:', mode);
    }

    // Show/hide manual controls based on current segment or default mode
    const currentMode = this.selectedZoomSegment ? this.selectedZoomSegment.mode : this.zoomMode;
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = currentMode === 'manual' ? 'block' : 'none';
    }

    // Also update left sidebar manual controls
    if (this.manualZoomControls) {
      this.manualZoomControls.style.display = currentMode === 'manual' ? 'block' : 'none';
    }
  }

  handleKeyboardShortcuts(event) {
    if (!this.previewVideo.src) return;

    switch (event.code) {
      case "Space":
        if (
          event.target.tagName !== "INPUT" &&
          event.target.tagName !== "TEXTAREA"
        ) {
          event.preventDefault();
          this.togglePlayPause();
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.previewVideo.currentTime = Math.max(
          0,
          this.previewVideo.currentTime - 5
        );
        break;
      case "ArrowRight":
        event.preventDefault();
        this.previewVideo.currentTime = Math.min(
          this.videoDuration,
          this.previewVideo.currentTime + 5
        );
        break;
      case "Delete":
      case "Backspace":
        if (this.selectedZoomSegment &&
          event.target.tagName !== "INPUT" &&
          event.target.tagName !== "TEXTAREA") {
          event.preventDefault();
          this.deleteZoomSegment(this.selectedZoomSegment);
        }
        break;
    }
  }

  loadStoredSettings() {
    // Load any stored preferences
    const stored = localStorage.getItem("screensmooth-settings");
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.recordingType) {
          this.selectRecordingType(
            document.querySelector(`[data-type="${settings.recordingType}"]`)
          );
        }
      } catch (error) {
        ("Could not load stored settings:", error);
      }
    }
  }

  handleHashNavigation() {
    const hash = window.location.hash;
    if (hash === "#settings") {
      // Could implement settings panel here
      ("Settings requested");
    }
  }

  selectRecordingType(card) {
    this.optionCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    this.selectedRecordingType = card.dataset.type;

    localStorage.setItem(
      "screensmooth-settings",
      JSON.stringify({
        recordingType: this.selectedRecordingType,
      })
    );

    this.updateModeWarning(this.selectedRecordingType);

    ("Selected recording type:", this.selectedRecordingType);
  }

  updateModeWarning(recordingType) {
    const warningBox = document.getElementById("mode-warning");
    const autoZoomLabel = document.getElementById("auto-zoom")?.closest(".toggle-option");
    const showCursorLabel = document.getElementById("show-cursor")?.closest(".toggle-option");
    const autoZoomCheckbox = document.getElementById("auto-zoom");
    const showCursorCheckbox = document.getElementById("show-cursor");

    if (recordingType === "tab") {
      if (warningBox) warningBox.style.display = "none";
      if (autoZoomLabel) autoZoomLabel.classList.remove("disabled");
      if (showCursorLabel) showCursorLabel.classList.remove("disabled");
      if (autoZoomCheckbox) autoZoomCheckbox.disabled = false;
      if (showCursorCheckbox) showCursorCheckbox.disabled = false;
    } else {
      if (warningBox) warningBox.style.display = "flex";
      if (autoZoomLabel) autoZoomLabel.classList.add("disabled");
      if (showCursorLabel) showCursorLabel.classList.add("disabled");
      if (autoZoomCheckbox) autoZoomCheckbox.disabled = true;
      if (showCursorCheckbox) showCursorCheckbox.disabled = true;
    }
  }

  async startRecording() {
    ('🎬 START RECORDING METHOD CALLED!');
    ('🔍 DEBUG: this object:', this);
    ('🔍 DEBUG: window.simpleLicenseSystem:', window.simpleLicenseSystem);

    try {
      console.log('🎬 [RECORDING] startRecording() entered at', Date.now());
      
      // TEMPORARY FIX: Skip license check for beta testing
      ('🔧 BETA: Skipping license check for testing');
      const isPremium = true; // Force premium for beta testing

      // License gate: require premium before recording
      // ('🔐 Checking license system...');
      // const isPremium = await window.simpleLicenseSystem?.isPremium();
      // ('🔐 Premium gate check result:', isPremium);

      if (!isPremium) {
        ('💳 Premium required for recording - redirecting to checkout');
        try {
          const checkoutUrl = 'https://screensmooth.lemonsqueezy.com/buy/f27c49be-d583-4f27-a733-5de61a44f8d8';
          ('🔗 Opening checkout URL:', checkoutUrl);
          // Open checkout in a new tab for extensions
          try {
            ('🔗 Trying chrome.tabs.create...');
            await chrome.tabs.create({ url: checkoutUrl, active: true });
            ('✅ Checkout tab opened successfully');
          } catch (chromeError) {
            ('⚠️ chrome.tabs.create failed, trying fallback:', chromeError);
            // Fallback for environments without chrome.tabs
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            ('✅ Checkout opened with window.open fallback');
          }
        } catch (e) {
          ('❌ Could not open checkout tab:', e);
        }

        // Show user-friendly message
        ('💬 Showing user message...');
        if (window.screenSmoothRecorder?.showInfo) {
          window.screenSmoothRecorder.showInfo('💳 Premium license required for recording. A checkout tab has been opened.');
        } else {
          alert('💳 Premium license required for recording. Please complete your purchase in the new tab.');
        }
        this.resetRecordingButton?.();
        ('🚫 Recording blocked due to license requirement');
        return;
      }

      console.log('🎬 [RECORDING] License check passed, proceeding...');
      // Clear all zoom data when starting a new recording
      this.clearAllZoomData();

      console.log('🎬 [RECORDING] Updating button state...');
      this.startRecordingBtn.disabled = true;
      this.startRecordingBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                Starting...
            `;

      // STEP 1: Get screen capture constraints
      console.log('🎬 [RECORDING] STEP 1: Getting recording constraints');
      const constraints = this.getRecordingConstraints();

      // STEP 2: Request screen capture (shows browser dialog)
      console.log('🎬 [RECORDING] STEP 2: Calling getDisplayMedia (browser dialog will appear)');
      this.stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      console.log('🎬 [RECORDING] STEP 2 COMPLETE: Screen capture acquired');

      // STEP 2.5: Store the selected tab and bring focus back to record.html for countdown
      // Chrome automatically focuses the selected tab/window after getDisplayMedia,
      // so we need to: 1) remember which tab was selected, 2) switch back for countdown
      console.log('🎬 [RECORDING] STEP 2.5: Storing selected tab and bringing focus back for countdown');
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
          console.log('🎬 [RECORDING] Selected tab to record:', selectedTabId, 'in window:', selectedWindowId);
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
          console.log('🎬 [RECORDING] STEP 2.5 COMPLETE: Focus returned to record page');
        }
      } catch (focusError) {
        console.warn('🎬 [RECORDING] Could not return focus to record page:', focusError);
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
      console.log('🎬 [RECORDING] STEP 3: Starting countdown');
      await this.startCountdown();
      console.log('🎬 [RECORDING] STEP 3 COMPLETE: Countdown finished');

      // STEP 3.5: Switch back to the recorded tab so user can start their demo
      console.log('🎬 [RECORDING] STEP 3.5: Switching to recorded tab');
      try {
        if (selectedTabId) {
          await chrome.tabs.update(selectedTabId, { active: true });
          if (chrome.windows && selectedWindowId) {
            await chrome.windows.update(selectedWindowId, { focused: true });
          }
          console.log('🎬 [RECORDING] STEP 3.5 COMPLETE: Switched to recorded tab:', selectedTabId);
        } else {
          console.log('🎬 [RECORDING] STEP 3.5: No selected tab ID, skipping switch');
        }
      } catch (switchError) {
        console.warn('🎬 [RECORDING] Could not switch to recorded tab:', switchError);
      }

      // STEP 4: Inject cursor script AFTER countdown completes
      console.log('🎬 [RECORDING] STEP 4: Injecting cursor script');
      await this.injectCursorScript();
      console.log('🎬 [RECORDING] STEP 4 COMPLETE: Cursor script injected');

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
      // 🎯 CRITICAL: Capture exact recording start timestamp for cursor synchronization
      // Using Date.now() (absolute Unix time) to match content script timestamps
      // Cannot use performance.now() - it has different time origins on different pages!
      this.recordingStartTimestamp = Date.now();
      console.log('🎬 [DEBUG] Starting MediaRecorder at timestamp:', this.recordingStartTimestamp);
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

  finalizeBlobCreation() {
    // Create blob from recorded chunks with validation
    const mimeType = this.mediaRecorder?.mimeType || "video/webm";
    ("Creating blob with mime type:", mimeType);
    ("Final chunks count:", this.recordedChunks.length);

    if (this.recordedChunks.length === 0) {
      ("No recorded chunks available!");
      this.showError("Recording failed: No data was captured. Please try recording again.");
      this.recordAgain();
      return;
    }

    this.recordingBlob = new Blob(this.recordedChunks, { type: mimeType });
    ("Recording blob created:", {
      size: this.recordingBlob.size,
      type: this.recordingBlob.type,
      sizeMB: (this.recordingBlob.size / 1024 / 1024).toFixed(2)
    });

    // Validate blob size
    if (this.recordingBlob.size === 0) {
      ("Created blob has zero size!");
      this.showError("Recording failed: Captured video is empty. Please try recording again.");
      this.recordAgain();
      return;
    }

    // Create object URL for preview with enhanced error handling
    try {
      const videoURL = URL.createObjectURL(this.recordingBlob);
      ("Video URL created:", videoURL);

      // Set up video with proper event handling
      this.previewVideo.src = videoURL;

      // Add one-time load handler to ensure video is ready
      const onVideoReady = () => {
        ("Preview video is ready for playback");
        // Update file info after video is ready
        this.updateFileInfo();
        // Show preview editor
        this.showPreviewEditor();
      };

      const onVideoError = (error) => {
        ("Preview video error:", error);
        this.showError("Failed to load recorded video. The recording may be corrupted.");
      };

      // Listen for when video can play
      this.previewVideo.addEventListener('canplay', onVideoReady, { once: true });
      this.previewVideo.addEventListener('error', onVideoError, { once: true });

      // Fallback: if video loads metadata but not data
      this.previewVideo.addEventListener('loadedmetadata', () => {
        ("Video metadata loaded, duration:", this.previewVideo.duration);
        // If duration is available, we can show the editor even if video can't play
        if (this.previewVideo.duration && Number.isFinite(this.previewVideo.duration)) {
          setTimeout(() => {
            if (this.previewEditor.style.display !== 'block') {
              ("Showing editor after metadata load");
              onVideoReady();
            }
          }, 1000);
        }
      }, { once: true });

    } catch (error) {
      ("Failed to create video URL:", error);
      this.showError("Failed to create video preview. Please try recording again.");
      this.recordAgain();
      return;
    }

    ("Recording processing complete");
  }

  onVideoLoaded() {
    ("Video metadata loaded");

    // Enhanced duration validation
    const duration = this.previewVideo.duration;
    ("Raw video duration:", duration);

    if (Number.isFinite(duration) && duration > 0) {
      this.videoDuration = duration;
      ("Valid video duration set:", this.videoDuration);
    } else {
      ("Invalid video duration detected, attempting fallback");
      // Try to get duration from recorded time
      const recordedDuration = this.getRecordedDuration();
      if (recordedDuration > 0) {
        this.videoDuration = recordedDuration;
        ("Using recorded duration as fallback:", this.videoDuration);
      } else {
        this.videoDuration = 10; // Minimal fallback
        ("Using minimal fallback duration:", this.videoDuration);
      }
    }

    this.trimStart = 0;
    this.trimEnd = this.videoDuration;

    // Update duration displays
    this.videoDurationDisplay.textContent = this.formatTime(this.videoDuration);
    this.totalTimeDisplay.textContent = this.formatTime(this.videoDuration);
    this.currentTimeDisplay.textContent = this.formatTime(0);

    // Initialize timeline
    this.initializeTimeline();

    // Initialize zoom functionality now that we have video duration
    ('Initializing zoom functionality after duration is set:', this.videoDuration);
    this.initializeZoomFunctionality();

    // Update selected duration
    this.updateSelectedDuration();

    // Hide default video controls and always show canvas immediately
    this.previewVideo.controls = false;
    this.previewVideo.style.display = 'none';
    this.previewCanvas.style.display = 'block';

    // Immediately render the first frame to canvas for instant display
    this.renderToCanvas();

    // Initialize zoom functionality after video is ready
    setTimeout(() => {
      this.initializeZoomFunctionality();
    }, 500); // Give some time for DOM to be ready

    // Ensure video is loaded with current data and render first frame
    const renderFirstFrame = () => {
      if (this.previewVideo.readyState >= 2) {
        // Ensure video is at beginning and render first frame
        this.previewVideo.currentTime = 0;
        // Wait a moment for seek to complete, then render
        setTimeout(() => {
          this.renderToCanvas();
          ('First frame rendered to canvas');
        }, 100);
      } else {
        // Wait for video to have current data
        ('Waiting for video data to render first frame...');
        const checkReady = () => {
          if (this.previewVideo.readyState >= 2) {
            this.previewVideo.currentTime = 0;
            setTimeout(() => {
              this.renderToCanvas();
              ('First frame rendered after waiting for video data');
            }, 100);
          } else {
            setTimeout(checkReady, 50); // Check every 50ms
          }
        };
        setTimeout(checkReady, 50);
      }
    };

    // Try to render first frame immediately or wait for video data
    renderFirstFrame();

    // Also listen for seeked event to ensure frame is available after seek
    this.previewVideo.addEventListener('seeked', () => {
      ('Video seeked event fired, rendering frame');
      this.renderToCanvas();
    }, { once: true });

    // Also listen for loadeddata event as backup
    this.previewVideo.addEventListener('loadeddata', () => {
      ('Video loadeddata event fired, rendering frame');
      this.renderToCanvas();
    }, { once: true });

    // Update zoom position preview aspect ratio to match video
    this.updateZoomPreviewAspectRatio();
  }

  // Update zoom position preview aspect ratio to match video dimensions
  updateZoomPreviewAspectRatio() {
    if (!this.previewVideo || !this.previewVideo.videoWidth || !this.previewVideo.videoHeight) return;

    const videoWidth = this.previewVideo.videoWidth;
    const videoHeight = this.previewVideo.videoHeight;
    const aspectRatio = videoWidth / videoHeight;

    ('Updating zoom preview aspect ratio:', videoWidth, 'x', videoHeight, 'ratio:', aspectRatio);

    // Update both preview elements with the correct aspect ratio
    if (this.zoomPositionPreview) {
      this.zoomPositionPreview.style.aspectRatio = `${videoWidth} / ${videoHeight}`;
    }
    if (this.zoomPositionPreviewRight) {
      this.zoomPositionPreviewRight.style.aspectRatio = `${videoWidth} / ${videoHeight}`;
    }
  }

  initializeZoomFunctionality() {
    console.log('🔍 [INIT] =========================');
    console.log('🔍 [INIT] initializeZoomFunctionality called');
    console.log('🔍 [INIT] videoDuration:', this.videoDuration, 'typeof:', typeof this.videoDuration);
    console.log('🔍 [INIT] zoomTrack element:', !!this.zoomTrack);
    console.log('🔍 [INIT] Current zoom segments:', this.zoomSegments?.length || 0);

    // Don't load saved zoom data - start fresh
    // this.loadZoomData();

    // Show empty message initially
    this.showNoZoomMessage();

    // Check if video duration is ready - if not, retry later
    if (!this.videoDuration || this.videoDuration <= 0) {
      console.log('🔍 [INIT] ⚠️ Video duration not ready, will retry in 1 second');
      // Retry after 1 second
      setTimeout(() => {
        if (this.videoDuration > 0) {
          console.log('🔍 [INIT] Retrying with duration:', this.videoDuration);
          this.initializeZoomFunctionality();
        } else {
          console.log('🔍 [INIT] ❌ Video duration still not ready after retry');
        }
      }, 1000);
      return;
    }

    // Ensure zoom track is ready for interaction
    if (this.zoomTrack && this.videoDuration > 0) {
      console.log('🔍 [INIT] ✅ Zoom functionality ready!');

      // Make sure the zoom track is clickable
      this.zoomTrack.style.cursor = 'pointer';
      this.zoomTrack.style.pointerEvents = 'auto';

      // Add a test click handler to verify events are working
      this.zoomTrack.addEventListener('click', (e) => {
        console.log('🔍 [INIT-LISTENER] ZOOM TRACK CLICKED - capture phase event');
        console.log('🔍 [INIT-LISTENER] videoDuration at click time:', this.videoDuration);
      }, true); // Use capture phase to ensure it's called

      console.log('🔍 [INIT] Zoom track configured for interaction');

      // Re-render any existing zoom segments
      this.renderZoomSegments();
    } else {
      console.log('🔍 [INIT] ❌ Zoom track or video duration not ready');
    }
  }

  onVideoDurationChange() {
    ("Video duration changed event fired");
    const duration = this.previewVideo.duration;
    ("New duration from event:", duration);

    if (
      Number.isFinite(duration) &&
      duration > 0 &&
      duration !== this.videoDuration
    ) {
      this.videoDuration = duration;
      this.trimEnd = duration;

      // Update displays
      this.videoDurationDisplay.textContent = this.formatTime(
        this.videoDuration
      );
      this.totalTimeDisplay.textContent = this.formatTime(this.videoDuration);

      // Reinitialize timeline with correct duration
      this.initializeTimeline();
      this.updateSelectedDuration();

      // Reinitialize zoom functionality with new duration
      ('Reinitializing zoom functionality after duration change:', this.videoDuration);
      this.initializeZoomFunctionality();

      ("Video duration updated to:", this.videoDuration);
    }
  }

  getRecordedDuration() {
    // Enhanced duration calculation with multiple methods
    ("=== Calculating Recorded Duration ===");

    // Method 1: Calculate from recording time
    if (this.startTime) {
      const endTime = Date.now();
      const totalRecordingTime = (endTime - this.startTime - this.pausedTime) / 1000;
      const calculatedDuration = Math.max(0, totalRecordingTime);
      ("Calculated from recording time:", calculatedDuration, "seconds");

      if (calculatedDuration > 0 && calculatedDuration < 3600) { // Sanity check: less than 1 hour
        ("✓ Using calculated duration:", calculatedDuration);
        return calculatedDuration;
      }
    }

    // Method 2: Estimate from blob size (rough approximation)
    if (this.recordingBlob && this.recordingBlob.size > 0) {
      // Very rough estimate: ~1MB per second for typical screen recordings
      const estimatedDuration = Math.max(1, this.recordingBlob.size / (1024 * 1024));
      ("Estimated from blob size:", estimatedDuration, "seconds");

      if (estimatedDuration > 0 && estimatedDuration < 3600) { // Sanity check
        ("✓ Using blob size estimation:", estimatedDuration);
        return estimatedDuration;
      }
    }

    // Method 3: Use MediaRecorder timing if available
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      // If recording is still active, use current time
      const currentDuration = (Date.now() - this.startTime - this.pausedTime) / 1000;
      if (currentDuration > 0) {
        ("✓ Using current recording time:", currentDuration);
        return currentDuration;
      }
    }

    ("⚠ No reliable duration calculation method available");
    ("===================================");
    return 0;
  }

  onVideoTimeUpdate() {
    this.currentTime = this.previewVideo.currentTime;
    this.currentTimeDisplay.textContent = this.formatTime(this.currentTime);

    // Update progress bar
    this.updateProgressBar();

    // Update timeline playbook indicator
    this.updatePlaybackIndicator();

    // === FIX: DO NOT call getZoomStateAtTime here! renderToCanvas (line below)
    // already calls it. Calling it twice per frame double-steps the spring.

    // Only render to canvas when not playing (for seeking) to prevent excessive rendering
    if (!this.isPlaying) {
      this.renderToCanvas();
    }

    // Don't start continuous rendering here - it causes performance issues
    // Continuous rendering is handled in onVideoPlay()
  }

  onVideoSeeked() {
    ('Video seeked to:', this.formatTime(this.previewVideo.currentTime));

    // CRITICAL: Force complete zoom state reset when manually seeking
    const currentTime = this.previewVideo.currentTime;

    // Clear ALL transition state to force immediate state calculation
    this.transitionStartTime = null;
    this.transitionStartState = null;
    this.targetIntensity = null;
    this.targetPosition = null;

    // Set flag to indicate we're in seeking mode (not smooth playback)
    this.isSeekingMode = true;

    // Force immediate state calculation without transitions
    const activeZoom = this.getZoomSegmentAtTime(currentTime);

    if (activeZoom) {
      // Inside zoom segment - apply zoom immediately
      const si = activeZoom.intensity || 1.5;
      const sp = activeZoom.position || { x: 0.5, y: 0.5 };
      this.currentZoomState = {
        intensity: si,
        position: { ...sp },
        isActive: true
      };
      // Snap springs to match so playback resumes cleanly
      const springs = this.ensureZoomSprings(this);
      springs.scale.snap(si);
      springs.x.snap(sp.x);
      springs.y.snap(sp.y);
      springs.lastTime = currentTime;
    } else {
      // Outside zoom segment - reset to normal immediately
      this.currentZoomState = {
        intensity: 1,
        position: { x: 0.5, y: 0.5 },
        isActive: false
      };
      // Snap springs to 100% view
      const springs = this.ensureZoomSprings(this);
      springs.scale.snap(1);
      springs.x.snap(0.5);
      springs.y.snap(0.5);
      springs.lastTime = currentTime;
    }

    // === SCREEN STUDIO CURSOR PREMIUM === Snap cursor springs on seek to prevent flyback
    const cursorSprings = this.ensureCursorSprings(this);
    const cursorDataSource = (this.rawCursorData && this.rawCursorData.length > 0)
      ? this.rawCursorData : this.cursorData;
    if (cursorDataSource && cursorDataSource.length > 0) {
      const seekCursor = this.cursorProcessor.getCursorAtTime(cursorDataSource, currentTime * 1000);
      if (seekCursor) {
        const videoWidth = this.previewVideo.videoWidth || 1920;
        const videoHeight = this.previewVideo.videoHeight || 1080;
        const windowWidth = seekCursor.windowWidth || seekCursor.viewportWidth || videoWidth;
        const windowHeight = seekCursor.windowHeight || seekCursor.viewportHeight || videoHeight;
        const canvasDimensions = this.calculateAspectRatioDimensions(videoWidth, videoHeight, this.currentAspectRatio);
        const videoX = (this.currentPadding || 0) + (canvasDimensions.width - videoWidth) / 2;
        const videoY = (this.currentPadding || 0) + (canvasDimensions.height - videoHeight) / 2;
        const snapX = videoX + (seekCursor.x * (videoWidth / windowWidth));
        const snapY = videoY + (seekCursor.y * (videoHeight / windowHeight));
        cursorSprings.x.snap(snapX);
        cursorSprings.y.snap(snapY);
      }
    }
    cursorSprings.scale.snap(1);
    cursorSprings.rotation.snap(0);
    cursorSprings.lastTime = null; // Reset so next frame computes fresh dt
    // Also reset the smoothCursor position to match snapped springs
    this.smoothCursor.x = cursorSprings.x.position;
    this.smoothCursor.y = cursorSprings.y.position;
    this.cursorScale = 1;
    this.cursorRotation = 0;
    this.lastUpdateTime = undefined; // Force dt recalculation

    ('Force reset zoom state after seek:', {
      time: this.formatTime(currentTime),
      isActive: this.currentZoomState.isActive,
      intensity: this.currentZoomState.intensity.toFixed(2),
      hasActiveSegment: !!activeZoom
    });

    // Force immediate canvas render with new zoom state
    this.renderToCanvas();

    // Clear seeking mode flag after a short delay to allow smooth transitions to resume
    setTimeout(() => {
      this.isSeekingMode = false;
    }, 100);

    // Update playback indicator and other timeline UI
    this.updatePlaybackIndicator();
  }

  onVideoPlay() {
    this.isPlaying = true;
    this.playPauseBtn.innerHTML = `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        `;

    // Always use canvas for rendering with effects
    this.previewVideo.style.display = 'none';
    this.previewCanvas.style.display = 'block';
    this.startCanvasRendering();
  }

  onVideoPause() {
    this.isPlaying = false;
    this.playPauseBtn.innerHTML = `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
            </svg>
        `;

    this.stopCanvasRendering();

    // Always show canvas and render current frame
    this.previewVideo.style.display = 'none';
    this.previewCanvas.style.display = 'block';
    this.renderToCanvas();
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.onVideoPause();
    // Stop canvas rendering
    this.stopCanvasRendering();
  }

  togglePlayPause() {
    if (!this.previewVideo.src) return;

    if (this.isPlaying) {
      this.previewVideo.pause();
    } else {
      this.previewVideo.play();
    }
  }

  rewind() {
    if (!this.previewVideo.src) return;
    this.previewVideo.currentTime = Math.max(
      0,
      this.previewVideo.currentTime - 10
    );
  }

  forward() {
    if (!this.previewVideo.src) return;
    this.previewVideo.currentTime = Math.min(
      this.videoDuration,
      this.previewVideo.currentTime + 10
    );
  }

  toggleMute() {
    if (!this.previewVideo.src) return;

    this.previewVideo.muted = !this.previewVideo.muted;

    this.volumeBtn.innerHTML = this.previewVideo.muted
      ? `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>
            </svg>
        `
      : `
            <svg class="player-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.01,19.86 21,16.28 21,12C21,7.72 18.01,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
            </svg>
        `;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Use canvas for fullscreen instead of video wrapper
      this.previewCanvas.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  updateProgressBar() {
    if (!this.videoDuration || this.isDraggingProgress) return;

    const percentage = (this.currentTime / this.videoDuration) * 100;
    this.progressFill.style.width = `${percentage}%`;
    this.progressHandle.style.left = `${percentage}%`;
  }

  seekToProgressPosition(event) {
    if (!this.videoDuration) return;

    const rect = this.progressBarContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetTime = percentage * this.videoDuration;

    this.previewVideo.currentTime = Math.max(
      0,
      Math.min(targetTime, this.videoDuration)
    );

    // CRITICAL: Force immediate canvas render for paused video
    // This ensures zoom state changes are visible immediately after progress bar click
    if (!this.isPlaying) {
      // Force seeking mode and immediate zoom state update
      this.isSeekingMode = true;

      // Force zoom state recalculation at new position
      const currentTime = this.previewVideo.currentTime;
      const activeZoom = this.getZoomSegmentAtTime(currentTime);

      if (activeZoom) {
        this.currentZoomState = {
          intensity: activeZoom.intensity || 1.5,
          position: activeZoom.position || { x: 0.5, y: 0.5 },
          isActive: true
        };
      } else {
        this.currentZoomState = {
          intensity: 1,
          position: { x: 0.5, y: 0.5 },
          isActive: false
        };
      }

      // Force immediate canvas render
      this.renderToCanvas();

      // Clear seeking mode after render
      setTimeout(() => {
        this.isSeekingMode = false;
      }, 50);
    }
  }

  startProgressDrag(event) {
    event.preventDefault();
    this.isDraggingProgress = true;
    document.body.style.userSelect = "none";
  }

  initializeTimeline() {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      (
        "Invalid video duration, timeline not initialized:",
        this.videoDuration
      );
      return;
    }

    // Get timeline width
    this.timelineWidth = this.timelineTrack.offsetWidth;

    // Generate time markers
    this.generateTimeMarkers();

    // Position trim handles
    this.updateTrimHandles();

    // Update selected range overlay
    this.updateSelectedRangeOverlay();

    ("Timeline initialized with duration:", this.videoDuration);
  }

  generateTimeMarkers() {
    this.timelineMarkers.innerHTML = "";

    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const markerInterval = Math.max(1, Math.floor(this.videoDuration / 10));
    const markerCount = Math.floor(this.videoDuration / markerInterval);

    for (let i = 0; i <= markerCount; i++) {
      const time = i * markerInterval;
      const position = (time / this.videoDuration) * 100;

      const marker = document.createElement("div");
      marker.className = "timeline-marker";
      marker.style.left = `${position}%`;
      marker.textContent = this.formatTime(time);

      this.timelineMarkers.appendChild(marker);
    }
  }

  updatePlaybackIndicator() {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const currentTime = this.previewVideo.currentTime;
    const position = (currentTime / this.videoDuration) * 100;

    this.playbackIndicator.style.left = `${position}%`;

    // Update zoom timeline synchronization
    this.syncZoomTimeline();
  }

  syncZoomTimeline() {
    // Ensure zoom segments are visible and properly synchronized
    this.renderZoomSegments();

    // Enhanced highlighting with smooth transition awareness
    const currentTime = this.previewVideo.currentTime;
    const activeZoom = this.getZoomSegmentAtTime(currentTime);
    // === FIX: DO NOT call getZoomStateAtTime here! It advances the spring.
    // Only read the already-computed state for UI highlighting.
    const zoomState = this.currentZoomState;

    // Remove previous highlights
    const zoomSegments = this.zoomTrack.querySelectorAll('.zoom-segment');
    zoomSegments.forEach(segment => {
      segment.classList.remove('active', 'transitioning');
    });

    // Highlight active zoom segment or transitioning segment
    if (activeZoom) {
      const activeSegmentElement = this.zoomTrack.querySelector(`[data-segment-id="${activeZoom.id}"]`);
      if (activeSegmentElement) {
        activeSegmentElement.classList.add('active');

        // Add transitioning class if we're in a smooth transition
        if (zoomState && zoomState.isActive && this.zoomAnimationStartState) {
          activeSegmentElement.classList.add('transitioning');
        }
      }

      // Update right sidebar with the selected segment
      this.updateZoomPanelForSegmentRight(activeZoom);
    } else if (zoomState && zoomState.isActive) {
      // No active segment but still transitioning - could be zooming out
      // Find the most recent segment that might be transitioning out
      const recentSegments = this.zoomSegments.filter(seg => seg.endTime <= currentTime + 0.1);
      if (recentSegments.length > 0) {
        const lastSegment = recentSegments[recentSegments.length - 1];
        const lastSegmentElement = this.zoomTrack.querySelector(`[data-segment-id="${lastSegment.id}"]`);
        if (lastSegmentElement) {
          lastSegmentElement.classList.add('transitioning');
        }
      }
    } else {
      // No active zoom segment - show export & advanced panel
      this.showNoZoomMessageRight();
    }
  }

  seekToTimelinePosition(event) {
    if (!Number.isFinite(this.videoDuration) || this.videoDuration <= 0) {
      return;
    }

    const rect = this.timelineTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percentage * this.videoDuration;

    this.previewVideo.currentTime = targetTime;

    // CRITICAL: Force immediate canvas render for paused video
    // This ensures zoom state changes are visible immediately after timeline click
    if (!this.isPlaying) {
      // Force seeking mode and immediate zoom state update
      this.isSeekingMode = true;

      // Force zoom state recalculation at new position
      const currentTime = this.previewVideo.currentTime;
      const activeZoom = this.getZoomSegmentAtTime(currentTime);

      if (activeZoom) {
        this.currentZoomState = {
          intensity: activeZoom.intensity || 1.5,
          position: activeZoom.position || { x: 0.5, y: 0.5 },
          isActive: true
        };
      } else {
        this.currentZoomState = {
          intensity: 1,
          position: { x: 0.5, y: 0.5 },
          isActive: false
        };
      }

      // Force immediate canvas render
      this.renderToCanvas();

      // Clear seeking mode after render
      setTimeout(() => {
        this.isSeekingMode = false;
      }, 50);
    }

    ("Seeking to timeline position:", targetTime, "seconds");
  }

  startDragging(event, handle) {
    event.preventDefault();
    this.isDragging = true;
    this.dragHandle = handle;

    // Add dragging class for visual feedback
    if (handle === "left") {
      this.trimHandleLeft.classList.add("dragging");
    } else {
      this.trimHandleRight.classList.add("dragging");
    }

    // Prevent text selection
    document.body.style.userSelect = "none";
  }

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
      // No zoom — draw normally
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
      console.log('⚠️ Export already in progress, ignoring request');
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
            console.log('🎬 [EXPORT] Checking FFmpeg availability:', {
              isFFmpegLoaded: this.isFFmpegLoaded,
              ffmpegExists: !!this.ffmpeg,
              format: this.formatSelect?.value
            });

            if (this.isFFmpegLoaded) {
              console.log('🎬 [EXPORT] FFmpeg is loaded, starting conversion...');
              this.updateStatusText("Converting format...");
              finalBlob = await this.processVideoWithFFmpeg(finalBlob);

              // Final validation
              if (!finalBlob || finalBlob.size === 0) {
                console.log("FFmpeg processing failed, using previous blob");
                finalBlob = this.recordingBlob;
              }
            } else {
              console.log("🎬 [EXPORT] FFmpeg NOT available, skipping format conversion!");
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
    ("Blob validation:", blobValid ? "✓ PASS" : "✗ FAIL");

    // Validate duration
    const durationValid = Number.isFinite(this.videoDuration) && this.videoDuration > 0;
    ("Duration validation:", durationValid ? "✓ PASS" : "✗ FAIL");

    // Validate trim settings
    const trimValid = this.trimStart >= 0 && this.trimEnd > this.trimStart;
    ("Trim validation:", trimValid ? "✓ PASS" : "✗ FAIL");

    const overallValid = blobValid && (durationValid || this.getRecordedDuration() > 0);
    ("Overall validation:", overallValid ? "✓ PASS" : "✗ FAIL");
    ("======================================");

    // Provide detailed error information if validation fails
    if (!overallValid) {
      if (!blobValid) {
        ("❌ Validation failed: Recording blob is missing or empty");
        ("   → Please try recording again");
      }
      if (!durationValid && this.getRecordedDuration() <= 0) {
        ("❌ Validation failed: Video duration is invalid and no fallback available");
        ("   → Duration value:", this.videoDuration);
        ("   → Recorded duration:", this.getRecordedDuration());
        ("   → Try refreshing the page and recording again");
      }
    }

    return overallValid;
  }

  async createOptimizedCompositedVideo() {
    return new Promise((resolve, reject) => {
      ('Starting optimized canvas-based video composition...');

      // Set timeout for canvas composition (2 minutes max)
      // Set timeout for canvas composition (30 minutes max to allow long exports)
      const canvasTimeout = setTimeout(() => {
        this.isExportMode = false;
        reject(new Error("Canvas composition timed out after 30 minutes. Try reducing effects or video length."));
      }, 30 * 60 * 1000);

      // Validate prerequisites
      if (!this.recordingBlob) {
        clearTimeout(canvasTimeout);
        reject(new Error("No recording blob available"));
        return;
      }

      // Create a temporary video element
      const tempVideo = document.createElement('video');
      tempVideo.src = URL.createObjectURL(this.recordingBlob);
      tempVideo.muted = true;
      tempVideo.crossOrigin = "anonymous";
      tempVideo.preload = "metadata";
      tempVideo.playsInline = true;

      // Add error handling for video load failures
      tempVideo.addEventListener('error', (error) => {
        ('Temp video error:', error);
        clearTimeout(canvasTimeout);
        reject(new Error("Failed to load video for processing. Please try with original recording."));
      });

      // Enhanced helper functions
      const drawSolidBackground = (ctx, width, height, color = "#000000") => {
        try {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, width, height);
        } catch (error) {
          ("Error drawing solid background:", error);
        }
      };

      // Check if canvas recording is supported
      const testCanvas = document.createElement('canvas');
      testCanvas.width = 100;
      testCanvas.height = 100;
      const testCtx = testCanvas.getContext('2d');
      testCtx.fillStyle = 'red';
      testCtx.fillRect(0, 0, 100, 100);

      let canvasRecordingSupported = false;
      try {
        const testStream = testCanvas.captureStream(1);
        canvasRecordingSupported = testStream && testStream.getTracks().length > 0;
        ('Canvas recording support:', canvasRecordingSupported);
      } catch (error) {
        ('Canvas recording not supported:', error);
        canvasRecordingSupported = false;
      }

      if (!canvasRecordingSupported) {
        ('Canvas recording not supported, falling back to original recording');
        clearTimeout(canvasTimeout);
        resolve(this.recordingBlob);
        return;
      }

      const processVideoOnCanvas = async (canvas, ctx, video) => {
        ('Setting up optimized canvas recording...');

        try {
          // Track drawing state and frame count for debugging
          let isDrawing = false;
          let frameCount = 0;
          let isRecordingActive = true;

          // Initial canvas setup with aspect ratio support
          const setupCanvas = () => {
            // Get base video dimensions
            const baseWidth = video.videoWidth || 1920;
            const baseHeight = video.videoHeight || 1080;

            // Calculate canvas dimensions based on aspect ratio
            const canvasDimensions = this.calculateAspectRatioDimensions(baseWidth, baseHeight, this.currentAspectRatio);

            // Set canvas dimensions with padding
            canvas.width = canvasDimensions.width + (this.currentPadding * 2);
            canvas.height = canvasDimensions.height + (this.currentPadding * 2);

            (`Export Canvas dimensions: ${canvas.width}x${canvas.height}, Video dimensions: ${video.videoWidth}x${video.videoHeight}, Aspect ratio: ${this.currentAspectRatio}`);

            // Initialize export cursor state for this loop if not already done
            if (!this.exportCursorState) {
              this.exportCursorState = {
                smoothCursor: { x: 0, y: 0 },
                cursorVelocity: { x: 0, y: 0 },
                cursorRotation: 0,
                cursorScale: 1,
                wasCursorPressed: false,
                activeRipples: [],
                stiffness: this.spring || 0.15,
                lastUpdateTime: video.currentTime * 1000
              };
              // === SCREEN STUDIO CURSOR PREMIUM === Init cursor springs for export
              this.ensureCursorSprings(this.exportCursorState);
            }
          };

          // Enhanced frame drawing function with better video synchronization
          const drawFrame = () => {
            if (isDrawing) return;
            isDrawing = true;
            frameCount++;

            try {
              // Clear canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // Check if we need to regenerate export blurred background cache
              const needsExportBlurCache = this.currentBlur > 0 &&
                (!this.exportBlurredBackgroundCache ||
                  this.exportBlurredBackgroundCache.width !== canvas.width ||
                  this.exportBlurredBackgroundCache.height !== canvas.height);

              if (needsExportBlurCache) {
                this.generateExportBlurredBackgroundCache(canvas.width, canvas.height);
              }

              // Draw background - use cached version if blur is applied
              if (this.currentBlur > 0 && this.exportBlurredBackgroundCache) {
                // Use pre-rendered blurred background for better performance
                ctx.drawImage(this.exportBlurredBackgroundCache, 0, 0);
              } else {
                // Draw background normally without blur
                this.drawBackgroundDirect(ctx, canvas.width, canvas.height);
              }

              // Calculate video position - center the original video in the new canvas with aspect ratio
              const padding = this.currentPadding || 0;
              const availableWidth = canvas.width - (padding * 2);
              const availableHeight = canvas.height - (padding * 2);

              // Keep original video dimensions
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;

              // Center the video within available space
              const videoX = padding + (availableWidth - videoWidth) / 2;
              const videoY = padding + (availableHeight - videoHeight) / 2;

              // Ensure video is ready and has current data
              if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
                // Apply only screen effects to video (brightness, contrast, saturation) - NOT blur
                let filterString = '';
                if (this.currentBrightness !== 1 || this.currentContrast !== 1 || this.currentSaturation !== 1) {
                  filterString += `brightness(${this.currentBrightness}) contrast(${this.currentContrast}) saturate(${this.currentSaturation}) `;
                }
                // NOTE: Blur is NOT applied to video - only to background

                if (filterString) {
                  ctx.filter = filterString.trim();
                }

                // Apply zoom transformation with smooth transitions for export
                const currentTime = video.currentTime;
                // Force export mode for proper transition timing
                const wasSeekingMode = this.isSeekingMode;
                const wasExportMode = this.isExportMode;

                // Enable export mode and disable seeking mode for smooth transitions
                this.isSeekingMode = false;
                this.isExportMode = true;

                // Get zoom state for current export frame time with proper timing
                const zoomState = this.getZoomStateAtTime(currentTime);

                // Check for zoom segments for export (transitions now happen inside segments)
                const directZoomSegment = this.getZoomSegmentAtTime(currentTime);

                // Apply zoom if we have an active segment
                if (directZoomSegment || (zoomState && zoomState.isActive)) {
                  this.applyExportZoomTransformation(ctx, zoomState, video, videoX, videoY, videoWidth, videoHeight);
                } else {
                  this.drawVideoWithBorderRadius(ctx, video, videoX, videoY, videoWidth, videoHeight, this.currentBorderRadius);
                }

                // Reset filter
                ctx.filter = 'none';

                // Draw cursor overlay if available with isolated export state
                this.drawCursorOverlay(ctx, videoX, videoY, videoWidth, videoHeight, zoomState, currentTime, this.exportCursorState);

                // Restore previous states AFTER zoom and cursor are applied
                this.isSeekingMode = wasSeekingMode;
                this.isExportMode = wasExportMode;
              } else {
                (`Frame ${frameCount}: Video not ready - readyState: ${video.readyState}, dimensions: ${video.videoWidth}x${video.videoHeight}`);
              }

            } catch (error) {
              ('Frame drawing error:', error);
            } finally {
              isDrawing = false;
            }

            // Continue with next frame if recording is active
            if (isRecordingActive) {
              requestAnimationFrame(drawFrame);
            }
          };

          // Initial canvas setup
          setupCanvas();

          // Enhanced video synchronization - wait for video to be ready
          const waitForVideoReady = () => {
            return new Promise((videoResolve) => {
              if (video.readyState >= 2 && video.videoWidth > 0) {
                ('Video is ready for processing');
                videoResolve();
              } else {
                ('Waiting for video to be ready...');
                const checkReady = () => {
                  if (video.readyState >= 2 && video.videoWidth > 0) {
                    videoResolve();
                  } else {
                    setTimeout(checkReady, 100);
                  }
                };
                setTimeout(checkReady, 100);
              }
            });
          };

          // Wait for video to be ready before starting canvas recording
          await waitForVideoReady();

          // Draw initial frame to establish canvas state
          drawFrame();

          // DIAGNOSTIC LOG 1: Check zoom data before export loop
          console.log('🔍 EXPORT DEBUG:');
          console.log('Total zoom segments:', this.zoomSegments?.length || 0);
          console.log('Zoom segments:', JSON.stringify(this.zoomSegments));
          console.log('Recording start time:', this.startTime);
          console.log('Video duration:', tempVideo.duration);

          // Create MediaRecorder to capture canvas
          // FIX: Use captureStream(0) for MANUAL frame control - prevents truncation when tab is inactive
          // Previously used captureStream(30) which captured in real-time, causing frames to be missed
          // when requestAnimationFrame was throttled in background tabs
          ('Creating canvas stream with manual frame control...');
          const stream = canvas.captureStream(0); // 0 fps = manual frame control via requestFrame()
          const videoTrack = stream.getVideoTracks()[0];

          // Verify we have manual frame control support
          if (typeof videoTrack.requestFrame !== 'function') {
            console.warn('⚠️ requestFrame() not supported, falling back to original recording');
            clearTimeout(canvasTimeout);
            resolve(this.recordingBlob);
            return;
          }

          ('Stream created with manual frame control, tracks:', stream.getTracks().length);

          const recordedChunks = [];

          // Use most compatible codec
          let mimeType = 'video/webm';
          const supportedTypes = [
            'video/webm;codecs=vp8',
            'video/webm;codecs=vp9',
            'video/webm',
            'video/mp4'
          ];

          for (const type of supportedTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
              mimeType = type;
              break;
            }
          }

          ('Using MIME type:', mimeType);

          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: this.selectedQuality === "high" ? 2000000 : 1000000 // Lower bitrate for reliability
          });

          mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              recordedChunks.push(event.data);
              ('Recorded chunk:', event.data.size, 'bytes. Total chunks:', recordedChunks.length);
            } else {
              ('Received empty chunk');
            }
          };

          mediaRecorder.onstop = () => {
            ('Canvas recording stopped. Total chunks collected:', recordedChunks.length);

            // Stop the drawing loop
            isRecordingActive = false;

            // Wait for final chunks with longer timeout for complex compositions
            setTimeout(() => {
              if (recordedChunks.length === 0) {
                ('No video data recorded!');
                clearTimeout(canvasTimeout);
                reject(new Error('No video data was recorded. This may be due to browser limitations. Please try recording a longer video or use a different browser.'));
                return;
              }

              const compositeBlob = new Blob(recordedChunks, { type: mimeType });
              ('Final composite blob created. Size:', compositeBlob.size, 'bytes');
              ('Final frame count:', frameCount);

              // Enhanced blob validation
              if (compositeBlob.size === 0) {
                ('Created blob is empty!');
                clearTimeout(canvasTimeout);
                reject(new Error('Video processing failed to produce output. Please try again.'));
                return;
              }

              if (compositeBlob.size < 1000) {
                ('Composite blob seems very small:', compositeBlob.size, 'bytes');
              }

              // Clean up
              URL.revokeObjectURL(tempVideo.src);
              clearTimeout(canvasTimeout);

              // Reset export mode
              this.isExportMode = false;
              resolve(compositeBlob);
            }, 1000); // Wait 1 second for final chunks
          };

          mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event.error);
            clearTimeout(canvasTimeout);
            this.isExportMode = false;
            reject(new Error('Recording failed: ' + (event.error?.message || 'Unknown error')));
          };

          mediaRecorder.onstart = () => {
            ('MediaRecorder started successfully');
          };

          // Set export mode for proper transition handling during canvas recording
          this.isExportMode = true;

          // Start recording with frequent data collection
          ('Starting MediaRecorder...');
          mediaRecorder.start(50); // Very frequent collection - every 50ms

          // Set up frame rendering with unique variable names
          let canvasFrameCount = 0;
          let canvasRecordingActive = true;

          // Calculate timing
          const startTime = this.trimStart || 0;
          const endTime = this.trimEnd || this.videoDuration;
          const recordingDuration = endTime - startTime; // Use full duration

          // FIX: Store the actual export duration for FFmpeg to use later
          // This is critical because the WebM metadata may have Infinity duration
          this.lastExportDuration = Number.isFinite(recordingDuration) && recordingDuration > 0
            ? recordingDuration
            : this.getRecordedDuration() || 10;
          console.log('🎬 [EXPORT] Stored lastExportDuration:', this.lastExportDuration);

          console.log('%c═══════════════════════════════════════════════════', 'color: #00ff00; font-weight: bold; font-size: 16px');
          console.log('%c🎬 EXPORT DIAGNOSTICS START 🎬', 'color: #00ff00; font-weight: bold; font-size: 16px');
          console.log('%c═══════════════════════════════════════════════════', 'color: #00ff00; font-weight: bold; font-size: 16px');
          console.log('🎬 [EXPORT] Recording from', startTime, 's to', endTime, 's (duration:', recordingDuration, 's)');
          console.log('🎬 [EXPORT] Zoom segments count:', this.zoomSegments.length);
          if (this.zoomSegments.length > 0) {
            console.log('🎬 [EXPORT] Zoom segments:', JSON.stringify(this.zoomSegments, null, 2));
          }
          console.log('%c═══════════════════════════════════════════════════', 'color: #00ff00; font-weight: bold; font-size: 16px;');

          // Set up recording end timer - extended for frame-by-frame processing
          // Frame-by-frame can take longer than real-time, so we use a generous timeout
          const recordingEndTimeout = setTimeout(() => {
            console.log('⏱️ [TIMEOUT] Export timeout reached');
            canvasRecordingActive = false;

            if (mediaRecorder.state === 'recording') {
              console.log('⏱️ [TIMEOUT] Forcing MediaRecorder stop...');
              mediaRecorder.requestData();
              setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                  mediaRecorder.stop();
                }
              }, 200);
            }
          }, 30 * 60 * 1000); // 30 minute timeout for long videos

          // Wait for video to be properly loaded before starting
          video.addEventListener('loadeddata', async () => {
            ('Video data loaded, seeking to start time...');

            // Seek to start time and wait for it to complete
            video.currentTime = startTime;

            const seekPromise = new Promise((resolve) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                (`Video seeked to ${video.currentTime}s, ready to start...`);
                resolve();
              };
              video.addEventListener('seeked', onSeeked);

              // Fallback timeout
              setTimeout(() => {
                video.removeEventListener('seeked', onSeeked);
                ('Seek timeout, proceeding anyway...');
                resolve();
              }, 2000);
            });

            await seekPromise;

            // Draw initial frame
            drawFrame();

            // ═══════════════════════════════════════════════════════════════
            // FIX: AudioContext + video.play() for background export
            // ═══════════════════════════════════════════════════════════════
            // KEY INSIGHT: Chrome doesn't throttle tabs that are playing audio.
            // We create a silent AudioContext to trick Chrome into keeping
            // our tab active, allowing video.play() to run at full speed.
            // ═══════════════════════════════════════════════════════════════

            const TARGET_FPS = 30;
            const totalFrames = Math.ceil(recordingDuration * TARGET_FPS);

            console.log('%c🎬 [AUDIO-EXPORT] Starting export with AudioContext keepalive', 'color: #00ff00; font-weight: bold');
            console.log(`🎬 [AUDIO-EXPORT] Target: ${totalFrames} frames at ${TARGET_FPS}fps`);

            // Create silent AudioContext to prevent tab throttling
            let audioContext = null;
            let silentOscillator = null;
            let silentGain = null;
            
            try {
              audioContext = new (window.AudioContext || window.webkitAudioContext)();
              silentOscillator = audioContext.createOscillator();
              silentGain = audioContext.createGain();
              silentGain.gain.value = 0.001; // Nearly silent
              silentOscillator.connect(silentGain);
              silentGain.connect(audioContext.destination);
              silentOscillator.start();
              console.log('🎬 [AUDIO-EXPORT] AudioContext keepalive started');
            } catch (e) {
              console.warn('⚠️ AudioContext not available:', e);
            }

            // Initialize export contexts
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
              stiffness: this.spring || 0.15
            };
            // === SCREEN STUDIO CURSOR PREMIUM === Init cursor springs for audio export
            this.ensureCursorSprings(this.exportCursorState);

            // Initialize cursor
            const initialCursorData = (this.rawCursorData && this.rawCursorData.length > 0) 
              ? this.rawCursorData : this.cursorData;
            if (initialCursorData && initialCursorData.length > 0) {
              const initialCursor = this.cursorProcessor.getCursorAtTime(initialCursorData, startTime * 1000);
              if (initialCursor) {
                const padding = this.currentPadding || 0;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                const scaleX = videoWidth / initialCursor.windowWidth;
                const scaleY = videoHeight / initialCursor.windowHeight;
                const canvasDimensions = this.calculateAspectRatioDimensions(videoWidth, videoHeight, this.currentAspectRatio);
                const videoX = padding + (canvasDimensions.width - videoWidth) / 2;
                const videoY = padding + (canvasDimensions.height - videoHeight) / 2;
                this.exportCursorState.smoothCursor.x = videoX + (initialCursor.x * scaleX);
                this.exportCursorState.smoothCursor.y = videoY + (initialCursor.y * scaleY);
              }
            }

            let lastCapturedTime = -1;
            let lastProgressLog = 0;
            const self = this;

            // Draw frame at current video time
            const drawCurrentFrame = () => {
              if (isDrawing) return false;
              isDrawing = true;
              try {
                const currentTime = video.currentTime;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (self.currentBlur > 0 && 
                    (!self.exportBlurredBackgroundCache ||
                     self.exportBlurredBackgroundCache.width !== canvas.width ||
                     self.exportBlurredBackgroundCache.height !== canvas.height)) {
                  self.generateExportBlurredBackgroundCache(canvas.width, canvas.height);
                }

                if (self.currentBlur > 0 && self.exportBlurredBackgroundCache) {
                  ctx.drawImage(self.exportBlurredBackgroundCache, 0, 0);
                } else {
                  self.drawBackgroundDirect(ctx, canvas.width, canvas.height);
                }

                const padding = self.currentPadding || 0;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                const availableWidth = canvas.width - (padding * 2);
                const availableHeight = canvas.height - (padding * 2);
                const videoX = padding + (availableWidth - videoWidth) / 2;
                const videoY = padding + (availableHeight - videoHeight) / 2;

                if (video.readyState >= 2 && videoWidth > 0 && videoHeight > 0) {
                  let filterString = '';
                  if (self.currentBrightness !== 1 || self.currentContrast !== 1 || self.currentSaturation !== 1) {
                    filterString += `brightness(${self.currentBrightness}) contrast(${self.currentContrast}) saturate(${self.currentSaturation}) `;
                  }
                  if (filterString) ctx.filter = filterString.trim();

                  const wasSeekingMode = self.isSeekingMode;
                  const wasExportMode = self.isExportMode;
                  self.isSeekingMode = false;
                  self.isExportMode = true;

                  const zoomState = self.getZoomStateAtTime(currentTime, self.exportZoomContext);
                  const directZoomSegment = self.getZoomSegmentAtTime(currentTime);

                  if (directZoomSegment || (zoomState && zoomState.isActive)) {
                    self.applyExportZoomTransformation(ctx, zoomState, video, videoX, videoY, videoWidth, videoHeight);
                  } else {
                    self.drawVideoWithBorderRadius(ctx, video, videoX, videoY, videoWidth, videoHeight, self.currentBorderRadius);
                  }

                  ctx.filter = 'none';
                  self.drawCursorOverlay(ctx, videoX, videoY, videoWidth, videoHeight, zoomState, currentTime, self.exportCursorState);

                  // Restore previous states AFTER zoom and cursor are applied
                  self.isSeekingMode = wasSeekingMode;
                  self.isExportMode = wasExportMode;
                }
                return true;
              } catch (err) {
                console.warn('⚠️ Draw error:', err);
                return false;
              } finally {
                isDrawing = false;
              }
            };

            // Capture loop using timeupdate (more reliable than seek-based)
            const captureInterval = setInterval(() => {
              if (!canvasRecordingActive) {
                clearInterval(captureInterval);
                return;
              }

              const currentTime = video.currentTime;
              
              // Check if video ended or reached end time
              if (video.ended || currentTime >= endTime) {
                console.log('%c🎬 [AUDIO-EXPORT] Export complete!', 'color: #00ff00; font-weight: bold');
                canvasRecordingActive = false;
                clearInterval(captureInterval);
                
                // Stop AudioContext
                if (silentOscillator) {
                  try { silentOscillator.stop(); } catch(e) {}
                }
                if (audioContext) {
                  try { audioContext.close(); } catch(e) {}
                }
                
                clearTimeout(recordingEndTimeout);
                if (mediaRecorder.state === 'recording') {
                  mediaRecorder.requestData();
                  setTimeout(() => {
                    if (mediaRecorder.state === 'recording') mediaRecorder.stop();
                  }, 200);
                }
                return;
              }

              // Only capture if time has advanced enough (avoid duplicate frames)
              const timeSinceLastCapture = currentTime - lastCapturedTime;
              if (timeSinceLastCapture >= (1 / TARGET_FPS) - 0.001) {
                if (drawCurrentFrame()) {
                  if (typeof videoTrack.requestFrame === 'function') {
                    videoTrack.requestFrame();
                  }
                  lastCapturedTime = currentTime;

                  // Update progress
                  const progressPercent = Math.floor(((currentTime - startTime) / recordingDuration) * 100);
                  if (progressPercent !== lastProgressLog) {
                    lastProgressLog = progressPercent;
                    console.log(`🎬 [AUDIO-EXPORT] ${progressPercent}% (${currentTime.toFixed(1)}s)`);
                    self.updateStatusText(`Exporting... ${progressPercent}%`);
                    self.updateExportProgress(progressPercent);
                  }
                }
              }
            }, 16); // ~60fps check, actual capture at 30fps

            // Start playback
            video.currentTime = startTime;
            video.playbackRate = 1.0;
            
            video.addEventListener('seeked', async function startPlayback() {
              video.removeEventListener('seeked', startPlayback);
              
              console.log('🎬 [AUDIO-EXPORT] Starting playback...');
              self.updateStatusText('Exporting... 0%');
              self.updateExportProgress(0);

              // Resume AudioContext if suspended (needed for user gesture)
              if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
              }

              // Draw first frame
              drawCurrentFrame();
              if (typeof videoTrack.requestFrame === 'function') {
                videoTrack.requestFrame();
              }
              lastCapturedTime = startTime;

              // Start video playback
              await video.play();
            }, { once: true });
          });

          video.addEventListener('error', (error) => {
            console.error('Video playback error:', error);
            clearTimeout(canvasTimeout);
            clearTimeout(recordingEndTimeout);
            reject(new Error('Video playback failed: ' + (error.message || 'Unknown error')));
          });

        } catch (error) {
          clearTimeout(canvasTimeout);
          this.isExportMode = false;
          reject(new Error('Canvas setup failed: ' + error.message));
        }
      };

      tempVideo.addEventListener('loadedmetadata', async () => {
        try {
          ('Temp video metadata loaded:', {
            width: tempVideo.videoWidth,
            height: tempVideo.videoHeight,
            duration: tempVideo.duration
          });

          // Create canvas with optimized dimensions
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: false });

          if (!ctx) {
            clearTimeout(canvasTimeout);
            throw new Error("Could not get canvas 2D context");
          }

          // Canvas dimensions will be set in processVideoOnCanvas
          ('Canvas and context created successfully');

          // Start video processing directly with cached background
          processVideoOnCanvas(canvas, ctx, tempVideo);

        } catch (error) {
          clearTimeout(canvasTimeout);
          this.isExportMode = false;
          reject(error);
        }
      });

      tempVideo.addEventListener('error', (error) => {
        ('Temp video error:', error);
        clearTimeout(canvasTimeout);
        this.isExportMode = false;
        reject(new Error("Failed to load video for processing: " + error.message));
      });
    });
  }

  // Always use canvas preview now that we have default border radius
  needsCanvasPreview() {
    return true; // Always use canvas for consistent rendering
  }

  needsCanvasComposition() {
    const hasZoomSegments = this.zoomSegments && this.zoomSegments.length > 0;

    return (
      this.currentPadding > 0 ||
      this.currentBackground !== "#000000" ||
      this.currentBrightness !== 1 ||
      this.currentContrast !== 1 ||
      this.currentSaturation !== 1 ||
      this.currentBlur > 0 ||
      this.currentBorderRadius > 0 ||
      this.currentAspectRatio !== "native" ||
      hasZoomSegments
    );
  }

  needsFFmpegProcessing() {
    const needsFormatConversion = this.formatSelect.value !== "webm";
    const needsTrimming = this.trimStart > 0 || this.trimEnd < this.videoDuration;
    const needsGifConversion = this.formatSelect.value === "gif";

    return needsFormatConversion || needsTrimming || needsGifConversion;
  }

  checkFFmpegAvailability() {
    if (!this.isFFmpegLoaded) {
      ('FFmpeg not loaded - some export features may be limited');
      return false;
    }
    return true;
  }

  updateStatusText(message) {
    // Update status text if element exists
    const statusElement = document.getElementById('status-text');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.style.display = message ? 'block' : 'none';
    }

    // Also show notification for important status updates
    if (message.includes('Processing') || message.includes('Converting') || message.includes('Export')) {
      this.showInfo(message);
    }
  }

  async waitForVideoMetadata() {
    return new Promise((resolve, reject) => {
      if (!this.previewVideo) {
        reject(new Error("Preview video element not found"));
        return;
      }

      ("=== Video Metadata Validation Debug ===");
      ("Video readyState:", this.previewVideo.readyState);
      ("Video duration (raw):", this.previewVideo.duration);
      ("Recording blob size:", this.recordingBlob?.size || 0);
      ("Recorded duration fallback:", this.getRecordedDuration());
      ("=======================================");

      // Enhanced validation with multiple fallback strategies
      const validateDuration = (source = "unknown") => {
        const duration = this.previewVideo.duration;
        (`Duration validation from ${source}:`, duration);

        // Check for valid finite duration
        if (Number.isFinite(duration) && duration > 0 && duration !== Infinity) {
          this.videoDuration = duration;
          ("✓ Valid video duration set:", this.videoDuration, "from", source);
          return true;
        }

        // Try fallback to recorded duration
        const recordedDuration = this.getRecordedDuration();
        (`Trying recorded duration fallback:`, recordedDuration);

        if (recordedDuration > 0 && Number.isFinite(recordedDuration)) {
          this.videoDuration = recordedDuration;
          ("✓ Using recorded duration fallback:", this.videoDuration);
          return true;
        }

        // Last resort: use a reasonable default based on blob size
        if (this.recordingBlob && this.recordingBlob.size > 0) {
          // Estimate duration based on blob size (rough approximation)
          const estimatedDuration = Math.max(1, Math.min(300, this.recordingBlob.size / (1024 * 1024))); // 1MB per second rough estimate
          this.videoDuration = estimatedDuration;
          ("⚠ Using estimated duration fallback:", this.videoDuration);
          return true;
        }

        ("✗ All duration validation methods failed");
        return false;
      };

      // Check if metadata is already loaded
      if (this.previewVideo.readyState >= 1) { // HAVE_METADATA
        ("Video metadata already loaded");
        if (validateDuration("already-loaded")) {
          resolve();
        } else {
          reject(new Error("Video duration validation failed. Recording may be corrupted. Please try recording again."));
        }
        return;
      }

      ("Waiting for video metadata to load...");

      const timeout = setTimeout(() => {
        cleanup();
        ("Metadata loading timeout - attempting fallback validation");

        // Final attempt with recorded duration
        const recordedDuration = this.getRecordedDuration();
        if (recordedDuration > 0) {
          this.videoDuration = recordedDuration;
          ("Using recorded duration after timeout:", this.videoDuration);
          resolve();
        } else {
          reject(new Error("Timeout waiting for video metadata (20 seconds). Please try recording again."));
        }
      }, 20000); // Increased timeout to 20 seconds

      const cleanup = () => {
        clearTimeout(timeout);
        this.previewVideo.removeEventListener('loadedmetadata', onLoadedMetadata);
        this.previewVideo.removeEventListener('error', onError);
        this.previewVideo.removeEventListener('loadeddata', onLoadedData);
        this.previewVideo.removeEventListener('durationchange', onDurationChange);
      };

      const onLoadedMetadata = () => {
        ("Video metadata loaded via loadedmetadata event");
        if (validateDuration("loadedmetadata")) {
          cleanup();
          resolve();
        } else {
          ("Duration invalid after loadedmetadata, waiting for other events...");
        }
      };

      const onLoadedData = () => {
        if (this.previewVideo.readyState >= 2) { // HAVE_CURRENT_DATA
          ("Video data loaded via loadeddata event");
          if (validateDuration("loadeddata")) {
            cleanup();
            resolve();
          }
        }
      };

      const onDurationChange = () => {
        ("Duration changed event fired");
        if (validateDuration("durationchange")) {
          cleanup();
          resolve();
        }
      };

      const onError = (error) => {
        ("Video error during metadata loading:", error);
        cleanup();

        // Try fallback before rejecting
        const recordedDuration = this.getRecordedDuration();
        if (recordedDuration > 0) {
          this.videoDuration = recordedDuration;
          ("Using recorded duration after video error:", this.videoDuration);
          resolve();
        } else {
          reject(new Error("Failed to load video metadata and no fallback available: " + (error.message || "Unknown error")));
        }
      };

      // Add all event listeners
      this.previewVideo.addEventListener('loadedmetadata', onLoadedMetadata);
      this.previewVideo.addEventListener('error', onError);
      this.previewVideo.addEventListener('loadeddata', onLoadedData);
      this.previewVideo.addEventListener('durationchange', onDurationChange);

      // Force reload if necessary
      if (this.previewVideo.readyState === 0) {
        ("Video not started loading, triggering load...");
        try {
          this.previewVideo.load();
        } catch (loadError) {
          ("Failed to trigger video load:", loadError);
        }
      }

      // Additional fallback: check duration periodically
      let checkCount = 0;
      const durationChecker = setInterval(() => {
        checkCount++;
        (`Duration check attempt ${checkCount}:`, this.previewVideo.duration);

        if (validateDuration(`periodic-check-${checkCount}`)) {
          clearInterval(durationChecker);
          cleanup();
          resolve();
        } else if (checkCount >= 10) { // Stop after 10 attempts (5 seconds)
          clearInterval(durationChecker);
          ("Periodic duration checks failed");
        }
      }, 500); // Check every 500ms

      // Clear interval on cleanup
      const originalCleanup = cleanup;
      cleanup = () => {
        clearInterval(durationChecker);
        originalCleanup();
      };
    });
  }

  // Cleanup method to prevent memory leaks
  cleanup() {
    // Stop canvas rendering
    this.stopCanvasRendering();

    // Stop zoom animations
    if (this.zoomAnimationFrame) {
      cancelAnimationFrame(this.zoomAnimationFrame);
      this.zoomAnimationFrame = null;
    }

    // Clear zoom transition state
    this.zoomTransitionStartTime = null;
    this.zoomTransitionStartState = null;
    this.zoomTransitionTargetState = null;

    // Clear cursor data
    this.cursorData = [];
    this.cursorDataIndex = 0;

    // Clear background image cache
    this.backgroundImageCache = null;
    this.blurredBackgroundCache = null;
    this.exportBlurredBackgroundCache = null;

    // Revoke object URLs
    if (this.previewVideo.src && this.previewVideo.src.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewVideo.src);
    }

    // Clear video source
    this.previewVideo.src = '';

    ('Cleanup completed');
  }

  // Reset export-specific state before each export to prevent stale data issues
  resetExportState() {
    console.log('🧹 Resetting export state...');
    
    // Reset export mode flag
    this.isExportMode = false;
    
    // Clear export cursor state
    this.exportCursorState = null;
    
    // Clear export blur cache
    this.exportBlurredBackgroundCache = null;
    
    // Clear any pending FFmpeg files
    if (this.ffmpeg && this.isFFmpegLoaded) {
      try {
        // Attempt to clean up any leftover files in FFmpeg's virtual filesystem
        const filesToClean = ['input.webm', 'output.mp4', 'output.webm', 'output.gif'];
        for (const file of filesToClean) {
          try {
            this.ffmpeg.deleteFile(file);
          } catch (e) {
            // File may not exist, ignore error
          }
        }
      } catch (e) {
        console.log('FFmpeg cleanup skipped:', e.message);
      }
    }
    
    console.log('✅ Export state reset complete');
  }

  // Enhanced smooth easing function with more pronounced smoothing
  // === SCREEN STUDIO MATCH — SMOOTH SPRING ===
  // Stateful spring system with semi-implicit Euler integration.
  // Maintains position + velocity across frames for buttery-smooth animation.
  //
  // VERSION B (default): "Cinematic settle" — slightly bouncy like Screen Studio
  //   tension: 120, friction: 20
  //
  // VERSION A (alternative): "Mellow" — smoother, more damped, no bounce
  //   tension: 180, friction: 28
  //
  // To switch: change the defaults below or pass overrides to createZoomSprings().

  /**
   * Creates a single stateful spring channel.
   * Call .update(target, dt) each frame. Reads .position for current value.
   */
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

  /**
   * Lazily initialize the 3 zoom spring channels (scale, centerX, centerY).
   * Called once; channels persist for the lifetime of the recorder.
   */
  ensureZoomSprings(context = this) {
    if (!context._zoomSprings) {
      // Presets — ALL overdamped (ζ > 1) so there is ZERO bounce / oscillation
      // Rapid: T=80, F=20 → ζ=1.12   Quick: T=30, F=14 → ζ=1.28
      // Default: T=10, F=8 → ζ=1.26  Slow: T=4, F=5 → ζ=1.25
      const presets = { rapid: [80, 20], quick: [30, 14], default: [10, 8], slow: [4, 5] };
      const preset = presets[this.zoomAnimationPreset || 'default'] || presets.default;
      const T = preset[0];
      const F = preset[1];

      context._zoomSprings = {
        scale: ScreenSmoothRecorder.createSpring(1, T, F),
        x:     ScreenSmoothRecorder.createSpring(0.5, T, F),
        y:     ScreenSmoothRecorder.createSpring(0.5, T, F),
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
        // Position springs — smooth cursor movement with natural momentum
        x:        ScreenSmoothRecorder.createSpring(0, T, F),
        y:        ScreenSmoothRecorder.createSpring(0, T, F),
        // === SCREEN STUDIO CURSOR PREMIUM === Click scale spring (snappy + bouncy)
        // Faster/bouncier than position springs: tension:420, friction:18
        // Slightly underdamped for natural overshoot on mouseup
        scale:    ScreenSmoothRecorder.createSpring(1, 420, 18),
        // === SCREEN STUDIO CURSOR PREMIUM === Rotation spring (smooth tilt settle)
        rotation: ScreenSmoothRecorder.createSpring(0, 200, 20),
        lastTime: null
      };
    }
    return context._cursorSprings;
  }

  // === SCREEN STUDIO MATCH === Get zoom state with STATEFUL spring physics
  // Forces 100% full view outside any segment — no cursor following
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

    // ------- SEEKING MODE: instant jump, no spring -------
    if (this.isSeekingMode && !this.isExportMode) {
      const springs = this.ensureZoomSprings(context);
      if (activeZoom) {
        const si = activeZoom.intensity && activeZoom.intensity >= 1.25
          ? activeZoom.intensity
          : (this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5);
        const sp = activeZoom.position || { x: 0.5, y: 0.5 };
        context.currentZoomState.intensity = si;
        context.currentZoomState.position = { ...sp };
        context.currentZoomState.isActive = true;
        // Snap springs so playback resumes without a jump
        springs.scale.snap(si);
        springs.x.snap(sp.x);
        springs.y.snap(sp.y);
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
      // First frame or large jump → snap springs to correct state (no animation)
      dt = 0;
      if (activeZoom) {
        const si = activeZoom.intensity && activeZoom.intensity >= 1.25
          ? activeZoom.intensity
          : (this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5);
        const sp = activeZoom.position || { x: 0.5, y: 0.5 };
        springs.scale.snap(si);
        springs.x.snap(sp.x);
        springs.y.snap(sp.y);
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
      // === Inside a zoom segment → target = zoomed values ===
      targetScale = activeZoom.intensity && activeZoom.intensity >= 1.25
        ? activeZoom.intensity
        : (this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5);
      const sp = activeZoom.position || { x: 0.5, y: 0.5 };
      targetX = sp.x;
      targetY = sp.y;
    }
    // Outside segment → targets are already 1, 0.5, 0.5 (forced 100% view)

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
      console.log('🕒 [COUNTDOWN] startCountdown called, overlay found:', !!overlay);
      
      if (!overlay) {
        console.log('🕒 [COUNTDOWN] No overlay found, resolving immediately');
        resolve();
        return;
      }

      const number = overlay.querySelector('.countdown-number');
      const text = overlay.querySelector('.countdown-text');

      overlay.style.display = 'flex';
      let count = 3;
      const startTime = Date.now();
      console.log(`🕒 [COUNTDOWN] Starting countdown at ${startTime}`);

      const update = () => {
        const elapsed = Date.now() - startTime;
        console.log(`🕒 [COUNTDOWN] update() called - count: ${count}, elapsed: ${elapsed}ms`);
        
        if (count > 0) {
          if (number) number.textContent = count;
          if (text) text.textContent = 'Starting Recording...';
          document.title = `Starting in ${count}...`;
          console.log(`🕒 [COUNTDOWN] Displaying: ${count}, scheduling next in 1000ms`);
          count--;
          setTimeout(update, 1000);
        } else {
          const totalTime = Date.now() - startTime;
          console.log(`🕒 [COUNTDOWN] Countdown complete! Total time: ${totalTime}ms`);
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

    console.log('✨ Processing cursor data with Spring Physics...');
    console.log('🔍 Raw Data Start:', this.cursorData.slice(0, 5));

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
      console.log(`🗑️ Removed ${removedCount} invalid (0,0) or NaN points from the entire recording`);
      // Log details of filtered points to help identify patterns
      console.log('📊 Filtered points detail:', {
        total: removedCount,
        clickEvents: filteredOut.filter(p => p.type === 'click').length,
        samples: filteredOut.slice(0, 10) // Show first 10 filtered points
      });
    }

    // 🔍 DIAGNOSTIC: Track click events in the data
    const clickEvents = this.cursorData.filter(p => p.type === 'click');
    console.log(`🖱️ Click events in recording: ${clickEvents.length}`);
    if (clickEvents.length > 0) {
      console.log('🖱️ First few clicks:', clickEvents.slice(0, 5).map(c => ({
        x: c.x,
        y: c.y,
        timestamp: c.timestamp,
        isPressed: c.isPressed
      })));
    }

    // If no valid data left, return
    if (this.cursorData.length === 0) {
      console.warn('⚠️ No valid cursor data found after filtering (0,0) points');
      return;
    }

    // 🔧 FIX: Normalize timestamps to be relative to recording start
    // Cursor timestamps use absolute time (performance.now() or Date.now())
    // but video playback starts from 0, so we need to subtract the first timestamp
    if (this.cursorData.length > 0) {
      // 🎯 Use the exact recording start timestamp instead of first cursor timestamp
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
        console.log(`⚠️ First timestamp is negative (${this.cursorData[0].timestamp}ms), shifting all by +${offset}ms`);
        this.cursorData = this.cursorData.map(c => ({ ...c, timestamp: c.timestamp + offset }));
      }

      console.log('✅ [FIX] Timestamps normalized:', {
        firstNormalizedTimestamp: this.cursorData[0].timestamp,
        lastNormalizedTimestamp: this.cursorData[this.cursorData.length - 1].timestamp,
        totalDuration: this.cursorData[this.cursorData.length - 1].timestamp,
        videoDuration: this.videoDuration * 1000,
        timeDifference: Math.abs((this.cursorData[this.cursorData.length - 1].timestamp / 1000) - this.videoDuration)
      });
    }

    // 🔧 FIX: Also normalize zoom segment timestamps
    // Clamp to valid video duration only if videoDuration is actually set
    if (this.zoomSegments.length > 0 && this.videoDuration && this.videoDuration > 0) {
      console.log('🔧 [ZOOM] Normalizing zoom segment timestamps to videoDuration:', this.videoDuration);
      this.zoomSegments = this.zoomSegments.map(segment => ({
        ...segment,
        startTime: Math.max(0, Math.min(segment.startTime, this.videoDuration)),
        endTime: Math.max(segment.startTime, Math.min(this.videoDuration, segment.endTime))
      }));
    }

    // === SCREEN STUDIO MATCH === Post-recording auto-zoom segment generation
    // Generate zoom segments from stored click events AFTER recording stops
    if (this.zoomMode === 'auto' && this.autoZoomClickEvents && this.autoZoomClickEvents.length > 0) {
      console.log('🎯 [AUTO-ZOOM] Generating segments from', this.autoZoomClickEvents.length, 'stored click events');
      this.zoomSegments = this.generateAutoZoomSegments(this.autoZoomClickEvents);
      this.renderZoomSegments();
      console.log('✅ [AUTO-ZOOM] Generated', this.zoomSegments.length, 'zoom segments post-recording');
    }

    // Store raw cursor data for real-time smoothing (before SpringSmoother processing)
    this.rawCursorData = JSON.parse(JSON.stringify(this.cursorData));
    console.log('📦 Raw cursor data stored:', this.rawCursorData.length, 'points');
    // Note: We no longer pre-process with SpringSmoother here
    // Spring physics are now applied in real-time during preview via updateSmoothCursor
    // This allows the cursor smoothness slider to work after recording
    console.log('✨ Cursor data ready for real-time smoothing');
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

  showInfo(message) {
    (message);
    // You can enhance this with toast notifications
    if (this.updateStatusText) {
      this.updateStatusText(message);
      setTimeout(() => this.updateStatusText(''), 3000);
    }
  }

  // Clear all zoom data - used when starting new recording or on page refresh
  clearAllZoomData() {
    ('=== CLEAR ALL ZOOM DATA START ===');
    ('Clearing', this.zoomSegments.length, 'zoom segments');

    this.zoomSegments = [];
    this.selectedZoomSegment = null;
    this.isAddingZoom = false;

    // Update UI state - no more add button state management
    if (this.zoomTrack) {
      this.zoomTrack.style.cursor = 'pointer';
    }

    // Show empty message
    this.showNoZoomMessage();

    // Clear localStorage
    try {
      localStorage.removeItem('screensmooth-zoom-data');
      ('Zoom data cleared from localStorage');
    } catch (error) {
      ('Failed to clear zoom data from localStorage:', error);
    }

    // Re-render empty zoom timeline
    this.renderZoomSegments();

    // Update clear button state after clearing all segments
    this.updateClearButtonState();

    ('=== CLEAR ALL ZOOM DATA END ===');
  }

  // Clear all zoom segments - for manual clearing
  clearAllZoomSegments() {
    ('=== CLEAR ALL ZOOM SEGMENTS CLICKED ===');
    ('Current zoom segments:', this.zoomSegments.length);

    if (this.zoomSegments.length === 0) {
      this.showInfo('No zoom segments to clear');
      return;
    }

    // Confirm deletion
    if (confirm(`Are you sure you want to delete all ${this.zoomSegments.length} zoom segments?`)) {
      ('User confirmed deletion, clearing all zoom data');
      this.clearAllZoomData();
      this.showInfo('All zoom segments deleted');
      ('All zoom segments cleared successfully');
    } else {
      ('User cancelled zoom deletion');
    }
  }

  // Delete a specific zoom segment
  deleteZoomSegment(segmentId) {
    const segmentIndex = this.zoomSegments.findIndex(segment => segment.id === segmentId);
    if (segmentIndex === -1) {
      ('Zoom segment not found for deletion:', segmentId);
      return;
    }

    const segment = this.zoomSegments[segmentIndex];
    this.zoomSegments.splice(segmentIndex, 1);

    // Clear selection if deleted segment was selected
    if (this.selectedZoomSegment && this.selectedZoomSegment.id === segmentId) {
      this.showNoZoomMessage();
    }

    this.renderZoomSegments();
    this.saveZoomData();

    // If no segments left, show empty message
    if (this.zoomSegments.length === 0) {
      this.showNoZoomMessage();
    }

    // Update clear button state after deletion
    this.updateClearButtonState();

    ('Deleted zoom segment:', segment);
    this.showInfo(`Zoom segment deleted at ${this.formatTime(segment.startTime)}`);
  }

  handleZoomTrackClick(event) {
    console.log('🔍 [TIMELINE] =========================');
    console.log('🔍 [TIMELINE] Click event received!');
    console.log('🔍 [TIMELINE] videoDuration:', this.videoDuration, 'typeof:', typeof this.videoDuration);
    console.log('🔍 [TIMELINE] Number.isFinite(videoDuration):', Number.isFinite(this.videoDuration));
    console.log('🔍 [TIMELINE] Event target:', event.target);
    console.log('🔍 [TIMELINE] zoomTrack element:', !!this.zoomTrack);
    console.log('🔍 [TIMELINE] isPlaying:', this.isPlaying);
    console.log('🔍 [TIMELINE] Current zoom segments:', this.zoomSegments?.length || 0);

    // One-click zoom creation - no need for add mode
    if (!this.videoDuration) {
      console.log('🔍 [TIMELINE] ❌ BLOCKED: videoDuration is falsy:', this.videoDuration);
      this.showError('Video not ready. Please wait for video to load completely.');
      return;
    }

    // Prevent event from bubbling up
    event.stopPropagation();
    event.preventDefault();

    const rect = this.zoomTrack.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    console.log('🔍 [TIMELINE] Track rect width:', rect.width);
    console.log('🔍 [TIMELINE] Click X:', clickX);

    // Validate track dimensions
    if (rect.width <= 0) {
      console.log('🔍 [TIMELINE] ❌ BLOCKED: Invalid track dimensions:', rect.width);
      this.showError('Timeline not ready. Please try again.');
      return;
    }

    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const clickTime = percentage * this.videoDuration;

    console.log('🔍 [TIMELINE] Calculated clickTime:', clickTime);
    console.log('🔍 [TIMELINE] Percentage:', (percentage * 100).toFixed(2) + '%');

    // Immediately create zoom segment (one-click functionality)
    try {
      console.log('🔍 [TIMELINE] Calling createZoomSegmentAtTime with:', clickTime);
      this.createZoomSegmentAtTime(clickTime);
      console.log('🔍 [TIMELINE] ✅ createZoomSegmentAtTime completed');
    } catch (error) {
      console.log('🔍 [TIMELINE] ❌ ERROR creating zoom segment:', error);
      console.log('🔍 [TIMELINE] Error stack:', error.stack);
      this.showError('Failed to create zoom segment. Please try again.');
      return;
    }

    // Seek video to clicked time
    if (this.previewVideo) {
      this.previewVideo.currentTime = clickTime;

      // CRITICAL: Force immediate canvas render for paused video
      // This ensures zoom state changes are visible immediately after zoom click
      if (!this.isPlaying) {
        // Force seeking mode and immediate zoom state update
        this.isSeekingMode = true;

        // Force zoom state recalculation at new position
        const currentTime = this.previewVideo.currentTime;
        const activeZoom = this.getZoomSegmentAtTime(currentTime);

        if (activeZoom) {
          this.currentZoomState = {
            intensity: activeZoom.intensity || 1.5,
            position: activeZoom.position || { x: 0.5, y: 0.5 },
            isActive: true
          };
        } else {
          this.currentZoomState = {
            intensity: 1,
            position: { x: 0.5, y: 0.5 },
            isActive: false
          };
        }

        // Force immediate canvas render
        this.renderToCanvas();

        // Clear seeking mode after render
        setTimeout(() => {
          this.isSeekingMode = false;
        }, 50);
      }

      (`Video seeked to ${this.formatTime(clickTime)}`);
    }

    ('=== ZOOM TRACK CLICK END ===');
  }

  createZoomSegmentAtTime(clickTime) {
    console.log('🔍 [ZOOM] =========================');
    console.log('🔍 [ZOOM] createZoomSegmentAtTime called');
    console.log('🔍 [ZOOM] clickTime:', clickTime);
    console.log('🔍 [ZOOM] videoDuration:', this.videoDuration);
    console.log('🔍 [ZOOM] Current zoom segments count:', this.zoomSegments.length);

    // Temporarily allow zoom functionality for testing
    // TODO: Re-enable premium check when needed
    // if (!this.isPremium) {
    //   this.showPremiumRequiredMessage();
    //   return;
    // }

    const defaultDuration = 3;

    // Calculate start and end times, centering around click position
    let startTime = Math.max(0, clickTime - defaultDuration / 2);
    let endTime = Math.min(this.videoDuration, startTime + defaultDuration);

    // Adjust if we hit the end boundary
    if (endTime === this.videoDuration && endTime - startTime < defaultDuration) {
      startTime = Math.max(0, endTime - defaultDuration);
    }

    const actualDuration = endTime - startTime;

    console.log('🔍 [ZOOM] Calculated segment: start=' + this.formatTime(startTime) + ', end=' + this.formatTime(endTime) + ', duration=' + actualDuration.toFixed(1) + 's');

    // Check for overlapping segments
    console.log('🔍 [ZOOM] Checking for overlapping segments...');

    const overlapping = this.zoomSegments.find(segment =>
      (startTime >= segment.startTime && startTime < segment.endTime) ||
      (endTime > segment.startTime && endTime <= segment.endTime) ||
      (startTime <= segment.startTime && endTime >= segment.endTime)
    );

    if (overlapping) {
      console.log('🔍 [ZOOM] ❌ Overlapping segment found:', overlapping);
      this.showError('Cannot create overlapping zoom segments. Please choose a different time.');
      return;
    } else {
      console.log('🔍 [ZOOM] ✅ No overlapping segments, proceeding');
    }

    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const zoomIntensity = this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5;

    console.log('🔍 [ZOOM] Creating segment with intensity:', zoomIntensity, 'position:', this.zoomPosition, 'mode:', this.zoomMode);

    const zoomSegment = {
      id: Date.now().toString(),
      startTime: startTime,
      endTime: endTime,
      intensity: zoomIntensity, // Use validated intensity value
      position: { ...this.zoomPosition }, // Use current default position
      mode: this.zoomMode, // Use current default mode
      screenDimensions: {
        width: window.screen.width,
        height: window.screen.height
      }
    };

    this.zoomSegments.push(zoomSegment);
    ('Zoom segment added to array successfully');

    // Hide the no zoom message since we now have a segment
    try {
      if (this.noZoomMessage) {
        this.noZoomMessage.style.display = 'none';
        ('Hidden noZoomMessage');
      } else {
        ('noZoomMessage element not found');
      }
      if (this.noZoomMessageRight) {
        this.noZoomMessageRight.style.display = 'none';
        ('Hidden noZoomMessageRight');
      } else {
        ('noZoomMessageRight element not found');
      }
    } catch (error) {
      ('Error hiding zoom messages:', error);
    }

    try {
      ('About to render zoom segments');
      this.renderZoomSegments();
      ('Zoom segments rendered successfully');
    } catch (error) {
      ('Error rendering zoom segments:', error);
    }

    try {
      ('About to save zoom data');
      this.saveZoomData();
      ('Zoom data saved successfully');
    } catch (error) {
      ('Error saving zoom data:', error);
    }

    // Automatically select the new segment
    try {
      ('About to select zoom segment:', zoomSegment.id);
      this.selectZoomSegment(zoomSegment);
      ('Zoom segment selected successfully');
    } catch (error) {
      ('Error selecting zoom segment:', error);
    }

    // Update clear button state after adding segment
    this.updateClearButtonState();

    ('Successfully created and selected zoom segment:', zoomSegment);
    this.showInfo(`Zoom created at ${this.formatTime(startTime)} (${actualDuration.toFixed(1)}s duration) with ${zoomIntensity.toFixed(1)}x intensity`);

    // Log the created segment for debugging
    (`New zoom segment created: ${zoomIntensity.toFixed(1)}x intensity from ${this.formatTime(startTime)} to ${this.formatTime(endTime)}`);
    ('Total segments after creation:', this.zoomSegments.length);
    ('=== CREATE ZOOM SEGMENT END ===');
  }

  handleZoomTrackHover(event) {
    if (!this.videoDuration || !this.zoomHoverIndicator) {
      ('Hover blocked: videoDuration =', this.videoDuration, 'hoverIndicator =', !!this.zoomHoverIndicator);
      return;
    }

    const rect = this.zoomTrack.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;

    // Ensure we have valid track dimensions
    if (rect.width <= 0) {
      ('Invalid track width:', rect.width);
      return;
    }

    const percentage = Math.max(0, Math.min(1, hoverX / rect.width));
    const hoverTime = percentage * this.videoDuration;

    ('=== ZOOM HOVER DEBUG ===');
    ('Mouse clientX:', event.clientX);
    ('Track rect:', { left: rect.left, width: rect.width, right: rect.right });
    ('Hover X (relative):', hoverX);
    ('Percentage:', (percentage * 100).toFixed(2) + '%');
    ('Hover time:', this.formatTime(hoverTime), '(' + hoverTime.toFixed(2) + 's)');
    ('Video duration:', this.videoDuration + 's');
    ('=========================');

    // Ensure coordinates are within bounds
    const clampedHoverX = Math.max(0, Math.min(rect.width, hoverX));

    // Update hover indicator position
    this.zoomHoverIndicator.style.left = `${clampedHoverX}px`;
    this.zoomHoverIndicator.style.opacity = '1';

    // Update time preview with better positioning
    if (this.zoomTimePreview) {
      this.zoomTimePreview.textContent = this.formatTime(hoverTime);
      // Center the preview on the hover position
      const previewWidth = this.zoomTimePreview.offsetWidth || 60; // estimated width
      let previewLeft = clampedHoverX - (previewWidth / 2);

      // Keep preview within track bounds
      previewLeft = Math.max(0, Math.min(rect.width - previewWidth, previewLeft));

      this.zoomTimePreview.style.left = `${previewLeft}px`;
      this.zoomTimePreview.style.opacity = '1';

      ('Time preview positioned at:', previewLeft + 'px', 'showing:', this.formatTime(hoverTime));
    }

    // Show placeholder zoom segment
    this.showZoomPlaceholder(hoverX, hoverTime, percentage);
  }

  showZoomPlaceholder(hoverX, hoverTime, percentage) {
    if (!this.zoomPlaceholder || !this.videoDuration) return;

    const defaultDuration = 3; // 3 seconds default

    // Calculate start and end times, centering around hover position
    let startTime = Math.max(0, hoverTime - defaultDuration / 2);
    let endTime = Math.min(this.videoDuration, startTime + defaultDuration);

    // Adjust if we hit the end boundary
    if (endTime === this.videoDuration && endTime - startTime < defaultDuration) {
      startTime = Math.max(0, endTime - defaultDuration);
    }

    const actualDuration = endTime - startTime;

    // Calculate position percentages
    const startPercent = (startTime / this.videoDuration) * 100;
    const widthPercent = (actualDuration / this.videoDuration) * 100;

    console.log(`Placeholder calculation:`);
    console.log(`  - Hover time: ${this.formatTime(hoverTime)} (${(hoverTime).toFixed(2)}s)`);
    console.log(`  - Start time: ${this.formatTime(startTime)} (${startTime.toFixed(2)}s)`);
    console.log(`  - End time: ${this.formatTime(endTime)} (${endTime.toFixed(2)}s)`);
    console.log(`  - Duration: ${actualDuration.toFixed(1)}s`);
    console.log(`  - Position: left=${startPercent.toFixed(1)}%, width=${widthPercent.toFixed(1)}%`);
    console.log(`  - Video duration: ${this.videoDuration}s`);

    this.zoomPlaceholder.style.left = `${startPercent}%`;
    this.zoomPlaceholder.style.width = `${widthPercent}%`;
    this.zoomPlaceholder.textContent = `${actualDuration.toFixed(1)}s`;
    this.zoomPlaceholder.style.opacity = '0.5'; // Always show with half opacity
  }

  showZoomTrackHover() {
    // Show time preview on hover
    if (this.zoomTimePreview) {
      this.zoomTimePreview.style.opacity = '1';
    }
  }

  hideZoomHoverIndicator() {
    if (this.zoomHoverIndicator) {
      this.zoomHoverIndicator.style.opacity = '0';
    }
    if (this.zoomTimePreview) {
      this.zoomTimePreview.style.opacity = '0';
    }
    if (this.zoomPlaceholder) {
      this.zoomPlaceholder.style.opacity = '0';
    }
  }

  updateZoomIntensity() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const newIntensity = parseFloat(this.zoomIntensitySlider.value);
    this.zoomIntensity = newIntensity && newIntensity >= 1.25 ? newIntensity : 1.5;

    // Ensure intensity is within valid range
    this.zoomIntensity = Math.max(1.25, Math.min(4, this.zoomIntensity));

    if (this.zoomIntensityValue) {
      this.zoomIntensityValue.textContent = `${this.zoomIntensity.toFixed(1)}x`;
    }

    // Update ONLY the selected zoom segment if any (not all segments)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.intensity = this.zoomIntensity;
      this.renderZoomSegments();
      this.saveZoomData();
      (`Updated intensity for segment ${this.selectedZoomSegment.id}:`, this.zoomIntensity.toFixed(1));

      // Log the update for debugging
      (`Zoom segment intensity updated to ${this.zoomIntensity.toFixed(1)}x`);
    } else {
      // Update default value for new segments
      ('Updated default zoom intensity:', this.zoomIntensity.toFixed(1));
    }
  }
  updateZoomIntensityRight() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const newIntensity = parseFloat(this.zoomIntensitySliderRight.value);
    const validIntensity = newIntensity && newIntensity >= 1.25 ? newIntensity : 1.5;

    // Ensure intensity is within valid range
    const clampedIntensity = Math.max(1.25, Math.min(4, validIntensity));

    if (this.zoomIntensityValueRight) {
      this.zoomIntensityValueRight.textContent = `${clampedIntensity.toFixed(1)}x`;
    }

    // Update ONLY the selected zoom segment if any (not all segments)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.intensity = clampedIntensity;
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update the left sidebar to keep them synchronized
      if (this.zoomIntensitySlider) {
        this.zoomIntensitySlider.value = clampedIntensity;
      }
      if (this.zoomIntensityValue) {
        this.zoomIntensityValue.textContent = `${clampedIntensity.toFixed(1)}x`;
      }

      (`Updated intensity for segment ${this.selectedZoomSegment.id}:`, clampedIntensity.toFixed(1));
    } else {
      // Update default value for new segments
      this.zoomIntensity = clampedIntensity;
      ('Updated default zoom intensity:', clampedIntensity.toFixed(1));
    }
  }

  updateZoomModeRight(mode) {
    // Update ONLY the selected zoom segment if any (not global mode)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.mode = mode;
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update the left sidebar to keep them synchronized
      this.updateZoomMode(mode);

      (`Updated mode for segment ${this.selectedZoomSegment.id}:`, mode);
    } else {
      // Update default mode for new segments
      this.zoomMode = mode;

      // Also update the left sidebar to keep them synchronized
      this.updateZoomMode(mode);

      ('Updated default zoom mode:', mode);
    }

    // Show/hide manual controls based on current segment or default mode
    const currentMode = this.selectedZoomSegment ? this.selectedZoomSegment.mode : this.zoomMode;
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = currentMode === 'manual' ? 'block' : 'none';
    }

    // Also update left sidebar manual controls
    if (this.manualZoomControls) {
      this.manualZoomControls.style.display = currentMode === 'manual' ? 'block' : 'none';
    }
  }

  handleZoomPositionClickRight(event) {
    const rect = this.zoomPositionPreviewRight.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const newPosition = {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    };

    // Update position indicator
    if (this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${newPosition.x * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${newPosition.y * 100}%`;
    }

    // Also update left sidebar position indicator
    if (this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${newPosition.x * 100}%`;
      this.zoomPositionIndicator.style.top = `${newPosition.y * 100}%`;
    }

    // Update ONLY the selected zoom segment if any (not global position)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.position = { ...newPosition };
      this.renderZoomSegments();
      this.saveZoomData();

      // Also update left sidebar segment
      // (This is handled by the renderZoomSegments method)

      (`Updated position for segment ${this.selectedZoomSegment.id}:`, newPosition);
    } else {
      // Update default position for new segments
      this.zoomPosition = { ...newPosition };
      ('Updated default zoom position:', newPosition);
    }
  }

  updateZoomMode(mode) {
    // Update ONLY the selected zoom segment if any (not global mode)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.mode = mode;
      this.renderZoomSegments();
      this.saveZoomData();
      (`Updated mode for segment ${this.selectedZoomSegment.id}:`, mode);
    } else {
      // Update default mode for new segments
      this.zoomMode = mode;
      ('Updated default zoom mode:', mode);

      // === SCREEN STUDIO MATCH === When switching to Auto mode, regenerate segments
      if (mode === 'auto') {
        this.handleAutoZoomButtonClick();
      }
    }

    // Show/hide manual controls based on current segment or default mode
    const currentMode = this.selectedZoomSegment ? this.selectedZoomSegment.mode : this.zoomMode;

    ('=== UPDATE ZOOM MODE ===');
    ('Current mode:', currentMode);
    ('Selected segment:', this.selectedZoomSegment ? this.selectedZoomSegment.id : 'none');
    ('Default zoom mode:', this.zoomMode);

    // Update manual zoom controls (left sidebar)
    if (this.manualZoomControls) {
      const shouldShow = currentMode === 'manual';
      ('Left manual controls - should show:', shouldShow);
      ('Left manual controls element:', this.manualZoomControls);
      this.manualZoomControls.style.display = shouldShow ? 'block' : 'none';
      ('Left manual controls display set to:', this.manualZoomControls.style.display);
    } else {
      ('Left manual zoom controls not found');
    }

    // Update manual zoom controls (right sidebar) 
    if (this.manualZoomControlsRight) {
      const shouldShow = currentMode === 'manual';
      ('Right manual controls - should show:', shouldShow);
      ('Right manual controls element:', this.manualZoomControlsRight);
      this.manualZoomControlsRight.style.display = shouldShow ? 'block' : 'none';
      ('Right manual controls display set to:', this.manualZoomControlsRight.style.display);
    } else {
      ('Right manual zoom controls not found');
    }

    ('=== END UPDATE ZOOM MODE ===');
  }

  handleZoomPositionClick(event) {
    const rect = this.zoomPositionPreview.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const newPosition = {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y))
    };

    // Update position indicator
    if (this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${newPosition.x * 100}%`;
      this.zoomPositionIndicator.style.top = `${newPosition.y * 100}%`;
    }

    // Update ONLY the selected zoom segment if any (not global position)
    if (this.selectedZoomSegment) {
      this.selectedZoomSegment.position = { ...newPosition };
      this.renderZoomSegments();
      this.saveZoomData();
      (`Updated position for segment ${this.selectedZoomSegment.id}:`, newPosition);
    } else {
      // Update default position for new segments
      this.zoomPosition = { ...newPosition };
      ('Updated default zoom position:', newPosition);
    }
  }

  renderZoomSegments() {
    ('=== RENDER ZOOM SEGMENTS START ===');
    ('Zoom track exists:', !!this.zoomTrack);
    ('Video duration:', this.videoDuration);
    ('Zoom segments to render:', this.zoomSegments.length);

    if (!this.zoomTrack || !this.videoDuration) {
      ('Cannot render zoom segments - missing track or duration');
      return;
    }

    // Clear existing segments
    const existingSegments = this.zoomTrack.querySelectorAll('.zoom-segment');
    ('Clearing existing segments:', existingSegments.length);
    existingSegments.forEach(segment => segment.remove());

    // Render each zoom segment
    this.zoomSegments.forEach((segment, index) => {
      (`Rendering segment ${index}:`, segment);
      const segmentElement = this.createZoomSegmentElement(segment);
      this.zoomTrack.appendChild(segmentElement);
    });

    ('=== RENDER ZOOM SEGMENTS END ===');
  }

  createZoomSegmentElement(segment) {
    const element = document.createElement('div');
    element.className = 'zoom-segment';
    element.dataset.segmentId = segment.id;

    const startPercent = (segment.startTime / this.videoDuration) * 100;
    const widthPercent = ((segment.endTime - segment.startTime) / this.videoDuration) * 100;

    element.style.left = `${startPercent}%`;
    element.style.width = `${widthPercent}%`;

    // Display the actual intensity value on the segment (minimum 1.25 for visible zoom)
    const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
    element.innerHTML = `
      <div class="zoom-handle left"></div>
      <div class="zoom-label">${segmentIntensity.toFixed(1)}x</div>
      <div class="zoom-delete" title="Delete zoom segment">×</div>
      <div class="zoom-handle right"></div>
    `;

    // Add event listeners
    element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectZoomSegment(segment);
    });

    // Delete button event listener
    const deleteBtn = element.querySelector('.zoom-delete');
    deleteBtn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.deleteZoomSegment(segment.id);
    });

    const leftHandle = element.querySelector('.zoom-handle.left');
    const rightHandle = element.querySelector('.zoom-handle.right');

    leftHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startZoomDrag(segment, 'left', e);
    });

    rightHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.startZoomDrag(segment, 'right', e);
    });

    // Log the segment creation for debugging
    (`Zoom segment element created: ${segmentIntensity.toFixed(1)}x intensity`);

    return element;
  }

  selectZoomSegment(segment) {
    ('=== SELECT ZOOM SEGMENT START ===');
    ('Selecting segment:', segment.id);

    // Clear previous selection
    if (this.zoomTrack) {
      const prevSelected = this.zoomTrack.querySelector('.zoom-segment.selected');
      if (prevSelected) {
        prevSelected.classList.remove('selected');
      }
    } else {
      ('Zoom track not found during segment selection');
    }

    // Select new segment
    this.selectedZoomSegment = segment;
    if (this.zoomTrack) {
      const segmentElement = this.zoomTrack.querySelector(`[data-segment-id="${segment.id}"]`);
      if (segmentElement) {
        segmentElement.classList.add('selected');
        ('Segment element marked as selected');
      } else {
        ('Segment element not found in DOM');
      }
    }

    // Update zoom panel UI for both left and right sidebars
    try {
      ('About to update zoom panel for segment');
      this.updateZoomPanelForSegment(segment);
      ('Zoom panel updated successfully');
    } catch (error) {
      ('Error updating zoom panel:', error);
    }

    ('=== SELECT ZOOM SEGMENT END ===');
    this.updateZoomPanelForSegmentRight(segment);

    ('Selected zoom segment:', segment);
  }

  updateZoomPanelForSegment(segment) {
    // Hide empty message and show editing controls (left sidebar)
    if (this.noZoomMessage) {
      this.noZoomMessage.style.display = 'none';
    }
    if (this.zoomEditingControls) {
      this.zoomEditingControls.style.display = 'block';
    }

    // Update zoom info (left sidebar)
    if (this.zoomTiming) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTiming.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Temporarily remove event listeners to prevent triggering updates
    const originalIntensityHandler = this.zoomIntensitySlider?.oninput;
    const originalModeHandlers = [];

    // Store original mode handlers
    this.zoomModeRadios.forEach((radio, index) => {
      originalModeHandlers[index] = radio.onchange;
      radio.onchange = null;
    });

    // Update controls with segment data WITHOUT triggering events (left sidebar)
    if (this.zoomIntensitySlider) {
      this.zoomIntensitySlider.oninput = null;
      // Ensure we use the segment's actual intensity value (minimum 1.25 for visible zoom)
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySlider.value = segmentIntensity;
    }
    if (this.zoomIntensityValue) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValue.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update zoom mode radio buttons WITHOUT triggering events (left sidebar)
    this.zoomModeRadios.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update manual position if applicable (left sidebar)
    if (segment.mode === 'manual' && this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicator.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide manual controls based on segment mode (left sidebar)
    if (this.manualZoomControls) {
      this.manualZoomControls.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // ALSO UPDATE RIGHT SIDEBAR CONTROLS
    // Update right sidebar zoom info
    if (this.zoomTimingRight) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTimingRight.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Update right sidebar controls with segment data WITHOUT triggering events
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.oninput = null;
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySliderRight.value = segmentIntensity;
    }
    if (this.zoomIntensityValueRight) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValueRight.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update right sidebar zoom mode radio buttons
    this.zoomModeRadiosRight.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update right sidebar manual position if applicable
    if (segment.mode === 'manual' && this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide right sidebar manual controls
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // Restore event listeners after a brief delay
    setTimeout(() => {
      if (this.zoomIntensitySlider) {
        this.zoomIntensitySlider.oninput = originalIntensityHandler;
      }
      this.zoomModeRadios.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });

      // Restore right sidebar event listeners
      if (this.zoomIntensitySliderRight) {
        this.zoomIntensitySliderRight.oninput = this.zoomIntensitySliderRight.oninput;
      }
      this.zoomModeRadiosRight.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });
    }, 10);

    // Update zoom position preview with video frame at segment start time
    this.updateZoomPositionPreviewWithFrame(segment);

    ('Updated zoom panel for segment:', segment.id);
  }

  // Capture and display video frame at segment start time in zoom position preview
  updateZoomPositionPreviewWithFrame(segment) {
    if (!this.previewVideo || !this.previewVideo.src || !segment) return;

    const targetTime = segment.startTime;
    const video = this.previewVideo;

    // Create a temporary canvas to capture the frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate scaled dimensions for preview thumbnail (max 320px width)
    const maxPreviewWidth = 320;
    const videoWidth = video.videoWidth || 1920;
    const videoHeight = video.videoHeight || 1080;
    const scaleFactor = Math.min(1, maxPreviewWidth / videoWidth);

    canvas.width = videoWidth * scaleFactor;
    canvas.height = videoHeight * scaleFactor;

    // Store current video time
    const currentTime = video.currentTime;

    // Seek to segment start time
    const captureFrame = () => {
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to data URL
      try {
        const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Update both position preview elements (left and right sidebars)
        if (this.zoomPositionPreview) {
          this.zoomPositionPreview.style.backgroundImage = `url(${frameDataUrl})`;
          this.zoomPositionPreview.classList.add('has-video-frame');
        }
        if (this.zoomPositionPreviewRight) {
          this.zoomPositionPreviewRight.style.backgroundImage = `url(${frameDataUrl})`;
          this.zoomPositionPreviewRight.classList.add('has-video-frame');
        }

        ('Updated zoom position preview with frame at time:', targetTime);

        // Update aspect ratio based on segment's screen dimensions
        if (segment.screenDimensions) {
          const { width, height } = segment.screenDimensions;
          const aspectRatio = width / height;

          if (this.zoomPositionPreview) {
            this.zoomPositionPreview.style.aspectRatio = `${width} / ${height}`;
          }
          if (this.zoomPositionPreviewRight) {
            this.zoomPositionPreviewRight.style.aspectRatio = `${width} / ${height}`;
          }

          ('Updated zoom preview aspect ratio to match screen:', width, 'x', height, 'ratio:', aspectRatio);
        }
      } catch (e) {
        console.error('Error capturing video frame:', e);
      }

      // Restore original video time
      video.currentTime = currentTime;
    };

    // Set up one-time seeked event listener
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      // Small delay to ensure frame is ready
      setTimeout(captureFrame, 50);
    };

    video.addEventListener('seeked', onSeeked);

    // Seek to target time
    video.currentTime = targetTime;
  }

  updateZoomPanelForSegmentRight(segment) {
    // Switch to zoom controls panel when a segment is selected
    this.showZoomControlsPanel();

    // Hide empty message and show editing controls
    if (this.noZoomMessageRight) {
      this.noZoomMessageRight.style.display = "none";
    }
    if (this.zoomEditingControlsRight) {
      this.zoomEditingControlsRight.style.display = "block";
    }

    // Update zoom info
    if (this.zoomTimingRight) {
      const duration = segment.endTime - segment.startTime;
      this.zoomTimingRight.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)} (${duration.toFixed(1)}s)`;
    }

    // Temporarily remove event listeners to prevent triggering updates
    const originalIntensityHandler = this.zoomIntensitySliderRight?.oninput;
    const originalModeHandlers = [];

    // Store original mode handlers
    this.zoomModeRadiosRight.forEach((radio, index) => {
      originalModeHandlers[index] = radio.onchange;
      radio.onchange = null;
    });

    // Update controls with segment data WITHOUT triggering events
    if (this.zoomIntensitySliderRight) {
      this.zoomIntensitySliderRight.oninput = null;
      // Ensure we use the segment's actual intensity value (minimum 1.25 for visible zoom)
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensitySliderRight.value = segmentIntensity;
    }
    if (this.zoomIntensityValueRight) {
      const segmentIntensity = segment.intensity && segment.intensity >= 1.25 ? segment.intensity : 1.5;
      this.zoomIntensityValueRight.textContent = `${segmentIntensity.toFixed(1)}x`;
    }

    // Update zoom mode radio buttons WITHOUT triggering events
    this.zoomModeRadiosRight.forEach(radio => {
      radio.checked = radio.value === segment.mode;
    });

    // Update manual position if applicable
    if (segment.mode === 'manual' && this.zoomPositionIndicatorRight) {
      this.zoomPositionIndicatorRight.style.left = `${(segment.position?.x || 0.5) * 100}%`;
      this.zoomPositionIndicatorRight.style.top = `${(segment.position?.y || 0.5) * 100}%`;
    }

    // Show/hide manual controls based on segment mode
    if (this.manualZoomControlsRight) {
      this.manualZoomControlsRight.style.display = segment.mode === 'manual' ? 'block' : 'none';
    }

    // Restore event listeners after a brief delay
    setTimeout(() => {
      if (this.zoomIntensitySliderRight) {
        this.zoomIntensitySliderRight.oninput = originalIntensityHandler;
      }
      this.zoomModeRadiosRight.forEach((radio, index) => {
        radio.onchange = originalModeHandlers[index];
      });
    }, 10);

    ('Updated right sidebar zoom panel for segment:', segment.id);
  }

  showNoZoomMessageRight() {
    // Show empty message and hide editing controls
    if (this.noZoomMessageRight) {
      this.noZoomMessageRight.style.display = 'block';
    }
    if (this.zoomEditingControlsRight) {
      this.zoomEditingControlsRight.style.display = 'none';
    }

    // Switch back to export & advanced panel
    this.showExportAdvancedPanel();

    ('Showing no zoom message in right sidebar');
  }
  showNoZoomMessage() {
    // Show empty message and hide editing controls
    if (this.noZoomMessage) {
      this.noZoomMessage.style.display = 'block';
    }
    if (this.zoomEditingControls) {
      this.zoomEditingControls.style.display = 'none';
    }

    // Clear selection
    this.selectedZoomSegment = null;
    const prevSelected = this.zoomTrack?.querySelector('.zoom-segment.selected');
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }

    // Also show no zoom message in right sidebar
    this.showNoZoomMessageRight();
  }

  startZoomDrag(segment, handle, event) {
    this.isDraggingZoom = true;
    this.zoomDragHandle = handle;
    this.selectedZoomSegment = segment;

    const trackRect = this.zoomTrack.getBoundingClientRect();

    const handleMouseMove = (e) => {
      if (!this.isDraggingZoom) return;

      const mouseX = e.clientX - trackRect.left;
      const percentage = Math.max(0, Math.min(1, mouseX / trackRect.width));
      const time = percentage * this.videoDuration;

      if (handle === 'left') {
        segment.startTime = Math.max(0, Math.min(time, segment.endTime - 0.1));
      } else {
        segment.endTime = Math.max(segment.startTime + 0.1, Math.min(time, this.videoDuration));
      }

      this.renderZoomSegments();
      this.selectZoomSegment(segment);
    };

    const handleMouseUp = () => {
      this.isDraggingZoom = false;
      this.zoomDragHandle = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    event.preventDefault();
  }

  deleteZoomSegment(segment) {
    const index = this.zoomSegments.findIndex(s => s.id === segment.id);
    if (index !== -1) {
      this.zoomSegments.splice(index, 1);
      this.selectedZoomSegment = null;
      this.renderZoomSegments();
      // Show no zoom message in both sidebars
      this.showNoZoomMessage();
      // Update clear button state after deletion
      this.updateClearButtonState();
      ('Deleted zoom segment:', segment.id);
    }
  }

  getZoomSegmentAtTime(time) {
    // Find the zoom segment that contains this time
    const segment = this.zoomSegments.find(segment =>
      time >= segment.startTime && time <= segment.endTime
    );

    // Log for debugging - only occasionally to avoid spam
    if (this.isExportMode) {
      // Only log every 0.5 seconds approximately
      if (Math.random() < 0.02) {
        if (segment) {
          console.log('🔍 [ZOOM] At time', time.toFixed(2), 's:', {
            id: segment.id,
            intensity: segment.intensity,
            position: segment.position
          });
        }
      }
    }

    return segment;
  }

  getZoomSegmentWithTransitionAtTime(time) {
    // Add transition buffer for smooth zoom in/out
    const transitionBuffer = this.zoomTransitionDuration || 0.5; // Default 0.5s transition

    // Find segments that include transition zones
    const segment = this.zoomSegments.find(segment => {
      const bufferStart = Math.max(0, segment.startTime - transitionBuffer);
      const bufferEnd = Math.min(this.videoDuration || Infinity, segment.endTime + transitionBuffer);
      const isInBuffer = time >= bufferStart && time <= bufferEnd;

      // Log for debugging
      if (isInBuffer) {
        (`Found zoom segment with transition at time ${time.toFixed(2)}s:`, {
          id: segment.id,
          startTime: segment.startTime,
          endTime: segment.endTime,
          bufferStart: bufferStart,
          bufferEnd: bufferEnd,
          intensity: segment.intensity
        });
      }

      return isInBuffer;
    });

    return segment;
  }

  saveZoomData() {
    const zoomData = {
      mode: this.zoomMode,
      intensity: this.zoomIntensity,
      position: this.zoomPosition,
      segments: this.zoomSegments
    };

    localStorage.setItem('screensmooth-zoom-data', JSON.stringify(zoomData));
    ('Zoom data saved:', zoomData);
  }

  // Load zoom data from localStorage (but don't auto-load on page refresh)
  loadZoomData() {
    // Don't auto-load zoom data - user should start fresh
    // This method is kept for potential future use
    ('Zoom data auto-loading disabled - starting with clean state');
  }

  updateZoomModeUI() {
    if (this.zoomModeRadios && this.zoomModeRadios.length > 0) {
      this.zoomModeRadios.forEach(radio => {
        if (radio) {
          radio.checked = radio.value === this.zoomMode;
        }
      });
    }
    this.updateZoomMode(this.zoomMode);
  }

  updateZoomIntensityUI() {
    // Ensure we have a valid zoom intensity value (minimum 1.25 for visible zoom)
    const validIntensity = this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5;

    // Ensure intensity is within valid range
    const clampedIntensity = Math.max(1.25, Math.min(4, validIntensity));

    if (this.zoomIntensitySlider) {
      this.zoomIntensitySlider.value = clampedIntensity;
    }
    if (this.zoomIntensityValue) {
      this.zoomIntensityValue.textContent = `${clampedIntensity.toFixed(1)}x`;
    }
  }

  updateZoomPositionUI() {
    if (this.zoomPositionIndicator) {
      this.zoomPositionIndicator.style.left = `${this.zoomPosition.x * 100}%`;
      this.zoomPositionIndicator.style.top = `${this.zoomPosition.y * 100}%`;
    }
  }

  needsProcessing() {
    const needsProcessing = (
      this.currentPadding > 0 ||
      this.currentBackground !== "#000000" ||
      this.currentBorderRadius > 0 ||
      this.currentBlur > 0 ||
      this.currentBrightness !== 1 ||
      this.currentContrast !== 1 ||
      this.currentSaturation !== 1 ||
      this.currentAspectRatio !== "native" ||
      this.trimStart > 0 ||
      this.trimEnd < this.videoDuration
    );

    return needsProcessing;
  }

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

      console.log('🎯 Injecting cursor script into tab:', tab.id);

      const injectionCheck = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => !!window.screenSmoothContent
      });

      if (injectionCheck?.[0]?.result) {
        console.log('✅ Cursor/content script already available in tab');
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content.js']
      });

      console.log('✅ Cursor script injected successfully');
    } catch (error) {
      console.error('❌ Failed to inject cursor script:', error);
    }
  }

  // Remove cursor script from the recorded tab
  async removeCursorScript() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        return;
      }

      console.log('🧹 Removing cursor script from tab:', tab.id);

      // Send cleanup message to content script
      await chrome.tabs.sendMessage(tab.id, { action: 'cleanup-cursor' });

      console.log('✅ Cursor script removed successfully');
    } catch (error) {
      console.warn('Failed to remove cursor script:', error);
    }
  }

  // === SCREEN STUDIO CURSOR PREMIUM === Fully spring-driven cursor update
  // Uses createSpring() channels for X, Y, scale, and rotation — same system as zoom
  // Click scale: 70% snap on mousedown, bouncy spring-back on mouseup (T:420, F:18)
  // Velocity rotation: ±12° tilt based on horizontal velocity, springs to 0° when stopped
  updateSmoothCursor(targetX, targetY, isPressed, state = null, dt = 1/60) {
    // Determine which state to update (custom state or this instance)
    const s = state || this;

    // === SCREEN STUDIO MATCH === Clamp dt to avoid explosion after tab-switch
    dt = Math.min(dt, 0.064);

    // Ensure cursor spring channels exist (lazy init, same pattern as zoom)
    const springs = this.ensureCursorSprings(s);

    // ─── POSITION: Step X and Y springs toward raw cursor target ───
    springs.x.update(targetX, dt);
    springs.y.update(targetY, dt);
    s.smoothCursor.x = springs.x.position;
    s.smoothCursor.y = springs.y.position;
    s.cursorVelocity.x = springs.x.velocity;
    s.cursorVelocity.y = springs.y.velocity;

    // ─── CLICK SCALE ANIMATION (Screen Studio Premium) ───
    // === SCREEN STUDIO CURSOR PREMIUM ===
    // mousedown → instant snap to 70% (no spring, immediate)
    // mouseup   → spring back to 100% with bouncy overshoot (T:420 F:18)
    if (isPressed && !s.wasCursorPressed) {
      // Mousedown just happened → snap scale spring to 0.7 instantly
      springs.scale.position = 0.70;
      springs.scale.velocity = 0; // Kill any existing velocity
      springs.scale.target = 0.70;
    }
    // Target: 70% while pressed, 100% when released (spring handles the bounce)
    const scaleTarget = isPressed ? 0.70 : 1.0;
    springs.scale.update(scaleTarget, dt);
    s.cursorScale = springs.scale.position;

    // ─── VELOCITY-BASED ROTATION (Screen Studio Premium) ───
    // === SCREEN STUDIO CURSOR PREMIUM ===
    // Non-linear tilt: slow moves → barely any rotation, fast moves → full ±12°
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
        console.warn('⚠️ Cursor image not loaded yet, attempting to load...');
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
        s.cursorScale,    // Spring-driven click scale (0.7 → 1.0 with bounce)
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
    console.log('💾 [RECORD] storeCursorData called:', {
      hasEvent: !!cursorEvent,
      x: cursorEvent?.x,
      y: cursorEvent?.y,
      type: cursorEvent?.type,
      timestamp: cursorEvent?.timestamp
    });

    // Validate cursor event data
    if (!cursorEvent || typeof cursorEvent !== 'object') {
      console.warn('❌ [RECORD] Invalid cursor event data:', cursorEvent);
      return;
    }

    // Ensure cursorData array exists
    if (!this.cursorData) {
      this.cursorData = [];
      console.log('📦 [RECORD] Initialized cursorData array');
    }

    // Validate required fields
    if (typeof cursorEvent.x !== 'number' || typeof cursorEvent.y !== 'number') {
      console.warn('❌ [RECORD] Invalid cursor coordinates:', cursorEvent);
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
      console.log('📥 [DEBUG] First cursor data received:', {
        timestamp: cursorData.timestamp,
        recordingStart: this.recordingStartTimestamp,
        diff: cursorData.timestamp - (this.recordingStartTimestamp || 0)
      });
    }

    this.cursorData.push(cursorData);

    // 🔍 DIAGNOSTIC: Log first few cursor points with raw timestamps
    if (this.cursorData.length <= 3) {
      console.log(`✅ [RECORD] Cursor data stored #${this.cursorData.length}:`, {
        timestamp: cursorData.timestamp,
        x: cursorData.x,
        y: cursorData.y,
        recordingStartTimestamp: this.recordingStartTimestamp || 'NOT SET YET'
      });
    } else if (this.cursorData.length % 20 === 0) {
      console.log(`✅ [RECORD] Cursor data stored. Array length: ${this.cursorData.length}, latest timestamp: ${cursorData.timestamp}`);
    }

    // Debug logging for clicks to verify data flow
    if (cursorData.type === 'click') {
      console.log(`🖱️ CLICK EVENT RECEIVED:`, {
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

    // === SCREEN STUDIO MATCH === Click-only storage for post-recording segment generation
    // During recording: only store clicks in autoZoomClickEvents (no real-time zoom)
    if (this.zoomMode === 'auto' && this.isRecording && cursorData.type === 'click') {
      if (!this.autoZoomClickEvents) this.autoZoomClickEvents = [];
      this.autoZoomClickEvents.push({
        x: cursorData.x,
        y: cursorData.y,
        timestamp: cursorData.timestamp,
        viewportWidth: cursorData.viewportWidth,
        viewportHeight: cursorData.viewportHeight,
        screenWidth: cursorData.screenWidth,
        screenHeight: cursorData.screenHeight,
        scrollX: cursorData.scrollX,
        scrollY: cursorData.scrollY
      });
      console.log(`🎯 [AUTO-ZOOM] Stored click #${this.autoZoomClickEvents.length} for post-recording processing`);
    }

    // === SCREEN STUDIO MATCH === No 30-second cutoff — keep ALL cursor data for the entire recording
    console.log(`✅ [RECORD] Cursor data stored. Total entries: ${this.cursorData.length}`);
  }

  // === SCREEN STUDIO MATCH === Generate zoom segments from stored click events (post-recording)
  // Clustering: clicks within 3s AND <20% viewport apart → one segment, centered on LAST click
  // Timing: start = firstClickTime - 0.5s, end = lastClickTime + 1.8s
  generateAutoZoomSegments(clickEvents) {
    if (!clickEvents || clickEvents.length === 0) return [];

    console.log('🎯 [AUTO-ZOOM] === GENERATING SEGMENTS (Screen Studio Match) ===');
    console.log('🎯 [AUTO-ZOOM] Input clicks:', clickEvents.length);

    // Normalize click timestamps relative to recording start
    const recordingStart = this.recordingStartTimestamp || clickEvents[0].timestamp;
    const normalizedClicks = clickEvents.map(click => {
      const relativeTime = (click.timestamp - recordingStart) / 1000; // Convert to seconds
      const vw = click.viewportWidth || click.screenWidth || window.screen.width;
      const vh = click.viewportHeight || click.screenHeight || window.screen.height;
      const cx = click.x + (click.scrollX || 0);
      const cy = click.y + (click.scrollY || 0);
      return {
        time: Math.max(0, relativeTime),
        normalizedX: Math.max(0, Math.min(1, cx / vw)),
        normalizedY: Math.max(0, Math.min(1, cy / vh))
      };
    }).sort((a, b) => a.time - b.time);

    console.log('🎯 [AUTO-ZOOM] Normalized clicks:', normalizedClicks.map(c => ({
      time: c.time.toFixed(2) + 's',
      x: c.normalizedX.toFixed(3),
      y: c.normalizedY.toFixed(3)
    })));

    // === SCREEN STUDIO MATCH === Click clustering
    // Clicks within 3 seconds AND <20% of viewport apart → one cluster
    const clusters = [];
    let currentCluster = [normalizedClicks[0]];

    for (let i = 1; i < normalizedClicks.length; i++) {
      const click = normalizedClicks[i];
      const lastClick = currentCluster[currentCluster.length - 1];
      const timeDiff = click.time - lastClick.time;
      const distX = Math.abs(click.normalizedX - lastClick.normalizedX);
      const distY = Math.abs(click.normalizedY - lastClick.normalizedY);
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (timeDiff <= 3.0 && dist < 0.20) {
        // Same cluster
        currentCluster.push(click);
      } else {
        // New cluster
        clusters.push([...currentCluster]);
        currentCluster = [click];
      }
    }
    clusters.push(currentCluster); // Push final cluster

    console.log('🎯 [AUTO-ZOOM] Clusters formed:', clusters.length);

    // === SCREEN STUDIO MATCH === Generate segments from clusters
    const autoZoomIntensity = this.zoomIntensity && this.zoomIntensity >= 1.25 ? this.zoomIntensity : 1.5;
    const maxTime = this.videoDuration || Infinity;

    const segments = clusters.map((cluster, index) => {
      const firstClick = cluster[0];
      const lastClick = cluster[cluster.length - 1];

      // === SCREEN STUDIO MATCH === Center on LAST click in cluster
      const position = {
        x: lastClick.normalizedX,
        y: lastClick.normalizedY
      };

      // === SCREEN STUDIO MATCH === Timing:
      // start = firstClickTime - 0.5s (anticipation)
      // end = lastClickTime + 1.8s
      const startTime = Math.max(0, firstClick.time - 0.5);
      const endTime = Math.min(lastClick.time + 1.8, maxTime);

      const segment = {
        id: `auto-${Date.now()}-${index}`,
        startTime,
        endTime,
        intensity: autoZoomIntensity,
        position,
        mode: 'auto'
      };

      console.log(`🎯 [AUTO-ZOOM] Segment ${index}:`, {
        clicks: cluster.length,
        startTime: startTime.toFixed(2) + 's',
        endTime: endTime.toFixed(2) + 's',
        duration: (endTime - startTime).toFixed(2) + 's',
        center: `(${position.x.toFixed(3)}, ${position.y.toFixed(3)})`
      });

      return segment;
    });

    // Merge overlapping segments
    const merged = [];
    for (const seg of segments) {
      if (merged.length > 0 && seg.startTime <= merged[merged.length - 1].endTime) {
        // Overlapping — extend previous segment, keep the later segment's position (last click)
        const prev = merged[merged.length - 1];
        prev.endTime = Math.max(prev.endTime, seg.endTime);
        prev.position = seg.position; // Last click wins
      } else {
        merged.push({ ...seg });
      }
    }

    console.log('✅ [AUTO-ZOOM] Final segments after merge:', merged.length);
    return merged;
  }

  // === SCREEN STUDIO MATCH === Auto button handler — works even after playback/scrubbing
  handleAutoZoomButtonClick() {
    if (this.autoZoomClickEvents?.length) {
      console.log('🎯 [AUTO-ZOOM] Auto button clicked — regenerating segments from', this.autoZoomClickEvents.length, 'click events');
      this.zoomSegments = this.generateAutoZoomSegments(this.autoZoomClickEvents);
      this.renderZoomSegments();
      this.updateClearButtonState();
    } else {
      console.log('🎯 [AUTO-ZOOM] Auto button clicked but no click events stored');
    }
  }

  async convertToGif(videoBlob) {
    this.updateStatusText("Converting to GIF...");

    // Set timeout for GIF conversion (2 minutes max)
    const gifTimeout = setTimeout(() => {
      throw new Error("GIF conversion timed out after 2 minutes. Try a shorter video.");
    }, 2 * 60 * 1000);

    try {
      const inputFileName = "input.webm";
      const outputFileName = "output.gif";

      // Write input file
      await this.ffmpeg.writeFile(
        inputFileName,
        await this.fetchFile(videoBlob)
      );

      // Calculate duration for trimming
      const duration = Math.min(this.trimEnd - this.trimStart, 10); // Limit GIFs to 10 seconds max

      // Build optimized GIF conversion command
      const command = [
        "-i", inputFileName,
        "-ss", this.trimStart.toString(),
        "-t", duration.toString(),
        "-vf", "fps=10,scale=480:-1:flags=lanczos", // Reduced FPS and size for faster conversion
        "-c:v", "gif",
        "-loop", "0", // Infinite loop
        outputFileName
      ];

      // Apply compression level
      const compressionLevel = parseInt(this.compressionLevel.value) || 5;
      if (compressionLevel > 5) {
        command.splice(-1, 0, "-compression_level", compressionLevel.toString());
      }

      // Execute FFmpeg
      await this.ffmpeg.exec(command);

      // Read output file
      const outputData = await this.ffmpeg.readFile(outputFileName);

      // Clean up
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      // Create blob from output
      const gifBlob = new Blob([outputData.buffer], { type: "image/gif" });

      clearTimeout(gifTimeout);
      return gifBlob;
    } catch (error) {
      clearTimeout(gifTimeout);
      throw error;
    }
  }

  async processVideoWithFFmpeg(inputBlob = null) {
    if (!this.ffmpeg || !this.isFFmpegLoaded) {
      throw new Error("FFmpeg not available. Video processing engine failed to load. Please try downloading the video without format conversion.");
    }

    // Set timeout for FFmpeg processing (3 minutes max)
    const ffmpegTimeout = setTimeout(() => {
      throw new Error("FFmpeg processing timed out after 3 minutes. Try a shorter video or simpler settings.");
    }, 3 * 60 * 1000);

    try {
      // Use provided blob or fall back to original recording
      let videoBlob = inputBlob || this.recordingBlob;

      // Handle GIF conversion specially
      if (this.formatSelect.value === "gif") {
        const result = await this.convertToGif(videoBlob);
        clearTimeout(ffmpegTimeout);
        return result;
      }

      // Write input file
      const inputFileName = "input.webm";
      const outputFileName = `output.${this.formatSelect.value}`;

      await this.ffmpeg.writeFile(
        inputFileName,
        await this.fetchFile(videoBlob)
      );

      // Build FFmpeg command for format conversion and trimming
      const command = this.buildFFmpegCommand(inputFileName, outputFileName);

      // DIAGNOSTIC: Log the full FFmpeg command
      console.log('🎬 [FFmpeg] Full command:', command.join(' '));

      // Set up progress logging - capture ALL ffmpeg output for diagnostics
      this.ffmpeg.on('log', ({ message }) => {
        // Log all FFmpeg messages for debugging
        console.log('🎬 [FFmpeg log]:', message);

        if (message.includes('time=')) {
          // Extract time progress from FFmpeg log
          const timeMatch = message.match(/time=(\d+:\d+:\d+)/);
          if (timeMatch) {
            this.updateStatusText(`Converting video... (${timeMatch[1]})`);
          }
        }

        // DIAGNOSTIC: Capture duration info from FFmpeg
        if (message.includes('Duration:')) {
          console.log('🎬 [FFmpeg] INPUT DURATION DETECTED:', message);
        }
      });

      // Execute FFmpeg
      await this.ffmpeg.exec(command);

      // Read output file
      const outputData = await this.ffmpeg.readFile(outputFileName);

      // Clean up
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      // Create blob from output
      const mimeType =
        this.formatSelect.value === "mp4" ? "video/mp4" : "video/webm";
      const processedBlob = new Blob([outputData.buffer], { type: mimeType });

      clearTimeout(ffmpegTimeout);
      return processedBlob;
    } catch (error) {
      clearTimeout(ffmpegTimeout);
      throw error;
    }
  }

  buildFFmpegCommand(inputFile, outputFile) {
    // DIAGNOSTIC: Log video duration and trim values
    console.log('🎬 [FFmpeg] Building command with:');
    console.log('   - videoDuration:', this.videoDuration);
    console.log('   - trimStart:', this.trimStart);
    console.log('   - trimEnd:', this.trimEnd);
    console.log('   - lastExportDuration:', this.lastExportDuration);
    console.log('   - format:', this.formatSelect.value);

    // FIX: Calculate the ACTUAL duration to use
    // Priority: 1) lastExportDuration (from canvas composition), 2) trimEnd-trimStart, 3) recorded time
    let outputDuration = null;

    // First try: use the stored export duration from canvas composition
    if (this.lastExportDuration && Number.isFinite(this.lastExportDuration) && this.lastExportDuration > 0) {
      outputDuration = this.lastExportDuration;
      console.log('🎬 [FFmpeg] Using lastExportDuration:', outputDuration);
    }
    // Second try: calculate from trim values if they're valid
    else if (Number.isFinite(this.trimEnd) && Number.isFinite(this.trimStart) && this.trimEnd > this.trimStart) {
      outputDuration = this.trimEnd - this.trimStart;
      console.log('🎬 [FFmpeg] Using trimEnd-trimStart:', outputDuration);
    }
    // Third try: use videoDuration if valid
    else if (Number.isFinite(this.videoDuration) && this.videoDuration > 0) {
      outputDuration = this.videoDuration - (this.trimStart || 0);
      console.log('🎬 [FFmpeg] Using videoDuration:', outputDuration);
    }
    // Last resort: use recorded duration from timer
    else {
      outputDuration = this.getRecordedDuration();
      console.log('🎬 [FFmpeg] Using getRecordedDuration() fallback:', outputDuration);
    }

    // Final validation - ensure we have a reasonable duration
    if (!outputDuration || !Number.isFinite(outputDuration) || outputDuration <= 0) {
      outputDuration = 10; // Absolute minimum fallback
      console.log('🎬 [FFmpeg] WARNING: All duration methods failed, using fallback:', outputDuration);
    }

    console.log('🎬 [FFmpeg] Final output duration:', outputDuration);

    // FIX FOR X/TWITTER: Input flags MUST come BEFORE -i to fix corrupted WebM timestamps
    // The WebM from MediaRecorder often has broken duration metadata (causing "241 minutes" error)
    const command = [
      // Input analysis flags - handle corrupted WebM timestamps
      "-fflags", "+genpts+igndts+discardcorrupt",  // Regenerate PTS, ignore DTS, discard corrupt
      "-i", inputFile,
      // CRITICAL FIX: Strip ALL source metadata to prevent corrupted duration propagation
      // Without this, the broken WebM duration (Infinity/241 min) bleeds into MP4
      "-map_metadata", "-1"
    ];

    // Trimming - seek to start position if needed
    if (this.trimStart > 0) {
      command.push("-ss", this.trimStart.toString());
    }

    // FIX: ALWAYS add explicit duration to fix the X/Twitter "241 minutes" bug
    // This is critical because WebM from MediaRecorder has corrupted duration metadata
    command.push("-t", outputDuration.toFixed(3));
    console.log('🎬 [FFmpeg] Added explicit duration -t:', outputDuration.toFixed(3));

    // Since visual effects are now handled by canvas composition,
    // this method focuses on format conversion and trimming only
    // with optimized settings for speed

    // Output settings based on format - optimized for speed
    if (this.formatSelect.value === "mp4") {
      command.push("-c:v", "libx264");
      command.push("-preset", "superfast");
      // Use baseline profile for maximum compatibility (X/Twitter, older devices)
      command.push("-profile:v", "baseline");
      command.push("-level", "3.1");

      // FIX: Force Constant Frame Rate - ensures clean timestamp regeneration
      command.push("-vsync", "cfr");
      command.push("-r", "30");

      // FIX: Set explicit video timescale for proper duration calculation
      // This ensures the moov atom has correct timing info
      command.push("-video_track_timescale", "30000");

      // FIX: Add standard web video color metadata (bt709)
      command.push("-colorspace", "bt709");
      command.push("-color_primaries", "bt709");
      command.push("-color_trc", "bt709");
      command.push("-color_range", "tv");

      // Ensure even dimensions (required for yuv420p compatibility)
      // Also add fps=30 in video filter to ensure frame rate consistency
      command.push("-vf", "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2");

      // Simplified CRF calculation
      const baseCRF = this.qualitySelect.value === "high" ? 23 :
        this.qualitySelect.value === "medium" ? 28 : 32;

      command.push("-crf", baseCRF.toString());
      command.push("-pix_fmt", "yuv420p");

      // FIX: Critical movflags for X/Twitter compatibility
      // - faststart: moves moov atom to start for streaming
      // - write_colr: writes color info
      // - use_metadata_tags: ensures duration is written properly
      command.push("-movflags", "+faststart+write_colr+use_metadata_tags");
    } else {
      command.push("-c:v", "libvpx-vp9");

      // Simplified CRF for WebM
      const baseCRF = this.qualitySelect.value === "high" ? 32 :
        this.qualitySelect.value === "medium" ? 38 : 44;

      command.push("-crf", baseCRF.toString());
      command.push("-speed", "8"); // Fast encoding for VP9
      command.push("-tile-columns", "6");
      command.push("-frame-parallel", "1");
    }

    // Audio - simplified
    if (this.systemAudio) {
      command.push(
        "-c:a",
        this.formatSelect.value === "mp4" ? "aac" : "libopus"
      );
      command.push("-b:a", "128k"); // Fixed audio bitrate for consistency

      // Force stereo and standard sample rate for better compatibility
      if (this.formatSelect.value === "mp4") {
        command.push("-ac", "2");
        command.push("-ar", "44100");
      }
    } else {
      command.push("-an"); // No audio
    }

    // Add global options for faster processing
    command.push("-threads", "0"); // Use all available threads
    command.push("-avoid_negative_ts", "make_zero");

    command.push(outputFile);

    // Log full command for debugging
    console.log('🎬 [FFmpeg] Full command:', command.join(' '));

    return command;
  }

  generateFileName() {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const format = this.formatSelect.value;
    return `screensmooth-recording-${timestamp}.${format}`;
  }

  shareRecording() {
    if (!this.recordingBlob) {
      this.showError("No recording available to share");
      return;
    }

    if (navigator.share) {
      const file = new File([this.recordingBlob], this.generateFileName(), {
        type: this.recordingBlob.type,
      });

      navigator
        .share({
          title: "ScreenSmooth Recording",
          text: "Check out my screen recording made with ScreenSmooth!",
          files: [file],
        })
        .catch((error) => {
          ("Error sharing:", error);
          this.fallbackShare();
        });
    } else {
      this.fallbackShare();
    }
  }

  fallbackShare() {
    // Copy download link to clipboard or show share options
    const url = URL.createObjectURL(this.recordingBlob);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showSuccess("Recording link copied to clipboard!");
      });
    } else {
      this.showInfo(
        "Use the download button to save your recording and share it manually."
      );
    }
  }

  recordAgain() {
    // Clear all zoom data when recording again
    this.clearAllZoomData();

    // Cleanup before resetting
    this.cleanup();

    // Reset state
    this.recordingBlob = null;
    this.recordedChunks = [];
    this.videoDuration = 0;
    this.trimStart = 0;
    this.trimEnd = 0;
    this.currentTime = 0;
    this.isPlaying = false;
    this.startTime = null;
    this.pausedTime = 0;
    this.pauseStartTime = 0;

    // Clear video
    this.previewVideo.src = "";

    // Reset visual editing controls
    this.videoPadding.value = 8;
    this.videoBlur.value = 0;
    this.videoBorderRadius.value = 12;
    this.updateVideoPreview();

    // Reset screen effects
    if (this.screenBrightness) this.screenBrightness.value = 1;
    if (this.screenContrast) this.screenContrast.value = 1;
    if (this.screenSaturation) this.screenSaturation.value = 1;
    this.updateScreenEffects();

    // Clear status text
    this.updateStatusText("");

    // Show recording setup
    this.showRecordingSetup();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isRecording && !this.isPaused && this.startTime) {
        const elapsed = Date.now() - this.startTime - this.pausedTime;
        this.recordingTimer.textContent = this.formatTime(elapsed / 1000);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "00:00:00";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  updateFileInfo() {
    if (!this.recordingBlob) {
      return;
    }

    // Update file size
    const sizeInMB = (this.recordingBlob.size / (1024 * 1024)).toFixed(2);
    this.fileSize.textContent = `${sizeInMB} MB`;

    // Update file name
    this.fileName.textContent = this.generateFileName();
  }

  showRecordingSetup() {
    this.recordingSetup.style.display = "block";
    this.recordingControls.style.display = "none";

    // Remove has-recording class to hide the editor
    if (this.previewEditor) {
      this.previewEditor.classList.remove("has-recording");
    }

    // Hide panels container
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "none";
    }

    // Restore main-content visibility and add no-recording class for full-page setup UI
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.display = '';  // Restore default display
      mainContent.classList.add('no-recording');
    }
  }

  showRecordingControls() {
    this.recordingSetup.style.display = "none";
    this.recordingControls.style.display = "block";

    // Remove has-recording class to hide the editor
    if (this.previewEditor) {
      this.previewEditor.classList.remove("has-recording");
    }

    // Hide panels container
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "none";
    }

    // Restore main-content visibility and add no-recording class (still in recording phase)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.style.display = '';  // Restore default display
      mainContent.classList.add('no-recording');
    }
  }

  showPreviewEditor() {
    this.recordingSetup.style.display = "none";
    this.recordingControls.style.display = "none";

    // Add has-recording class to show the editor
    if (this.previewEditor) {
      this.previewEditor.classList.add("has-recording");
    }

    // Show panels container
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "flex";
    }

    // CRITICAL FIX: Hide the main-content element completely when showing editor
    // This prevents the recording setup area from taking up viewport space
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.classList.remove('no-recording');
      mainContent.style.display = 'none';  // Force hide with display:none
    }
  }

  hideEditor() {
    // Hide the preview editor and panels container
    if (this.previewEditor) {
      this.previewEditor.classList.remove("has-recording");
    }
    if (this.editorPanelsContainer) {
      this.editorPanelsContainer.style.display = "none";
    }
  }

  resetRecordingButton() {
    this.startRecordingBtn.disabled = false;
    this.startRecordingBtn.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
            </svg>
            Start Recording
        `;
  }

  async notifyContentScript(action, data = {}) {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]) {
        await chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
      }
    } catch (error) {
      ("Could not notify content script:", error.message);
    }
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showInfo(message) {
    this.showNotification(message, "info");
  }

  showPaymentReminder(contentHtml) {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('payment-reminder-overlay');
    if (existing?.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    const overlay = document.createElement('div');
    overlay.id = 'payment-reminder-overlay';
    overlay.className = 'payment-reminder-overlay visible';
    overlay.innerHTML = `
      <div class="payment-reminder-overlay__card">
        <button class="payment-reminder__close" aria-label="Close reminder">×</button>
        <div class="payment-reminder-overlay__content"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.classList.remove('visible');
      }
    });

    const closeButton = overlay.querySelector('.payment-reminder__close');
    closeButton?.addEventListener('click', () => overlay.classList.remove('visible'));

    const contentContainer = overlay.querySelector('.payment-reminder-overlay__content');
    if (contentContainer) {
      contentContainer.innerHTML = contentHtml;
    }

    const ctaButton = overlay.querySelector('#payment-reminder-cta');
    if (ctaButton) {
      ctaButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const checkoutUrl = 'https://screensmooth.lemonsqueezy.com/buy/f27c49be-d583-4f27-a733-5de61a44f8d8';
        try {
          if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
            await chrome.tabs.create({ url: checkoutUrl, active: true });
          } else {
            window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
          }
        } catch (checkoutError) {
          ('⚠️ Unable to reopen checkout tab:', checkoutError);
          window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        }
      });
    }

    ('💡 Payment reminder overlay rendered');
  }
  showExportAdvancedPanel() {
    // Hide zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "none";
    }

    // Show export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "block";
    }

    ("Switched to Export & Advanced panel in right sidebar");
  }

  showZoomControlsPanel() {
    // Hide export & advanced panel
    if (this.exportAdvancedPanel) {
      this.exportAdvancedPanel.style.display = "none";
    }

    // Show zoom controls panel
    if (this.zoomControlsPanel) {
      this.zoomControlsPanel.style.display = "block";
    }

    ("Switched to Zoom Controls panel in right sidebar");
  }
  updateStatusText(message) {
    const statusEl = document.getElementById('export-status');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === "error"
        ? "#FF6B6B"
        : type === "success"
          ? "#4CAF50"
          : "#2196F3"
      };
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
    notification.textContent = message;

    // Add animation styles
    if (!document.getElementById("notification-styles")) {
      const styles = document.createElement("style");
      styles.id = "notification-styles";
      styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
}

// Export the ScreenSmoothRecorder class
export { ScreenSmoothRecorder };

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

    console.log('🎯 SpringSmoother starting:', {
      firstPoint: { x: data[0].x, y: data[0].y, timestamp: data[0].timestamp },
      totalPoints: data.length,
      clickEvents: data.filter(p => p.type === 'click' || p.isPressed).length,
      timeRange: `${data[0].timestamp}ms → ${data[data.length - 1].timestamp}ms`
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
        console.warn(`⚠️ Invalid point at index ${i}:`, p1);
        continue;
      }

      // 🆕 ENHANCED: Validate p2 as well before interpolation
      if (!Number.isFinite(p2.x) || !Number.isFinite(p2.y)) {
        console.error(`❌ Invalid p2 at index ${i + 1}:`, p2);
        continue;
      }

      // Check for suspicious data points in BOTH p1 and p2
      if (p1.x === 0 && p1.y === 0) {
        console.error(`❌ (0,0) point found at p1 index ${i} despite filtering! Timestamp: ${p1.timestamp}ms`, {
          p1, p2,
          isClick: p1.type === 'click' || p1.isPressed
        });
      }
      if (p2.x === 0 && p2.y === 0) {
        console.error(`❌ (0,0) point found at p2 index ${i + 1} despite filtering! Timestamp: ${p2.timestamp}ms`, {
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

        // 🆕 Track click events
        if (isPressed) {
          clickEventCount++;
          // Log state when processing click frames (but not every single frame to avoid spam)
          if (clickEventCount % 5 === 1) { // Log every 5th click frame
            console.log(`🖱️ Processing click frame #${clickEventCount} at ${currentTime}ms:`, {
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

        // 🆕 ENHANCED: Check if interpolation produces near-zero OR suspiciously low values
        if (targetX < 10 && targetY < 10) {
          console.error(`⚠️ Interpolation produced near-zero target at ${currentTime}ms:`, {
            t,
            p1: { x: p1.x, y: p1.y, timestamp: p1.timestamp, isPressed: p1.isPressed },
            p2: { x: p2.x, y: p2.y, timestamp: p2.timestamp, isPressed: p2.isPressed },
            target: { x: targetX, y: targetY },
            isClickFrame: isPressed,
            currentTime
          });
        }

        // 🆕 CRITICAL: Detect if interpolation created invalid values
        if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
          console.error(`❌ INTERPOLATION PRODUCED NaN/Infinity at ${currentTime}ms!`, {
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
          // 🆕 Check if this jump is near a click event
          const isNearClick = isPressed || p1.isPressed || p2.isPressed;
          if (isNearClick) {
            jumpsNearClicks++;
          }

          console.error(`🚨 ABRUPT JUMP #${debugJumpCount} at ${currentTime}ms (${(currentTime / 1000).toFixed(2)}s):`, {
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
          console.warn(`⚠️ Cursor near (0,0) at ${currentTime}ms (${(currentTime / 1000).toFixed(2)}s):`, {
            position: { x: this.x.toFixed(2), y: this.y.toFixed(2) },
            target: { x: targetX.toFixed(2), y: targetY.toFixed(2) },
            velocity: { vx: this.vx.toFixed(2), vy: this.vy.toFixed(2) },
            dataIndex: i,
            interpolationT: t.toFixed(3)
          });
        }

        // DEBUG: Catch high velocity
        if (Math.abs(this.vx) > 100 || Math.abs(this.vy) > 100) {
          console.warn(`🚀 High velocity at ${currentTime}ms (${(currentTime / 1000).toFixed(2)}s):`, {
            velocity: { vx: this.vx.toFixed(2), vy: this.vy.toFixed(2) },
            position: { x: this.x.toFixed(2), y: this.y.toFixed(2) },
            target: { x: targetX.toFixed(2), y: targetY.toFixed(2) }
          });
        }

        // Final Safety Check for NaN/Infinity
        if (!Number.isFinite(this.x)) {
          console.error(`❌ NaN/Infinity detected in x at ${currentTime}ms, resetting to target:`, targetX);
          this.x = targetX;
        }
        if (!Number.isFinite(this.y)) {
          console.error(`❌ NaN/Infinity detected in y at ${currentTime}ms, resetting to target:`, targetY);
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
          // 🆕 CRITICAL FIX: Use fallback chain for window dimensions
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

    console.log(`✅ SpringSmoother complete:`, {
      framesGenerated: processed.length,
      jumpsDetected: debugJumpCount,
      clickFrames: clickEventCount,
      jumpsNearClicks: jumpsNearClicks,
      clickCorrelation: debugJumpCount > 0 ? `${((jumpsNearClicks / debugJumpCount) * 100).toFixed(1)}% of jumps near clicks` : 'N/A'
    });
    return processed;
  }
}

// Initialize the recorder when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log('🔍 DEBUG: DOMContentLoaded fired in record.js');
  console.log('🔍 DEBUG: Current window.screenSmoothRecorder:', window.screenSmoothRecorder);

  if (!window.screenSmoothRecorder) {
    console.log('🔍 DEBUG: Creating new ScreenSmoothRecorder instance');
    window.screenSmoothRecorder = new ScreenSmoothRecorder();
    console.log('🔍 DEBUG: ScreenSmoothRecorder instance created');
  } else {
    console.log('🔍 DEBUG: ScreenSmoothRecorder already exists, skipping creation');
  }
});

// Cleanup when page is unloaded
window.addEventListener("beforeunload", () => {
  if (window.screenSmoothRecorder) {
    window.screenSmoothRecorder.cleanup();
  }
});

// Handle messages from other parts of the extension
console.log('🔍 [RECORD] Checking chrome.runtime availability:', {
  chromeDefined: typeof chrome !== 'undefined',
  runtimeDefined: typeof chrome !== 'undefined' && !!chrome.runtime,
  onMessageDefined: typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.onMessage
});

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  console.log('✅ [RECORD] Registering message listener...');
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 [RECORD] Message listener triggered:', request.action);
    try {
      if (request.action === "startRecordingFromPopup") {
        // Logic to start recording from popup if needed
        ("Start recording request from popup");
        sendResponse({ success: true });
      } else if (request.action === "cursorData") {
        // DIAGNOSTIC: Log incoming cursor data messages
        console.log('📥 [RECORD] Received cursorData message:', {
          hasData: !!request.data,
          dataKeys: request.data ? Object.keys(request.data) : [],
          recorderExists: !!window.screenSmoothRecorder
        });

        // Store cursor data from content script
        if (window.screenSmoothRecorder) {
          window.screenSmoothRecorder.storeCursorData(request.data);
          console.log('✅ [RECORD] Cursor data stored. Total entries:', window.screenSmoothRecorder.cursorData?.length);
          sendResponse({ success: true });
        } else {
          console.warn('❌ [RECORD] ScreenSmooth recorder not available for cursor data');
          sendResponse({ success: false, error: "Recorder not available" });
        }
      } else if (request.action === "premiumActivated") {
        // Handle premium activation
        ("Premium activated message received");
        if (window.screenSmoothRecorder) {
          window.screenSmoothRecorder.isPremium = true;
          window.screenSmoothRecorder.updatePremiumFeatures();
        }
        // Update UI to show premium features
        updatePremiumUI(true);
        sendResponse({ success: true });
      } else {
        ("Unknown message action:", request.action);
        sendResponse({ success: false, error: "Unknown action" });
      }
    } catch (error) {
      ("Error handling message:", error);
      sendResponse({ success: false, error: error.message });
    }

    return true; // Keep message channel open for async responses
  });
}

// REMOVED: Test functions - using simple license system
// window.testLemonSqueezyIntegration = function () { ... }
// window.testPremiumActivation = function () { ... }
// window.clearPremiumStatus = function () { ... }
// window.forceShowPremiumSection = function () { ... }
// window.testCheckout = async function (email = null) { ... }
// window.testEmailParameters = function (email = 'test@example.com') { ... }
// window.checkCurrentUserEmail = function () { ... }
// window.testCheckoutSuccess = function (customData = {}) { ... }

// REMOVED: Purchase completion polling - using simple license system
// window.startPurchasePolling = async function(user) { ... }

// REMOVED: Test functions for upgrade button - using simple license system
// window.fixUpgradeButton = function () { ... }
// function setupUpgradeButton() { ... }
// window.testPurchaseCompletion = async function () { ... }
// window.setupUpgradeButton = setupUpgradeButton;
// window.testUpgradeButton = function () { ... }

// REMOVED: Debug and test functions - using simple license system
// window.debugCheckoutSystem = async function () { ... }
// window.testRealCheckout = async function () { ... }
// window.testDatabaseConnection = async function () { ... }
// window.activateTestPremium = async function () { ... }
// window.checkDatabaseContents = async function () { ... }
