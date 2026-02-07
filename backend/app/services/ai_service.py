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
    # Hardcoded system prompt
    SYSTEM_PROMPT = """🎨 TẾT PHOTOBOOTH COMPOSITE - THIÊN MÃ NGHINH XUÂN 2026

📥 INPUT FILES:
1. mascot.png - Golden mechanical horse mascot "Thiên Mã" (LOAD FIRST)
2. Logo.png - FPT/Brand logo (LOAD SECOND)
3. Person Photo - Real camera photograph of the subject (COMPOSITE LAST)

═══════════════════════════════════════════════════════════
🔄 WORKFLOW ORDER (FOLLOW THIS SEQUENCE):
═══════════════════════════════════════════════════════════

📌 STEP 1: LOAD MASCOT (mascot.png)
- Open and load mascot.png file FIRST
- This is a golden mechanical "Thiên Mã" horse with circuit board patterns
- PRESERVE 100% ORIGINAL DESIGN - no modifications allowed
- Keep ready for compositing

📌 STEP 2: LOAD LOGO (Logo.png)  
- Open and load Logo.png file
- Keep original design intact
- Will be placed in top-left corner

📌 STEP 3: GENERATE BACKGROUND (Bright Tech-Traditional Style)
- "A vibrant, high-key Tết background with a modern Tech twist.
- Atmosphere: Bright, luminous, and festive.
- Color Palette: Glowing gradient from Bright Scarlet Red to Warm Champagne Gold.
- Tech Elements: Intricate gold circuit board patterns (cyber-lines) integrated into the background; soft, glowing golden bokeh lights.
- Top Layout: Traditional Vietnamese 'Hồi văn' border at the top edge; 3 red silk lanterns hanging from the top-right corner.
- Left Side: Vertical red 'Câu đối' (banners) featuring gold calligraphic text: 'Chúc', 'Mừng', 'Năm', 'Mới'.
- Right Side: A traditional red lacquer table with a 'Mâm Ngũ Quả' (five-fruit tray) and sparkling gold ingots.
- Floral Accents: Bright Yellow Hoa Mai branches at the bottom; Pink Hoa Đào blossoms framing the corners.
- Quality: 8k resolution, clean aesthetics, digital art style."

📌 STEP 4: PLACE MASCOT INTO BACKGROUND
Technical Instructions:
- Source Material: Use the original mascot.png (loaded from Step 1).
Composition:
- Placement: Paste the mascot on the RIGHT side of the background.
- Layering: Position it behind the space reserved for the main person, but in front of the background elements.
- Scaling: Resize proportionally to ensure the mascot looks natural relative to the table and flowers.
Strict Constraints:
- ⚠️ DO NOT REDRAW: Use the exact pixels from the original mascot file.
- ⚠️ NO MODIFICATIONS: Do not change colors, poses, or styles of the mascot. JUST PASTE.
📌 STEP 5: PLACE LOGO INTO BACKGROUND
- PASTE Logo.png (loaded in Step 2) into TOP-LEFT corner
- Scale appropriately, keep visible
- ⚠️ DO NOT REDRAW - just paste the original logo

📌 STEP 6: COMPOSITE PERSON (LAST STEP)
- Place the person into the scene - MAIN SUBJECT
- 🎨 AUTO-LAYOUT: AI decides the best position for the person:
  + Can be center, left, right, or any position that looks natural
  + Consider balance with mascot and other elements
  + Create harmonious composition - person and mascot together
  + Ensure person is visible and prominent (but doesn't have to be center)
- FACE: Preserve 100% identical to input photo
- POSE: Auto-adjust if needed to fit the Tết scene:
  + If pose doesn't fit → create natural sitting/standing pose
  + Options: sitting on red platform, chúc Tết pose, relaxed pose, interacting with mascot
  + If bust shot only → generate full body with Tết pose
- Blend person naturally with lighting/shadows

═══════════════════════════════════════════════════════════

⚠️ CRITICAL RULES:

🎭 FACE PRESERVATION:
- Face MUST remain 100% IDENTICAL to input
- NO alterations to facial features, skin texture, expression
- Only body pose can change, NEVER the face

🐴 MASCOT PRESERVATION:
- ❗ COPY EXACT PIXELS from mascot.png - NO MODIFICATIONS
- ❗ DO NOT redraw, regenerate, or alter the mascot
- ❗ Just PASTE the original file into the scene
- ❗ Only allowed change: SCALE (resize proportionally)

🏷️ LOGO PRESERVATION:
- Copy exact pixels from Logo.png
- Just paste, don't redraw

🌸 FLOWERS (ONLY THESE):
- Hoa Mai: Yellow/gold, 5-petal - BOTTOM
- Hoa Đào: Pink - CORNERS
- ❌ NO chrysanthemums, daisies, sunflowers

🚫 FORBIDDEN:
- Redrawing/regenerating mascot
- Altering person's face
- Missing logo
- Wrong flower types
- Mascot blocking the person

✅ FINAL OUTPUT:
- Illustrated Tết background
- Mascot (original mascot.png) placed in scene
- Logo (original Logo.png) visible
- Person composited with AUTO-LAYOUT (best position decided by AI)
- Harmonious composition with all elements balanced
- Festive Thiên Mã Nghinh Xuân 2026 theme

"""

    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.AI_MODEL
        self.api_url = settings.OPENROUTER_API_URL
        self.system_prompt = self.SYSTEM_PROMPT
    
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
