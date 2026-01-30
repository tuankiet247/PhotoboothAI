import React from 'react';

const HorseAnimation = ({ size = 'large' }) => {
  const sizeClasses = {
    small: 'w-32 h-32 text-4xl',
    medium: 'w-48 h-48 text-5xl',
    large: 'w-64 h-64 text-6xl'
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} mx-auto rounded-full border-4 border-amber-500 p-2 overflow-hidden bg-red-800 shadow-2xl`}>
        <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300 flex items-center justify-center">
          <span className="animate-float">🐎</span>
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-red-900 px-4 py-1 rounded-full font-bold whitespace-nowrap text-sm md:text-base">
        AI PHOTOBOOTH
      </div>
    </div>
  );
};

export default HorseAnimation;
