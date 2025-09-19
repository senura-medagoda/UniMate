import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 2000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ 
      addToast, 
      removeToast, 
      success, 
      error, 
      info, 
      warning 
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          containerClass: 'bg-green-50 border-green-200 text-green-800',
          iconClass: 'bg-green-100 text-green-600',
          icon: '✓'
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 border-red-200 text-red-800',
          iconClass: 'bg-red-100 text-red-600',
          icon: '✕'
        };
      case 'warning':
        return {
          containerClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          iconClass: 'bg-yellow-100 text-yellow-600',
          icon: '⚠'
        };
      default:
        return {
          containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
          iconClass: 'bg-blue-100 text-blue-600',
          icon: 'ℹ'
        };
    }
  };

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match the animation duration
  };

  const styles = getToastStyles(toast.type);

  return (
    <div
      className={`
        ${styles.containerClass} border rounded-lg shadow-lg p-4 min-w-80 max-w-96
        transform transition-all duration-300 ease-in-out hover:shadow-xl
        ${isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
        }
        animate-in slide-in-from-right-5 fade-in
      `}
      role="alert"
      style={{
        animation: isVisible && !isExiting 
          ? 'toastSlideIn 0.3s ease-out forwards' 
          : isExiting 
            ? 'toastSlideOut 0.3s ease-in forwards' 
            : 'none'
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`${styles.iconClass} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0`}>
          {styles.icon}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {toast.message}
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes toastSlideIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes toastSlideOut {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};


