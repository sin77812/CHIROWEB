const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

const app = express();

// 미들웨어 설정
// CORS 설정 (배포 도메인 환경 변수로 제어)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin / curl
    if (process.env.ALLOW_ALL_ORIGINS === 'true') return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true); // 기본 허용(개발 편의)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: Origin not allowed: ' + origin));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 업로드 디렉토리 준비
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
ensureDir(path.join(__dirname, 'uploads', 'portfolio'));
ensureDir(path.join(__dirname, 'uploads', 'blog'));

// Multer 설정 (디스크 저장)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.params.type; // 'portfolio' | 'blog'
    const dest = path.join(__dirname, 'uploads', type);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = (file.originalname && file.originalname.split('.').pop()) || 'jpg';
    cb(null, `${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// Multer 설정 (MongoDB GridFS 저장)
let gridStorage;
try {
  gridStorage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      const type = req.params.type === 'blog' ? 'blog' : 'portfolio';
      return {
        bucketName: type, // GridFS 버킷명
        filename: `${Date.now()}_${file.originalname.replace(/\s+/g,'_')}`
      };
    }
  });
} catch (e) {
  console.warn('GridFS storage init failed:', e.message);
}
const uploadGrid = gridStorage ? multer({ storage: gridStorage }) : null;

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

// 파일 업로드 API
app.post('/api/upload/:type(portfolio|blog)', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const type = req.params.type;
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${type}/${req.file.filename}`;
        res.json({ url: fileUrl, filename: req.file.filename, type });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 파일 업로드 API (MongoDB GridFS)
app.post('/api/upload-grid/:type(portfolio|blog)', (req, res, next) => {
    if (!uploadGrid) return res.status(503).json({ error: 'GridFS storage unavailable' });
    return uploadGrid.single('file')(req, res, (err) => {
        if (err) return next(err);
        try {
            const type = req.params.type;
            // multer-gridfs-storage가 저장 후 file.id 등을 req.file에 채움
            const id = req.file.id?.toString() || req.file.filename; // 일부 드라이버 차이 대응
            const fileUrl = `${req.protocol}://${req.get('host')}/api/files/${type}/${id}`;
            res.json({ url: fileUrl, id, type, filename: req.file.filename });
        } catch (error) {
            console.error('GridFS upload error:', error);
            res.status(500).json({ error: error.message });
        }
    });
});

// GridFS 파일 스트리밍 라우트
app.get('/api/files/:bucket(portfolio|blog)/:id', async (req, res) => {
    try {
        const bucketName = req.params.bucket;
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });

        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(req.params.id);
        } catch {
            // id가 filename일 수도 있으니 filename으로 조회
        }

        // Try by _id first
        if (objectId) {
            return bucket.openDownloadStream(objectId)
                .on('file', (file) => {
                    res.set('Content-Type', file.contentType || 'application/octet-stream');
                })
                .on('error', (err) => {
                    console.error('GridFS stream error:', err);
                    res.status(404).json({ error: 'File not found' });
                })
                .pipe(res);
        }

        // Fallback by filename
        bucket.find({ filename: req.params.id }).toArray((err, files) => {
            if (err || !files || files.length === 0) {
                return res.status(404).json({ error: 'File not found' });
            }
            const file = files[0];
            res.set('Content-Type', file.contentType || 'application/octet-stream');
            bucket.openDownloadStreamByName(file.filename).pipe(res);
        });
    } catch (error) {
        console.error('GridFS fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

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
