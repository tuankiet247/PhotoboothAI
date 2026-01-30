import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ message = 'Đang xử lý...', submessage = null }) => {
  return (
    <div className="text-center space-y-8">
      <div className="relative w-64 h-64 mx-auto">
        {/* Rotating border */}
        <div className="absolute inset-0 border-4 border-amber-500 rounded-3xl animate-spin [animation-duration:3s]"></div>
        
        {/* Inner container */}
        <div className="absolute inset-4 overflow-hidden rounded-2xl bg-red-800 flex items-center justify-center">
          {/* Sparkles icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={48} className="text-amber-400 animate-bounce" />
          </div>
          
          {/* Animated horse emoji */}
          <div className="absolute bottom-4 text-4xl animate-float">
            🐎
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-amber-400 animate-pulse">
          {message}
        </h3>
        {submessage && (
          <p className="text-amber-200/70">{submessage}</p>
        )}
        
        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
