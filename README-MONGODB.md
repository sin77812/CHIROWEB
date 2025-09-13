# CHIRO MongoDB API 설정 가이드

## 🚀 빠른 시작

### 1. 필요한 패키지 설치
```bash
npm install
```

### 2. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 또는 일반 실행
npm start
```

### 3. 접속 확인
- **웹사이트**: http://localhost:3000
- **관리자 페이지**: http://localhost:3000/admin
- **API 엔드포인트**: http://localhost:3000/api

---

## 📋 API 엔드포인트

### 포트폴리오 API
- `GET /api/portfolios` - 모든 포트폴리오 조회
- `GET /api/portfolios/:id` - 특정 포트폴리오 조회
- `POST /api/portfolios` - 포트폴리오 생성
- `PUT /api/portfolios/:id` - 포트폴리오 수정
- `DELETE /api/portfolios/:id` - 포트폴리오 삭제

### 블로그 API
- `GET /api/blogs` - 모든 블로그 조회
- `GET /api/blogs/:id` - 특정 블로그 조회
- `POST /api/blogs` - 블로그 생성
- `PUT /api/blogs/:id` - 블로그 수정
- `DELETE /api/blogs/:id` - 블로그 삭제

### 통계 API
- `GET /api/stats` - 대시보드 통계 데이터

---

## 🔧 설정

### MongoDB 연결 문자열
`.env` 파일에서 MongoDB URI를 확인/수정하세요:

```env
MONGODB_URI=mongodb+srv://sin77812_db_user:QHawZBSZpceFgBy1@chiro.xxxxx.mongodb.net/chiro_db?retryWrites=true&w=majority&appName=chiro
PORT=3000
NODE_ENV=development
```

### 데이터 동기화 방식
1. **온라인**: MongoDB API 사용
2. **오프라인**: localStorage fallback 사용
3. **자동 동기화**: 네트워크 상태에 따라 자동 전환

---

## 🛠️ 개발자 가이드

### data-manager-api.js 사용법
```javascript
// MongoDB API 버전 사용 (권장)
<script src="data-manager-api.js"></script>

// 기존 localStorage 버전
<script src="data-manager.js"></script>
```

### HTML 파일 스크립트 교체
MongoDB를 사용하려면 HTML 파일에서 스크립트 태그를 변경하세요:

**변경 전:**
```html
<script src="data-manager.js"></script>
```

**변경 후:**
```html
<script src="data-manager-api.js"></script>
```

---

## 🔄 데이터 마이그레이션

기존 localStorage 데이터를 MongoDB로 이동하려면:

1. 관리자 페이지에서 기존 데이터 확인
2. MongoDB API 활성화
3. 데이터가 자동으로 동기화됨

---

## 🚨 문제 해결

### 서버 연결 실패
- MongoDB Atlas 연결 문자열 확인
- 네트워크 연결 상태 확인
- 방화벽 설정 확인

### API 호출 실패
- CORS 설정 확인
- 포트 번호 확인 (3000)
- 브라우저 콘솔에서 에러 메시지 확인

### 데이터 동기화 문제
- localStorage와 MongoDB 데이터 비교
- 브라우저 개발자 도구에서 네트워크 탭 확인

---

## 📦 배포

### Vercel 배포
```bash
# vercel.json 파일 생성 필요
npm install -g vercel
vercel
```

### Railway 배포
```bash
# railway.toml 파일 생성 필요
npm install -g @railway/cli
railway login
railway deploy
```

---

## 🔐 보안

- MongoDB Atlas IP 화이트리스트 설정
- 환경변수로 민감한 정보 관리
- HTTPS 사용 권장 (배포 시)

---

## 📞 지원

문제가 발생하면:
1. 브라우저 콘솔 확인
2. 서버 로그 확인
3. MongoDB Atlas 연결 상태 확인