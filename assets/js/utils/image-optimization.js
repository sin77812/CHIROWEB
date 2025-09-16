// Advanced Image Optimization and Lazy Loading System
(function() {
    'use strict';
    
    // Configuration for image optimization
    const IMAGE_CONFIG = {
        lazyOffset: '50px',
        fadeInDuration: 600,
        retryAttempts: 3,
        retryDelay: 1000,
        webpSupport: null,
        avifSupport: null,
        // placeholderService: 'https://via.placeholder.com', // Removed to avoid external dependency
        compressionQuality: 85
    };
    
    let imageLoadQueue = [];
    let processQueueTimer = null;
    let isLowBandwidth = false;
    
    // Initialize image optimization when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        detectImageFormatSupport();
        detectNetworkConditions();
        initImageOptimization();
        initLazyLoading();
        addImageOptimizationStyles();
    });
    
    // Detect modern image format support
    function detectImageFormatSupport() {
        // Test WebP support
        const webpCanvas = document.createElement('canvas');
        webpCanvas.width = 1;
        webpCanvas.height = 1;
        IMAGE_CONFIG.webpSupport = webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        
        // Test AVIF support (more advanced)
        const avifImg = new Image();
        avifImg.onload = () => IMAGE_CONFIG.avifSupport = true;
        avifImg.onerror = () => IMAGE_CONFIG.avifSupport = false;
        avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        
        console.log(`Image format support - WebP: ${IMAGE_CONFIG.webpSupport}, AVIF: ${IMAGE_CONFIG.avifSupport}`);
    }
    
    // Detect network conditions for adaptive loading
    function detectNetworkConditions() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            isLowBandwidth = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
            
            connection.addEventListener('change', () => {
                isLowBandwidth = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
                adjustImageQualityForNetwork();
            });
        }
    }
    
    // Main image optimization initialization
    function initImageOptimization() {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach((img, index) => {
            optimizeImage(img, index);
        });
        
        // Monitor for dynamically added images
        observeNewImages();
    }
    
    // Optimize individual image
    function optimizeImage(img, index) {
        // Skip if already processed or already loaded
        if (img.dataset.optimized || img.classList.contains('loaded')) return;
        
        // Add unique ID for tracking
        if (!img.id) {
            img.id = `img-${index}`;
        }
        
        // Set loading strategy based on position
        const isCritical = img.closest('.hero-section, .hero-video-background, .portfolio-section') || 
                          img.getBoundingClientRect().top < window.innerHeight;
        
        if (isCritical && img.src) {
            img.dataset.priority = 'critical';
            preloadImage(img);
            // Don't apply lazy loading to images with src already loaded
        } else if (!img.src || img.dataset.src) {
            img.dataset.priority = 'normal';
            setupLazyLoading(img);
        }
        
        // Add error handling
        img.addEventListener('error', (e) => handleImageError(img, e));
        
        // Add load success handling
        img.addEventListener('load', () => handleImageLoad(img));
        
        // Optimize image source if possible
        optimizeImageSource(img);
        
        img.dataset.optimized = 'true';
    }
    
    // Optimize image source based on format support and network
    function optimizeImageSource(img) {
        const originalSrc = img.src || img.dataset.src;
        if (!originalSrc) return;
        
        // Skip external images and data URLs
        if (originalSrc.startsWith('http') && !originalSrc.includes(window.location.hostname) || 
            originalSrc.startsWith('data:')) {
            return;
        }
        
        // Generate optimized source based on supported formats
        let optimizedSrc = originalSrc;
        
        // Add responsive sizing
        if (isLowBandwidth) {
            optimizedSrc = addImageParameters(optimizedSrc, { 
                quality: 60, 
                width: Math.min(img.offsetWidth || 800, 800) 
            });
        } else {
            optimizedSrc = addImageParameters(optimizedSrc, { 
                quality: IMAGE_CONFIG.compressionQuality 
            });
        }
        
        // Store original and optimized sources
        img.dataset.originalSrc = originalSrc;
        img.dataset.optimizedSrc = optimizedSrc;
        
        // Use optimized source if not already set
        if (img.src === originalSrc) {
            img.src = optimizedSrc;
        }
    }
    
    // Add image parameters for optimization (placeholder implementation)
    function addImageParameters(src, params) {
        // This would typically integrate with an image optimization service
        // For now, return original source
        return src;
    }
    
    // Setup lazy loading for non-critical images
    function setupLazyLoading(img) {
        // Only apply lazy loading if image doesn't have a valid src or has data-src
        if (!img.src || img.dataset.src) {
            // Store original src and clear it for lazy loading
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
                img.src = '';
            }
            
            // Add placeholder only if image doesn't have src
            if (!img.src) {
                addImagePlaceholder(img);
            }
        }
        
        // Add intersection observer
        if ('IntersectionObserver' in window) {
            createImageObserver().observe(img);
        } else {
            // Fallback for older browsers
            queueImageLoad(img);
        }
    }
    
    // Create intersection observer for lazy loading
    function createImageObserver() {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    queueImageLoad(entry.target);
                    entry.target.imageObserver?.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: IMAGE_CONFIG.lazyOffset,
            threshold: 0.01
        });
    }
    
    // Queue image for loading with batching
    function queueImageLoad(img) {
        if (img.dataset.queued) return;
        
        img.dataset.queued = 'true';
        imageLoadQueue.push(img);
        
        // Process queue with debouncing
        clearTimeout(processQueueTimer);
        processQueueTimer = setTimeout(processImageQueue, isLowBandwidth ? 200 : 100);
    }
    
    // Process image loading queue
    function processImageQueue() {
        const batchSize = isLowBandwidth ? 2 : 4;
        const imagesToLoad = imageLoadQueue.splice(0, batchSize);
        
        imagesToLoad.forEach(img => {
            loadImageWithRetry(img);
        });
        
        // Continue processing if more images remain
        if (imageLoadQueue.length > 0) {
            setTimeout(processImageQueue, isLowBandwidth ? 300 : 150);
        }
    }
    
    // Load image with retry mechanism
    function loadImageWithRetry(img, attempt = 1) {
        const src = img.dataset.optimizedSrc || img.dataset.src;
        if (!src) return;
        
        // Add loading indicator
        addImageLoadingIndicator(img);
        
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.classList.add('image-loaded');
            removeImageLoadingIndicator(img);
            removeImagePlaceholder(img);
            
            // Add fade-in animation
            img.style.opacity = '0';
            img.style.transition = `opacity ${IMAGE_CONFIG.fadeInDuration}ms ease-in-out`;
            
            // Force reflow and then fade in
            img.offsetHeight;
            img.style.opacity = '1';
            
            console.log(`Image loaded successfully: ${img.id}`);
        };
        
        tempImg.onerror = () => {
            if (attempt < IMAGE_CONFIG.retryAttempts) {
                console.warn(`Image load failed, retrying (${attempt}/${IMAGE_CONFIG.retryAttempts}): ${src}`);
                setTimeout(() => {
                    loadImageWithRetry(img, attempt + 1);
                }, IMAGE_CONFIG.retryDelay * attempt);
            } else {
                console.error(`Image load failed after ${IMAGE_CONFIG.retryAttempts} attempts: ${src}`);
                handleImageError(img);
            }
        };
        
        tempImg.src = src;
    }
    
    // Handle image loading success
    function handleImageLoad(img) {
        img.classList.add('image-success');
        removeImageLoadingIndicator(img);
        removeImagePlaceholder(img);
    }
    
    // Handle image loading errors
    function handleImageError(img, event) {
        console.error(`Image error for ${img.id}:`, event);
        
        removeImageLoadingIndicator(img);
        img.classList.add('image-error');
        
        // Try fallback strategies
        const fallbackSrc = img.dataset.fallback || img.dataset.originalSrc;
        
        if (fallbackSrc && fallbackSrc !== img.src) {
            console.log(`Trying fallback source for ${img.id}`);
            img.src = fallbackSrc;
            return;
        }
        
        // Show CSS placeholder instead of external image
        img.classList.add('image-placeholder-fallback');
        img.style.display = 'none'; // Hide broken image
        
        // Show placeholder element
        if (!img.parentNode.querySelector('.image-placeholder')) {
            addImagePlaceholder(img);
        }
    }
    
    // Add image placeholder
    function addImagePlaceholder(img) {
        if (img.classList.contains('no-placeholder')) return;
        
        const placeholder = img.parentNode.querySelector('.image-placeholder');
        if (placeholder) return;
        
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'image-placeholder';
        placeholderDiv.innerHTML = `
            <div class="placeholder-shimmer"></div>
            <div class="placeholder-icon">🖼️</div>
        `;
        
        placeholderDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: inherit;
        `;
        
        // Ensure parent has relative positioning
        const parent = img.parentNode;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        parent.appendChild(placeholderDiv);
    }
    
    // Remove image placeholder
    function removeImagePlaceholder(img) {
        const placeholder = img.parentNode.querySelector('.image-placeholder');
        if (placeholder) {
            placeholder.style.opacity = '0';
            setTimeout(() => placeholder.remove(), 300);
        }
    }
    
    // Add loading indicator
    function addImageLoadingIndicator(img) {
        const existing = img.parentNode.querySelector('.image-loading-indicator');
        if (existing) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'image-loading-indicator';
        indicator.innerHTML = '<div class="loading-spinner"></div>';
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
        `;
        
        img.parentNode.appendChild(indicator);
    }
    
    // Remove loading indicator
    function removeImageLoadingIndicator(img) {
        const indicator = img.parentNode.querySelector('.image-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Generate placeholder image URL - use CSS instead of external service
    function generatePlaceholderImage(img) {
        // Instead of external service, return null to use CSS placeholder
        return null;
    }
    
    // Preload critical images
    function preloadImage(img) {
        const src = img.dataset.optimizedSrc || img.src;
        if (!src) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
        
        console.log(`Preloading critical image: ${img.id}`);
    }
    
    // Observe for new images added dynamically
    function observeNewImages() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'IMG') {
                            optimizeImage(node, Date.now());
                        } else if (node.querySelectorAll) {
                            const images = node.querySelectorAll('img');
                            images.forEach(img => optimizeImage(img, Date.now()));
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Adjust image quality based on network conditions
    function adjustImageQualityForNetwork() {
        const images = document.querySelectorAll('img[data-optimized]');
        
        images.forEach(img => {
            const originalSrc = img.dataset.originalSrc;
            if (originalSrc) {
                optimizeImageSource(img);
                
                // Reload if image quality should change significantly
                if (isLowBandwidth && !img.dataset.lowQualityLoaded) {
                    img.dataset.lowQualityLoaded = 'true';
                    const newSrc = img.dataset.optimizedSrc;
                    if (newSrc !== img.src) {
                        img.src = newSrc;
                    }
                }
            }
        });
    }
    
    // Add CSS styles for image optimization
    function addImageOptimizationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .image-placeholder {
                opacity: 1;
                transition: opacity 0.3s ease-out;
            }
            
            .image-placeholder .placeholder-icon {
                font-size: 2rem;
                opacity: 0.3;
                position: absolute;
            }
            
            .image-loaded {
                opacity: 1 !important;
            }
            
            .image-error {
                filter: grayscale(100%) opacity(0.5);
            }
            
            .image-placeholder-fallback {
                display: none !important;
            }
            
            .image-placeholder-fallback + .image-placeholder {
                opacity: 1;
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                border: 1px solid #333;
            }
            
            /* Ensure images don't cause layout shift */
            img[data-optimized] {
                max-width: 100%;
                height: auto;
            }
            
            /* Loading spinner for images */
            .image-loading-indicator .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #2a2a2a;
                border-top: 2px solid #ff3b30;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize lazy loading
    function initLazyLoading() {
        // Re-initialize any images that might have been missed
        const unprocessedImages = document.querySelectorAll('img:not([data-optimized])');
        unprocessedImages.forEach((img, index) => {
            optimizeImage(img, index + 1000);
        });
    }
    
    // Public API for manual image optimization
    window.ImageOptimizer = {
        optimizeImage: optimizeImage,
        preloadImage: preloadImage,
        queueImageLoad: queueImageLoad,
        retryFailedImages: function() {
            const failedImages = document.querySelectorAll('img.image-error');
            failedImages.forEach(img => {
                img.classList.remove('image-error');
                loadImageWithRetry(img);
            });
        }
    };
    
    console.log('Advanced image optimization initialized');
})();