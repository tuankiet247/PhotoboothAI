import React, { useState, useEffect } from 'react';

const Fireworks = ({ show = true, intensity = 'medium' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) return;

    const particleCount = intensity === 'high' ? 15 : intensity === 'medium' ? 8 : 5;
    
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 60 + 10,
        color: ['#fbbf24', '#f59e0b', '#fcd34d', '#fb923c', '#f87171', '#fda4af'][Math.floor(Math.random() * 6)],
        size: Math.random() * 3 + 2,
        duration: Math.random() * 1.5 + 1,
      };
      
      setParticles(prev => [...prev.slice(-20), newParticle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    }, 800);

    return () => clearInterval(interval);
  }, [show, intensity]);

  if (!show) return null;

  return (
    <div className="fireworks-container fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="firework-particle absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            animation: `fireworkExplosion ${particle.duration}s ease-out forwards`,
            '--final-x': `${(Math.random() - 0.5) * 200}px`,
            '--final-y': `${(Math.random() - 0.5) * 200}px`,
          }}
        />
      ))}
      
      {/* Sparkle effects - giảm số lượng */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `sparkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
            willChange: 'transform, opacity',
          }}
        >
          <span className="text-xl">✨</span>
        </div>
      ))}
    </div>
  );
};

export default Fireworks;
