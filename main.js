// Main JavaScript for all sections
(function() {
    'use strict';
    
    // Prevent double initialization
    if (window.mainJsInitialized) return;
    window.mainJsInitialized = true;
    
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initSectionAnimations();
    initContactForm();
    initScrollToTop();
    initIntersectionObservers();
});

// Smooth scrolling for all anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations for all sections
function initSectionAnimations() {
    const sections = [
        '.services-section',
        '.pricing-section',
        '.contact-section'
    ];
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px 0px'
    });
    
    sections.forEach(selectorString => {
        const section = document.querySelector(selectorString);
        if (section) {
            observer.observe(section);
        }
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.form-submit');
    const loadingSpan = form.querySelector('.btn-loading');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        setLoadingState(submitBtn, loadingSpan, true);
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            setLoadingState(submitBtn, loadingSpan, false);
            showFormSuccess();
            form.reset();
        }, 2000);
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.parentElement;
    
    // Remove existing states
    fieldGroup.classList.remove('error', 'success');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        fieldGroup.classList.add('error');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            fieldGroup.classList.add('error');
            return false;
        }
    }
    
    // Success state
    if (value) {
        fieldGroup.classList.add('success');
    }
    
    return true;
}

// Loading state management
function setLoadingState(button, loadingSpan, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.textContent = '';
        loadingSpan.style.display = 'inline';
    } else {
        button.disabled = false;
        button.textContent = 'Send Message';
        loadingSpan.style.display = 'none';
    }
}

// Success message
function showFormSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'form-notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span class="notification-text">Message sent successfully! We'll get back to you soon.</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: var(--primary-text);
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-red);
        color: var(--primary-text);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        font-size: 20px;
        font-weight: bold;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Advanced Intersection Observers
function initIntersectionObservers() {
    // Parallax effect for sections
    const parallaxElements = document.querySelectorAll('.section-title, .section-subtitle');
    
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    parallaxElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        parallaxObserver.observe(element);
    });
    
    // Services cards animation
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });
    
    // Pricing cards animation
    const pricingCards = document.querySelectorAll('.pricing-card');
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    if (entry.target.classList.contains('featured')) {
                        entry.target.style.transform = 'translateY(-20px) scale(1.05)';
                    } else {
                        entry.target.style.transform = 'translateY(0)';
                    }
                }, index * 200);
                pricingObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    pricingCards.forEach(card => {
        pricingObserver.observe(card);
    });
}

// Add CSS animations
const mainStyle = document.createElement('style');
mainStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .scroll-to-top:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 20px rgba(255, 59, 48, 0.3) !important;
    }
`;
document.head.appendChild(mainStyle);

// Performance optimizations
// Throttle scroll events
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

// Debounce resize events
function debounce(func, wait) {
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

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Recalculate any position-dependent elements
    console.log('Window resized');
}, 250));

// Navigation highlighting (if navigation exists)
function initNavigationHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    sections.forEach(section => observer.observe(section));
}

})(); // End IIFE