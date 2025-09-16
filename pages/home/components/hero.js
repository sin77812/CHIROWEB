// Typing Animation Configuration
const typingMessages = [
    "Digital Excellence",
    "Brand Innovation", 
    "Creative Solutions"
];

let currentMessageIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let typingElement = null;

// Prevent double initialization
if (!window.heroJsInitialized) {
    window.heroJsInitialized = true;
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        typingElement = document.getElementById('typingText');
        
        // Only initialize if hero section exists
        if (typingElement) {
            // Start animations
            setTimeout(() => {
                startEntryAnimations();
                startTypingAnimation();
            }, 500);
        }
    });
}

// Entry Animations
function startEntryAnimations() {
    const elementsToAnimate = [
        { selector: '.hero-title-line', delay: 100 },
        { selector: '.hero-subtitle', delay: 400 },
        { selector: '.hero-badge', delay: 200 },
        { selector: '.logo-text', delay: 600 },
        { selector: '.social-links', delay: 800 },
        { selector: '.copyright', delay: 900 },
        { selector: '.scroll-indicator', delay: 800 },
        { selector: '.contact-cta', delay: 900 }
    ];

    elementsToAnimate.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, item.delay + (index * 100));
        });
    });
}

// Typing Animation
function startTypingAnimation() {
    setTimeout(() => {
        typeMessage();
    }, 1000);
}

function typeMessage() {
    const currentMessage = typingMessages[currentMessageIndex];
    
    if (isTyping) {
        // Typing phase
        if (currentCharIndex < currentMessage.length) {
            typingElement.textContent = currentMessage.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            setTimeout(typeMessage, 100); // Typing speed
        } else {
            // Finished typing, wait then start deleting
            isTyping = false;
            setTimeout(typeMessage, 2000); // Pause duration
        }
    } else {
        // Deleting phase
        if (currentCharIndex > 0) {
            typingElement.textContent = currentMessage.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            setTimeout(typeMessage, 50); // Deleting speed
        } else {
            // Finished deleting, move to next message
            isTyping = true;
            currentMessageIndex = (currentMessageIndex + 1) % typingMessages.length;
            setTimeout(typeMessage, 500); // Pause between messages
        }
    }
}

// Scroll Indicator Click
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});

// Video Optimization
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.hero-video');
    if (video) {
        // Optimize video loading
        video.addEventListener('loadeddata', function() {
            this.style.opacity = '1';
        });
        
        // Pause video when not in view (performance optimization)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });
        
        observer.observe(video);
        
        // Mobile video handling - Video is now enabled on mobile
        /*
        if (window.innerWidth <= 768) {
            video.style.display = 'none';
            document.querySelector('.hero-video-overlay').style.background = 'rgba(10, 10, 10, 0.8)';
        }
        */
    }
});

// Smooth scroll for contact CTA
document.addEventListener('DOMContentLoaded', function() {
    const contactCta = document.querySelector('.contact-cta');
    if (contactCta) {
        contactCta.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to contact section (will be implemented later)
            console.log('Contact CTA clicked - scroll to contact section');
        });
    }
});

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

// Smooth parallax effect for hero elements
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        // Multiple elements with different parallax speeds
        const heroMainText = document.querySelector('.hero-main-text');
        const heroBadge = document.querySelector('.hero-badge');
        const heroCenter = document.querySelector('.hero-center');
        const heroBottomLeft = document.querySelector('.hero-bottom-left');
        const heroBottomRight = document.querySelector('.hero-bottom-right');
        
        // Different parallax speeds for depth using translate3d for GPU acceleration
        if (heroMainText) {
            heroMainText.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
        }
        if (heroBadge) {
            heroBadge.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
        }
        if (heroCenter) {
            // Apply parallax without breaking the centering transform set in CSS
            heroCenter.style.setProperty('--parallaxY', `${scrolled * 0.4}px`);
        }
        if (heroBottomLeft) {
            heroBottomLeft.style.transform = `translate3d(0, ${scrolled * 0.25}px, 0)`;
        }
        if (heroBottomRight) {
            heroBottomRight.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
        }
    }
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });
