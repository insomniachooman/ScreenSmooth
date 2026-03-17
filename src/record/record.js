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
import { ScreenSmoothRecorder } from './screen-smooth-recorder.js';
// Supabase will be available as window.supabase from locally loaded supabase.js

// Global error handler for debugging
window.addEventListener('error', function (e) {
  console.error('�x� DEBUG: Global JavaScript error:', e.error);
  console.error('�x� DEBUG: Error message:', e.message);
  console.error('�x� DEBUG: Error filename:', e.filename);
  console.error('�x� DEBUG: Error line:', e.lineno);
});

window.addEventListener('unhandledrejection', function (e) {
  console.error('�x� DEBUG: Unhandled promise rejection:', e.reason);
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
  console.log('�x� DEBUG: showDashboard() called');
  try {
    if (dashboardView) {
      dashboardView.style.display = 'block';
    } else {
      console.log('�x� DEBUG: dashboardView not found');
    }

    // Check license status with error handling
    // Check license status - Assumed true due to header gate
    let hasLicense = true;

    // Update UI based on license status
    try {
      updateLicenseUI(hasLicense);
    } catch (uiError) {
      console.log('�x� DEBUG: updateLicenseUI error:', uiError);
    }

    // Initialize the recorder with proper error handling
    console.log('�x� DEBUG: Checking window.screenSmoothRecorder:', typeof window.screenSmoothRecorder);
    if (typeof window.screenSmoothRecorder === 'undefined') {
      console.log('�x� DEBUG: window.screenSmoothRecorder is undefined, creating new instance');
      try {
        // Add a small delay to ensure dashboard DOM is fully rendered
        setTimeout(() => {
          console.log('�x� DEBUG: Creating ScreenSmoothRecorder in setTimeout');
          try {
            window.screenSmoothRecorder = new ScreenSmoothRecorder();

            // Verify critical elements after initialization
            if (window.screenSmoothRecorder) {
              console.log('�x� DEBUG: ScreenSmoothRecorder created successfully in setTimeout');
              // Test element availability
              const optionCards = document.querySelectorAll(".option-card");
              const startBtn = document.getElementById("start-recording-btn");
              console.log('�x� DEBUG: Found option cards:', optionCards.length, 'start button:', !!startBtn);
            }
          } catch (delayedError) {
            console.log('�x� DEBUG: Error creating ScreenSmoothRecorder in setTimeout:', delayedError);
          }
        }, 200); // 200ms delay to ensure DOM is ready
      } catch (error) {
        console.error('�x� DEBUG: Error in setTimeout setup:', error);
      }
    } else {
      console.log('�x� DEBUG: window.screenSmoothRecorder already exists');
      // Verify it's working
      if (window.screenSmoothRecorder) {
        console.log('�x� DEBUG: Existing recorder is valid');
      }
    }

  } catch (error) {
    console.log('�x� DEBUG: Error in showDashboard:', error);
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
      upgradeBtn.textContent = 'License Active';
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
// Initialize the recorder when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log('�x� DEBUG: DOMContentLoaded fired in record.js');
  console.log('�x� DEBUG: Current window.screenSmoothRecorder:', window.screenSmoothRecorder);

  if (!window.screenSmoothRecorder) {
    console.log('�x� DEBUG: Creating new ScreenSmoothRecorder instance');
    window.screenSmoothRecorder = new ScreenSmoothRecorder();
    console.log('�x� DEBUG: ScreenSmoothRecorder instance created');
  } else {
    console.log('�x� DEBUG: ScreenSmoothRecorder already exists, skipping creation');
  }
});

// Cleanup when page is unloaded
window.addEventListener("beforeunload", () => {
  if (window.screenSmoothRecorder) {
    window.screenSmoothRecorder.cleanup();
  }
});

// Handle messages from other parts of the extension
console.log('�x� [RECORD] Checking chrome.runtime availability:', {
  chromeDefined: typeof chrome !== 'undefined',
  runtimeDefined: typeof chrome !== 'undefined' && !!chrome.runtime,
  onMessageDefined: typeof chrome !== 'undefined' && chrome.runtime && !!chrome.runtime.onMessage
});

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  console.log('�S& [RECORD] Registering message listener...');
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('�x� [RECORD] Message listener triggered:', request.action);
    try {
      if (request.action === "startRecordingFromPopup") {
        // Logic to start recording from popup if needed
        ("Start recording request from popup");
        sendResponse({ success: true });
      } else if (request.action === "cursorData") {
        // DIAGNOSTIC: Log incoming cursor data messages
        console.log('�x� [RECORD] Received cursorData message:', {
          hasData: !!request.data,
          dataKeys: request.data ? Object.keys(request.data) : [],
          recorderExists: !!window.screenSmoothRecorder
        });

        // Store cursor data from content script
        if (window.screenSmoothRecorder) {
          window.screenSmoothRecorder.storeCursorData(request.data);
          console.log('�S& [RECORD] Cursor data stored. Total entries:', window.screenSmoothRecorder.cursorData?.length);
          sendResponse({ success: true });
        } else {
          console.warn('�R [RECORD] ScreenSmooth recorder not available for cursor data');
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

