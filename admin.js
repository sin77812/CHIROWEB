// Admin Dashboard JavaScript

// 데이터 매니저 연동

// Navigation
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active from nav items
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active to nav item
    const targetNav = document.querySelector(`.admin-nav-item[onclick="showSection('${sectionName}')"]`);
    if (targetNav) {
        targetNav.classList.add('active');
    }
    
    // Load section data
    if (sectionName === 'portfolio') {
        loadPortfolioData();
    } else if (sectionName === 'blog') {
        loadBlogData();
    } else if (sectionName === 'dashboard') {
        loadDashboardData();
    }
}

// Dashboard functions
function loadDashboardData() {
    const stats = window.dataManager.getStats();
    document.getElementById('portfolioCount').textContent = stats.portfolioCount;
    document.getElementById('blogCount').textContent = stats.blogCount;
    
    // Load recent activity
    const blogs = window.dataManager.getBlogs();
    const portfolios = window.dataManager.getPortfolios();
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = `
        <li class="activity-item">
            <span class="activity-icon"><i class="icon icon-edit"></i></span>
            <span class="activity-text">새 블로그 글 작성: "${blogs[0]?.title || '제목 없음'}"</span>
            <span class="activity-time">2시간 전</span>
        </li>
        <li class="activity-item">
            <span class="activity-icon"><i class="icon icon-folder"></i></span>
            <span class="activity-text">포트폴리오 추가: "${portfolios[0]?.title || '제목 없음'}"</span>
            <span class="activity-time">1일 전</span>
        </li>
    `;
}

// Portfolio functions
function loadPortfolioData() {
    const portfolioData = window.dataManager.getPortfolios();
    const tbody = document.getElementById('portfolioTableBody');
    tbody.innerHTML = portfolioData.map(item => `
        <tr>
            <td>
                <img src="${item.image}" alt="${item.title}" class="table-img">
            </td>
            <td>${item.title}</td>
            <td><span class="tag tag-${item.category}">${getCategoryName(item.category)}</span></td>
            <td>${item.year}</td>
            <td><span class="status status-${item.status}">${item.status === 'active' ? '공개' : '비공개'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editPortfolio(${item.id})">
                        <i class="icon icon-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deletePortfolio(${item.id})">
                        <i class="icon icon-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        'web': 'Web Design',
        'branding': 'Branding',
        'marketing': 'Marketing',
        'ecommerce': 'E-commerce'
    };
    return categories[category] || category;
}

function openPortfolioModal(id = null) {
    const modal = document.getElementById('portfolioModal');
    const form = document.getElementById('portfolioForm');
    
    if (id) {
        // Edit mode
        const item = window.dataManager.getPortfolio(id);
        if (item) {
            document.getElementById('portfolioTitle').value = item.title;
            document.getElementById('portfolioCategory').value = item.category;
            document.getElementById('portfolioYear').value = item.year;
            document.getElementById('portfolioDescription').value = item.description;
        }
        form.dataset.mode = 'edit';
        form.dataset.id = id;
    } else {
        // Add mode
        form.reset();
        form.dataset.mode = 'add';
        delete form.dataset.id;
    }
    
    modal.classList.add('show');
}

function closePortfolioModal() {
    document.getElementById('portfolioModal').classList.remove('show');
}

function editPortfolio(id) {
    openPortfolioModal(id);
}

function deletePortfolio(id) {
    if (confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
        window.dataManager.deletePortfolio(id);
        loadPortfolioData();
        showNotification('포트폴리오가 삭제되었습니다.');
    }
}

// Blog functions
function loadBlogData() {
    const blogData = window.dataManager.getBlogs();
    const tbody = document.getElementById('blogTableBody');
    tbody.innerHTML = blogData.map(item => `
        <tr>
            <td>
                <img src="${item.thumbnail}" alt="${item.title}" class="table-img">
            </td>
            <td>${item.title}</td>
            <td><span class="tag tag-${item.category}">${getBlogCategoryName(item.category)}</span></td>
            <td>${item.date}</td>
            <td><span class="status status-${item.status}">${item.status === 'active' ? '공개' : '비공개'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editBlog(${item.id})">
                        <i class="icon icon-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteBlog(${item.id})">
                        <i class="icon icon-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getBlogCategoryName(category) {
    const categories = {
        'design': 'Design',
        'development': 'Development',
        'marketing': 'Marketing',
        'news': 'News'
    };
    return categories[category] || category;
}

function openBlogModal(id = null) {
    const modal = document.getElementById('blogModal');
    const form = document.getElementById('blogForm');
    
    if (id) {
        // Edit mode
        const item = window.dataManager.getBlog(id);
        if (item) {
            document.getElementById('blogTitle').value = item.title;
            document.getElementById('blogCategory').value = item.category;
            document.getElementById('blogReadTime').value = item.readTime;
            document.getElementById('blogExcerpt').value = item.excerpt;
            document.getElementById('blogContent').value = item.content;
        }
        form.dataset.mode = 'edit';
        form.dataset.id = id;
    } else {
        // Add mode
        form.reset();
        form.dataset.mode = 'add';
        delete form.dataset.id;
    }
    
    modal.classList.add('show');
}

function closeBlogModal() {
    document.getElementById('blogModal').classList.remove('show');
}

function editBlog(id) {
    openBlogModal(id);
}

function deleteBlog(id) {
    if (confirm('정말로 이 블로그 글을 삭제하시겠습니까?')) {
        window.dataManager.deleteBlog(id);
        loadBlogData();
        showNotification('블로그 글이 삭제되었습니다.');
    }
}

// Form submissions
document.getElementById('portfolioForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        title: document.getElementById('portfolioTitle').value,
        category: document.getElementById('portfolioCategory').value,
        year: parseInt(document.getElementById('portfolioYear').value),
        description: document.getElementById('portfolioDescription').value,
        image: `https://picsum.photos/600/400?random=${Date.now()}`, // Mock image
        status: 'active'
    };
    
    if (this.dataset.mode === 'edit') {
        data.id = parseInt(this.dataset.id);
        window.dataManager.savePortfolio(data);
        showNotification('포트폴리오가 수정되었습니다.');
    } else {
        window.dataManager.savePortfolio(data);
        showNotification('포트폴리오가 추가되었습니다.');
    }
    
    loadPortfolioData();
    closePortfolioModal();
});

