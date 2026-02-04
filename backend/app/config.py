import os
from pathlib import Path

# Try to load .env via python-dotenv; if not available, fall back to a simple .env parser
try:
    from dotenv import load_dotenv
    # Load .env into environment (no-op if not present)
    load_dotenv()
except Exception:
    # Fallback: manually parse a .env file in the backend root (if present)
    env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        try:
            for line in env_path.read_text(encoding='utf-8').splitlines():
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' not in line:
                    continue
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                # Do not overwrite existing environment variables
                os.environ.setdefault(k, v)
        except Exception:
            pass
            
class Settings:
    # API Configuration
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "black-forest-labs/flux.2-pro")
    OPENROUTER_API_URL: str = "https://openrouter.ai/api/v1/chat/completions"

    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://tet-ai-photobooth.vercel.app/")
    
    # File paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    PROCESSED_DIR: Path = BASE_DIR / "processed"
    SYSTEM_PROMPT_PATH: Path = BASE_DIR.parent / "system_prompt.txt"
    
    # Image processing
    MAX_IMAGE_SIZE: int = 2048  # Max width/height in pixels
    COMPRESSION_QUALITY: int = 85
    OUTPUT_ASPECT_RATIO: tuple = (9, 16)  # Tỉ lệ output (width:height) - 9:16 cho portrait
    
    # QR Code - Bật mặc định khi deploy, set ENABLE_QR_CODE=false nếu muốn tắt
    ENABLE_QR_CODE: bool = os.getenv("ENABLE_QR_CODE", "true").lower() == "true"
    QR_CODE_SIZE: int = 300
    QR_CODE_BORDER: int = 2
    
    def __init__(self):
        # Ensure directories exist
        self.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
        self.PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

settings = Settings()
