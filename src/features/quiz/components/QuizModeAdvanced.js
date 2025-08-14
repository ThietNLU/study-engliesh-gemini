import React, { useState } from 'react';
import {
  Brain,
  Play,
  BookOpen,
  Target,
  ArrowLeft,
  PlusCircle,
} from 'lucide-react';
import QuizGenerator from './QuizGenerator';
import QuizPlayer from './QuizPlayer';

const QuizModeAdvanced = () => {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'generator', 'player', 'library'
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [savedQuizzes, setSavedQuizzes] = useState([]);

  // Load saved quizzes
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('savedQuizzes');
      if (saved) {
        setSavedQuizzes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved quizzes:', error);
    }
  }, [currentView]);

  const handlePlayQuiz = quiz => {
    setSelectedQuiz(quiz);
    setCurrentView('player');
  };

  const handleQuizComplete = results => {
    // Save quiz results to localStorage
    try {
      const quizResults = JSON.parse(
        localStorage.getItem('quizResults') || '[]'
      );
      const newResult = {
        id: Date.now(),
        quizId: selectedQuiz.id,
        quizName: selectedQuiz.name,
        results,
        completedAt: new Date().toISOString(),
      };
      quizResults.unshift(newResult);

      // Keep only last 50 results
      const trimmedResults = quizResults.slice(0, 50);
      localStorage.setItem('quizResults', JSON.stringify(trimmedResults));
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }

    setCurrentView('menu');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedQuiz(null);
  };

  // Menu View
  if (currentView === 'menu') {
    return (
      <div className='max-w-6xl mx-auto p-6'>
        {/* Header */}
        <div className='bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 mb-8'>
          <h1 className='text-4xl font-bold mb-4 flex items-center'>
            <Brain className='mr-4' size={48} />
            AI Quiz Center
          </h1>
          <p className='text-lg text-purple-100'>
            Tạo và thực hiện các bài quiz thông minh với công nghệ Gemini AI
          </p>
        </div>

        {/* Main Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
          {/* Create New Quiz */}
          <div
            onClick={() => setCurrentView('generator')}
            className='bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200'
          >
            <div className='text-center'>
              <div className='bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                <PlusCircle className='text-blue-600' size={40} />
              </div>
              <h2 className='text-2xl font-bold mb-3 text-gray-800'>
                Tạo Quiz Mới
              </h2>
              <p className='text-gray-600 mb-4'>
                Sử dụng AI để tạo bộ câu hỏi theo chủ đề, mức độ và dạng bài tập
                mong muốn
              </p>
              <div className='flex justify-center space-x-4 text-sm text-gray-500'>
                <span>• Trắc nghiệm</span>
                <span>• Điền từ</span>
                <span>• Chuyển đổi câu</span>
              </div>
            </div>
          </div>

          {/* Quiz Library */}
          <div
            onClick={() => setCurrentView('library')}
            className='bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200'
          >
            <div className='text-center'>
              <div className='bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4'>
                <BookOpen className='text-green-600' size={40} />
              </div>
              <h2 className='text-2xl font-bold mb-3 text-gray-800'>
                Thư Viện Quiz
              </h2>
              <p className='text-gray-600 mb-4'>
                Xem và thực hiện các quiz đã lưu, theo dõi kết quả học tập của
                bạn
              </p>
              <div className='text-lg font-semibold text-green-600'>
                {savedQuizzes.length} quiz đã lưu
              </div>
            </div>
          </div>
        </div>

        {/* Recent Quiz Results */}
        <RecentResults />

        {/* Quick Stats */}
        <QuickStats />
      </div>
    );
  }

  // Generator View
  if (currentView === 'generator') {
    return (
      <div>
        <div className='mb-6'>
          <button
            onClick={handleBackToMenu}
            className='flex items-center text-gray-600 hover:text-gray-800 mb-4'
          >
            <ArrowLeft className='mr-2' size={20} />
            Quay lại menu
          </button>
        </div>
        <QuizGenerator />
      </div>
    );
  }

  // Player View
  if (currentView === 'player' && selectedQuiz) {
    return (
      <QuizPlayer
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onExit={handleBackToMenu}
      />
    );
  }

  // Library View
  if (currentView === 'library') {
    return (
      <div className='max-w-6xl mx-auto p-6'>
        <div className='mb-6'>
          <button
            onClick={handleBackToMenu}
            className='flex items-center text-gray-600 hover:text-gray-800 mb-4'
          >
            <ArrowLeft className='mr-2' size={20} />
            Quay lại menu
          </button>
          <h1 className='text-3xl font-bold text-gray-800'>Thư Viện Quiz</h1>
        </div>

        <QuizLibrary quizzes={savedQuizzes} onPlayQuiz={handlePlayQuiz} />
      </div>
    );
  }

  return null;
};

