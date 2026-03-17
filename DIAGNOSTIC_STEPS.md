# License Gate Diagnostic Steps

## Goal: Identify why the license gate isn't blocking access to record.html

## Background
The license gate in record.html (lines 24-120) should:
1. Hide content immediately with `visibility: hidden` and `opacity: 0`
2. Check chrome.storage.local for `dodoLicenseData`
3. Redirect to landingpage.html if no valid license
4. Show content only if valid license exists

## Possible Issues

### 1. Opening record.html outside extension context
If you're opening `file:///path/to/record.html` instead of `chrome-extension://[EXTENSION_ID]/src/record/record.html`:
- chrome.storage API won't be available
- Should trigger redirect at line 81-84

### 2. JavaScript error preventing script execution
- Any syntax error in the license gate script
- Error accessing chrome.storage API

### 3. Existing license data in storage
- If you have old test data in chrome.storage.local.dodoLicenseData
- Might be incorrectly validating an invalid license

### 4. Script being ignored/blocked
- CSP (Content Security Policy) blocking the script
- Script comment out or malformed HTML

## Diagnostic Commands

### Step 1: Check how you're opening the file
```bash
# Are you opening via extension URL or direct file path?
# Extension URL should look like: chrome-extension://[ID]/src/record/record.html
# Direct file would be: file:///Users/.../record.html
```

### Step 2: Check for existing license data
Open Chrome DevTools Console when on record.html and run:
```javascript
chrome.storage.local.get(['dodoLicenseData'], (data) => {
  console.log('dodoLicenseData:', JSON.stringify(data, null, 2));
});
```

### Step 3: Check if license gate is running
Look for these console logs:
- `🔍 DEBUG: record.html script loading started`
- `🔐 Running license gate check...`
- `🔍 CheckAndRedirect started`
- `🔍 invoking chrome.storage.local.get`
- `🔍 chrome.storage.local.get callback fired with data:`

### Step 4: Check for errors
Look for any red error messages in console, particularly:
- "chrome is not defined"
- "chrome.storage is not defined"
- Any storage errors

### Step 5: Check if content is actually hidden
In DevTools, check:
- Select `<html>` element in Elements tab
- Look at Computed styles for `visibility` and `opacity`
- Should be `visibility: hidden` and `opacity: 0` initially

## Expected Behavior (No License)
1. Page loads blank/white
2. Console shows: "❌ No valid license, redirecting to: [URL]"
3. Browser redirects to landingpage.html

## Expected Behavior (Valid License)
1. Page loads blank/white briefly
2. Console shows: "✅ Valid license found, revealing content"
3. Content fades in
4. Recorder UI visible

## Please provide the following information:

1. **How are you accessing record.html?**
   - Chrome extension URL (chrome-extension://...)
   - Direct file path (file://...)
   - Other method?

2. **Console logs when opening record.html**
   - Copy all console output (not just errors)
   - Especially any 🔍, 🔐, ✅, ❌ prefixed messages

3. **Existing license data**
   - Run the chrome.storage command above
   - What does it return?

4. **Any errors in console?**
   - Red error messages
   - Copy full error text

5. **Visual behavior**
   - Do you see a blank white screen briefly?
   - Or does the recorder UI appear immediately?
