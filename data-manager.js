// Data Manager - localStorage를 사용한 중앙 데이터 관리 시스템

class DataManager {
    constructor() {
        this.init();
    }
    
    init() {
        // 초기 데이터가 없으면 기본 데이터 설정
        if (!localStorage.getItem('chiro_portfolio_data')) {
            this.setDefaultPortfolioData();
        }
        if (!localStorage.getItem('chiro_blog_data')) {
            this.setDefaultBlogData();
        }
    }
    
    // Portfolio 기본 데이터
    setDefaultPortfolioData() {
        const defaultPortfolio = [
            {
                id: 1,
                title: "Tech Startup Dashboard",
                category: "web",
                year: 2024,
                description: "혁신적인 SaaS 플랫폼을 위한 직관적이고 현대적인 대시보드 디자인",
                image: "https://picsum.photos/600/400?random=1",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "Luxury Hotel Brand",
                category: "branding",
                year: 2024,
                description: "프리미엄 호텔 체인을 위한 고급스럽고 세련된 브랜드 아이덴티티",
                image: "https://picsum.photos/600/500?random=2",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: "Fashion E-commerce",
                category: "ecommerce",
                year: 2023,
                description: "모던 패션 브랜드를 위한 완전한 온라인 쇼핑몰 구축",
                image: "https://picsum.photos/600/600?random=3",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: "Digital Campaign",
                category: "marketing",
                year: 2024,
                description: "글로벌 테크 기업을 위한 통합 디지털 마케팅 캠페인",
                image: "https://picsum.photos/600/450?random=4",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: "Restaurant Website",
                category: "web",
                year: 2023,
                description: "파인다이닝 레스토랑을 위한 예술적이고 기능적인 웹사이트",
                image: "https://picsum.photos/600/350?random=5",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: "Fintech Startup",
                category: "branding",
                year: 2023,
                description: "혁신적인 핀테크 스타트업의 브랜드 아이덴티티 구축",
                image: "https://picsum.photos/600/550?random=6",
                status: "active",
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('chiro_portfolio_data', JSON.stringify(defaultPortfolio));
    }
    
    // Blog 기본 데이터
    setDefaultBlogData() {
        const defaultBlog = [
            {
                id: 1,
                title: "AI와 웹 디자인의 미래",
                category: "design",
                excerpt: "인공지능이 어떻게 웹 디자인 분야를 변화시키고 있는지 살펴봅니다.",
                content: "인공지능 기술의 발전으로 웹 디자인 분야에 혁신적인 변화가 일어나고 있습니다...",
                thumbnail: "https://picsum.photos/600/400?random=101",
                readTime: "5 min read",
                date: "2024-01-20",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "2024 UX/UI 디자인 트렌드",
                category: "design",
                excerpt: "올해 주목해야 할 사용자 경험과 인터페이스 디자인 트렌드를 소개합니다.",
                content: "2024년 UX/UI 디자인은 더욱 인간 중심적이고 직관적인 방향으로 발전하고 있습니다...",
                thumbnail: "https://picsum.photos/600/400?random=102",
                readTime: "7 min read",
                date: "2024-01-18",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: "반응형 웹 디자인 완벽 가이드",
                category: "development",
                excerpt: "모든 디바이스에서 완벽하게 작동하는 반응형 웹사이트 제작 방법을 알아봅니다.",
                content: "반응형 웹 디자인은 현대 웹 개발의 필수 요소가 되었습니다...",
                thumbnail: "https://picsum.photos/600/400?random=103",
                readTime: "10 min read",
                date: "2024-01-15",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                title: "브랜딩이 비즈니스에 미치는 영향",
                category: "marketing",
                excerpt: "강력한 브랜드 아이덴티티가 어떻게 비즈니스 성공을 이끄는지 분석합니다.",
                content: "브랜딩은 단순한 로고나 색상 선택을 넘어서는 전략적 비즈니스 도구입니다...",
                thumbnail: "https://picsum.photos/600/400?random=104",
                readTime: "6 min read",
                date: "2024-01-12",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                title: "디지털 마케팅 ROI 극대화 전략",
                category: "marketing",
                excerpt: "제한된 예산으로 최대 효과를 얻는 디지털 마케팅 전략을 공유합니다.",
                content: "효과적인 디지털 마케팅은 데이터 기반의 전략적 접근이 필요합니다...",
                thumbnail: "https://picsum.photos/600/400?random=105",
                readTime: "8 min read",
                date: "2024-01-10",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                title: "웹 성능 최적화 체크리스트",
                category: "development",
                excerpt: "웹사이트 속도를 향상시키고 사용자 경험을 개선하는 실무 가이드입니다.",
                content: "웹사이트 성능은 사용자 경험과 SEO에 직접적인 영향을 미칩니다...",
                thumbnail: "https://picsum.photos/600/400?random=106",
                readTime: "12 min read",
                date: "2024-01-08",
                status: "active",
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('chiro_blog_data', JSON.stringify(defaultBlog));
    }
    
    // Portfolio CRUD 메서드
    getPortfolios() {
        const data = localStorage.getItem('chiro_portfolio_data');
        return data ? JSON.parse(data) : [];
    }
    
    getPortfolio(id) {
        const portfolios = this.getPortfolios();
        return portfolios.find(item => item.id === parseInt(id));
    }
    
    savePortfolio(portfolio) {
        const portfolios = this.getPortfolios();
        
        if (portfolio.id) {
            // Update existing
            const index = portfolios.findIndex(item => item.id === portfolio.id);
            if (index !== -1) {
                portfolios[index] = { ...portfolios[index], ...portfolio };
            }
        } else {
            // Create new
            portfolio.id = Date.now();
            portfolio.createdAt = new Date().toISOString();
            portfolio.status = 'active';
            portfolios.push(portfolio);
        }
        
        localStorage.setItem('chiro_portfolio_data', JSON.stringify(portfolios));
        this.notifyDataChange('portfolio');
        return portfolio;
    }
    
    deletePortfolio(id) {
        const portfolios = this.getPortfolios();
        const filtered = portfolios.filter(item => item.id !== parseInt(id));
        localStorage.setItem('chiro_portfolio_data', JSON.stringify(filtered));
        this.notifyDataChange('portfolio');
        return true;
    }
    
    // Blog CRUD 메서드
    getBlogs() {
        const data = localStorage.getItem('chiro_blog_data');
        return data ? JSON.parse(data) : [];
    }
    
    getBlog(id) {
        const blogs = this.getBlogs();
        return blogs.find(item => item.id === parseInt(id));
    }
    
    saveBlog(blog) {
        const blogs = this.getBlogs();
        
        if (blog.id) {
            // Update existing
            const index = blogs.findIndex(item => item.id === blog.id);
            if (index !== -1) {
                blogs[index] = { ...blogs[index], ...blog };
            }
        } else {
            // Create new
            blog.id = Date.now();
            blog.createdAt = new Date().toISOString();
            blog.status = 'active';
            blog.date = new Date().toISOString().split('T')[0];
            blogs.unshift(blog); // Add to beginning for latest first
        }
        
        localStorage.setItem('chiro_blog_data', JSON.stringify(blogs));
        this.notifyDataChange('blog');
        return blog;
    }
    
    deleteBlog(id) {
        const blogs = this.getBlogs();
        const filtered = blogs.filter(item => item.id !== parseInt(id));
        localStorage.setItem('chiro_blog_data', JSON.stringify(filtered));
        this.notifyDataChange('blog');
        return true;
    }
    
    // 데이터 변경 알림 (다른 페이지에서 실시간 업데이트)
    notifyDataChange(type) {
        // Custom event 발생
        window.dispatchEvent(new CustomEvent('chiroDataChanged', { 
            detail: { type, timestamp: Date.now() } 
        }));
        
        // Storage event도 발생 (다른 탭/창에서 감지)
        localStorage.setItem('chiro_last_update', Date.now().toString());
    }
    
    // 카테고리별 필터링
    getPortfoliosByCategory(category) {
        const portfolios = this.getPortfolios();
        if (category === 'all') return portfolios;
        return portfolios.filter(item => item.category === category);
    }
    
    getBlogsByCategory(category) {
        const blogs = this.getBlogs();
        if (category === 'all') return blogs;
        return blogs.filter(item => item.category === category);
    }
    
    // 통계 데이터
    getStats() {
        const portfolios = this.getPortfolios();
        const blogs = this.getBlogs();
        
        return {
            portfolioCount: portfolios.length,
            blogCount: blogs.length,
            activePortfolios: portfolios.filter(p => p.status === 'active').length,
            activeBlogs: blogs.filter(b => b.status === 'active').length
        };
    }
    
    // 검색 기능
    searchPortfolios(query) {
        const portfolios = this.getPortfolios();
        const lowercaseQuery = query.toLowerCase();
        
        return portfolios.filter(item => 
            item.title.toLowerCase().includes(lowercaseQuery) ||
            item.description.toLowerCase().includes(lowercaseQuery) ||
            item.category.toLowerCase().includes(lowercaseQuery)
        );
    }
    
    searchBlogs(query) {
        const blogs = this.getBlogs();
        const lowercaseQuery = query.toLowerCase();
        
        return blogs.filter(item => 
            item.title.toLowerCase().includes(lowercaseQuery) ||
            item.excerpt.toLowerCase().includes(lowercaseQuery) ||
            item.content.toLowerCase().includes(lowercaseQuery) ||
            item.category.toLowerCase().includes(lowercaseQuery)
        );
    }
}

// 전역 인스턴스 생성
window.dataManager = new DataManager();

// 다른 스크립트에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}