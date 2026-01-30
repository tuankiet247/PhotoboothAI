# 🎨 TÍNH NĂNG CHI TIẾT - AI PHOTOBOOTH

## 📸 1. Chụp Ảnh Từ Webcam

### Tính năng:
- Truy cập camera trực tiếp từ trình duyệt
- Preview real-time với mirror effect
- Frame overlay đẹp mắt theo theme Tết
- Chụp và xử lý ngay lập tức

### Cách sử dụng:
1. Nhấn "CHỤP BẰNG CAMERA"
2. Cho phép truy cập camera
3. Điều chỉnh tư thế, ánh sáng
4. Nhấn nút camera lớn ở giữa
5. Đợi AI xử lý

### Lưu ý:
- Cần HTTPS hoặc localhost
- Sử dụng ánh sáng tốt
- Đảm bảo khuôn mặt rõ nét

---

## 📤 2. Tải Ảnh Lên

### Tính năng:
- Upload ảnh từ thiết bị
- Hỗ trợ các format: JPG, PNG, WebP
- Tự động resize và nén ảnh
- Preview trước khi xử lý

### Cách sử dụng:
1. Nhấn "TẢI ẢNH LÊN"
2. Chọn file từ máy tính/điện thoại
3. Đợi upload và xử lý

### Khuyến nghị:
- Ảnh chân dung, khuôn mặt rõ
- Kích thước tối thiểu: 500x500px
- Độ phân giải tốt cho kết quả đẹp

---

## 🤖 3. AI Xử Lý Ảnh

### Công nghệ:
- **OpenRouter API** - Truy cập nhiều AI models
- **Claude 3.5 Sonnet** (mặc định) - Hiểu context tốt
- **Custom System Prompt** - Định hướng style Tết Việt

### Quy trình xử lý:
1. **Upload**: Ảnh được gửi lên backend
2. **Resize**: Tối ưu kích thước (max 2048px)
3. **AI Analysis**: Phân tích và mô tả biến đổi
4. **Style Transfer**: Áp dụng filter tranh thủy mặc
5. **Enhancement**: Cải thiện màu sắc, độ tương phản
6. **Save**: Lưu ảnh đã xử lý

### Phong cách:
- **Tranh thủy mặc** (Ink wash painting)
- **Màu sắc**: Đỏ vàng kim (Red, Gold)
- **Chủ đề**: Thiên Mã, hoa đào, Tết Việt Nam
- **Hiệu ứng**: Sepia tone, warm colors, high contrast

### Thời gian xử lý:
- **Nhanh**: 15-20 giây (Claude 3.5 Sonnet)
- **Trung bình**: 20-30 giây
- **Phụ thuộc**: API response time, ảnh size

---

## 📱 4. Mã QR Code

### Tính năng:
- Tự động tạo QR code cho mỗi ảnh
- Quét để tải ảnh trực tiếp về điện thoại
- Không cần đăng nhập hay app bổ sung

### Cách sử dụng:
1. Sau khi AI xử lý xong
2. Mã QR xuất hiện dưới ảnh kết quả
3. Mở camera điện thoại
4. Quét mã QR
5. Tải ảnh về máy

### Công nghệ:
- **QR Code Library**: python-qrcode
- **Size**: 300x300px
- **Error Correction**: Level L
- **Format**: PNG

### URL Structure:
```
http://localhost:8000/api/download/{image_id}
```

---

## 🖼️ 5. Bộ Sưu Tập

### Tính năng:
- Lưu trữ tất cả ảnh đã xử lý
- Xem lại bất cứ lúc nào
- Grid layout 2 cột responsive
- Hover để xem actions

### Cách sử dụng:
1. Nhấn "BỘ SƯU TẬP" từ trang chủ
2. Xem tất cả ảnh đã chụp
3. Hover lên ảnh để:
   - Tải về
   - (Future: Xóa, Chia sẻ)

### Lưu trữ:
- **Backend**: File system (uploads/, processed/)
- **Metadata**: In-memory (production nên dùng database)
- **Format**: JPEG (compressed)
- **Quality**: 85%

---

## 🌸 6. Hiệu Ứng Động

### Hoa Đào Rơi:
```javascript
// 15 bông hoa rơi ngẫu nhiên
- Position: Random left 0-100%
- Animation: bounce
- Duration: 2-5s random
- Delay: 0-5s random
```

### Thiên Mã Animation:
```css
@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-20px) }
}
```
- **Effect**: Nhún nhảy nhẹ nhàng
- **Duration**: 3s
- **Timing**: ease-in-out infinite

### Loading Spinner:
- **Border rotation**: 3s spin
- **Sparkles**: bounce animation
- **Dots**: Sequential bounce delays

### Transitions:
- **Fade in**: 0.5s
- **Slide in from bottom**: 0.5s
- **Zoom in**: 0.5s
- **Image hover scale**: 1.1x (0.3s)

