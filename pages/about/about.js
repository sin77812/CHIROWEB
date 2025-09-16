// About Page JavaScript
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize GSAP
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            initAnimations();
        }
        
        function initAnimations() {
            // Hero section animations
            const heroTitle = document.querySelectorAll('.title-line');
            const heroDescription = document.querySelector('.about-hero-description');
            const heroStats = document.querySelector('.about-hero-stats');
            
            // Animate hero elements
            if (heroTitle.length > 0) {
                gsap.to(heroTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power2.out",
                    delay: 0.5
                });
            }
            
            if (heroDescription) {
                gsap.to(heroDescription, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 1.2
                });
            }
            
            if (heroStats) {
                gsap.to(heroStats, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 1.5
                });
            }
            
            // Philosophy cards animation
            const philosophyCards = document.querySelectorAll('.philosophy-card');
            if (philosophyCards.length > 0) {
                gsap.fromTo(philosophyCards, 
                    {
                        opacity: 0,
                        y: 60
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: '.philosophy-grid',
                            start: 'top 80%',
                            end: 'bottom 20%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
            
            // Process steps animation
            const processSteps = document.querySelectorAll('.process-step');
            if (processSteps.length > 0) {
                processSteps.forEach((step, index) => {
                    gsap.fromTo(step,
                        {
                            opacity: 0,
                            x: -60
                        },
                        {
                            opacity: 1,
                            x: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: step,
                                start: 'top 85%',
                                end: 'bottom 15%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });
            }
            
            // Team section animation
            const teamText = document.querySelector('.team-text');
            const teamCta = document.querySelector('.team-cta');
            
            if (teamText) {
                gsap.fromTo(teamText,
                    {
                        opacity: 0,
                        x: -40
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: '.team-content',
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
            
            if (teamCta) {
                gsap.fromTo(teamCta,
                    {
                        opacity: 0,
                        x: 40
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: '.team-content',
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        },
                        delay: 0.2
                    }
                );
            }
            
            // Number counter animation for stats
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('+')) {
                    const number = parseInt(text.replace('+', ''));
                    const countUp = {value: 0};
                    
                    gsap.to(countUp, {
                        value: number,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            stat.textContent = Math.floor(countUp.value) + '+';
                        },
                        scrollTrigger: {
                            trigger: '.about-hero-stats',
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        },
                        delay: 1.5
                    });
                } else if (text.includes('%')) {
                    const number = parseInt(text.replace('%', ''));
                    const countUp = {value: 0};
                    
                    gsap.to(countUp, {
                        value: number,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            stat.textContent = Math.floor(countUp.value) + '%';
                        },
                        scrollTrigger: {
                            trigger: '.about-hero-stats',
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        },
                        delay: 1.5
                    });
                }
            });
            
            // Parallax effect for section headers
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach(title => {
                gsap.fromTo(title,
                    {
                        y: 30,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: title,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });
            
            // Hover effects for philosophy cards
            philosophyCards.forEach(card => {
                const icon = card.querySelector('.philosophy-icon');
                const title = card.querySelector('.philosophy-title');
                
                card.addEventListener('mouseenter', () => {
                    gsap.to(icon, {
                        scale: 1.1,
                        rotation: 5,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.to(title, {
                        color: '#FF3B30',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.to(title, {
                        color: '#FFFFFF',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
            
            // Smooth reveal for process timeline
            const timeline = document.querySelector('.process-timeline::before');
            if (document.querySelector('.process-timeline')) {
                ScrollTrigger.create({
                    trigger: '.process-timeline',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    onUpdate: self => {
                        const progress = self.progress;
                        gsap.to('.process-timeline::before', {
                            scaleY: progress,
                            transformOrigin: 'top',
                            duration: 0.1
                        });
                    }
                });
            }
        }
        
        // Smooth scroll for internal links
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: target,
                            offsetY: 100
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        // Intersection Observer for performance
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -20% 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.philosophy-card, .process-step, .team-text, .team-cta');
        animatedElements.forEach(el => observer.observe(el));
        
        console.log('About page initialized successfully');
    });
    
})();