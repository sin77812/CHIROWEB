const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB 연결 성공!'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// 포트폴리오 스키마
const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// 블로그 스키마
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    readTime: { type: String, default: '5 min read' },
    date: { type: String, required: true },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// 포트폴리오 API 라우트
// 모든 포트폴리오 조회
app.get('/api/portfolios', async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (error) {
        console.error('Portfolio fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 특정 포트폴리오 조회
app.get('/api/portfolios/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다' });
        }
        res.json(portfolio);
    } catch (error) {
        console.error('Portfolio fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 포트폴리오 생성
app.post('/api/portfolios', async (req, res) => {
    try {
        const portfolio = new Portfolio({
            ...req.body,
            image: req.body.image || `https://picsum.photos/600/400?random=${Date.now()}`
        });
        await portfolio.save();
        console.log('포트폴리오 생성:', portfolio.title);
        res.status(201).json(portfolio);
    } catch (error) {
        console.error('Portfolio create error:', error);
        res.status(400).json({ error: error.message });
    }
});

// 포트폴리오 수정
app.put('/api/portfolios/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        if (!portfolio) {
            return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다' });
        }
        console.log('포트폴리오 수정:', portfolio.title);
        res.json(portfolio);
    } catch (error) {
        console.error('Portfolio update error:', error);
        res.status(400).json({ error: error.message });
    }
});

// 포트폴리오 삭제
app.delete('/api/portfolios/:id', async (req, res) => {
    try {
        const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ error: '포트폴리오를 찾을 수 없습니다' });
        }
        console.log('포트폴리오 삭제:', portfolio.title);
        res.status(204).send();
    } catch (error) {
        console.error('Portfolio delete error:', error);
        res.status(400).json({ error: error.message });
    }
});

// 블로그 API 라우트
// 모든 블로그 조회
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Blog fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 특정 블로그 조회
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: '블로그를 찾을 수 없습니다' });
        }
        res.json(blog);
    } catch (error) {
        console.error('Blog fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 블로그 생성
app.post('/api/blogs', async (req, res) => {
    try {
        const blog = new Blog({
            ...req.body,
            thumbnail: req.body.thumbnail || `https://picsum.photos/600/400?random=${Date.now()}`,
            date: req.body.date || new Date().toISOString().split('T')[0]
        });
        await blog.save();
        console.log('블로그 생성:', blog.title);
        res.status(201).json(blog);
    } catch (error) {
        console.error('Blog create error:', error);
        res.status(400).json({ error: error.message });
    }
});

// 블로그 수정
app.put('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
        if (!blog) {
            return res.status(404).json({ error: '블로그를 찾을 수 없습니다' });
        }
        console.log('블로그 수정:', blog.title);
        res.json(blog);
    } catch (error) {
        console.error('Blog update error:', error);
        res.status(400).json({ error: error.message });
    }
});

// 블로그 삭제
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: '블로그를 찾을 수 없습니다' });
        }
        console.log('블로그 삭제:', blog.title);
        res.status(204).send();
    } catch (error) {
        console.error('Blog delete error:', error);
        res.status(400).json({ error: error.message });
    }
});

// 통계 API
app.get('/api/stats', async (req, res) => {
    try {
        const portfolioCount = await Portfolio.countDocuments();
        const blogCount = await Blog.countDocuments();
        
        res.json({
            portfolioCount,
            blogCount,
            viewCount: 1234, // 임시 값
            contactCount: 23  // 임시 값
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 서버 상태 확인 API
app.get('/api/status', (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const status = dbState === 1 ? '연결됨' : '연결 안됨';
        
        res.json({
            status,
            dbState,
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 정적 파일 서빙 (HTML 파일들)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 CHIRO 서버가 포트 ${PORT}에서 실행중입니다`);
    console.log(`🌐 웹사이트: http://localhost:${PORT}`);
    console.log(`⚙️ 관리자: http://localhost:${PORT}/admin`);
});

module.exports = app;