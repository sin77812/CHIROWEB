// Login Page JavaScript

// Simple authentication (나중에 실제 인증 시스템으로 교체)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'chiro2024!'
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.login-btn');
const errorMessage = document.getElementById('errorMessage');
const loginLoading = document.getElementById('loginLoading');

// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordIcon.className = 'icon icon-eye-off';
    } else {
        passwordField.type = 'password';
        passwordIcon.className = 'icon icon-eye';
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Add shake animation
    errorMessage.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        errorMessage.style.animation = '';
    }, 500);
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Show loading state
function showLoading() {
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
}

// Hide loading state
function hideLoading() {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
}

// Validate form
function validateForm(username, password) {
    if (!username || !password) {
        showError('아이디와 비밀번호를 입력해주세요.');
        return false;
    }
    
    if (username.length < 3) {
        showError('아이디는 3자 이상 입력해주세요.');
        return false;
    }
    
    if (password.length < 6) {
        showError('비밀번호는 6자 이상 입력해주세요.');
        return false;
    }
    
    return true;
}

// Authenticate user
async function authenticateUser(username, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple credential check (나중에 실제 API 호출로 교체)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        return { success: true, token: 'mock-jwt-token-' + Date.now() };
    } else {
        return { success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' };
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    hideError();
    
    if (!validateForm(username, password)) {
        return;
    }
    
    showLoading();
    
    try {
        const result = await authenticateUser(username, password);
        
        if (result.success) {
            // Save authentication token
            localStorage.setItem('chiro_admin_token', result.token);
            localStorage.setItem('chiro_admin_username', username);
            
            // Save remember me preference
            const rememberMe = document.getElementById('rememberMe').checked;
            if (rememberMe) {
                localStorage.setItem('chiro_remember_me', 'true');
            }
            
            // Show success animation
            loginBtn.style.background = '#34C759';
            loginBtn.querySelector('.btn-text').textContent = '로그인 성공!';
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
            
        } else {
            hideLoading();
            showError(result.message);
            
            // Add shake animation to form
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
        
    } catch (error) {
        hideLoading();
        showError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error('Login error:', error);
    }
}

// Check if user is already logged in
function checkExistingAuth() {
    const token = localStorage.getItem('chiro_admin_token');
    const rememberMe = localStorage.getItem('chiro_remember_me');
    
    if (token && rememberMe === 'true') {
        // Auto redirect if remember me is enabled
        window.location.href = 'admin.html';
    }
    
    // Pre-fill username if remembered
    const savedUsername = localStorage.getItem('chiro_admin_username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        document.getElementById('rememberMe').checked = rememberMe === 'true';
    }
}

// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        if (e.target === usernameInput) {
            passwordInput.focus();
        } else if (e.target === passwordInput) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
}

// Input validation and styling
function handleInputChange(input) {
    if (input.value.trim()) {
        input.classList.add('has-value');
    } else {
        input.classList.remove('has-value');
    }
    
    // Hide error when user starts typing
    if (errorMessage.style.display === 'block') {
        hideError();
    }
}

// Initialize page
function initializePage() {
    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    usernameInput.addEventListener('keypress', handleKeyPress);
    passwordInput.addEventListener('keypress', handleKeyPress);
    usernameInput.addEventListener('input', () => handleInputChange(usernameInput));
    passwordInput.addEventListener('input', () => handleInputChange(passwordInput));
    
    // Check existing authentication
    checkExistingAuth();
    
    // Focus on username field
    setTimeout(() => {
        usernameInput.focus();
    }, 500);
    
    // Add GSAP animations
    gsap.from('.login-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.2
    });
    
    gsap.from('.bg-circle', {
        duration: 1.2,
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.5
    });
}

// Shake animation keyframes
const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;

// Add shake animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// API class for real authentication (MongoDB 연동 준비)
class AuthAPI {
    constructor(baseURL = '/api/auth') {
        this.baseURL = baseURL;
    }
    
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, token: data.token, user: data.user };
            } else {
                return { success: false, message: data.message || '로그인에 실패했습니다.' };
            }
        } catch (error) {
            console.error('Login API error:', error);
            return { success: false, message: '서버에 연결할 수 없습니다.' };
        }
    }
    
    async verifyToken(token) {
        try {
            const response = await fetch(`${this.baseURL}/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            return response.ok;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }
    
    async logout(token) {
        try {
            const response = await fetch(`${this.baseURL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            return response.ok;
        } catch (error) {
            console.error('Logout API error:', error);
            return false;
        }
    }
}

// Initialize API instance
const authAPI = new AuthAPI();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);