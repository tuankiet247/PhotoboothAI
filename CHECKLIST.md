# ✅ CHECKLIST - Trước khi chạy AI Photobooth

## 📋 Pre-flight Checklist

Kiểm tra các mục sau trước khi khởi động ứng dụng:

---

## 🔧 1. Yêu cầu hệ thống

### Python
```bash
python --version
```
- [ ] Python >= 3.8
- [ ] pip đã cài đặt

**Nếu chưa có**: Download từ https://python.org/downloads/

### Node.js & npm
```bash
node --version
npm --version
```
- [ ] Node.js >= 18
- [ ] npm >= 9

**Nếu chưa có**: Download từ https://nodejs.org/

---

## 📂 2. Cấu trúc thư mục

Kiểm tra các thư mục/file sau đã tồn tại:

### Root Level
```
AI Photobooth/
├── [ ] README.md
├── [ ] QUICKSTART.md
├── [ ] system_prompt.txt
├── [ ] setup_backend.bat
├── [ ] setup_frontend.bat
├── [ ] start_backend.bat
├── [ ] start_frontend.bat
├── [ ] start_all.bat
├── [ ] backend/
└── [ ] frontend/
```

### Backend
```
backend/
├── [ ] main.py
├── [ ] requirements.txt
├── [ ] .env.example
├── [ ] app/config.py
├── [ ] app/routes/images.py
├── [ ] app/services/ai_service.py
├── [ ] app/services/image_processor.py
└── [ ] app/services/qr_generator.py
```

### Frontend
```
frontend/
├── [ ] package.json
├── [ ] vite.config.js
├── [ ] tailwind.config.js
├── [ ] index.html
├── [ ] src/main.jsx
├── [ ] src/App.jsx
└── [ ] src/api.js
```

---

## 🔑 3. OpenRouter API Key

### Đã có tài khoản?
- [ ] Đã đăng ký tại https://openrouter.ai/
- [ ] Đã xác thực email
- [ ] Đã nạp credit (ít nhất $5)

### Đã có API Key?
- [ ] Đã tạo API key
- [ ] Đã copy key (format: sk-or-v1-xxx...)
- [ ] Key còn credit

**Nếu chưa**: Xem [OPENROUTER_GUIDE.md](OPENROUTER_GUIDE.md)

---

## ⚙️ 4. Backend Setup

### Virtual Environment
```bash
cd backend
python -m venv venv
```
- [ ] Virtual environment đã tạo (thư mục `venv/`)

### Dependencies
```bash
venv\Scripts\activate
pip install -r requirements.txt
```
- [ ] Đã cài đặt tất cả packages
- [ ] Không có lỗi khi cài đặt

### Environment Variables
```bash
copy .env.example .env
```
- [ ] File `.env` đã tồn tại
- [ ] Đã điền `OPENROUTER_API_KEY`
- [ ] Đã chọn AI model (hoặc dùng mặc định)

**Kiểm tra file .env:**
```
OPENROUTER_API_KEY=sk-or-v1-[your-actual-key-here]
AI_MODEL=anthropic/claude-3.5-sonnet
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=http://localhost:3000
```

---

## 🎨 5. Frontend Setup

### Dependencies
```bash
cd frontend
npm install
```
- [ ] `node_modules/` đã tồn tại
- [ ] Không có lỗi khi install
- [ ] Tất cả dependencies đã cài

**Kiểm tra:**
```bash
npm list --depth=0
```
Nên thấy:
- react@18.x
- vite@5.x
- tailwindcss@3.x
- lucide-react@0.x
- axios@1.x

---

## 🌐 6. Network & Firewall

### Ports
- [ ] Port 8000 chưa bị chiếm dụng (Backend)
- [ ] Port 3000 chưa bị chiếm dụng (Frontend)

**Kiểm tra:**
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

Nếu có process đang dùng, kill nó hoặc đổi port trong config.

### Firewall
- [ ] Firewall cho phép Python
- [ ] Firewall cho phép Node.js
- [ ] Antivirus không block

---

## 📸 7. Camera (Optional)

Nếu dùng tính năng chụp:

### Browser Permissions
- [ ] Browser hỗ trợ `getUserMedia()` (Chrome, Edge, Firefox)
- [ ] Sử dụng HTTPS hoặc localhost
- [ ] Camera đã kết nối

### Camera Test
1. Mở https://www.webcamtests.com/
2. Cho phép truy cập camera
3. Thấy hình ảnh camera

- [ ] Camera hoạt động bình thường

---

## 🧪 8. Test Backend

### Start Server
```bash
cd backend
venv\Scripts\activate
python main.py
```

**Kiểm tra console output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

