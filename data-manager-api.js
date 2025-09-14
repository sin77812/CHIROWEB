// API-based Data Manager - MongoDB와 연동하는 중앙 데이터 관리 시스템

class APIDataManager {
    constructor() {
        this.baseURL = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : window.location.origin;
        this.cache = {
            portfolios: null,
            blogs: null,
            lastUpdate: {
                portfolios: null,
                blogs: null
            }
        };
        this.cacheTimeout = 5 * 60 * 1000; // 5분 캐시
    }
    
    // Cache 관리
    isCacheValid(type) {
        const lastUpdate = this.cache.lastUpdate[type];
        if (!lastUpdate) return false;
        return (Date.now() - lastUpdate) < this.cacheTimeout;
    }
    
    updateCache(type, data) {
        this.cache[type] = data;
        this.cache.lastUpdate[type] = Date.now();
    }
    
    // API 요청 헬퍼
    async makeRequest(url, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            // 에러 시 캐시된 데이터 반환 시도
            return this.handleAPIError(error);
        }
    }
    
    handleAPIError(error) {
        console.warn('API 연결 실패, 캐시 데이터 사용:', error.message);
        // localStorage에서 백업 데이터 가져오기
        const fallbackPortfolios = JSON.parse(localStorage.getItem('chiro_portfolio_backup') || '[]');
        const fallbackBlogs = JSON.parse(localStorage.getItem('chiro_blog_backup') || '[]');
        
        return {
            portfolios: fallbackPortfolios,
            blogs: fallbackBlogs
        };
    }
    
    // Portfolio 관련 메서드들
    async getPortfolios(useCache = true) {
        // 유효한 캐시가 있으면 사용
        if (useCache && this.cache.portfolios && this.isCacheValid('portfolios')) {
            return this.cache.portfolios;
        }

        try {
            // 1) API에서 최신 데이터 우선
            try {
                const apiPortfolios = await this.makeRequest('/api/portfolios');
                if (Array.isArray(apiPortfolios)) {
                    this.updateCache('portfolios', apiPortfolios);
                    localStorage.setItem('chiro_portfolio_backup', JSON.stringify(apiPortfolios));
                    return apiPortfolios;
                }
            } catch (apiErr) {
                // API 실패 시 아래 로컬+정적 데이터 사용
            }

            // 2) LocalStorage의 관리자 데이터
            let adminPortfolios = [];
            try {
                adminPortfolios = JSON.parse(localStorage.getItem('chiro_portfolios') || '[]');
                if (!Array.isArray(adminPortfolios)) adminPortfolios = [];
                console.log('Admin portfolios found:', adminPortfolios.length);
            } catch (e) {
                console.warn('Failed to parse admin portfolios');
            }

            // 3) 정적 기본 데이터 결합 (portfolio-data-real.js)
            let staticPortfolios = [];
            if (typeof realPortfolioData !== 'undefined') {
                staticPortfolios = realPortfolioData;
                console.log('Static portfolios found:', staticPortfolios.length);
            }

            const allPortfolios = [...adminPortfolios, ...staticPortfolios];
            this.updateCache('portfolios', allPortfolios);
            return allPortfolios;
        } catch (error) {
            console.error('Portfolio 데이터 로드 실패:', error);
            // 최후 폴백: 백업 데이터
            return JSON.parse(localStorage.getItem('chiro_portfolio_backup') || '[]');
        }
    }
    
    async getPortfolio(id) {
        try {
            return await this.makeRequest(`/api/portfolios/${id}`);
        } catch (error) {
            console.error('Portfolio 개별 데이터 로드 실패:', error);
            const portfolios = await this.getPortfolios();
            return portfolios.find(p => p._id === id || p.id === id);
        }
    }
    
    async createPortfolio(data) {
        try {
            const result = await this.makeRequest('/api/portfolios', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            // 캐시 무효화
            this.cache.portfolios = null;
            this.cache.lastUpdate.portfolios = null;
            
            return result;
        } catch (error) {
            console.error('Portfolio 생성 실패:', error);
            throw error;
        }
    }
    
    async updatePortfolio(id, data) {
        try {
            const result = await this.makeRequest(`/api/portfolios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            
            // 캐시 무효화
            this.cache.portfolios = null;
            this.cache.lastUpdate.portfolios = null;
            
            return result;
        } catch (error) {
            console.error('Portfolio 수정 실패:', error);
            throw error;
        }
    }
    
    async deletePortfolio(id) {
        try {
            await this.makeRequest(`/api/portfolios/${id}`, {
                method: 'DELETE'
            });
            
            // 캐시 무효화
            this.cache.portfolios = null;
            this.cache.lastUpdate.portfolios = null;
            
            return true;
        } catch (error) {
            console.error('Portfolio 삭제 실패:', error);
            throw error;
        }
    }
    
    // Blog 관련 메서드들
    async getBlogs(useCache = true) {
        // 캐시된 데이터가 유효하면 우선 사용
        if (useCache && this.cache.blogs && this.isCacheValid('blogs')) {
            return this.cache.blogs;
        }

        try {
            // 1) 로컬스토리지에 관리자가 저장한 블로그 우선 사용
            let adminBlogs = [];
            try {
                adminBlogs = JSON.parse(localStorage.getItem('chiro_blogs') || '[]');
                if (Array.isArray(adminBlogs)) {
                    console.log('Admin blogs found:', adminBlogs.length);
                } else {
                    adminBlogs = [];
                }
            } catch (e) {
                console.warn('Failed to parse admin blogs from localStorage');
            }

            // 2) 정적 기본 데이터 결합 (blog-data-real.js의 realBlogData)
            let staticBlogs = [];
            if (typeof realBlogData !== 'undefined') {
                staticBlogs = realBlogData;
                console.log('Static blogs found:', staticBlogs.length);
            }

            // 우선순위: 관리자 데이터가 위로
            const combinedBlogs = [...adminBlogs, ...staticBlogs];

            // 3) 가능하면 API 데이터로 보강 (성공 시 백업도 갱신)
            try {
                const apiBlogs = await this.makeRequest('/api/blogs');
                if (Array.isArray(apiBlogs) && apiBlogs.length) {
                    // API 데이터를 최상단으로 사용하거나 정책에 맞게 병합
                    this.updateCache('blogs', apiBlogs);
                    localStorage.setItem('chiro_blog_backup', JSON.stringify(apiBlogs));
                    return apiBlogs;
                }
            } catch (apiErr) {
                // API 실패는 치명적이지 않음. 아래 로컬/정적 데이터로 진행
            }

            // 캐시 업데이트 및 반환
            this.updateCache('blogs', combinedBlogs);
            return combinedBlogs;
        } catch (error) {
            console.error('Blog 데이터 로드 실패:', error);
            // 최후 폴백: 백업 키
            return JSON.parse(localStorage.getItem('chiro_blog_backup') || '[]');
        }
    }
    
    async getBlog(id) {
        try {
            return await this.makeRequest(`/api/blogs/${id}`);
        } catch (error) {
            console.error('Blog 개별 데이터 로드 실패:', error);
            const blogs = await this.getBlogs();
            return blogs.find(b => b._id === id || b.id === id);
        }
    }
    
    async createBlog(data) {
        try {
            const result = await this.makeRequest('/api/blogs', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            // 캐시 무효화
            this.cache.blogs = null;
            this.cache.lastUpdate.blogs = null;
            
            return result;
        } catch (error) {
            console.error('Blog 생성 실패:', error);
            throw error;
        }
    }
    
    async updateBlog(id, data) {
        try {
            const result = await this.makeRequest(`/api/blogs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            
            // 캐시 무효화
            this.cache.blogs = null;
            this.cache.lastUpdate.blogs = null;
            
            return result;
        } catch (error) {
            console.error('Blog 수정 실패:', error);
            throw error;
        }
    }
    
    async deleteBlog(id) {
        try {
            await this.makeRequest(`/api/blogs/${id}`, {
                method: 'DELETE'
            });
            
            // 캐시 무효화
            this.cache.blogs = null;
            this.cache.lastUpdate.blogs = null;
            
            return true;
        } catch (error) {
            console.error('Blog 삭제 실패:', error);
            throw error;
        }
    }
    
    // 통계 데이터
    async getStats() {
        try {
            return await this.makeRequest('/api/stats');
        } catch (error) {
            console.error('Stats 데이터 로드 실패:', error);
            // 캐시된 데이터를 기반으로 통계 계산
            const portfolios = await this.getPortfolios();
            const blogs = await this.getBlogs();
            
            return {
                portfolioCount: portfolios.length,
                blogCount: blogs.length,
                viewCount: 0,
                contactCount: 0
            };
        }
    }
    
    // 서버 상태 확인
    async getServerStatus() {
        try {
            return await this.makeRequest('/api/status');
        } catch (error) {
            return {
                status: '연결 안됨',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // 필터링 및 검색 기능 (클라이언트 사이드)
    async getPortfoliosByCategory(category) {
        const portfolios = await this.getPortfolios();
        if (category === 'all') return portfolios;
        return portfolios.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    async getBlogsByCategory(category) {
        const blogs = await this.getBlogs();
        if (category === 'all') return blogs;
        return blogs.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    
    async searchContent(query) {
        const [portfolios, blogs] = await Promise.all([
            this.getPortfolios(),
            this.getBlogs()
        ]);
        
        const lowerQuery = query.toLowerCase();
        
        return {
            portfolios: portfolios.filter(p => 
                p.title.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            ),
            blogs: blogs.filter(b =>
                b.title.toLowerCase().includes(lowerQuery) ||
                b.excerpt.toLowerCase().includes(lowerQuery) ||
                b.content.toLowerCase().includes(lowerQuery) ||
                b.category.toLowerCase().includes(lowerQuery)
            )
        };
    }
    
    // 실시간 업데이트를 위한 이벤트 시스템
    addEventListener(type, callback) {
        document.addEventListener(`dataManager_${type}`, callback);
    }
    
    removeEventListener(type, callback) {
        document.removeEventListener(`dataManager_${type}`, callback);
    }
    
    emit(type, data) {
        const event = new CustomEvent(`dataManager_${type}`, { detail: data });
        document.dispatchEvent(event);
    }
    
    // 백그라운드에서 정기적으로 데이터 동기화
    startAutoSync(interval = 60000) { // 1분마다
        this.autoSyncInterval = setInterval(async () => {
            try {
                await this.getPortfolios(false); // 캐시 사용 안함
                await this.getBlogs(false);
                this.emit('dataUpdated', { timestamp: new Date() });
            } catch (error) {
                console.error('자동 동기화 실패:', error);
            }
        }, interval);
    }
    
    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
        }
    }
    
    // 초기 데이터 마이그레이션 (기존 localStorage 데이터 → MongoDB)
    async migrateExistingData() {
        try {
            const existingPortfolios = JSON.parse(localStorage.getItem('chiro_portfolio_data') || '[]');
            const existingBlogs = JSON.parse(localStorage.getItem('chiro_blog_data') || '[]');
            
            // 서버에 기존 데이터가 있는지 확인
            const [serverPortfolios, serverBlogs] = await Promise.all([
                this.getPortfolios(false),
                this.getBlogs(false)
            ]);
            
            // 서버가 비어있고 로컬에 데이터가 있으면 마이그레이션
            if (serverPortfolios.length === 0 && existingPortfolios.length > 0) {
                console.log('포트폴리오 데이터 마이그레이션 시작...');
                for (const portfolio of existingPortfolios) {
                    const { id, ...data } = portfolio; // id 제거
                    await this.createPortfolio(data);
                }
            }
            
            if (serverBlogs.length === 0 && existingBlogs.length > 0) {
                console.log('블로그 데이터 마이그레이션 시작...');
                for (const blog of existingBlogs) {
                    const { id, ...data } = blog; // id 제거
                    await this.createBlog(data);
                }
            }
            
            return true;
        } catch (error) {
            console.error('데이터 마이그레이션 실패:', error);
            return false;
        }
    }
}

// 전역 인스턴스 생성
const APIDataManager_Instance = new APIDataManager();

// 기존 DataManager와 호환성을 위한 래퍼
class DataManager {
    constructor() {
        this.api = APIDataManager_Instance;
        this.init();
    }
    
    async init() {
        // 페이지 로드 시 자동 동기화 시작
        this.api.startAutoSync();
        
        // 기존 데이터 마이그레이션 (한 번만)
        if (!localStorage.getItem('chiro_migrated')) {
            await this.api.migrateExistingData();
            localStorage.setItem('chiro_migrated', 'true');
        }
    }
    
    // Portfolio 메서드들
    async getPortfolios() {
        return await this.api.getPortfolios();
    }
    
    // Synchronous version for compatibility
    getPortfoliosSync() {
        try {
            const portfolios = JSON.parse(localStorage.getItem('chiro_portfolios') || '[]');
            const staticPortfolios = typeof realPortfolioData !== 'undefined' ? realPortfolioData : [];
            return [...portfolios, ...staticPortfolios];
        } catch (error) {
            console.error('Error loading portfolios sync:', error);
            return [];
        }
    }
    
    async getPortfolio(id) {
        return await this.api.getPortfolio(id);
    }
    
    async addPortfolio(data) {
        return await this.api.createPortfolio(data);
    }
    
    async updatePortfolio(id, data) {
        return await this.api.updatePortfolio(id, data);
    }
    
    async deletePortfolio(id) {
        return await this.api.deletePortfolio(id);
    }
    
    // Blog 메서드들
    async getBlogs() {
        return await this.api.getBlogs();
    }
    
    async getBlog(id) {
        return await this.api.getBlog(id);
    }
    
    async addBlog(data) {
        return await this.api.createBlog(data);
    }
    
    async updateBlog(id, data) {
        return await this.api.updateBlog(id, data);
    }
    
    async deleteBlog(id) {
        return await this.api.deleteBlog(id);
    }
    
    // 필터링
    async getPortfoliosByCategory(category) {
        return await this.api.getPortfoliosByCategory(category);
    }
    
    async getBlogsByCategory(category) {
        return await this.api.getBlogsByCategory(category);
    }
    
    // 통계
    async getStats() {
        return await this.api.getStats();
    }
    
    // 이벤트 리스너
    addEventListener(type, callback) {
        this.api.addEventListener(type, callback);
    }
    
    removeEventListener(type, callback) {
        this.api.removeEventListener(type, callback);
    }
    
    // 정리
    destroy() {
        this.api.stopAutoSync();
    }
}

// 전역 변수로 노출 (기존 코드 호환성)
window.DataManager = DataManager;
window.APIDataManager = APIDataManager;

// 자동으로 dataManager 인스턴스 생성
if (typeof window !== 'undefined') {
    window.dataManager = new DataManager();
    console.log('DataManager instance created automatically');
}
