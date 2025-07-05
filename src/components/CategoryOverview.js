import React from 'react';
import { categories } from '../data/initialVocabulary';

const CategoryCard = ({ category, count, onClick, isSelected }) => {
  return (
    <div
      onClick={() => onClick(category.id)}
      className={`
        p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-indigo-300'
        }
      `}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{category.icon}</div>
        <h3 className={`font-semibold mb-1 ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
          {category.name}
        </h3>
        <p className={`text-sm mb-2 ${isSelected ? 'text-indigo-600' : 'text-gray-600'}`}>
          {category.description}
        </p>
        <div className={`
          text-lg font-bold px-3 py-1 rounded-full
          ${isSelected 
            ? 'bg-indigo-200 text-indigo-800' 
            : 'bg-gray-100 text-gray-700'
          }
        `}>
          {count} từ
        </div>
      </div>
    </div>
  );
};

const CategoryOverview = ({ vocabulary, onCategorySelect, selectedCategory }) => {
  // Calculate category statistics
  const categoryStats = categories.map(category => ({
    ...category,
    count: vocabulary.filter(word => word.category === category.id).length
  })).filter(cat => cat.count > 0);

  const totalWords = vocabulary.length;

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh mục từ vựng</h2>
        <div className="text-sm text-gray-600">
          {categoryStats.length} danh mục • {totalWords} từ
        </div>
      </div>

      {/* All categories button */}
      <div className="mb-4">
        <button
          onClick={() => onCategorySelect('')}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${!selectedCategory 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          📚 Tất cả danh mục ({totalWords} từ)
        </button>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categoryStats.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            count={category.count}
            onClick={onCategorySelect}
            isSelected={selectedCategory === category.id}
          />
        ))}
      </div>

      {/* Empty state */}
      {categoryStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📚</div>
          <p>Chưa có từ vựng nào. Hãy thêm từ mới để bắt đầu!</p>
        </div>
      )}
    </div>
  );
};

export default CategoryOverview;
