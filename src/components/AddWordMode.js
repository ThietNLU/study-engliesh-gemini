import React from 'react';
import { Save } from 'lucide-react';
import { categories } from '../data/initialVocabulary';

const AddWordMode = ({ newWord, setNewWord, addNewWord }) => {
  return (
    <div className='bg-white rounded-xl shadow-xl p-8 mb-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Thêm từ vựng mới
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Từ tiếng Anh *
          </label>
          <input
            type='text'
            value={newWord.english}
            onChange={e => setNewWord({ ...newWord, english: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Nhập từ tiếng Anh'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Nghĩa tiếng Việt *
          </label>
          <input
            type='text'
            value={newWord.vietnamese}
            onChange={e =>
              setNewWord({ ...newWord, vietnamese: e.target.value })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Nhập nghĩa tiếng Việt'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Phát âm Mỹ (US)
          </label>
          <input
            type='text'
            value={newWord.pronunciation_us}
            onChange={e =>
              setNewWord({ ...newWord, pronunciation_us: e.target.value })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Ví dụ: həˈloʊ'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Phát âm Anh (UK)
          </label>
          <input
            type='text'
            value={newWord.pronunciation_uk}
            onChange={e =>
              setNewWord({ ...newWord, pronunciation_uk: e.target.value })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Ví dụ: həˈləʊ'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Danh mục từ loại
          </label>
          <select
            value={newWord.category}
            onChange={e => setNewWord({ ...newWord, category: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            <option value=''>Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name} - {cat.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Mức độ CEFR
          </label>
          <select
            value={newWord.level}
            onChange={e => setNewWord({ ...newWord, level: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            <option value='A1'>A1 - Khởi đầu</option>
            <option value='A2'>A2 - Cơ bản</option>
            <option value='B1'>B1 - Trung cấp thấp</option>
            <option value='B2'>B2 - Trung cấp cao</option>
            <option value='C1'>C1 - Cao cấp</option>
            <option value='C2'>C2 - Thành thạo</option>
          </select>
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Định nghĩa (tiếng Anh)
          </label>
          <textarea
            value={newWord.definition}
            onChange={e =>
              setNewWord({ ...newWord, definition: e.target.value })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            rows={3}
            placeholder='Nhập định nghĩa bằng tiếng Anh'
          />
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Ví dụ
          </label>
          <textarea
            value={newWord.example}
            onChange={e => setNewWord({ ...newWord, example: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            rows={2}
            placeholder='Nhập câu ví dụ sử dụng từ này'
          />
        </div>
      </div>

      <div className='flex justify-center mt-6'>
        <button
          onClick={addNewWord}
          className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all flex items-center'
        >
          <Save className='w-4 h-4 mr-2' />
          Lưu từ mới
        </button>
      </div>
    </div>
  );
};

export default AddWordMode;
