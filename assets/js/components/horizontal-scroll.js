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
    
    // 모바일 감지 및 pinType 결정
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // iOS는 무조건 transform, 안드로이드는 transform, PC는 fixed
    const pinType = isMobile ? 'transform' : 'fixed';
    
    // 메인 횡스크롤 타임라인 - 하나로 통합
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${scrollDistance}`,  // extraViewTime 제거
            pin: true,
            pinType: pinType,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: isiOS ? 1 : 0.5,
            fastScrollEnd: true,
            preventOverlaps: true,
            onToggle: (self) => {
                horizontalSection.classList.toggle('is-pinned', self.isActive);
                
                // iOS 전용: pin 해제 시 강제 정리
                if (isiOS && !self.isActive) {
                    setTimeout(() => {
                        horizontalSection.style.position = '';
                        horizontalSection.style.top = '';
                        horizontalSection.style.left = '';
                        horizontalSection.style.width = '';
                        horizontalSection.style.height = '';
                        horizontalSection.style.transform = '';
                    }, 50);
                }
            },
            onLeave: isiOS ? (self) => {
                // iOS 전용: 섹션을 벗어날 때 강제 해제
                horizontalSection.classList.remove('is-pinned');
                horizontalSection.style.position = '';
                horizontalSection.style.top = '';
                horizontalSection.style.left = '';
                horizontalSection.style.width = '';
                horizontalSection.style.height = '';
                horizontalSection.style.transform = '';
                console.log('iOS: Force unpin on leave');
            } : undefined,
            onEnterBack: isiOS ? (self) => {
                // iOS 전용: 역방향으로 재진입할 때 정상화
                console.log('iOS: Re-entering horizontal section');
            } : undefined,
            onUpdate: (self) => {
                // Progress dots 업데이트를 여기서 처리
                const dots = document.querySelectorAll('.progress-dot');
                let progress = self.progress;
                
                // iOS 전용: 역스크롤 시 진행률 보정
                if (isiOS) {
                    const currentScrollY = window.pageYOffset;
                    const sectionTop = horizontalSection.offsetTop;
                    const sectionHeight = scrollDistance;
                    
                    // 섹션 내에서의 상대적 위치 계산
                    if (currentScrollY >= sectionTop && currentScrollY <= sectionTop + sectionHeight) {
                        const relativeScroll = currentScrollY - sectionTop;
                        const correctedProgress = Math.min(Math.max(relativeScroll / sectionHeight, 0), 1);
                        
                        // 기존 progress와 차이가 크면 보정된 값 사용
                        if (Math.abs(correctedProgress - progress) > 0.1) {
                            progress = correctedProgress;
                            
                            // wrapper transform도 수동으로 보정
                            const correctedX = -scrollDistance * progress;
                            wrapper.style.transform = `translateX(${correctedX}px)`;
                            
                            console.log('iOS: Progress corrected from', self.progress.toFixed(3), 'to', progress.toFixed(3));
                        }
                    }
                }
                
                // 현재 패널 계산
                let current = Math.min(Math.floor(progress * panels.length), panels.length - 1);
                
                // iOS에서 패널 경계에서 더 정확한 계산
                if (isiOS && progress > 0) {
                    const exactPanel = progress * (panels.length - 1);
                    current = Math.round(exactPanel);
                }
                
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
            // 메인 타임라인 end와 일치하도록 계산
            const targetProgress = index / (panels.length - 1);
            // 현재 스크롤 거리 재계산하여 최신값 사용
            const currentScrollDistance = getScrollDistance();
            const targetScroll = horizontalSection.offsetTop + (currentScrollDistance * targetProgress);
            
            // iOS에서는 더 안전한 스크롤 방식 사용
            if (isiOS) {
                // iOS는 requestAnimationFrame으로 스크롤
                const startScroll = window.pageYOffset;
                const distance = targetScroll - startScroll;
                const duration = 800;
                let start = null;
                
                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    window.scrollTo(0, startScroll + distance * easeProgress);
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                
                window.requestAnimationFrame(step);
            } else {
                // PC와 Android는 기존 smooth scroll 사용
                try {
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                } catch (_) {
                    window.scrollTo(0, targetScroll);
                }
            }
        });
    });
    
    // 리사이즈 처리 최적화 (모바일 주소창 변화 대응)
    let resizeTimer;
    let lastHeight = window.innerHeight;
    
    const handleResize = () => {
        clearTimeout(resizeTimer);
        
        // iOS에서는 주소창으로 인한 작은 높이 변화는 무시
        const heightDiff = Math.abs(window.innerHeight - lastHeight);
        const isSmallChange = heightDiff < 100; // 100px 미만의 변화는 주소창
        
        if (isiOS && isSmallChange) {
            return; // iOS 주소창 변화는 무시
        }
        
        lastHeight = window.innerHeight;
        
        resizeTimer = setTimeout(() => {
            // 스크롤 위치를 기억하고 새로고침
            const currentProgress = tl.scrollTrigger ? tl.scrollTrigger.progress : 0;
            ScrollTrigger.refresh();
            // 스크롤 위치 복원
            if (currentProgress > 0 && tl.scrollTrigger) {
                tl.scrollTrigger.progress(currentProgress);
            }
        }, isMobile ? 100 : 250); // 모바일에서는 더 빠른 반응
    };
    
    window.addEventListener('resize', handleResize);
    // 모바일 오리엔테이션 변화 대응
    if (isMobile) {
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 200); // 오리엔테이션 변화 후 약간의 지연
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
    
    // iOS 전용: 갇힘 상태 감지 및 해제
    if (isiOS) {
        let lastScrollY = window.pageYOffset;
        let stuckCounter = 0;
        let isScrollingUp = false;
        
        const iosStuckDetection = () => {
            const currentScrollY = window.pageYOffset;
            const scrollDirection = currentScrollY < lastScrollY ? 'up' : 'down';
            isScrollingUp = scrollDirection === 'up';
            
            // 횡스크롤 섹션이 pin된 상태인지 확인
            const isPinned = horizontalSection.classList.contains('is-pinned');
            const sectionRect = horizontalSection.getBoundingClientRect();
            const isAtTop = sectionRect.top <= 0;
            
            // 위로 스크롤하는데 여전히 pin된 상태이고 섹션이 화면 상단에 있다면
            if (isScrollingUp && isPinned && isAtTop) {
                stuckCounter++;
                
                // 3번 연속 감지되면 강제 해제
                if (stuckCounter >= 3) {
                    console.log('iOS: Detected stuck state, forcing unpin and position correction');
                    
                    // 현재 어떤 패널에 있어야 하는지 계산
                    const shouldBeAtProgress = Math.max((currentScrollY - horizontalSection.offsetTop) / scrollDistance, 0);
                    const targetPanelIndex = Math.min(Math.floor(shouldBeAtProgress * panels.length), panels.length - 1);
                    
                    // wrapper를 올바른 위치로 이동
                    const correctX = -scrollDistance * shouldBeAtProgress;
                    wrapper.style.transform = `translateX(${correctX}px)`;
                    
                    // 점 표시도 업데이트
                    const dots = document.querySelectorAll('.progress-dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === targetPanelIndex);
                    });
                    
                    // 강제 pin 해제
                    horizontalSection.classList.remove('is-pinned');
                    horizontalSection.style.position = '';
                    horizontalSection.style.top = '';
                    horizontalSection.style.left = '';
                    horizontalSection.style.width = '';
                    horizontalSection.style.height = '';
                    horizontalSection.style.transform = '';
                    
                    // ScrollTrigger 새로고침
                    if (tl.scrollTrigger) {
                        tl.scrollTrigger.refresh();
                    }
                    
                    console.log('iOS: Corrected to panel', targetPanelIndex, 'with progress', shouldBeAtProgress.toFixed(3));
                    stuckCounter = 0;
                }
            } else {
                stuckCounter = 0;
            }
            
            lastScrollY = currentScrollY;
        };
        
        // iOS에서만 스크롤 모니터링
        window.addEventListener('scroll', iosStuckDetection, { passive: true });
        
        // iOS 전용: 부드러운 역스크롤을 위한 추가 모니터링
        let lastPanelIndex = -1;
        const iosSmoothReverse = () => {
            const isPinned = horizontalSection.classList.contains('is-pinned');
            if (!isPinned) return;
            
            const currentScrollY = window.pageYOffset;
            const sectionTop = horizontalSection.offsetTop;
            const relativeScroll = currentScrollY - sectionTop;
            const progress = Math.min(Math.max(relativeScroll / scrollDistance, 0), 1);
            const panelIndex = Math.round(progress * (panels.length - 1));
            
            // 패널이 바뀔 때 wrapper 위치 강제 보정
            if (panelIndex !== lastPanelIndex && panelIndex >= 0 && panelIndex < panels.length) {
                const targetX = -scrollDistance * (panelIndex / (panels.length - 1));
                const currentTransform = wrapper.style.transform;
                const currentX = currentTransform ? parseFloat(currentTransform.match(/-?\d+\.?\d*/)) || 0 : 0;
                
                // 현재 위치와 목표 위치가 많이 다르면 보정
                if (Math.abs(currentX - targetX) > scrollDistance * 0.1) {
                    wrapper.style.transform = `translateX(${targetX}px)`;
                    console.log('iOS: Panel transition corrected from', currentX, 'to', targetX, 'for panel', panelIndex);
                }
                
                lastPanelIndex = panelIndex;
            }
        };
        
        // 더 자주 체크 (60fps 목표)
        let smoothTimer;
        const startSmoothMonitoring = () => {
            if (smoothTimer) clearInterval(smoothTimer);
            smoothTimer = setInterval(iosSmoothReverse, 16); // ~60fps
        };
        
        const stopSmoothMonitoring = () => {
            if (smoothTimer) clearInterval(smoothTimer);
        };
        
        // pin 상태일 때만 모니터링
        const pinObserver = new MutationObserver(() => {
            const isPinned = horizontalSection.classList.contains('is-pinned');
            if (isPinned) {
                startSmoothMonitoring();
            } else {
                stopSmoothMonitoring();
                lastPanelIndex = -1;
            }
        });
        
        pinObserver.observe(horizontalSection, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        // iOS 전용: 5초 이상 galactic 상태면 강제 해제
        let stuckTimer = null;
        const startStuckTimer = () => {
            if (stuckTimer) clearTimeout(stuckTimer);
            stuckTimer = setTimeout(() => {
                if (horizontalSection.classList.contains('is-pinned')) {
                    console.log('iOS: 5초 타임아웃으로 강제 해제');
                    horizontalSection.classList.remove('is-pinned');
                    horizontalSection.style.position = '';
                    horizontalSection.style.top = '';
                    horizontalSection.style.left = '';
                    horizontalSection.style.width = '';
                    horizontalSection.style.height = '';
                    horizontalSection.style.transform = '';
                    if (tl.scrollTrigger) {
                        tl.scrollTrigger.refresh();
                    }
                }
            }, 5000);
        };
        
        // iOS에서 pin 상태가 되면 타이머 시작
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isPinned = horizontalSection.classList.contains('is-pinned');
                    if (isPinned) {
                        startStuckTimer();
                    } else {
                        if (stuckTimer) clearTimeout(stuckTimer);
                    }
                }
            });
        });
        
        observer.observe(horizontalSection, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        // 페이지 가시성 변경 시 상태 초기화
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && horizontalSection.classList.contains('is-pinned')) {
                if (stuckTimer) clearTimeout(stuckTimer);
            }
        });
    }
    
    // 스크롤 시 체크 (디버깅용)
    let scrollCheckTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollCheckTimeout);
        scrollCheckTimeout = setTimeout(checkVisibility, 500);
    });
});
