# CHIRO 🚀

**디지털 익스퍼런스의 새로운 기준을 제시하는 프리미엄 웹 에이전시**

Creating digital excellence through innovative design and development.

## ✨ Featured Projects

### 🏢 **Corporate & Business**
- **[NBPKOREA](https://nbpkorea.vercel.app/)** - 친환경 가스히터 설비 전문업체
- **[K&J Entertainment](https://kjco.vercel.app/)** - 엔터테인먼트 기업

### 🍽️ **F&B & Hospitality** 
- **[고요속의미식](https://japanese-french.vercel.app/)** - 일본식 프렌치 레스토랑
- **[니드커피](https://coffee-sigma-tawny.vercel.app/)** - 성수동 스페셜티 커피숍

### 💪 **Health & Wellness**
- **[리얼PT](https://gym-umber-three.vercel.app/)** - 개인 맞춤 피트니스
- **[LIFE PT](https://lpt-nu.vercel.app/)** - 목표 달성 코칭

### 🏠 **Interior & Design**
- **[ARC Studio](https://interior-orpin.vercel.app/)** - 인테리어 가구 전문
- **[후니 인테리어](https://funiture-olive.vercel.app/)** - 공간 디자인

### 🛒 **E-commerce & Retail**
- **[나나몰](https://nana-lilac.vercel.app/)** - 트렌디 온라인 쇼핑몰
- **[제철의정점](https://furits.vercel.app/)** - 신선한 제철 과일 전문

### 📸 **Creative & Services**
- **[유어모먼트](https://photo-cyan-five.vercel.app/)** - 프리미엄 사진관
- **[그레이스 스피치](https://grace-speech.vercel.app/)** - 전문 스피치 교육

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** + **CSS3** (Custom Design System)
- **Vanilla JavaScript** (ES6+)
- **GSAP** (Animations & Interactions)
- **Responsive Design** (Mobile-First)

### Backend & Database
- **Node.js** + **Express**
- **MongoDB Atlas** (Cloud Database)
- **Mongoose** (ODM)

### Development & Deployment
- **Vercel** (Hosting & Deployment)
- **Git** (Version Control)
- **NPM** (Package Management)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/sin77812/CHIRO.git
cd CHIRO

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start development server
npm run dev

# Open in browser
# Website: http://localhost:3000
# Admin Panel: http://localhost:3000/admin
```

### Admin Access
- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `chiro2024!`

---

## 📁 Project Structure

```
CHIRO/
├── 📄 index.html              # Main homepage
├── 📄 portfolio.html          # Portfolio showcase
├── 📄 about.html              # Company information  
├── 📄 contact.html            # Contact & inquiry
├── 📄 blog.html               # Blog & insights
├── 📄 admin.html              # Admin dashboard
├── 📄 login.html              # Admin authentication
├── 🎨 CSS/
│   ├── colors.css             # Color system
│   ├── typography.css         # Font system
│   ├── layout.css             # Grid & spacing
│   ├── animations.css         # GSAP animations
│   ├── icons.css              # Custom SVG icons
│   └── *.css                  # Page-specific styles
├── ⚡ JavaScript/
│   ├── data-manager.js        # Data management (localStorage)
│   ├── data-manager-api.js    # API integration (MongoDB)
│   ├── portfolio-data-real.js # Real portfolio data
│   └── *.js                   # Page-specific scripts
├── 🖥️ Backend/
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables
└── 📚 Documentation/
    ├── README.md              # Main documentation
    └── README-MONGODB.md      # Database setup guide
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-bg: #0A0A0A      /* Main background */
--secondary-bg: #111111     /* Section backgrounds */
--card-bg: #1A1A1A         /* Card backgrounds */

/* Text Colors */
--primary-text: #FFFFFF     /* Main text */
--secondary-text: #A0A0A0   /* Secondary text */
--disabled-text: #666666    /* Disabled states */

/* Accent Colors */
--accent-red: #FF3B30       /* Primary accent */
--accent-blue: #007AFF      /* Secondary accent */
--success: #34C759          /* Success states */
--warning: #FF9500          /* Warning states */
```

### Typography
- **Korean**: Black Han Sans (Titles), Pretendard (Body)
- **English**: Inter (Primary), SF Pro Display (Secondary)  
- **Code**: JetBrains Mono

### Spacing System
- **Section Gap**: 160px
- **Component Gap**: 80px
- **Element Gap**: 40px
- **Text Gap**: 24px
- **Minimum**: 8px

---

## 🔧 Features

### 🎯 **Frontend**
- ✅ Responsive Design (Mobile-First)
- ✅ Custom Icon System (SVG Masks)
- ✅ Smooth Animations (GSAP + ScrollTrigger)
- ✅ Dynamic Content Loading
- ✅ Real-time Data Synchronization
- ✅ Optimized Performance

### ⚙️ **Admin Panel**
- ✅ Portfolio Management (CRUD)
- ✅ Blog Management (CRUD)
- ✅ Real-time Preview
- ✅ Dashboard Analytics
- ✅ User Authentication
- ✅ Data Export/Import

### 🌐 **API & Database**
- ✅ RESTful API Design
- ✅ MongoDB Integration
- ✅ Offline Fallback (localStorage)
- ✅ Auto-sync on Network Recovery
- ✅ Error Handling & Logging

---

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
NODE_ENV=production
```

---

## 📈 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100  
- **SEO**: 95+

### Optimizations
- ✅ Image lazy loading
- ✅ CSS/JS minification
- ✅ GZIP compression
- ✅ CDN integration
- ✅ Preload critical resources

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**CHIRO** - Digital Excellence Agency

- 📧 **Email**: chiro75web@gmail.com
- 🌐 **Website**: [CHIRO Portfolio](https://github.com/sin77812/CHIRO)
- 💼 **LinkedIn**: [Connect with us](https://linkedin.com/company/chiro)

---

<div align="center">

**🚀 Built with passion by CHIRO Team**

*Creating digital excellence through innovative design and development*

</div>