import React from 'react';
import { Volume2 } from 'lucide-react';
import { speak } from '../../../shared/utils/helpers';

const QuizMode = ({
  currentWord,
  quizType,
  setQuizType,
  score,
  userAnswer,
  setUserAnswer,
  showAnswer,
  checkAnswer,
  nextCard,
  accent,
}) => {
  if (!currentWord) return null;

  const isCorrect =
    quizType === 'meaning'
      ? userAnswer
          .toLowerCase()
          .includes(currentWord.vietnamese.toLowerCase()) ||
        currentWord.vietnamese.toLowerCase().includes(userAnswer.toLowerCase())
      : userAnswer.toLowerCase().includes(currentWord.english.toLowerCase()) ||
        currentWord.english.toLowerCase().includes(userAnswer.toLowerCase());

  return (
    <div className='bg-white rounded-xl shadow-xl p-8 mb-6'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex space-x-4'>
          <button
            onClick={() => setQuizType('meaning')}
            className={`px-4 py-2 rounded-lg ${
              quizType === 'meaning'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Nghĩa từ
          </button>
          <button
            onClick={() => setQuizType('english')}
            className={`px-4 py-2 rounded-lg ${
              quizType === 'english'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Từ tiếng Anh
          </button>
        </div>
        <div className='text-lg text-gray-600'>
          Điểm: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className='ml-2 text-indigo-600'>
              ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </div>
      </div>

      <div className='text-center mb-6'>
        <div className='mb-4'>
          {quizType === 'meaning' ? (
            <>
              <h2 className='text-4xl font-bold text-indigo-800 mb-4'>
                {currentWord.english}
              </h2>
              <button
                onClick={() => speak(currentWord.english, accent)}
                className='bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg transition-all mb-4'
              >
                <Volume2 className='inline w-4 h-4 mr-2' />
                Nghe phát âm
              </button>
              <p className='text-lg text-gray-700 mb-4'>
                Từ này có nghĩa tiếng Việt là gì?
              </p>
            </>
          ) : (
            <>
              <h2 className='text-3xl font-bold text-green-800 mb-4'>
                {currentWord.vietnamese}
              </h2>
              <p className='text-lg text-gray-700 mb-4'>
                Từ tiếng Anh tương ứng là gì?
              </p>
            </>
          )}
        </div>

        <input
          type='text'
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          placeholder='Nhập câu trả lời...'
          className='w-full max-w-md mx-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4'
          onKeyPress={e => e.key === 'Enter' && !showAnswer && checkAnswer()}
        />

        {!showAnswer ? (
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
            className='bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-all'
          >
            Kiểm tra
          </button>
        ) : (
          <div className='mb-4'>
            <div
              className={`p-4 rounded-lg mb-4 ${
                isCorrect
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isCorrect ? '✓ Đúng rồi!' : '✗ Sai rồi'}
            </div>
            <div className='text-left max-w-md mx-auto p-4 bg-gray-50 rounded-lg'>
              <p>
                <strong>Đáp án:</strong>{' '}
                {quizType === 'meaning'
                  ? currentWord.vietnamese
                  : currentWord.english}
              </p>
              <p>
                <strong>Phát âm:</strong>{' '}
                {accent === 'us'
                  ? currentWord.pronunciation_us
                  : currentWord.pronunciation_uk}
              </p>
              {currentWord.definition && (
                <p>
                  <strong>Định nghĩa:</strong> {currentWord.definition}
                </p>
              )}
            </div>
            <button
              onClick={nextCard}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all mt-4'
            >
              Câu tiếp theo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
