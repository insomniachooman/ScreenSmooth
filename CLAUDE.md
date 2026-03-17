# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
ScreenSmooth is a Chrome Extension (Manifest V3) for screen recording with AI auto-zoom and smooth cursor features. It uses vanilla JavaScript without a bundler.

## Development Commands

### Setup & Run
There is no build process (no `npm`, `webpack`, etc.). The extension runs directly from source.

1.  **Load Extension**:
    *   Open Chrome and go to `chrome://extensions/`
    *   Enable "Developer mode" (top right)
    *   Click "Load unpacked"
    *   Select the root directory (`screensmooth-v0.1`)

2.  **Reloading**:
    *   After modifying `background.js` or `manifest.json`: Click the refresh icon on the extension card in `chrome://extensions/`.
    *   After modifying content scripts (`src/content.js`): Reload the extension AND refresh the target web page.
    *   After modifying HTML/UI (`src/record/`, `src/popup/`): Simply refresh the specific page.

### Testing
There is no automated test suite. Testing is manual:
*   **License Gate**: See `DIAGNOSTIC_STEPS.md` for specific debugging procedures.
*   **Logs**: Check `chrome://extensions/` > "Inspect views service worker" for background script logs. Check standard DevTools console for popup and record pages.

## Code Architecture

### Core Components
*   **Manifest V3**: Defined in `manifest.json`.
*   **Service Worker (`src/background.js`)**: Central hub. Manages state (recording status, settings), handles installation, and acts as a message router.
*   **Content Scripts (`src/content.js`)**: Injected into web pages to capture cursor movements and interactions.
*   **Recording UI (`src/record/`)**: The main application interface where recording happens.
*   **Popup (`src/popup/`)**: The extension menu for quick actions/settings.
*   **Licensing (`src/license/`)**: Handling of trial/pro licenses and landing pages.

### Data Flow
1.  **Cursor Tracking**:
    *   `content.js` captures mouse events (move, click, type).
    *   Events are sent to `background.js` via `chrome.runtime.sendMessage`.
    *   `background.js` forwards events to the active recording tab (`src/record/record.html`) via `chrome.tabs.sendMessage`.
2.  **State Management**:
    *   Uses `chrome.storage.local` for persisting settings (`videoQuality`, `autoZoom`, etc.) and license data (`dodoLicenseData`).

### Key Technologies
*   **Video Processing**: `ffmpeg.wasm` (located in `assets/ffmpeg/`) is used for in-browser video encoding.
*   **Styling**: Pure CSS (`src/styles.css` global, plus component-specific CSS).
*   **Backend**: Supabase (referenced in CSP and `supabase/` directory).

## Coding Conventions
*   **JavaScript**: Vanilla ES6+. Classes are used for structure (e.g., `class ScreenSmoothBackground`).
*   **Imports**: Standard ES modules where supported, or script tags in HTML.
*   **Async/Await**: Preferred over raw Promises/callbacks.
*   **Security**: adhere to CSP defined in `manifest.json`. No `eval` or inline scripts that violate V3 rules.
