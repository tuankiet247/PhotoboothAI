// Application constants

export const APP_CONFIG = {
  APP_NAME: 'AI Photobooth - Thiên Mã Nghinh Xuân',
  VERSION: '1.0.0',
  YEAR: '2026',
};

export const STEPS = {
  HOME: 'home',
  CAPTURE: 'capture',
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  RESULT: 'result',
  GALLERY: 'gallery',
};

export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  COMPRESSION_QUALITY: 0.85,
  MAX_DIMENSION: 1920,
};

export const CAMERA_CONFIG = {
  FACING_MODE: 'user',
  ASPECT_RATIO: 1,
};

export const ANIMATION_CONFIG = {
  PETALS_COUNT: 15,
  PROCESSING_DURATION: 3000,
  TRANSITION_DURATION: 500,
};

export const MESSAGES = {
  LOADING: {
    DEFAULT: 'AI Đang Hóa Mã...',
    SUBMESSAGE: 'Vui lòng đợi trong giây lát để Thiên Mã xuất hiện',
  },
  ERROR: {
    CAMERA_PERMISSION: 'Vui lòng cho phép truy cập camera để sử dụng Photobooth.',
    INVALID_FILE: 'Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WebP)',
    FILE_TOO_LARGE: 'File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 10MB',
    UPLOAD_FAILED: 'Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.',
    PROCESSING_FAILED: 'Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.',
    NETWORK_ERROR: 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.',
  },
  SUCCESS: {
    COPIED: 'Đã copy vào clipboard!',
    DOWNLOADED: 'Ảnh đã được tải về!',
  },
  INFO: {
    SCAN_QR: '📱 Quét mã QR để tải ảnh về điện thoại',
    NO_IMAGES: 'Chưa có hình ảnh nào',
    DESCRIPTION: '* Hình ảnh sẽ được AI xử lý sang phong cách tranh thủy mặc Thiên Mã độc bản.',
  },
};

export const THEME = {
  COLORS: {
    PRIMARY: 'amber-500',
    SECONDARY: 'red-900',
    ACCENT: 'amber-400',
    TEXT: 'amber-50',
  },
};

export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  DOWNLOAD: '/api/download',
  GALLERY: '/api/gallery',
  PROCESSED_IMAGE: '/api/image',
  QR_CODE: '/api/image',
};

export const LOCAL_STORAGE_KEYS = {
  GALLERY: 'photobooth_gallery',
  SETTINGS: 'photobooth_settings',
};
