import React from 'react';
import { Home, Plus, Settings, Sparkles, Book } from 'lucide-react';

const ModeSelector = ({ currentMode, setCurrentMode }) => {
  const modes = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      action: () => setCurrentMode('home'),
    },
    {
      id: 'ai',
      label: 'AI Tạo từ',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
      action: () => setCurrentMode('ai'),
    },
    {
      id: 'dictionary',
      label: 'Từ điển',
      icon: Book,
      color: 'from-emerald-500 to-teal-600',
      action: () => setCurrentMode('dictionary'),
    },
    {
      id: 'manage',
      label: 'Quản lý',
      icon: Settings,
      color: 'from-slate-500 to-gray-600',
      action: () => setCurrentMode('manage'),
    },
    {
      id: 'add',
      label: 'Thêm từ',
      icon: Plus,
      color: 'from-purple-500 to-indigo-600',
      action: () => setCurrentMode('add'),
    },
  ];

  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mb-4 sm:mb-6 p-4 sm:p-6 border border-gray-200/50 animate-fadeInUp'>
      <div className='flex justify-center'>
        <div className='flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4'>
          {modes.map(({ id, label, icon: Icon, color, action }) => (
            <button
              key={id}
              onClick={action}
              className={`group relative px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base overflow-hidden ${
                currentMode === id
                  ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-105 shadow-colored`
                  : 'bg-gray-50/80 text-gray-700 hover:bg-white hover:shadow-lg hover:scale-102 hover:text-gray-900 border border-gray-200/50'
              }`}
            >
              {/* Background glow effect for active mode */}
              {currentMode === id && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${color} opacity-20 blur-xl rounded-xl`}
                ></div>
              )}

              {/* Icon with animation */}
              <div
                className={`relative ${currentMode === id ? 'animate-pulse-subtle' : 'group-hover:scale-110 transition-transform'}`}
              >
                <Icon className='w-4 h-4 sm:w-5 sm:h-5' />
              </div>

              {/* Label */}
              <span className='relative hidden sm:inline font-medium'>
                {label}
              </span>
              <span className='relative sm:hidden text-xs font-medium'>
                {label.split(' ')[0]}
              </span>

              {/* Hover effect */}
              {currentMode !== id && (
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl'></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mode indicator line */}
      <div className='mt-4 flex justify-center'>
        <div className='flex space-x-1'>
          {modes.map(({ id, color }) => (
            <div
              key={`indicator-${id}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentMode === id
                  ? `w-8 bg-gradient-to-r ${color}`
                  : 'w-2 bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
