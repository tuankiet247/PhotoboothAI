import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Share2, Sparkles, Image as ImageIcon, X, Upload } from 'lucide-react';

// --- Components ---
import CameraModal from './components/CameraModal';

// --- GIẢ ĐỊNH API IMPORT (Giữ nguyên như file cũ của bạn) ---
import { uploadImage, getProcessedImage, getQRCode, getDownloadUrl, getGallery } from './api';

const App = () => {
  // --- STATE ---
  const [step, setStep] = useState('home'); // Các bước: home, processing, result, gallery
  
  // Dữ liệu ảnh
  const [capturedImage, setCapturedImage] = useState(null); // Ảnh gốc (preview)
  const [aiImage, setAiImage] = useState(null);             // Ảnh AI sau xử lý
  const [qrCode, setQrCode] = useState(null);               // QR Code
  const [downloadUrl, setDownloadUrl] = useState(null);     // Link tải
  const [gallery, setGallery] = useState([]);               // Thư viện ảnh
  
  // Trạng thái Loading & Lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Trạng thái Camera Modal
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // --- REFS ---
  // Ref cho input upload ảnh từ thư viện
  const fileInputRef = useRef(null);

  // --- EFFECTS ---

  // Load gallery khi mở app
  useEffect(() => {
    loadGallery();
  }, []);

  // --- API FUNCTIONS ---

  const loadGallery = async () => {
    try {
      const data = await getGallery();
      setGallery(data.images || []);
    } catch (err) {
      console.error('Error loading gallery:', err);
    }
  };

  // --- XỬ LÝ FILE & CAMERA (LOGIC MỚI) ---

  // Hàm chung xử lý khi người dùng chọn ảnh (từ Camera hoặc Thư viện)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Nếu người dùng cancel (không chụp/không chọn) thì thôi
    if (!file) return;

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ (JPG, PNG)');
      return;
    }

    // Bắt đầu xử lý
    processImage(file);

    // Reset giá trị input để lần sau chọn lại file cũ vẫn trigger sự kiện change
    event.target.value = null; 
  };

  const processImage = async (file) => {
    setIsLoading(true);
    setStep('processing'); // Chuyển ngay sang màn hình chờ
    setError(null);

    // 1. Tạo ảnh preview (để hiện mờ mờ trong lúc chờ)
    const reader = new FileReader();
    reader.onload = (e) => setCapturedImage(e.target.result);
    reader.readAsDataURL(file);

    try {
      // 2. Upload lên server
      const result = await uploadImage(file);
      
      if (result.success) {
        // 3. Lấy kết quả từ server
        setAiImage(getProcessedImage(result.image_id));
        setQrCode(getQRCode(result.image_id));
        setDownloadUrl(getDownloadUrl(result.image_id));
        
        // 4. Chuyển sang màn hình kết quả
        setStep('result');
        loadGallery(); // Cập nhật lại thư viện ngầm
      } else {
        throw new Error('Processing failed');
      }
    } catch (err) {
      console.error('Error processing:', err);
      setError('Có lỗi khi xử lý ảnh. Server có thể đang bận, vui lòng thử lại.');
      setStep('home');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset về màn hình chính
  const reset = () => {
    setCapturedImage(null);
    setAiImage(null);
    setQrCode(null);
    setDownloadUrl(null);
    setError(null);
    setStep('home');
  };

  // Tải ảnh
  const downloadImage = () => {
    if (downloadUrl) window.open(downloadUrl, '_blank');
  };

  // Chia sẻ ảnh
  const shareImage = async () => {
    if (navigator.share && aiImage) {
      try {
        await navigator.share({
          title: 'Ảnh Thiên Mã Nghinh Xuân',
          text: 'Xem ảnh Tết AI của tôi!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      alert('Hãy lưu ảnh về máy và chia sẻ thủ công nhé!');
    }
  };

  // --- RENDER HELPERS ---

  // Hiệu ứng hoa rơi
  const renderPetals = () => {
    return Array.from({ length: 15 }).map((_, i) => (
      <div 
        key={i}
        className="absolute animate-bounce opacity-70 pointer-events-none text-pink-300"
        style={{
          top: `-20px`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${Math.random() * 10 + 15}px`
        }}
      >
        🌸
      </div>
    ));
  };

  // Hiệu ứng thông báo lỗi
  const renderError = () => {
    if (!error) return null;
    return (
      <div className="mb-4 p-4 bg-red-800 border border-red-600 rounded-lg text-amber-100 text-sm flex items-center gap-3 animate-in fade-in">
        <X className="shrink-0" />
        {error}
      </div>
    );
  };

  // --- MAIN RENDER ---

  return (
    <div className="min-h-screen bg-red-950 text-amber-50 font-serif overflow-hidden relative selection:bg-amber-500">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 border-[40px] border-amber-500 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-amber-500 rounded-full"></div>
      </div>
      
      {renderPetals()}

      <div className="max-w-md mx-auto w-full min-h-screen flex flex-col p-4 sm:p-6 relative z-10">
        
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-widest text-amber-400 drop-shadow-lg">THIÊN MÃ</h1>
          <h2 className="text-xl tracking-tighter text-amber-200 uppercase">Nghinh Xuân 2026</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2"></div>
        </header>

        {/* Error Area */}
        {renderError()}

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center">
          
          {/* 1. HOME SCREEN */}
          {step === 'home' && (
            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block group">
                <div className="w-64 h-64 mx-auto rounded-full border-4 border-amber-500 p-2 overflow-hidden bg-red-900 shadow-[0_0_30px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all duration-500">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300 flex items-center justify-center bg-gradient-to-br from-red-900 to-red-950">
                    <span className="text-7xl animate-float filter drop-shadow-lg">🐎</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-red-900 px-6 py-1 rounded-full font-bold whitespace-nowrap shadow-lg">
                  AI PHOTOBOOTH
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                {/* NÚT CHỤP ẢNH MỚI: Mở Camera Modal */}
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-red-950 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Camera size={24} /> CHỤP NGAY
                </button>

                {/* NÚT UPLOAD ẢNH: Gọi input file thường */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-red-900/50 hover:bg-red-800 border-2 border-amber-600/50 text-amber-100 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                  <Upload size={24} /> TẢI ẢNH LÊN
                </button>
                
                <button 
                  onClick={() => setStep('gallery')}
                  className="w-full py-3 text-amber-400/80 hover:text-amber-300 font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ImageIcon size={20} /> Bộ sưu tập
                </button>
              </div>
              
              {/* --- HIDDEN INPUT --- */}
              
              {/* INPUT: Dành cho nút UPLOAD (Mở thư viện ảnh) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* 2. PROCESSING SCREEN (Màn hình chờ) */}
          {step === 'processing' && (
            <div className="text-center space-y-8 flex flex-col items-center animate-in fade-in">
              <div className="relative w-64 h-64">
                {/* Vòng xoay Loading */}
                <div className="absolute inset-0 border-4 border-amber-500 rounded-3xl animate-spin [animation-duration:3s]"></div>
                
                {/* Ảnh Preview mờ */}
                <div className="absolute inset-3 rounded-2xl overflow-hidden bg-red-900 flex items-center justify-center">
                  {capturedImage && (
                    <img src={capturedImage} alt="Preview" className="w-full h-full object-cover opacity-50 grayscale blur-sm" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Sparkles size={48} className="text-amber-400 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-amber-400 animate-pulse">AI Đang Hóa Mã...</h3>
                <p className="text-amber-200/70">Đang vẽ tranh thủy mặc từ ảnh của bạn</p>
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:0ms]"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
                </div>
              </div>
            </div>
          )}

          {/* 3. RESULT SCREEN (Kết quả) */}
          {step === 'result' && (
            <div className="space-y-6 animate-in zoom-in duration-500 pb-10">
              {/* Khung ảnh kết quả */}
              <div className="relative aspect-square rounded-xl overflow-hidden border-[6px] border-amber-600 bg-amber-100 shadow-2xl">
                {aiImage && (
                  <img src={aiImage} alt="AI Result" className="w-full h-full object-cover" />
                )}
                
                {/* Tem Watermark */}
                <div className="absolute top-3 right-3 bg-red-800/90 text-amber-100 text-[10px] py-3 px-1.5 writing-mode-vertical border border-amber-500/50 font-serif shadow-md">
                  Thiên Mã 2026
                </div>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="bg-red-900/40 backdrop-blur-md rounded-xl p-4 border border-amber-500/20 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg shrink-0">
                    <img src={qrCode} alt="QR Code" className="w-24 h-24" />
                  </div>
                  <div className="text-left">
                    <p className="text-amber-300 font-bold mb-1">Tải ảnh chất lượng cao</p>
                    <p className="text-xs text-amber-100/70">Quét mã QR để lưu ảnh về điện thoại của bạn.</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={downloadImage}
                  className="py-3 bg-amber-500 text-red-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors shadow-lg"
                >
                  <Download size={20} /> TẢI VỀ
                </button>
                <button 
                  onClick={shareImage}
                  className="py-3 bg-white/10 border border-amber-500/50 text-amber-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <Share2 size={20} /> CHIA SẺ
                </button>
              </div>
              
              <button onClick={reset} className="w-full py-2 text-amber-200/60 hover:text-amber-200 underline text-sm">
                Chụp tấm khác
              </button>
            </div>
          )}

          {/* 4. GALLERY SCREEN (Thư viện) */}
          {step === 'gallery' && (
            <div className="flex flex-col h-[80vh] animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center mb-6 border-b border-amber-500/30 pb-4">
                <h3 className="text-xl font-bold text-amber-400">Thư Viện Ảnh</h3>
                <button onClick={() => setStep('home')} className="p-2 text-amber-200 hover:text-white bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              {gallery.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-amber-200/40 space-y-4">
                  <ImageIcon size={64} strokeWidth={1} />
                  <p>Chưa có hình ảnh nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-20 custom-scrollbar pr-1">
                  {gallery.map((item) => (
                    <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-amber-500/30 bg-black">
                      <img 
                        src={item.processed_image_url} 
                        alt="Gallery" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
              )}
            </div>
          )}

        </main>
        
        {/* Footer */}
        <footer className="mt-4 pt-4 border-t border-amber-500/10 text-center relative z-10">
          <p className="text-[10px] text-amber-200/30 uppercase tracking-[0.3em]">
            © 2026 AI Photobooth Experience
          </p>
        </footer>

        {/* Floating Mobile Action Bar (Hiện khi KHÔNG ở trang Home) */}
        {step !== 'home' && (
          <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 rounded-full shadow-lg">
            <button
              onClick={() => setStep('gallery')}
              className="p-3 rounded-full bg-red-900/80 text-amber-200 shadow-sm"
              aria-label="Gallery"
            >
              <ImageIcon size={20} />
            </button>

            {/* Nút chụp nhanh trên thanh Floating mở Camera Modal */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-500 text-red-950 shadow-xl border-4 border-amber-200/40 active:scale-95"
              aria-label="Take Photo"
            >
              <Camera size={28} />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-red-900/80 text-amber-200 shadow-sm"
              aria-label="Upload"
            >
              <Upload size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={processImage}
      />
    </div>
  );
};

export default App;