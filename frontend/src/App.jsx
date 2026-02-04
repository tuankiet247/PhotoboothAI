import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Share2, Sparkles, Image as ImageIcon, X, Upload, Heart } from 'lucide-react';

// --- Components ---
import CameraModal from './components/CameraModal';
import PetalsFalling from './components/PetalsFalling';
import Fireworks from './components/Fireworks';

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
    <div className="min-h-screen animated-gradient text-amber-50 font-serif overflow-hidden relative selection:bg-amber-500">
      {/* Background Decor với hiệu ứng glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 border-[40px] border-amber-500/20 rounded-full ring-glow"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-amber-500/20 rounded-full ring-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-10 w-32 h-32 border-[15px] border-pink-400/10 rounded-full ring-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-5 w-24 h-24 border-[10px] border-amber-400/10 rounded-full ring-glow" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Hiệu ứng hoa đào rơi - Nhiều hơn */}
      <PetalsFalling count={60} />
      
      {/* Hiệu ứng pháo hoa */}
      <Fireworks show={step === 'home' || step === 'result'} intensity={step === 'result' ? 'high' : 'medium'} />

      <div className="max-w-md mx-auto w-full min-h-screen flex flex-col p-4 sm:p-6 relative z-10">
        
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-60">
            <span className="text-2xl animate-float" style={{ animationDelay: '0s' }}>🌸</span>
            <span className="text-lg animate-float" style={{ animationDelay: '0.5s' }}>✨</span>
            <span className="text-2xl animate-float" style={{ animationDelay: '1s' }}>🌸</span>
          </div>
          
          <h1 className="text-5xl font-bold tracking-widest text-amber-400 drop-shadow-lg mt-6">
            THIÊN MÃ
          </h1>
          <h2 className="text-xl tracking-[0.3em] text-amber-200/90 uppercase mt-1 flex items-center justify-center gap-3">
            <span className="text-pink-300">❀</span>
            Nghinh Xuân 2026
            <span className="text-pink-300">❀</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-3 rounded-full"></div>
          <p className="text-xs text-amber-200/50 mt-2 tracking-wider">✦ AI Photobooth ✦</p>
        </header>

        {/* Error Area */}
        {renderError()}

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center">
          
          {/* 1. HOME SCREEN */}
          {step === 'home' && (
            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block group">
                <div className="absolute -inset-4 rounded-full border border-amber-500/20 animate-pulse"></div>
                <div className="absolute -inset-8 rounded-full border border-pink-400/10"></div>
                
                <div className="w-64 h-64 mx-auto rounded-full border-4 border-amber-500 p-2 overflow-hidden bg-gradient-to-br from-red-900 to-red-950 shadow-[0_0_40px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all duration-500">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300/50 flex items-center justify-center bg-gradient-to-br from-red-800/50 to-red-950 relative">
                    <span className="absolute top-4 left-6 text-xl opacity-50 animate-float" style={{ animationDelay: '0.2s' }}>🌸</span>
                    <span className="absolute top-6 right-8 text-lg opacity-40 animate-float" style={{ animationDelay: '0.8s' }}>🌸</span>
                    <span className="absolute bottom-8 left-8 text-lg opacity-40 animate-float" style={{ animationDelay: '1.2s' }}>✨</span>
                    <span className="absolute bottom-6 right-6 text-xl opacity-50 animate-float" style={{ animationDelay: '0.5s' }}>🌸</span>
                    
                    <span className="text-8xl animate-float filter drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">🐎</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-red-900 px-6 py-1.5 rounded-full font-bold whitespace-nowrap shadow-lg">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles size={16} />
                    AI PHOTOBOOTH
                  </span>
                </div>
              </div>
              
              <p className="text-amber-200/70 text-sm italic">
                "Biến khoảnh khắc thành nghệ thuật cùng FPT"
              </p>
              
              <div className="space-y-4 pt-2">
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-red-950 rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Camera size={24} /> CHỤP NGAY
                  </span>
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 bg-red-900/60 hover:bg-red-800/80 border-2 border-amber-500/40 hover:border-amber-500/70 text-amber-100 rounded-2xl font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-3 backdrop-blur-sm"
                >
                  <Upload size={24} /> TẢI ẢNH LÊN
                </button>
                
                <button 
                  onClick={() => setStep('gallery')}
                  className="w-full py-3 text-amber-400/80 hover:text-amber-300 font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/5 rounded-xl"
                >
                  <ImageIcon size={20} /> Bộ sưu tập ({gallery.length})
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

          {/* 2. PROCESSING SCREEN */}
          {step === 'processing' && (
            <div className="text-center space-y-8 flex flex-col items-center animate-in fade-in">
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 border-4 border-amber-500/80 rounded-3xl animate-spin [animation-duration:3s]"></div>
                <div className="absolute inset-2 border-2 border-pink-400/40 rounded-2xl animate-spin [animation-duration:5s] [animation-direction:reverse]"></div>
                <div className="absolute inset-4 border border-amber-300/30 rounded-xl animate-spin [animation-duration:7s]"></div>
                
                <div className="absolute inset-6 rounded-xl overflow-hidden bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center border border-amber-500/20">
                  {capturedImage && (
                    <img src={capturedImage} alt="Preview" className="w-full h-full object-cover opacity-40 grayscale blur-sm" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="relative">
                      <Sparkles size={56} className="text-amber-400 animate-pulse" />
                      <div className="absolute -inset-4 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <span className="absolute top-2 left-1/4 text-xl animate-float opacity-60">🌸</span>
                <span className="absolute top-1/4 right-2 text-lg animate-float opacity-50" style={{ animationDelay: '1s' }}>✨</span>
                <span className="absolute bottom-2 right-1/4 text-xl animate-float opacity-60" style={{ animationDelay: '0.5s' }}>🌸</span>
                <span className="absolute bottom-1/4 left-2 text-lg animate-float opacity-50" style={{ animationDelay: '1.5s' }}>✨</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-amber-400 animate-pulse">AI Đang Hóa Mã...</h3>
                <p className="text-amber-200/70 text-sm">Đang vẽ tranh thủy mặc từ ảnh của bạn</p>
                <div className="flex justify-center gap-3 mt-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-bounce [animation-delay:0ms] shadow-lg"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-bounce [animation-delay:150ms] shadow-lg"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-bounce [animation-delay:300ms] shadow-lg"></div>
                </div>
                <p className="text-pink-300/50 text-xs mt-2 flex items-center justify-center gap-1">
                  <Heart size={12} /> Vui lòng chờ trong giây lát
                </p>
              </div>
            </div>
          )}

          {/* 3. RESULT SCREEN */}
          {step === 'result' && (
            <div className="space-y-6 animate-in zoom-in duration-500 pb-10">
              <div className="text-center">
                <p className="text-pink-300 text-sm flex items-center justify-center gap-2">
                  <span>🌸</span> Tác phẩm của bạn <span>🌸</span>
                </p>
              </div>
              
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border-[6px] border-amber-500 bg-amber-100 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
                <div className="absolute -top-3 -left-3 text-3xl z-10 drop-shadow-lg animate-float">🌸</div>
                <div className="absolute -top-3 -right-3 text-3xl z-10 drop-shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>🌸</div>
                <div className="absolute -bottom-3 -left-3 text-2xl z-10 drop-shadow-lg animate-float" style={{ animationDelay: '1s' }}>🌸</div>
                <div className="absolute -bottom-3 -right-3 text-2xl z-10 drop-shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>🌸</div>
                
                {aiImage && (
                  <img src={aiImage} alt="AI Result" className="w-full h-full object-cover" />
                )}
                
                <div className="absolute top-3 right-3 bg-gradient-to-b from-red-800/95 to-red-900/95 text-amber-100 text-[10px] py-4 px-2 writing-mode-vertical border border-amber-500/50 font-serif shadow-lg rounded-sm">
                  <span className="text-amber-400">✦</span> Thiên Mã 2026 <span className="text-amber-400">✦</span>
                </div>
              </div>

              {qrCode && (
                <div className="bg-gradient-to-r from-red-900/60 to-red-800/60 backdrop-blur-md rounded-2xl p-4 border border-amber-500/30 flex items-center gap-4 shadow-lg">
                  <div className="bg-white p-2.5 rounded-xl shrink-0 shadow-inner">
                    <img src={qrCode} alt="QR Code" className="w-24 h-24" />
                  </div>
                  <div className="text-left">
                    <p className="text-amber-300 font-bold mb-1 flex items-center gap-2">
                      <Download size={16} /> Tải ảnh HD
                    </p>
                    <p className="text-xs text-amber-100/70 leading-relaxed">Quét mã QR để lưu ảnh chất lượng cao về điện thoại.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={downloadImage}
                  className="py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-red-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg"
                >
                  <Download size={20} /> TẢI VỀ
                </button>
                <button 
                  onClick={shareImage}
                  className="py-3.5 bg-white/10 border-2 border-amber-500/50 text-amber-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 hover:border-amber-500 transition-all"
                >
                  <Share2 size={20} /> CHIA SẺ
                </button>
              </div>
              
              <button onClick={reset} className="w-full py-3 text-amber-200/60 hover:text-amber-200 transition-colors flex items-center justify-center gap-2 hover:bg-white/5 rounded-xl">
                <Camera size={16} /> Chụp tấm khác
              </button>
            </div>
          )}

          {/* 4. GALLERY SCREEN */}
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
        <footer className="mt-4 pt-4 border-t border-amber-500/20 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 text-amber-200/40">
            <span className="text-pink-300/50">🌸</span>
            <p className="text-[10px] uppercase tracking-[0.2em]">
              © 2026 AI Photobooth Experience
            </p>
            <span className="text-pink-300/50">🌸</span>
          </div>
        </footer>

        {/* Floating Mobile Action Bar */}
        {step !== 'home' && (
          <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/40 backdrop-blur-md p-2 rounded-full shadow-lg">
            <button
              onClick={() => setStep('gallery')}
              className="p-3 rounded-full bg-red-900/80 text-amber-200 shadow-sm"
              aria-label="Gallery"
            >
              <ImageIcon size={20} />
            </button>

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