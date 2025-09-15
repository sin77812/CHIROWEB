// Advanced Video Optimization and Performance Management
(function() {
    'use strict';
    
    // Global video optimization settings
    const OPTIMIZATION_CONFIG = {
        loadingBuffer: 100, // ms delay for batch loading
        qualityThresholds: {
            slow: ['slow-2g', '2g'],
            medium: ['3g'],
            fast: ['4g']
        },
        preloadDistance: '200px',
        playbackThreshold: 0.1
    };
    
    let isLowBandwidth = false;
    let videoLoadQueue = [];
    let loadingDebounceTimer = null;
    
    document.addEventListener('DOMContentLoaded', function() {
        detectNetworkConditions();
        initVideoOptimization();
        initVideoLazyLoading();
        initBandwidthOptimization();
        initVideoPreloading();
    });
    
    function detectNetworkConditions() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            isLowBandwidth = OPTIMIZATION_CONFIG.qualityThresholds.slow.includes(connection.effectiveType);
            
            console.log(`Network: ${connection.effectiveType}, Low bandwidth: ${isLowBandwidth}`);
            
            // Listen for network changes
            connection.addEventListener('change', () => {
                isLowBandwidth = OPTIMIZATION_CONFIG.qualityThresholds.slow.includes(connection.effectiveType);
                if (isLowBandwidth) {
                    pauseNonCriticalVideos();
                }
            });
        }
    }
    
    function initVideoOptimization() {
        const allVideos = document.querySelectorAll('video');
        
        allVideos.forEach((video, index) => {
            // Enhanced video attributes
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
            video.setAttribute('muted', 'true');
            video.setAttribute('loop', 'true');
            
            // Performance optimizations
            video.style.pointerEvents = 'none';
            video.style.userSelect = 'none';
            video.style.backfaceVisibility = 'hidden';
            video.style.transform = 'translateZ(0)';
            
            // Add unique ID for tracking
            if (!video.id) {
                video.id = `video-${index}`;
            }
            
            // Priority-based loading
            const isCritical = video.closest('.hero-video, .hero-video-background, .hero-section');
            if (isCritical) {
                video.setAttribute('preload', 'auto');
                video.dataset.priority = 'critical';
            } else {
                video.setAttribute('preload', 'none');
                video.dataset.priority = 'normal';
            }
            
            // Enhanced loading states
            video.addEventListener('loadstart', () => {
                video.style.opacity = '0';
                addVideoLoadingIndicator(video);
            });
            
            video.addEventListener('loadedmetadata', () => {
                console.log(`Video metadata loaded: ${video.id}`);
            });
            
            video.addEventListener('canplaythrough', () => {
                video.style.opacity = '1';
                video.style.transition = 'opacity 0.8s ease-in-out';
                removeVideoLoadingIndicator(video);
                
                // Auto-play with better error handling
                if (!isLowBandwidth) {
                    playVideoSafely(video);
                }
            });
            
            // Enhanced error handling
            video.addEventListener('error', (e) => {
                console.error(`Video error (${video.id}):`, e);
                handleVideoError(video);
            });
            
            // Memory management
            video.addEventListener('ended', () => {
                if (!video.hasAttribute('loop')) {
                    video.currentTime = 0;
                    video.load();
                }
            });
        });
        
        // Global visibility change handler
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    function initVideoLazyLoading() {
        const lazyVideos = document.querySelectorAll('video:not([data-priority="critical"])');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        queueVideoLoad(entry.target);
                        videoObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: OPTIMIZATION_CONFIG.preloadDistance,
                threshold: OPTIMIZATION_CONFIG.playbackThreshold
            });
            
            lazyVideos.forEach(video => {
                videoObserver.observe(video);
            });
        } else {
            // Fallback for older browsers
            lazyVideos.forEach(video => {
                queueVideoLoad(video);
            });
        }
    }
    
    function queueVideoLoad(video) {
        if (isLowBandwidth && video.dataset.priority !== 'critical') {
            return;
        }
        
        videoLoadQueue.push(video);
        
        // Debounce loading to batch requests
        clearTimeout(loadingDebounceTimer);
        loadingDebounceTimer = setTimeout(processVideoLoadQueue, OPTIMIZATION_CONFIG.loadingBuffer);
    }
    
    function processVideoLoadQueue() {
        const batchSize = isLowBandwidth ? 1 : 2;
        const videosToLoad = videoLoadQueue.splice(0, batchSize);
        
        videosToLoad.forEach(video => {
            loadVideoOptimized(video);
        });
        
        // Continue processing queue if there are more videos
        if (videoLoadQueue.length > 0) {
            setTimeout(processVideoLoadQueue, isLowBandwidth ? 1000 : 500);
        }
    }
    
    function loadVideoOptimized(video) {
        video.setAttribute('preload', 'auto');
        video.load();
        
        // Track loading performance
        const loadStartTime = performance.now();
        
        video.addEventListener('canplaythrough', () => {
            const loadTime = performance.now() - loadStartTime;
            console.log(`Video ${video.id} loaded in ${loadTime.toFixed(2)}ms`);
            
            video.classList.add('loaded');
            if (!isLowBandwidth) {
                playVideoSafely(video);
            }
        }, { once: true });
    }
    
    function playVideoSafely(video) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`Video ${video.id} playing successfully`);
                })
                .catch(error => {
                    console.warn(`Auto-play failed for ${video.id}:`, error);
                    
                    // Try again on user interaction
                    document.addEventListener('click', () => {
                        video.play().catch(e => console.log('Manual play failed:', e));
                    }, { once: true });
                });
        }
    }
    
    function initBandwidthOptimization() {
        if (isLowBandwidth) {
            // Pause non-critical videos on slow connections
            pauseNonCriticalVideos();
            
            // Add option to enable videos manually
            addLowBandwidthNotification();
        }
    }
    
    function pauseNonCriticalVideos() {
        const nonCriticalVideos = document.querySelectorAll('video:not([data-priority="critical"])');
        nonCriticalVideos.forEach(video => {
            video.pause();
            video.style.display = 'none';
        });
    }
    
    function addLowBandwidthNotification() {
        const notification = document.createElement('div');
        notification.className = 'video-bandwidth-notice';
        notification.innerHTML = `
            <div class="notice-content">
                <span>Low bandwidth detected. Videos paused to improve performance.</span>
                <button onclick="enableAllVideos()" class="enable-videos-btn">Enable Videos</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #2a2a2a;
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
    
    function initVideoPreloading() {
        // Preload hero video immediately for better UX
        const heroVideos = document.querySelectorAll('[data-priority="critical"]');
        heroVideos.forEach(video => {
            if (!isLowBandwidth) {
                video.load();
            }
        });
    }
    
    function handleVisibilityChange() {
        const videos = document.querySelectorAll('video');
        
        if (document.hidden) {
            videos.forEach(video => {
                if (!video.paused) {
                    video.dataset.wasPlaying = 'true';
                    video.pause();
                }
            });
        } else {
            videos.forEach(video => {
                if (video.dataset.wasPlaying === 'true') {
                    delete video.dataset.wasPlaying;
                    playVideoSafely(video);
                }
            });
        }
    }
    
    function handleVideoError(video) {
        removeVideoLoadingIndicator(video);
        video.style.display = 'none';
        
        // Try to fallback to poster image if available
        if (video.poster) {
            const fallbackImg = document.createElement('img');
            fallbackImg.src = video.poster;
            fallbackImg.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.7;
            `;
            video.parentNode.appendChild(fallbackImg);
        }
    }
    
    function addVideoLoadingIndicator(video) {
        const indicator = document.createElement('div');
        indicator.className = 'video-loading-indicator';
        indicator.innerHTML = '<div class="loading-spinner"></div>';
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100;
        `;
        
        const container = video.parentNode;
        if (container && !container.querySelector('.video-loading-indicator')) {
            container.style.position = 'relative';
            container.appendChild(indicator);
        }
    }
    
    function removeVideoLoadingIndicator(video) {
        const container = video.parentNode;
        const indicator = container?.querySelector('.video-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Global function for manual video enabling
    window.enableAllVideos = function() {
        isLowBandwidth = false;
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            video.style.display = '';
            loadVideoOptimized(video);
        });
        
        const notification = document.querySelector('.video-bandwidth-notice');
        if (notification) {
            notification.remove();
        }
    };
    
    // Add loading spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            width: 24px;
            height: 24px;
            border: 2px solid #2a2a2a;
            border-top: 2px solid #ff3b30;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .enable-videos-btn {
            background: #ff3b30;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            margin-left: 8px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .enable-videos-btn:hover {
            background: #e6342a;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Advanced video optimization initialized');
})();