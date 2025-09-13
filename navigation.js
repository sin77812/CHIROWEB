// Navigation JavaScript - Dark Theme
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        
        // Navigation Elements
        const navigation = document.querySelector('.main-navigation');
        const navToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.querySelector('.nav-mobile-menu');
        const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
        const indicatorDots = document.querySelectorAll('.nav-indicator-dot');
        
        // Navigation State
        let isMenuOpen = false;
        let lastScrollY = 0;
        let isScrolling = false;
        
        // Initialize Navigation
        init();
        
        function init() {
            // Reset any stuck body overflow first
            document.body.style.overflow = '';
            
            setupScrollBehavior();
            setupMobileMenu();
            setupSectionIndicator();
            setupSmoothScrolling();
            updateActiveSection();
        }
        
        // Scroll Behavior for Navigation Hide/Show
        function setupScrollBehavior() {
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavigation);
                    ticking = true;
                }
            });
            
            function updateNavigation() {
                const currentScrollY = window.pageYOffset;
                
                // Add scrolled class for styling
                if (currentScrollY > 50) {
                    navigation.classList.add('scrolled');
                } else {
                    navigation.classList.remove('scrolled');
                }
                
                // Hide/show navigation on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200 && !isMenuOpen) {
                    // Scrolling down - hide navigation
                    navigation.classList.add('hidden');
                } else {
                    // Scrolling up - show navigation
                    navigation.classList.remove('hidden');
                }
                
                lastScrollY = currentScrollY;
                updateActiveSection();
                ticking = false;
            }
        }
        
        // Mobile Menu Functionality
        function setupMobileMenu() {
            if (!navToggle || !mobileMenu) return;
            
            navToggle.addEventListener('click', toggleMobileMenu);
            
            // Close menu when clicking on links
            const mobileLinks = document.querySelectorAll('.nav-mobile-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (isMenuOpen && !navigation.contains(e.target)) {
                    closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMobileMenu();
                }
            });
        }
        
        function toggleMobileMenu() {
            isMenuOpen = !isMenuOpen;
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        }
        
        function closeMobileMenu() {
            isMenuOpen = false;
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Section Indicator Functionality
        function setupSectionIndicator() {
            indicatorDots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const targetSection = dot.getAttribute('data-target');
                    const targetElement = document.querySelector(targetSection);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop; // No offset needed for full viewport sections
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
        
        // Smooth Scrolling for Navigation Links
        function setupSmoothScrolling() {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Handle anchor links
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop;
                            
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                            
                            closeMobileMenu();
                        }
                    }
                });
            });
        }
        
        // Update Active Section Based on Scroll Position
        function updateActiveSection() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.pageYOffset + 100; // Reduced offset for full viewport sections
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Update navigation links
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
            
            // Update indicator dots
            indicatorDots.forEach(dot => {
                dot.classList.remove('active');
                const target = dot.getAttribute('data-target');
                if (target === `#${currentSection}`) {
                    dot.classList.add('active');
                }
            });
        }
        
        // Intersection Observer for Better Performance
        function setupIntersectionObserver() {
            const sections = document.querySelectorAll('section[id]');
            
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute('id');
                        updateActiveNavigationItem(sectionId);
                    }
                });
            }, observerOptions);
            
            sections.forEach(section => observer.observe(section));
        }
        
        function updateActiveNavigationItem(sectionId) {
            // Update navigation links
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            
            // Update indicator dots
            indicatorDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-target') === `#${sectionId}`) {
                    dot.classList.add('active');
                }
            });
        }
        
        // Throttle function for performance
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
        
        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && isMenuOpen) {
                closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', throttle(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMobileMenu();
            }
        }, 250));
        
        // Initialize intersection observer for better performance
        if ('IntersectionObserver' in window) {
            setupIntersectionObserver();
        }
        
        console.log('Navigation initialized successfully');
    });
    
})();