import React from 'react';
import { useLearningStore } from '../stores';
import { Calendar, Clock, Target, TrendingUp, Award } from 'lucide-react';

const StudyProgressWidget = () => {
  const { 
    streak, 
    totalStudyTime, 
    wordsLearned, 
    sessionsCompleted,
    getStudyStats 
  } = useLearningStore();
  
  const stats = getStudyStats();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStreakColor = () => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100';
    if (streak >= 14) return 'text-orange-600 bg-orange-100';
    if (streak >= 7) return 'text-blue-600 bg-blue-100';
    if (streak >= 3) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '💪';
    return '📚';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
        Tiến độ học tập
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Streak */}
        <div className={`rounded-lg p-3 text-center ${getStreakColor()}`}>
          <div className="text-2xl mb-1">{getStreakEmoji()}</div>
          <p className="text-xl font-bold">{streak}</p>
          <p className="text-xs opacity-75">ngày liên tiếp</p>
        </div>

        {/* Study Time */}
        <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xl font-bold">{formatTime(totalStudyTime)}</p>
          <p className="text-xs opacity-75">tổng thời gian</p>
        </div>

        {/* Words Learned */}
        <div className="bg-green-100 text-green-600 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xl font-bold">{wordsLearned}</p>
          <p className="text-xs opacity-75">từ đã học</p>
        </div>

        {/* Sessions */}
        <div className="bg-yellow-100 text-yellow-600 rounded-lg p-3 text-center">
          <Award className="w-5 h-5 mx-auto mb-1" />
          <p className="text-xl font-bold">{sessionsCompleted}</p>
          <p className="text-xs opacity-75">phiên học</p>
        </div>
      </div>

      {/* Weekly Progress */}
      {stats.weeklyProgress.sessions > 0 && (
        <div className="bg-white rounded-lg p-3 border border-indigo-100">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Tuần này
            </span>
            <span className="font-medium">
              {Math.round(stats.averageScore)}% trung bình
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span>{stats.weeklyProgress.sessions} phiên</span>
            <span>{formatTime(stats.weeklyProgress.totalTime)}</span>
            <span>{stats.weeklyProgress.wordsStudied} từ</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyProgressWidget;
