# 🤝 Contributing to AI Photobooth

Cảm ơn bạn đã quan tâm đến việc đóng góp cho AI Photobooth! Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng.

## 📋 Mục Lục

- [Code of Conduct](#code-of-conduct)
- [Làm thế nào để đóng góp](#làm-thế-nào-để-đóng-góp)
- [Báo cáo lỗi](#báo-cáo-lỗi)
- [Đề xuất tính năng](#đề-xuất-tính-năng)
- [Pull Request](#pull-request)
- [Quy tắc code](#quy-tắc-code)
- [Development Setup](#development-setup)

---

## 📜 Code of Conduct

Dự án này tuân theo Code of Conduct. Khi tham gia, bạn được yêu cầu tôn trọng code này.

### Nguyên tắc:
- ✅ Tôn trọng mọi người
- ✅ Chấp nhận phê bình mang tính xây dựng
- ✅ Tập trung vào điều tốt nhất cho cộng đồng
- ❌ Không có ngôn ngữ hoặc hình ảnh không phù hợp
- ❌ Không có quấy rối hoặc tấn công cá nhân

---

## 🛠️ Làm thế nào để đóng góp

### 1. Fork Repository

Nhấn nút "Fork" ở góc trên bên phải của repository.

### 2. Clone Fork

```bash
git clone https://github.com/your-username/ai-photobooth.git
cd ai-photobooth
```

### 3. Tạo Branch mới

```bash
git checkout -b feature/your-feature-name
# hoặc
git checkout -b fix/your-bug-fix
```

**Branch naming convention:**
- `feature/` - Tính năng mới
- `fix/` - Sửa lỗi
- `docs/` - Cập nhật tài liệu
- `refactor/` - Tái cấu trúc code
- `test/` - Thêm/sửa tests
- `chore/` - Công việc bảo trì

### 4. Thực hiện thay đổi

Viết code của bạn theo [quy tắc code](#quy-tắc-code).

### 5. Commit

```bash
git add .
git commit -m "feat: add new feature X"
```

**Commit message convention:**
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật tài liệu
- `style:` - Thay đổi style (formatting, semicolons, etc)
- `refactor:` - Tái cấu trúc code
- `test:` - Thêm tests
- `chore:` - Cập nhật build, dependencies, etc

### 6. Push

```bash
git push origin feature/your-feature-name
```

### 7. Tạo Pull Request

Truy cập repository gốc và tạo Pull Request từ branch của bạn.

---

## 🐛 Báo cáo lỗi

### Trước khi báo cáo:
- ✅ Kiểm tra [Issues](link-to-issues) xem lỗi đã được báo cáo chưa
- ✅ Đảm bảo bạn đang dùng phiên bản mới nhất
- ✅ Kiểm tra [Troubleshooting](README.md#troubleshooting)

### Khi báo cáo:

**Template:**
```markdown
**Mô tả lỗi**
Mô tả rõ ràng và ngắn gọn về lỗi.

**Các bước tái hiện**
1. Vào '...'
2. Nhấn vào '...'
3. Scroll xuống '...'
4. Thấy lỗi

**Kết quả mong đợi**
Mô tả điều bạn mong đợi xảy ra.

**Screenshots**
Nếu có, thêm screenshots minh họa vấn đề.

**Môi trường:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Thông tin thêm**
Thêm bất kỳ thông tin nào khác về vấn đề.
```

---

## 💡 Đề xuất tính năng

### Template:

```markdown
**Tính năng đề xuất**
Mô tả rõ ràng về tính năng bạn muốn.

**Vấn đề nó giải quyết**
Tính năng này giải quyết vấn đề gì?

**Giải pháp đề xuất**
Mô tả cách bạn muốn nó hoạt động.

**Giải pháp thay thế**
Có giải pháp thay thế nào khác không?

**Ví dụ**
Ví dụ minh họa hoặc mockup nếu có.
```

---

## 🔀 Pull Request

### Checklist trước khi submit:

- [ ] Code tuân theo style guide
- [ ] Đã self-review code
- [ ] Đã comment code (nếu cần)
- [ ] Đã cập nhật documentation
- [ ] Không có breaking changes (hoặc đã document rõ)
- [ ] Đã test trên local
- [ ] Commit messages rõ ràng
- [ ] Branch up-to-date với main

### PR Template:

```markdown
## Mô tả
Mô tả ngắn gọn về thay đổi.

## Loại thay đổi
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented (if needed)
- [ ] Updated docs
- [ ] No breaking changes
- [ ] Tested locally

## Screenshots (nếu có)
Thêm screenshots nếu thay đổi UI.

## Related Issues
Closes #(issue number)
```

---

## 📏 Quy tắc code

### Python (Backend)

**Style Guide:** [PEP 8](https://peps.python.org/pep-0008/)

```python
# Good
def process_image(image_file: UploadFile) -> dict:
    """Process uploaded image with AI.
    
    Args:
        image_file: The uploaded image file
        
    Returns:
        dict: Processing result with image_id and URLs
    """
    pass

# Use type hints
# Use docstrings
# Use snake_case for functions/variables
# Use PascalCase for classes
```

**Linting:**
```bash
# Install
pip install pylint black

# Format
black backend/

# Lint
pylint backend/app
```

### JavaScript/React (Frontend)

**Style Guide:** [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

```javascript
// Good
const processImage = async (file) => {
  try {
    const result = await uploadImage(file);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Use const/let, not var
// Use arrow functions
// Use async/await
// Use meaningful names
// Use camelCase
```

**Linting:**
```bash
# Install
npm install --save-dev eslint prettier

# Format
npm run format

# Lint
npm run lint
```

### CSS/Tailwind

```jsx
// Good - Organized classes
<button className="
  py-4 px-6
  bg-amber-500 hover:bg-amber-400
  text-red-900 font-bold
  rounded-2xl shadow-lg
  transition-all active:scale-95
">
  Button
</button>

// Use utility-first approach
// Group related utilities
// Use semantic spacing
```

---

## 🚀 Development Setup

### Prerequisites
```bash
# Check versions
python --version  # >= 3.8
node --version    # >= 18
npm --version     # >= 9
```

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your API key
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Running Tests (Future)
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

---

## 📝 Documentation

### Khi thêm tính năng mới:

1. **Code comments** - Comment phức tạp logic
2. **Docstrings** - Document functions/classes
3. **README** - Cập nhật usage instructions
4. **FEATURES.md** - Thêm feature description
5. **CHANGELOG.md** - Ghi lại thay đổi

### Documentation Style:

```python
def function_name(param1: type, param2: type) -> return_type:
    """Short description.
    
    Longer description if needed. Explain what function does,
    when to use it, and any important notes.
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        Description of return value
        
    Raises:
        ExceptionType: When it happens
        
    Example:
        >>> result = function_name("test", 123)
        >>> print(result)
        Expected output
    """
    pass
```

---

## 🎯 Areas for Contribution

Chúng tôi đặc biệt hoan nghênh đóng góp cho:

### High Priority
- 🐛 Bug fixes
- 📱 Mobile optimization
- 🌐 Internationalization (i18n)
- 🧪 Unit tests
- 📊 Performance optimization

### Medium Priority
- 🎨 New AI filters/styles
- 🔄 Camera flip feature
- 💾 Database integration
- ☁️ Cloud storage
- 📈 Analytics

### Low Priority
- 🎭 Additional animations
- 🖼️ New templates
- 📱 PWA features
- 🎨 Theme customization

---

## ❓ Questions?

Nếu bạn có câu hỏi:

1. Check [README.md](README.md)
2. Check [FEATURES.md](FEATURES.md)
3. Search [Issues](link-to-issues)
4. Create new issue với tag `question`

---

## 🙏 Cảm ơn!

Cảm ơn bạn đã dành thời gian đọc và đóng góp cho AI Photobooth!

Mọi đóng góp, dù lớn hay nhỏ, đều được đánh giá cao. 💖

---

**Happy Coding! 🎉**
