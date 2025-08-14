import React, { useState, useEffect } from 'react';
import {
  Settings,
  Play,
  Download,
  Save,
  Brain,
  CheckCircle,
  Loader,
} from 'lucide-react';
import quizGeneratorService from '../services/quizGeneratorService';
import { useApiKey } from '../../../shared/hooks/useApiKey';
import NotificationToast from '../../../shared/ui/NotificationToast';
import QuizPlayer from './QuizPlayer';

const QuizGenerator = () => {
  // State management
  const [config, setConfig] = useState({
    topic: 'present_tenses',
    level: 'B1',
    type: 'multiple_choice',
    count: 10,
    focus: '',
    vocabulary: [],
  });

  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [notification, setNotification] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const { apiKey } = useApiKey();

  // Load saved quizzes on component mount
  useEffect(() => {
    loadSavedQuizzes();
  }, []);

  const loadSavedQuizzes = () => {
    try {
      const saved = localStorage.getItem('savedQuizzes');
      if (saved) {
        setSavedQuizzes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved quizzes:', error);
    }
  };

  const saveQuiz = (quiz, name) => {
    try {
      const quizData = {
        id: Date.now(),
        name: name || `Quiz ${new Date().toLocaleDateString()}`,
        config: config,
        ...quiz,
        savedAt: new Date().toISOString(),
      };

      const updated = [quizData, ...savedQuizzes.slice(0, 9)]; // Keep last 10
      setSavedQuizzes(updated);
      localStorage.setItem('savedQuizzes', JSON.stringify(updated));

      showNotification('Quiz đã được lưu thành công!', 'success');
    } catch (error) {
      console.error('Error saving quiz:', error);
      showNotification('Lỗi lưu quiz', 'error');
    }
  };

  const handleGenerate = async () => {
    console.log('Starting quiz generation...', {
      apiKey: apiKey ? 'Present' : 'Missing',
      config,
      customTopic,
    });

    if (!apiKey) {
      showNotification('Vui lòng thiết lập API Key trước', 'error');
      return;
    }

    if (!config.topic && !customTopic) {
      showNotification('Vui lòng chọn chủ đề', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const finalConfig = {
        ...config,
        topic: customTopic || config.topic,
      };

      console.log('Final config for quiz generation:', finalConfig);
      const quiz = await quizGeneratorService.generateQuiz(finalConfig, apiKey);
      console.log('Quiz generated successfully:', quiz);

      setGeneratedQuiz(quiz);
      setLastError(null);
      setShowPlayer(true);
      console.log('State updated with generated quiz:', quiz);

      showNotification(
        `Đã tạo ${quiz.questions.length} câu hỏi thành công!`,
        'success'
      );
    } catch (error) {
      console.error('Quiz generation error:', error);
      showNotification(`Lỗi tạo quiz: ${error.message}`, 'error');
      setLastError(String(error?.message || error));
    } finally {
      setIsGenerating(false);
    }
  };

  const exportQuiz = (quiz, format = 'json') => {
    try {
      let content, filename, mimeType;

      if (format === 'json') {
        content = JSON.stringify(quiz, null, 2);
        filename = `quiz_${Date.now()}.json`;
        mimeType = 'application/json';
      } else if (format === 'txt') {
        content = formatQuizAsText(quiz);
        filename = `quiz_${Date.now()}.txt`;
        mimeType = 'text/plain';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      showNotification('Quiz đã được xuất thành công!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Lỗi xuất quiz', 'error');
    }
  };

  const formatQuizAsText = quiz => {
    let text = `QUIZ - Generated on ${new Date().toLocaleDateString()}\n`;
    text += `Total Questions: ${quiz.questions.length}\n\n`;

    quiz.questions.forEach((q, index) => {
      text += `${index + 1}. ${q.question}\n`;

      if (q.type === 'multiple_choice') {
        q.options.forEach((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const marker = i === q.correct_answer ? '✓' : ' ';
          text += `   ${letter}) ${option} ${marker}\n`;
        });
      } else if (q.type === 'fill_blank') {
        text += `   Answer: ${q.correct_answer}\n`;
        if (q.acceptable_answers?.length > 1) {
          text += `   Also acceptable: ${q.acceptable_answers.filter(a => a !== q.correct_answer).join(', ')}\n`;
        }
      }

      if (q.explanation) {
        text += `   Explanation: ${q.explanation}\n`;
      }
      text += '\n';
    });

    return text;
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const questionTypes = quizGeneratorService.getQuestionTypes();
  const topics = quizGeneratorService.getTopics();
  const levels = quizGeneratorService.getLevels();

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6'>
        <h1 className='text-3xl font-bold mb-2 flex items-center'>
          <Brain className='mr-3' />
          Quiz Generator with Gemini AI
        </h1>
        <p className='text-blue-100'>
          Tạo bộ câu hỏi thông minh theo chủ đề, mức độ và dạng bài tập
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Configuration Panel */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <Settings className='mr-2' />
              Cấu hình Quiz
            </h2>

            {/* Topic Selection */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Chủ đề
              </label>
              <div className='space-y-2'>
                <button
                  onClick={() => setShowTopicSelector(!showTopicSelector)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500'
                >
                  {config.topic
                    ? topics.find(t => t.id === config.topic)?.name ||
                      config.topic
                    : 'Chọn chủ đề...'}
                </button>

                {showTopicSelector && (
                  <div className='border border-gray-200 rounded-lg max-h-48 overflow-y-auto'>
                    {['grammar', 'vocabulary', 'theme'].map(category => (
                      <div key={category}>
                        <div className='bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 capitalize'>
                          {category}
                        </div>
                        {topics
                          .filter(t => t.category === category)
                          .map(topic => (
                            <button
                              key={topic.id}
                              onClick={() => {
                                setConfig(prev => ({
                                  ...prev,
                                  topic: topic.id,
                                }));
                                setCustomTopic('');
                                setShowTopicSelector(false);
                              }}
                              className='w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100'
                            >
                              <div className='font-medium'>{topic.name}</div>
                              <div className='text-xs text-gray-500'>
                                {topic.description}
                              </div>
                            </button>
                          ))}
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type='text'
                  placeholder='Hoặc nhập chủ đề tùy chỉnh...'
                  value={customTopic}
                  onChange={e => {
                    setCustomTopic(e.target.value);
                    if (e.target.value) {
                      setConfig(prev => ({ ...prev, topic: '' }));
                    }
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* Level Selection */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Mức độ
              </label>
              <select
                value={config.level}
                onChange={e =>
                  setConfig(prev => ({ ...prev, level: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Dạng câu hỏi
              </label>
              <select
                value={config.type}
                onChange={e =>
                  setConfig(prev => ({ ...prev, type: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              >
                {questionTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
              <p className='text-xs text-gray-500 mt-1'>
                {questionTypes.find(t => t.id === config.type)?.description}
              </p>
            </div>

            {/* Number of Questions */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Số câu hỏi
              </label>
              <input
                type='number'
                min='5'
                max='50'
                value={config.count}
                onChange={e =>
                  setConfig(prev => ({
                    ...prev,
                    count: parseInt(e.target.value) || 10,
                  }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Focus Area */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trọng tâm (tùy chọn)
              </label>
              <input
                type='text'
                placeholder='VD: irregular verbs, business idioms...'
                value={config.focus}
                onChange={e =>
                  setConfig(prev => ({ ...prev, focus: e.target.value }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !apiKey}
              className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center'
            >
              {isGenerating ? (
                <>
                  <Loader className='animate-spin mr-2' size={20} />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Play className='mr-2' size={20} />
                  Tạo Quiz
                </>
              )}
            </button>

            {!apiKey && (
              <p className='text-red-500 text-sm mt-2'>
                Vui lòng thiết lập API Key Gemini trong cài đặt
              </p>
            )}
          </div>

          {/* Saved Quizzes */}
          {savedQuizzes.length > 0 && (
            <div className='bg-white rounded-xl shadow-lg p-6 mt-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center'>
                <Save className='mr-2' />
                Quiz đã lưu
              </h3>
              <div className='space-y-2 max-h-64 overflow-y-auto'>
                {savedQuizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    className='p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer'
                    onClick={() => setGeneratedQuiz(quiz)}
                  >
                    <div className='font-medium'>{quiz.name}</div>
                    <div className='text-xs text-gray-500'>
                      {quiz.questions.length} câu hỏi •{' '}
                      {new Date(quiz.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quiz Display Panel */
        /* If playing, render interactive player; otherwise show preview */}
        <div className='lg:col-span-2'>
          {generatedQuiz && showPlayer && (
            <div className='bg-white rounded-xl shadow-lg p-0'>
              <QuizPlayer
                quiz={generatedQuiz}
                onExit={() => setShowPlayer(false)}
                onComplete={results => {
                  try {
                    showNotification(
                      `Hoàn thành: ${results.correct}/${generatedQuiz.questions.length} câu đúng (${results.percentage.toFixed(0)}%)`,
                      'success'
                    );
                  } catch (e) {
                    // no-op
                  }
                }}
              />
            </div>
          )}
          {lastError && (
            <div className='mb-4 p-4 border border-red-300 bg-red-50 text-red-800 rounded-lg'>
              <div className='font-semibold mb-1'>Lỗi khi tạo quiz</div>
              <pre className='whitespace-pre-wrap break-words text-sm'>
                {lastError}
              </pre>
            </div>
          )}
          {!showPlayer &&
          (() => {
            console.log('Render check - generatedQuiz:', generatedQuiz);
            return generatedQuiz;
          })() ? (
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold flex items-center'>
                  <CheckCircle className='mr-2 text-green-600' />
                  Quiz được tạo
                </h2>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => setShowPlayer(true)}
                    className='px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center'
                  >
                    <Play size={16} className='mr-1' />
                    Bắt đầu làm
                  </button>
                  <button
                    onClick={() => {
                      const name = prompt('Nhập tên quiz:');
                      if (name) saveQuiz(generatedQuiz, name);
                    }}
                    className='px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center'
                  >
                    <Save size={16} className='mr-1' />
                    Lưu
                  </button>
                  <button
                    onClick={() => exportQuiz(generatedQuiz, 'json')}
                    className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center'
                  >
                    <Download size={16} className='mr-1' />
                    JSON
                  </button>
                  <button
                    onClick={() => exportQuiz(generatedQuiz, 'txt')}
                    className='px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center'
                  >
                    <Download size={16} className='mr-1' />
                    TXT
                  </button>
                </div>
              </div>

              {/* Quiz Metadata */}
              <div className='bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {generatedQuiz.questions.length}
                  </div>
                  <div className='text-sm text-gray-600'>Câu hỏi</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {config.level}
                  </div>
                  <div className='text-sm text-gray-600'>Mức độ</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {questionTypes.find(t => t.id === config.type)?.icon}
                  </div>
                  <div className='text-sm text-gray-600'>Dạng bài</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-orange-600'>
                    {generatedQuiz.questions.reduce(
                      (sum, q) => sum + (q.points || 1),
                      0
                    )}
                  </div>
                  <div className='text-sm text-gray-600'>Điểm tối đa</div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className='space-y-4 max-h-96 overflow-y-auto'>
                {generatedQuiz.questions.map((question, index) => (
                  <div
                    key={question.id || index}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='font-medium text-gray-900'>
                        {index + 1}. {question.question}
                      </h3>
                      <span className='text-xs bg-gray-100 px-2 py-1 rounded'>
                        {question.type}
                      </span>
                    </div>

                    {/* Question Content Based on Type */}
                    {question.type === 'multiple_choice' && (
                      <div className='mt-3'>
                        {question.options.map((option, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded mb-1 ${
                              i === question.correct_answer
                                ? 'bg-green-100 border border-green-300'
                                : 'bg-gray-50'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {option}
                            {i === question.correct_answer && (
                              <CheckCircle
                                className='inline ml-2 text-green-600'
                                size={16}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'fill_blank' && (
                      <div className='mt-3'>
                        <div className='bg-gray-50 p-2 rounded mb-2'>
                          {question.sentence}
                        </div>
                        <div className='text-green-600 font-medium'>
                          ✓ {question.correct_answer}
                        </div>
                        {question.acceptable_answers &&
                          question.acceptable_answers.length > 1 && (
                            <div className='text-sm text-gray-600'>
                              Also acceptable:{' '}
                              {question.acceptable_answers
                                .filter(a => a !== question.correct_answer)
                                .join(', ')}
                            </div>
                          )}
                      </div>
                    )}

                    {question.type === 'sentence_transformation' && (
                      <div className='mt-3 space-y-2'>
                        <div className='bg-gray-50 p-2 rounded'>
                          <strong>Original:</strong>{' '}
                          {question.original_sentence}
                        </div>
                        <div className='bg-blue-50 p-2 rounded'>
                          <strong>Key word:</strong> {question.key_word}
                        </div>
                        <div className='bg-green-50 p-2 rounded'>
                          <strong>Answer:</strong> {question.full_answer}
                        </div>
                      </div>
                    )}

                    {question.type === 'true_false' && (
                      <div className='mt-3'>
                        <div className='bg-gray-50 p-2 rounded mb-2'>
                          {question.statement}
                        </div>
                        <div
                          className={`font-medium ${question.correct_answer ? 'text-green-600' : 'text-red-600'}`}
                        >
                          ✓ {question.correct_answer ? 'TRUE' : 'FALSE'}
                        </div>
                      </div>
                    )}

                    {question.explanation && (
                      <div className='mt-3 p-2 bg-blue-50 rounded text-sm'>
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
              <Brain className='mx-auto mb-4 text-gray-400' size={64} />
              <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                Chưa có quiz nào được tạo
              </h3>
              <p className='text-gray-500'>
                Cấu hình các tùy chọn bên trái và nhấn "Tạo Quiz" để bắt đầu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
