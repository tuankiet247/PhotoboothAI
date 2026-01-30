# 📦 CẤU TRÚC PROJECT - AI PHOTOBOOTH

## 📁 Tổng quan cây thư mục

```
AI Photobooth/
│
├── 📄 README.md                    # Tài liệu chính
├── 📄 QUICKSTART.md                # Hướng dẫn khởi động nhanh
├── 📄 FEATURES.md                  # Chi tiết tính năng
├── 📄 OPENROUTER_GUIDE.md          # Hướng dẫn lấy API key
├── 📄 CHANGELOG.md                 # Lịch sử thay đổi
├── 📄 CONTRIBUTING.md              # Hướng dẫn đóng góp
├── 📄 LICENSE                      # Giấy phép MIT
├── 📄 system_prompt.txt            # Prompt cho AI xử lý ảnh
│
├── 🔧 setup_backend.bat            # Script cài đặt backend
├── 🔧 setup_frontend.bat           # Script cài đặt frontend
├── ▶️ start_backend.bat            # Script chạy backend
├── ▶️ start_frontend.bat           # Script chạy frontend
├── ▶️ start_all.bat                # Script chạy cả hai
│
├── 📂 backend/                     # FastAPI Backend
│   ├── 📄 main.py                  # Entry point
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 .env                     # Environment variables (tự tạo)
│   ├── 📄 .gitignore               # Git ignore rules
│   ├── 📄 README.md                # Backend documentation
│   │
│   ├── 📂 app/                     # Application code
│   │   ├── 📄 config.py            # Configuration
│   │   │
│   │   ├── 📂 routes/              # API endpoints
│   │   │   └── 📄 images.py        # Image routes
│   │   │
│   │   └── 📂 services/            # Business logic
│   │       ├── 📄 ai_service.py    # AI processing
│   │       ├── 📄 image_processor.py   # Image operations
│   │       └── 📄 qr_generator.py  # QR code generation
│   │
│   ├── 📂 uploads/                 # Uploaded images (auto-created)
│   │   └── .gitkeep
│   │
│   └── 📂 processed/               # Processed images (auto-created)
│       └── .gitkeep
│
└── 📂 frontend/                    # React Frontend
    ├── 📄 package.json             # Node dependencies
    ├── 📄 vite.config.js           # Vite configuration
    ├── 📄 tailwind.config.js       # Tailwind configuration
    ├── 📄 postcss.config.js        # PostCSS configuration
    ├── 📄 .gitignore               # Git ignore rules
    ├── 📄 README.md                # Frontend documentation
    ├── 📄 index.html               # HTML template
    │
    └── 📂 src/                     # Source code
        ├── 📄 main.jsx             # Entry point
        ├── 📄 App.jsx              # Main component
        ├── 📄 index.css            # Global styles
        ├── 📄 api.js               # API calls
        ├── 📄 constants.js         # Constants
        ├── 📄 utils.js             # Utility functions
        │
        └── 📂 components/          # React components
            ├── 📄 LoadingSpinner.jsx   # Loading component
            ├── 📄 ErrorMessage.jsx     # Error component
            ├── 📄 HorseAnimation.jsx   # Horse animation
            └── 📄 PetalsFalling.jsx    # Petals animation
```

---

## 🗂️ Chi tiết các file quan trọng

### 📄 Root Level Files

| File | Mục đích |
|------|----------|
| `README.md` | Tài liệu chính, hướng dẫn cài đặt và sử dụng |
| `QUICKSTART.md` | Hướng dẫn khởi động nhanh cho người mới |
| `FEATURES.md` | Chi tiết về tất cả tính năng |
| `OPENROUTER_GUIDE.md` | Hướng dẫn lấy OpenRouter API key |
| `CHANGELOG.md` | Lịch sử phiên bản và thay đổi |
| `CONTRIBUTING.md` | Hướng dẫn đóng góp cho developers |
| `LICENSE` | Giấy phép MIT |
| `system_prompt.txt` | Prompt hướng dẫn AI xử lý ảnh |

### 🔧 Batch Scripts (Windows)

