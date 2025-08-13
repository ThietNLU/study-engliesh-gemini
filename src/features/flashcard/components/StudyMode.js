import React, { useEffect } from 'react';
import { Volume2, Star } from 'lucide-react';
import { speak } from '../../../shared/utils/helpers';
import { useLearningStore, useUIStore, useDataStore } from '../../../shared/stores';

const StudyMode = () => {
  // Use stores instead of props
  const { currentCard, startStudySession } = useLearningStore();
  const { accent } = useUIStore();
  const { vocabulary, favorites, toggleFavorite } = useDataStore();
  
  // Get current word from vocabulary
  const currentWord = vocabulary[currentCard];

  // Start study session when component mounts
  useEffect(() => {
    startStudySession();
  }, [startStudySession]);

  if (!currentWord) return null;

  return (
    <div className='bg-white rounded-xl shadow-xl p-8 mb-6'>
      <div className='text-center mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
              {currentWord.category}
            </span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                currentWord.level === 'beginner'
                  ? 'bg-green-100 text-green-700'
                  : currentWord.level === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {currentWord.level}
            </span>
          </div>
          <button
            onClick={() => toggleFavorite(currentWord.id)}
            className={`p-2 rounded-full transition-all ${
              favorites.has(currentWord.id)
                ? 'text-yellow-500 bg-yellow-50'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <Star className='w-5 h-5' />
          </button>
        </div>

        {/* English Word */}
        <div className='mb-6'>
          <h2 className='text-5xl font-bold text-indigo-800 mb-4'>
            {currentWord.english}
          </h2>
          <div className='flex justify-center space-x-4 mb-4'>
            <button
              onClick={() => speak(currentWord.english, 'us')}
              className={`px-4 py-2 rounded-lg transition-all ${
                accent === 'us'
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Volume2 className='inline w-4 h-4 mr-2' />
              US: [{currentWord.pronunciation_us}]
            </button>
            <button
              onClick={() => speak(currentWord.english, 'uk')}
              className={`px-4 py-2 rounded-lg transition-all ${
                accent === 'uk'
                  ? 'bg-red-100 hover:bg-red-200 text-red-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Volume2 className='inline w-4 h-4 mr-2' />
              UK: [{currentWord.pronunciation_uk}]
            </button>
          </div>
        </div>

        {/* Vietnamese Meaning */}
        <div className='mb-6 p-4 bg-green-50 rounded-lg'>
          <h3 className='text-lg font-semibold text-green-700 mb-2'>
            Nghĩa tiếng Việt
          </h3>
          <p className='text-2xl text-green-800'>{currentWord.vietnamese}</p>
        </div>

        {/* Definition */}
        {currentWord.definition && (
          <div className='mb-6 p-4 bg-blue-50 rounded-lg'>
            <h3 className='text-lg font-semibold text-blue-700 mb-2'>
              Định nghĩa
            </h3>
            <p className='text-gray-800'>{currentWord.definition}</p>
          </div>
        )}

        {/* Example */}
        {currentWord.example && (
          <div className='mb-6 p-4 bg-purple-50 rounded-lg'>
            <h3 className='text-lg font-semibold text-purple-700 mb-2'>
              Ví dụ
            </h3>
            <p className='text-gray-800 italic'>"{currentWord.example}"</p>
            <button
              onClick={() => speak(currentWord.example, accent)}
              className='mt-2 text-purple-600 hover:text-purple-800 text-sm'
            >
              <Volume2 className='inline w-3 h-3 mr-1' />
              Phát âm ví dụ
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className='flex justify-between items-center'>
        <button
          onClick={() => useLearningStore.getState().prevCard(vocabulary.length)}
          className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-all'
        >
          ← Trước
        </button>
        <span className='text-gray-600'>
          {currentCard + 1} / {vocabulary.length}
        </span>
        <button
          onClick={() => useLearningStore.getState().nextCard(vocabulary.length)}
          className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all'
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
};

export default StudyMode;
