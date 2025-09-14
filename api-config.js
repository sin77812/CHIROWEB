// API Base URL configuration helper
(function() {
  try {
    var base = null;
    // 1) meta tag override
    var meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content && meta.content.trim()) {
      base = meta.content.trim();
    }
    // 2) global variable override (e.g., set in HTML before this file)
    if (!base && typeof window.__API_BASE__ === 'string' && window.__API_BASE__) {
      base = window.__API_BASE__;
    }
    // 3) persisted value
    if (!base) {
      try {
        var stored = localStorage.getItem('chiro_api_base_url');
        if (stored && stored.trim()) base = stored.trim();
      } catch (e) {}
    }
    // 4) fallback to same origin
    if (!base) {
      base = window.location.origin;
    }
    // Apply and persist
    window.API_BASE_URL = base;
    try { localStorage.setItem('chiro_api_base_url', base); } catch (e) {}
    console.log('[API] Base URL:', base);
  } catch (e) {
    console.warn('api-config init failed:', e);
  }
})();

