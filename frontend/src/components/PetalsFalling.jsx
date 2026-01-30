import React from 'react';

const PetalsFalling = ({ count = 15 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce opacity-70 pointer-events-none"
          style={{
            top: `-20px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 15}px`,
          }}
        >
          {Math.random() > 0.5 ? '🌸' : '🌺'}
        </div>
      ))}
    </>
  );
};

export default PetalsFalling;
