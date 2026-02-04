import qrcode
from PIL import Image
import io
from pathlib import Path
from typing import Union

class QRCodeGenerator:
    @staticmethod
    def generate_qr_code(
        data: str,
        size: int = 300,
        border: int = 2
    ) -> Image.Image:
        """Generate QR code from data string"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=border,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        # Create QR code image
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Resize to desired size
        qr_image = qr_image.resize((size, size), Image.Resampling.LANCZOS)
        
        return qr_image
    
    @staticmethod
    def generate_download_url_qr(
        image_id: str,
        base_url: str,
        size: int = 300,
        border: int = 2,
        output_path: str = None
    ) -> Image.Image:
        """Generate QR code for downloading an image"""
        download_url = f"{base_url}/api/download/{image_id}"
        qr_image = QRCodeGenerator.generate_qr_code(download_url, size, border)
        
        # Save to file if output_path provided
        if output_path:
            qr_image.save(output_path, format='PNG')
        
        return qr_image
    
    @staticmethod
    def qr_to_bytes(qr_image: Image.Image) -> bytes:
        """Convert QR code image to bytes"""
        output = io.BytesIO()
        qr_image.save(output, format='PNG')
        return output.getvalue()
