// Video Optimization and Lazy Loading
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        
        // Video optimization and lazy loading
        initVideoOptimization();
        initVideoLazyLoading();
        
        function initVideoOptimization() {
            const allVideos = document.querySelectorAll('video');
            
            allVideos.forEach(video => {
                // Set optimal video attributes
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('playsinline', 'true');
                video.setAttribute('muted', 'true');
                video.setAttribute('autoplay', 'true');
                video.setAttribute('loop', 'true');
                
                // Optimize video loading
                video.style.pointerEvents = 'none';
                video.style.userSelect = 'none';
                
                // Add loading state
                video.addEventListener('loadstart', () => {
                    video.style.opacity = '0';
                });
                
                video.addEventListener('canplaythrough', () => {
                    video.style.opacity = '1';
                    video.style.transition = 'opacity 0.5s ease';
                });
                
                // Error handling
                video.addEventListener('error', () => {
                    console.warn('Video failed to load:', video.src);
                    video.style.display = 'none';
                });
                
                // Pause video when tab is not visible
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        video.pause();
                    } else {
                        video.play().catch(e => console.log('Video play failed:', e));
                    }
                });
            });
        }
        
        function initVideoLazyLoading() {
            const lazyVideos = document.querySelectorAll('video[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const video = entry.target;
                            
                            // Load video when it comes into view
                            if (video.getAttribute('preload') !== 'auto') {
                                video.setAttribute('preload', 'auto');
                                video.load();
                                
                                // Play video when loaded
                                video.addEventListener('canplaythrough', () => {
                                    video.classList.add('loaded');
                                    video.play().catch(e => console.log('Auto-play failed:', e));
                                });
                            }
                            
                            videoObserver.unobserve(video);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.25
                });
                
                lazyVideos.forEach(video => {
                    videoObserver.observe(video);
                });
            } else {
                // Fallback for browsers without Intersection Observer
                lazyVideos.forEach(video => {
                    video.setAttribute('preload', 'auto');
                    video.load();
                    video.classList.add('loaded');
                });
            }
        }
        
        // Preload critical videos immediately
        const criticalVideos = document.querySelectorAll('.hero-video-background video, .hero-video video');
        criticalVideos.forEach(video => {
            video.setAttribute('preload', 'auto');
            video.load();
        });
        
        // Network-aware loading
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // If slow connection, reduce video quality
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach(video => {
                    video.setAttribute('preload', 'none');
                    video.style.display = 'none';
                });
            }
        }
        
        console.log('Video optimization initialized');
    });
    
})();