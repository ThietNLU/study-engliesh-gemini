import React from 'react';
import { Heart, Sparkles, Database, Globe, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='mt-12 sm:mt-16'>
      {/* Main footer */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 text-center'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-center justify-center mb-4'>
            <Globe className='w-8 h-8 text-indigo-600 mr-3' />
            <h3 className='text-xl sm:text-2xl font-bold gradient-text'>
              English Vocabulary Master
            </h3>
          </div>

          <p className='text-gray-600 text-base sm:text-lg mb-6 leading-relaxed'>
            Học tiếng Anh thông minh với AI - Nâng cao vốn từ vựng mỗi ngày!
            🇬🇧🇺🇸
          </p>

          {/* Features highlights */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
            <div className='flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100'>
              <Sparkles className='w-5 h-5 text-orange-600' />
              <span className='text-sm font-semibold text-orange-700'>
                AI Gemini
              </span>
            </div>

            <div className='flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100'>
              <Database className='w-5 h-5 text-blue-600' />
              <span className='text-sm font-semibold text-blue-700'>
                Firebase
              </span>
            </div>

            <div className='flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100'>
              <Heart className='w-5 h-5 text-green-600' />
              <span className='text-sm font-semibold text-green-700'>
                Open Source
              </span>
            </div>
          </div>

          {/* Links and info */}
          <div className='flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200'>
            <div className='flex items-center space-x-4 mb-4 sm:mb-0'>
              <button
                className='flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors'
                onClick={() =>
                  window.open(
                    'https://github.com/ThietNLU/study-engliesh-gemini',
                    '_blank'
                  )
                }
              >
                <Github className='w-4 h-4' />
                <span className='text-sm font-medium'>GitHub</span>
              </button>

              <div className='w-1 h-4 bg-gray-300 rounded-full'></div>

              <div className='text-sm text-gray-500'>
                Made with <Heart className='w-3 h-3 text-red-500 inline mx-1' />{' '}
                in Vietnam
              </div>
            </div>

            <div className='text-sm text-gray-500'>
              © {currentYear} English Vocabulary Master
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className='h-6 sm:h-8'></div>
    </div>
  );
};

export default Footer;
