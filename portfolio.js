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
                thumbnail: "images/portfolio/nbpkorea.jpg",
                url: "https://nbpkorea.vercel.app/",
                featured: true
            },
            {
                id: "2", 
                title: "고요속의미식",
                category: "web",
                year: 2024,
                description: "일본식 프렌치 레스토랑의 우아하고 세련된 브랜드 웹사이트",
                thumbnail: "images/portfolio/goyomisik.jpg",
                url: "https://japanese-french.vercel.app/",
                featured: true
            },
            {
                id: "3",
                title: "리얼PT",
                category: "web", 
                year: 2024,
                description: "개인 맞춤형 피트니스 솔루션 헬스장 웹사이트",
                thumbnail: "images/portfolio/LPT.jpg",
                url: "https://gym-umber-three.vercel.app/",
                featured: true
            },
            {
                id: "4",
                title: "유어모먼트 스튜디오",
                category: "web",
                year: 2024, 
                description: "특별한 순간을 기록하는 프리미엄 사진관 웹사이트",
                thumbnail: "images/portfolio/STUDIO.jpg",
                url: "https://photo-cyan-five.vercel.app/",
                featured: true
            },
            {
                id: "5",
                title: "후니 인테리어",
                category: "web",
                year: 2024,
                description: "창의적인 공간 디자인을 전문으로 하는 인테리어 회사",
                thumbnail: "images/portfolio/FUNI.jpg",
                url: "https://funiture-olive.vercel.app/",
                featured: false
            },
            {
                id: "6",
                title: "K&J Entertainment",
                category: "web",
                year: 2024,
                description: "엔터테인먼트 업계의 혁신을 추구하는 기업 웹사이트",
                thumbnail: "images/portfolio/K&J.jpg",
                url: "https://kjco.vercel.app/",
                featured: false
            },
            {
                id: "7",
                title: "니드커피",
                category: "web",
                year: 2024,
                description: "성수동의 감성 넘치는 스페셜티 커피숍 웹사이트",
                thumbnail: "images/portfolio/NEDCOFY.jpg",
                url: "https://coffee-sigma-tawny.vercel.app/",
                featured: false
            },
            {
                id: "8",
                title: "그레이스 스피치",
                category: "web",
                year: 2024,
                description: "전문적인 스피치 교육을 제공하는 학원 웹사이트",
                thumbnail: "images/portfolio/gracespeech.jpg",
                url: "https://grace-speech.vercel.app/",
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
        const featuredIds = ["1", "2", "5", "10"]; // NBPKOREA, 고요속의미식, 후니인테리어, 맨솔루션
        const displayPortfolios = portfolios.filter(item => featuredIds.includes(item.id));
        
        console.log('Filtered portfolios for main page:', displayPortfolios.length);
        console.log('Selected projects:', displayPortfolios.map(p => p.title));
        
        portfolioGrid.innerHTML = displayPortfolios.map(item => `
            <div class="portfolio-item visible" data-category="${item.category}">
                <div class="portfolio-image">
                    <img 
                        data-src="${item.thumbnail}" 
                        alt="${item.title}" 
                        loading="lazy" 
                        data-fallback="https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(item.title)}"
                        onerror="this.onerror=null; this.src=this.dataset.fallback || 'images/portfolio/placeholder.jpg';"
                        class="portfolio-image-optimized">
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
        // 여러 번 시도
        loadPortfolioData();
        setTimeout(loadPortfolioData, 100);
        setTimeout(loadPortfolioData, 500);
        setTimeout(loadPortfolioData, 1000);
    }
    
    initPortfolioAnimations();
});

// Initialize portfolio animations
function initPortfolioAnimations() {
    const portfolioSection = document.querySelector('.portfolio-section');
    
    if (!portfolioSection) return;
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px 0px'
    });
    
    observer.observe(portfolioSection);
}

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

})(); // End IIFE
