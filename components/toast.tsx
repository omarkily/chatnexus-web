"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center';
  onClose?: () => void;
}

// Toast container for positioning
const getPositionClasses = (position: ToastProps['position']) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'center':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    case 'top-right':
    default:
      return 'top-4 right-4';
  }
};

// Toast component for individual toast
const Toast: React.FC<ToastProps & { index?: number }> = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  position = 'center',
  index = 0,
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Configure colors based on toast type
  const getTypeClasses = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/30 shadow-sm shadow-blue-500/10';
      case 'warning':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30 shadow-sm shadow-amber-500/10';
      case 'error':
        return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800/30 shadow-sm shadow-red-500/10';
      case 'success':
      default:
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30 shadow-sm shadow-emerald-500/10';
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (type) {
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      case 'success':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
    }
  };

  // Calculate offset for stacked toasts
  const getStackedPosition = () => {
    if (position === 'center') {
      // If centered, move toasts upward based on index
      return `${index * 10}vh`;
    }
    
    // For top positions, move downward based on index
    if (position.startsWith('top')) {
      return `calc(${index * 3.1}rem + 1rem)`;
    }
    
    // For bottom positions, move upward based on index (negative margin)
    return `calc(-${index * 5}rem - 1rem)`;
  };

  return (
    <motion.div
      className={`fixed z-[60] ${getPositionClasses(position)}`}
      initial={{ opacity: 0, y: position?.includes('top') ? -20 : 20, scale: 0.95 }}
      animate={{ 
        opacity: visible ? 1 : 0, 
        y: visible ? 0 : (position?.includes('top') ? -20 : 20), 
        scale: visible ? 1 : 0.95 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 240, 
        damping: 20,
        mass: 1,
        duration: 0.3 
      }}
      style={{
        marginTop: position.startsWith('top') ? getStackedPosition() : undefined,
        marginBottom: position.startsWith('bottom') ? getStackedPosition() : undefined,
        transform: position === 'center' ? `translateY(-${getStackedPosition()})` : undefined,
      }}
    >
      <div className={`flex items-center gap-3 min-w-[300px] max-w-md p-3 rounded-lg shadow-lg ${getTypeClasses()} border`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 text-sm">{message}</div>
        <button 
          className="ml-auto flex-shrink-0 text-current opacity-70 hover:opacity-100"
          onClick={() => setVisible(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

// Toast container to manage multiple toasts
export interface ToastContainerProps {
  position?: ToastProps['position'];
}

export interface ToastOptions extends Omit<ToastProps, 'message' | 'onClose'> {}

// Create a global toast state
type ToastItem = ToastProps & { id: string };
let toasts: ToastItem[] = [];
let listeners: Function[] = [];

// Helper functions to manage toast state
const notify = (message: string, options?: ToastOptions) => {
  const id = Math.random().toString(36).substring(2, 9);
  const toast: ToastItem = {
    id,
    message,
    ...options,
  };
  
  toasts = [...toasts, toast];
  listeners.forEach(listener => listener(toasts));
  
  return id;
};

const remove = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener(toasts));
};

// Helper functions for different toast types
export const toast = {
  success: (message: string, options?: ToastOptions) => notify(message, { 
    ...options, 
    type: 'success', 
    duration: options?.duration || 4000 
  }),
  info: (message: string, options?: ToastOptions) => notify(message, { 
    ...options, 
    type: 'info', 
    duration: options?.duration || 3500 
  }),
  warning: (message: string, options?: ToastOptions) => notify(message, { 
    ...options, 
    type: 'warning', 
    duration: options?.duration || 4000 
  }),
  error: (message: string, options?: ToastOptions) => notify(message, { 
    ...options, 
    type: 'error', 
    duration: options?.duration || 4500 
  }),
};

// Toast container component
export const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'center' }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastsChange = (newToasts: ToastItem[]) => {
      setItems([...newToasts]);
    };
    
    listeners.push(handleToastsChange);
    
    return () => {
      listeners = listeners.filter(listener => listener !== handleToastsChange);
    };
  }, []);

  return (
    <div aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {items.map((toast, index) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position={position}
            index={items.length - index - 1} // Reverse index so newest toast gets index 0
            onClose={() => remove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}; 