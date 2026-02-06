import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Share2, Sparkles, Image as ImageIcon, X, Upload, Heart, ArrowRight, Zap, RefreshCcw, Stars, MessageSquareQuote, AlertCircle } from 'lucide-react';

// --- Components ---
import CameraModal from './components/CameraModal';
import PetalsFalling from './components/PetalsFalling';
import Fireworks from './components/Fireworks';

// --- API IMPORT ---
import { uploadImage, getProcessedImage, getQRCode, getDownloadUrl, getGallery } from './api';

const App = () => {
  // --- STATE ---
  const [step, setStep] = useState('landing'); // Các bước: landing, capture, processing, result, gallery
  
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
  
  // Confetti animation
  const [showConfetti, setShowConfetti] = useState(false);
  
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

  // --- XỬ LÝ FILE & CAMERA ---

  // Hàm chung xử lý khi người dùng chọn ảnh (từ Camera hoặc Thư viện)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ (JPG, PNG)');
      return;
    }

    processImage(file);
    event.target.value = null; 
  };

  const processImage = async (file) => {
    setIsLoading(true);
    setStep('processing');
    setError(null);

    // 1. Tạo ảnh preview
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
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        loadGallery();
      } else {
        throw new Error('Processing failed');
      }
    } catch (err) {
      console.error('Error processing:', err);
      setError('Có lỗi khi xử lý ảnh. Server có thể đang bận, vui lòng thử lại.');
      setStep('landing');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset về màn hình chính
  const reset = async () => {
    // Clear browser caches
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      } catch (err) {
        console.warn('Could not clear caches:', err);
      }
    }
    
    // Revoke object URLs để giải phóng bộ nhớ
    if (capturedImage && capturedImage.startsWith('blob:')) {
      URL.revokeObjectURL(capturedImage);
    }
    if (aiImage && aiImage.startsWith('blob:')) {
      URL.revokeObjectURL(aiImage);
    }
    
    setCapturedImage(null);
    setAiImage(null);
    setQrCode(null);
    setDownloadUrl(null);
    setError(null);
    setShowConfetti(false);
    setStep('landing');
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

  // Handle start button
  const handleStart = () => setIsCameraOpen(true);

  // --- MAIN RENDER ---

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-sans overflow-hidden flex flex-col items-center justify-center p-4 relative selection:bg-[#CCFF00]">
      
      {/* --- NEO-BRUTALISM BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF00FF] rounded-full blur-[120px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#00FFFF] rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Hiệu ứng hoa đào rơi */}
      <PetalsFalling count={40} />
      
      {/* Hiệu ứng pháo hoa */}
      <Fireworks show={step === 'landing' || step === 'result'} intensity={step === 'result' ? 'high' : 'medium'} />

      {/* --- CONFETTI --- */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti border border-black"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                backgroundColor: ['#CCFF00', '#FF00FF', '#00FFFF', '#FFFF00', '#FFD700'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                animationDuration: `${Math.random() * 2 + 1.5}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                boxShadow: '2px 2px 0px black'
              }}
            />
          ))}
        </div>
      )}

      {/* --- MAIN CARD --- */}
      <div className="w-full max-w-[400px] bg-white border-[3px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10 min-h-[85vh] flex flex-col transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        {/* --- MARQUEE HEADER --- */}
        <div className="absolute top-6 left-0 right-0 z-50 pointer-events-none flex justify-between items-center px-6">
           <div className="bg-[#CCFF00] border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_black] transform -rotate-3">
              <span className="text-xs font-black uppercase tracking-wider">Thiên Mã 2026</span>
           </div>
           <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_black] animate-spin-slow">
              <Stars className="w-5 h-5 text-black" />
           </div>
        </div>

        <div className="flex-1 flex flex-col relative w-full h-full">
          
          {/* === STEP 1: LANDING === */}
          {step === 'landing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500">
              
              {/* Error Display */}
              {error && (
                <div className="w-full bg-red-100 border-2 border-red-500 rounded-xl p-3 flex items-center gap-2 shadow-[3px_3px_0px_black]">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-xs font-bold text-red-700">{error}</span>
                  <button onClick={() => setError(null)} className="ml-auto">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="relative group cursor-pointer mt-8" onClick={handleStart}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-[#FF00FF] rotate-45 rounded-[40px] opacity-20 group-hover:rotate-90 transition-transform duration-700"></div>
                </div>
                <div className="w-56 h-56 relative bg-white border-[4px] border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_black] z-10 overflow-hidden group-hover:scale-105 transition-transform">
                   <div className="absolute top-8 right-6 transform rotate-12 z-20">
                      <div className="bg-[#00FFFF] border-2 border-black px-2 py-0.5 rounded shadow-[2px_2px_0px_black]">
                        <span className="text-[10px] font-black">#AI_MAGIC</span>
                      </div>
                   </div>
                   <span className="text-[90px] transform group-hover:-rotate-12 transition-transform duration-300 drop-shadow-lg">🐎</span>
                   <Zap className="absolute bottom-10 left-8 w-6 h-6 text-[#FFD700] fill-[#FFD700] animate-bounce" />
                   <Sparkles className="absolute top-16 left-6 w-5 h-5 text-[#FF00FF] animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <h1 className="text-5xl font-black italic tracking-tighter leading-[0.85]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00FF] to-[#00FFFF]" style={{ WebkitTextStroke: '1.5px black' }}>NGHINH</span> <br/>
                  <span className="text-black drop-shadow-[2px_2px_0px_#CCFF00]">XUÂN</span>
                </h1>
                <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full transform -rotate-2 mt-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Powered by AI</p>
                </div>
              </div>

              <div className="space-y-3 w-full max-w-[280px]">
                <button 
                  onClick={handleStart}
                  className="w-full h-16 bg-[#CCFF00] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_black] transition-all flex items-center justify-center gap-3 group"
                >
                  <Camera className="w-6 h-6" />
                  <span className="font-black text-xl tracking-wide">CHỤP NGAY</span>
                  <div className="bg-black text-[#CCFF00] rounded-full p-1 group-hover:rotate-45 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-14 bg-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_black] transition-all flex items-center justify-center gap-3"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-bold text-lg">TẢI ẢNH LÊN</span>
                </button>

                <button 
                  onClick={() => setStep('gallery')}
                  className="w-full py-3 text-black/70 hover:text-black font-semibold flex items-center justify-center gap-2 transition-all hover:bg-gray-100 rounded-xl border-2 border-transparent hover:border-black"
                >
                  <ImageIcon size={20} /> Bộ sưu tập ({gallery.length})
                </button>
              </div>
              
              {/* --- HIDDEN INPUT --- */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* === STEP 2: PROCESSING === */}
          {step === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in duration-500">
              
              <div className="relative w-64 h-80 perspective-1000">
                {/* Card Background */}
                <div className="absolute inset-0 bg-black rounded-[32px] translate-x-2 translate-y-2"></div>
                
                <div className="relative h-full w-full rounded-[30px] overflow-hidden border-[4px] border-black bg-white flex flex-col items-center justify-center">
                  {/* Preview Image */}
                  {capturedImage && (
                    <img src={capturedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />
                  )}
                  
                  {/* Loading Overlay */}
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#CCFF00] border-t-black rounded-full animate-spin"></div>
                    
                    <div className="bg-[#CCFF00] border-2 border-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_black] animate-bounce">
                      <span className="font-black text-sm uppercase">AI đang vẽ...</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-[#FF00FF] border border-black rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-[#00FFFF] border border-black rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-3 h-3 bg-[#CCFF00] border border-black rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 bg-[#FF00FF] text-white px-3 py-1 border-2 border-black rounded shadow-[2px_2px_0px_black] rotate-6">
                    <span className="font-black text-[10px]">#THIÊN_MÃ</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black">AI Đang Hóa Mã...</h3>
                <p className="text-sm text-black/60">Đang tạo tác phẩm nghệ thuật từ ảnh của bạn</p>
                <p className="text-xs text-black/40 flex items-center justify-center gap-1 mt-4">
                  <Heart size={12} className="text-[#FF00FF]" /> Vui lòng chờ trong giây lát
                </p>
              </div>
            </div>
          )}

          {/* === STEP 3: RESULT === */}
          {step === 'result' && (
            <div className="flex-1 flex flex-col p-6 animate-in zoom-in-95 duration-500 justify-center items-center">
               
               {/* Result Card */}
               <div className="relative w-full aspect-[3/4] perspective-1000 transform hover:rotate-1 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black rounded-[32px] translate-x-2 translate-y-2"></div>
                  
                  <div className="relative h-full w-full rounded-[30px] overflow-hidden border-[4px] border-black bg-white flex flex-col">
                    <div className="flex-1 relative overflow-hidden border-b-[4px] border-black">
                       {aiImage && (
                         <img src={aiImage} alt="AI Result" className="w-full h-full object-cover" />
                       )}
                       
                       <div className="absolute top-4 right-4 bg-[#FF00FF] text-white px-3 py-1 border-2 border-black rounded shadow-[3px_3px_0px_black] rotate-6 animate-pulse">
                          <span className="font-black text-[10px]">#THIÊN_MÃ_2026</span>
                       </div>
                    </div>
                    
                    {/* Caption Area */}
                    <div className="min-h-16 bg-white flex flex-col justify-center px-4 py-3 gap-1">
                       <div className="flex items-center gap-2">
                          <MessageSquareQuote className="w-4 h-4 text-[#CCFF00] fill-black" />
                          <p className="font-black text-[10px] uppercase text-gray-400">TẾT 2026</p>
                       </div>
                       <p className="text-xs font-bold leading-tight">Thiên Mã Nghinh Xuân - Phúc Lộc An Khang! 🐎✨</p>
                    </div>
                  </div>
               </div>

               {/* QR Code Section */}
               {qrCode && (
                 <div className="w-full mt-4 bg-white border-2 border-black rounded-xl p-3 flex items-center gap-3 shadow-[3px_3px_0px_black]">
                   <div className="bg-white p-2 rounded-lg border-2 border-black shrink-0">
                     <img src={qrCode} alt="QR Code" className="w-16 h-16" />
                   </div>
                   <div className="text-left">
                     <p className="font-black text-sm flex items-center gap-1">
                       <Download size={14} /> Tải ảnh HD
                     </p>
                     <p className="text-[10px] text-black/60">Quét mã QR để lưu ảnh chất lượng cao</p>
                   </div>
                 </div>
               )}

              {/* Actions */}
              <div className="w-full mt-4 space-y-3">
                 <button 
                   onClick={downloadImage}
                   className="w-full h-14 bg-[#CCFF00] text-black border-[3px] border-black rounded-xl shadow-[5px_5px_0px_black] hover:translate-y-[-2px] active:translate-y-[0] active:shadow-[2px_2px_0px_black] transition-all flex items-center justify-center gap-2 font-black"
                 >
                    <Download className="w-5 h-5" /> LƯU ẢNH
                 </button>
                 
                 <div className="flex gap-3">
                    <button 
                      onClick={shareImage}
                      className="flex-1 h-12 bg-white text-black border-[3px] border-black rounded-xl shadow-[3px_3px_0px_black] hover:bg-gray-50 active:shadow-none transition-all flex items-center justify-center gap-2 font-bold text-xs"
                    >
                       <Share2 className="w-4 h-4" /> SHARE
                    </button>
                    <button 
                      onClick={reset} 
                      className="flex-1 h-12 bg-white text-black border-[3px] border-black rounded-xl shadow-[3px_3px_0px_black] hover:bg-gray-50 active:shadow-none transition-all flex items-center justify-center gap-2 font-bold text-xs"
                    >
                       <RefreshCcw className="w-4 h-4" /> LÀM LẠI
                    </button>
                 </div>
              </div>
            </div>
          )}

          {/* === STEP 4: GALLERY === */}
          {step === 'gallery' && (
            <div className="flex-1 flex flex-col p-6 pt-16 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-black">
                <h3 className="text-xl font-black">THƯ VIỆN ẢNH</h3>
                <button 
                  onClick={() => setStep('landing')} 
                  className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_black] hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              {gallery.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-black/40 space-y-4">
                  <div className="w-20 h-20 border-[3px] border-dashed border-black/30 rounded-2xl flex items-center justify-center">
                    <ImageIcon size={40} strokeWidth={1.5} />
                  </div>
                  <p className="font-bold">Chưa có hình ảnh nào</p>
                  <button 
                    onClick={handleStart}
                    className="px-6 py-3 bg-[#CCFF00] border-2 border-black rounded-xl shadow-[3px_3px_0px_black] font-bold text-sm"
                  >
                    CHỤP NGAY
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4 flex-1 custom-scrollbar">
                  {gallery.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative group aspect-square rounded-xl overflow-hidden border-2 border-black bg-white shadow-[3px_3px_0px_black] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_black] transition-all"
                    >
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
                          className="p-3 bg-[#CCFF00] text-black rounded-full border-2 border-black hover:scale-110 transition-transform"
                        >
                          <Download size={20} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={processImage}
      />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}} />
    </div>
  );
};

export default App;