// Recent Results Component
const RecentResults = () => {
  const [recentResults, setRecentResults] = useState([]);

  React.useEffect(() => {
    try {
      const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
      setRecentResults(results.slice(0, 3));
    } catch (error) {
      console.error('Error loading recent results:', error);
    }
  }, []);

  if (recentResults.length === 0) return null;

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
      <h2 className='text-xl font-bold mb-4 flex items-center'>
        <Target className='mr-2 text-purple-600' />
        Kết Quả Gần Đây
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {recentResults.map(result => (
          <div key={result.id} className='bg-gray-50 rounded-lg p-4'>
            <h3 className='font-semibold text-gray-800 mb-2 truncate'>
              {result.quizName}
            </h3>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-600'>Điểm số:</span>
              <span className='font-bold text-blue-600'>
                {result.results.percentage.toFixed(1)}%
              </span>
            </div>
            <div className='text-xs text-gray-500'>
              {new Date(result.completedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Stats Component
const QuickStats = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    averageScore: 0,
    completedToday: 0,
  });

  React.useEffect(() => {
    try {
      const savedQuizzes = JSON.parse(
        localStorage.getItem('savedQuizzes') || '[]'
      );
      const results = JSON.parse(localStorage.getItem('quizResults') || '[]');

      const today = new Date().toDateString();
      const todayResults = results.filter(
        r => new Date(r.completedAt).toDateString() === today
      );

      const totalQuestions = savedQuizzes.reduce(
        (sum, quiz) => sum + (quiz.questions?.length || 0),
        0
      );

      const averageScore =
        results.length > 0
          ? results.reduce((sum, r) => sum + r.results.percentage, 0) /
            results.length
          : 0;

      setStats({
        totalQuizzes: savedQuizzes.length,
        totalQuestions,
        averageScore,
        completedToday: todayResults.length,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  }, []);

  return (
    <div className='bg-white rounded-xl shadow-lg p-6'>
      <h2 className='text-xl font-bold mb-4 text-gray-800'>Thống Kê Nhanh</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-blue-600'>
            {stats.totalQuizzes}
          </div>
          <div className='text-sm text-gray-600'>Quiz đã tạo</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {stats.totalQuestions}
          </div>
          <div className='text-sm text-gray-600'>Tổng câu hỏi</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-purple-600'>
            {stats.averageScore.toFixed(1)}%
          </div>
          <div className='text-sm text-gray-600'>Điểm TB</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-orange-600'>
            {stats.completedToday}
          </div>
          <div className='text-sm text-gray-600'>Hoàn thành hôm nay</div>
        </div>
      </div>
    </div>
  );
};

// Quiz Library Component
const QuizLibrary = ({ quizzes, onPlayQuiz }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || quiz.config?.level === filter;
    return matchesSearch && matchesFilter;
  });

  if (quizzes.length === 0) {
    return (
      <div className='text-center py-12'>
        <BookOpen className='mx-auto mb-4 text-gray-400' size={64} />
        <h3 className='text-xl font-semibold text-gray-600 mb-2'>
          Chưa có quiz nào
        </h3>
        <p className='text-gray-500'>
          Tạo quiz đầu tiên của bạn để bắt đầu học tập
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className='mb-6 flex flex-col md:flex-row gap-4'>
        <input
          type='text'
          placeholder='Tìm kiếm quiz...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
        >
          <option value='all'>Tất cả mức độ</option>
          <option value='A1'>A1 - Beginner</option>
          <option value='A2'>A2 - Elementary</option>
          <option value='B1'>B1 - Intermediate</option>
          <option value='B2'>B2 - Upper-Intermediate</option>
          <option value='C1'>C1 - Advanced</option>
          <option value='C2'>C2 - Proficient</option>
        </select>
      </div>

      {/* Quiz Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredQuizzes.map(quiz => (
          <div
            key={quiz.id}
            className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow'
          >
            <h3 className='text-lg font-semibold mb-2 text-gray-800'>
              {quiz.name}
            </h3>

            <div className='mb-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Câu hỏi:</span>
                <span className='font-medium'>
                  {quiz.questions?.length || 0}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Mức độ:</span>
                <span className='font-medium'>
                  {quiz.config?.level || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Dạng:</span>
                <span className='font-medium capitalize'>
                  {quiz.config?.type?.replace('_', ' ') || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Đã lưu:</span>
                <span className='font-medium'>
                  {new Date(quiz.savedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => onPlayQuiz(quiz)}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center'
            >
              <Play className='mr-2' size={16} />
              Bắt đầu Quiz
            </button>
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-500'>
            Không tìm thấy quiz nào phù hợp với bộ lọc
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizModeAdvanced;
