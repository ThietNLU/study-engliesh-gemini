import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import storageService from '../services/storageService';
import { initialVocabulary } from '../../features/vocab/data/initialVocabulary';

// Data Store - quản lý vocabulary và favorites data
export const useDataStore = create(
  subscribeWithSelector((set, get) => ({
    // Data state
    vocabulary: [],
    favorites: new Set(),
    apiKey: '',

    // Loading and error states
    isLoading: false,
    error: null,

    // Data operations

    // Vocabulary operations
    loadVocabulary: async () => {
      set({ isLoading: true, error: null });

      try {
        const savedVocab = await storageService.vocabulary.getAll();

        if (savedVocab.length > 0) {
          set({ vocabulary: savedVocab });
        } else {
          // Check if this is first time use
          const isFirstTime = await storageService.migration.isFirstTimeUse();

          if (isFirstTime) {
            // First time use - initialize with sample data
            set({ vocabulary: initialVocabulary });
            await storageService.vocabulary.addMultiple(initialVocabulary);
          } else {
            // User has explicitly cleared data
            set({ vocabulary: [] });
          }
        }
      } catch (err) {
        console.error('Error loading vocabulary:', err);
        set({ error: err.message, vocabulary: initialVocabulary });
      } finally {
        set({ isLoading: false });
      }
    },

    addWord: async newWord => {
      set({ isLoading: true, error: null });

      try {
        const wordToAdd = await storageService.vocabulary.add(newWord);
        set(state => ({
          vocabulary: [...state.vocabulary, wordToAdd],
        }));
        return wordToAdd;
      } catch (err) {
        console.error('Error adding word:', err);
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    updateWord: async (id, updatedWord) => {
      set({ isLoading: true, error: null });

      try {
        await storageService.vocabulary.update(id, updatedWord);
        set(state => ({
          vocabulary: state.vocabulary.map(word =>
            word.id === id ? { ...word, ...updatedWord } : word
          ),
        }));
      } catch (err) {
        console.error('Error updating word:', err);
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteWord: async id => {
      set({ isLoading: true, error: null });

      try {
        await storageService.vocabulary.delete(id);
        set(state => ({
          vocabulary: state.vocabulary.filter(word => word.id !== id),
          favorites: new Set([...state.favorites].filter(fId => fId !== id)),
        }));
      } catch (err) {
        console.error('Error deleting word:', err);
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    addWordsFromAI: async aiWords => {
      set({ isLoading: true, error: null });

      try {
        const newWords = await storageService.vocabulary.addMultiple(aiWords);
        set(state => ({
          vocabulary: [...state.vocabulary, ...newWords],
        }));
        return newWords;
      } catch (err) {
        console.error('Error adding words from AI:', err);
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    refreshVocabulary: async () => {
      set({ isLoading: true, error: null });

      try {
        const savedVocab = await storageService.vocabulary.getAll();

        if (savedVocab.length > 0) {
          set({ vocabulary: savedVocab });
        } else {
          const isFirstTime = await storageService.migration.isFirstTimeUse();

          if (isFirstTime) {
            set({ vocabulary: initialVocabulary });
            await storageService.vocabulary.addMultiple(initialVocabulary);
          } else {
            set({ vocabulary: [] });
          }
        }
      } catch (err) {
        console.error('Error refreshing vocabulary:', err);
        set({ error: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    // Favorites operations
    loadFavorites: async () => {
      set({ isLoading: true, error: null });

      try {
        const savedFavorites = await storageService.favorites.getAll();
        set({ favorites: savedFavorites });
      } catch (err) {
        console.error('Error loading favorites:', err);
        set({ error: err.message, favorites: new Set() });
      } finally {
        set({ isLoading: false });
      }
    },

    toggleFavorite: async id => {
      set({ isLoading: true, error: null });

      try {
        const isFavorite = await storageService.favorites.toggle(id);

        set(state => {
          const newFavorites = new Set(state.favorites);
          if (isFavorite) {
            newFavorites.add(id);
          } else {
            newFavorites.delete(id);
          }
          return { favorites: newFavorites };
        });

        return isFavorite;
      } catch (err) {
        console.error('Error toggling favorite:', err);
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    // API Key operations
    loadApiKey: async () => {
      set({ isLoading: true, error: null });

      try {
        const savedApiKey = await storageService.settings.getApiKey();
        set({ apiKey: savedApiKey });
      } catch (err) {
        console.error('Error loading API key:', err);
        set({ error: err.message, apiKey: '' });
      } finally {
        set({ isLoading: false });
      }
    },

    setApiKey: async newApiKey => {
      set({ isLoading: true, error: null });

      try {
        await storageService.settings.setApiKey(newApiKey);
        set({ apiKey: newApiKey });
      } catch (err) {
        console.error('Error saving API key:', err);
        set({ error: err.message });
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    // Computed values
    getFilteredVocabulary: searchTerm => {
      const { vocabulary } = get();
      if (!searchTerm) return vocabulary;

      const search = searchTerm.toLowerCase();
      return vocabulary.filter(
        word =>
          word.english.toLowerCase().includes(search) ||
          word.vietnamese.toLowerCase().includes(search) ||
          word.category.toLowerCase().includes(search) ||
          (word.definition && word.definition.toLowerCase().includes(search)) ||
          (word.example && word.example.toLowerCase().includes(search))
      );
    },

    getWordById: id => {
      const { vocabulary } = get();
      return vocabulary.find(word => word.id === id);
    },

    getWordsByCategory: category => {
      const { vocabulary } = get();
      return vocabulary.filter(word => word.category === category);
    },

    getFavoriteWords: () => {
      const { vocabulary, favorites } = get();
      return vocabulary.filter(word => favorites.has(word.id));
    },

    // Statistics
    getVocabularyStats: () => {
      const { vocabulary, favorites } = get();

      // Category stats
      const categoryStats = vocabulary.reduce((acc, word) => {
        acc[word.category] = (acc[word.category] || 0) + 1;
        return acc;
      }, {});

      // Level stats
      const levelStats = vocabulary.reduce((acc, word) => {
        acc[word.level] = (acc[word.level] || 0) + 1;
        return acc;
      }, {});

      return {
        total: vocabulary.length,
        favorites: favorites.size,
        categories: categoryStats,
        levels: levelStats,
      };
    },

    // Initialize all data
    initializeData: async () => {
      set({ isLoading: true, error: null });

      try {
        await Promise.all([
          get().loadVocabulary(),
          get().loadFavorites(),
          get().loadApiKey(),
        ]);
      } catch (err) {
        console.error('Error initializing data:', err);
        set({ error: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    // Clear all data
    clearAllData: async () => {
      set({ isLoading: true, error: null });

      try {
        await storageService.clearAll();
        set({
          vocabulary: [],
          favorites: new Set(),
          apiKey: '',
        });
      } catch (err) {
        console.error('Error clearing data:', err);
        set({ error: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    // Error handling
    clearError: () => set({ error: null }),
  }))
);
