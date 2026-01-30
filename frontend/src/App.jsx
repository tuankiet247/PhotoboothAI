import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Download, Share2, Sparkles, Image as ImageIcon, X, Trash2, Upload } from 'lucide-react';
import { uploadImage, getProcessedImage, getQRCode, getDownloadUrl, getGallery } from './api';

const App = () => {
  const [step, setStep] = useState('home'); // home, capture, upload, processing, result, gallery
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [aiImage, setAiImage] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [error, setError] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load gallery and enumerate cameras on mount
  useEffect(() => {
    loadGallery();
    enumerateCameras();
  }, []);

  // Auto-play video when stream is ready
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream]);

  // Tự động bật camera khi vào bước 'capture'
  useEffect(() => {
    if (step === 'capture' && !stream) {
      startCamera();
    }
    // eslint-disable-next-line
  }, [step]);

  const loadGallery = async () => {
    try {
      const data = await getGallery();
      setGallery(data.images || []);
    } catch (err) {
      console.error('Error loading gallery:', err);
    }
  };

  const enumerateCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !currentCameraId) {
        setCurrentCameraId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error enumerating cameras:', err);
    }
  };

  // Khởi tạo camera
  const startCamera = async (deviceId = null) => {
    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        }
      };

      // Use specific camera if deviceId provided, otherwise use default
      if (deviceId) {
        constraints.video.deviceId = { exact: deviceId };
      } else if (currentCameraId) {
        constraints.video.deviceId = { exact: currentCameraId };
      } else {
        constraints.video.facingMode = 'user';
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setStep('capture');
      setError(null);

      // Re-enumerate cameras after permission granted
      await enumerateCameras();
    } catch (err) {
      console.error("Không thể truy cập camera:", err);
      setError("Vui lòng cho phép truy cập camera để sử dụng Photobooth.");
    }
  };

  // Switch camera
  const switchCamera = async () => {
    if (cameras.length <= 1) return;
    
    const currentIndex = cameras.findIndex(cam => cam.deviceId === currentCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamera = cameras[nextIndex];
    
    setCurrentCameraId(nextCamera.deviceId);
    await startCamera(nextCamera.deviceId);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured.png', { type: 'image/png' });
        processImage(file);
      }, 'image/png');
      
      stopCamera();
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      processImage(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Xử lý ảnh với AI
  const processImage = async (file) => {
    setIsLoading(true);
    setStep('processing');
    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setCapturedImage(e.target.result);
    reader.readAsDataURL(file);

    try {
      const result = await uploadImage(file);
      
      if (result.success) {
        setCurrentImageId(result.image_id);
        setAiImage(getProcessedImage(result.image_id));
        setQrCode(getQRCode(result.image_id));
        setDownloadUrl(getDownloadUrl(result.image_id));
        setIsLoading(false);
        setStep('result');
        
        // Reload gallery
        await loadGallery();
      } else {
        throw new Error('Processing failed');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.');
      setIsLoading(false);
      setStep('home');
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAiImage(null);
    setQrCode(null);
    setDownloadUrl(null);
    setCurrentImageId(null);
    setError(null);
    setStep('home');
  };

  const downloadImage = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const shareImage = async () => {
    if (navigator.share && aiImage) {
      try {
        await navigator.share({
          title: 'Ảnh Thiên Mã Nghinh Xuân',
          text: 'Xem ảnh Tết của tôi từ AI Photobooth!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      alert('Quét mã QR để tải ảnh về điện thoại của bạn!');
    }
  };

  // Hiệu ứng hoa đào rơi
  const renderPetals = () => {
    return Array.from({ length: 15 }).map((_, i) => (
      <div 
        key={i}
        className="absolute animate-bounce opacity-70 pointer-events-none"
        style={{
          top: `-20px`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      >
        🌸
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-red-900 text-amber-50 font-serif overflow-hidden relative selection:bg-amber-500">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 border-[40px] border-amber-500 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-amber-500 rounded-full"></div>
      </div>
      
      {/* Petals layer */}
      {renderPetals()}

      <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 relative z-10">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-widest text-amber-400 drop-shadow-lg">THIÊN MÃ</h1>
          <h2 className="text-xl tracking-tighter text-amber-200 uppercase">Nghinh Xuân 2026</h2>
          <div className="h-1 w-24 bg-amber-500 mx-auto mt-2 rounded-full"></div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-800 border border-red-600 rounded-lg text-amber-100 text-sm">
            {error}
            {error.includes('truy cập camera') && (
              <div className="mt-2 text-amber-200/80">
                <b>Hướng dẫn:</b> Hãy kiểm tra biểu tượng camera trên thanh địa chỉ trình duyệt và cấp lại quyền truy cập camera cho trang web này.<br/>
                Nếu vẫn không được, hãy thử tải lại trang hoặc kiểm tra cài đặt trình duyệt.
              </div>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col justify-center">
          
          {step === 'home' && (
            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block">
                <div className="w-64 h-64 mx-auto rounded-full border-4 border-amber-500 p-2 overflow-hidden bg-red-800 shadow-2xl">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300 flex items-center justify-center">
                    <span className="text-6xl animate-float">🐎</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-red-900 px-4 py-1 rounded-full font-bold whitespace-nowrap">
                  AI PHOTOBOOTH
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={startCamera}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-red-900 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                  <Camera size={24} /> CHỤP BẰNG CAMERA
                </button>
                <button 
                  onClick={triggerFileUpload}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-red-900 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                  <Upload size={24} /> TẢI ẢNH LÊN
                </button>
                <button 
                  onClick={() => setStep('gallery')}
                  className="w-full py-4 bg-transparent border-2 border-amber-500 text-amber-400 rounded-2xl font-bold text-lg transition-all hover:bg-amber-500/10 flex items-center justify-center gap-3"
                >
                  <ImageIcon size={22} /> BỘ SƯU TẬP
                </button>
              </div>
              
              <p className="text-sm text-amber-200/60 italic">
                * Hình ảnh sẽ được AI xử lý sang phong cách tranh thủy mặc Thiên Mã độc bản.
              </p>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {step === 'capture' && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-amber-500 bg-black shadow-2xl">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Corner Decor */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-300 opacity-75"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-300 opacity-75"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-300 opacity-75"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-300 opacity-75"></div>
                
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex justify-center items-center gap-6">
                <button 
                  onClick={() => { stopCamera(); setStep('home'); }}
                  className="p-4 bg-red-800 text-amber-400 rounded-full border border-amber-900 transition-all hover:bg-red-700"
                >
                  <X size={28} />
                </button>
                <button 
                  onClick={capturePhoto}
                  className="p-8 bg-amber-500 text-red-900 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all active:scale-90"
                >
                  <Camera size={40} />
                </button>
                <button 
                  onClick={switchCamera}
                  disabled={cameras.length <= 1}
                  className={`p-4 rounded-full border transition-all ${
                    cameras.length > 1 
                      ? 'bg-red-800 text-amber-400 border-amber-900 hover:bg-red-700 cursor-pointer' 
                      : 'bg-red-800/50 text-amber-400/50 border-amber-900/50 cursor-not-allowed'
                  }`}
                  title={cameras.length > 1 ? `Đổi camera (${cameras.length} camera)` : 'Chỉ có 1 camera'}
                >
                  <RefreshCw size={28} />
                </button>
              </div>
              
              {/* Camera info */}
              {cameras.length > 1 && (
                <div className="text-center">
                  <p className="text-xs text-amber-200/60">
                    📹 {cameras.findIndex(cam => cam.deviceId === currentCameraId) + 1}/{cameras.length}
                    {cameras.find(cam => cam.deviceId === currentCameraId)?.label && 
                      `: ${cameras.find(cam => cam.deviceId === currentCameraId).label}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-8">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 border-4 border-amber-500 rounded-3xl animate-spin [animation-duration:3s]"></div>
                <div className="absolute inset-4 overflow-hidden rounded-2xl bg-red-800 flex items-center justify-center">
                  {capturedImage && (
                    <img src={capturedImage} alt="Raw" className="w-full h-full object-cover opacity-40 grayscale" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={48} className="text-amber-400 animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-amber-400 animate-pulse">AI Đang Hóa Mã...</h3>
                <p className="text-amber-200/70">Vui lòng đợi trong giây lát để Thiên Mã xuất hiện</p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-amber-500 bg-amber-50 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <div className="relative w-full h-full">
                  {aiImage && (
                    <img src={aiImage} alt="AI Result" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent"></div>
                  
                  <div className="absolute top-4 right-4 bg-red-700 text-amber-100 text-[10px] py-4 px-2 writing-mode-vertical border border-amber-400">
                    Thiên Mã Nghinh Xuân
                  </div>
                  <div className="absolute bottom-4 left-4 text-amber-100">
                    <p className="text-xs opacity-80">Ất Tỵ Niên</p>
                    <p className="font-bold tracking-widest text-lg">XUÂN 2026</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              {qrCode && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-amber-500/30">
                  <p className="text-center text-amber-200 text-sm mb-3">
                    📱 Quét mã QR để tải ảnh về điện thoại
                  </p>
                  <div className="bg-white p-3 rounded-xl mx-auto w-fit">
                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button 
                  className="py-3 bg-amber-500 text-red-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors active:scale-95"
                  onClick={downloadImage}
                >
                  <Download size={20} /> TẢI VỀ
                </button>
                <button 
                  className="py-3 bg-white/10 border border-amber-500 text-amber-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors active:scale-95"
                  onClick={shareImage}
                >
                  <Share2 size={20} /> CHIA SẺ
                </button>
              </div>
              
              <button 
                onClick={reset}
                className="w-full py-3 text-amber-200/60 hover:text-amber-200 underline text-sm transition-all"
              >
                Chụp ảnh mới
              </button>
            </div>
          )}

          {step === 'gallery' && (
            <div className="h-[60vh] flex flex-col animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-amber-400">Tác Phẩm Của Bạn</h3>
                <button onClick={() => setStep('home')} className="p-2 text-amber-200 hover:text-amber-400">
                  <X />
                </button>
              </div>
              
              {gallery.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-amber-200/40 space-y-4">
                  <ImageIcon size={64} />
                  <p>Chưa có hình ảnh nào</p>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-3">
                    {gallery.map((item) => (
                      <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-amber-500/30 hover:border-amber-500 transition-all">
                        <img 
                          src={item.processed_image_url} 
                          alt="Gallery item" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <a 
                            href={item.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-amber-500 text-red-900 rounded-full hover:bg-amber-400"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-amber-500/20 text-center">
          <p className="text-[10px] text-amber-200/40 uppercase tracking-[0.3em]">
            © 2026 AI Photobooth Experience
          </p>
        </footer>

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default App;
