import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-4 p-4 bg-red-800/80 backdrop-blur-sm border-2 border-red-600 rounded-xl text-amber-100 text-sm flex items-start gap-3 animate-in slide-in-from-top shadow-lg">
      <AlertCircle className="flex-shrink-0 mt-0.5 text-red-400" size={20} />
      <p className="flex-grow">{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-amber-200 hover:text-amber-100 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
