// LemonSqueezy Overlay Checkout System
// Uses invisible button click approach for reliable overlay functionality

class LemonSqueezyCheckout {
  constructor() {
    this.isListeningForEvents = false;
    this.currentCheckoutType = null; // 'trial' or 'lifetime'
    this.init();
  }

  /**
   * Initialize event listeners for LemonSqueezy overlay events
   */
  async init() {
    if (this.isListeningForEvents) return;

    console.log('[LemonSqueezy] Initializing event listeners...');

    try {
      // Wait for Lemon.js to load
      await this.waitForLemonSqueezy();

      // Setup event listeners
      this.setupEventListeners();

      console.log('[LemonSqueezy] Initialization complete');
    } catch (error) {
      console.error('[LemonSqueezy] Initialization failed:', error);
    }
  }

  /**
   * Wait for LemonSqueezy global object to be available
   */
  waitForLemonSqueezy() {
    return new Promise((resolve) => {
      if (window.LemonSqueezy) {
        console.log('[LemonSqueezy] Already loaded');
        resolve();
        return;
      }

      // Poll for the global object (loaded via HTML script tag)
      const checkInterval = setInterval(() => {
        if (window.LemonSqueezy) {
          console.log('[LemonSqueezy] Global object available');
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.LemonSqueezy) {
          console.error('[LemonSqueezy] Failed to load after 5s');
        }
        resolve(); // Resolve anyway to not block
      }, 5000);
    });
  }

  /**
   * Setup event listeners for checkout events
   */
  setupEventListeners() {
    if (this.isListeningForEvents) {
      console.log('[LemonSqueezy] Event listeners already setup');
      return;
    }

    // Success event
    window.addEventListener('Checkout.Success', (event) => {
      console.log('[LemonSqueezy] Checkout.Success', event.detail);
      this.handleCheckoutSuccess(event.detail);
    });

    // Cancelled event
    window.addEventListener('Checkout.Cancelled', (event) => {
      console.log('[LemonSqueezy] Checkout.Cancelled', event.detail);
      this.handleCheckoutCancelled();
    });

    // Error event
    window.addEventListener('Checkout.Error', (event) => {
      console.error('[LemonSqueezy] Checkout.Error', event.detail);
      this.handleCheckoutError(event.detail);
    });

    this.isListeningForEvents = true;
    console.log('[LemonSqueezy] Event listeners registered');
  }

  /**
   * Open checkout overlay by clicking invisible button
   */
  openCheckout(checkoutType) {
    this.currentCheckoutType = checkoutType;

    const buttonId = checkoutType === 'trial' ? 'lemonTrialLink' : 'lemonLifetimeLink';
    const button = document.getElementById(buttonId);

    if (!button) {
      console.error(`[LemonSqueezy] Button #${buttonId} not found`);
      return false;
    }

    if (!window.LemonSqueezy) {
      console.error('[LemonSqueezy] Lemon.js not loaded');
      return false;
    }

    console.log(`[LemonSqueezy] Opening ${checkoutType} checkout...`);

    // Programmatically click the invisible button
    button.click();

    return true;
  }

  /**
   * Handle successful checkout
   */
  async handleCheckoutSuccess(detail) {
    console.log('[LemonSqueezy] Payment successful!', detail);

    const orderData = detail?.order;
    const checkoutData = detail?.checkout;

    // Extract order info
    const orderId = orderData?.id || checkoutData?.id || 'unknown';
    const email = checkoutData?.email || orderData?.email;
    const customData = checkoutData?.custom_data || orderData?.custom_data;

    console.log('[LemonSqueezy] Order:', {
      orderId,
      email,
      customData,
      type: this.currentCheckoutType
    });

    try {
      // Activate license based on type
      if (this.currentCheckoutType === 'trial') {
        await this.activateTrial(email, orderId);
      } else if (this.currentCheckoutType === 'lifetime') {
        await this.activateLifetime(email, orderId);
      }

      // Show success message
      this.showSuccessMessage();

      // Reload license status
      if (window.licenseUI) {
        await window.licenseUI.loadLicenseStatus();
      }

    } catch (error) {
      console.error('[LemonSqueezy] Activation failed:', error);
      this.showErrorMessage('Payment successful but activation failed. Contact support.');
    }
  }

  /**
   * Activate trial license
   */
  async activateTrial(email, orderId) {
    console.log('[LemonSqueezy] Activating trial...', { email, orderId });

    // For now, just activate locally (you can add server-side activation later)
    if (window.simpleLicenseSystem && window.simpleLicenseSystem.activateTrial) {
      const result = await window.simpleLicenseSystem.activateTrial();
      if (result.success) {
        console.log('[LemonSqueezy] Trial activated locally');
        return { success: true, trial_key: 'local_trial_' + Date.now() };
      } else {
        throw new Error('Local trial activation failed');
      }
    } else {
      throw new Error('License system not available');
    }
  }

  /**
   * Activate lifetime license
   */
  async activateLifetime(email, orderId) {
    console.log('[LemonSqueezy] Activating lifetime...', { email, orderId });

    // For now, redirect to license entry (you can add server-side activation later)
    setTimeout(() => {
      const licenseUrl = chrome.runtime.getURL('src/license/license.html');
      window.location.href = licenseUrl;
    }, 2000);

    return { success: true };
  }

  /**
   * Handle cancelled checkout
   */
  handleCheckoutCancelled() {
    console.log('[LemonSqueezy] Checkout cancelled by user');
    this.showInfoMessage('Payment cancelled. You can try again anytime.');
  }

  /**
   * Handle checkout error
   */
  handleCheckoutError(detail) {
    console.error('[LemonSqueezy] Checkout error:', detail);
    this.showErrorMessage('Payment failed. Please try again or contact support.');
  }

  /**
   * UI Helper: Show success message
   */
  showSuccessMessage() {
    alert('✅ Payment successful! Your license is now active.');
  }

  /**
   * UI Helper: Show info message
   */
  showInfoMessage(message) {
    alert(`ℹ️ ${message}`);
  }

  /**
   * UI Helper: Show error message
   */
  showErrorMessage(message) {
    alert(`❌ ${message}`);
  }
}

// Export singleton instance
const lemonCheckout = new LemonSqueezyCheckout();

// Make globally available
window.lemonCheckout = lemonCheckout;

// Initialize on load
console.log('[LemonSqueezy] Script loaded, initializing...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[LemonSqueezy] DOM loaded, starting init...');
    lemonCheckout.init();
  });
} else {
  console.log('[LemonSqueezy] DOM already loaded, starting init...');
  lemonCheckout.init();
}

// Make sure it's available globally
window.lemonCheckout = lemonCheckout;
console.log('[LemonSqueezy] lemonCheckout assigned to window');

console.log('[LemonSqueezy] Overlay checkout system loaded');