document.getElementById('blogForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        title: document.getElementById('blogTitle').value,
        category: document.getElementById('blogCategory').value,
        readTime: document.getElementById('blogReadTime').value,
        excerpt: document.getElementById('blogExcerpt').value,
        content: document.getElementById('blogContent').value,
        thumbnail: `https://picsum.photos/600/400?random=${Date.now()}`, // Mock image
        status: 'active'
    };
    
    if (this.dataset.mode === 'edit') {
        data.id = parseInt(this.dataset.id);
        window.dataManager.saveBlog(data);
        showNotification('블로그 글이 수정되었습니다.');
    } else {
        window.dataManager.saveBlog(data);
        showNotification('블로그 글이 추가되었습니다.');
    }
    
    loadBlogData();
    closeBlogModal();
});

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #34C759;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-family: var(--font-korean);
        font-size: 14px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        // In real app, clear authentication and redirect
        window.location.href = 'login.html';
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    
    // Animation
    gsap.from('.admin-main', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        ease: 'power2.out'
    });
    
    gsap.from('.stat-card', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
    });
});

// API functions for MongoDB integration (준비됨)
class AdminAPI {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
    }
    
    async fetchPortfolios() {
        try {
            const response = await fetch(`${this.baseURL}/portfolios`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching portfolios:', error);
            return [];
        }
    }
    
    async createPortfolio(data) {
        try {
            const response = await fetch(`${this.baseURL}/portfolios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating portfolio:', error);
            throw error;
        }
    }
    
    async updatePortfolio(id, data) {
        try {
            const response = await fetch(`${this.baseURL}/portfolios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating portfolio:', error);
            throw error;
        }
    }
    
    async deletePortfolio(id) {
        try {
            const response = await fetch(`${this.baseURL}/portfolios/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            throw error;
        }
    }
    
    async fetchBlogs() {
        try {
            const response = await fetch(`${this.baseURL}/blogs`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching blogs:', error);
            return [];
        }
    }
    
    async createBlog(data) {
        try {
            const response = await fetch(`${this.baseURL}/blogs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error;
        }
    }
    
    async updateBlog(id, data) {
        try {
            const response = await fetch(`${this.baseURL}/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    }
    
    async deleteBlog(id) {
        try {
            const response = await fetch(`${this.baseURL}/blogs/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }
}

// Initialize API instance
const api = new AdminAPI();