# 🚀 Deploy AI Photobooth lên Render

Hướng dẫn deploy ứng dụng AI Photobooth lên Render.com (FREE tier available)

---

## 📋 Yêu cầu trước khi deploy

- [ ] Tài khoản GitHub
- [ ] Tài khoản Render (https://render.com)
- [ ] OpenRouter API Key
- [ ] Code đã push lên GitHub

---

## 🎯 Phương pháp Deploy

### Phương pháp 1: Blueprint (Khuyến nghị) ⭐

Sử dụng file `render.yaml` để deploy tự động cả Backend và Frontend.

### Phương pháp 2: Manual

Deploy từng service riêng lẻ.

---

## 📦 Phương pháp 1: Deploy với Blueprint

### Bước 1: Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init
git add .
git commit -m "Initial commit: AI Photobooth"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/your-username/ai-photobooth.git
git branch -M main
git push -u origin main
```

### Bước 2: Kết nối Render với GitHub

1. Đăng nhập vào https://render.com
2. Vào **Dashboard**
3. Click **New** → **Blueprint**
4. Chọn repository **ai-photobooth**
5. Render sẽ tự động phát hiện file `render.yaml`

### Bước 3: Cấu hình Environment Variables

Trong quá trình setup, Render sẽ yêu cầu:

**Backend Service:**
- `OPENROUTER_API_KEY`: Paste API key của bạn từ OpenRouter

**Frontend Service:**
- Render sẽ tự động set `VITE_API_URL` từ backend URL

### Bước 4: Deploy

1. Click **Apply**
2. Đợi Render build và deploy (5-10 phút)
3. Backend sẽ được deploy trước
4. Frontend sẽ build và deploy sau

### Bước 5: Cập nhật URLs

Sau khi deploy xong, bạn sẽ có:
- Backend URL: `https://ai-photobooth-backend.onrender.com`
- Frontend URL: `https://ai-photobooth-frontend.onrender.com`

**Cập nhật CORS trong backend:**

1. Vào Backend service → **Environment**
2. Thêm environment variable:
   ```
   FRONTEND_URL=https://ai-photobooth-frontend.onrender.com
   ```

---

## 🔧 Phương pháp 2: Deploy Manual

### A. Deploy Backend

#### Bước 1: Tạo Web Service

1. Đăng nhập Render → **New** → **Web Service**
2. Connect GitHub repository
3. Cấu hình:
   - **Name**: `ai-photobooth-backend`
   - **Region**: Singapore (gần VN nhất)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

#### Bước 2: Environment Variables

Thêm các biến sau:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx
AI_MODEL=anthropic/claude-3.5-sonnet
HOST=0.0.0.0
PORT=10000
FRONTEND_URL=https://ai-photobooth-frontend.onrender.com
```

#### Bước 3: Health Check

- **Health Check Path**: `/health`

#### Bước 4: Deploy

Click **Create Web Service** và đợi build.

---

### B. Deploy Frontend

#### Bước 1: Tạo Static Site

1. Render Dashboard → **New** → **Static Site**
2. Connect GitHub repository
3. Cấu hình:
   - **Name**: `ai-photobooth-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

#### Bước 2: Environment Variables

```
VITE_API_URL=https://ai-photobooth-backend.onrender.com
```

⚠️ **Quan trọng**: Thay `ai-photobooth-backend` bằng tên backend service của bạn.

#### Bước 3: Rewrite Rules

Thêm rewrite rule để handle React Router:

**Headers:**
```
/*
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

**Redirects:**
```
/*    /index.html    200
```

#### Bước 4: Deploy

Click **Create Static Site**.

---

## 🔄 Cập nhật Backend CORS

Sau khi có Frontend URL, cập nhật CORS trong backend:

**File: `backend/app/config.py`**

Render sẽ tự động lấy từ environment variable `FRONTEND_URL`.

**Redeploy backend** để áp dụng thay đổi.

---

## ✅ Kiểm tra Deploy

### Backend Health Check

```bash
curl https://ai-photobooth-backend.onrender.com/health
```

Kết quả mong đợi:
```json
{"status": "healthy"}
```

### Frontend

Mở browser: `https://ai-photobooth-frontend.onrender.com`

Kiểm tra:
- [ ] Trang load thành công
- [ ] Thấy giao diện với con ngựa
- [ ] Console không có lỗi CORS
- [ ] Upload ảnh hoạt động
- [ ] AI processing hoạt động
- [ ] QR code hiển thị

---

## 💰 Chi phí Render

### Free Tier
- ✅ 750 giờ/tháng cho web services
- ✅ Unlimited bandwidth cho static sites
- ✅ Auto sleep sau 15 phút không hoạt động
- ⚠️ Cold start: ~30s khi wake up

### Paid Tier ($7/month/service)
- ✅ No sleep
- ✅ Faster builds
- ✅ More resources
- ✅ Custom domains

**Khuyến nghị**: Bắt đầu với Free tier để test.

---

## 🔧 Troubleshooting

### Lỗi: "Build failed"

**Backend:**
```bash
# Kiểm tra requirements.txt có đúng format không
# Thử build local:
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
# Kiểm tra package.json
cd frontend
npm install
npm run build
```

### Lỗi: "CORS error"

1. Kiểm tra `FRONTEND_URL` trong backend environment variables
2. Đảm bảo frontend URL đúng (không có trailing slash)
3. Redeploy backend

### Lỗi: "API key invalid"

1. Vào Backend service → **Environment**
2. Kiểm tra `OPENROUTER_API_KEY`
3. Verify key còn credit
4. Redeploy

### Lỗi: "Service unavailable"

- Backend đang sleep (Free tier)
- Click vào URL để wake up
- Đợi ~30s
- Refresh page

### Frontend không connect Backend

1. Mở DevTools → Console
2. Xem error message
3. Kiểm tra `VITE_API_URL` trong frontend build logs
4. Rebuild frontend nếu cần

---

## 🚀 Custom Domain (Optional)

### Backend

1. Vào Backend service → **Settings**
2. Click **Add Custom Domain**
3. Thêm domain: `api.yourdomain.com`
4. Cập nhật DNS:
   ```
   CNAME api yourdomain.onrender.com
   ```

### Frontend

1. Vào Static Site → **Settings**
2. Click **Add Custom Domain**
3. Thêm domain: `photobooth.yourdomain.com`
4. Cập nhật DNS:
   ```
   CNAME photobooth yoursite.onrender.com
   ```

### Cập nhật Environment Variables

**Backend:**
```
FRONTEND_URL=https://photobooth.yourdomain.com
```

**Frontend:**
```
VITE_API_URL=https://api.yourdomain.com
```

Redeploy cả hai services.

---

## 📊 Monitoring

### Render Dashboard

- **Logs**: Xem real-time logs
- **Metrics**: CPU, Memory usage
- **Events**: Deploy history

### Backend Logs

```bash
# Xem logs trực tiếp trên Render dashboard
# Hoặc dùng Render CLI
render logs -s ai-photobooth-backend -f
```

---

## 🔄 Auto Deploy

Render tự động deploy khi:
- Push code lên GitHub branch `main`
- Có thể tắt auto-deploy trong Settings

### Manual Deploy

1. Vào Service → **Manual Deploy**
2. Click **Deploy latest commit**

---

## 📈 Performance Tips

### Backend

1. **Upgrade to paid tier** để tránh cold start
2. **Use Redis** cho caching (Render add-on)
3. **Optimize images** trước khi gửi AI

### Frontend

1. **Enable CDN** (tự động với Render)
2. **Optimize bundle size**:
   ```bash
   npm run build -- --analyze
   ```
3. **Lazy load components**

### Database (Future)

1. Thêm **PostgreSQL** add-on
2. Thêm **Redis** cho session storage
3. Migration sang **Object Storage** (S3/R2)

---

## 🔐 Security

### Environment Variables

- ✅ Không commit `.env` vào Git
- ✅ Dùng Render Environment Variables
- ✅ Enable "Sensitive" cho API keys

### HTTPS

- ✅ Render tự động provision SSL
- ✅ Redirect HTTP → HTTPS

### CORS

- ✅ Chỉ allow frontend domain
- ✅ Không dùng wildcard `*` trong production

---

## 📞 Support

### Render Documentation
- https://render.com/docs

### Render Community
- https://community.render.com/

### AI Photobooth Issues
- GitHub Issues (your repository)

---

## ✅ Deployment Checklist

Pre-deployment:
- [ ] Code đã push lên GitHub
- [ ] Có OpenRouter API key
- [ ] Đã test local

Render Setup:
- [ ] Tạo Render account
- [ ] Connect GitHub
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Set environment variables
- [ ] Verify CORS settings

Post-deployment:
- [ ] Test backend health check
- [ ] Test frontend loads
- [ ] Test upload image
- [ ] Test AI processing
- [ ] Test QR code
- [ ] Test download

---

## 🎉 Done!

Sau khi hoàn thành, bạn sẽ có:
- ✅ Backend API: `https://ai-photobooth-backend.onrender.com`
- ✅ Frontend: `https://ai-photobooth-frontend.onrender.com`
- ✅ Auto-deploy khi push code
- ✅ Free HTTPS/SSL
- ✅ Global CDN

**Chia sẻ link với bạn bè và tận hưởng AI Photobooth! 🐎🌸**

---

**Cập nhật**: Tháng 1/2026  
**Version**: 1.0.0