- [ ] Server khởi động không lỗi
- [ ] Port 8000 đang listen

### Test Endpoints
Mở browser, truy cập:

1. **Health check**: http://localhost:8000/
   - [ ] Thấy: `{"message": "AI Photobooth Tet API", ...}`

2. **API Docs**: http://localhost:8000/docs
   - [ ] Thấy Swagger UI
   - [ ] Có các endpoints: `/api/upload`, `/api/gallery`, etc.

---

## 🎨 9. Test Frontend

### Start Dev Server
```bash
cd frontend
npm run dev
```

**Kiểm tra console output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

- [ ] Server khởi động không lỗi
- [ ] Port 3000 đang listen

### Test UI
Mở browser: http://localhost:3000/

- [ ] Thấy giao diện trang chủ
- [ ] Thấy logo "THIÊN MÃ"
- [ ] Thấy con ngựa animate
- [ ] Thấy hoa đào rơi
- [ ] Thấy 3 nút: "CHỤP", "TẢI ẢNH", "BỘ SƯU TẬP"
- [ ] CSS load đúng (màu đỏ vàng)
- [ ] Không có lỗi trong Console (F12)

---

## 🔗 10. Integration Test

### Upload Test Image

1. Chuẩn bị ảnh test (JPG/PNG, < 10MB)
2. Nhấn "TẢI ẢNH LÊN"
3. Chọn file
4. Đợi upload

**Kiểm tra:**
- [ ] File upload thành công
- [ ] Thấy màn hình "AI Đang Hóa Mã..."
- [ ] Backend log không có lỗi
- [ ] Sau 15-30s thấy kết quả
- [ ] Thấy ảnh đã xử lý
- [ ] Thấy mã QR
- [ ] Nút "TẢI VỀ" hoạt động
- [ ] Gallery cập nhật

### Camera Test (Optional)

1. Nhấn "CHỤP BẰNG CAMERA"
2. Cho phép truy cập camera
3. Thấy preview
4. Nhấn nút chụp

**Kiểm tra:**
- [ ] Camera access granted
- [ ] Thấy video preview
- [ ] Chụp thành công
- [ ] Xử lý như upload test ở trên

---

## 📊 11. Performance Check

### Backend
```bash
# Check memory usage
# Windows Task Manager → Python process
```
- [ ] CPU usage < 50% (idle)
- [ ] Memory < 500MB (idle)

### Frontend
```bash
# Browser DevTools → Performance
```
- [ ] Initial load < 2s
- [ ] No memory leaks
- [ ] Smooth animations (60 FPS)

---

## 🐛 12. Common Issues

### Backend không start

**Problem**: `ModuleNotFoundError`
```bash
# Solution
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

**Problem**: `Port 8000 already in use`
```bash
# Solution: Kill process or change port in .env
PORT=8001
```

**Problem**: `Invalid API key`
```bash
# Solution: Check .env file
type backend\.env
# Verify OPENROUTER_API_KEY is correct
```

### Frontend không start

**Problem**: `Cannot find module`
```bash
# Solution
cd frontend
rmdir /s /q node_modules
npm install
```

**Problem**: `Port 3000 already in use`
```bash
# Solution: Kill process or edit vite.config.js
server: { port: 3001 }
```

### Connection Error

**Problem**: Frontend không kết nối Backend
```bash
# Solution
# 1. Check backend is running on port 8000
# 2. Check frontend proxy in vite.config.js
# 3. Clear browser cache (Ctrl+Shift+Del)
# 4. Restart both servers
```

---

## ✅ Final Checklist

Trước khi sử dụng production:

- [ ] ✅ Tất cả checks ở trên đều pass
- [ ] ✅ Backend running stable
- [ ] ✅ Frontend loading correctly
- [ ] ✅ Upload test successful
- [ ] ✅ AI processing working
- [ ] ✅ QR code generating
- [ ] ✅ Download working
- [ ] ✅ Gallery displaying
- [ ] ✅ No console errors
- [ ] ✅ Performance acceptable

---

## 🚀 Ready to Launch!

Nếu tất cả checks đều ✅, bạn đã sẵn sàng:

```bash
# Chạy cả hai server
start_all.bat

# Hoặc thủ công
# Terminal 1:
start_backend.bat

# Terminal 2:
start_frontend.bat
```

**Truy cập**: http://localhost:3000

---

## 📞 Need Help?

- 📖 [README.md](README.md)
- 🚀 [QUICKSTART.md](QUICKSTART.md)
- 🔑 [OPENROUTER_GUIDE.md](OPENROUTER_GUIDE.md)
- 🏗️ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

**Good luck! 🍀**

**Chúc mừng năm mới - Vạn sự như ý! 🐎🌸**
