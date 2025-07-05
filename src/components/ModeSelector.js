import React from 'react';
import { Home, BookOpen, Brain, Plus, Settings, Sparkles, Database } from 'lucide-react';

const ModeSelector = ({ currentMode, setCurrentMode, resetQuiz }) => {
  const modes = [
    { id: 'home', label: 'Trang chủ', icon: Home, action: () => setCurrentMode('home') },
    { id: 'study', label: 'Học từ', icon: BookOpen, action: () => setCurrentMode('study') },
    { id: 'quiz', label: 'Kiểm tra', icon: Brain, action: () => { setCurrentMode('quiz'); resetQuiz(); } },
    { id: 'add', label: 'Thêm từ', icon: Plus, action: () => setCurrentMode('add') },
    { id: 'ai', label: 'AI Tạo từ', icon: Sparkles, action: () => setCurrentMode('ai') },
    { id: 'manage', label: 'Quản lý', icon: Settings, action: () => setCurrentMode('manage') },
    { id: 'database', label: 'Cơ sở dữ liệu', icon: Database, action: () => setCurrentMode('database') }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-4 sm:mb-6 p-3 sm:p-4 border border-gray-100">
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {modes.map(({ id, label, icon: Icon, action }) => (
            <button
              key={id}
              onClick={action}
              className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
                currentMode === id
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden text-xs">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
