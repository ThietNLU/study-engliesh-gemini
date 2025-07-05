import React, { useState, useEffect } from 'react';

// Hooks
import { useVocabulary } from './hooks/useVocabulary';
import { useFavorites } from './hooks/useFavorites';
import { useApiKey } from './hooks/useApiKey';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import ModeSelector from './components/ModeSelector';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import AddWordMode from './components/AddWordMode';
import AIMode from './components/AIMode';
import ManageMode from './components/ManageMode';
import DatabaseManager from './components/DatabaseManager';
import Statistics from './components/Statistics';
import Footer from './components/Footer';
import EmptyState from './components/EmptyState';

// Services
import geminiService from './services/geminiService';

// Utils
import { checkDuplicate, filterVocabulary } from './utils/helpers';

const EnglishVocabApp = () => {
  // State management
  const [currentMode, setCurrentMode] = useState('home');
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [quizType, setQuizType] = useState('meaning');
  const [accent, setAccent] = useState('us');
  const [editingWord, setEditingWord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiRequest, setAiRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);

  // Form state for adding new words
  const [newWord, setNewWord] = useState({
    english: '',
    vietnamese: '',
    pronunciation_us: '',
    pronunciation_uk: '',
    category: 'nouns',
    definition: '',
    example: '',
    level: 'A1'
  });

  // Custom hooks
  const { vocabulary, addWord, updateWord, deleteWord, addWordsFromAI, refreshVocabulary } = useVocabulary();
  const { favorites, toggleFavorite } = useFavorites();
  const { apiKey, setApiKey } = useApiKey();

  // Watch vocabulary changes and reset to home when it becomes empty
  useEffect(() => {
    if (vocabulary.length === 0 && currentMode !== 'home' && currentMode !== 'add' && currentMode !== 'ai') {
      setCurrentMode('home');
    }
  }, [vocabulary.length, currentMode]);

  // Computed values
  const filteredVocabulary = filterVocabulary(vocabulary, searchTerm);
  const currentWord = vocabulary[currentCard];

  // Event handlers
  const addNewWord = () => {
    if (!newWord.english.trim() || !newWord.vietnamese.trim()) {
      alert('Hãy nhập ít nhất từ tiếng Anh và nghĩa tiếng Việt');
      return;
    }

    const existingWord = checkDuplicate(vocabulary, newWord.english);
    if (existingWord) {
      alert(`Từ "${newWord.english}" đã tồn tại trong cơ sở dữ liệu!`);
      return;
    }

    const wordToAdd = {
      ...newWord,
      english: newWord.english.trim(),
      vietnamese: newWord.vietnamese.trim(),
    };

    addWord(wordToAdd);
    setNewWord({
      english: '',
      vietnamese: '',
      pronunciation_us: '',
      pronunciation_uk: '',
      category: 'nouns',
      definition: '',
      example: '',
      level: 'A1'
    });
    
    // If this was the first word, switch to home mode to show the vocabulary
    if (vocabulary.length === 0) {
      setCurrentMode('home');
    }
    
    alert('Đã thêm từ mới thành công!');
  };

  const handleDeleteWord = (id) => {
    if (confirm('Bạn có chắc muốn xóa từ này?')) {
      deleteWord(id);
      if (currentCard >= vocabulary.length - 1) {
        setCurrentCard(0);
      }
    }
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % vocabulary.length);
    setShowAnswer(false);
    setUserAnswer('');
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    setShowAnswer(false);
    setUserAnswer('');
  };

  const checkAnswer = () => {
    const isCorrect = quizType === 'meaning' 
      ? userAnswer.toLowerCase().includes(currentWord.vietnamese.toLowerCase()) ||
        currentWord.vietnamese.toLowerCase().includes(userAnswer.toLowerCase())
      : userAnswer.toLowerCase().includes(currentWord.english.toLowerCase()) ||
        currentWord.english.toLowerCase().includes(userAnswer.toLowerCase());
    
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setShowAnswer(true);
  };

  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 });
    setCurrentCard(0);
    setShowAnswer(false);
    setUserAnswer('');
  };

  const generateVocabularyWithAI = async () => {
    setIsLoading(true);
    
    try {
      const existingWords = vocabulary.map(w => w.english.toLowerCase());
      console.log('Sending request to Gemini...');
      console.log('Request:', aiRequest);
      console.log('Existing words count:', existingWords.length);
      
      const aiWords = await geminiService.generateVocabulary(aiRequest, existingWords, apiKey);
      console.log('Received AI words:', aiWords);
      
      if (!aiWords || aiWords.length === 0) {
        throw new Error('AI không tạo được từ vựng nào');
      }
      
      const newWords = await addWordsFromAI(aiWords);
      setAiRequest('');
      
      // If this was the first time adding words, switch to home mode
      if (vocabulary.length === 0) {
        setCurrentMode('home');
      }
      
      alert(`✅ Đã thêm ${aiWords.length} từ vựng mới từ AI!\n\nCác từ mới: ${aiWords.map(w => w.english).join(', ')}`);
      
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert(`❌ ${error.message}\n\n💡 Gợi ý:\n- Kiểm tra API key Gemini\n- Kiểm tra kết nối internet\n- Thử yêu cầu đơn giản hơn`);
    } finally {
      setIsLoading(false);
    }
  };

  // Render empty state if no vocabulary AND user is on home mode
  if (vocabulary.length === 0 && currentMode === 'home') {
    return <EmptyState setCurrentMode={setCurrentMode} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header accent={accent} setAccent={setAccent} />
        
        <ModeSelector 
          currentMode={currentMode} 
          setCurrentMode={setCurrentMode}
          resetQuiz={resetQuiz}
        />

        {/* Home Page */}
        {currentMode === 'home' && (
          <HomePage
            vocabulary={vocabulary}
            favorites={favorites}
            setCurrentMode={setCurrentMode}
            score={score}
            currentWord={currentWord}
          />
        )}

        {/* Study Mode */}
        {currentMode === 'study' && (
          <StudyMode
            currentWord={currentWord}
            currentCard={currentCard}
            vocabulary={vocabulary}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            accent={accent}
            nextCard={nextCard}
            prevCard={prevCard}
          />
        )}

        {/* Quiz Mode */}
        {currentMode === 'quiz' && (
          <QuizMode
            currentWord={currentWord}
            quizType={quizType}
            setQuizType={setQuizType}
            score={score}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            nextCard={nextCard}
            accent={accent}
          />
        )}

        {/* Add New Word Mode */}
        {currentMode === 'add' && (
          <AddWordMode
            newWord={newWord}
            setNewWord={setNewWord}
            addNewWord={addNewWord}
          />
        )}

        {/* AI Generate Words Mode */}
        {currentMode === 'ai' && (
          <AIMode
            aiRequest={aiRequest}
            setAiRequest={setAiRequest}
            apiKey={apiKey}
            setApiKey={setApiKey}
            showApiSettings={showApiSettings}
            setShowApiSettings={setShowApiSettings}
            isLoading={isLoading}
            generateVocabularyWithAI={generateVocabularyWithAI}
            vocabulary={vocabulary}
          />
        )}

        {/* Manage Words Mode */}
        {currentMode === 'manage' && (
          <ManageMode
            filteredVocabulary={filteredVocabulary}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            editingWord={editingWord}
            setEditingWord={setEditingWord}
            vocabulary={vocabulary}
            updateWord={updateWord}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            deleteWord={handleDeleteWord}
            accent={accent}
          />
        )}

        {/* Database Manager Mode */}
        {currentMode === 'database' && (
          <DatabaseManager onDataCleared={refreshVocabulary} />
        )}

        {/* Statistics - Only show on non-home pages */}
        {currentMode !== 'home' && currentMode !== 'database' && (
          <Statistics vocabulary={vocabulary} favorites={favorites} />
        )}

        <Footer />
      </div>
    </div>
  );
};

export default EnglishVocabApp;