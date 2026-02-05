import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCw, Video, ArrowRight, SwitchCamera, AlertCircle } from 'lucide-react';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const countdownRef = useRef(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // Danh sách camera và camera được chọn
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showCameraList, setShowCameraList] = useState(false);
  
  // Countdown state
  const [countdown, setCountdown] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  
  // Flash effect
  const [flash, setFlash] = useState(false);

  // Load danh sách camera khi mở modal
  useEffect(() => {
    if (isOpen) {
      loadCameras();
    } else {
      stopCamera();
      // Clear countdown khi đóng modal
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setCountdown(null);
      setIsCountingDown(false);
    }

    return () => {
      stopCamera();
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isOpen]);

  // Start camera khi chọn camera mới
  useEffect(() => {
    if (isOpen && selectedCamera) {
      startCamera();
    }
  }, [selectedCamera]);

  // Load danh sách camera
  const loadCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setCameras(videoDevices);
      
      // Tự động chọn camera đầu tiên nếu chưa có camera nào được chọn
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error loading cameras:', err);
      setError('Không thể tải danh sách camera.');
    }
  };

  const startCamera = async () => {
    setError(null);
    setIsReady(false);

    try {
      // Dừng camera cũ nếu đang chạy
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Cấu hình camera
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      // Nếu đã chọn camera cụ thể, dùng deviceId
      if (selectedCamera) {
        constraints.video.deviceId = { exact: selectedCamera };
      }

      // Mở camera
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Bạn cần cho phép truy cập camera để sử dụng tính năng này.');
      } else if (err.name === 'NotFoundError') {
        setError('Không tìm thấy camera trên thiết bị của bạn.');
      } else {
        setError('Không thể mở camera. Vui lòng thử lại.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  };

  // Bắt đầu đếm ngược 5 giây
  const startCountdown = () => {
    if (!isReady || isCountingDown) return;
    
    setIsCountingDown(true);
    setCountdown(5);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Dừng countdown và chụp ảnh
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          setIsCountingDown(false);
          // Flash effect và chụp ảnh
          setFlash(true);
          setTimeout(() => {
            setFlash(false);
            capturePhoto();
          }, 150);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Hủy đếm ngược
  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
    setIsCountingDown(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size bằng video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Vẽ video frame lên canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Chuyển canvas thành blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Tạo file từ blob
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        onClose();
      }
    }, 'image/jpeg', 0.95);
  };

  const handleCameraChange = (deviceId) => {
    setSelectedCamera(deviceId);
    setShowCameraList(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#F0F0F0] flex flex-col items-center justify-center p-4">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* Main Camera Card */}
      <div className="w-full max-w-[400px] bg-white border-[3px] border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10 min-h-[85vh] flex flex-col">
        
        {/* Flash Effect */}
        {flash && <div className="absolute inset-0 bg-white z-[100] animate-flash pointer-events-none"></div>}
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b-[3px] border-black relative z-20">
          <button
            onClick={onClose}
            className="w-12 h-12 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-200 shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          
          <div className="bg-[#CCFF00] border-2 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_black]">
            <span className="text-sm font-black uppercase tracking-wider">CHỤP ẢNH</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowCameraList(!showCameraList)}
              className="w-12 h-12 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-200 shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
              title="Chọn camera"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>
            
            {/* Dropdown chọn camera */}
            {showCameraList && cameras.length > 1 && (
              <div className="absolute top-full right-0 mt-2 bg-white border-2 border-black rounded-xl overflow-hidden min-w-[250px] shadow-[4px_4px_0px_black] z-50">
                {cameras.map((camera, index) => (
                  <button
                    key={camera.deviceId}
                    onClick={() => handleCameraChange(camera.deviceId)}
                    className={`w-full text-left px-4 py-3 hover:bg-[#CCFF00] transition-colors border-b-2 border-black last:border-b-0 ${
                      selectedCamera === camera.deviceId ? 'bg-[#CCFF00]' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Video size={16} />
                      <span className="text-sm font-bold">
                        {camera.label || `Camera ${index + 1}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative flex items-center justify-center bg-gray-100 overflow-hidden">
          {error ? (
            <div className="text-center p-6 space-y-4">
              <div className="w-20 h-20 mx-auto bg-red-100 border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_black]">
                <AlertCircle size={40} className="text-red-600" />
              </div>
              <p className="font-bold text-lg">{error}</p>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-[#CCFF00] border-2 border-black rounded-xl font-bold shadow-[3px_3px_0px_black] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              />
              
              {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#CCFF00] border-t-black rounded-full animate-spin mx-auto"></div>
                    <p className="font-bold">Đang mở camera...</p>
                  </div>
                </div>
              )}
              
              {/* Camera Frame Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[65%] h-[50%] border-[4px] border-[#CCFF00] rounded-[30%] border-dashed opacity-80"></div>
                <div className="absolute top-6 left-6 bg-[#FF0000] text-white px-2 py-1 border-2 border-black rounded font-mono text-[10px] font-bold animate-pulse flex items-center gap-1 shadow-[2px_2px_0px_black]">
                  <div className="w-2 h-2 bg-white rounded-full"></div> REC
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-[4px] border-r-[4px] border-[#CCFF00]"></div>
                <div className="absolute bottom-28 left-4 w-8 h-8 border-b-[4px] border-l-[4px] border-[#CCFF00]"></div>
              </div>
              
              {/* Countdown Display */}
              {isCountingDown && countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-white/30 backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full border-[6px] border-black flex items-center justify-center bg-white shadow-[6px_6px_0px_black]">
                      <span className="text-[100px] font-black text-[#FF00FF] italic" style={{ WebkitTextStroke: '2px black' }}>
                        {countdown}
                      </span>
                    </div>
                    <div 
                      key={countdown}
                      className="absolute inset-0 rounded-full bg-[#CCFF00]/30 animate-ping"
                    />
                  </div>
                </div>
              )}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Controls */}
        <div className="h-32 bg-white border-t-[3px] border-black flex items-center justify-center px-8 pb-4 relative z-30">
          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={onClose} 
              className="w-14 h-14 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-200 shadow-[3px_3px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            {isCountingDown ? (
              /* Nút hủy khi đang đếm ngược */
              <button
                onClick={cancelCountdown}
                className="w-24 h-24 bg-[#FF0000] border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
                aria-label="Hủy đếm ngược"
              >
                <X size={40} className="text-white" strokeWidth={3} />
              </button>
            ) : (
              /* Nút chụp */
              <button
                onClick={startCountdown}
                disabled={!isReady}
                className="w-24 h-24 bg-[#FF00FF] border-[4px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_black] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 hover:bg-[#ff33ff]"
                aria-label="Chụp ảnh"
              >
                <div className="w-20 h-20 bg-white border-2 border-black rounded-full"></div>
              </button>
            )}
            
            <button 
              onClick={() => cameras.length > 1 && setShowCameraList(!showCameraList)}
              className="w-14 h-14 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-200 shadow-[3px_3px_0px_black] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Status Text */}
        <div className="absolute bottom-36 left-0 right-0 text-center pointer-events-none">
          <div className="inline-block bg-white border-2 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_black]">
            <p className="text-sm font-bold">
              {!isReady 
                ? 'Đang mở camera...' 
                : isCountingDown 
                  ? `Chuẩn bị... ${countdown}s` 
                  : 'Nhấn nút để chụp'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flash {
           0% { opacity: 1; }
           100% { opacity: 0; }
        }
        .animate-flash {
           animation: flash 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default CameraModal;
