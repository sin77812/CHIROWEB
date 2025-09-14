// Portfolio Section Animations and Interactions
(function() {
    'use strict';
    
// Load portfolio data from DataManager
async function loadPortfolioData() {
    if (typeof window.dataManager === 'undefined') {
        console.warn('DataManager not available for main portfolio');
        return;
    }
    
    try {
        const portfolios = await window.dataManager.getPortfolios();
        const portfolioGrid = document.querySelector('.portfolio-grid');
    
        if (!portfolioGrid) return;
        
        console.log('Loading portfolio data for main page:', portfolios.length);
        
        // 처음 4개만 메인페이지에 표시 (2x2 그리드)
        const displayPortfolios = portfolios.slice(0, 4);
        
        portfolioGrid.innerHTML = displayPortfolios.map(item => `
            <div class="portfolio-item" data-category="${item.category}">
                <div class="portfolio-image">
                    <img src="${item.image || `https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(item.title)}`}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400/1a1a1a/666666?text=${encodeURIComponent(item.title)}';">
                    <div class="portfolio-overlay">
                        <div class="portfolio-info">
                            <h3 class="project-title">${item.title}</h3>
                            <p class="project-category">${getCategoryDisplayName(item.category)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 이벤트 재적용
        initPortfolioInteractions();
        initImageLoading();
        initScrollAnimations();
        
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
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
    
    // 데이터 매니저가 준비되면 데이터 로드
    if (typeof window.dataManager !== 'undefined') {
        loadPortfolioData();
    } else if (typeof window.DataManager !== 'undefined') {
        // DataManager 클래스가 있으면 인스턴스 생성
        window.dataManager = new window.DataManager();
        setTimeout(() => {
            loadPortfolioData();
        }, 200);
    } else {
        // 데이터 매니저 로드 대기 - 더 긴 시간 대기
        console.log('Waiting for DataManager...');
        setTimeout(() => {
            if (typeof window.DataManager !== 'undefined') {
                window.dataManager = new window.DataManager();
                loadPortfolioData();
            } else {
                console.warn('DataManager still not available');
            }
        }, 500);
    }
    
    // 데이터 변경 감지
    window.addEventListener('chiroDataChanged', (e) => {
        if (e.detail.type === 'portfolio') {
            loadPortfolioData();
        }
    });
    
    // Storage 변경 감지 (다른 탭에서의 변경사항)
    window.addEventListener('storage', (e) => {
        if (e.key === 'chiro_portfolio_data' || e.key === 'chiro_last_update') {
            loadPortfolioData();
        }
    });
    
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
                
                // If that also fails, use SVG fallback
                this.addEventListener('error', function() {
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik0yNTAgMjAwTDM1MCAyMDBNMzAwIDE1MEwzMDAgMjUwIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi/+Cjx0ZXh0IHg9IjMwMCIgeT0iMjMwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'.
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