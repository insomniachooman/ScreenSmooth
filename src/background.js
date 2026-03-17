// ScreenSmooth Background Service Worker - Simplified
class ScreenSmoothBackground {
    constructor() {
        // Store record page tab ID when it registers (replaces chrome.tabs.query)
        this.recordPageTabId = null;
        this.initializeServiceWorker();
    }

    initializeServiceWorker() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });

        // Direct to landingpage.html when icon clicked (unified license entry point)
        chrome.action.onClicked.addListener((tab) => {
            chrome.tabs.create({
                url: chrome.runtime.getURL('src/landingpage.html')
            });
        });

        // Handle messages from popup and content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Will respond asynchronously
        });

        // Handle extension startup
        chrome.runtime.onStartup.addListener(() => {
            this.initializeStorage();
        });

        // Handle tab updates - removed automatic content script injection 
        // since we have it in manifest.json
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && /^https?:/.test(tab.url)) {
                console.log('🌐 Tab updated:', tab.url);

                // Check if this is a Supabase auth callback - REMOVED for v0.1
                // Auth handled via simple-license.js now

                // Content script will be automatically injected via manifest
            }
        });

        console.log('ScreenSmooth background service worker initialized');
    }

    // handleAuthCallback removed

    async handleInstallation(details) {
        console.log('ScreenSmooth installed:', details);

        // Initialize storage with default settings
        await this.initializeStorage();

        if (details.reason === 'install') {
            console.log('First time installation - setting up defaults');
        } else if (details.reason === 'update') {
            console.log('Extension updated from version:', details.previousVersion);
        }
    }

    async initializeStorage() {
        try {
            const defaultSettings = {
                preferredScreen: 'screen',
                videoQuality: 'high',
                cursorTracking: true,
                autoZoom: true,
                outputFormat: 'webm'
            };

            const existing = await chrome.storage.local.get(Object.keys(defaultSettings));
            const toSet = {};

            for (const [key, value] of Object.entries(defaultSettings)) {
                if (!(key in existing)) {
                    toSet[key] = value;
                }
            }

            if (Object.keys(toSet).length > 0) {
                await chrome.storage.local.set(toSet);
                console.log('Default settings initialized:', toSet);
            }
        } catch (error) {
            console.error('Error initializing storage:', error);
        }
    }

    // Content script injection is handled via manifest.json
    // This method is kept for manual injection if needed
    async injectContentScript(tabId) {
        try {
            // Check if content script is already injected
            const results = await chrome.scripting.executeScript({
                target: { tabId },
                func: () => !!window.screenSmoothContent
            });

            if (results[0].result) {
                console.log('Content script already injected in tab:', tabId);
                return;
            }

            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['content.js']
            });
            console.log('Content script manually injected into tab:', tabId);
        } catch (error) {
            // Ignore errors for special pages where content scripts can't be injected
            if (!error.message.includes('Cannot access')) {
                console.log('Could not inject content script:', error.message);
            }
        }
    }

    async forwardCursorData(cursorData) {
        try {
            // Use registered tab ID instead of chrome.tabs.query (no tabs permission needed)
            if (this.recordPageTabId) {
                console.log('📨 [BG] Forwarding to registered record page, tab:', this.recordPageTabId);
                await chrome.tabs.sendMessage(this.recordPageTabId, {
                    action: 'cursorData',
                    data: cursorData
                });
                console.log('📨 [BG] Message sent successfully');
            } else {
                console.log('❌ [BG] Record page not registered yet');
            }
        } catch (error) {
            // Record page might not be open or ready, which is okay
            console.log('⚠️ [BG] Could not forward cursor data:', error.message);
            // Clear invalid tab ID if send failed
            if (error.message.includes('Could not establish connection')) {
                this.recordPageTabId = null;
            }
        }
    }

    // savePurchaseToDatabase removed - was for localhost debugging

    async handleMessage(message, sender, sendResponse) {
        try {
            // Handle both 'action' and 'type' fields (content-cursor uses 'type', others use 'action')
            const messageType = message.type || message.action;

            console.log('📨 [BG] Message received:', { type: messageType, hasAction: !!message.action, hasType: !!message.type });

            switch (messageType) {
                case 'register_record_page':
                    // Record page registers itself so we can forward cursor data
                    this.recordPageTabId = sender.tab?.id;
                    console.log('📝 [BG] Record page registered, tab ID:', this.recordPageTabId);
                    sendResponse({ success: true, tabId: this.recordPageTabId });
                    break;

                case 'getRecordingStatus':
                    // Check status from storage
                    const { isRecording, recordingStartTime } = await chrome.storage.local.get(['isRecording', 'recordingStartTime']);
                    const duration = isRecording && recordingStartTime ? Date.now() - recordingStartTime : 0;

                    sendResponse({
                        success: true,
                        isRecording: !!isRecording,
                        duration: duration
                    });
                    break;

                case 'cursor-position':
                case 'cursor-click':
                case 'cursor-typing':
                case 'cursor-selection':
                    // DIAGNOSTIC: Log incoming cursor messages
                    console.log('🖱️ [BG] Received cursor message:', {
                        type: message.type,
                        x: message.x,
                        y: message.y,
                        timestamp: message.timestamp,
                        from: sender.tab?.id
                    });

                    // Forward cursor position/click data from content-cursor.js to record page
                    const cursorEventData = {
                        x: message.x,
                        y: message.y,
                        pageX: message.pageX || message.x,
                        pageY: message.pageY || message.y,
                        timestamp: message.timestamp || Date.now(),
                        windowWidth: message.windowWidth,
                        windowHeight: message.windowHeight,
                        scrollX: message.scrollX || 0,
                        scrollY: message.scrollY || 0,
                        isPressed: message.isPressed || false,
                        type: message.type.replace('cursor-', ''), // 'click', 'move', 'typing', 'selection'
                        // Add extra fields for typing/selection
                        width: message.width,
                        height: message.height
                    };

                    console.log('📤 [BG] Forwarding to record page:', cursorEventData);
                    this.forwardCursorData(cursorEventData);
                    sendResponse({ success: true });
                    break;

                case 'cursorData':
                    // Forward cursor data to record page if it's open
                    this.forwardCursorData(message.data);
                    sendResponse({ success: true });
                    break;

                case 'notifyRecordingStarted':
                    console.log('Recording started notification received');
                    sendResponse({ success: true });
                    break;

                case 'notifyRecordingStopped':
                    console.log('Recording stopped notification received');
                    sendResponse({ success: true });
                    break;

                case 'premiumActivated':
                    console.log('🎉 Premium activation notification received:', message.data);

                    // Store premium status and purchase data in extension storage
                    const premiumData = {
                        isPremium: true,
                        premiumActivated: Date.now(),
                        purchaseData: message.data,
                        activatedAt: new Date().toISOString()
                    };

                    await chrome.storage.local.set(premiumData);
                    console.log('✅ Premium status saved:', premiumData);

                    // Optionally save to database via webhook or API call
                    // Localhost database save removed
                    // this.savePurchaseToDatabase(message.data);

                    sendResponse({ success: true, data: premiumData });
                    break;

                // auth_tokens case removed

                case 'getPremiumStatus':
                    // Check premium status
                    const { isPremium } = await chrome.storage.local.get('isPremium');
                    sendResponse({ success: true, isPremium: !!isPremium });
                    break;

                default:
                    console.log('❌ [BG] Unknown message type:', messageType, 'Full message:', message);
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
}

// Initialize the background service worker
const screenSmoothBackground = new ScreenSmoothBackground();

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScreenSmoothBackground;
}