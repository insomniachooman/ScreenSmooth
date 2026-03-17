// ScreenSmooth DodoPayments License System
// Unified License Activation for Weekly + Lifetime

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Supabase Edge Function endpoint for DodoPayments validation
        VALIDATION_ENDPOINT: 'https://gucnquopziweksmdfsbi.supabase.co/functions/v1/validate-dodo-license',
        // Grace period for offline validation (in hours)
        GRACE_PERIOD_HOURS: 24,
        // Supabase anon key for Edge Function calls
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Y25xdW9weml3ZWtzbWRmc2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NzExNTIsImV4cCI6MjA3NDM0NzE1Mn0.HDqOGRdHIOQ3E4WeSUoN-xllb0yHAcsPjivdZOMWJTw',
        // Redirect URL after successful activation - use absolute path via chrome.runtime.getURL
        get RECORDER_URL() { return chrome.runtime.getURL('src/record/record.html'); },
        // SECURITY TESTING ONLY: force local bypass to validate licensing weakness
        POC_BYPASS_ENABLED: true,
    };

    // DOM Elements
    let licenseForm, licenseKeyInput, activateBtn, statusMessage;
    let subscriptionStatus, statusBadge, statusDetails;

    class LicenseSystem {
        constructor() {
            this.isInitialized = false;
        }

        // Initialize the license system
        async initialize() {
            if (this.isInitialized) return;

            console.log('🔧 Initializing DodoPayments License System...');

            // Get DOM elements
            licenseForm = document.getElementById('licenseForm');
            licenseKeyInput = document.getElementById('licenseKey');
            activateBtn = document.getElementById('activateBtn');
            statusMessage = document.getElementById('statusMessage');
            subscriptionStatus = document.getElementById('subscriptionStatus');
            statusBadge = document.getElementById('statusBadge');
            statusDetails = document.getElementById('statusDetails');

            // Set up event listeners
            this.setupEventListeners();

            // SECURITY TESTING ONLY: bypass key entry to demonstrate local-trust weakness
            if (CONFIG.POC_BYPASS_ENABLED) {
                await this.applyPocBypass();
                this.isInitialized = true;
                return;
            }

            // Check existing license status
            await this.checkExistingLicense();

            this.isInitialized = true;
            console.log('✅ DodoPayments License System initialized');
        }

        // SECURITY TESTING ONLY: seed local premium state and skip key prompt
        async applyPocBypass() {
            const storage = this.getStorageAPI();
            const now = Date.now();
            const pocLicense = {
                key: '00000000-0000-0000-0000-000000000000',
                isValid: true,
                source: 'poc-local-bypass',
                subscriptionType: 'lifetime',
                validatedAt: now,
                status: 'active',
                expiresAt: null
            };

            await storage.set({
                dodoLicenseData: pocLicense,
                isPremium: true,
                premiumActivated: now
            });

            if (licenseForm) {
                licenseForm.style.display = 'none';
            }

            this.showStatus('POC bypass active. Redirecting without license key...', 'info');

            setTimeout(() => {
                window.location.replace(CONFIG.RECORDER_URL);
            }, 250);
        }

        // Set up event listeners
        setupEventListeners() {
            // License form submission
            if (licenseForm) {
                licenseForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const licenseKey = licenseKeyInput?.value?.trim();
                    if (licenseKey) {
                        await this.activateLicense(licenseKey);
                    }
                });
            }
        }

        // Check if a license key is in UUID format (DodoPayments format)
        isValidKeyFormat(key) {
            if (!key || typeof key !== 'string') return false;
            const trimmed = key.trim();
            // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(trimmed);
        }

        // Get storage API (Chrome extension or localStorage fallback)
        getStorageAPI() {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                return {
                    type: 'chrome',
                    get: (keys) => new Promise((resolve) => {
                        chrome.storage.local.get(keys, resolve);
                    }),
                    set: (data) => new Promise((resolve) => {
                        chrome.storage.local.set(data, resolve);
                    }),
                    remove: (keys) => new Promise((resolve) => {
                        chrome.storage.local.remove(keys, resolve);
                    })
                };
            } else {
                return {
                    type: 'localStorage',
                    get: (keys) => {
                        try {
                            if (typeof keys === 'string') {
                                const item = localStorage.getItem(keys);
                                return Promise.resolve(item ? { [keys]: JSON.parse(item) } : {});
                            } else {
                                const result = {};
                                for (const key of keys) {
                                    const item = localStorage.getItem(key);
                                    if (item) result[key] = JSON.parse(item);
                                }
                                return Promise.resolve(result);
                            }
                        } catch (error) {
                            return Promise.resolve({});
                        }
                    },
                    set: (data) => {
                        try {
                            for (const [key, value] of Object.entries(data)) {
                                localStorage.setItem(key, JSON.stringify(value));
                            }
                            return Promise.resolve();
                        } catch (error) {
                            return Promise.reject(error);
                        }
                    },
                    remove: (keys) => {
                        try {
                            if (Array.isArray(keys)) {
                                for (const key of keys) localStorage.removeItem(key);
                            } else {
                                localStorage.removeItem(keys);
                            }
                            return Promise.resolve();
                        } catch (error) {
                            return Promise.reject(error);
                        }
                    }
                };
            }
        }

        // Validate license with DodoPayments via Supabase Edge Function
        async validateWithServer(licenseKey) {
            console.log('🌐 Validating DodoPayments license with server...');

            const response = await fetch(CONFIG.VALIDATION_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                    'apikey': CONFIG.SUPABASE_ANON_KEY
                },
                body: JSON.stringify({ license_key: licenseKey })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Server validation result:', result);
            return result;
        }

        // Activate a DodoPayments license
        async activateLicense(licenseKey) {
            console.log('🔑 Activating DodoPayments license...');

            this.setLoading(true);
            this.hideStatus();

            try {
                // Validate format
                if (!this.isValidKeyFormat(licenseKey)) {
                    throw new Error('Invalid license key format. Please enter a valid UUID license key.');
                }

                // Validate with server
                const result = await this.validateWithServer(licenseKey);

                if (!result.valid) {
                    throw new Error(result.error || 'License key is not valid. Please check and try again.');
                }

                // Store the license
                const storage = this.getStorageAPI();
                const licenseData = {
                    key: licenseKey,
                    isValid: true,
                    source: 'dodo',
                    subscriptionType: result.type || result.subscription_type || 'weekly',
                    validatedAt: Date.now(),
                    status: result.status || 'active',
                    expiresAt: result.expires_at || null
                };

                await storage.set({
                    dodoLicenseData: licenseData,
                    isPremium: true,
                    premiumActivated: Date.now()
                });

                console.log('✅ DodoPayments license activated:', licenseData);

                this.showStatus('License activated successfully! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.replace(CONFIG.RECORDER_URL);
                }, 1000);

                return { success: true };

            } catch (error) {
                console.error('❌ License activation failed:', error);
                this.showStatus(error.message, 'error');
                return { success: false, error: error.message };

            } finally {
                this.setLoading(false);
            }
        }

        // Check for existing license on page load
        async checkExistingLicense() {
            try {
                const storage = this.getStorageAPI();
                const data = await storage.get(['dodoLicenseData']);
                const license = data.dodoLicenseData;

                if (license && license.key && license.isValid) {
                    console.log('📦 Found existing DodoPayments license');

                    const isLifetime = license.subscriptionType === 'lifetime' || license.type === 'lifetime';
                    const hoursSinceValidation = (Date.now() - license.validatedAt) / (1000 * 60 * 60);
                    const withinGracePeriod = hoursSinceValidation <= CONFIG.GRACE_PERIOD_HOURS;

                    if (isLifetime || (withinGracePeriod && license.status === 'active')) {
                        this.showLicenseStatus(license);
                        this.showStatus('Active license found! Redirecting...', 'info');
                        setTimeout(() => {
                            window.location.replace(CONFIG.RECORDER_URL);
                        }, 1500);
                    }
                }
            } catch (error) {
                console.error('Error checking existing license:', error);
            }
        }

        // Show license status UI
        showLicenseStatus(license) {
            if (!subscriptionStatus || !statusBadge || !statusDetails) return;

            subscriptionStatus.classList.add('show');
            const isLifetime = license.subscriptionType === 'lifetime' || license.type === 'lifetime';
            const status = license.status || 'unknown';

            if (isLifetime) {
                statusBadge.textContent = 'Lifetime';
                statusBadge.className = 'status-badge lifetime';
                statusDetails.textContent = 'Lifetime access - never expires';
            } else {
                statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                statusBadge.className = 'status-badge ' + status;
                statusDetails.textContent = status === 'active' ? 'Subscription is active' : 'Please renew';
            }
        }

        // Show status message
        showStatus(message, type = 'info') {
            if (!statusMessage) return;
            statusMessage.textContent = message;
            statusMessage.className = `status-message show ${type}`;
        }

        // Hide status message
        hideStatus() {
            if (!statusMessage) return;
            statusMessage.className = 'status-message';
        }

        // Set loading state
        setLoading(isLoading) {
            if (activateBtn) {
                activateBtn.disabled = isLoading;
                activateBtn.innerHTML = isLoading
                    ? '<span class="loader"></span>Validating...'
                    : '🔑 Activate License';
            }
            if (licenseKeyInput) {
                licenseKeyInput.disabled = isLoading;
            }
        }
    }

    // Create and initialize
    const licenseSystem = new LicenseSystem();
    document.addEventListener('DOMContentLoaded', () => licenseSystem.initialize());
    window.licenseSystem = licenseSystem;

    console.log('🔧 DodoPayments License script loaded');
})();
