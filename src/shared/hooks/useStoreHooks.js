import { useEffect } from 'react';
import { useDataStore } from '../stores/dataStore';

// Custom hook thay thế useVocabulary cũ
export const useVocabularyData = () => {
  const {
    vocabulary,
    isLoading,
    error,
    addWord,
    updateWord,
    deleteWord,
    addWordsFromAI,
    refreshVocabulary,
    loadVocabulary,
    clearError,
  } = useDataStore();

  // Auto-load vocabulary on mount
  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  return {
    vocabulary,
    loading: isLoading,
    error,
    addWord,
    updateWord,
    deleteWord,
    addWordsFromAI,
    refreshVocabulary,
    clearError,
  };
};

// Custom hook thay thế useFavorites cũ
export const useFavoritesData = () => {
  const {
    favorites,
    isLoading,
    error,
    toggleFavorite,
    loadFavorites,
    clearError,
  } = useDataStore();

  // Auto-load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading: isLoading,
    error,
    toggleFavorite,
    clearError,
  };
};

// Custom hook thay thế useApiKey cũ
export const useApiKeyData = () => {
  const { apiKey, isLoading, error, setApiKey, loadApiKey, clearError } =
    useDataStore();

  // Auto-load API key on mount
  useEffect(() => {
    loadApiKey();
  }, [loadApiKey]);

  return {
    apiKey,
    loading: isLoading,
    error,
    setApiKey,
    clearError,
  };
};

// Hook để quản lý filtered vocabulary
export const useFilteredVocabulary = searchTerm => {
  const getFilteredVocabulary = useDataStore(
    state => state.getFilteredVocabulary
  );

  return getFilteredVocabulary(searchTerm);
};

// Hook để quản lý vocabulary statistics
export const useVocabularyStats = () => {
  const getVocabularyStats = useDataStore(state => state.getVocabularyStats);

  return getVocabularyStats();
};
