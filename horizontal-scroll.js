// 횡스크롤 GSAP 구현 - 안정화된 버전
gsap.registerPlugin(ScrollTrigger);

// GSAP 설정
gsap.config({
    force3D: true,
    nullTargetWarn: false
});

// DOM 로드 후 실행
window.addEventListener('load', () => {
    
    const horizontalSection = document.querySelector('.horizontal-scroll-section');
    const wrapper = document.querySelector('.horizontal-wrapper');
    const panels = gsap.utils.toArray('.horizontal-panel');
    
    if (!horizontalSection || !wrapper || panels.length === 0) {
        console.error('횡스크롤 요소를 찾을 수 없습니다');
        return;
    }
    
    // 스크롤 거리 정확히 계산
    const getScrollDistance = () => wrapper.scrollWidth - window.innerWidth;
    const scrollDistance = getScrollDistance();
    
    // 마지막 패널을 위한 추가 시간 (화면 높이의 80%)
    const extraViewTime = window.innerHeight * 0.8;
    
    // 메인 횡스크롤 타임라인 - 하나로 통합
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${scrollDistance + extraViewTime}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                // Progress dots 업데이트를 여기서 처리
                const dots = document.querySelectorAll('.progress-dot');
                let progress = self.progress;
                
                // 패널 전환은 전체 진행률의 80%까지만 사용
                let panelProgress = Math.min(progress / 0.8, 1);
                let current = Math.min(Math.floor(panelProgress * panels.length), panels.length - 1);
                
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === current);
                });
            }
        }
    });
    
    // 패널 이동 애니메이션 - 전체 타임라인의 80%만 사용
    tl.to(wrapper, {
        x: -scrollDistance,
        ease: "none",
        duration: 0.8 // 80%
    })
    // 나머지 20%는 마지막 패널 감상 시간
    .to({}, { duration: 0.2 });
    
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
            
            gsap.to(window, {
                scrollTo: targetScroll,
                duration: 1,
                ease: "power2.inOut"
            });
        });
    });
    
    // 리사이즈 처리 최적화
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
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
});