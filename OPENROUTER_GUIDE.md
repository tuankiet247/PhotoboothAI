# 🔑 HƯỚNG DẪN LẤY OPENROUTER API KEY

## OpenRouter là gì?

OpenRouter là một nền tảng API gateway cho phép truy cập nhiều AI models (Claude, GPT-4, Llama, v.v.) thông qua một API duy nhất. Thay vì phải đăng ký và quản lý nhiều API keys từ nhiều providers khác nhau, bạn chỉ cần một key từ OpenRouter.

### Ưu điểm:
- ✅ Một API cho nhiều models
- ✅ Pay-as-you-go pricing
- ✅ No subscription required
- ✅ Transparent pricing
- ✅ Easy switching between models

---

## Các Bước Lấy API Key

### Bước 1: Truy cập OpenRouter

🌐 **URL**: https://openrouter.ai/

### Bước 2: Đăng Ký Tài Khoản

1. Nhấn **"Sign Up"** hoặc **"Get Started"**
2. Đăng ký bằng:
   - Email
   - Google Account
   - GitHub Account (khuyến nghị cho developers)

### Bước 3: Xác Thực Email

1. Check email inbox
2. Nhấn vào link xác thực
3. Hoàn tất đăng ký

### Bước 4: Nạp Credit (Tùy Chọn)

OpenRouter cho phép bạn test với $0 credit, nhưng để sử dụng production:

1. Vào **"Settings"** → **"Credits"**
2. Nhấn **"Add Credits"**
3. Chọn số tiền ($5, $10, $20, $50, v.v.)
4. Thanh toán qua Credit Card

**Giá tham khảo:**
- Claude 3.5 Sonnet: ~$3 per 1M input tokens
- GPT-4: ~$10 per 1M input tokens
- Llama 3: ~$0.2 per 1M input tokens

**Ước tính chi phí cho app:**
- 1 ảnh xử lý: ~$0.01 - $0.05
- 100 ảnh: ~$1 - $5
- 1000 ảnh: ~$10 - $50

### Bước 5: Tạo API Key

1. Vào **"Settings"** → **"API Keys"**
2. Nhấn **"Create New Key"**
3. Đặt tên cho key (VD: "AI Photobooth Tet")
4. (Optional) Set limit cho key:
   - Daily limit
   - Monthly limit
   - Per-request limit
5. Nhấn **"Create"**
6. **QUAN TRỌNG**: Copy key ngay lập tức!
   - Format: `sk-or-v1-xxxxxxxxxxxxxxxxxx`
   - Key chỉ hiển thị một lần
   - Nếu mất, phải tạo key mới

### Bước 6: Lưu API Key Vào Project

1. Mở thư mục project
2. Copy file `.env.example` thành `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```

3. Mở file `backend/.env` bằng text editor
4. Paste API key vào:
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxx
   ```

5. Lưu file và đóng

### Bước 7: Test API Key

Chạy backend và kiểm tra:

```bash
cd backend
python main.py
```

Nếu thấy:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

→ API key đã được load thành công!

Test upload một ảnh để kiểm tra API hoạt động.

---

## 📊 Quản Lý API Usage

### Xem Usage:
1. Vào **"Dashboard"** → **"Usage"**
2. Xem:
   - Requests count
   - Tokens used
   - Cost per model
   - Daily/Monthly breakdown

### Set Alerts:
1. Vào **"Settings"** → **"Alerts"**
2. Cấu hình:
   - Email khi credit < $X
   - Email khi usage > X requests/day

### Rate Limits:
1. Vào **"Settings"** → **"Rate Limits"**
2. Set limits để tránh overspending:
   - Max requests per minute
   - Max tokens per request
   - Max cost per day

---

## 🔒 Bảo Mật API Key

### ❌ KHÔNG BAO GIỜ:
- Commit `.env` vào Git
- Share key publicly
- Hard-code key trong source code
- Upload key lên GitHub, GitLab, etc.

### ✅ NÊN:
- Lưu trong `.env` file
- Add `.env` vào `.gitignore`
- Use environment variables
- Rotate keys định kỳ
- Use different keys for dev/prod

### File `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production

# Secrets
*.key
*.secret
```

---

## 🆘 Xử Lý Sự Cố

### Lỗi: "Invalid API Key"
**Nguyên nhân:**
- Key sai format
- Key đã bị revoke
- Key chưa được kích hoạt

**Giải pháp:**
1. Kiểm tra lại key trong `.env`
2. Tạo key mới trên OpenRouter
3. Restart backend server

### Lỗi: "Insufficient credits"
**Nguyên nhân:**
- Hết tiền trong tài khoản

**Giải pháp:**
1. Vào OpenRouter dashboard
2. Add credits
3. Retry request

### Lỗi: "Rate limit exceeded"
**Nguyên nhân:**
- Quá nhiều requests trong thời gian ngắn

**Giải pháp:**
1. Đợi vài phút
2. Implement rate limiting trong app
3. Upgrade plan (nếu có)

### Lỗi: "Model not available"
**Nguyên nhân:**
- Model đang down
- Model không support trên plan của bạn

**Giải pháp:**
1. Đổi model khác trong `.env`:
   ```
   AI_MODEL=anthropic/claude-3-haiku  # Cheaper
   AI_MODEL=openai/gpt-3.5-turbo      # Alternative
   ```
2. Check OpenRouter status page

---

## 💡 Tips & Tricks

### Tiết kiệm chi phí:
1. **Dùng model rẻ hơn cho testing:**
   ```
   AI_MODEL=anthropic/claude-3-haiku
   ```

2. **Compress images trước khi gửi:**
   - Đã implement trong code (MAX_IMAGE_SIZE=2048)

3. **Cache responses:**
   - Lưu kết quả AI để tránh re-process

4. **Batch processing:**
   - Xử lý nhiều ảnh cùng lúc (advanced)

### Chọn model phù hợp:

**For Quality (Expensive):**
- `anthropic/claude-3.5-sonnet` ← Default
- `openai/gpt-4-vision-preview`
- `anthropic/claude-3-opus`

**For Speed (Cheap):**
- `anthropic/claude-3-haiku`
- `openai/gpt-3.5-turbo-vision`
- `meta-llama/llama-3-8b-instruct`

**For Balance:**
- `anthropic/claude-3-sonnet`
- `openai/gpt-4o-mini`

---

## 📞 Support

### OpenRouter Support:
- **Email**: support@openrouter.ai
- **Discord**: https://discord.gg/openrouter
- **Docs**: https://openrouter.ai/docs

### AI Photobooth Support:
- **GitHub Issues**: (Your repo URL)
- **Email**: (Your email)

---

## 📚 Tài Liệu Thêm

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [API Reference](https://openrouter.ai/docs/api-reference)
- [Models Comparison](https://openrouter.ai/docs/models)
- [Pricing Calculator](https://openrouter.ai/docs/pricing)

---

**Cập nhật**: Tháng 1/2026
