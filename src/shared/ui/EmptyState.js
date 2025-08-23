import React from 'react';
import { Plus, Sparkles, Target, Zap, Globe } from 'lucide-react';

const EmptyState = ({ setCurrentMode }) => {
  const quickStartActions = [
    {
      id: 'ai',
      title: 'Tạo từ vựng bằng AI',
      description: 'Sử dụng AI để tạo danh sách từ theo chủ đề',
      icon: Sparkles,
      gradient: 'from-orange-500 to-red-500',
      action: () => setCurrentMode('ai'),
    },
    {
      id: 'add',
      title: 'Thêm từ vựng thủ công',
      description: 'Tự thêm từ với định nghĩa và ví dụ',
      icon: Plus,
      gradient: 'from-purple-500 to-indigo-500',
      action: () => setCurrentMode('add'),
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse-subtle'></div>
        <div className='absolute top-1/2 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse-subtle'></div>
        <div className='absolute -bottom-40 right-1/4 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse-subtle'></div>
      </div>

      <div className='relative z-10 p-4 flex items-center justify-center min-h-screen'>
        <div className='text-center max-w-2xl animate-fadeInUp'>
          {/* Hero Icon */}
          <div className='relative mb-8'>
            <div className='bg-white/90 backdrop-blur-sm rounded-full p-8 w-32 h-32 mx-auto mb-6 shadow-2xl border border-gray-200/50'>
              <Globe className='w-16 h-16 text-indigo-600 mx-auto animate-pulse-subtle' />
            </div>
            <div className='absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
          </div>

          {/* Welcome Message */}
          <div className='mb-8'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-4 leading-tight'>
              English Vocabulary Master
            </h1>
            <p className='text-xl sm:text-2xl text-gray-600 mb-6 leading-relaxed'>
              Khởi đầu hành trình chinh phục tiếng Anh với AI! 🚀
            </p>
            <p className='text-base sm:text-lg text-gray-500 max-w-lg mx-auto'>
              Ứng dụng học từ vựng thông minh sử dụng công nghệ AI Gemini để tạo
              và quản lý từ vựng hiệu quả
            </p>
          </div>

          {/* Quick Start Actions */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8'>
            {quickStartActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`group bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 text-left animate-fadeInUp`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900'>
                    {action.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed group-hover:text-gray-700'>
                    {action.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className='mt-4 flex justify-end'>
                    <div className='w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1'>
                      <svg
                        className='w-4 h-4 text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Features Preview */}
          <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200/50 mb-8'>
            <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center justify-center'>
              <Target className='w-5 h-5 mr-2 text-indigo-600' />
              Tính năng nổi bật
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
              <div className='flex items-center space-x-2 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl'>
                <Sparkles className='w-4 h-4 text-orange-600' />
                <span className='text-orange-700 font-medium'>
                  AI thông minh
                </span>
              </div>
              <div className='flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl'>
                <Plus className='w-4 h-4 text-purple-600' />
                <span className='text-purple-700 font-medium'>
                  Quản lý dễ dàng
                </span>
              </div>
              <div className='flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl'>
                <Zap className='w-4 h-4 text-blue-600' />
                <span className='text-blue-700 font-medium'>Học hiệu quả</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className='bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-2xl'>
            <div className='flex items-center justify-center mb-3'>
              <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2'>
                <span className='text-xs font-bold'>💡</span>
              </div>
              <h4 className='font-bold text-lg'>Mẹo học hiệu quả</h4>
            </div>
            <p className='text-sm sm:text-base opacity-90 leading-relaxed'>
              Bắt đầu với AI để tạo 10-20 từ vựng theo chủ đề yêu thích, sau đó
              luyện tập hàng ngày. Đánh dấu từ khó để ôn tập thường xuyên!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
