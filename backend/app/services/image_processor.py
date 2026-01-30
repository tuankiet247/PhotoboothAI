from PIL import Image
import io
import base64
from pathlib import Path
from typing import Tuple

class ImageProcessor:
    @staticmethod
    def resize_image(image: Image.Image, max_size: int = 2048) -> Image.Image:
        """Resize image while maintaining aspect ratio"""
        width, height = image.size
        
        if width > max_size or height > max_size:
            if width > height:
                new_width = max_size
                new_height = int(height * (max_size / width))
            else:
                new_height = max_size
                new_width = int(width * (max_size / height))
            
            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        return image
    
    @staticmethod
    def compress_image(image: Image.Image, quality: int = 85) -> bytes:
        """Compress image to JPEG with specified quality"""
        output = io.BytesIO()
        
        # Convert RGBA to RGB if needed
        if image.mode == 'RGBA':
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[3])
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        image.save(output, format='JPEG', quality=quality, optimize=True)
        return output.getvalue()
    
    @staticmethod
    def image_to_base64(image: Image.Image) -> str:
        """Convert PIL Image to base64 string"""
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()
    
    @staticmethod
    def base64_to_image(base64_string: str) -> Image.Image:
        """Convert base64 string to PIL Image"""
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        return Image.open(io.BytesIO(image_data))
    
    @staticmethod
    async def process_uploaded_image(
        file_content: bytes,
        max_size: int = 2048,
        quality: int = 85
    ) -> Tuple[Image.Image, bytes]:
        """Process uploaded image: resize and compress"""
        # Open image
        image = Image.open(io.BytesIO(file_content))
        
        # Resize
        image = ImageProcessor.resize_image(image, max_size)
        
        # Compress
        compressed_data = ImageProcessor.compress_image(image, quality)
        
        return image, compressed_data
