import React from 'react';
import {
  BookOpen,
  Brain,
  Plus,
  Sparkles,
  Settings,
  BarChart3,
  Target,
  Clock,
  Trophy,
  Star,
  // TrendingUp,
} from 'lucide-react';
import { getCategoryStats } from '../utils/helpers';
import { categories } from '../../features/vocab/data/initialVocabulary';
import StudyProgressWidget from './StudyProgressWidget';

const HomePage = ({
  vocabulary,
  favorites,
  setCurrentMode,
  score,
  currentWord,
}) => {
  // Defensive programming: ensure vocabulary is an array
  const safeVocabulary = vocabulary || [];

  const totalWords = safeVocabulary.length;
  const favoriteCount = favorites.size;
  const accuracyRate =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  // Quick stats
  const _categoryStats = getCategoryStats(safeVocabulary, categories);

  const levelStats = safeVocabulary.reduce((acc, word) => {
    acc[word.level] = (acc[word.level] || 0) + 1;
    return acc;
  }, {});

  const recentWords = safeVocabulary
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

  const quickActions = [
    {
      id: 'study',
      title: 'Học từ vựng',
      description: 'Ôn tập và ghi nhớ từ vựng',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-white',
    },
    {
      id: 'quiz',
      title: 'Kiểm tra',
      description: 'Làm bài kiểm tra từ vựng',
      icon: Brain,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-white',
    },
    {
      id: 'add',
      title: 'Thêm từ mới',
      description: 'Bổ sung từ vựng của bạn',
      icon: Plus,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-white',
    },
    {
      id: 'ai',
      title: 'AI tạo từ vựng',
      description: 'Sử dụng AI để tạo danh sách từ',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      textColor: 'text-white',
    },
  ];

  return (
    <div className='space-y-4 sm:space-y-6 px-3 sm:px-0'>
      {/* Welcome Section */}
      <div className='bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-4 sm:p-8 text-white'>
        <div className='max-w-4xl'>
          <h1 className='text-2xl sm:text-4xl font-bold mb-2'>
            Chào mừng trở lại! 👋
          </h1>
          <p className='text-base sm:text-xl opacity-90 mb-4 sm:mb-6'>
            Hãy tiếp tục hành trình chinh phục tiếng Anh của bạn
          </p>

          {currentWord && (
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4'>
              <p className='text-xs sm:text-sm opacity-80 mb-1'>Từ hiện tại:</p>
              <p className='text-xl sm:text-2xl font-semibold'>
                {currentWord.english}
              </p>
              <p className='text-base sm:text-lg opacity-90'>
                {currentWord.vietnamese}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
        <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>
                Tổng từ vựng
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-blue-600'>
                {totalWords}
              </p>
            </div>
            <div className='p-2 sm:p-3 bg-blue-100 rounded-lg'>
              <BookOpen className='w-4 h-4 sm:w-6 sm:h-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>
                Yêu thích
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-yellow-600'>
                {favoriteCount}
              </p>
            </div>
            <div className='p-2 sm:p-3 bg-yellow-100 rounded-lg'>
              <Star className='w-4 h-4 sm:w-6 sm:h-6 text-yellow-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>
                Độ chính xác
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-green-600'>
                {accuracyRate}%
              </p>
            </div>
            <div className='p-2 sm:p-3 bg-green-100 rounded-lg'>
              <Target className='w-4 h-4 sm:w-6 sm:h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-medium'>
                Điểm quiz
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-purple-600'>
                {score.correct}/{score.total}
              </p>
            </div>
            <div className='p-2 sm:p-3 bg-purple-100 rounded-lg'>
              <Trophy className='w-4 h-4 sm:w-6 sm:h-6 text-purple-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4'>
          Chọn hoạt động
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
          {quickActions.map(action => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setCurrentMode(action.id)}
                className={`${action.color} ${action.textColor} p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left w-full`}
              >
                <div className='flex items-center justify-between mb-3 sm:mb-4'>
                  <IconComponent className='w-6 h-6 sm:w-8 sm:h-8' />
                  <div className='w-2 h-2 bg-white/30 rounded-full'></div>
                </div>
                <h3 className='text-lg sm:text-xl font-bold mb-1 sm:mb-2'>
                  {action.title}
                </h3>
                <p className='text-xs sm:text-sm opacity-90 leading-relaxed'>
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Progress */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
        {/* Recent Words */}
        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
              Từ mới nhất
            </h3>
            <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500' />
          </div>
          <div className='space-y-3'>
            {recentWords.map(word => (
              <div
                key={word.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
              >
                <div className='min-w-0 flex-1'>
                  <p className='font-semibold text-gray-800 text-sm sm:text-base truncate'>
                    {word.english}
                  </p>
                  <p className='text-xs sm:text-sm text-gray-600 truncate'>
                    {word.vietnamese}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    word.level === 'A1'
                      ? 'bg-green-100 text-green-700'
                      : word.level === 'A2'
                        ? 'bg-green-200 text-green-800'
                        : word.level === 'B1'
                          ? 'bg-yellow-100 text-yellow-700'
                          : word.level === 'B2'
                            ? 'bg-orange-100 text-orange-700'
                            : word.level === 'C1'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {word.level}
                </span>
              </div>
            ))}
            {recentWords.length === 0 && (
              <p className='text-gray-500 text-center py-4 text-sm'>
                Chưa có từ vựng nào
              </p>
            )}
          </div>
        </div>

        {/* Study Progress Widget */}
        <StudyProgressWidget />
      </div>

      {/* Level Distribution */}
      <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg sm:text-xl font-bold text-gray-800'>
            Phân bố cấp độ
          </h3>
          <BarChart3 className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500' />
        </div>
        <div className='space-y-3'>
          {Object.entries(levelStats).map(([level, count]) => {
            const percentage = Math.round((count / totalWords) * 100);
            return (
              <div key={level} className='space-y-1'>
                <div className='flex justify-between text-sm'>
                  <span className='font-medium text-gray-700'>{level}</span>
                  <span className='text-gray-500'>
                    {count} từ ({percentage}%)
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full ${
                      level === 'A1'
                        ? 'bg-green-400'
                        : level === 'A2'
                          ? 'bg-green-500'
                          : level === 'B1'
                            ? 'bg-yellow-400'
                            : level === 'B2'
                              ? 'bg-orange-400'
                              : level === 'C1'
                                ? 'bg-red-400'
                                : 'bg-purple-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Footer */}
      <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-100'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div>
            <h3 className='text-lg font-bold text-gray-800 mb-1'>
              Sẵn sàng bắt đầu?
            </h3>
            <p className='text-gray-600'>
              Chọn một hoạt động phía trên hoặc tiếp tục từ nơi bạn đã dừng lại
            </p>
          </div>
          <div className='flex space-x-3 mt-4 md:mt-0'>
            <button
              onClick={() => setCurrentMode('study')}
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors'
            >
              Tiếp tục học
            </button>
            <button
              onClick={() => setCurrentMode('manage')}
              className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center'
            >
              <Settings className='w-4 h-4 mr-2' />
              Quản lý
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
