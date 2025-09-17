// 횡스크롤 구현 - iOS 네이티브 스크롤 + 기타 기기 GSAP
console.log('horizontal-scroll.js loaded');

// iOS 감지 함수
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

// GSAP 체크 (iOS가 아닌 경우에만)
if (!isIOS() && typeof gsap === 'undefined') {
    console.error('GSAP is not loaded!');
} else if (!isIOS()) {
    console.log('GSAP version:', gsap.version);
    gsap.registerPlugin(ScrollTrigger);
    console.log('ScrollTrigger registered:', ScrollTrigger !== undefined);
    
    // GSAP 설정
    gsap.config({
        force3D: true,
        nullTargetWarn: false
    });
}

// DOM 로드 후 실행
window.addEventListener('load', () => {
    console.log('Window load event fired for horizontal scroll');
    
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    const wrapper = document.querySelector('.horizontal-wrapper');
    const panels = document.querySelectorAll('.horizontal-panel');
    
    if (!horizontalSection || !wrapper || panels.length === 0) {
        console.error('횡스크롤 요소를 찾을 수 없습니다');
        return;
    }
    
    // iOS인지 확인
    if (isIOS()) {
        console.log('iOS detected - using native scroll');
        initIOSNativeScroll(horizontalSection, wrapper, panels);
    } else {
        console.log('Non-iOS detected - using GSAP');
        initGSAPScroll(horizontalSection, wrapper, panels);
    }
});

// iOS 네이티브 스크롤 초기화
function initIOSNativeScroll(horizontalSection, wrapper, panels) {
    // iOS 클래스 추가
    horizontalSection.classList.add('ios-scroll');
    
    // Progress indicators 처리
    const dots = document.querySelectorAll('.progress-dot');
    
    // 스크롤 이벤트 리스너
    horizontalSection.addEventListener('scroll', function() {
        const scrollLeft = this.scrollLeft;
        const maxScroll = this.scrollWidth - this.clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        
        // 현재 패널 인덱스 계산
        const currentPanel = Math.round(progress * (panels.length - 1));
        
        // dots 업데이트
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPanel);
        });
    });
    
    // dot 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetScroll = (horizontalSection.scrollWidth - horizontalSection.clientWidth) * (index / (panels.length - 1));
            horizontalSection.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        });
    });
    
    // 초기 dot 활성화
    if (dots.length > 0) {
        dots[0].classList.add('active');
    }
    
    console.log('iOS native scroll initialized with', panels.length, 'panels');
}

// GSAP 스크롤 초기화 (기존 코드)
function initGSAPScroll(horizontalSection, wrapper, panels) {
    const panelsArray = gsap.utils.toArray(panels);
    
    // 스크롤 거리 계산 함수
    const getScrollDistance = () => {
        const wrapperWidth = wrapper.scrollWidth;
        const windowWidth = window.innerWidth;
        const distance = wrapperWidth - windowWidth;
        return distance;
    };
    
    // 메인 횡스크롤 타임라인
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinType: 'fixed',
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const dots = document.querySelectorAll('.progress-dot');
                const progress = self.progress;
                const current = Math.min(Math.floor(progress * panelsArray.length), panelsArray.length - 1);
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === current);
                });
            }
        }
    });
    
    // 패널 이동 애니메이션
    tl.to(wrapper, {
        x: () => -getScrollDistance(),
        force3D: true,
        transformOrigin: "0 0"
    });
    
    // 패널 콘텐츠 설정
    panelsArray.forEach((panel, i) => {
        const content = panel.querySelector('.panel-content');
        if (content) {
            content.classList.add('active');
            
            // 호버 효과
            panel.addEventListener('mouseenter', () => {
                const title = content.querySelector('.panel-main-title');
                if (title) {
                    gsap.to(title, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
            
            panel.addEventListener('mouseleave', () => {
                const title = content.querySelector('.panel-main-title');
                if (title) {
                    gsap.to(title, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        }
    });
    
    // 점 클릭 네비게이션
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetProgress = index / (panelsArray.length - 1);
            const currentScrollDistance = getScrollDistance();
            const targetScroll = horizontalSection.offsetTop + (currentScrollDistance * targetProgress);
            
            window.scrollTo({ 
                top: targetScroll, 
                behavior: 'smooth' 
            });
        });
    });
    
    // 리사이즈 처리
    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 비디오 처리
    const video = document.querySelector('.horizontal-video');
    if (video) {
        video.addEventListener('loadeddata', function() {
            this.style.opacity = '1';
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video play failed:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
    }
    
    // 초기 점 활성화
    if (dots.length > 0) {
        dots[0].classList.add('active');
    }
    
    console.log('GSAP horizontal scroll initialized with', panelsArray.length, 'panels');
}
