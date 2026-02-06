import React, { useMemo } from 'react';

const PetalsFalling = ({ count = 25 }) => {
  // Tạo mảng cánh hoa với các thuộc tính ngẫu nhiên được memo hóa
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 6 + 8, // 8-14s (chậm hơn để giảm tải)
      animationDelay: Math.random() * 8,
      size: Math.random() * 10 + 12, // 12-22px
      opacity: Math.random() * 0.3 + 0.4, // 0.4-0.7
      swayAmount: Math.random() * 40 + 20, // 20-60px sway (giảm)
      rotateStart: Math.random() * 360,
      type: Math.random() > 0.5 ? 1 : 0, // Đơn giản hóa chỉ 2 loại
    }));
  }, [count]);

  return (
    <div className="petals-container fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal absolute"
          style={{
            left: `${petal.left}%`,
            top: '-30px',
            animationDuration: `${petal.animationDuration}s`,
            animationDelay: `${petal.animationDelay}s`,
            opacity: petal.opacity,
            '--sway-amount': `${petal.swayAmount}px`,
            '--rotate-start': `${petal.rotateStart}deg`,
          }}
        >
          {/* SVG Cánh hoa đào - đơn giản hóa */}
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            className="petal-svg"
          >
            {petal.type === 1 ? (
              // Cánh hoa đơn
              <ellipse
                cx="12"
                cy="12"
                rx="6"
                ry="10"
                fill="#fbcfe8"
              />
            ) : (
              // Hoa nhỏ 
              <g fill="#f9a8d4">
                <circle cx="12" cy="8" r="4" opacity="0.9" />
                <circle cx="8" cy="13" r="4" opacity="0.8" />
                <circle cx="16" cy="13" r="4" opacity="0.8" />
                <circle cx="12" cy="12" r="2" fill="#fef08a" />
              </g>
            )}
          </svg>
        </div>
      ))}

      {/* Thêm một số hoa lớn đặc biệt - giảm số lượng */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`special-${i}`}
          className="petal-special absolute"
          style={{
            left: `${25 + i * 25}%`,
            top: '-50px',
            animationDuration: `${14 + i * 2}s`,
            animationDelay: `${i * 4}s`,
            opacity: 0.5,
          }}
        >
          <div className="text-2xl animate-spin-slow">🌸</div>
        </div>
      ))}
    </div>
  );
};

export default PetalsFalling;
