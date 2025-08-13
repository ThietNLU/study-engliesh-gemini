import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Clock,
  Target,
  Award,
  BookOpen,
  Volume2
} from 'lucide-react';
import { speak } from '../../../shared/utils/helpers';

const QuizPlayer = ({ quiz, onComplete, onExit }) => {
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeEnded, setTimeEnded] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!timeStarted) {
      setTimeStarted(Date.now());
    }
  }, [timeStarted]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const totalQuestions = quiz.questions.length;

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || '');
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '');
      setShowExplanation(false);
    }
  };

  const finishQuiz = () => {
    setTimeEnded(Date.now());
    setShowResults(true);
  };

  const calculateResults = () => {
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const points = question.points || 1;
      totalPoints += points;

      if (isAnswerCorrect(question, userAnswer)) {
        correct++;
        earnedPoints += points;
      }
    });

    const percentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
    const timeSpent = timeEnded && timeStarted ? Math.round((timeEnded - timeStarted) / 1000) : 0;

    return {
      correct,
      incorrect: totalQuestions - correct,
      percentage,
      earnedPoints,
      totalPoints,
      timeSpent,
      grade: getGrade(percentage)
    };
  };

  const isAnswerCorrect = (question, userAnswer) => {
    if (!userAnswer) return false;

    switch (question.type) {
      case 'multiple_choice':
        return userAnswer === question.correct_answer;
      
      case 'fill_blank':
        const acceptable = question.acceptable_answers || [question.correct_answer];
        return acceptable.some(answer => 
          answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()
        );
      
      case 'sentence_transformation':
        return userAnswer.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
      
      case 'true_false':
        return userAnswer === question.correct_answer;
      
      case 'matching':
        // For matching, userAnswer should be an object with matches
        return JSON.stringify(userAnswer) === JSON.stringify(question.correct_matches);
      
      case 'ordering':
        return JSON.stringify(userAnswer) === JSON.stringify(question.correct_order);
      
      case 'gap_fill':
        // Check all gaps
        return question.gaps.every(gap => {
          const userGapAnswer = userAnswer[gap.number];
          const acceptable = gap.acceptable_answers || [gap.correct_answer];
          return acceptable.some(answer => 
            answer.toLowerCase().trim() === userGapAnswer?.toLowerCase().trim()
          );
        });
      
      default:
        return false;
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { letter: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { letter: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { letter: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { letter: 'D', color: 'text-orange-600' };
    return { letter: 'F', color: 'text-red-600' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setTimeStarted(Date.now());
    setTimeEnded(null);
    setSelectedAnswer('');
    setShowExplanation(false);
  };

  // Render results screen
  if (showResults) {
    const results = calculateResults();
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <Award className={`mx-auto mb-4 ${results.grade.color}`} size={64} />
          <h1 className="text-3xl font-bold mb-2">Quiz hoàn thành!</h1>
          <div className={`text-6xl font-bold mb-6 ${results.grade.color}`}>
            {results.grade.letter}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
              <div className="text-2xl font-bold text-green-600">{results.correct}</div>
              <div className="text-sm text-gray-600">Đúng</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <XCircle className="mx-auto mb-2 text-red-600" size={32} />
              <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
              <div className="text-sm text-gray-600">Sai</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <Target className="mx-auto mb-2 text-blue-600" size={32} />
              <div className="text-2xl font-bold text-blue-600">{results.percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <Clock className="mx-auto mb-2 text-purple-600" size={32} />
              <div className="text-2xl font-bold text-purple-600">{formatTime(results.timeSpent)}</div>
              <div className="text-sm text-gray-600">Thời gian</div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-lg font-semibold mb-2">Điểm số</div>
            <div className="text-3xl font-bold text-indigo-600">
              {results.earnedPoints} / {results.totalPoints}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={restartQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <RotateCcw className="mr-2" size={20} />
              Làm lại
            </button>
            <button
              onClick={() => setShowResults(false)}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <BookOpen className="mr-2" size={20} />
              Xem đáp án
            </button>
            <button
              onClick={onExit}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render question screen
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Quiz Mode</h1>
            <button
              onClick={onExit}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold flex-1">
                {currentQuestion.question}
              </h2>
              {currentQuestion.sentence && (
                <button
                  onClick={() => speak(currentQuestion.sentence)}
                  className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Volume2 size={20} />
                </button>
              )}
            </div>

            {/* Question Type Specific Rendering */}
            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswer(index)}
                      className="mr-3"
                    />
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'fill_blank' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg text-lg">
                  {currentQuestion.sentence}
                </div>
                <input
                  type="text"
                  placeholder="Nhập câu trả lời..."
                  value={selectedAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {currentQuestion.type === 'sentence_transformation' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mb-2">
                    <strong>Original:</strong> {currentQuestion.original_sentence}
                  </div>
                  <div className="mb-2">
                    <strong>Key word:</strong> <span className="bg-yellow-200 px-2 py-1 rounded">{currentQuestion.key_word}</span>
                  </div>
                  <div>
                    <strong>Rewrite:</strong> {currentQuestion.target_structure}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Nhập từ cần điền..."
                  value={selectedAnswer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {currentQuestion.type === 'true_false' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg text-lg">
                  {currentQuestion.statement}
                </div>
                <div className="flex space-x-4">
                  <label className={`flex-1 p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    selectedAnswer === true ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="answer"
                      value="true"
                      checked={selectedAnswer === true}
                      onChange={() => handleAnswer(true)}
                      className="sr-only"
                    />
                    <div className="text-lg font-semibold text-green-600">TRUE</div>
                  </label>
                  <label className={`flex-1 p-4 border rounded-lg cursor-pointer text-center transition-all ${
                    selectedAnswer === false ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="answer"
                      value="false"
                      checked={selectedAnswer === false}
                      onChange={() => handleAnswer(false)}
                      className="sr-only"
                    />
                    <div className="text-lg font-semibold text-red-600">FALSE</div>
                  </label>
                </div>
              </div>
            )}

            {/* Show explanation if requested */}
            {showExplanation && currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Giải thích:</h4>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="mr-2" size={20} />
              Câu trước
            </button>

            <div className="flex space-x-2">
              {currentQuestion.explanation && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  {showExplanation ? 'Ẩn' : 'Hiện'} giải thích
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!selectedAnswer && selectedAnswer !== 0 && selectedAnswer !== false}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLastQuestion ? 'Hoàn thành' : 'Câu tiếp'}
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;
