// MongoDB API를 사용한 데이터 관리 시스템
// localStorage fallback 포함

class DataManager {
    constructor() {
        this.apiBaseUrl = this.getApiBaseUrl();
        this.isOnline = navigator.onLine;
        
        // 네트워크 상태 감지
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('온라인 모드로 전환');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('오프라인 모드로 전환');
        });
        
        this.init();
    }
    
    getApiBaseUrl() {
        // 개발 환경에서는 localhost:3000, 프로덕션에서는 현재 호스트 사용
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        return `${window.location.origin}/api`;
    }
    
    async init() {
        // API가 사용 가능한지 확인
        try {
            const response = await fetch(`${this.apiBaseUrl}/stats`);
            this.apiAvailable = response.ok;
            console.log('MongoDB API 연결:', this.apiAvailable ? '성공' : '실패');
        } catch (error) {
            this.apiAvailable = false;
            console.log('MongoDB API 연결 실패, localStorage 사용');
        }
        
        // localStorage 초기 데이터 설정 (fallback용)
        if (!localStorage.getItem('chiro_portfolio_data')) {
            this.setDefaultPortfolioData();
        }
        if (!localStorage.getItem('chiro_blog_data')) {
            this.setDefaultBlogData();
        }
    }
    
    // API 요청 헬퍼 함수
    async apiRequest(endpoint, options = {}) {
        if (!this.apiAvailable || !this.isOnline) {
            throw new Error('API 사용 불가');
        }
        
        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API 오류: ${response.status}`);
        }
        
        if (response.status === 204) {
            return null; // DELETE 요청의 경우
        }
        
        return await response.json();
    }
    
    // Portfolio 관련 메서드
    async getPortfolios() {
        try {
            const data = await this.apiRequest('/portfolios');
            // localStorage에도 백업
            localStorage.setItem('chiro_portfolio_data', JSON.stringify(data));
            return data;
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            return this.getPortfoliosFromStorage();
        }
    }
    
    async getPortfolio(id) {
        try {
            return await this.apiRequest(`/portfolios/${id}`);
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            const portfolios = this.getPortfoliosFromStorage();
            return portfolios.find(p => p._id === id || p.id === id);
        }
    }
    
    async savePortfolio(portfolio) {
        try {
            let result;
            if (portfolio._id || portfolio.id) {
                // 수정
                const id = portfolio._id || portfolio.id;
                result = await this.apiRequest(`/portfolios/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(portfolio)
                });
            } else {
                // 생성
                result = await this.apiRequest('/portfolios', {
                    method: 'POST',
                    body: JSON.stringify(portfolio)
                });
            }
            
            // localStorage 업데이트
            await this.syncPortfoliosToStorage();
            this.notifyDataChange('portfolio');
            return result;
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            return this.savePortfolioToStorage(portfolio);
        }
    }
    
    async deletePortfolio(id) {
        try {
            await this.apiRequest(`/portfolios/${id}`, {
                method: 'DELETE'
            });
            
            // localStorage 업데이트
            await this.syncPortfoliosToStorage();
            this.notifyDataChange('portfolio');
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            return this.deletePortfolioFromStorage(id);
        }
    }
    
    // Blog 관련 메서드
    async getBlogs() {
        try {
            const data = await this.apiRequest('/blogs');
            // localStorage에도 백업
            localStorage.setItem('chiro_blog_data', JSON.stringify(data));
            return data;
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            return this.getBlogsFromStorage();
        }
    }
    
    async getBlog(id) {
        try {
            return await this.apiRequest(`/blogs/${id}`);
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            const blogs = this.getBlogsFromStorage();
            return blogs.find(b => b._id === id || b.id === id);
        }
    }
    
    async saveBlog(blog) {
        try {
            let result;
            if (blog._id || blog.id) {
                // 수정
                const id = blog._id || blog.id;
                result = await this.apiRequest(`/blogs/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(blog)
                });
            } else {
                // 생성
                result = await this.apiRequest('/blogs', {
                    method: 'POST',
                    body: JSON.stringify(blog)
                });
            }
            
            // localStorage 업데이트
            await this.syncBlogsToStorage();
            this.notifyDataChange('blog');
            return result;
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            return this.saveBlogToStorage(blog);
        }
    }
    
    async deleteBlog(id) {
        try {
            await this.apiRequest(`/blogs/${id}`, {
                method: 'DELETE'
            });
            
            // localStorage 업데이트
            await this.syncBlogsToStorage();
            this.notifyDataChange('blog');
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            return this.deleteBlogFromStorage(id);
        }
    }
    
    // 통계 데이터
    async getStats() {
        try {
            return await this.apiRequest('/stats');
        } catch (error) {
            console.warn('API 사용 불가, localStorage 사용:', error.message);
            const portfolios = this.getPortfoliosFromStorage();
            const blogs = this.getBlogsFromStorage();
            return {
                portfolioCount: portfolios.length,
                blogCount: blogs.length,
                viewCount: 1234,
                contactCount: 23
            };
        }
    }
    
    // localStorage 동기화 메서드
    async syncPortfoliosToStorage() {
        try {
            const portfolios = await this.apiRequest('/portfolios');
            localStorage.setItem('chiro_portfolio_data', JSON.stringify(portfolios));
        } catch (error) {
            console.warn('동기화 실패:', error.message);
        }
    }
    
    async syncBlogsToStorage() {
        try {
            const blogs = await this.apiRequest('/blogs');
            localStorage.setItem('chiro_blog_data', JSON.stringify(blogs));
        } catch (error) {
            console.warn('동기화 실패:', error.message);
        }
    }
    
    // localStorage fallback 메서드들
    getPortfoliosFromStorage() {
        const data = localStorage.getItem('chiro_portfolio_data');
        return data ? JSON.parse(data) : [];
    }
    
    savePortfolioToStorage(portfolio) {
        const portfolios = this.getPortfoliosFromStorage();
        
        if (portfolio.id || portfolio._id) {
            // 수정
            const index = portfolios.findIndex(p => 
                p.id === portfolio.id || p._id === portfolio._id || 
                p.id === portfolio._id || p._id === portfolio.id
            );
            if (index !== -1) {
                portfolios[index] = { ...portfolios[index], ...portfolio };
            }
        } else {
            // 생성
            portfolio.id = Date.now();
            portfolio.createdAt = new Date().toISOString();
            portfolios.push(portfolio);
        }
        
        localStorage.setItem('chiro_portfolio_data', JSON.stringify(portfolios));
        this.notifyDataChange('portfolio');
        return portfolio;
    }
    
    deletePortfolioFromStorage(id) {
        const portfolios = this.getPortfoliosFromStorage();
        const filtered = portfolios.filter(p => p.id !== id && p._id !== id);
        localStorage.setItem('chiro_portfolio_data', JSON.stringify(filtered));
        this.notifyDataChange('portfolio');
    }
    
    getBlogsFromStorage() {
        const data = localStorage.getItem('chiro_blog_data');
        return data ? JSON.parse(data) : [];
    }
    
    saveBlogToStorage(blog) {
        const blogs = this.getBlogsFromStorage();
        
        if (blog.id || blog._id) {
            // 수정
            const index = blogs.findIndex(b => 
                b.id === blog.id || b._id === blog._id ||
                b.id === blog._id || b._id === blog.id
            );
            if (index !== -1) {
                blogs[index] = { ...blogs[index], ...blog };
            }
        } else {
            // 생성
            blog.id = Date.now();
            blog.date = new Date().toISOString().split('T')[0];
            blog.createdAt = new Date().toISOString();
            blogs.push(blog);
        }
        
        localStorage.setItem('chiro_blog_data', JSON.stringify(blogs));
        this.notifyDataChange('blog');
        return blog;
    }
    
    deleteBlogFromStorage(id) {
        const blogs = this.getBlogsFromStorage();
        const filtered = blogs.filter(b => b.id !== id && b._id !== id);
        localStorage.setItem('chiro_blog_data', JSON.stringify(filtered));
        this.notifyDataChange('blog');
    }
    
    // 이벤트 알림
    notifyDataChange(type) {
        const event = new CustomEvent('dataManagerUpdate', {
            detail: { type, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
        
        // Storage 이벤트도 발생
        const storageEvent = new StorageEvent('storage', {
            key: `chiro_${type}_data`,
            newValue: localStorage.getItem(`chiro_${type}_data`),
            storageArea: localStorage
        });
        window.dispatchEvent(storageEvent);
    }
    
    // 기본 데이터 설정 (변경 없음)
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
            }
        ];
        localStorage.setItem('chiro_portfolio_data', JSON.stringify(defaultPortfolio));
    }
    
    setDefaultBlogData() {
        const defaultBlogs = [
            {
                id: 1,
                title: "2025년 웹 디자인 트렌드",
                category: "design",
                excerpt: "새해를 맞아 웹 디자인 분야에서 주목해야 할 핵심 트렌드들을 살펴봅니다.",
                content: "웹 디자인 트렌드에 대한 상세한 내용...",
                thumbnail: "https://picsum.photos/600/400?random=10",
                readTime: "5 min read",
                date: new Date().toISOString().split('T')[0],
                status: "active",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('chiro_blog_data', JSON.stringify(defaultBlogs));
    }
}

// 전역 인스턴스 생성
window.dataManager = new DataManager();

console.log('📊 DataManager (MongoDB API) 초기화 완료');