---

## 🎨 7. Giao Diện (UI/UX)

### Design System:

**Colors:**
```css
Background: #7f1d1d (red-900)
Primary: #f59e0b (amber-500)
Secondary: #fef3c7 (amber-50)
Accent: #fbbf24 (amber-400)
Text: #fffbeb (amber-50)
```

**Typography:**
- Font: System Serif (font-serif)
- Headers: 2xl-4xl, bold, tracking-wide
- Body: sm-base, normal
- Emphasis: Uppercase, letter-spacing

**Components:**
- **Buttons**: Rounded (rounded-2xl), shadow
- **Cards**: Rounded (rounded-3xl), border
- **Images**: Aspect-square, object-cover
- **Icons**: Lucide React (20-40px)

**Layout:**
- **Max width**: 448px (max-w-md)
- **Padding**: 24px (p-6)
- **Gap**: 16-32px (gap-4 to gap-8)
- **Grid**: 2 columns on gallery

**Responsive:**
- Mobile-first design
- Portrait orientation optimized
- Touch-friendly buttons (min 44px)

---

## 🔧 8. Backend API

### Endpoints:

#### POST /api/upload
Upload và xử lý ảnh
```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@photo.jpg"
```

**Response:**
```json
{
  "success": true,
  "image_id": "uuid",
  "ai_description": "...",
  "processed_image_url": "/api/image/{id}/processed",
  "qr_code_url": "/api/image/{id}/qr",
  "download_url": "/api/download/{id}"
}
```

#### GET /api/image/{id}/processed
Lấy ảnh đã xử lý

#### GET /api/image/{id}/qr
Lấy mã QR

#### GET /api/download/{id}
Download ảnh (force download)

#### GET /api/gallery
Lấy danh sách tất cả ảnh

### Services:

**ImageProcessor:**
- resize_image()
- compress_image()
- image_to_base64()
- base64_to_image()

**QRCodeGenerator:**
- generate_qr_code()
- generate_download_url_qr()

**AIService:**
- process_image_with_ai()
- generate_artistic_image()

---

## 📊 9. Hiệu Năng

### Tối ưu hóa:

**Frontend:**
- Lazy loading images
- Debounce camera access
- Memoize components (nếu cần)
- Code splitting với Vite

**Backend:**
- Async/await everywhere
- Streaming uploads
- Image compression (85%)
- Max size limit (2048px)

**Network:**
- Proxy qua Vite dev server
- CORS properly configured
- Gzip compression
- CDN for production (future)

### Metrics (ước tính):

- **Initial load**: < 2s
- **Upload**: 1-3s
- **AI processing**: 15-30s
- **QR generation**: < 1s
- **Download**: 1-2s

---

## 🔐 10. Bảo Mật & Privacy

### Data Flow:
```
User → Frontend → Backend → OpenRouter → Backend → User
```

### Lưu trữ:
- **Temporary**: uploads/, processed/ folders
- **No cloud**: Chỉ local filesystem
- **No database**: In-memory storage (session-based)
- **Auto cleanup**: Có thể thêm cron job xóa file cũ

### Privacy:
- Không lưu thông tin cá nhân
- API key ẩn trong .env
- CORS restricted
- HTTPS recommended (production)

### API Key:
```bash
# KHÔNG commit .env vào git
# Sử dụng .env.example cho template
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

---

## 🚀 11. Deployment (Future)

### Backend:
- **Platform**: Railway, Heroku, DigitalOcean
- **Container**: Docker
- **Database**: PostgreSQL cho metadata
- **Storage**: S3, CloudFlare R2 cho ảnh

### Frontend:
- **Platform**: Vercel, Netlify, CloudFlare Pages
- **Build**: `npm run build`
- **Output**: Static files (dist/)
- **CDN**: Automatic

### Environment:
```bash
# Production
OPENROUTER_API_KEY=sk-or-v1-prod-xxx
HOST=0.0.0.0
PORT=8000
FRONTEND_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
S3_BUCKET=photobooth-images
```

---

## 📈 12. Roadmap

### v1.0 (Current)
- ✅ Camera capture
- ✅ File upload
- ✅ AI processing
- ✅ QR code generation
- ✅ Gallery
- ✅ Animations

### v1.1 (Near Future)
- ⬜ Flip camera (front/back)
- ⬜ Multiple AI models selection
- ⬜ Custom filters/effects
- ⬜ Share to social media
- ⬜ Delete from gallery
- ⬜ Download multiple images

### v2.0 (Long Term)
- ⬜ User authentication
- ⬜ Cloud storage
- ⬜ Database integration
- ⬜ Admin dashboard
- ⬜ Analytics
- ⬜ Multi-language support
- ⬜ PWA (Progressive Web App)
- ⬜ Print integration

---

**Cập nhật**: Tháng 1/2026
**Version**: 1.0.0
