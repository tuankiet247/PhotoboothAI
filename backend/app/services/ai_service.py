import httpx
import base64
from pathlib import Path
from typing import Optional
from PIL import Image
import io

from app.config import settings

class AIService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.AI_MODEL
        self.api_url = settings.OPENROUTER_API_URL
        self.system_prompt = self._load_system_prompt()
    
    def _load_system_prompt(self) -> str:
        """Load system prompt from file"""
        try:
            if settings.SYSTEM_PROMPT_PATH.exists():
                return settings.SYSTEM_PROMPT_PATH.read_text(encoding='utf-8')
            else:
                # Default prompt if file doesn't exist
                return """Bạn là một nghệ sĩ AI chuyên về tranh thủy mặc Việt Nam với phong cách Thiên Mã nghinh xuân.
                
Nhiệm vụ của bạn là:
1. Phân tích ảnh chụp người dùng
2. Tạo mô tả chi tiết về cách biến đổi ảnh sang phong cách tranh thủy mặc Thiên Mã Xuân 2026
3. Bao gồm các yếu tố: ngựa Thiên Mã, hoa đào, mây trời, màu sắc đỏ vàng kim, nét vẽ tinh tế
4. Giữ nguyên tư thế và đặc điểm khuôn mặt của người trong ảnh
5. Tạo không khí tết Việt Nam, mang lại may mắn và thịnh vượng

Hãy trả về mô tả chi tiết để chỉnh sửa ảnh theo phong cách này."""
        except Exception as e:
            print(f"Error loading system prompt: {e}")
            return "You are an AI artist specializing in Vietnamese traditional ink painting style."
    
    async def process_image_with_ai(
        self,
        image: Image.Image,
        user_prompt: Optional[str] = None
    ) -> str:
        """
        Process image with AI using OpenRouter API
        Returns: AI-generated description or instructions
        """
        try:
            # Convert image to base64
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            # Prepare prompt
            if user_prompt is None:
                user_prompt = "Hãy biến đổi ảnh này sang phong cách tranh thủy mặc Thiên Mã nghinh xuân với màu sắc đỏ vàng kim, hoa đào, và không khí tết Việt Nam. Giữ nguyên người trong ảnh nhưng thêm các yếu tố nghệ thuật truyền thống."
            
            # Call OpenRouter API
            async with httpx.AsyncClient(timeout=60.0) as client:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:8000",
                    "X-Title": "AI Photobooth Tet"
                }
                
                payload = {
                    "model": self.model,
                    "messages": [
                        {
                            "role": "system",
                            "content": self.system_prompt
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/png;base64,{img_base64}"
                                    }
                                },
                                {
                                    "type": "text",
                                    "text": user_prompt
                                }
                            ]
                        }
                    ]
                }
                
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                ai_response = result["choices"][0]["message"]["content"]
                
                return ai_response
                
        except Exception as e:
            print(f"Error processing image with AI: {e}")
            raise Exception(f"AI processing failed: {str(e)}")
    
    async def generate_artistic_image(
        self,
        original_image: Image.Image
    ) -> Image.Image:
        """
        Generate artistic version of the image
        In a real implementation, this would use image generation models
        For now, it applies filters as a placeholder
        """
        # TODO: Integrate with image generation model (e.g., Stable Diffusion via OpenRouter)
        # For now, apply artistic filter as placeholder
        
        from PIL import ImageFilter, ImageEnhance
        
        # Create a copy
        artistic = original_image.copy()
        
        # Apply artistic filters
        artistic = artistic.filter(ImageFilter.SMOOTH_MORE)
        
        # Adjust colors for Tet theme (warmer tones)
        enhancer = ImageEnhance.Color(artistic)
        artistic = enhancer.enhance(1.3)
        
        enhancer = ImageEnhance.Contrast(artistic)
        artistic = enhancer.enhance(1.2)
        
        # Add sepia-like effect
        width, height = artistic.size
        pixels = artistic.load()
        
        for i in range(width):
            for j in range(height):
                r, g, b = artistic.getpixel((i, j))[:3]
                
                # Sepia transformation with red-gold tint
                tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                tb = int(0.272 * r + 0.534 * g + 0.131 * b)
                
                # Add more red/gold for Tet theme
                tr = min(255, tr + 20)
                tg = min(255, tg + 10)
                
                if artistic.mode == 'RGBA':
                    pixels[i, j] = (tr, tg, tb, artistic.getpixel((i, j))[3])
                else:
                    pixels[i, j] = (tr, tg, tb)
        
        return artistic

ai_service = AIService()
