// Portfolio Section Animations and Interactions
(function() {
    'use strict';
    
// 하드코딩된 포트폴리오 데이터 (Claude가 직접 관리)
const portfolioData = [
            {
                id: "1",
                title: "NBPKOREA",
                category: "web",
                year: 2024,
                description: "친환경 가스히터 설비 전문업체의 기업 웹사이트",
                thumbnail: "https://chiro-web.s3.ap-northeast-2.amazonaws.com/image/nbpkorea.jpg",
                url: "https://nbpkorea.vercel.app/",
                featured: true
            },
            {
                id: "2", 
                title: "고요속의미식",
                category: "web",
                year: 2024,
                description: "일본식 프렌치 레스토랑의 우아하고 세련된 브랜드 웹사이트",
                thumbnail: "../../assets/images/portfolio/goyomisik.jpg",
                url: "https://japanese-french.vercel.app/",
                featured: true
            },
            {
                id: "3",
                title: "리얼PT",
                category: "web", 
                year: 2024,
                description: "개인 맞춤형 피트니스 솔루션 헬스장 웹사이트",
                thumbnail: "../../assets/images/portfolio/LPT.jpg",
                url: "https://gym-umber-three.vercel.app/",
                featured: true
            },
            {
                id: "4",
                title: "유어모먼트 스튜디오",
                category: "web",
                year: 2024, 
                description: "특별한 순간을 기록하는 프리미엄 사진관 웹사이트",
                thumbnail: "../../assets/images/portfolio/STUDIO.jpg",
                url: "https://photo-cyan-five.vercel.app/",
                featured: true
            },
            {
                id: "5",
                title: "후니 인테리어",
                category: "web",
                year: 2024,
                description: "창의적인 공간 디자인을 전문으로 하는 인테리어 회사",
                thumbnail: "../../assets/images/portfolio/FUNI.jpg",
                url: "https://funiture-olive.vercel.app/",
                featured: false
            },
            {
                id: "6",
                title: "K&J Entertainment",
                category: "web",
                year: 2024,
                description: "엔터테인먼트 업계의 혁신을 추구하는 기업 웹사이트",
                thumbnail: "../../assets/images/portfolio/K&J.jpg",
                url: "https://kjco.vercel.app/",
                featured: false
            },
            {
                id: "7",
                title: "니드커피",
                category: "web",
                year: 2024,
                description: "성수동의 감성 넘치는 스페셜티 커피숍 웹사이트",
                thumbnail: "../../assets/images/portfolio/NEDCOFY.jpg",
                url: "https://coffee-sigma-tawny.vercel.app/",
                featured: false
            },
            {
                id: "8",
                title: "그레이스 스피치",
                category: "web",
                year: 2024,
                description: "전문적인 스피치 교육을 제공하는 학원 웹사이트",
                thumbnail: "../../assets/images/portfolio/gracespeech.jpg",
                url: "https://grace-speech.vercel.app/",
                featured: false
            },
            {
                id: "9",
                title: "온리짐",
                category: "web",
                year: 2024,
                description: "개인 맞춤 운동 프로그램을 제공하는 헬스장",
                thumbnail: "../../assets/images/portfolio/ONLYGYM.jpg",
                url: "https://www.onlygym247.com/",
                featured: false
            },
            {
                id: "10",
                title: "맨솔루션",
                category: "web",
                year: 2024,
                description: "남성 전용 의료 서비스를 제공하는 전문 클리닉",
                thumbnail: "../../assets/images/portfolio/mansolution.jpg",
                url: "https://mansolution.co.kr/",
                featured: false
            },
            {
                id: "11",
                title: "2D2FIGURE",
                category: "web",
                year: 2024,
                description: "피규어 주문제작 전문 업체",
                thumbnail: "https://chiro-web.s3.ap-northeast-2.amazonaws.com/2D2FIGURE.png",
                url: "https://2d2-omega.vercel.app/",
                featured: false
            },
            {
                id: "12",
                title: "INTERIOR",
                category: "web",
                year: 2024,
                description: "감각적인 공간을 만드는 인테리어 회사",
                thumbnail: "https://chiro-web.s3.ap-northeast-2.amazonaws.com/INTERIOR.png",
                url: "https://interior-orpin.vercel.app/",
                featured: false
            },
            {
                id: "13",
                title: "NANAMALL",
                category: "web",
                year: 2024,
                description: "일본 라이프스타일 쇼핑몰",
                thumbnail: "https://chiro-web.s3.ap-northeast-2.amazonaws.com/NANAMALL.png",
                url: "https://nana-lilac.vercel.app/",
                featured: false
            },
            {
                id: "14",
                title: "TOHIGH",
                category: "web",
                year: 2024,
                description: "AI를 적용시켜 회사의 성장을 돕는 비즈니스 컨설팅 회사",
                thumbnail: "https://chiro-web.s3.ap-northeast-2.amazonaws.com/tohigh.png",
                url: "#",
                featured: true
            }
];

// 전역 변수로 설정
window.portfolioData = portfolioData;

// Load portfolio data - 직접 하드코딩된 데이터 사용
function loadPortfolioData() {
    console.log('=== MAIN PAGE PORTFOLIO LOADING ===');
    
    const portfolios = portfolioData;
    console.log('Portfolio data available:', portfolios ? portfolios.length : 0, 'items');
    
    const portfolioGrid = document.querySelector('.portfolio-grid');
    console.log('Portfolio grid element found:', !!portfolioGrid);
    
    if (!portfolioGrid) {
        console.error('Portfolio grid not found on main page!');
        return;
    }
    
    if (!portfolios || portfolios.length === 0) {
        console.error('No portfolio data available!');
        return;
    }
    
    try {
        // 메인페이지에 표시할 4개 프로젝트 선택 (2x2 그리드)
        const featuredIds = ["1", "2", "11", "12"]; // NBPKOREA, 고요속의미식, 2D2FIGURE, INTERIOR
        const displayPortfolios = portfolios.filter(item => featuredIds.includes(item.id));
        
        console.log('Filtered portfolios for main page:', displayPortfolios.length);
        console.log('Selected projects:', displayPortfolios.map(p => p.title));
        
        portfolioGrid.innerHTML = displayPortfolios.map(item => `
            <div class="portfolio-item visible" data-category="${item.category}">
                <div class="portfolio-image">
                    <img 
                        src="${item.thumbnail}" 
                        alt="${item.title}" 
                        loading="lazy" 
                        data-fallback="https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(item.title)}"
                        onerror="this.onerror=null; this.src=this.dataset.fallback || '../../assets/images/portfolio/placeholder.jpg';"
                        class="portfolio-image-optimized loaded">
                    <div class="portfolio-overlay">
                        <div class="portfolio-info">
                            <h3 class="project-title">${item.title}</h3>
                            <p class="project-category">${getCategoryDisplayName(item.category)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log('Generated HTML for main page, length:', portfolioGrid.innerHTML.length);
        console.log('Main page portfolio loaded successfully:', displayPortfolios.length, 'items');
        
        // 이벤트 재적용
        initPortfolioInteractions();
        initImageLoading();
        initScrollAnimations();
        
    } catch (error) {
        console.error('ERROR loading main page portfolio:', error);
    }
}

// 카테고리 표시명 변환
function getCategoryDisplayName(category) {
    const categoryMap = {
        'web': 'Web Design',
        'branding': 'Brand Identity',
        'marketing': 'Digital Marketing',
        'ecommerce': 'E-commerce'
    };
    return categoryMap[category] || category;
}
    
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio.js DOM loaded');
    
    // 메인 페이지에서만 포트폴리오 로드
    if (document.querySelector('.portfolio-section')) {
        console.log('Main page detected, loading portfolio...');
        // 한 번만 실행
        loadPortfolioData();
    }
    
    // 포트폴리오 페이지에서 포트폴리오 로드
    if (document.querySelector('.portfolio-grid-section') && document.querySelector('#portfolioGrid')) {
        console.log('Portfolio page detected, loading all portfolios...');
        loadAllPortfolios();
        initFilterButtons();
        initLoadMoreButton();
        animateHeroSection();
    }
    
});

// Initialize image loading with fade-in effect
function initImageLoading() {
    const images = document.querySelectorAll('.portfolio-image img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                // Try placeholder image first, then fallback SVG
                const portfolioItem = this.closest('.portfolio-item');
                const titleElement = portfolioItem?.querySelector('.project-title');
                const title = titleElement?.textContent || 'Portfolio';
                
                // Try placeholder service first
                this.src = `https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(title)}`;
                
                // If that also fails, hide the image
                this.addEventListener('error', function() {
                    this.style.display = 'none';
                }, { once: true });
                
                this.classList.add('loaded');
            });
        }
    });
}

// Advanced scroll animations with stagger effect
function initScrollAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(portfolioItems).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                itemObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    portfolioItems.forEach(item => {
        itemObserver.observe(item);
    });
}

// Enhanced hover interactions
function initPortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const image = item.querySelector('.portfolio-image img');
        const info = item.querySelector('.portfolio-info');
        
        item.addEventListener('mouseenter', function() {
            // Add subtle parallax effect
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Enhance image scale
            if (image) {
                image.style.transform = 'scale(1.08)';
            }
            
            // Add subtle shadow
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            this.style.boxShadow = 'none';
        });
        
        // Add click ripple effect
        item.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// Ripple effect for click interaction
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 59, 48, 0.1);
        transform: translate(${x}px, ${y}px) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add CSS animation for ripple effect
const portfolioStyle = document.createElement('style');
portfolioStyle.textContent = `
    @keyframes ripple {
        to {
            transform: translate(var(--x), var(--y)) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(portfolioStyle);

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading optimization for images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('.portfolio-image img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Filter functionality (for future use)
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Load all portfolios for portfolio page
function loadAllPortfolios() {
    console.log('=== PORTFOLIO PAGE LOADING ALL ITEMS ===');
    
    const portfolioGrid = document.querySelector('#portfolioGrid');
    if (!portfolioGrid) {
        console.error('Portfolio grid not found on portfolio page!');
        return;
    }
    
    const portfolios = portfolioData;
    console.log('Loading all portfolios:', portfolios.length, 'items');
    
    // Show first 8 items
    const initialItems = 8;
    const displayPortfolios = portfolios.slice(0, initialItems);
    
    portfolioGrid.innerHTML = displayPortfolios.map(item => `
        <div class="portfolio-item visible" data-category="${item.category}">
            <div class="portfolio-image">
                <img 
                    src="${item.thumbnail}" 
                    alt="${item.title}" 
                    loading="lazy" 
                    onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(item.title)}';"
                    class="portfolio-image-optimized">
                <div class="portfolio-overlay">
                    <div class="portfolio-info">
                        <h3 class="project-title">${item.title}</h3>
                        <p class="project-category">${getCategoryDisplayName(item.category)}</p>
                    </div>
                    <a href="${item.url}" target="_blank" class="portfolio-link">
                        <span class="link-text">View Project</span>
                        <span class="link-icon">→</span>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update load more info
    updateLoadMoreInfo(initialItems, portfolios.length);
    
    // Initialize interactions
    initPortfolioInteractions();
    initImageLoading();
    initScrollAnimations();
}

// Initialize filter buttons
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            if (category === 'all') {
                portfolioItems.forEach(item => {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('visible'), 10);
                });
            } else {
                portfolioItems.forEach(item => {
                    if (item.dataset.category === category) {
                        item.style.display = 'block';
                        setTimeout(() => item.classList.add('visible'), 10);
                    } else {
                        item.classList.remove('visible');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            }
            
            // Update count
            const visibleItems = document.querySelectorAll('.portfolio-item[style*="block"]').length || 
                                document.querySelectorAll('.portfolio-item:not([style*="none"])').length;
            updateLoadMoreInfo(visibleItems, portfolioData.length);
        });
    });
}

// Initialize load more button
function initLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    let currentCount = 8;
    
    loadMoreBtn.addEventListener('click', function() {
        const portfolioGrid = document.querySelector('#portfolioGrid');
        const itemsToLoad = 4;
        const nextItems = portfolioData.slice(currentCount, currentCount + itemsToLoad);
        
        nextItems.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.dataset.category = item.category;
            portfolioItem.innerHTML = `
                <div class="portfolio-image">
                    <img 
                        src="${item.thumbnail}" 
                        alt="${item.title}" 
                        loading="lazy" 
                        onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(item.title)}';"
                        class="portfolio-image-optimized">
                    <div class="portfolio-overlay">
                        <div class="portfolio-info">
                            <h3 class="project-title">${item.title}</h3>
                            <p class="project-category">${getCategoryDisplayName(item.category)}</p>
                        </div>
                        <a href="${item.url}" target="_blank" class="portfolio-link">
                            <span class="link-text">View Project</span>
                            <span class="link-icon">→</span>
                        </a>
                    </div>
                </div>
            `;
            portfolioGrid.appendChild(portfolioItem);
            
            // Animate in
            setTimeout(() => portfolioItem.classList.add('visible'), 10);
        });
        
        currentCount += itemsToLoad;
        updateLoadMoreInfo(currentCount, portfolioData.length);
        
        // Hide button if all loaded
        if (currentCount >= portfolioData.length) {
            loadMoreBtn.style.display = 'none';
        }
        
        // Re-initialize interactions for new items
        initPortfolioInteractions();
        initImageLoading();
    });
}

// Update load more info
function updateLoadMoreInfo(shown, total) {
    const loadMoreInfo = document.querySelector('.load-more-info');
    if (loadMoreInfo) {
        loadMoreInfo.textContent = `${shown} of ${total}+ projects shown`;
    }
}

// Animate hero section
function animateHeroSection() {
    const titleLines = document.querySelectorAll('.title-line');
    const description = document.querySelector('.portfolio-hero-description');
    const stats = document.querySelector('.portfolio-stats');
    
    // Animate title lines
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
            line.style.transition = 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
        }, index * 100);
    });
    
    // Animate description
    if (description) {
        setTimeout(() => {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
            description.style.transition = 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
        }, 300);
    }
    
    // Animate stats
    if (stats) {
        setTimeout(() => {
            stats.style.opacity = '1';
            stats.style.transform = 'translateY(0)';
            stats.style.transition = 'all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
        }, 500);
    }
}

})(); // End IIFE
