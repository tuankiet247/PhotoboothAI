import React, { useMemo } from 'react';

const PetalsFalling = ({ count = 50 }) => {
  // Tạo mảng cánh hoa với các thuộc tính ngẫu nhiên được memo hóa
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 8 + 6, // 6-14s
      animationDelay: Math.random() * 10,
      size: Math.random() * 12 + 10, // 10-22px
      opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7
      swayAmount: Math.random() * 60 + 30, // 30-90px sway
      rotateStart: Math.random() * 360,
      type: Math.random(), // Để chọn loại hoa
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
          {/* SVG Cánh hoa đào */}
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            className="petal-svg"
            style={{
              filter: `drop-shadow(0 2px 4px rgba(255, 182, 193, 0.5))`,
            }}
          >
            {petal.type > 0.7 ? (
              // Hoa 5 cánh
              <g fill="currentColor" className="text-pink-300">
                <ellipse cx="12" cy="5" rx="3" ry="5" transform="rotate(0 12 12)" />
                <ellipse cx="12" cy="5" rx="3" ry="5" transform="rotate(72 12 12)" />
                <ellipse cx="12" cy="5" rx="3" ry="5" transform="rotate(144 12 12)" />
                <ellipse cx="12" cy="5" rx="3" ry="5" transform="rotate(216 12 12)" />
                <ellipse cx="12" cy="5" rx="3" ry="5" transform="rotate(288 12 12)" />
                <circle cx="12" cy="12" r="2.5" className="text-yellow-300" fill="currentColor" />
              </g>
            ) : petal.type > 0.4 ? (
              // Cánh hoa đơn
              <ellipse
                cx="12"
                cy="12"
                rx="6"
                ry="10"
                fill="url(#petalGradient)"
                className="text-pink-200"
              />
            ) : (
              // Hoa nhỏ
              <g fill="currentColor" className="text-pink-400">
                <circle cx="12" cy="8" r="4" opacity="0.9" />
                <circle cx="8" cy="13" r="4" opacity="0.8" />
                <circle cx="16" cy="13" r="4" opacity="0.8" />
                <circle cx="12" cy="12" r="2" className="text-yellow-200" fill="currentColor" />
              </g>
            )}
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fce7f3" />
                <stop offset="50%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f9a8d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Thêm một số hoa lớn đặc biệt */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`special-${i}`}
          className="petal-special absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: '-50px',
            animationDuration: `${12 + i * 2}s`,
            animationDelay: `${i * 3}s`,
            opacity: 0.6,
          }}
        >
          <div className="text-3xl animate-spin-slow">🌸</div>
        </div>
      ))}
    </div>
  );
};

export default PetalsFalling;
