// Export stores (learning & flashcard fully removed)
export { useUIStore } from './uiStore';
export { useDataStore } from './dataStore';

// Import for combined hooks
import { useUIStore } from './uiStore';
import { useDataStore } from './dataStore';

// Combined hooks for common patterns
export const useAppState = () => {
  const uiState = useUIStore();
  const dataState = useDataStore();

  return {
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

// Selector hooks (learning removed)
export const useVocabulary = () => useDataStore(state => state.vocabulary);
export const useFavorites = () => useDataStore(state => state.favorites);
export const useCurrentMode = () => useUIStore(state => state.currentMode);
