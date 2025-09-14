// Blog Page JavaScript
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize components
        loadBlogData();
        initAnimations();
        initNewsletterForm();
        initArticleInteractions();
        initLoadMore();
        
        // GSAP Initialization
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        function initAnimations() {
            // Featured post animations
            const featuredImage = document.querySelector('.featured-image');
            const featuredContent = document.querySelector('.featured-content');
            
            if (featuredImage) {
                gsap.to(featuredImage, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.3
                });
            }
            
            if (featuredContent) {
                gsap.to(featuredContent, {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.5
                });
            }
            
            // Section header animation
            const sectionHeader = document.querySelector('.section-header');
            if (sectionHeader) {
                gsap.to(sectionHeader, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.articles-grid-section',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
            
            // Article cards stagger animation
            const articleCards = document.querySelectorAll('.article-card');
            
            // Intersection Observer for article cards
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
                        // Delay animation based on index
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                            gsap.to(entry.target, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            });
                        }, index * 100);
                    }
                });
            }, observerOptions);
            
            articleCards.forEach(card => {
                observer.observe(card);
            });
            
            // Newsletter section animation
            const newsletterText = document.querySelector('.newsletter-text');
            const newsletterForm = document.querySelector('.newsletter-form');
            
            if (newsletterText && newsletterForm) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: '.newsletter-section',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                })
                .to(newsletterText, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power2.out"
                })
                .to(newsletterForm, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.4");
            }
        }
        
        function initNewsletterForm() {
            const form = document.getElementById('subscribeForm');
            const successMessage = document.getElementById('subscribeSuccess');
            
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const email = form.email.value;
                    
                    // Validate email
                    if (!isValidEmail(email)) {
                        showFormError('올바른 이메일 주소를 입력해주세요.');
                        return;
                    }
                    
                    // Show loading state
                    const submitBtn = form.querySelector('.subscribe-btn');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = '구독 중...';
                    submitBtn.disabled = true;
                    
                    // Simulate API call
                    setTimeout(() => {
                        // Hide form and show success message
                        form.style.display = 'none';
                        successMessage.classList.add('show');
                        
                        // Reset form after animation
                        setTimeout(() => {
                            form.reset();
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }, 2000);
                        
                    }, 1500);
                });
            }
            
            function isValidEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            
            function showFormError(message) {
                const input = form.querySelector('input[type="email"]');
                
                // Remove existing error
                const existingError = form.querySelector('.form-error');
                if (existingError) {
                    existingError.remove();
                }
                
                // Create error element
                const errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                errorElement.textContent = message;
                errorElement.style.cssText = `
                    color: var(--accent-red);
                    font-size: 12px;
                    margin-top: 4px;
                    font-family: var(--font-primary);
                `;
                
                // Add error styling to input
                input.style.borderColor = 'var(--accent-red)';
                input.parentNode.appendChild(errorElement);
                
                // Remove error after 3 seconds
                setTimeout(() => {
                    input.style.borderColor = '';
                    if (errorElement.parentNode) {
                        errorElement.remove();
                    }
                }, 3000);
            }
            
            // Reset success message when clicking outside
            document.addEventListener('click', function(e) {
                if (!successMessage.contains(e.target) && successMessage.classList.contains('show')) {
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        form.style.display = 'block';
                    }, 100);
                }
            });
        }
        
        function initArticleInteractions() {
            const articleCards = document.querySelectorAll('.article-card');
            
            articleCards.forEach(card => {
                // Click to read article (for demo)
                card.addEventListener('click', function() {
                    const title = card.querySelector('.article-title').textContent;
                    
                    // Add click animation
                    gsap.to(card, {
                        scale: 0.98,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                    
                    // For demo - show alert
                    // In production, this would navigate to the full article
                    setTimeout(() => {
                        alert(`Opening article: "${title}"\n\nThis would normally open the full article page.`);
                    }, 200);
                });
                
                // Hover effect enhancements
                card.addEventListener('mouseenter', function() {
                    const image = card.querySelector('.article-image img');
                    if (image) {
                        gsap.to(image, {
                            scale: 1.1,
                            duration: 0.6,
                            ease: "power2.out"
                        });
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    const image = card.querySelector('.article-image img');
                    if (image) {
                        gsap.to(image, {
                            scale: 1,
                            duration: 0.6,
                            ease: "power2.out"
                        });
                    }
                });
            });
        }
        
        function initLoadMore() {
            const loadMoreBtn = document.querySelector('.load-more-btn');
            
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', function() {
                    // Add loading state
                    const btnText = loadMoreBtn.querySelector('.btn-text');
                    const btnIcon = loadMoreBtn.querySelector('.btn-icon');
                    
                    btnText.textContent = '로딩 중...';
                    btnIcon.textContent = '⟳';
                    btnIcon.style.animation = 'spin 1s linear infinite';
                    loadMoreBtn.disabled = true;
                    
                    // Simulate loading more articles
                    setTimeout(() => {
                        // For demo - just show message
                        btnText.textContent = '모든 글을 로드했습니다';
                        btnIcon.textContent = '✓';
                        btnIcon.style.animation = 'none';
                        
                        // Add some visual feedback
                        gsap.to(loadMoreBtn, {
                            backgroundColor: 'var(--success)',
                            borderColor: 'var(--success)',
                            duration: 0.3
                        });
                        
                        setTimeout(() => {
                            loadMoreBtn.style.opacity = '0.5';
                            loadMoreBtn.style.cursor = 'not-allowed';
                        }, 1000);
                        
                    }, 2000);
                });
            }
        }
        
        // Featured post read more functionality
        const readMoreBtn = document.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add click animation
                gsap.to(readMoreBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
                
                // For demo - show alert
                setTimeout(() => {
                    alert('Opening featured article...\n\nThis would normally open the full article page.');
                }, 200);
            });
        }
        
        // Smooth scrolling for internal links
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close success message if open
                const successMessage = document.getElementById('subscribeSuccess');
                if (successMessage && successMessage.classList.contains('show')) {
                    successMessage.classList.remove('show');
                    document.getElementById('subscribeForm').style.display = 'block';
                }
            }
        });
        
        // Performance optimization - pause animations when tab is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                gsap.globalTimeline.pause();
            } else {
                gsap.globalTimeline.resume();
            }
        });
        
        // Add CSS for spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Listen for data changes from Admin
        window.addEventListener('storage', function(e) {
            if (e.key === 'chiro_blogs' || e.key === 'chiro_blog_data' || e.key === 'chiro_last_update') {
                loadBlogData();
            }
        });
        
        console.log('Blog page initialized successfully');
    });
    
    // Load blog data from dataManager
    async function loadBlogData() {
        if (!window.dataManager) {
            console.warn('DataManager not available, using static content');
            return;
        }
        
        const blogs = await window.dataManager.getBlogs();
        const articlesGrid = document.querySelector('.articles-grid');
        
        if (articlesGrid && blogs.length > 0) {
            // Keep the featured post as is, update only the grid articles
            const featuredBlog = blogs[0];
            const gridBlogs = blogs.slice(1);
            
            // Update featured post
            const featuredTitle = document.querySelector('.featured-title');
            const featuredExcerpt = document.querySelector('.featured-excerpt');
            
            if (featuredTitle && featuredExcerpt && featuredBlog) {
                featuredTitle.innerHTML = `
                    <span class="title-line">${featuredBlog.title}</span>
                    <span class="title-line highlight">인사이트</span>
                `;
                featuredExcerpt.textContent = featuredBlog.excerpt || '최신 업데이트를 확인하세요.';
            }
            
            // Update articles grid
            articlesGrid.innerHTML = gridBlogs.map(blog => `
                <article class="article-card">
                    <div class="article-image">
                        <img src="${blog.thumbnail}" alt="${blog.title}" loading="lazy">
                        <div class="article-category">${getCategoryDisplayName(blog.category)}</div>
                    </div>
                    <div class="article-content">
                        <h3 class="article-title">${blog.title}</h3>
                        <p class="article-excerpt">
                            ${blog.excerpt}
                        </p>
                        <div class="article-meta">
                            <span class="article-date">${blog.date}</span>
                            <span class="article-read-time">${blog.readTime || '5 min read'}</span>
                        </div>
                    </div>
                </article>
            `).join('');
        }
    }
    
    function getCategoryDisplayName(category) {
        const categoryNames = {
            'design': 'Design',
            'development': 'Development',
            'marketing': 'Marketing',
            'news': 'News'
        };
        return categoryNames[category] || category;
    }
    
})();
