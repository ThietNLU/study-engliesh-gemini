import React, { useEffect } from 'react';

// Feature imports
import { StudyMode, FlashcardMode, FlashcardManager, FlashcardStats } from '../features/flashcard';
import { QuizMode } from '../features/quiz';
import {
  AddWordMode,
  ManageMode,
  DatabaseManager,
  Statistics,
} from '../features/vocab';
import { AIMode, geminiService } from '../features/ai';

// Shared imports
import {
  Header,
  HomePage,
  ModeSelector,
  Footer,
  EmptyState,
  checkDuplicate,
  filterVocabulary,
} from '../shared';

// Store imports
import {
  useLearningStore,
  useUIStore,
  useDataStore,
  useFlashcardStore,
} from '../shared/stores';

// New components
import NotificationToast from '../shared/ui/NotificationToast';
import ConfirmDialog from '../shared/ui/ConfirmDialog';

const EnglishVocabApp = () => {
  // Zustand stores
  const learningStore = useLearningStore();
  const uiStore = useUIStore();
  const dataStore = useDataStore();

  // Destructure commonly used state and actions
  const {
    currentMode,
    editingWord,
    searchTerm,
    aiRequest,
    isLoading,
    showApiSettings,
    newWord,
    accent,
    setCurrentMode,
    setEditingWord,
    setSearchTerm,
    setAiRequest,
    setIsLoading,
    setShowApiSettings,
    setNewWord,
    setAccent,
    showNotification,
    setLoading,
  } = uiStore;

  const {
    score,
    currentCard,
    showAnswer,
    userAnswer,
    quizType,
    setScore,
    setCurrentCard,
    setShowAnswer,
    setUserAnswer,
    setQuizType,
    nextCard,
    prevCard,
    resetQuiz,
    startStudySession,
  } = learningStore;

  const {
    vocabulary,
    favorites,
    apiKey,
    addWord,
    updateWord,
    deleteWord,
    addWordsFromAI,
    refreshVocabulary,
    toggleFavorite,
    setApiKey,
    initializeData,
    getFilteredVocabulary,
  } = dataStore;

  // Initialize data on app load
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Watch vocabulary changes and reset to home when it becomes empty
  useEffect(() => {
    if (
      vocabulary.length === 0 &&
      currentMode !== 'home' &&
      currentMode !== 'add' &&
      currentMode !== 'ai'
    ) {
      setCurrentMode('home');
    }
  }, [vocabulary.length, currentMode]);

  // Event handlers
  const addNewWord = () => {
    if (!newWord.english.trim() || !newWord.vietnamese.trim()) {
      showNotification('warning', 'Hãy nhập ít nhất từ tiếng Anh và nghĩa tiếng Việt');
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
      level: 'A1',
    });

    // If this was the first word, switch to home mode to show the vocabulary
    if (vocabulary.length === 0) {
      setCurrentMode('home');
    }

    showNotification('success', 'Đã thêm từ mới thành công!');
  };

  const checkAnswer = () => {
    const currentWord = vocabulary[currentCard];
    const isCorrect =
      quizType === 'meaning'
        ? userAnswer
            .toLowerCase()
            .includes(currentWord.vietnamese.toLowerCase()) ||
          currentWord.vietnamese
            .toLowerCase()
            .includes(userAnswer.toLowerCase())
        : userAnswer
            .toLowerCase()
            .includes(currentWord.english.toLowerCase()) ||
          currentWord.english.toLowerCase().includes(userAnswer.toLowerCase());

    setScore({
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    });
    setShowAnswer(true);
    
    // Update learning progress
    if (currentWord) {
      learningStore.updateWordProgress(currentWord.id, isCorrect);
    }
  };

  const generateVocabularyWithAI = async () => {
    setIsLoading(true);

    try {
      const existingWords = vocabulary.map(w => w.english.toLowerCase());
      console.log('Sending request to Gemini...');
      console.log('Request:', aiRequest);
      console.log('Existing words count:', existingWords.length);

      const aiWords = await geminiService.generateVocabulary(
        aiRequest,
        existingWords,
        apiKey
      );
      console.log('Received AI words:', aiWords);

      if (!aiWords || aiWords.length === 0) {
        throw new Error('AI không tạo được từ vựng nào');
      }

      // Add AI words to vocabulary
      await addWordsFromAI(aiWords);
      setAiRequest('');

      // If this was the first time adding words, switch to home mode
      if (vocabulary.length === 0) {
        setCurrentMode('home');
      }

      showNotification('success', 
        `✅ Đã thêm ${aiWords.length} từ vựng mới từ AI! Các từ mới: ${aiWords.map(w => w.english).join(', ')}`
      );
    } catch (error) {
      console.error('AI Generation Error:', error);
      showNotification('error', 
        `❌ ${error.message}. Gợi ý: Kiểm tra API key Gemini và kết nối internet`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Computed values
  const currentWord = vocabulary[currentCard];
  const filteredVocabulary = getFilteredVocabulary(searchTerm);

  // Handle word operations with notifications
  const handleAddWord = async (wordData) => {
    try {
      await addWord(wordData);
      showNotification('success', 'Đã thêm từ vựng mới thành công!');
      setNewWord({
        english: '',
        vietnamese: '',
        pronunciation_us: '',
        pronunciation_uk: '',
        category: 'nouns',
        definition: '',
        example: '',
        level: 'A1',
      });
    } catch (error) {
      showNotification('error', `Lỗi khi thêm từ: ${error.message}`);
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      await deleteWord(id);
      showNotification('success', 'Đã xóa từ vựng thành công!');
    } catch (error) {
      showNotification('error', `Lỗi khi xóa từ: ${error.message}`);
    }
  };

  // Render empty state if no vocabulary AND user is on home mode
  if (vocabulary.length === 0 && currentMode === 'home') {
    return <EmptyState setCurrentMode={setCurrentMode} />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <Header accent={accent} setAccent={setAccent} />

        <ModeSelector
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
          resetQuiz={() => resetQuiz()}
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
        {currentMode === 'study' && <StudyMode />}

        {/* Flashcard Study Mode */}
        {currentMode === 'flashcard' && <FlashcardMode />}

        {/* Flashcard Manager Mode */}
        {currentMode === 'flashcard-manager' && <FlashcardManager />}

        {/* Flashcard Statistics Mode */}
        {currentMode === 'flashcard-stats' && <FlashcardStats />}

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
            nextCard={() => nextCard(vocabulary.length)}
            accent={accent}
          />
        )}

        {/* Add New Word Mode */}
        {currentMode === 'add' && (
          <AddWordMode
            newWord={newWord}
            setNewWord={setNewWord}
            addNewWord={handleAddWord}
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

        {/* Global UI Components */}
        <NotificationToast />
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default EnglishVocabApp;
