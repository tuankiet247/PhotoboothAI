import httpx
import base64
import asyncio
import io
import re
from PIL import Image
from typing import Optional
from app.config import settings
import traceback

class AIService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.AI_MODEL
        self.api_url = settings.OPENROUTER_API_URL
        self.system_prompt = self._load_system_prompt()
    
    def _load_system_prompt(self) -> str:
        """Load system prompt from file"""
        try:
            with open(settings.SYSTEM_PROMPT_PATH, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except Exception as e:
            print(f"⚠️ Warning: Could not load system prompt: {e}")
            return "Transform this photo to Vietnamese Tet theme with Ao Dai and festive background."
    
    async def process_image_with_ai(
        self,
        image: Image.Image,
        user_prompt: Optional[str] = None
    ) -> str:
        """Process image with AI (Text response only)"""
        # (This method seems unused for image generation but kept for compatibility)
        pass 
        return "Deprecation Warning: Use generate_artistic_image instead"

    async def generate_artistic_image(
        self,
        original_image: Image.Image
    ) -> Image.Image:
        """
        Generate artistic image using AI
        Returns: AI-generated Image from OpenRouter API
        """
        try:
            # 1. Convert image to base64
            buffered = io.BytesIO()
            original_image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            # 2. Ensure API key
            if not self.api_key:
                raise Exception("❌ OPENROUTER_API_KEY not configured in .env")
            
            print(f"🤖 Calling AI image generation...")
            print(f"   Model: {self.model}")
            
            # 3. Call OpenRouter API
            async with httpx.AsyncClient(timeout=120.0) as client:
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                }
                
                payload = {
                    "model": self.model,
                    "max_tokens": 2000,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": self.system_prompt
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/png;base64,{img_base64}"
                                    }
                                }
                            ]
                        }
                    ]
                }
                
                print(f"📤 Sending request to OpenRouter...")
                response = await client.post(self.api_url, headers=headers, json=payload)
                
                if response.status_code != 200:
                    raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
                
                result = response.json()
                
                if "choices" not in result:
                    raise Exception(f"Invalid API response: {result}")
                
                message = result["choices"][0]["message"]
                
                # --- NEW ROBUST IMAGE HANDLING LOGIC ---
                if message.get("images"):
                    print(f"✅ AI returned {len(message['images'])} image(s)")
                    
                    # Take the LAST image (usually the transformed one)
                    img_data = message["images"][-1]
                    
                    with open("error.log", "a", encoding="utf-8") as f:
                         f.write(f"\n--- NEW RESPONSE ---\n")
                         f.write(f"Raw img_data type: {type(img_data)}\n")
                         f.write(f"Raw img_data: {str(img_data)[:500]}\n")

                    print(f"📦 Processing image at index -1 (Type: {type(img_data)})")
                    
                    image_url_or_data = ""
                    
                    # Extract URL based on structure
                    if isinstance(img_data, dict):
                        if "image_url" in img_data and isinstance(img_data["image_url"], dict):
                            image_url_or_data = img_data["image_url"].get("url", "")
                        elif "url" in img_data:
                            image_url_or_data = img_data["url"]
                        else:
                            # Fallback: maybe it's a direct url key? or try stringifying
                            image_url_or_data = str(img_data)
                    elif isinstance(img_data, str):
                        image_url_or_data = img_data
                    else:
                        image_url_or_data = str(img_data)
                        
                    # Force string
                    image_url_or_data = str(image_url_or_data)
                    
                    with open("error.log", "a", encoding="utf-8") as f:
                        f.write(f"Parsed image URL prefix: {image_url_or_data[:30]}\n")
                    
                    try:
                        final_img = None
                        
                        if image_url_or_data.startswith("data:image"):
                            with open("error.log", "a", encoding="utf-8") as f: f.write("Step: Decoding base64...\n")
                            base64_str = image_url_or_data.split(",")[1]
                            img_bytes = base64.b64decode(base64_str)
                            final_img = Image.open(io.BytesIO(img_bytes))
                            with open("error.log", "a", encoding="utf-8") as f: f.write(f"Step: Decoded image size: {final_img.size}\n")
                            
                        elif image_url_or_data.startswith("http"):
                            with open("error.log", "a", encoding="utf-8") as f: f.write("Step: Downloading HTTP...\n")
                            img_response = await client.get(image_url_or_data)
                            img_response.raise_for_status()
                            final_img = Image.open(io.BytesIO(img_response.content))
                            with open("error.log", "a", encoding="utf-8") as f: f.write(f"Step: Downloaded image size: {final_img.size}\n")
                        
                        else:
                            raise Exception(f"Unknown image format: {image_url_or_data[:50]}...")
                            
                        # Force load image data
                        final_img.load()
                        with open("error.log", "a", encoding="utf-8") as f: f.write("Step: Image loaded fully. Returning.\n")
                        return final_img

                    except Exception as inner_e:
                        with open("error.log", "a", encoding="utf-8") as f: 
                            f.write(f"❌ INNER ERROR: {inner_e}\n")
                            f.write(traceback.format_exc())
                        raise inner_e



                
                # Fallback checking content for markdown
                content = message.get("content", "")
                if "data:image" in content:
                    match = re.search(r'data:image/[^;]+;base64,([A-Za-z0-9+/=]+)', content)
                    if match:
                        return Image.open(io.BytesIO(base64.b64decode(match.group(1))))
                
                print("⚠️ No image found, using fallback filters")
                return await self._apply_fallback_filters(original_image)
                
        except Exception as e:
            with open("error.log", "a", encoding="utf-8") as f:
                f.write(f"\n{'='*20} ERROR {type(e).__name__} {'='*20}\n")
                f.write(f"Error: {e}\n")
                f.write(traceback.format_exc())
                try:
                    # Log local variables if possible, or at least the raw message if available
                    pass
                except:
                    pass
            
            traceback.print_exc()
            print(f"❌ Error in AI image generation: {e}")
            raise e


    
    async def _apply_fallback_filters(self, img: Image.Image) -> Image.Image:
        """Apply basic PIL filters as fallback"""
        def _filter_sync(image):
            from PIL import ImageFilter, ImageEnhance
            print("🎨 Applying fallback PIL filters...")
            artistic = image.copy()
            artistic = artistic.filter(ImageFilter.SMOOTH_MORE)
            enhancer = ImageEnhance.Color(artistic)
            artistic = enhancer.enhance(1.3)
            return artistic
        
        return await asyncio.to_thread(_filter_sync, img)

# Global instance
ai_service = AIService()