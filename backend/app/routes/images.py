import os
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from PIL import Image
import io

from app.config import settings
from app.services.ai_service import ai_service
from app.services.qr_generator import QRCodeGenerator
from app.services.image_processor import ImageProcessor

router = APIRouter()

@router.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload and process image with AI"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique ID
        image_id = str(uuid.uuid4())
        
        print(f"\n{'='*60}")
        print(f"📤 NEW UPLOAD REQUEST")
        print(f"   Image ID: {image_id}")
        print(f"   Filename: {file.filename}")
        print(f"   Content-Type: {file.content_type}")
        print(f"{'='*60}\n")
        
        # Read and process uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        print(f"✅ Image loaded: {image.size} ({image.mode})")
        
        # Save original
        original_filename = f"{image_id}_original.jpg"
        original_path = settings.UPLOADS_DIR / original_filename
        image.save(original_path, "JPEG")
        print(f"✅ Saved original to: {original_path}")
        
        # Resize image trước khi gửi AI (tối ưu tốc độ)
        print(f"📐 Resizing image (max: {settings.MAX_IMAGE_SIZE}px)...")
        resized_image = ImageProcessor.resize_image(image, settings.MAX_IMAGE_SIZE)
        print(f"✅ Resized to: {resized_image.size}")
        
        # ✅ Gọi AI image generation (ĐÚNG THEO test.py)
        print(f"\n🤖 Calling AI Service...")
        processed_image = await ai_service.generate_artistic_image(resized_image)
        print(f"✅ AI returned image: {processed_image.size} ({processed_image.mode})")
        
        # Crop ảnh về tỉ lệ 9:16
        print(f"📐 Cropping to {settings.OUTPUT_ASPECT_RATIO[0]}:{settings.OUTPUT_ASPECT_RATIO[1]} ratio...")
        processed_image = ImageProcessor.crop_to_aspect_ratio(processed_image, settings.OUTPUT_ASPECT_RATIO)
        
        # Save processed image
        processed_filename = f"{image_id}_processed.jpg"
        processed_path = settings.PROCESSED_DIR / processed_filename
        
        # Convert to RGB if needed and save
        if processed_image.mode == 'RGBA':
            print("🔄 Converting RGBA → RGB...")
            rgb_image = Image.new('RGB', processed_image.size, (255, 255, 255))
            rgb_image.paste(processed_image, mask=processed_image.split()[3])
            rgb_image.save(processed_path, "JPEG", quality=settings.COMPRESSION_QUALITY)
        else:
            processed_image.save(processed_path, "JPEG", quality=settings.COMPRESSION_QUALITY)
        
        print(f"✅ Saved processed image to: {processed_path}")
        
# Generate QR code (chỉ khi ENABLE_QR_CODE = True)
        qr_code_url = None
        if settings.ENABLE_QR_CODE:
            base_url = os.getenv("BACKEND_URL", f"http://{settings.HOST}:{settings.PORT}")
            qr_filename = f"{image_id}_qr.png"
            qr_path = settings.PROCESSED_DIR / qr_filename

            print(f"📱 Generating QR code...")
            QRCodeGenerator.generate_download_url_qr(
                image_id=image_id,
                base_url=base_url,
                output_path=str(qr_path)
            )
            print(f"✅ Generated QR code at: {qr_path}")
            qr_code_url = f"/api/image/{image_id}/qr"
        else:
            print(f"⏭️ Skipping QR code generation (ENABLE_QR_CODE=False)")
        
        print(f"\n{'='*60}")
        print(f"✅ PROCESSING COMPLETE")
        print(f"   Image ID: {image_id}")
        print(f"{'='*60}\n")
        
        # Return URLs
        return {
            "success": True,
            "image_id": image_id,
            "processed_image_url": f"/api/image/{image_id}/processed",
            "qr_code_url": qr_code_url,  # None nếu ENABLE_QR_CODE=False
            "download_url": f"/api/download/{image_id}"
        }
        
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ ERROR PROCESSING UPLOAD")
        print(f"   Error: {type(e).__name__}: {e}")
        print(f"{'='*60}\n")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/image/{image_id}/processed")
async def get_processed_image(image_id: str):
    """Get processed image"""
    try:
        processed_path = settings.PROCESSED_DIR / f"{image_id}_processed.jpg"
        if not processed_path.exists():
            raise HTTPException(status_code=404, detail="Processed image not found")
        
        return FileResponse(processed_path, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/image/{image_id}/qr")
async def get_qr_code(image_id: str):
    """Get QR code"""
    try:
        qr_path = settings.PROCESSED_DIR / f"{image_id}_qr.png"
        if not qr_path.exists():
            raise HTTPException(status_code=404, detail="QR code not found")
        
        return FileResponse(qr_path, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/download/{image_id}")
async def download_image(image_id: str):
    """Download processed image"""
    try:
        processed_path = settings.PROCESSED_DIR / f"{image_id}_processed.jpg"
        if not processed_path.exists():
            raise HTTPException(status_code=404, detail="Image not found")
        
        return FileResponse(
            processed_path,
            media_type="image/jpeg",
            filename=f"tet_photo_{image_id}.jpg",
            headers={"Content-Disposition": f"attachment; filename=tet_photo_{image_id}.jpg"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/gallery")
async def get_gallery():
    """Get all processed images"""
    try:
        images = []
        for file in settings.PROCESSED_DIR.glob("*_processed.jpg"):
            image_id = file.stem.replace("_processed", "")
            images.append({
                "id": image_id,
                "url": f"/api/image/{image_id}/processed",
                "qr_url": f"/api/image/{image_id}/qr",
                "download_url": f"/api/download/{image_id}"
            })
        
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
