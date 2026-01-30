# AI Photobooth - Thiên Mã Nghinh Xuân 2026 🐎

Ứng dụng AI Photobooth với chủ đề Tết Việt Nam, cho phép chụp ảnh và biến đổi sang phong cách tranh thủy mặc Thiên Mã với AI.

## ✨ Tính năng

- 📸 **Chụp ảnh từ webcam** - Chụp trực tiếp từ camera
- 📤 **Tải ảnh lên** - Upload ảnh từ thiết bị
- 🎨 **AI xử lý ảnh** - Biến đổi sang phong cách tranh thủy mặc Việt Nam
- 📱 **QR Code** - Tạo mã QR để tải ảnh về điện thoại
- 🖼️ **Bộ sưu tập** - Lưu trữ và xem lại các ảnh đã xử lý
- 🌸 **Hiệu ứng động** - Hoa đào rơi, animation Thiên Mã
- 🎭 **Giao diện Tết** - Theme đỏ vàng kim truyền thống

## 🏗️ Cấu trúc Project

```
AI Photobooth/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   └── config.py    # Configuration
│   ├── uploads/         # Uploaded images
│   ├── processed/       # AI processed images
│   ├── main.py          # Entry point
│   └── requirements.txt # Python dependencies
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── App.jsx     # Main component
│   │   ├── api.js      # API calls
│   │   └── index.css   # Styles
│   └── package.json    # Node dependencies
└── system_prompt.txt   # AI system prompt
```

## 🚀 Cài đặt và Chạy

### Yêu cầu

- Python 3.8+
- Node.js 18+
- OpenRouter API Key

### 1. Backend Setup

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment (khuyến nghị)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env từ .env.example
copy .env.example .env

# Chỉnh sửa .env và thêm API key
# OPENROUTER_API_KEY=your_api_key_here
```

**Lấy OpenRouter API Key:**
1. Truy cập https://openrouter.ai/
2. Đăng ký/Đăng nhập
3. Vào Settings > API Keys
4. Tạo key mới và copy vào file .env

```bash
# Chạy backend server
python main.py
```

Backend sẽ chạy tại: http://localhost:8000
API Docs: http://localhost:8000/docs

### 2. Frontend Setup

Mở terminal mới:

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 📝 Sử dụng

1. **Khởi động Backend**: Chạy `python main.py` trong thư mục backend
2. **Khởi động Frontend**: Chạy `npm run dev` trong thư mục frontend
3. **Truy cập ứng dụng**: Mở http://localhost:3000 trên trình duyệt
4. **Chụp hoặc tải ảnh**: Chọn "CHỤP BẰNG CAMERA" hoặc "TẢI ẢNH LÊN"
5. **Đợi AI xử lý**: AI sẽ biến đổi ảnh sang phong cách tranh thủy mặc
6. **Tải về**: Quét mã QR hoặc nhấn nút "TẢI VỀ"

## 🎨 Tùy chỉnh System Prompt

Chỉnh sửa file `system_prompt.txt` để thay đổi cách AI xử lý ảnh:

```txt
Bạn là một nghệ sĩ AI chuyên về tranh thủy mặc Việt Nam với phong cách Thiên Mã nghinh xuân.

Nhiệm vụ của bạn là:
1. Phân tích ảnh chụp người dùng
2. Tạo mô tả chi tiết về cách biến đổi ảnh...
```

## 🛠️ API Endpoints

### Upload Image
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (image file)

Response: {
  "success": true,
  "image_id": "uuid",
  "processed_image_url": "/api/image/{id}/processed",
  "qr_code_url": "/api/image/{id}/qr",
  "download_url": "/api/download/{id}"
}
```

### Get Processed Image
```
GET /api/image/{image_id}/processed
Response: Image file (JPEG)
```

### Get QR Code
```
GET /api/image/{image_id}/qr
Response: QR Code image (PNG)
```

### Download Image
```
GET /api/download/{image_id}
Response: Image file download
```

### Get Gallery
```
GET /api/gallery
Response: {
  "success": true,
  "count": 5,
  "images": [...]
}
```

## 🎭 Animations & Effects

Ứng dụng bao gồm các hiệu ứng:
- ✨ **Float animation** cho con ngựa Thiên Mã
- 🌸 **Falling petals** - Hoa đào rơi
- 🔄 **Spin animation** khi xử lý AI
- 📱 **Smooth transitions** giữa các bước

## 🔧 Cấu hình

### Backend Configuration (backend/app/config.py)

```python
OPENROUTER_API_KEY = "your_key"
AI_MODEL = "anthropic/claude-3.5-sonnet"
MAX_IMAGE_SIZE = 2048
COMPRESSION_QUALITY = 85
QR_CODE_SIZE = 300
```

### Frontend Configuration (frontend/vite.config.js)

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

## 📦 Build cho Production

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
# Output sẽ ở thư mục dist/
```

## 🐛 Troubleshooting

### Lỗi camera không hoạt động
- Kiểm tra quyền truy cập camera trong trình duyệt
- Sử dụng HTTPS hoặc localhost
- Thử trình duyệt khác

### Lỗi API OpenRouter
- Kiểm tra API key trong file .env
- Kiểm tra credit còn lại trên OpenRouter
- Xem logs trong terminal backend

### Lỗi kết nối Frontend-Backend
- Đảm bảo backend đang chạy trên port 8000
- Kiểm tra CORS settings
- Xóa cache trình duyệt

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 🙏 Credits

- UI Design: Inspired by Vietnamese Tet aesthetics
- AI Processing: OpenRouter API
- Icons: Lucide React
- Framework: FastAPI + React + Vite

## 📧 Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ qua email.

---

**Chúc mừng năm mới - Vạn sự như ý! 🐎🌸**
