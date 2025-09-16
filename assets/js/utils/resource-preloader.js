// Advanced Resource Preloading and Performance Optimization
(function() {
    'use strict';
    
    // Performance configuration
    const PRELOAD_CONFIG = {
        criticalCSS: [
            'styles.css',
            'icons.css'
        ],
        criticalJS: [
            'main.js',
            'navigation.js',
            'video-optimization.js'
        ],
        fonts: [
            'https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap'
        ],
        images: {
            hero: ['bennervideo.mp4', 'secondvideo.mp4'],
            portfolio: ['images/portfolio/nbpkorea.jpg', 'images/portfolio/goyomisik.jpg']
        },
        prefetchDelay: 2000,
        deferNonCritical: true
    };
    
    let performanceMetrics = {
        startTime: performance.now(),
        resourcesLoaded: 0,
        totalResources: 0,
        errors: []
    };
    
    // Initialize resource optimization
    document.addEventListener('DOMContentLoaded', function() {
        initResourcePreloading();
        optimizeResourceDelivery();
        monitorPerformance();
        setupIntelligentPrefetching();
    });
    
    // Main resource preloading function
    function initResourcePreloading() {
        console.log('🚀 Initializing advanced resource preloading...');
        
        // Preload critical CSS
        preloadCriticalCSS();
        
        // Preload critical JavaScript
        preloadCriticalJS();
        
        // Preload fonts
        preloadFonts();
        
        // Preload hero images/videos
        preloadHeroResources();
        
        // Setup intelligent prefetching
        setTimeout(setupIntelligentPrefetching, PRELOAD_CONFIG.prefetchDelay);
    }
    
    // Preload critical CSS files
    function preloadCriticalCSS() {
        PRELOAD_CONFIG.criticalCSS.forEach(css => {
            if (!isResourceAlreadyLoaded(css, 'link')) {
                const link = createPreloadLink(css, 'style');
                link.onload = () => trackResourceLoad('CSS', css);
                link.onerror = () => trackResourceError('CSS', css);
                document.head.appendChild(link);
                performanceMetrics.totalResources++;
            }
        });
    }
    
    // Preload critical JavaScript files
    function preloadCriticalJS() {
        PRELOAD_CONFIG.criticalJS.forEach(js => {
            if (!isResourceAlreadyLoaded(js, 'script')) {
                const link = createPreloadLink(js, 'script');
                link.onload = () => trackResourceLoad('JS', js);
                link.onerror = () => trackResourceError('JS', js);
                document.head.appendChild(link);
                performanceMetrics.totalResources++;
            }
        });
    }
    
    // Preload fonts
    function preloadFonts() {
        PRELOAD_CONFIG.fonts.forEach(font => {
            const link = createPreloadLink(font, 'style');
            link.crossOrigin = 'anonymous';
            link.onload = () => trackResourceLoad('Font', font);
            document.head.appendChild(link);
            performanceMetrics.totalResources++;
        });
    }
    
    // Preload hero resources
    function preloadHeroResources() {
        // Preload hero videos
        PRELOAD_CONFIG.images.hero.forEach(video => {
            if (video.endsWith('.mp4')) {
                preloadVideo(video);
            }
        });
        
        // Preload critical portfolio images
        PRELOAD_CONFIG.images.portfolio.forEach(image => {
            preloadImage(image);
        });
    }
    
    // Create preload link element
    function createPreloadLink(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        
        // Add cache optimization
        if (as === 'script' || as === 'style') {
            link.setAttribute('importance', 'high');
        }
        
        return link;
    }
    
    // Preload video with metadata only
    function preloadVideo(src) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = src;
        video.style.display = 'none';
        
        video.addEventListener('loadedmetadata', () => {
            trackResourceLoad('Video', src);
            document.body.removeChild(video);
        });
        
        video.addEventListener('error', () => {
            trackResourceError('Video', src);
            if (document.body.contains(video)) {
                document.body.removeChild(video);
            }
        });
        
        document.body.appendChild(video);
        performanceMetrics.totalResources++;
    }
    
    // Preload image
    function preloadImage(src) {
        const img = new Image();
        img.onload = () => trackResourceLoad('Image', src);
        img.onerror = () => trackResourceError('Image', src);
        img.src = src;
        performanceMetrics.totalResources++;
    }
    
    // Check if resource is already loaded
    function isResourceAlreadyLoaded(href, tagName) {
        const existing = document.querySelector(`${tagName}[href="${href}"], ${tagName}[src="${href}"]`);
        return !!existing;
    }
    
    // Optimize resource delivery
    function optimizeResourceDelivery() {
        // Defer non-critical resources
        if (PRELOAD_CONFIG.deferNonCritical) {
            deferNonCriticalResources();
        }
        
        // Optimize image delivery
        optimizeImageDelivery();
        
        // Setup resource hints
        addResourceHints();
    }
    
    // Defer non-critical resources
    function deferNonCriticalResources() {
        // Defer non-critical CSS
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        nonCriticalCSS.forEach(link => {
            if (!PRELOAD_CONFIG.criticalCSS.some(css => link.href.includes(css))) {
                link.media = 'print';
                link.onload = function() {
                    this.media = 'all';
                };
            }
        });
        
        // Defer non-critical scripts
        const nonCriticalScripts = document.querySelectorAll('script[src]:not([data-critical])');
        nonCriticalScripts.forEach(script => {
            if (!PRELOAD_CONFIG.criticalJS.some(js => script.src.includes(js))) {
                script.defer = true;
            }
        });
    }
    
    // Optimize image delivery
    function optimizeImageDelivery() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add intersection observer for lazy loading
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Add decoding optimization
            img.decoding = 'async';
            
            // Add importance hints
            if (img.closest('.hero-section, .hero-video-background')) {
                img.setAttribute('importance', 'high');
            } else {
                img.setAttribute('importance', 'low');
            }
        });
    }
    
    // Add resource hints
    function addResourceHints() {
        // DNS prefetch for external resources
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdnjs.cloudflare.com',
            'via.placeholder.com'
        ];
        
        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
        
        // Preconnect to critical external resources
        const preconnectDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `https://${domain}`;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    // Setup intelligent prefetching
    function setupIntelligentPrefetching() {
        // Prefetch likely next pages based on user behavior
        const navigationLinks = document.querySelectorAll('nav a[href]');
        
        navigationLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                prefetchPage(link.href);
            }, { once: true });
        });
        
        // Prefetch on touch start for mobile
        navigationLinks.forEach(link => {
            link.addEventListener('touchstart', () => {
                prefetchPage(link.href);
            }, { once: true });
        });
        
        // Auto-prefetch high-priority pages after initial load
        setTimeout(() => {
            const highPriorityPages = ['portfolio.html', 'contact.html'];
            highPriorityPages.forEach(page => {
                if (window.location.pathname !== `/${page}`) {
                    prefetchPage(page);
                }
            });
        }, 3000);
    }
    
    // Prefetch page resources
    function prefetchPage(href) {
        if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
            return; // Already prefetched
        }
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.onload = () => console.log(`📄 Prefetched: ${href}`);
        document.head.appendChild(link);
    }
    
    // Monitor performance
    function monitorPerformance() {
        // Track loading performance
        window.addEventListener('load', () => {
            const loadTime = performance.now() - performanceMetrics.startTime;
            console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
            console.log(`📊 Resources loaded: ${performanceMetrics.resourcesLoaded}/${performanceMetrics.totalResources}`);
            
            if (performanceMetrics.errors.length > 0) {
                console.warn('⚠️ Resource loading errors:', performanceMetrics.errors);
            }
            
            // Report to analytics if available
            reportPerformanceMetrics(loadTime);
        });
        
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            
            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Longtask not supported
            }
        }
    }
    
    // Track resource loading
    function trackResourceLoad(type, resource) {
        performanceMetrics.resourcesLoaded++;
        console.log(`✅ ${type} loaded: ${resource}`);
    }
    
    // Track resource errors
    function trackResourceError(type, resource) {
        performanceMetrics.errors.push({ type, resource });
        console.error(`❌ ${type} failed: ${resource}`);
    }
    
    // Report performance metrics
    function reportPerformanceMetrics(loadTime) {
        // This would typically send to an analytics service
        const metrics = {
            loadTime,
            resourcesLoaded: performanceMetrics.resourcesLoaded,
            totalResources: performanceMetrics.totalResources,
            errorCount: performanceMetrics.errors.length,
            userAgent: navigator.userAgent,
            connection: navigator.connection?.effectiveType || 'unknown'
        };
        
        // Store in localStorage for debugging
        try {
            localStorage.setItem('chiro_performance_metrics', JSON.stringify(metrics));
        } catch (e) {
            // Storage not available
        }
        
        console.log('📈 Performance metrics:', metrics);
    }
    
    // Critical resource optimization for above-the-fold content
    function optimizeCriticalRenderPath() {
        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
            .hero-section {
                min-height: 100vh;
                background: #0A0A0A;
                position: relative;
                overflow: hidden;
            }
            
            .main-navigation {
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 1000;
                background: rgba(10, 10, 10, 0.95);
                backdrop-filter: blur(10px);
            }
            
            body {
                margin: 0;
                padding: 0;
                background: #0A0A0A;
                color: #FFFFFF;
                font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }
    
    // Initialize critical render path optimization immediately
    optimizeCriticalRenderPath();
    
    // Public API for manual optimization
    window.ResourcePreloader = {
        prefetchPage,
        preloadImage,
        preloadVideo,
        getMetrics: () => performanceMetrics,
        optimizeNewContent: function(container) {
            const images = container.querySelectorAll('img');
            images.forEach(img => {
                img.loading = 'lazy';
                img.decoding = 'async';
            });
        }
    };
    
    console.log('🎯 Advanced resource preloader initialized');
})();