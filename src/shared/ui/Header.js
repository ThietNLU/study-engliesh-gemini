import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mb-4 sm:mb-6 p-4 sm:p-6 border border-gray-200/50 animate-fadeInUp'>
      <div className='flex flex-col sm:flex-row justify-between items-center'>
        <div className='text-center sm:text-left mb-4 sm:mb-0'>
          <div className='flex items-center justify-center sm:justify-start mb-2'>
            <div className='relative'>
              <Globe className='w-8 h-8 sm:w-10 sm:h-10 mr-3 text-indigo-600 animate-pulse-subtle' />
              <Sparkles className='w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-bounce' />
            </div>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold gradient-text'>
                <span className='hidden sm:inline'>
                  English Vocabulary Master
                </span>
                <span className='sm:hidden'>Vocab Master</span>
              </h1>
            </div>
          </div>
          <p className='text-sm sm:text-base text-gray-600 font-medium'>
            ✨ Học từ vựng thông minh với AI Gemini + Firebase
          </p>
        </div>

        <div className='flex items-center space-x-2 sm:space-x-3'>
          <div className='flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2'></div>
            <span className='text-xs sm:text-sm font-medium text-indigo-700'>
              Hoạt động
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
