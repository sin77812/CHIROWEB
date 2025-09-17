// 횡스크롤 GSAP 구현 - 안정화된 버전
console.log('horizontal-scroll.js loaded');

// GSAP 체크
if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded!');
} else {
    console.log('GSAP version:', gsap.version);
    gsap.registerPlugin(ScrollTrigger);
    console.log('ScrollTrigger registered:', ScrollTrigger !== undefined);
}

// GSAP 설정
gsap.config({
    force3D: true,
    nullTargetWarn: false
});

// DOM 로드 후 실행
window.addEventListener('load', () => {
    console.log('Window load event fired for horizontal scroll');
    
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    const wrapper = document.querySelector('.horizontal-wrapper');
    const panels = gsap.utils.toArray('.horizontal-panel');
    
    if (!horizontalSection || !wrapper || panels.length === 0) {
        console.error('횡스크롤 요소를 찾을 수 없습니다');
        return;
    }
    
    // 스크롤 거리 정확히 계산
    const getScrollDistance = () => {
        const wrapperWidth = wrapper.scrollWidth;
        const windowWidth = window.innerWidth;
        const distance = wrapperWidth - windowWidth;
        console.log('Scroll calculation:', {
            wrapperWidth,
            windowWidth,
            distance,
            panelCount: panels.length,
            panelWidth: panels[0]?.offsetWidth
        });
        return distance;
    };
    const scrollDistance = getScrollDistance();
    
    // 마지막 패널을 위한 추가 시간 (화면 높이의 80%)
    const extraViewTime = window.innerHeight * 0.8;
    
    // 모바일 감지 및 pinType 결정 (단순화)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const pinType = 'fixed'; // 모든 기기에서 fixed 사용
    
    // 메인 횡스크롤 타임라인 - 하나로 통합
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            pin: true,
            pinType: pinType,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Progress dots 업데이트 (단순화)
                const dots = document.querySelectorAll('.progress-dot');
                const progress = self.progress;
                const current = Math.min(Math.floor(progress * panels.length), panels.length - 1);
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === current);
                });
            }
        }
    });
    
    // 패널 이동 애니메이션
    tl.to(wrapper, {
        x: -scrollDistance,
        force3D: true,
        transformOrigin: "0 0"
    });
    
    // 패널 위치 디버깅
    panels.forEach((panel, i) => {
        const rect = panel.getBoundingClientRect();
        console.log(`Panel ${i} position:`, {
            left: rect.left,
            right: rect.right,
            width: rect.width,
            visible: rect.left < window.innerWidth && rect.right > 0
        });
    });
    
    // 패널 콘텐츠 설정
    panels.forEach((panel, i) => {
        const content = panel.querySelector('.panel-content');
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
    });
    
    // 점 클릭 네비게이션 (단순화)
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetProgress = index / (panels.length - 1);
            const targetScroll = horizontalSection.offsetTop + (scrollDistance * targetProgress);
            
            // 기본 smooth scroll 사용
            window.scrollTo({ 
                top: targetScroll, 
                behavior: 'smooth' 
            });
        });
    });
    
    // 간단한 리사이즈 처리
    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    if (isMobile) {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => ScrollTrigger.refresh(), 300);
        });
    }
    
    // 페이지 새로고침 시 스크롤 위치 복원
    ScrollTrigger.addEventListener('refresh', () => {
        // 모든 애니메이션을 즉시 완료 상태로 설정
        tl.invalidate();
    });
    
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
    
    // 디버깅 정보
    console.log('Horizontal scroll initialized:', {
        scrollDistance,
        extraViewTime,
        totalEnd: scrollDistance + extraViewTime,
        panels: panels.length
    });
    
    // 디버깅용 ScrollTrigger (프로덕션에서는 제거 권장)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        ScrollTrigger.create({
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${scrollDistance}`,  // 메인 타임라인과 동일한 end 사용
            onUpdate: (self) => {
                const data = {
                    progress: self.progress.toFixed(3),
                    scrollY: window.scrollY,
                    wrapperTransform: wrapper.style.transform,
                    isPinned: horizontalSection.classList.contains('is-pinned')
                };
                console.log('ScrollTrigger Progress:', JSON.stringify(data, null, 2));
            }
        });
    }
    
    // 요소 가시성 체크
    const checkVisibility = () => {
        const container = document.querySelector('.horizontal-container');
        const video = document.querySelector('.horizontal-video-container');
        const overlay = document.querySelector('.horizontal-video-overlay');
        const panel = panels[0];
        
        const visibilityData = {
            container: {
                display: window.getComputedStyle(container).display,
                opacity: window.getComputedStyle(container).opacity,
                visibility: window.getComputedStyle(container).visibility,
                zIndex: window.getComputedStyle(container).zIndex,
                position: window.getComputedStyle(container).position
            },
            video: {
                display: window.getComputedStyle(video).display,
                opacity: window.getComputedStyle(video).opacity,
                zIndex: window.getComputedStyle(video).zIndex,
                position: window.getComputedStyle(video).position
            },
            overlay: {
                backgroundColor: window.getComputedStyle(overlay).backgroundColor,
                opacity: window.getComputedStyle(overlay).opacity,
                zIndex: window.getComputedStyle(overlay).zIndex
            },
            panel: {
                display: window.getComputedStyle(panel).display,
                opacity: window.getComputedStyle(panel).opacity,
                zIndex: window.getComputedStyle(panel).zIndex
            },
            panelContent: {
                opacity: window.getComputedStyle(panel.querySelector('.panel-content')).opacity,
                display: window.getComputedStyle(panel.querySelector('.panel-content')).display
            }
        };
        console.log('Element Visibility Check:', JSON.stringify(visibilityData, null, 2));
    };
    
    // 페이지 로드 후 초기 체크
    setTimeout(checkVisibility, 1000);
    
    // 모든 복잡한 iOS 로직 제거 - 기본 ScrollTrigger만 사용
    
    // 스크롤 시 체크 (디버깅용)
    let scrollCheckTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollCheckTimeout);
        scrollCheckTimeout = setTimeout(checkVisibility, 500);
    });
});
