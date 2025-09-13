// Contact Page JavaScript
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize components
        initAnimations();
        initFormSteps();
        initFormValidation();
        initFAQ();
        
        // GSAP Initialization
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        function initAnimations() {
            // Hero animations
            const heroTitle = document.querySelectorAll('.title-line');
            const heroDescription = document.querySelector('.contact-hero-description');
            const heroFeatures = document.querySelector('.hero-features');
            
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
            
            if (heroFeatures) {
                gsap.to(heroFeatures, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 1.1
                });
            }
            
            // Form container animation
            const formContainer = document.querySelector('.contact-form-container');
            const infoContainer = document.querySelector('.contact-info-container');
            
            if (formContainer) {
                gsap.to(formContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.5,
                    scrollTrigger: {
                        trigger: '.contact-form-section',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
            
            if (infoContainer) {
                gsap.to(infoContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.7,
                    scrollTrigger: {
                        trigger: '.contact-form-section',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        }
        
        function initFormSteps() {
            let currentStep = 1;
            const totalSteps = 2;
            
            window.nextStep = function() {
                if (validateCurrentStep()) {
                    if (currentStep < totalSteps) {
                        currentStep++;
                        showStep(currentStep);
                        updateProgressBar(currentStep);
                    }
                }
            };
            
            window.prevStep = function() {
                if (currentStep > 1) {
                    currentStep--;
                    showStep(currentStep);
                    updateProgressBar(currentStep);
                }
            };
            
            function showStep(step) {
                const steps = document.querySelectorAll('.form-step');
                
                steps.forEach((stepElement, index) => {
                    if (index + 1 === step) {
                        stepElement.classList.add('active');
                        stepElement.classList.remove('prev');
                    } else if (index + 1 < step) {
                        stepElement.classList.remove('active');
                        stepElement.classList.add('prev');
                    } else {
                        stepElement.classList.remove('active', 'prev');
                    }
                });
            }
            
            function updateProgressBar(step) {
                const progressSteps = document.querySelectorAll('.progress-step');
                
                progressSteps.forEach((progressStep, index) => {
                    if (index + 1 <= step) {
                        progressStep.classList.add('active');
                    } else {
                        progressStep.classList.remove('active');
                    }
                });
            }
            
            function validateCurrentStep() {
                const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
                const requiredFields = currentStepElement.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                });
                
                return isValid;
            }
        }
        
        function initFormValidation() {
            const form = document.getElementById('contactForm');
            
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    if (validateForm()) {
                        submitForm();
                    }
                });
            }
            
            // Real-time validation
            const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearFieldError(input));
            });
            
            function validateForm() {
                const requiredFields = document.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                });
                
                return isValid;
            }
            
            function submitForm() {
                const submitBtn = document.querySelector('.form-submit-btn');
                const form = document.getElementById('contactForm');
                const successMessage = document.getElementById('successMessage');
                
                // Show loading state
                form.classList.add('form-loading');
                submitBtn.querySelector('span').textContent = '전송 중...';
                
                // Simulate API call
                setTimeout(() => {
                    // Hide form and show success message
                    form.style.display = 'none';
                    successMessage.classList.add('show');
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }, 2000);
            }
            
            window.resetForm = function() {
                const form = document.getElementById('contactForm');
                const successMessage = document.getElementById('successMessage');
                
                // Reset form
                form.reset();
                form.style.display = 'block';
                form.classList.remove('form-loading');
                
                // Hide success message
                successMessage.classList.remove('show');
                
                // Reset to step 1
                showStep(1);
                updateProgressBar(1);
                
                // Clear all errors
                const errorElements = document.querySelectorAll('.form-error');
                errorElements.forEach(error => {
                    error.classList.remove('show');
                    error.textContent = '';
                });
                
                const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
                inputs.forEach(input => {
                    input.classList.remove('error', 'success');
                });
            };
        }
        
        function validateField(field) {
            const fieldType = field.type;
            const fieldValue = field.value.trim();
            const fieldName = field.name;
            const errorElement = document.getElementById(fieldName + 'Error');
            
            // Clear previous error
            clearFieldError(field);
            
            // Required field validation
            if (field.hasAttribute('required') && fieldValue === '') {
                showFieldError(field, '이 필드는 필수입니다.');
                return false;
            }
            
            // Email validation
            if (fieldType === 'email' && fieldValue !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    showFieldError(field, '올바른 이메일 주소를 입력해주세요.');
                    return false;
                }
            }
            
            // Phone validation
            if (fieldType === 'tel' && fieldValue !== '') {
                const phoneRegex = /^[0-9-+\s()]+$/;
                if (!phoneRegex.test(fieldValue)) {
                    showFieldError(field, '올바른 전화번호를 입력해주세요.');
                    return false;
                }
            }
            
            // Textarea minimum length
            if (field.tagName === 'TEXTAREA' && fieldValue !== '' && fieldValue.length < 10) {
                showFieldError(field, '최소 10자 이상 입력해주세요.');
                return false;
            }
            
            // Show success state
            field.classList.add('success');
            return true;
        }
        
        function showFieldError(field, message) {
            const errorElement = document.getElementById(field.name + 'Error');
            field.classList.add('error');
            field.classList.remove('success');
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }
        
        function clearFieldError(field) {
            const errorElement = document.getElementById(field.name + 'Error');
            field.classList.remove('error');
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        }
        
        function initFAQ() {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('open');
                        }
                    });
                    
                    // Toggle current item
                    if (isOpen) {
                        item.classList.remove('open');
                    } else {
                        item.classList.add('open');
                    }
                });
            });
        }
        
        // Helper functions for form steps (making them global)
        function showStep(step) {
            const steps = document.querySelectorAll('.form-step');
            
            steps.forEach((stepElement, index) => {
                if (index + 1 === step) {
                    stepElement.classList.add('active');
                    stepElement.classList.remove('prev');
                } else if (index + 1 < step) {
                    stepElement.classList.remove('active');
                    stepElement.classList.add('prev');
                } else {
                    stepElement.classList.remove('active', 'prev');
                }
            });
        }
        
        function updateProgressBar(step) {
            const progressSteps = document.querySelectorAll('.progress-step');
            
            progressSteps.forEach((progressStep, index) => {
                if (index + 1 <= step) {
                    progressStep.classList.add('active');
                } else {
                    progressStep.classList.remove('active');
                }
            });
        }
        
        console.log('Contact page initialized successfully');
    });
    
})();