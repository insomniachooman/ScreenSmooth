(function() {
  console.log('🔐 License Gate: Initialization');

  const GRACE_PERIOD_HOURS = 24;
  // Robust absolute URL generation
  const LANDING_PAGE_URL = chrome.runtime.getURL('src/landingpage.html');
  const CHECK_TIMEOUT_MS = 1500; // Force redirect if check takes too long

  // Fallback timeout to ensure we don't hang on blank screen
  const safetyTimeout = setTimeout(() => {
    console.warn('⚠️ License check timed out, redirecting for safety...');
    window.location.href = LANDING_PAGE_URL;
  }, CHECK_TIMEOUT_MS);

  function showContent() {
    clearTimeout(safetyTimeout);
    console.log('✅ Valid license found, revealing content');
    // Reveal content
    document.documentElement.classList.add('license-verified');
  }

  function redirect() {
    clearTimeout(safetyTimeout);
    console.log('❌ No valid license, redirecting to:', LANDING_PAGE_URL);
    window.location.href = LANDING_PAGE_URL;
  }

  // Check if DodoPayments license is valid
  function isDodoLicenseValid(dodoLicense) {
    if (!dodoLicense || !dodoLicense.key || !dodoLicense.isValid) {
      return false;
    }
    // Lifetime licenses never expire
    if (dodoLicense.subscriptionType === 'lifetime' || dodoLicense.type === 'lifetime') {
      return true;
    }
    // Weekly subscriptions need grace period check
    var hoursSinceValidation = (Date.now() - dodoLicense.validatedAt) / (1000 * 60 * 60);
    var withinGracePeriod = hoursSinceValidation <= GRACE_PERIOD_HOURS;
    return withinGracePeriod && (dodoLicense.status === 'active' || !dodoLicense.status);
  }

  // Run the license check
  function checkAndRedirect() {
    console.log('🔍 CheckAndRedirect started');
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      console.warn('⚠️ Chrome storage not available, redirecting...');
      redirect();
      return;
    }

    try {
      console.log('🔍 invoking chrome.storage.local.get');
      chrome.storage.local.get(['dodoLicenseData'], function(data) {
        console.log('🔍 chrome.storage.local.get callback fired');
        if (chrome.runtime.lastError) {
          console.error('❌ Storage error:', chrome.runtime.lastError);
          redirect();
          return;
        }

        console.log('🔍 License check data:', data);
        
        var isValid = isDodoLicenseValid(data.dodoLicenseData);
        console.log('📊 License valid:', isValid);

        if (!isValid) {
          console.log('❌ Invalid license, calling redirect()');
          redirect();
        } else {
          console.log('✅ Valid license, calling showContent()');
          showContent();
        }
      });
    } catch (e) {
      console.error('❌ Exception in license check:', e);
      redirect();
    }
  }

  // Run check immediately
  checkAndRedirect();
})();