| File | Chức năng |
|------|----------|
| `setup_backend.bat` | Tự động cài đặt backend (venv, pip install) |
| `setup_frontend.bat` | Tự động cài đặt frontend (npm install) |
| `start_backend.bat` | Khởi động backend server |
| `start_frontend.bat` | Khởi động frontend server |
| `start_all.bat` | Khởi động cả hai server cùng lúc |

---

## 🔙 Backend Structure

### 📄 Main Files

```python
# main.py - Entry point
from fastapi import FastAPI
app = FastAPI()
# Include routes, middleware, etc.

# config.py - Configuration
class Settings:
    OPENROUTER_API_KEY: str
    AI_MODEL: str
    # ... other configs
```

### 📂 Routes

```python
# app/routes/images.py
@router.post("/api/upload")          # Upload ảnh
@router.get("/api/image/{id}/processed")  # Lấy ảnh đã xử lý
@router.get("/api/image/{id}/qr")    # Lấy QR code
@router.get("/api/download/{id}")    # Download ảnh
@router.get("/api/gallery")          # Danh sách ảnh
```

### 📂 Services

```python
# app/services/ai_service.py
class AIService:
    def process_image_with_ai()      # Xử lý với OpenRouter
    def generate_artistic_image()    # Tạo ảnh nghệ thuật

# app/services/image_processor.py
class ImageProcessor:
    def resize_image()               # Resize ảnh
    def compress_image()             # Nén ảnh
    def image_to_base64()            # Convert sang base64

# app/services/qr_generator.py
class QRCodeGenerator:
    def generate_qr_code()           # Tạo QR code
    def generate_download_url_qr()   # QR cho download URL
```

### 📂 Storage

```
uploads/                             # Ảnh gốc từ người dùng
  └── {uuid}_original.jpg

processed/                           # Ảnh đã xử lý bởi AI
  ├── {uuid}_processed.jpg           # Ảnh kết quả
  └── {uuid}_qr.png                  # QR code
```

---

## 🎨 Frontend Structure

### 📄 Configuration Files

```javascript
// vite.config.js - Vite setup
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, proxy: {...} }
})

// tailwind.config.js - Tailwind CSS
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: { extend: { animations: {...} } }
}
```

### 📄 Main Application

```jsx
// App.jsx - Main component
- State management (step, images, loading, etc.)
- Camera access
- File upload
- API integration
- UI rendering

// main.jsx - Entry point
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
```

### 📄 Supporting Files

```javascript
// api.js - API calls
export const uploadImage = async (file) => {...}
export const getProcessedImage = (imageId) => {...}
export const getQRCode = (imageId) => {...}

// constants.js - Constants
export const STEPS = { HOME, CAPTURE, PROCESSING, ... }
export const MESSAGES = { LOADING, ERROR, ... }
export const IMAGE_CONFIG = { MAX_SIZE, FORMATS, ... }

// utils.js - Utility functions
export const compressImage = (file) => {...}
export const downloadFile = (url) => {...}
export const formatFileSize = (bytes) => {...}
```

### 📂 Components

```jsx
// LoadingSpinner.jsx
<LoadingSpinner message="Đang xử lý..." />

// ErrorMessage.jsx
<ErrorMessage message="Có lỗi xảy ra" onClose={...} />

// HorseAnimation.jsx
<HorseAnimation size="large" />

// PetalsFalling.jsx
<PetalsFalling count={15} />
```

---

## 🔄 Data Flow

### 1. Upload Flow
```
User Upload → Frontend
              ↓
          Validation
              ↓
          API Call (POST /api/upload)
              ↓
          Backend receives file
              ↓
          Image Processing (resize, compress)
              ↓
          AI Service (OpenRouter API)
              ↓
          Generate artistic version
              ↓
          Save to processed/
              ↓
          Generate QR code
              ↓
          Return URLs to Frontend
              ↓
          Display result + QR
```

### 2. Camera Capture Flow
```
User clicks "Chụp" → Request camera access
                           ↓
                      getUserMedia()
                           ↓
                      Show video preview
                           ↓
                      User clicks capture
                           ↓
                      Canvas.drawImage()
                           ↓
                      Convert to Blob
                           ↓
                      → Upload Flow (như trên)
```

