// ScreenSmooth Popup Script - Simplified for Tab Opening Only
class ScreenSmoothPopup {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.loadStoredSettings();
        // Add license check on load
        this.checkLicenseAndUpdateUI();
    }

    initializeElements() {
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        this.licenseBtn = document.getElementById('license-btn');

        this.statusDot = document.getElementById('status-dot');
        this.statusText = document.getElementById('status-text');
        this.timer = document.getElementById('timer');
        this.recordingIndicator = document.getElementById('recording-indicator');
        this.secondaryControls = document.getElementById('secondary-controls');

        this.licenseDot = document.getElementById('license-dot');
        this.licenseText = document.getElementById('license-text');

        this.screenSelect = document.getElementById('screen-select');
        this.modeWarningPopup = document.getElementById('mode-warning-popup');

    }

    attachEventListeners() {
        // Main action - opens recording tab (gated)
        this.startBtn.addEventListener('click', () => this.handleStartClick());

        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', () => this.handleStopClick());
        }

        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.handlePauseClick());
        }

        this.settingsBtn.addEventListener('click', () => this.openRecordingTab('#settings'));
        this.licenseBtn.addEventListener('click', () => this.handleLicenseClick());

        // Screen selection
        this.screenSelect.addEventListener('change', (e) => this.handleScreenSelection(e));

        // Check recording status on popup open
        this.checkRecordingStatus();

        // Poll for status updates
        setInterval(() => this.checkRecordingStatus(), 1000);
    }

    async checkLicenseAndUpdateUI() {
        try {
            // Check license status
            const isPremium = await window.isPremium();
            console.log('License status check:', isPremium);

            // Update license status display
            this.updateLicenseStatus(isPremium);

            if (this.startBtn) {
                this.startBtn.disabled = false;
                // Only reset innerHTML if not recording
                if (this.statusText.textContent !== 'Recording in Progress') {
                    this.startBtn.innerHTML = `
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Start Recording
                    `;
                }
            }
            // Don't reset status here as it might overwrite recording status
        } catch (e) {
            console.warn('License UI check failed:', e);
            // Default to free tier
            this.updateLicenseStatus(false);
        }
    }

    updateLicenseStatus(isPremium) {
        if (!this.licenseDot || !this.licenseText || !this.licenseBtn) return;

        if (isPremium) {
            this.licenseDot.className = 'license-dot premium';
            this.licenseText.textContent = 'Premium Active';
            this.licenseBtn.textContent = 'Manage License';
            this.licenseBtn.className = 'btn btn-license premium';
        } else {
            this.licenseDot.className = 'license-dot free';
            this.licenseText.textContent = 'Free Tier Active';
            this.licenseBtn.textContent = 'Upgrade to Premium';
            this.licenseBtn.className = 'btn btn-license';
        }
    }

    async handleStartClick() {
        try {
            // Always open the recorder; gating happens on the record page
            this.openRecordingTab();
        } catch (e) {
            console.error('Start click error:', e);
            this.showError('Failed to open recorder');
        }
    }

    async handleStopClick() {
        try {
            // Send stop message to background/record tab
            chrome.runtime.sendMessage({ action: 'stopRecording' });
            window.close();
        } catch (e) {
            console.error('Stop click error:', e);
        }
    }

    async handlePauseClick() {
        try {
            // Send pause message
            chrome.runtime.sendMessage({ action: 'togglePause' });
        } catch (e) {
            console.error('Pause click error:', e);
        }
    }

    async openCheckout() {
        try {
            const checkoutUrl = 'https://screensmooth.lemonsqueezy.com/buy/f27c49be-d583-4f27-a733-5de61a44f8d8';
            await chrome.tabs.create({ url: checkoutUrl, active: true });
            window.close();
        } catch (e) {
            console.error('Open checkout error:', e);
            this.showError('Failed to open checkout');
        }
    }

    async handleLicenseClick() {
        try {
            // Always open the license page - users can activate existing licenses or purchase new ones
            const url = chrome.runtime.getURL('src/license/license.html');
            await chrome.tabs.create({ url, active: true });
            window.close();
        } catch (e) {
            console.error('License button error:', e);
            this.showError('Failed to open license page');
        }
    }

    async loadStoredSettings() {
        try {
            const result = await chrome.storage.local.get(['preferredScreen']);

            if (result.preferredScreen) {
                this.screenSelect.value = result.preferredScreen;
            }

            this.updateModeWarning(this.screenSelect.value);

            console.log('Settings loaded:', result);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    updateModeWarning(selectedType) {
        if (!this.modeWarningPopup) return;
        
        if (selectedType === 'tab') {
            this.modeWarningPopup.style.display = 'none';
        } else {
            this.modeWarningPopup.style.display = 'flex';
        }
    }

    async openRecordingTab(hash = '') {
        try {
            console.log('Opening recording tab...');

            // Update button state
            this.startBtn.disabled = true;
            this.startBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                Opening...
            `;

            // Open the recording tab
            const tab = await chrome.tabs.create({
                url: chrome.runtime.getURL('src/record/record.html') + hash,
                active: true
            });

            console.log('Recording tab opened:', tab.id);

            // Close the popup
            window.close();

        } catch (error) {
            console.error('Error opening recording tab:', error);
            this.showError('Failed to open recording tab');

            // Reset button state
            this.startBtn.disabled = false;
            this.startBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                </svg>
                Open Recorder
            `;
        }
    }

    handleScreenSelection(event) {
        const selectedType = event.target.value;
        console.log('Screen selection changed:', selectedType);

        if (this.modeWarningPopup) {
            if (selectedType === 'tab') {
                this.modeWarningPopup.style.display = 'none';
            } else {
                this.modeWarningPopup.style.display = 'flex';
            }
        }

        chrome.storage.local.set({ preferredScreen: selectedType });
    }

    async checkRecordingStatus() {
        try {
            // Check if there's an active recording by querying background script
            const response = await chrome.runtime.sendMessage({ action: 'getRecordingStatus' });

            if (response && response.isRecording) {
                this.updateStatus('recording', 'Recording in Progress');

                // Show recording UI
                if (this.recordingIndicator) this.recordingIndicator.style.display = 'flex';
                if (this.secondaryControls) this.secondaryControls.style.display = 'flex';
                if (this.startBtn) this.startBtn.style.display = 'none';

                // Update timer if available
                if (response.duration && this.timer) {
                    this.timer.textContent = this.formatTime(response.duration);
                }
            } else {
                this.updateStatus('ready', 'Ready to Record');

                // Show ready UI
                if (this.recordingIndicator) this.recordingIndicator.style.display = 'none';
                if (this.secondaryControls) this.secondaryControls.style.display = 'none';
                if (this.startBtn) this.startBtn.style.display = 'flex';
                if (this.timer) this.timer.textContent = '00:00:00';
            }
        } catch (error) {
            console.log('Could not check recording status:', error.message);
            // Assume not recording if error
            this.updateStatus('ready', 'Ready to Record');
        }
    }

    updateStatus(type, text) {
        this.statusDot.className = `status-dot ${type}`;
        this.statusText.textContent = text;
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showError(message) {
        this.updateStatus('error', `Error: ${message}`);
        setTimeout(() => {
            this.updateStatus('ready', 'Ready to Record');
        }, 3000);
    }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScreenSmoothPopup();
});