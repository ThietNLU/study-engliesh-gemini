import React, { useEffect, useState, useCallback } from 'react';
import { useUIStore } from '../stores';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Sparkles,
} from 'lucide-react';

const NotificationToast = () => {
  const { notification, hideNotification } = useUIStore();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (notification.show) {
      setIsLeaving(false);
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.show, notification.duration, handleClose]);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      hideNotification();
      setIsLeaving(false);
    }, 300);
  }, [hideNotification]);

  if (!notification.show) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className='w-6 h-6 text-green-600' />;
      case 'error':
        return <XCircle className='w-6 h-6 text-red-600' />;
      case 'warning':
        return <AlertTriangle className='w-6 h-6 text-yellow-600' />;
      default:
        return <Info className='w-6 h-6 text-blue-600' />;
    }
  };

  const getThemeClasses = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-200',
          accent: 'bg-green-500',
          glow: 'shadow-green-500/25',
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-200',
          accent: 'bg-red-500',
          glow: 'shadow-red-500/25',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          accent: 'bg-yellow-500',
          glow: 'shadow-yellow-500/25',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          accent: 'bg-blue-500',
          glow: 'shadow-blue-500/25',
        };
    }
  };

  const theme = getThemeClasses();
  const animationClass = isLeaving
    ? 'transform translate-x-full opacity-0'
    : 'animate-slideIn';

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${animationClass}`}
    >
      <div
        className={`${theme.bg} ${theme.border} border backdrop-blur-sm rounded-2xl shadow-2xl ${theme.glow} p-5 max-w-sm relative overflow-hidden`}
      >
        {/* Decorative accent line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${theme.accent}`}
        ></div>

        {/* Sparkle effect for success */}
        {notification.type === 'success' && (
          <div className='absolute top-2 right-2'>
            <Sparkles className='w-4 h-4 text-green-500 animate-bounce' />
          </div>
        )}

        <div className='flex items-start'>
          <div className='flex-shrink-0 p-1'>{getIcon()}</div>
          <div className='ml-4 flex-1 min-w-0'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-gray-900 mb-1 capitalize'>
                  {notification.type === 'success'
                    ? 'Thành công!'
                    : notification.type === 'error'
                      ? 'Lỗi!'
                      : notification.type === 'warning'
                        ? 'Cảnh báo!'
                        : 'Thông báo!'}
                </p>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={handleClose}
                className='ml-3 inline-flex text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/50'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className='mt-3 w-full bg-gray-200/50 rounded-full h-1 overflow-hidden'>
          <div
            className={`h-1 ${theme.accent} rounded-full transition-all ease-linear animate-shrink-width`}
            style={{
              animationDuration: `${notification.duration}ms`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
