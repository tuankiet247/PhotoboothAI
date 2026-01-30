import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCw, Video } from 'lucide-react';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // Danh sách camera và camera được chọn
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showCameraList, setShowCameraList] = useState(false);

  // Load danh sách camera khi mở modal
  useEffect(() => {
    if (isOpen) {
      loadCameras();
    } else {
      stopCamera();
    }

    return () => stopCamera();
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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="text-white font-bold text-lg">Chụp ảnh</h3>
        <div className="relative">
          <button
            onClick={() => setShowCameraList(!showCameraList)}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Chọn camera"
          >
            <Video size={24} />
          </button>
          
          {/* Dropdown chọn camera */}
          {showCameraList && cameras.length > 1 && (
            <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden min-w-[250px] shadow-xl">
              {cameras.map((camera, index) => (
                <button
                  key={camera.deviceId}
                  onClick={() => handleCameraChange(camera.deviceId)}
                  className={`w-full text-left px-4 py-3 text-white hover:bg-amber-500/20 transition-colors border-b border-white/10 last:border-b-0 ${
                    selectedCamera === camera.deviceId ? 'bg-amber-500/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Video size={16} />
                    <span className="text-sm">
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
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {error ? (
          <div className="text-center p-6">
            <div className="text-red-400 mb-4">
              <X size={64} className="mx-auto" />
            </div>
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-amber-500 text-red-950 rounded-lg font-bold hover:bg-amber-400 transition-colors"
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
              className={`max-w-full max-h-full ${isReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            />
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                  <p>Đang mở camera...</p>
                </div>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
        <div className="flex items-center justify-center gap-8">
          {/* Nút chụp - ĐƯỢC LÀM NỔI BẬT HƠN */}
          <button
            onClick={capturePhoto}
            disabled={!isReady}
            className="relative w-20 h-20 rounded-full bg-white border-[6px] border-amber-500 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-amber-500/50"
            aria-label="Chụp ảnh"
          >
            <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center">
              <Camera size={36} className="text-red-950" strokeWidth={2.5} />
            </div>
          </button>
        </div>
        <p className="text-center text-white/80 text-base font-semibold mt-4">
          {isReady ? 'Nhấn nút tròn để chụp' : 'Đang mở camera...'}
        </p>
      </div>
    </div>
  );
};

export default CameraModal;
