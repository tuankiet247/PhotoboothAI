import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # API Configuration
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "anthropic/claude-3.5-sonnet")
    OPENROUTER_API_URL: str = "https://openrouter.ai/api/v1/chat/completions"
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # File paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    PROCESSED_DIR: Path = BASE_DIR / "processed"
    SYSTEM_PROMPT_PATH: Path = BASE_DIR.parent / "system_prompt.txt"
    
    # Image processing
    MAX_IMAGE_SIZE: int = 2048  # Max width/height in pixels
    COMPRESSION_QUALITY: int = 85
    
    # QR Code
    QR_CODE_SIZE: int = 300
    QR_CODE_BORDER: int = 2
    
    def __init__(self):
        # Ensure directories exist
        self.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
        self.PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

settings = Settings()
