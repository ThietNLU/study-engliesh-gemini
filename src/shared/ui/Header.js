import React from 'react';
import { Globe } from 'lucide-react';

const Header = ({ accent, setAccent }) => {
  return (
    <div className='bg-white rounded-2xl shadow-lg mb-4 sm:mb-6 p-4 sm:p-6 border border-gray-100'>
      <div className='flex flex-col sm:flex-row justify-between items-center'>
        <div className='text-center sm:text-left mb-4 sm:mb-0'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-1 flex items-center justify-center sm:justify-start'>
            <Globe className='w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-600' />
            <span className='hidden sm:inline'>English Vocabulary</span>
            <span className='sm:hidden'>Vocabulary</span>
          </h1>
          <p className='text-sm sm:text-base text-gray-600'>
            Ứng dụng học từ vựng tiếng Anh thông minh
          </p>
        </div>

        {/* Accent Selector */}
        <div className='flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-xl p-2 sm:p-3'>
          <span className='text-xs sm:text-sm text-gray-600 font-medium'>
            Giọng:
          </span>
          <div className='flex space-x-1 sm:space-x-2'>
            <button
              onClick={() => setAccent('us')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center ${
                accent === 'us'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🇺🇸 <span className='hidden sm:inline ml-1'>US</span>
            </button>
            <button
              onClick={() => setAccent('uk')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center ${
                accent === 'uk'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🇬🇧 <span className='hidden sm:inline ml-1'>UK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
