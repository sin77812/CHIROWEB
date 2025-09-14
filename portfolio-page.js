// Portfolio Page JavaScript
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize components
        loadPortfolioData();
        initAnimations();
        initFiltering();
        initLoadMore();
        initLazyLoading();
        initLikeButtons();
        
        // GSAP Initialization
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        function initAnimations() {
            // Hero animations
            const heroTitle = document.querySelectorAll('.title-line');
            const heroDescription = document.querySelector('.portfolio-hero-description');
            const heroStats = document.querySelector('.portfolio-stats');
            
            // Animate hero elements
            if (heroTitle.length > 0) {
                gsap.to(heroTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power2.out",
                    delay: 0.3
                });
            }
            
            if (heroDescription) {
                gsap.to(heroDescription, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.8
                });
            }
            
            if (heroStats) {
                gsap.to(heroStats, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 1.1
                });
            }
            
            // Portfolio items stagger animation
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            
            // Intersection Observer for portfolio items
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                        // Delay animation based on index
                        setTimeout(() => {
                            entry.target.classList.add('visible');
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
            
            portfolioItems.forEach(item => {
                observer.observe(item);
            });
            
            // CTA section animation
            const ctaTitle = document.querySelector('.cta-title');
            const ctaDescription = document.querySelector('.cta-description');
            const ctaActions = document.querySelector('.cta-actions');
            
            if (ctaTitle && ctaDescription && ctaActions) {
                gsap.fromTo([ctaTitle, ctaDescription, ctaActions],
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: '.portfolio-cta-section',
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
        }
        
        function initFiltering() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            const sortDropdown = document.querySelector('.sort-dropdown');
            
            // Filter functionality
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const category = button.dataset.category;
                    filterPortfolioItems(category);
                });
            });
            
            // Sort functionality
            if (sortDropdown) {
                sortDropdown.addEventListener('change', (e) => {
                    const sortBy = e.target.value;
                    sortPortfolioItems(sortBy);
                });
            }
            
            function filterPortfolioItems(category) {
                portfolioItems.forEach((item, index) => {
                    const itemCategory = item.dataset.category;
                    const shouldShow = category === 'all' || itemCategory === category;
                    
                    if (shouldShow) {
                        // Show item
                        item.classList.remove('hidden');
                        item.classList.add('filtering-in');
                        item.classList.remove('filtering-out');
                        
                        // Animate in with stagger
                        setTimeout(() => {
                            gsap.to(item, {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.5,
                                ease: "back.out(1.7)"
                            });
                        }, index * 50);
                        
                    } else {
                        // Hide item
                        item.classList.add('filtering-out');
                        item.classList.remove('filtering-in');
                        
                        gsap.to(item, {
                            opacity: 0,
                            scale: 0.8,
                            y: 20,
                            duration: 0.3,
                            ease: "power2.in",
                            onComplete: () => {
                                item.classList.add('hidden');
                            }
                        });
                    }
                });
                
                // Update count
                updateProjectCount();
            }
            
            function sortPortfolioItems(sortBy) {
                const grid = document.querySelector('.portfolio-grid');
                const items = Array.from(portfolioItems);
                
                let sortedItems = [...items];
                
                switch(sortBy) {
                    case 'latest':
                        sortedItems.sort((a, b) => {
                            return parseInt(b.dataset.year) - parseInt(a.dataset.year);
                        });
                        break;
                    case 'popular':
                        sortedItems.sort((a, b) => {
                            const aLikes = parseInt(a.querySelector('.like-btn').textContent.match(/\d+/)[0]);
                            const bLikes = parseInt(b.querySelector('.like-btn').textContent.match(/\d+/)[0]);
                            return bLikes - aLikes;
                        });
                        break;
                    case 'alphabetical':
                        sortedItems.sort((a, b) => {
                            const aTitle = a.querySelector('.project-title').textContent;
                            const bTitle = b.querySelector('.project-title').textContent;
                            return aTitle.localeCompare(bTitle);
                        });
                        break;
                }
                
                // Animate sort
                gsap.to(items, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    stagger: 0.05,
                    onComplete: () => {
                        // Reorder DOM
                        sortedItems.forEach(item => {
                            grid.appendChild(item);
                        });
                        
                        // Animate back in
                        gsap.to(sortedItems, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.05,
                            ease: "power2.out"
                        });
                    }
                });
            }
            
            function updateProjectCount() {
                const visibleItems = document.querySelectorAll('.portfolio-item:not(.hidden)').length;
                const totalItems = portfolioItems.length;
                const loadMoreInfo = document.querySelector('.load-more-info');
                
                if (loadMoreInfo) {
                    loadMoreInfo.textContent = `${visibleItems} of ${totalItems}+ projects shown`;
                }
            }
        }
        
        function initLoadMore() {
            const loadMoreBtn = document.querySelector('.load-more-btn');
            const portfolioGrid = document.querySelector('.portfolio-grid');
            
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => {
                    // Simulate loading more projects
                    loadMoreBtn.classList.add('loading');
                    loadMoreBtn.querySelector('.btn-text').textContent = 'Loading...';
                    
                    setTimeout(() => {
                        // Add more portfolio items here
                        // For demo, we'll just show a message
                        loadMoreBtn.querySelector('.btn-text').textContent = 'All Projects Loaded';
                        loadMoreBtn.disabled = true;
                        loadMoreBtn.style.opacity = '0.5';
                    }, 1500);
                });
            }
        }
        
        function initLazyLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            
                            // Add fade in effect
                            img.addEventListener('load', () => {
                                gsap.to(img, {
                                    opacity: 1,
                                    duration: 0.5,
                                    ease: "power2.out"
                                });
                            });
                            
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                images.forEach(img => {
                    img.style.opacity = '0';
                    imageObserver.observe(img);
                });
            }
        }
        
        function initLikeButtons() {
            const likeButtons = document.querySelectorAll('.like-btn');
            
            likeButtons.forEach(button => {
                let isLiked = false;
                const originalText = button.textContent;
                const likeCount = parseInt(originalText.match(/\d+/)[0]);
                
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (!isLiked) {
                        // Like animation
                        button.textContent = `♥ ${likeCount + 1}`;
                        button.style.color = '#FF3B30';
                        
                        gsap.fromTo(button, {
                            scale: 1
                        }, {
                            scale: 1.2,
                            duration: 0.1,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.inOut"
                        });
                        
                        isLiked = true;
                    } else {
                        // Unlike
                        button.textContent = originalText;
                        button.style.color = '';
                        isLiked = false;
                    }
                });
            });
        }
        
        // Smooth scrolling for filter links
        const filterBar = document.querySelector('.portfolio-filter-section');
        if (filterBar) {
            let lastScrollY = 0;
            
            window.addEventListener('scroll', () => {
                const currentScrollY = window.pageYOffset;
                
                if (currentScrollY > 200) {
                    if (currentScrollY > lastScrollY) {
                        // Scrolling down - hide filter bar
                        gsap.to(filterBar, {
                            y: -100,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    } else {
                        // Scrolling up - show filter bar
                        gsap.to(filterBar, {
                            y: 0,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    }
                }
                
                lastScrollY = currentScrollY;
            });
        }
        
        // View Details button functionality
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Get project data
                const card = button.closest('.portfolio-card');
                const title = card.querySelector('.project-title').textContent;
                
                // For demo - show alert
                // In production, this would open a modal or navigate to detail page
                alert(`Opening details for: ${title}\n\nThis would normally open a detailed project view.`);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals/overlays
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter && activeFilter.dataset.category !== 'all') {
                    document.querySelector('.filter-btn[data-category="all"]').click();
                }
            }
        });
        
        // Performance optimization - pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                gsap.globalTimeline.pause();
            } else {
                gsap.globalTimeline.resume();
            }
        });
        
        // Listen for data changes from Admin
        window.addEventListener('storage', function(e) {
            if (e.key === 'chiro_portfolios' || e.key === 'chiro_portfolio_data' || e.key === 'chiro_last_update') {
                loadPortfolioData();
            }
        });
        
        console.log('Portfolio page initialized successfully');
    });
    
    // Portfolio data - direct copy from portfolio.js
    const portfolioPageData = [
        {
            id: "1",
            title: "NBPKOREA",
            category: "web",
            year: 2024,
            description: "프리미엄 헬스케어 브랜드의 디지털 플랫폼 구축",
            thumbnail: "images/portfolio/nbpkorea.jpg",
            url: "http://www.nbpkorea.com",
            featured: true
        },
        {
            id: "2",
            title: "고요속의미식",
            category: "branding",
            year: 2024,
            description: "프리미엄 다이닝 브랜드 아이덴티티 디자인",
            thumbnail: "images/portfolio/goyomisik.jpg",
            url: "https://www.goyomisik.co.kr",
            featured: true
        },
        {
            id: "3",
            title: "리얼PT",
            category: "web",
            year: 2024,
            description: "피트니스 플랫폼 웹사이트 및 시스템 개발",
            thumbnail: "images/portfolio/LPT.jpg",
            url: "https://www.realpt.co.kr",
            featured: true
        },
        {
            id: "4",
            title: "유어모먼트 스튜디오",
            category: "branding",
            year: 2024,
            description: "프리미엄 포토 스튜디오 브랜드 디자인",
            thumbnail: "images/portfolio/STUDIO.jpg",
            url: "https://bit.ly/3YJnJxJ",
            featured: true
        },
        {
            id: "5",
            title: "후니 인테리어",
            category: "web",
            year: 2024,
            description: "인테리어 전문 기업 웹사이트 디자인 및 개발",
            thumbnail: "images/portfolio/FUNI.jpg",
            url: "https://www.funiinterior.com/",
            featured: true
        },
        {
            id: "6",
            title: "K&J Entertainment",
            category: "branding",
            year: 2024,
            description: "엔터테인먼트 기업 브랜드 아이덴티티 구축",
            thumbnail: "images/portfolio/K&J.jpg",
            url: "https://bit.ly/48K3t9t",
            featured: true
        },
        {
            id: "7",
            title: "니드커피",
            category: "branding",
            year: 2024,
            description: "스페셜티 커피 브랜드 디자인 및 마케팅",
            thumbnail: "images/portfolio/NEDCOFY.jpg",
            url: "https://www.instagram.com/needcoffee.co/",
            featured: false
        },
        {
            id: "8",
            title: "그레이스 스피치",
            category: "web",
            year: 2024,
            description: "스피치 교육 플랫폼 웹사이트 구축",
            thumbnail: "images/portfolio/gracespeech.jpg",
            url: "https://gracespeech.modoo.at/",
            featured: false
        },
        {
            id: "9",
            title: "온리짐",
            category: "web",
            year: 2024,
            description: "개인 맞춤 운동 프로그램을 제공하는 헬스장",
            thumbnail: "images/portfolio/ONLYGYM.jpg",
            url: "https://www.onlygym247.com/",
            featured: false
        },
        {
            id: "10",
            title: "맨솔루션",
            category: "web",
            year: 2024,
            description: "남성 전용 의료 서비스를 제공하는 전문 클리닉",
            thumbnail: "images/portfolio/mansolution.jpg",
            url: "https://mansolution.co.kr/",
            featured: false
        }
    ];

    // Load portfolio data 
    async function loadPortfolioData() {
        // Force clear ALL localStorage data to prevent any conflicts
        localStorage.clear();
        
        // Add cache busting
        const timestamp = Date.now();
        console.log('Cache-busting timestamp:', timestamp);
        
        const portfolios = portfolioPageData;
        const portfolioGrid = document.getElementById('portfolioGrid');
        console.log('Force loading NEW portfolio data:', portfolios.length, 'items');
        
        if (portfolioGrid) {
            // Force clear existing content first
            portfolioGrid.innerHTML = '';
            console.log('Cleared existing content, now loading:', portfolios.length, 'items');
            
            // Force render new content
            portfolioGrid.innerHTML = portfolios.map(item => `
                <div class="portfolio-item" data-category="${item.category}" data-year="${item.year}">
                    <div class="portfolio-card">
                        <div class="portfolio-image">
                            <img src="${item.thumbnail || item.image || 'images/portfolio/placeholder.jpg'}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='images/portfolio/placeholder.jpg'">
                                <div class="portfolio-overlay">
                                    <div class="project-info">
                                        <h3 class="project-title">${item.title}</h3>
                                        <p class="project-category">${getCategoryDisplayName(item.category)} • ${item.year}</p>
                                        <p class="project-description">${item.description}</p>
                                    </div>
                                    <div class="project-actions">
                                        <button class="action-btn view-btn">View Details</button>
                                        <button class="action-btn like-btn"><i class="icon icon-heart"></i> ${Math.floor(Math.random() * 50) + 10}</button>
                                    </div>
                                </div>
                            </div>
                            <div class="portfolio-meta">
                                <span class="project-badge ${item.category}">${getCategoryDisplayName(item.category)}</span>
                                <span class="project-year">${item.year}</span>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Update project count
                const loadMoreInfo = document.querySelector('.load-more-info');
                if (loadMoreInfo) {
                    loadMoreInfo.textContent = `${portfolios.length} of ${portfolios.length}+ projects shown`;
                }
            }
        } catch (error) {
            console.error('Failed to load portfolio page data:', error);
        }
    }
    
    function getCategoryDisplayName(category) {
        const categoryNames = {
            'web': 'Web Design',
            'branding': 'Branding', 
            'marketing': 'Marketing',
            'ecommerce': 'E-commerce'
        };
        return categoryNames[category] || category;
    }
    
})();
