// ScreenSmooth Content Script
// Prevent double instantiation
if (typeof window.ScreenSmoothContent !== 'undefined') {
    console.log('ScreenSmooth content script already loaded');
} else {

    class ScreenSmoothContent {
        constructor() {
            this.isTrackingCursor = false;
            this.cursorTracker = null;
            this.zoomIndicator = null;
            this.lastMousePosition = { x: 0, y: 0 };
            this.isRecording = false;
            this.showCursor = true; // Default to showing cursor
            this.lastSelectionTime = 0; // Debounce for selection events
            this.selectionStartTime = 0;
            this.lastTypingTime = 0;
            this.boundMouseMove = null;
            this.boundMouseDown = null;
            this.boundMouseUp = null;
            this.boundClick = null;
            this.boundInput = null;

            this.initialize();
        }

        initialize() {
            // Listen for messages from background script
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleMessage(message, sender, sendResponse);
                return true;
            });

            console.log('ScreenSmooth content script initialized');
        }

        handleMessage(message, sender, sendResponse) {
            switch (message.action) {
                case 'startCursorTracking':
                    this.startCursorTracking();
                    sendResponse({ success: true });
                    break;

                case 'stopCursorTracking':
                    this.stopCursorTracking();
                    sendResponse({ success: true });
                    break;

                case 'recordingStarted':
                    this.isRecording = true;
                    this.showCursor = message.showCursor !== false; // Default to true
                    this.onRecordingStarted();
                    sendResponse({ success: true });
                    break;

                case 'recordingStopped':
                    this.isRecording = false;
                    this.onRecordingStopped();
                    sendResponse({ success: true });
                    break;

                case 'getCursorPosition':
                    sendResponse({
                        success: true,
                        position: this.lastMousePosition
                    });
                    break;

                default:
                    console.log('Unknown message in content script:', message);
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        }

        startCursorTracking() {
            if (this.isTrackingCursor) {
                return;
            }

            console.log('Starting cursor tracking');
            this.isTrackingCursor = true;

            // Create cursor tracker element
            this.createCursorTracker();

            // Store bound functions for proper removal
            this.boundMouseMove = this.handleMouseMove.bind(this);
            this.boundMouseDown = this.handleMouseDown.bind(this);
            this.boundMouseUp = this.handleMouseUp.bind(this);
            this.boundClick = this.handleClick.bind(this);
            this.boundInput = this.handleInput.bind(this);

            // Add mouse and input event listeners
            document.addEventListener('mousemove', this.boundMouseMove, { passive: true });
            document.addEventListener('mousedown', this.boundMouseDown, { passive: true });
            document.addEventListener('mouseup', this.boundMouseUp, { passive: true });
            document.addEventListener('click', this.boundClick, { passive: true });
            document.addEventListener('input', this.boundInput, { passive: true });
        }

        stopCursorTracking() {
            if (!this.isTrackingCursor) {
                return;
            }

            console.log('Stopping cursor tracking');
            this.isTrackingCursor = false;

            // Remove event listeners properly
            if (this.boundMouseMove) {
                document.removeEventListener('mousemove', this.boundMouseMove);
                document.removeEventListener('mousedown', this.boundMouseDown);
                document.removeEventListener('mouseup', this.boundMouseUp);
                document.removeEventListener('click', this.boundClick);
                document.removeEventListener('input', this.boundInput);
            }

            this.boundMouseMove = null;
            this.boundMouseDown = null;
            this.boundMouseUp = null;
            this.boundClick = null;
            this.boundInput = null;

            // Remove cursor tracker element
            this.removeCursorTracker();
        }

        createCursorTracker() {
            // Remove existing tracker if any
            this.removeCursorTracker();

            // Create cursor highlight element
            this.cursorTracker = document.createElement('div');
            this.cursorTracker.id = 'screensmooth-cursor-tracker';
            // Blue glowing circle styles
            this.cursorTracker.style.cssText = `
            position: fixed;
            width: 1vw;
            height: 1vw;
            border-radius: 1%;
            background: rgba(74, 144, 226, 0.9);
            box-shadow: 
                0 0 10px 2px rgba(74, 144, 226, 0.6),
                0 0 20px 5px rgba(74, 144, 226, 0.3);
            pointer-events: none;
            z-index: 2147483647;
            transition: transform 0.1s ease, opacity 0.2s ease;
            transform: translate(-50%, -50%);
            opacity: 0;
        `;

            // Add inner white dot for precision
            const innerDot = document.createElement('div');
            innerDot.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;
            this.cursorTracker.appendChild(innerDot);

            document.body.appendChild(this.cursorTracker);
        }

        removeCursorTracker() {
            if (this.cursorTracker && this.cursorTracker.parentNode) {
                this.cursorTracker.parentNode.removeChild(this.cursorTracker);
                this.cursorTracker = null;
            }
        }

        handleMouseMove(event) {
            if (!this.isTrackingCursor || !this.cursorTracker) {
                return;
            }

            this.lastMousePosition = {
                x: event.clientX,
                y: event.clientY,
                timestamp: Date.now(),
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight
            };

            // Update cursor tracker position
            this.cursorTracker.style.left = event.clientX + 'px';
            this.cursorTracker.style.top = event.clientY + 'px';
            this.cursorTracker.style.opacity = this.isRecording ? '1' : '0';

            // Send cursor position to background for processing
            if (this.isRecording) {
                this.sendCursorData('move', this.lastMousePosition);
            }
        }

        handleMouseDown(event) {
            if (!this.isTrackingCursor || !this.isRecording) {
                return;
            }

            // Track potential selection start time
            if (event.button === 0) { // Left click only
                this.selectionStartTime = Date.now();
            }

            // Enhance cursor tracker on click (shrink effect like requested)
            if (this.cursorTracker) {
                this.cursorTracker.style.transform = 'translate(-50%, -50%) scale(0.85)';
            }

            this.sendCursorData('down', {
                x: event.clientX,
                y: event.clientY,
                button: event.button,
                timestamp: Date.now()
            });
        }

        handleMouseUp(event) {
            if (!this.isTrackingCursor || !this.isRecording) {
                return;
            }

            // Reset cursor tracker
            if (this.cursorTracker) {
                this.cursorTracker.style.transform = 'translate(-50%, -50%) scale(1)';
            }

            const now = Date.now();

            this.sendCursorData('up', {
                x: event.clientX,
                y: event.clientY,
                button: event.button,
                timestamp: now
            });

            // Check for text selection on mouse up (end of drag)
            // This ensures we get the full selection range and correct timing
            if (event.button === 0) { // Left click only
                const selection = window.getSelection();
                const selectedText = selection.toString().trim();

                // Only trigger for meaningful selections (at least 3 chars)
                if (selectedText.length >= 3 && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();

                    // Calculate center of the ENTIRE selection
                    const centerX = rect.left + (rect.width / 2);
                    const centerY = rect.top + (rect.height / 2);

                    // Use the start time captured on mousedown, or fallback to now
                    // This fixes the issue where zoom starts too late (at mouseup instead of mousedown)
                    const startTime = this.selectionStartTime || now;

                    // Only process if this looks like a new selection (time diff check)
                    // or if we haven't processed a selection recently
                    if (!this.lastSelectionTime || (now - this.lastSelectionTime) > 500) {
                        this.lastSelectionTime = now;

                        this.sendCursorData('selection', {
                            x: centerX,
                            y: centerY,
                            timestamp: now, // End time of selection
                            startTime: startTime, // Start time of selection (mousedown)
                            viewportWidth: window.innerWidth,
                            viewportHeight: window.innerHeight,
                            screenWidth: window.screen.width,
                            screenHeight: window.screen.height,
                            scrollX: window.scrollX || window.pageXOffset || 0,
                            scrollY: window.scrollY || window.pageYOffset || 0,
                            selectionWidth: rect.width,
                            selectionHeight: rect.height,
                            textLength: selectedText.length
                        });

                        console.log('[AutoZoom] SELECTION COMPLETED!', {
                            x: centerX,
                            y: centerY,
                            textLength: selectedText.length,
                            duration: now - startTime,
                            timestamp: now
                        });
                    }
                }

                // Reset start time
                this.selectionStartTime = 0;
            }
        }

        handleClick(event) {
            if (!this.isTrackingCursor || !this.isRecording) {
                return;
            }

            // Create click ripple effect (Blue)
            this.createClickRipple(event.clientX, event.clientY);


            this.sendCursorData('click', {
                x: event.clientX,
                y: event.clientY,
                button: event.button,
                timestamp: Date.now(),
                // Include viewport/window dimensions for proper normalization
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                // Include page scroll for accurate positioning
                scrollX: window.scrollX || window.pageXOffset || 0,
                scrollY: window.scrollY || window.pageYOffset || 0
            });

            console.log('[AutoZoom] CLICK DETECTED!', {
                x: event.clientX,
                y: event.clientY,
                target: event.target.tagName,
                timestamp: Date.now()
            });
        }

        handleInput(event) {
            if (!this.isTrackingCursor || !this.isRecording) return;

            const target = event.target;
            if (!(target instanceof HTMLElement)) return;

            const isTextarea = target.tagName === 'TEXTAREA';
            const isContentEditable = target.isContentEditable;
            let isTextEntryInput = false;

            if (target.tagName === 'INPUT') {
                const inputType = (target.getAttribute('type') || 'text').toLowerCase();
                const textEntryInputTypes = ['text', 'search', 'email', 'password', 'tel', 'url', 'number'];
                isTextEntryInput = textEntryInputTypes.includes(inputType);
            }

            if (isTextEntryInput || isTextarea || isContentEditable) {
                const rect = target.getBoundingClientRect();
                const now = Date.now();

                // Debounce typing intent to avoid spamming (every 1.5 seconds max)
                if (!this.lastTypingTime || (now - this.lastTypingTime) > 1500) {
                    this.lastTypingTime = now;

                    this.sendCursorData('typing', {
                        x: rect.left + (rect.width / 2),
                        y: rect.top + (rect.height / 2),
                        width: rect.width,
                        height: rect.height,
                        timestamp: now,
                        viewportWidth: window.innerWidth,
                        viewportHeight: window.innerHeight,
                        screenWidth: window.screen.width,
                        screenHeight: window.screen.height,
                        scrollX: window.scrollX || window.pageXOffset || 0,
                        scrollY: window.scrollY || window.pageYOffset || 0
                    });

                    console.log('[AutoZoom] TYPING DETECTED!', {
                        target: target.tagName,
                        timestamp: now
                    });
                }
            }
        }

        resetZoom() {
            const target = document.body;

            if (this.originalBodyStyles) {
                target.style.transform = 'scale(1)';
                // Keep transition for smooth zoom out

                // Reset other properties after transition
                setTimeout(() => {
                    target.style.transformOrigin = this.originalBodyStyles.transformOrigin;
                    target.style.overflow = this.originalBodyStyles.overflow;
                    target.style.willChange = 'auto';
                }, 400); // Match transition duration
            } else {
                target.style.transform = 'scale(1)';
                target.style.transformOrigin = 'center center';
            }

            console.log('🔍 Zoomed out to 1x');
        }

        createClickRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 2px solid #4A90E2;
            border-radius: 50%;
            background: transparent;
            pointer-events: none;
            z-index: 2147483647;
            transform: translate(-50%, -50%);
            animation: screensmooth-click-ripple 0.6s ease-out forwards;
        `;

            // Add ripple animation styles if not already added
            if (!document.getElementById('screensmooth-styles')) {
                const styles = document.createElement('style');
                styles.id = 'screensmooth-styles';
                styles.textContent = `
                @keyframes screensmooth-click-ripple {
                    0% {
                        width: 10px;
                        height: 10px;
                        opacity: 1;
                    }
                    100% {
                        width: 40px;
                        height: 40px;
                        opacity: 0;
                    }
                }
            `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        }

        sendCursorData(type, data) {
            // Send cursor data to background script for processing
            // Note: URL removed for Chrome Web Store privacy compliance
            chrome.runtime.sendMessage({
                action: 'cursorData',
                type: type,
                data: {
                    ...data,
                    type: type,
                    timestamp: Date.now()
                }
            }).catch(error => {
                // Background script might not be ready, which is okay
                console.log('Could not send cursor data:', error.message);
            });
        }

        onRecordingStarted() {
            console.log('Recording started in content script, showCursor:', this.showCursor);

            // Start cursor tracking automatically when recording starts
            // This is needed for auto-zoom even if cursor is hidden
            this.startCursorTracking();

            // Only show visual cursor elements if showCursor is enabled
            if (this.showCursor) {
                // Add recording indicator
                this.showRecordingIndicator();

                // Hide default cursor (we show our custom one)
                this.hideDefaultCursor();
            } else {
                // Remove the blue dot tracker since user doesn't want cursor shown
                this.removeCursorTracker();
                // Keep default cursor visible
                this.showDefaultCursor();
            }
        }

        onRecordingStopped() {
            console.log('Recording stopped in content script');

            // Stop cursor tracking
            this.stopCursorTracking();

            // Remove recording indicator
            this.hideRecordingIndicator();

            // Show default cursor
            this.showDefaultCursor();
        }

        hideDefaultCursor() {
            if (!document.getElementById('screensmooth-cursor-hide')) {
                const style = document.createElement('style');
                style.id = 'screensmooth-cursor-hide';
                style.textContent = `
                * {
                    cursor: none !important;
                }
            `;
                document.head.appendChild(style);
            }
        }

        showDefaultCursor() {
            const style = document.getElementById('screensmooth-cursor-hide');
            if (style && style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }

        showRecordingIndicator() {
            // Remove existing indicator
            this.hideRecordingIndicator();

            // Create a subtle recording indicator
            const indicator = document.createElement('div');
            indicator.id = 'screensmooth-recording-indicator';
            indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 12px;
            height: 12px;
            background: #FF6B6B;
            border-radius: 50%;
            z-index: 2147483647;
            pointer-events: none;
            animation: screensmooth-recording-pulse 2s infinite;
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
        `;

            // Add pulse animation if not already added
            if (!document.getElementById('screensmooth-recording-styles')) {
                const pulseStyle = document.createElement('style');
                pulseStyle.id = 'screensmooth-recording-styles';
                pulseStyle.textContent = `
                @keyframes screensmooth-recording-pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.2);
                    }
                }
            `;
                document.head.appendChild(pulseStyle);
            }

            document.body.appendChild(indicator);
        }

        hideRecordingIndicator() {
            const indicator = document.getElementById('screensmooth-recording-indicator');
            if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }
    }

    // Initialize content script only if not already initialized
    if (!window.screenSmoothContent) {
        window.ScreenSmoothContent = ScreenSmoothContent;
        window.screenSmoothContent = new ScreenSmoothContent();

        // Handle page navigation
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.screenSmoothContent.initialize();
            });
        } else {
            window.screenSmoothContent.initialize();
        }
    } else {
        console.log('ScreenSmooth content script instance already exists');
    }

} // End of the if block for preventing double instantiation
