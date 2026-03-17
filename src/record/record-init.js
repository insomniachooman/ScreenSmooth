// Process polyfill to fix 'process is not defined' error (required for FFmpeg)
window.process = window.process || { env: {} };

// Debug logging for script loading
console.log('🔍 DEBUG: record.html script loading started');
console.log('🔍 DEBUG: Current location:', window.location.href);
console.log('🔍 DEBUG: Is extension context:', window.location.protocol === 'chrome-extension:');