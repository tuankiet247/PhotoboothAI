# AI Photobooth Backend

Backend server cho ứng dụng AI Photobooth với theme Tết.

## Cài đặt

```bash
cd backend
pip install -r requirements.txt
```

## Cấu hình

1. Copy file `.env.example` thành `.env`:
```bash
copy .env.example .env
```

2. Cập nhật API key trong file `.env`:
```
OPENROUTER_API_KEY=your_api_key_here
```

## Chạy server

```bash
python main.py
```

Hoặc với uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại: http://localhost:8000

API documentation: http://localhost:8000/docs
