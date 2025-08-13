import React from 'react';
import { BookOpen, Plus, Sparkles } from 'lucide-react';

const EmptyState = ({ setCurrentMode }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center'>
      <div className='text-center max-w-md'>
        <div className='bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-lg'>
          <BookOpen className='w-12 h-12 text-indigo-600 mx-auto' />
        </div>
        <h2 className='text-3xl font-bold text-gray-800 mb-3'>
          Chào mừng đến với English Vocabulary!
        </h2>
        <p className='text-gray-600 mb-8 text-lg'>
          Bắt đầu hành trình học từ vựng tiếng Anh của bạn ngay hôm nay
        </p>

        <div className='space-y-3'>
          <button
            onClick={() => setCurrentMode('add')}
            className='w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center font-medium'
          >
            <Plus className='w-5 h-5 mr-2' />
            Thêm từ vựng đầu tiên
          </button>

          <button
            onClick={() => setCurrentMode('ai')}
            className='w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center font-medium'
          >
            <Sparkles className='w-5 h-5 mr-2' />
            Tạo từ vựng bằng AI
          </button>
        </div>

        <p className='text-sm text-gray-500 mt-6'>
          💡 Mẹo: Bạn có thể sử dụng AI để tạo danh sách từ vựng theo chủ đề yêu
          thích
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
