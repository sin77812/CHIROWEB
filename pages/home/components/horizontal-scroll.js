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
    
    // 메인 횡스크롤 타임라인 - 하나로 통합
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${scrollDistance}`,  // extraViewTime 제거
            pin: true,
            pinType: 'fixed',
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 0,
            fastScrollEnd: true,
            preventOverlaps: true,
            onToggle: (self) => {
                horizontalSection.classList.toggle('is-pinned', self.isActive);
            },
            onUpdate: (self) => {
                // Progress dots 업데이트를 여기서 처리
                const dots = document.querySelectorAll('.progress-dot');
                let progress = self.progress;
                
                // 현재 패널 계산
                let current = Math.min(Math.floor(progress * panels.length), panels.length - 1);
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === current);
                });
                
                console.log('Current panel:', current, 'Progress:', progress.toFixed(3));
            }
        }
    });
    
    // 패널 이동 애니메이션
    tl.to(wrapper, {
        x: -scrollDistance,
        ease: "none",
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
    
    // 점 클릭 네비게이션
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // 클릭한 패널 위치로 이동 (80% 범위 내에서)
            const targetProgress = (index / (panels.length - 1)) * 0.8;
            const targetScroll = horizontalSection.offsetTop + ((scrollDistance + extraViewTime) * targetProgress);
            
            // Use native smooth scroll to avoid ScrollToPlugin dependency
            try {
                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            } catch (_) {
                window.scrollTo(0, targetScroll);
            }
        });
    });
    
    // 리사이즈 처리 최적화
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // 스크롤 위치를 기억하고 새로고침
            const currentProgress = tl.scrollTrigger.progress;
            ScrollTrigger.refresh();
            // 스크롤 위치 복원
            if (currentProgress > 0) {
                tl.scrollTrigger.progress(currentProgress);
            }
        }, 250);
    });
    
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
    
    // 추가 디버깅: 스크롤 진행 상황 모니터링
    ScrollTrigger.create({
        trigger: horizontalSection,
        start: "top top",
        end: () => `+=${scrollDistance + extraViewTime}`,
        onUpdate: (self) => {
            const data = {
                progress: self.progress.toFixed(3),
                scrollY: window.scrollY,
                wrapperTransform: wrapper.style.transform,
                isPinned: horizontalSection.classList.contains('is-pinned'),
                containerZIndex: window.getComputedStyle(document.querySelector('.horizontal-container')).zIndex,
                panelZIndex: window.getComputedStyle(panels[0]).zIndex,
                videoZIndex: window.getComputedStyle(document.querySelector('.horizontal-video-container')).zIndex
            };
            console.log('ScrollTrigger Progress:', JSON.stringify(data, null, 2));
        }
    });
    
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
    
    // 스크롤 시 체크 (디버깅용)
    let scrollCheckTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollCheckTimeout);
        scrollCheckTimeout = setTimeout(checkVisibility, 500);
    });
});
