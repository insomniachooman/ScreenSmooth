
export class CursorSettings {
    constructor() {
        this.settings = {
            cursorSize: 1.0,
            springStrength: 0.08,
            hideWhenIdle: false,
            showCursor: true,
            cursorStyle: 'classic'
        };

        this.elements = {
            sizeSlider: null,
            sizeValue: null,
            // speedSlider: null, // Removed
            smoothnessButtons: null, // Added
            hideIdleCheckbox: null,
            showCursorCheckbox: null,
            styleSelect: null,
            preview: null
        };

        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        // Get DOM elements
        this.elements.sizeSlider = document.getElementById('cursor-size');
        this.elements.sizeValue = document.getElementById('size-value');
        // this.elements.speedSlider = document.getElementById('cursor-speed'); // Removed
        this.elements.smoothnessButtons = document.querySelectorAll('#cursor-smoothness-control .segment-btn'); // Added
        this.elements.hideIdleCheckbox = document.getElementById('hide-idle');
        this.elements.showCursorCheckbox = document.getElementById('show-cursor');
        this.elements.styleSelect = document.getElementById('cursor-style');
        this.elements.preview = document.getElementById('cursor-preview');

        if (!this.elements.sizeSlider) {
            console.warn('Cursor settings elements not found');
            return;
        }

        // Load saved settings
        await this.loadSettings();

        // Attach event listeners
        this.attachListeners();

        // Initial update
        this.updateUI();
        this.updatePreview();

        this.initialized = true;
        console.log('CursorSettings initialized');
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['cursorSettings']);
            if (result.cursorSettings) {
                this.settings = { ...this.settings, ...result.cursorSettings };
                const validStyles = ['classic', 'minimal_dot', 'soft_glow', 'high_contrast'];
                if (!validStyles.includes(this.settings.cursorStyle)) {
                    this.settings.cursorStyle = 'classic';
                }
            }
        } catch (e) {
            console.error('Failed to load cursor settings:', e);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.local.set({ cursorSettings: this.settings });

            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('cursor-settings-changed', {
                detail: this.settings
            }));
        } catch (e) {
            console.error('Failed to save cursor settings:', e);
        }
    }

    attachListeners() {
        // Size Slider
        this.elements.sizeSlider.addEventListener('input', (e) => {
            this.settings.cursorSize = parseFloat(e.target.value);
            this.updateUI();
            this.updatePreview();
            this.saveSettings();
        });

        // Smoothness Buttons (Segmented Control)
        if (this.elements.smoothnessButtons) {
            this.elements.smoothnessButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Update settings
                    const value = parseFloat(e.target.dataset.value);
                    this.settings.springStrength = value;

                    // Update UI immediately (add active class to clicked, remove from others)
                    this.elements.smoothnessButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');

                    this.saveSettings();
                });
            });
        }

        // Hide Idle Checkbox
        if (this.elements.hideIdleCheckbox) {
            this.elements.hideIdleCheckbox.addEventListener('change', (e) => {
                this.settings.hideWhenIdle = e.target.checked;
                this.saveSettings();
            });
        }

        // Show Cursor Checkbox
        if (this.elements.showCursorCheckbox) {
            this.elements.showCursorCheckbox.addEventListener('change', (e) => {
                this.settings.showCursor = e.target.checked;
                this.saveSettings();
            });
        }

        if (this.elements.styleSelect) {
            this.elements.styleSelect.addEventListener('change', (e) => {
                this.settings.cursorStyle = e.target.value;
                this.updatePreview();
                this.saveSettings();
            });
        }
    }

    updateUI() {
        if (!this.elements.sizeSlider) return;

        // Update inputs to match state
        this.elements.sizeSlider.value = this.settings.cursorSize;
        this.elements.sizeValue.textContent = `${this.settings.cursorSize.toFixed(1)}x`;

        // Update active button state
        if (this.elements.smoothnessButtons) {
            this.elements.smoothnessButtons.forEach(btn => {
                const btnValue = parseFloat(btn.dataset.value);
                // Allow some tolerance for floating point comparison if exact match fails
                if (Math.abs(btnValue - this.settings.springStrength) < 0.001) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        if (this.elements.hideIdleCheckbox) {
            this.elements.hideIdleCheckbox.checked = this.settings.hideWhenIdle;
        }
        if (this.elements.showCursorCheckbox) {
            this.elements.showCursorCheckbox.checked = this.settings.showCursor;
        }

        if (this.elements.styleSelect) {
            this.elements.styleSelect.value = this.settings.cursorStyle || 'classic';
        }
    }

    updatePreview() {
        if (!this.elements.preview) return;

        const cursorStyle = this.settings.cursorStyle || 'classic';
        this.elements.preview.dataset.cursorStyle = cursorStyle;

        // Update preview cursor size
        // Assuming the preview contains an image or div representing the cursor
        // We'll set the scale transform
        this.elements.preview.style.transform = `scale(${this.settings.cursorSize})`;
    }

    // Public getter for current settings
    getSettings() {
        return { ...this.settings };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // We'll expose the instance globally for record.js to use
    window.cursorSettingsManager = new CursorSettings();
    // Initialization will happen when the panel is opened or explicitly called
    // But we can try to init immediately if elements exist
    setTimeout(() => window.cursorSettingsManager.initialize(), 500);
});
