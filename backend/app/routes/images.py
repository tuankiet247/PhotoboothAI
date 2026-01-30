from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import uuid
from pathlib import Path
from datetime import datetime
import aiofiles
from PIL import Image
import io

from app.config import settings
from app.services.image_processor import ImageProcessor
from app.services.ai_service import ai_service
from app.services.qr_generator import QRCodeGenerator

router = APIRouter(prefix="/api", tags=["images"])

# Store processed images metadata in memory (use database in production)
processed_images = {}

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload and process an image"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        content = await file.read()
        
        # Process image (resize and compress)
        image, compressed_data = await ImageProcessor.process_uploaded_image(
            content,
            settings.MAX_IMAGE_SIZE,
            settings.COMPRESSION_QUALITY
        )
        
        # Generate unique ID
        image_id = str(uuid.uuid4())
        
        # Save original (compressed) image
        original_path = settings.UPLOADS_DIR / f"{image_id}_original.jpg"
        async with aiofiles.open(original_path, 'wb') as f:
            await f.write(compressed_data)
        
        # Process with AI
        ai_response = await ai_service.process_image_with_ai(image)
        
        # Generate artistic version
        artistic_image = await ai_service.generate_artistic_image(image)
        
        # Save processed image
        processed_path = settings.PROCESSED_DIR / f"{image_id}_processed.jpg"
        processed_data = ImageProcessor.compress_image(artistic_image, settings.COMPRESSION_QUALITY)
        async with aiofiles.open(processed_path, 'wb') as f:
            await f.write(processed_data)
        
        # Generate QR code for download
        base_url = f"http://{settings.HOST}:{settings.PORT}"
        qr_image = QRCodeGenerator.generate_download_url_qr(
            image_id,
            base_url,
            settings.QR_CODE_SIZE,
            settings.QR_CODE_BORDER
        )
        
        # Save QR code
        qr_path = settings.PROCESSED_DIR / f"{image_id}_qr.png"
        qr_image.save(qr_path)
        
        # Store metadata
        processed_images[image_id] = {
            'id': image_id,
            'original_path': str(original_path),
            'processed_path': str(processed_path),
            'qr_path': str(qr_path),
            'ai_response': ai_response,
            'created_at': datetime.now().isoformat(),
            'filename': file.filename
        }
        
        # Return response
        return JSONResponse({
            'success': True,
            'image_id': image_id,
            'ai_description': ai_response,
            'processed_image_url': f'/api/image/{image_id}/processed',
            'qr_code_url': f'/api/image/{image_id}/qr',
            'download_url': f'/api/download/{image_id}'
        })
        
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@router.get("/image/{image_id}/processed")
async def get_processed_image(image_id: str):
    """Get processed image"""
    if image_id not in processed_images:
        raise HTTPException(status_code=404, detail="Image not found")
    
    processed_path = Path(processed_images[image_id]['processed_path'])
    
    if not processed_path.exists():
        raise HTTPException(status_code=404, detail="Processed image file not found")
    
    return FileResponse(
        processed_path,
        media_type="image/jpeg",
        filename=f"tet_photobooth_{image_id}.jpg"
    )

@router.get("/image/{image_id}/qr")
async def get_qr_code(image_id: str):
    """Get QR code for image download"""
    if image_id not in processed_images:
        raise HTTPException(status_code=404, detail="Image not found")
    
    qr_path = Path(processed_images[image_id]['qr_path'])
    
    if not qr_path.exists():
        raise HTTPException(status_code=404, detail="QR code not found")
    
    return FileResponse(
        qr_path,
        media_type="image/png",
        filename=f"qr_{image_id}.png"
    )

@router.get("/download/{image_id}")
async def download_image(image_id: str):
    """Download processed image (for QR code scanning)"""
    if image_id not in processed_images:
        raise HTTPException(status_code=404, detail="Image not found")
    
    processed_path = Path(processed_images[image_id]['processed_path'])
    
    if not processed_path.exists():
        raise HTTPException(status_code=404, detail="Image file not found")
    
    return FileResponse(
        processed_path,
        media_type="image/jpeg",
        filename=f"tet_photobooth_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg",
        headers={
            "Content-Disposition": f"attachment; filename=tet_photobooth_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        }
    )

@router.get("/gallery")
async def get_gallery():
    """Get list of all processed images"""
    gallery_items = []
    
    for image_id, metadata in processed_images.items():
        gallery_items.append({
            'id': image_id,
            'created_at': metadata['created_at'],
            'processed_image_url': f'/api/image/{image_id}/processed',
            'qr_code_url': f'/api/image/{image_id}/qr',
            'download_url': f'/api/download/{image_id}'
        })
    
    # Sort by created_at descending
    gallery_items.sort(key=lambda x: x['created_at'], reverse=True)
    
    return JSONResponse({
        'success': True,
        'count': len(gallery_items),
        'images': gallery_items
    })
