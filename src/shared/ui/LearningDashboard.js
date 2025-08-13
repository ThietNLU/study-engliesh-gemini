import React from 'react';
import { useLearningStore, useDataStore } from '../../../shared/stores';
import {
  BarChart3,
  Clock,
  Target,
  Trophy,
  TrendingUp,
  Star,
  Calendar,
} from 'lucide-react';

const LearningDashboard = () => {
  const { getStudyStats, streak, totalStudyTime, wordsLearned } =
    useLearningStore();
  const { getVocabularyStats } = useDataStore();

  const studyStats = getStudyStats();
  const vocabStats = getVocabularyStats();

  const formatTime = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className='bg-white rounded-xl shadow-xl p-6 mb-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center'>
        <BarChart3 className='w-6 h-6 mr-2 text-indigo-600' />
        Thống kê học tập
      </h2>

      {/* Main Stats Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center border border-green-200'>
          <div className='text-2xl mb-1'>🔥</div>
          <p className='text-2xl font-bold text-green-600'>{streak}</p>
          <p className='text-sm text-green-700'>Ngày liên tiếp</p>
        </div>

        <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-200'>
          <Clock className='w-6 h-6 mx-auto mb-1 text-blue-600' />
          <p className='text-2xl font-bold text-blue-600'>
            {formatTime(totalStudyTime)}
          </p>
          <p className='text-sm text-blue-700'>Tổng thời gian</p>
        </div>

        <div className='bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 text-center border border-purple-200'>
          <Target className='w-6 h-6 mx-auto mb-1 text-purple-600' />
          <p className='text-2xl font-bold text-purple-600'>{wordsLearned}</p>
          <p className='text-sm text-purple-700'>Từ đã học</p>
        </div>

        <div className='bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 text-center border border-yellow-200'>
          <Trophy className='w-6 h-6 mx-auto mb-1 text-yellow-600' />
          <p className='text-2xl font-bold text-yellow-600'>
            {Math.round(studyStats.averageScore)}%
          </p>
          <p className='text-sm text-yellow-700'>Điểm trung bình</p>
        </div>
      </div>

      {/* Vocabulary Stats */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
          <Star className='w-5 h-5 mr-2 text-indigo-600' />
          Từ vựng
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div className='bg-gray-50 rounded-lg p-4 text-center'>
            <p className='text-xl font-bold text-gray-700'>
              {vocabStats.total}
            </p>
            <p className='text-sm text-gray-600'>Tổng từ vựng</p>
          </div>
          <div className='bg-red-50 rounded-lg p-4 text-center'>
            <p className='text-xl font-bold text-red-600'>
              {vocabStats.favorites}
            </p>
            <p className='text-sm text-red-600'>Từ yêu thích</p>
          </div>
          <div className='bg-indigo-50 rounded-lg p-4 text-center'>
            <p className='text-xl font-bold text-indigo-600'>
              {Object.keys(vocabStats.categories).length}
            </p>
            <p className='text-sm text-indigo-600'>Danh mục</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
          <Calendar className='w-5 h-5 mr-2 text-indigo-600' />
          Tiến độ tuần này
        </h3>
        <div className='grid grid-cols-3 gap-4'>
          <div className='bg-blue-50 rounded-lg p-4 text-center'>
            <TrendingUp className='w-6 h-6 mx-auto mb-1 text-blue-600' />
            <p className='text-xl font-bold text-blue-600'>
              {studyStats.weeklyProgress.sessions}
            </p>
            <p className='text-sm text-blue-600'>Phiên học</p>
          </div>
          <div className='bg-green-50 rounded-lg p-4 text-center'>
            <Clock className='w-6 h-6 mx-auto mb-1 text-green-600' />
            <p className='text-xl font-bold text-green-600'>
              {formatTime(studyStats.weeklyProgress.totalTime)}
            </p>
            <p className='text-sm text-green-600'>Thời gian</p>
          </div>
          <div className='bg-purple-50 rounded-lg p-4 text-center'>
            <Target className='w-6 h-6 mx-auto mb-1 text-purple-600' />
            <p className='text-xl font-bold text-purple-600'>
              {studyStats.weeklyProgress.wordsStudied}
            </p>
            <p className='text-sm text-purple-600'>Từ học</p>
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      <div>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Phân bố theo cấp độ
        </h3>
        <div className='space-y-2'>
          {Object.entries(vocabStats.levels).map(([level, count]) => (
            <div
              key={level}
              className='flex items-center justify-between bg-gray-50 rounded-lg p-3'
            >
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  level === 'A1' || level === 'beginner'
                    ? 'bg-green-100 text-green-700'
                    : level === 'A2'
                      ? 'bg-green-200 text-green-800'
                      : level === 'B1'
                        ? 'bg-yellow-100 text-yellow-700'
                        : level === 'B2' || level === 'intermediate'
                          ? 'bg-orange-100 text-orange-700'
                          : level === 'C1'
                            ? 'bg-red-100 text-red-700'
                            : level === 'C2' || level === 'advanced'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                }`}
              >
                {level}
              </span>
              <div className='flex items-center'>
                <div className='w-32 bg-gray-200 rounded-full h-2 mr-3'>
                  <div
                    className='bg-indigo-600 h-2 rounded-full'
                    style={{ width: `${(count / vocabStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className='text-sm font-medium text-gray-700 w-8'>
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;
