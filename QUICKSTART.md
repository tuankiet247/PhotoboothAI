# 🚀 HƯỚNG DẪN NHANH - AI PHOTOBOOTH

## Bước 1: Cài đặt Backend

```bash
# Chạy file setup
setup_backend.bat

# Hoặc thủ công:
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Cấu hình API Key:**
1. Copy file `.env.example` thành `.env`:
   ```
   copy backend\.env.example backend\.env
   ```

2. Mở file `backend\.env` và thêm API key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
   ```

**Lấy API Key:**
- Truy cập: https://openrouter.ai/
- Đăng ký/Đăng nhập
- Vào Settings > API Keys
- Tạo key mới

## Bước 2: Cài đặt Frontend

```bash
# Chạy file setup
setup_frontend.bat

# Hoặc thủ công:
cd frontend
npm install
```

## Bước 3: Chạy Ứng Dụng

### Cách 1: Tự động (Khuyến nghị)
```bash
start_all.bat
```

### Cách 2: Thủ công
**Terminal 1 - Backend:**
```bash
start_backend.bat
# Hoặc: cd backend && python main.py
```

**Terminal 2 - Frontend:**
```bash
start_frontend.bat
# Hoặc: cd frontend && npm run dev
```

## Bước 4: Sử dụng

1. Mở trình duyệt: **http://localhost:3000**
2. Cho phép truy cập camera (nếu dùng tính năng chụp)
3. Chọn "CHỤP BẰNG CAMERA" hoặc "TẢI ẢNH LÊN"
4. Đợi AI xử lý (15-30 giây)
5. Quét mã QR hoặc tải ảnh về máy

## ✅ Kiểm tra

- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

## 🐛 Xử lý lỗi

### Backend không chạy
```bash
# Kiểm tra Python
python --version

# Kiểm tra .env
type backend\.env

# Xem logs
cd backend
python main.py
```

### Frontend không chạy
```bash
# Kiểm tra Node.js
node --version

# Xóa và cài lại
cd frontend
rmdir /s /q node_modules
npm install
```

### Lỗi kết nối API
- Đảm bảo backend đang chạy
- Kiểm tra port 8000 không bị chiếm
- Xóa cache trình duyệt (Ctrl + Shift + Del)

### Lỗi OpenRouter API
- Kiểm tra API key trong backend/.env
- Kiểm tra credit trên OpenRouter.ai
- Xem response trong terminal backend

## 📝 Cấu trúc File

```
AI Photobooth/
├── setup_backend.bat      ← Cài đặt backend
├── setup_frontend.bat     ← Cài đặt frontend
├── start_backend.bat      ← Chạy backend
├── start_frontend.bat     ← Chạy frontend
├── start_all.bat          ← Chạy cả hai
├── README.md              ← Tài liệu đầy đủ
├── QUICKSTART.md          ← File này
├── system_prompt.txt      ← Prompt cho AI
├── backend/
│   ├── main.py           ← Entry point
│   ├── requirements.txt  ← Dependencies
│   ├── .env              ← Cấu hình (tự tạo)
│   └── app/
└── frontend/
    ├── package.json
    └── src/
```

## 🎯 Tính năng chính

✅ Chụp ảnh từ webcam
✅ Tải ảnh từ máy tính
✅ AI xử lý theo phong cách tranh thủy mặc
✅ Tạo QR code để tải ảnh
✅ Bộ sưu tập ảnh
✅ Hiệu ứng Tết (hoa đào rơi, Thiên Mã)
✅ Giao diện responsive

## 💡 Tips

- Dùng ảnh chân dung, khuôn mặt rõ nét
- Ánh sáng tốt cho kết quả đẹp hơn
- Đợi AI xử lý xong (15-30s)
- Quét QR bằng điện thoại để tải ảnh nhanh

## 🆘 Cần hỗ trợ?

1. Đọc README.md đầy đủ
2. Kiểm tra logs trong terminal
3. Xem API docs: http://localhost:8000/docs

---

**Chúc bạn có trải nghiệm tuyệt vời với AI Photobooth! 🐎🌸**
