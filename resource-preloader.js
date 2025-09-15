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
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');\n        nonCriticalCSS.forEach(link => {\n            if (!PRELOAD_CONFIG.criticalCSS.some(css => link.href.includes(css))) {\n                link.media = 'print';\n                link.onload = function() {\n                    this.media = 'all';\n                };\n            }\n        });\n        \n        // Defer non-critical scripts\n        const nonCriticalScripts = document.querySelectorAll('script[src]:not([data-critical])');\n        nonCriticalScripts.forEach(script => {\n            if (!PRELOAD_CONFIG.criticalJS.some(js => script.src.includes(js))) {\n                script.defer = true;\n            }\n        });\n    }\n    \n    // Optimize image delivery\n    function optimizeImageDelivery() {\n        const images = document.querySelectorAll('img');\n        images.forEach(img => {\n            // Add intersection observer for lazy loading\n            if (!img.loading) {\n                img.loading = 'lazy';\n            }\n            \n            // Add decoding optimization\n            img.decoding = 'async';\n            \n            // Add importance hints\n            if (img.closest('.hero-section, .hero-video-background')) {\n                img.setAttribute('importance', 'high');\n            } else {\n                img.setAttribute('importance', 'low');\n            }\n        });\n    }\n    \n    // Add resource hints\n    function addResourceHints() {\n        // DNS prefetch for external resources\n        const externalDomains = [\n            'fonts.googleapis.com',\n            'fonts.gstatic.com',\n            'cdnjs.cloudflare.com',\n            'via.placeholder.com'\n        ];\n        \n        externalDomains.forEach(domain => {\n            const link = document.createElement('link');\n            link.rel = 'dns-prefetch';\n            link.href = `//${domain}`;\n            document.head.appendChild(link);\n        });\n        \n        // Preconnect to critical external resources\n        const preconnectDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];\n        preconnectDomains.forEach(domain => {\n            const link = document.createElement('link');\n            link.rel = 'preconnect';\n            link.href = `https://${domain}`;\n            link.crossOrigin = 'anonymous';\n            document.head.appendChild(link);\n        });\n    }\n    \n    // Setup intelligent prefetching\n    function setupIntelligentPrefetching() {\n        // Prefetch likely next pages based on user behavior\n        const navigationLinks = document.querySelectorAll('nav a[href]');\n        \n        navigationLinks.forEach(link => {\n            link.addEventListener('mouseenter', () => {\n                prefetchPage(link.href);\n            }, { once: true });\n        });\n        \n        // Prefetch on touch start for mobile\n        navigationLinks.forEach(link => {\n            link.addEventListener('touchstart', () => {\n                prefetchPage(link.href);\n            }, { once: true });\n        });\n        \n        // Auto-prefetch high-priority pages after initial load\n        setTimeout(() => {\n            const highPriorityPages = ['portfolio.html', 'contact.html'];\n            highPriorityPages.forEach(page => {\n                if (window.location.pathname !== `/${page}`) {\n                    prefetchPage(page);\n                }\n            });\n        }, 3000);\n    }\n    \n    // Prefetch page resources\n    function prefetchPage(href) {\n        if (document.querySelector(`link[rel=\"prefetch\"][href=\"${href}\"]`)) {\n            return; // Already prefetched\n        }\n        \n        const link = document.createElement('link');\n        link.rel = 'prefetch';\n        link.href = href;\n        link.onload = () => console.log(`📄 Prefetched: ${href}`);\n        document.head.appendChild(link);\n    }\n    \n    // Monitor performance\n    function monitorPerformance() {\n        // Track loading performance\n        window.addEventListener('load', () => {\n            const loadTime = performance.now() - performanceMetrics.startTime;\n            console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);\n            console.log(`📊 Resources loaded: ${performanceMetrics.resourcesLoaded}/${performanceMetrics.totalResources}`);\n            \n            if (performanceMetrics.errors.length > 0) {\n                console.warn('⚠️ Resource loading errors:', performanceMetrics.errors);\n            }\n            \n            // Report to analytics if available\n            reportPerformanceMetrics(loadTime);\n        });\n        \n        // Monitor long tasks\n        if ('PerformanceObserver' in window) {\n            const longTaskObserver = new PerformanceObserver((list) => {\n                list.getEntries().forEach(entry => {\n                    if (entry.duration > 50) {\n                        console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);\n                    }\n                });\n            });\n            \n            try {\n                longTaskObserver.observe({ entryTypes: ['longtask'] });\n            } catch (e) {\n                // Longtask not supported\n            }\n        }\n    }\n    \n    // Track resource loading\n    function trackResourceLoad(type, resource) {\n        performanceMetrics.resourcesLoaded++;\n        console.log(`✅ ${type} loaded: ${resource}`);\n    }\n    \n    // Track resource errors\n    function trackResourceError(type, resource) {\n        performanceMetrics.errors.push({ type, resource });\n        console.error(`❌ ${type} failed: ${resource}`);\n    }\n    \n    // Report performance metrics\n    function reportPerformanceMetrics(loadTime) {\n        // This would typically send to an analytics service\n        const metrics = {\n            loadTime,\n            resourcesLoaded: performanceMetrics.resourcesLoaded,\n            totalResources: performanceMetrics.totalResources,\n            errorCount: performanceMetrics.errors.length,\n            userAgent: navigator.userAgent,\n            connection: navigator.connection?.effectiveType || 'unknown'\n        };\n        \n        // Store in localStorage for debugging\n        try {\n            localStorage.setItem('chiro_performance_metrics', JSON.stringify(metrics));\n        } catch (e) {\n            // Storage not available\n        }\n        \n        console.log('📈 Performance metrics:', metrics);\n    }\n    \n    // Critical resource optimization for above-the-fold content\n    function optimizeCriticalRenderPath() {\n        // Inline critical CSS for above-the-fold content\n        const criticalCSS = `\n            .hero-section {\n                min-height: 100vh;\n                background: #0A0A0A;\n                position: relative;\n                overflow: hidden;\n            }\n            \n            .main-navigation {\n                position: fixed;\n                top: 0;\n                width: 100%;\n                z-index: 1000;\n                background: rgba(10, 10, 10, 0.95);\n                backdrop-filter: blur(10px);\n            }\n            \n            body {\n                margin: 0;\n                padding: 0;\n                background: #0A0A0A;\n                color: #FFFFFF;\n                font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;\n            }\n        `;\n        \n        const style = document.createElement('style');\n        style.textContent = criticalCSS;\n        document.head.insertBefore(style, document.head.firstChild);\n    }\n    \n    // Initialize critical render path optimization immediately\n    optimizeCriticalRenderPath();\n    \n    // Public API for manual optimization\n    window.ResourcePreloader = {\n        prefetchPage,\n        preloadImage,\n        preloadVideo,\n        getMetrics: () => performanceMetrics,\n        optimizeNewContent: function(container) {\n            const images = container.querySelectorAll('img');\n            images.forEach(img => {\n                img.loading = 'lazy';\n                img.decoding = 'async';\n            });\n        }\n    };\n    \n    console.log('🎯 Advanced resource preloader initialized');\n})();