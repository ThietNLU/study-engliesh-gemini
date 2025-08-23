import React from 'react';
import {
  Plus,
  Sparkles,
  Settings,
  BarChart3,
  Clock,
  Star,
  Book,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { getCategoryStats } from '../utils/helpers';
import { categories } from '../../features/vocab/data/initialVocabulary';

const HomePage = ({ vocabulary, favorites, setCurrentMode, currentWord }) => {
  // Defensive programming: ensure vocabulary is an array
  const safeVocabulary = vocabulary || [];

  const totalWords = safeVocabulary.length;
  const favoriteCount = favorites.size;

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
      id: 'ai',
      title: 'AI tạo từ vựng',
      description: 'Sử dụng AI để tạo danh sách từ theo chủ đề',
      icon: Sparkles,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      badge: '🤖 AI',
    },
    {
      id: 'dictionary',
      title: 'Từ điển thông minh',
      description: 'Tra cứu định nghĩa, ví dụ, đồng nghĩa từ',
      icon: Book,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badge: '📚 Smart',
    },
    {
      id: 'add',
      title: 'Thêm từ mới',
      description: 'Bổ sung từ vựng với đầy đủ thông tin',
      icon: Plus,
      gradient: 'from-purple-500 via-indigo-500 to-blue-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badge: '➕ Quick',
    },
    {
      id: 'manage',
      title: 'Quản lý từ vựng',
      description: 'Xem, sửa, xóa và tổ chức từ vựng',
      icon: Settings,
      gradient: 'from-slate-500 via-gray-500 to-zinc-500',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      badge: '⚙️ Manage',
    },
  ];

  return (
    <div className='space-y-6 sm:space-y-8 px-3 sm:px-0 animate-fadeInUp'>
      {/* Hero Welcome Section */}
      <div className='relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden'>
        {/* Background decorative elements */}
        <div className='absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl'></div>

        <div className='relative max-w-4xl'>
          <div className='flex items-center mb-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-white/20 backdrop-blur-sm rounded-xl'>
                <Target className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
              </div>
              <div className='text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium'>
                Học thông minh ✨
              </div>
            </div>
          </div>

          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight'>
            Chào mừng trở lại! 👋
          </h1>
          <p className='text-lg sm:text-xl lg:text-2xl opacity-90 mb-6 leading-relaxed'>
            Hãy tiếp tục hành trình chinh phục tiếng Anh của bạn
          </p>

          {currentWord && (
            <div className='bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-6 mb-6 border border-white/20'>
              <div className='flex items-center justify-between mb-3'>
                <p className='text-sm opacity-80 font-medium'>Từ đang học:</p>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  <span className='text-xs opacity-70'>Đang hoạt động</span>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-2xl sm:text-3xl font-bold'>
                  {currentWord.english}
                </p>
                <p className='text-lg sm:text-xl opacity-90'>
                  {currentWord.vietnamese}
                </p>
                {currentWord.example && (
                  <p className='text-sm opacity-75 italic'>
                    "{currentWord.example}"
                  </p>
                )}
              </div>
            </div>
          )}

          <div className='flex items-center space-x-4 text-sm opacity-80'>
            <div className='flex items-center space-x-1'>
              <TrendingUp className='w-4 h-4' />
              <span>Tiến bộ hàng ngày</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Zap className='w-4 h-4' />
              <span>AI hỗ trợ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
        <div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-semibold mb-1'>
                Tổng từ vựng
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors'>
                {totalWords}
              </p>
              <p className='text-xs text-gray-500 mt-1'>từ đã học</p>
            </div>
            <div className='p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all'>
              <Book className='w-5 h-5 sm:w-6 sm:h-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-semibold mb-1'>
                Yêu thích
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors'>
                {favoriteCount}
              </p>
              <p className='text-xs text-gray-500 mt-1'>từ quan trọng</p>
            </div>
            <div className='p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all'>
              <Star className='w-5 h-5 sm:w-6 sm:h-6 text-yellow-600' />
            </div>
          </div>
        </div>

        <div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-semibold mb-1'>
                Gần đây
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors'>
                {recentWords.length}
              </p>
              <p className='text-xs text-gray-500 mt-1'>từ mới</p>
            </div>
            <div className='p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:from-green-200 group-hover:to-green-300 transition-all'>
              <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-xs sm:text-sm font-semibold mb-1'>
                Mức độ cao
              </p>
              <p className='text-2xl sm:text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors'>
                {(levelStats.C1 || 0) + (levelStats.C2 || 0)}
              </p>
              <p className='text-xs text-gray-500 mt-1'>từ nâng cao</p>
            </div>
            <div className='p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:from-purple-200 group-hover:to-purple-300 transition-all'>
              <Target className='w-5 h-5 sm:w-6 sm:h-6 text-purple-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>
            Chọn hoạt động
          </h2>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Zap className='w-4 h-4' />
            <span>Tối ưu AI</span>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon || Settings;
            return (
              <div
                key={action.id}
                className='group relative animate-fadeInUp'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => setCurrentMode(action.id)}
                  className='w-full bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-left border border-gray-100 group-hover:border-gray-200 overflow-hidden'
                >
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>

                  {/* Badge */}
                  <div className='flex items-center justify-between mb-4'>
                    <div
                      className={`px-3 py-1 ${action.iconBg} rounded-full text-xs font-bold ${action.iconColor}`}
                    >
                      {action.badge}
                    </div>
                    <div className='w-2 h-2 bg-gray-300 group-hover:bg-gray-400 rounded-full transition-colors'></div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`p-4 ${action.iconBg} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className={`w-8 h-8 ${action.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900'>
                    {action.title}
                  </h3>
                  <p className='text-sm text-gray-600 leading-relaxed group-hover:text-gray-700'>
                    {action.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className='mt-4 flex justify-end'>
                    <div className='w-6 h-6 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1'>
                      <svg
                        className='w-3 h-3 text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Recent Activity & Progress */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
        {/* Recent Words */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-xl sm:text-2xl font-bold text-gray-800'>
              Từ mới nhất
            </h3>
            <div className='p-2 bg-gray-100 rounded-lg'>
              <Clock className='w-5 h-5 text-gray-600' />
            </div>
          </div>

          <div className='space-y-4'>
            {recentWords.map((word, index) => (
              <div
                key={word.id}
                className='group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-blue-50 hover:to-indigo-50 rounded-xl border border-gray-200/50 hover:border-blue-200 transition-all duration-200'
              >
                <div className='min-w-0 flex-1'>
                  <p className='font-bold text-gray-800 text-base sm:text-lg truncate group-hover:text-blue-800'>
                    {word.english}
                  </p>
                  <p className='text-sm text-gray-600 truncate group-hover:text-blue-600'>
                    {word.vietnamese}
                  </p>
                  {word.definition && (
                    <p className='text-xs text-gray-500 truncate mt-1'>
                      {word.definition}
                    </p>
                  )}
                </div>
                <div className='flex items-center space-x-3 ml-4'>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold flex-shrink-0 ${
                      word.level === 'A1'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : word.level === 'A2'
                          ? 'bg-green-200 text-green-800 border border-green-300'
                          : word.level === 'B1'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            : word.level === 'B2'
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : word.level === 'C1'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {word.level}
                  </span>
                  <div className='text-xs text-gray-400'>#{index + 1}</div>
                </div>
              </div>
            ))}
            {recentWords.length === 0 && (
              <div className='text-center py-12'>
                <Book className='w-12 h-12 text-gray-300 mx-auto mb-4' />
                <p className='text-gray-500 text-base mb-2'>
                  Chưa có từ vựng nào
                </p>
                <p className='text-gray-400 text-sm'>
                  Hãy bắt đầu thêm từ vựng đầu tiên!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Level Distribution */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-xl sm:text-2xl font-bold text-gray-800'>
              Phân bố cấp độ
            </h3>
            <div className='p-2 bg-gray-100 rounded-lg'>
              <BarChart3 className='w-5 h-5 text-gray-600' />
            </div>
          </div>

          <div className='space-y-4'>
            {Object.entries(levelStats).length > 0 ? (
              Object.entries(levelStats).map(([level, count]) => {
                const percentage = Math.round((count / totalWords) * 100);
                return (
                  <div key={level} className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center space-x-3'>
                        <span
                          className={`w-4 h-4 rounded-full ${
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
                        ></span>
                        <span className='font-bold text-gray-700 text-lg'>
                          {level}
                        </span>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold text-gray-800'>
                          {count} từ
                        </div>
                        <div className='text-xs text-gray-500'>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          level === 'A1'
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : level === 'A2'
                              ? 'bg-gradient-to-r from-green-500 to-green-600'
                              : level === 'B1'
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                : level === 'B2'
                                  ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                                  : level === 'C1'
                                    ? 'bg-gradient-to-r from-red-400 to-red-500'
                                    : 'bg-gradient-to-r from-purple-400 to-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className='text-center py-12'>
                <BarChart3 className='w-12 h-12 text-gray-300 mx-auto mb-4' />
                <p className='text-gray-500 text-base mb-2'>
                  Chưa có dữ liệu thống kê
                </p>
                <p className='text-gray-400 text-sm'>
                  Thêm từ vựng để xem phân tích cấp độ
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl'></div>
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl'></div>

        <div className='relative flex flex-col md:flex-row items-center justify-between'>
          <div className='mb-4 md:mb-0'>
            <h3 className='text-xl sm:text-2xl font-bold mb-2 flex items-center'>
              <Zap className='w-6 h-6 mr-2' />
              Sẵn sàng bắt đầu?
            </h3>
            <p className='text-base sm:text-lg opacity-90'>
              Chọn một hoạt động phía trên hoặc tiếp tục từ nơi bạn đã dừng lại
            </p>
          </div>
          <div className='flex space-x-3'>
            <button
              onClick={() => setCurrentMode('ai')}
              className='bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center border border-white/30'
            >
              <Sparkles className='w-4 h-4 mr-2' />
              AI Tạo từ
            </button>
            <button
              onClick={() => setCurrentMode('manage')}
              className='bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center border border-white/20'
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
