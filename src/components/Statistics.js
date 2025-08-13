import React from 'react';
import { getCategories } from '../utils/helpers';
// import { categories } from '../data/initialVocabulary';

const Statistics = ({ vocabulary, favorites }) => {
  const categories = getCategories(vocabulary);

  // CEFR level mapping
  const _getLevelCount = levels => {
    return vocabulary.filter(w => levels.includes(w.level)).length;
  };

  // Map old levels to CEFR levels for backward compatibility
  const mapToCurrentLevel = word => {
    if (word.level === 'beginner') return 'A1-A2';
    if (word.level === 'intermediate') return 'B1-B2';
    if (word.level === 'advanced') return 'C1-C2';
    return word.level;
  };

  const a1Count = vocabulary.filter(
    w => w.level === 'A1' || w.level === 'beginner'
  ).length;
  const a2Count = vocabulary.filter(w => w.level === 'A2').length;
  const b1Count = vocabulary.filter(w => w.level === 'B1').length;
  const b2Count = vocabulary.filter(
    w => w.level === 'B2' || w.level === 'intermediate'
  ).length;
  const c1Count = vocabulary.filter(w => w.level === 'C1').length;
  const c2Count = vocabulary.filter(
    w => w.level === 'C2' || w.level === 'advanced'
  ).length;

  return (
    <div className='bg-white rounded-xl shadow-xl p-6'>
      <h3 className='text-xl font-bold text-gray-800 mb-4'>
        Thống kê từ vựng theo CEFR
      </h3>

      {/* General stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        <div className='text-center p-4 bg-blue-50 rounded-lg'>
          <div className='text-2xl font-bold text-blue-600'>
            {vocabulary.length}
          </div>
          <div className='text-sm text-blue-800'>Tổng số từ</div>
        </div>
        <div className='text-center p-4 bg-yellow-50 rounded-lg'>
          <div className='text-2xl font-bold text-yellow-600'>
            {favorites.size}
          </div>
          <div className='text-sm text-yellow-800'>Từ yêu thích</div>
        </div>
        <div className='text-center p-4 bg-indigo-50 rounded-lg'>
          <div className='text-2xl font-bold text-indigo-600'>
            {categories.length}
          </div>
          <div className='text-sm text-indigo-800'>Danh mục</div>
        </div>
        <div className='text-center p-4 bg-emerald-50 rounded-lg'>
          <div className='text-2xl font-bold text-emerald-600'>
            {Math.round((vocabulary.length / 1000) * 100)}%
          </div>
          <div className='text-sm text-emerald-800'>Tiến độ (1000 từ)</div>
        </div>
      </div>

      {/* CEFR Level breakdown */}
      <div className='mb-6'>
        <h4 className='text-lg font-semibold text-gray-700 mb-3'>
          Phân bố theo cấp độ CEFR
        </h4>
        <div className='grid grid-cols-2 md:grid-cols-6 gap-3'>
          <div className='text-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400'>
            <div className='text-xl font-bold text-green-600'>{a1Count}</div>
            <div className='text-xs text-green-800 font-medium'>A1</div>
            <div className='text-xs text-green-700'>Khởi đầu</div>
          </div>
          <div className='text-center p-3 bg-green-100 rounded-lg border-l-4 border-green-500'>
            <div className='text-xl font-bold text-green-700'>{a2Count}</div>
            <div className='text-xs text-green-900 font-medium'>A2</div>
            <div className='text-xs text-green-800'>Cơ bản</div>
          </div>
          <div className='text-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400'>
            <div className='text-xl font-bold text-yellow-600'>{b1Count}</div>
            <div className='text-xs text-yellow-800 font-medium'>B1</div>
            <div className='text-xs text-yellow-700'>Trung cấp thấp</div>
          </div>
          <div className='text-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400'>
            <div className='text-xl font-bold text-orange-600'>{b2Count}</div>
            <div className='text-xs text-orange-800 font-medium'>B2</div>
            <div className='text-xs text-orange-700'>Trung cấp cao</div>
          </div>
          <div className='text-center p-3 bg-red-50 rounded-lg border-l-4 border-red-400'>
            <div className='text-xl font-bold text-red-600'>{c1Count}</div>
            <div className='text-xs text-red-800 font-medium'>C1</div>
            <div className='text-xs text-red-700'>Cao cấp</div>
          </div>
          <div className='text-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400'>
            <div className='text-xl font-bold text-purple-600'>{c2Count}</div>
            <div className='text-xs text-purple-800 font-medium'>C2</div>
            <div className='text-xs text-purple-700'>Thành thạo</div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {categories.length > 0 && (
        <div className='mb-6'>
          <h4 className='text-lg font-semibold text-gray-700 mb-3'>
            Phân bố theo danh mục từ loại
          </h4>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'>
            {categories
              .filter(cat => vocabulary.some(word => word.category === cat.id))
              .map(category => {
                const count = vocabulary.filter(
                  word => word.category === category.id
                ).length;
                return (
                  <div
                    key={category.id}
                    className='p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg text-center border border-indigo-100 hover:shadow-md transition-shadow'
                  >
                    <div className='text-2xl mb-1'>{category.icon}</div>
                    <p className='font-medium text-indigo-800 text-sm'>
                      {category.name}
                    </p>
                    <p className='text-lg font-bold text-indigo-600'>{count}</p>
                    <p className='text-xs text-indigo-500'>
                      {category.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Recent additions */}
      {vocabulary.length > 0 && (
        <div className='mt-6'>
          <h4 className='text-lg font-semibold text-gray-700 mb-3'>
            Từ mới nhất
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {vocabulary
              .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
              .slice(0, 6)
              .map(word => (
                <div
                  key={word.id}
                  className='p-3 bg-gray-50 rounded-lg flex justify-between items-center'
                >
                  <div>
                    <span className='font-medium text-gray-800'>
                      {word.english}
                    </span>
                    <span className='mx-2 text-gray-500'>→</span>
                    <span className='text-gray-600'>{word.vietnamese}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      word.level === 'A1' || word.level === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : word.level === 'A2'
                          ? 'bg-green-200 text-green-800'
                          : word.level === 'B1'
                            ? 'bg-yellow-100 text-yellow-700'
                            : word.level === 'B2' ||
                                word.level === 'intermediate'
                              ? 'bg-orange-100 text-orange-700'
                              : word.level === 'C1'
                                ? 'bg-red-100 text-red-700'
                                : word.level === 'C2' ||
                                    word.level === 'advanced'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {mapToCurrentLevel(word)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
