import React, { useState } from 'react';
import { Edit3, Trash2, Save, X, Star, Volume2, Filter } from 'lucide-react';
import { speak, getCategoryInfo } from '../utils/helpers';
import { categories } from '../data/initialVocabulary';

const ManageMode = ({
  filteredVocabulary,
  searchTerm,
  setSearchTerm,
  editingWord,
  setEditingWord,
  vocabulary,
  updateWord,
  favorites,
  toggleFavorite,
  deleteWord,
  accent
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Filter by category
  const categoryFilteredVocabulary = selectedCategory 
    ? filteredVocabulary.filter(word => word.category === selectedCategory)
    : filteredVocabulary;

  const handleWordChange = (wordId, field, value) => {
    updateWord(wordId, { [field]: value });
  };

  // Get unique categories from vocabulary
  const usedCategories = [...new Set(vocabulary.map(word => word.category))]
    .map(catId => categories.find(cat => cat.id === catId) || { id: catId, name: catId, icon: '📚' })
    .filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý từ vựng</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {usedCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm từ..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {categoryFilteredVocabulary.length} từ
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {categoryFilteredVocabulary.map((word) => (
          <div key={word.id} className="border border-gray-200 rounded-lg p-4">
            {editingWord === word.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={word.english}
                  onChange={(e) => handleWordChange(word.id, 'english', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={word.vietnamese}
                  onChange={(e) => handleWordChange(word.id, 'vietnamese', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingWord(null)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex-1"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingWord(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-indigo-800">
                      {word.english}
                    </h3>
                    <span className="text-gray-600">→</span>
                    <span className="text-green-700">{word.vietnamese}</span>
                    <button
                      onClick={() => toggleFavorite(word.id)}
                      className={`p-1 rounded ${
                        favorites.has(word.id)
                          ? 'text-yellow-500'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-2 py-1 rounded flex items-center">
                      {getCategoryInfo(word.category, categories).icon} {getCategoryInfo(word.category, categories).name}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      word.level === 'A1' || word.level === 'beginner' ? 'bg-green-100 text-green-700' :
                      word.level === 'A2' ? 'bg-green-200 text-green-800' :
                      word.level === 'B1' ? 'bg-yellow-100 text-yellow-700' :
                      word.level === 'B2' || word.level === 'intermediate' ? 'bg-orange-100 text-orange-700' :
                      word.level === 'C1' ? 'bg-red-100 text-red-700' :
                      word.level === 'C2' || word.level === 'advanced' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {word.level}
                    </span>
                    <button
                      onClick={() => speak(word.english, accent)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Volume2 className="w-4 h-4 inline mr-1" />
                      Phát âm
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingWord(word.id)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteWord(word.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMode;