### 3. Download Flow
```
User clicks "Tải về" → Download URL
                           ↓
                      GET /api/download/{id}
                           ↓
                      Backend serves file
                           ↓
                      Browser downloads

OR

User scans QR → Mobile browser opens URL
                    ↓
               GET /api/download/{id}
                    ↓
               File downloaded to phone
```

---

## 🔌 API Integration

### OpenRouter API Flow

```
Frontend → Backend → OpenRouter
                        ↓
                   Claude 3.5 Sonnet
                        ↓
                   AI Response
                        ↓
Backend processes → Frontend displays
```

### Request Example
```python
# Backend to OpenRouter
POST https://openrouter.ai/api/v1/chat/completions
Headers: {
  "Authorization": "Bearer sk-or-v1-xxx",
  "Content-Type": "application/json"
}
Body: {
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": [
      {"type": "image_url", "image_url": {...}},
      {"type": "text", "text": "Transform to ink painting"}
    ]}
  ]
}
```

---

## 💾 Storage Strategy

### Current (Development)
```
Local Filesystem
├── uploads/     → Original images
└── processed/   → AI-processed images + QR codes

In-Memory
└── processed_images = {}  → Metadata
```

### Future (Production)
```
Database (PostgreSQL)
├── users table
├── images table
│   ├── id
│   ├── user_id
│   ├── original_path
│   ├── processed_path
│   ├── qr_path
│   ├── created_at
│   └── metadata (JSON)

Cloud Storage (S3/R2)
├── originals/
│   └── {user_id}/{image_id}.jpg
└── processed/
    ├── {user_id}/{image_id}_processed.jpg
    └── {user_id}/{image_id}_qr.png
```

---

## 🎯 Key Technologies

### Backend Stack
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pillow** - Image processing
- **httpx** - Async HTTP client
- **qrcode** - QR code generation
- **python-dotenv** - Environment variables

### Frontend Stack
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **Lucide React** - Icons
- **Axios** - HTTP client

### External Services
- **OpenRouter** - AI model access gateway
- **Claude 3.5 Sonnet** - Default AI model

---

## 📊 Performance Considerations

### Backend
- ✅ Async/await throughout
- ✅ Image compression (85% quality)
- ✅ Max dimension limit (2048px)
- ✅ Streaming file uploads
- ⬜ TODO: Caching
- ⬜ TODO: Rate limiting
- ⬜ TODO: Background tasks

### Frontend
- ✅ Lazy component loading
- ✅ Debounced camera access
- ✅ Optimized re-renders
- ✅ Code splitting (Vite)
- ⬜ TODO: Service Worker
- ⬜ TODO: Image lazy loading
- ⬜ TODO: Progressive loading

---

## 🔒 Security Considerations

### Current
- ✅ API key in .env (not committed)
- ✅ CORS properly configured
- ✅ File type validation
- ✅ File size limits
- ⬜ TODO: Rate limiting
- ⬜ TODO: Authentication
- ⬜ TODO: Input sanitization
- ⬜ TODO: HTTPS in production

### Recommendations
1. Use HTTPS in production
2. Implement authentication
3. Add rate limiting
4. Sanitize file names
5. Scan uploaded files
6. Set up monitoring
7. Regular security audits

---

## 📈 Scaling Considerations

### Current Architecture
```
Single Server
├── Backend (FastAPI)
├── Frontend (Vite dev)
└── Local Storage
```

### Scaled Architecture
```
Load Balancer
├── Backend Servers (n instances)
│   ├── Stateless
│   └── Horizontal scaling
├── Database (PostgreSQL)
│   ├── Master-Replica
│   └── Connection pooling
├── Cache Layer (Redis)
│   ├── Session storage
│   └── API response cache
├── Object Storage (S3/R2)
│   ├── CDN
│   └── Global distribution
└── Frontend (Static hosting)
    ├── CDN
    └── Edge caching
```

---

**Cập nhật**: Tháng 1/2026
**Version**: 1.0.0
