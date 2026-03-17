(function() {
    console.log('🚀 Landing page script starting...');
    
    const CONFIG = {
        GRACE_PERIOD_HOURS: 24,
        CHECK_TIMEOUT_MS: 2000,
        get RECORDER_URL() { return chrome.runtime.getURL('src/record/record.html'); },
        get LICENSE_URL() { return chrome.runtime.getURL('src/license/license.html'); }
    };

    console.log('📋 CONFIG loaded');

    function isDodoLicenseValid(dodoLicense) {
        if (!dodoLicense || !dodoLicense.key || !dodoLicense.isValid) {
            return false;
        }
        if (dodoLicense.subscriptionType === 'lifetime' || dodoLicense.type === 'lifetime') {
            return true;
        }
        var hoursSinceValidation = (Date.now() - dodoLicense.validatedAt) / (1000 * 60 * 60);
        var withinGracePeriod = hoursSinceValidation <= CONFIG.GRACE_PERIOD_HOURS;
        return withinGracePeriod && (dodoLicense.status === 'active' || !dodoLicense.status);
    }

    function checkLicense(callback) {
        if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
            callback({ valid: false, reason: 'no_storage' });
            return;
        }
        try {
            chrome.storage.local.get(['dodoLicenseData'], function(data) {
                if (chrome.runtime.lastError) {
                    callback({ valid: false, reason: 'storage_error' });
                    return;
                }
                var isValid = isDodoLicenseValid(data.dodoLicenseData);
                if (isValid) {
                    callback({ valid: true, license: data.dodoLicenseData });
                } else {
                    callback({ valid: false, reason: 'no_valid_license' });
                }
            });
        } catch (error) {
            callback({ valid: false, reason: 'exception', error: error.message });
        }
    }

    var timeoutId = setTimeout(function() {
        window.location.replace(CONFIG.LICENSE_URL);
    }, CONFIG.CHECK_TIMEOUT_MS);

    checkLicense(function(result) {
        clearTimeout(timeoutId);
        if (result.valid) {
            window.location.replace(CONFIG.RECORDER_URL);
        } else {
            window.location.replace(CONFIG.LICENSE_URL);
        }
    });
})();