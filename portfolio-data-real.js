// 실제 포트폴리오 데이터 - CHIRO 작업물
const realPortfolioData = [
    // 대표작 4개 우선
    {
        id: 1,
        title: "NBPKOREA",
        category: "web",
        year: 2024,
        description: "친환경 가스히터 설비 전문업체 NBPKOREA의 기업 웹사이트. 환경친화적 기업 이미지와 전문성을 강조한 미니멀하고 모던한 디자인으로 구축했습니다.",
        image: "https://picsum.photos/600/400?random=nbp",
        url: "https://nbpkorea.vercel.app/",
        status: "active",
        featured: true,
        tags: ["Corporate", "Environment", "B2B"],
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: "고요속의미식",
        category: "web",
        year: 2024,
        description: "일본식 프렌치 레스토랑의 우아하고 세련된 브랜드 아이덴티티를 웹에 구현. 고급스러운 분위기와 미식 경험을 디지털로 전달하는 프리미엄 레스토랑 웹사이트입니다.",
        image: "https://picsum.photos/600/500?random=french",
        url: "https://japanese-french.vercel.app/",
        status: "active",
        featured: true,
        tags: ["Restaurant", "Premium", "Japanese-French"],
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: "리얼PT",
        category: "web",
        year: 2024,
        description: "개인 맞춤형 피트니스 솔루션을 제공하는 헬스장 웹사이트. 역동적이고 에너지 넘치는 디자인으로 건강한 라이프스타일을 추구하는 고객들에게 어필합니다.",
        image: "https://picsum.photos/600/450?random=gym",
        url: "https://gym-umber-three.vercel.app/",
        status: "active",
        featured: true,
        tags: ["Fitness", "Health", "Personal Training"],
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        title: "유어모먼트",
        category: "web",
        year: 2024,
        description: "특별한 순간을 영원히 기록하는 프리미엄 사진관 웹사이트. 감성적이고 따뜻한 톤의 디자인으로 소중한 추억을 담아내는 브랜드 스토리를 표현했습니다.",
        image: "https://picsum.photos/600/400?random=photo",
        url: "https://photo-cyan-five.vercel.app/",
        status: "active",
        featured: true,
        tags: ["Photography", "Memory", "Premium"],
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        title: "ARC Studio",
        category: "web",
        year: 2024,
        description: "인테리어 가구 전문 회사 ARC Studio의 포트폴리오 웹사이트. 모던하고 세련된 인테리어 디자인을 강조한 미니멀리스트 웹 경험을 제공합니다.",
        image: "https://picsum.photos/600/550?random=interior1",
        url: "https://interior-orpin.vercel.app/",
        status: "active",
        featured: true,
        tags: ["Interior", "Furniture", "Design"],
        createdAt: new Date().toISOString()
    },
    
    // 나머지 포트폴리오들
    {
        id: 6,
        title: "제철의정점",
        category: "ecommerce",
        year: 2024,
        description: "신선한 제철 과일을 전문으로 하는 온라인 과일가게. 자연스럽고 친근한 디자인으로 건강하고 신선한 과일의 매력을 어필하는 이커머스 플랫폼입니다.",
        image: "https://picsum.photos/600/400?random=fruits",
        url: "https://furits.vercel.app/",
        status: "active",
        featured: false,
        tags: ["E-commerce", "Food", "Fresh"],
        createdAt: new Date().toISOString()
    },
    {
        id: 7,
        title: "그레이스 스피치",
        category: "web",
        year: 2024,
        description: "전문적인 스피치 교육을 제공하는 학원 웹사이트. 신뢰감과 전문성을 강조한 깔끔하고 모던한 디자인으로 교육 서비스의 품질을 어필합니다.",
        image: "https://picsum.photos/600/450?random=speech",
        url: "https://grace-speech.vercel.app/",
        status: "active",
        featured: false,
        tags: ["Education", "Speech", "Academy"],
        createdAt: new Date().toISOString()
    },
    {
        id: 8,
        title: "니드커피",
        category: "web",
        year: 2024,
        description: "성수동의 감성 넘치는 스페셜티 커피숍 웹사이트. 따뜻하고 아늑한 카페 분위기를 디지털로 구현하여 브랜드의 독특한 개성을 표현했습니다.",
        image: "https://picsum.photos/600/500?random=coffee",
        url: "https://coffee-sigma-tawny.vercel.app/",
        status: "active",
        featured: false,
        tags: ["Cafe", "Coffee", "Seongsu"],
        createdAt: new Date().toISOString()
    },
    {
        id: 9,
        title: "K&J Entertainment",
        category: "web",
        year: 2024,
        description: "엔터테인먼트 업계의 혁신을 추구하는 K&J의 기업 웹사이트. 크리에이티브하고 역동적인 디자인으로 엔터테인먼트 산업의 에너지를 표현했습니다.",
        image: "https://picsum.photos/600/400?random=entertainment",
        url: "https://kjco.vercel.app/",
        status: "active",
        featured: false,
        tags: ["Entertainment", "Creative", "Media"],
        createdAt: new Date().toISOString()
    },
    {
        id: 10,
        title: "후니 인테리어",
        category: "web",
        year: 2024,
        description: "개성 있고 창의적인 공간 디자인을 전문으로 하는 인테리어 회사 웹사이트. 따뜻하고 친근한 브랜드 이미지를 웹에서 효과적으로 전달합니다.",
        image: "https://picsum.photos/600/550?random=interior2",
        url: "https://funiture-olive.vercel.app/",
        status: "active",
        featured: false,
        tags: ["Interior", "Design", "Space"],
        createdAt: new Date().toISOString()
    },
    {
        id: 11,
        title: "나나몰",
        category: "ecommerce",
        year: 2024,
        description: "트렌디하고 스타일리시한 온라인 쇼핑몰. 젊은 세대를 타겟으로 한 모던하고 사용자 친화적인 쇼핑 경험을 제공하는 이커머스 플랫폼입니다.",
        image: "https://picsum.photos/600/400?random=shopping",
        url: "https://nana-lilac.vercel.app/",
        status: "active",
        featured: false,
        tags: ["E-commerce", "Fashion", "Trendy"],
        createdAt: new Date().toISOString()
    },
    {
        id: 12,
        title: "LIFE PT",
        category: "web",
        year: 2024,
        description: "개인 목표 달성을 위한 전문 코칭 서비스 웹사이트. 동기부여와 성취감을 강조한 임팩트 있는 디자인으로 코칭 서비스의 가치를 전달합니다.",
        image: "https://picsum.photos/600/450?random=coaching",
        url: "https://lpt-nu.vercel.app/",
        status: "active",
        featured: false,
        tags: ["Coaching", "Motivation", "Personal"],
        createdAt: new Date().toISOString()
    }
];

// localStorage에 실제 데이터 저장
function loadRealPortfolioData() {
    localStorage.setItem('chiro_portfolio_data', JSON.stringify(realPortfolioData));
    console.log('✅ 실제 포트폴리오 데이터 로드 완료:', realPortfolioData.length + '개 프로젝트');
    
    // 데이터 변경 알림
    const event = new CustomEvent('dataManagerUpdate', {
        detail: { type: 'portfolio', timestamp: Date.now() }
    });
    window.dispatchEvent(event);
    
    // Storage 이벤트도 발생
    const storageEvent = new StorageEvent('storage', {
        key: 'chiro_portfolio_data',
        newValue: JSON.stringify(realPortfolioData),
        storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
}

// 즉시 실행
if (typeof window !== 'undefined') {
    loadRealPortfolioData();
}