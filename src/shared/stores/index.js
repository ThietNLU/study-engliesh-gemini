// Export all stores
export { useLearningStore } from './learningStore';
export { useUIStore } from './uiStore';
export { useDataStore } from './dataStore';
export { default as useFlashcardStore } from './flashcardStore';

// Import for combined hooks
import { useLearningStore } from './learningStore';
import { useUIStore } from './uiStore';
import { useDataStore } from './dataStore';

// Combined hooks for common patterns
export const useAppState = () => {
  const learningState = useLearningStore();
  const uiState = useUIStore();
  const dataState = useDataStore();

  return {
    // Learning state
    score: learningState.score,
    currentCard: learningState.currentCard,
    showAnswer: learningState.showAnswer,
    userAnswer: learningState.userAnswer,
    quizType: learningState.quizType,
    studyStats: learningState.getStudyStats(),

    // UI state
    currentMode: uiState.currentMode,
    isLoading: uiState.isLoading,
    searchTerm: uiState.searchTerm,
    accent: uiState.accent,

    // Data state
    vocabulary: dataState.vocabulary,
    favorites: dataState.favorites,
    apiKey: dataState.apiKey,

    // Actions
    learning: {
      setScore: learningState.setScore,
      nextCard: learningState.nextCard,
      prevCard: learningState.prevCard,
      resetQuiz: learningState.resetQuiz,
      startStudySession: learningState.startStudySession,
      completeStudySession: learningState.completeStudySession,
    },

    ui: {
      setCurrentMode: uiState.setCurrentMode,
      setSearchTerm: uiState.setSearchTerm,
      showNotification: uiState.showNotification,
    },

    data: {
      addWord: dataState.addWord,
      updateWord: dataState.updateWord,
      deleteWord: dataState.deleteWord,
      toggleFavorite: dataState.toggleFavorite,
      getFilteredVocabulary: dataState.getFilteredVocabulary,
    },
  };
};

// Selector hooks for performance optimization
export const useVocabulary = () => useDataStore(state => state.vocabulary);
export const useFavorites = () => useDataStore(state => state.favorites);
export const useCurrentMode = () => useUIStore(state => state.currentMode);
export const useScore = () => useLearningStore(state => state.score);
export const useStudyProgress = () =>
  useLearningStore(state => ({
    streak: state.streak,
    totalStudyTime: state.totalStudyTime,
    wordsLearned: state.wordsLearned,
    studyStats: state.getStudyStats(),
  }));
