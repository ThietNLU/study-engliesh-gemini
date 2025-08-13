import { storage as localStorageHelper } from '../utils/helpers';

// Conditional import for Firestore services
let vocabularyService, favoritesService, userSettingsService, migrationService;

try {
  const firestoreServices = require('./firestoreService');
  vocabularyService = firestoreServices.vocabularyService;
  favoritesService = firestoreServices.favoritesService;
  userSettingsService = firestoreServices.userSettingsService;
  migrationService = firestoreServices.migrationService;
} catch (error) {
  console.warn('Firestore services not available:', error);
}

// Configuration để chọn storage backend
const STORAGE_CONFIG = {
  // Đặt thành 'firestore' để sử dụng Firestore, 'localStorage' để sử dụng Local Storage
  backend: process.env.REACT_APP_STORAGE_BACKEND || 'localStorage', // Default to localStorage for safety

  // Tự động fallback về localStorage nếu Firestore không khả dụng
  autoFallback: true,
};

// Check if Firestore is available
const isFirestoreAvailable = () => {
  try {
    const { db } = require('../config/firebase');
    return db !== null && db !== undefined && vocabularyService !== undefined;
  } catch (error) {
    console.warn('Firestore not available:', error);
    return false;
  }
};

// Determine which storage to use
const getStorageBackend = () => {
  if (STORAGE_CONFIG.backend === 'firestore' && isFirestoreAvailable()) {
    return 'firestore';
  }

  if (STORAGE_CONFIG.autoFallback) {
    console.log('Using localStorage as storage backend');
    return 'localStorage';
  }

  throw new Error('No storage backend available');
};

// ===== UNIFIED STORAGE SERVICE =====

export const storageService = {
  // Get current storage backend
  getBackend() {
    return getStorageBackend();
  },

  // Check if using Firestore
  isUsingFirestore() {
    return this.getBackend() === 'firestore';
  },

  // Vocabulary operations
  vocabulary: {
    async getAll() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.getAll();
      } else {
        return localStorageHelper.getVocabulary();
      }
    },

    async add(wordData) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.add(wordData);
      } else {
        // For localStorage, we need to manually handle the ID and save
        const existing = localStorageHelper.getVocabulary();
        const newWord = {
          ...wordData,
          id: Math.max(...existing.map(w => w.id), 0) + 1,
          dateAdded: new Date().toISOString(),
        };
        const updated = [...existing, newWord];
        localStorageHelper.setVocabulary(updated);

        // Mark that user now has data
        localStorageHelper.setHasEverHadData(true);

        return newWord;
      }
    },

    async addMultiple(wordsArray) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.addMultiple(wordsArray);
      } else {
        const existing = localStorageHelper.getVocabulary();
        const newWords = wordsArray.map((word, index) => ({
          ...word,
          id: Math.max(...existing.map(w => w.id), 0) + index + 1,
          dateAdded: new Date().toISOString(),
        }));
        const updated = [...existing, ...newWords];
        localStorageHelper.setVocabulary(updated);

        // Mark that user now has data
        localStorageHelper.setHasEverHadData(true);

        return newWords;
      }
    },

    async update(wordId, updateData) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.update(wordId, updateData);
      } else {
        const existing = localStorageHelper.getVocabulary();
        const updated = existing.map(word =>
          word.id === wordId ? { ...word, ...updateData } : word
        );
        localStorageHelper.setVocabulary(updated);
        return { id: wordId, ...updateData };
      }
    },

    async delete(wordId) {
      const backend = getStorageBackend();
      console.log(
        'Delete word - Backend:',
        backend,
        'WordId:',
        wordId,
        'Type:',
        typeof wordId
      );

      if (backend === 'firestore') {
        return await vocabularyService.delete(wordId);
      } else {
        const existing = localStorageHelper.getVocabulary();
        const updated = existing.filter(word => word.id !== wordId);
        localStorageHelper.setVocabulary(updated);
        return wordId;
      }
    },

    async getByCategory(category) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.getByCategory(category);
      } else {
        const all = localStorageHelper.getVocabulary();
        return all.filter(word => word.category === category);
      }
    },

    async getByCEFRLevel(level) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.getByCEFRLevel(level);
      } else {
        const all = localStorageHelper.getVocabulary();
        return all.filter(word => word.level === level);
      }
    },

    async clear() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await vocabularyService.clear();
      } else {
        localStorageHelper.setVocabulary([]);
        // Mark that user has had data before (so we know this isn't first time use)
        localStorageHelper.setHasEverHadData(true);
        return true;
      }
    },
  },

  // Favorites operations
  favorites: {
    async getAll() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await favoritesService.getAll();
      } else {
        const favorites = localStorageHelper.getFavorites();
        return new Set(favorites);
      }
    },

    async add(wordId) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await favoritesService.add(wordId);
      } else {
        const existing = localStorageHelper.getFavorites();
        const updated = [...new Set([...existing, wordId])];
        localStorageHelper.setFavorites(updated);
        return wordId;
      }
    },

    async remove(wordId) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await favoritesService.remove(wordId);
      } else {
        const existing = localStorageHelper.getFavorites();
        const updated = existing.filter(id => id !== wordId);
        localStorageHelper.setFavorites(updated);
        return wordId;
      }
    },

    async toggle(wordId) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await favoritesService.toggle(wordId);
      } else {
        const existing = localStorageHelper.getFavorites();
        if (existing.includes(wordId)) {
          await this.remove(wordId);
          return false;
        } else {
          await this.add(wordId);
          return true;
        }
      }
    },
  },

  // Settings operations
  settings: {
    async get() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await userSettingsService.get();
      } else {
        return {
          apiKey: localStorageHelper.getApiKey(),
          theme: 'light',
          language: 'vi',
        };
      }
    },

    async update(settingsData) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await userSettingsService.update(settingsData);
      } else {
        // For localStorage, only save the API key
        if (settingsData.apiKey !== undefined) {
          localStorageHelper.setApiKey(settingsData.apiKey);
        }
        return settingsData;
      }
    },

    async setApiKey(apiKey) {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await userSettingsService.setApiKey(apiKey);
      } else {
        localStorageHelper.setApiKey(apiKey);
        return { apiKey };
      }
    },

    async getApiKey() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await userSettingsService.getApiKey();
      } else {
        return localStorageHelper.getApiKey();
      }
    },
  },

  // Migration and backup operations
  migration: {
    // Check if this is first time use (no vocabulary data exists)
    async isFirstTimeUse() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        const vocab = await vocabularyService.getAll();
        return vocab.length === 0;
      } else {
        // For localStorage, check both if data exists and if user has ever had data
        const hasVocab = localStorage.getItem('englishVocabulary');
        const hasEverHadData = localStorageHelper.getHasEverHadData();

        // First time use: no vocabulary AND never had data before
        return !hasVocab && !hasEverHadData;
      }
    },

    async importFromLocalStorage() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await migrationService.importFromLocalStorage();
      } else {
        // Already using localStorage, nothing to import
        console.log('Already using localStorage, no migration needed');
        return true;
      }
    },

    async exportAllData() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await migrationService.exportAllData();
      } else {
        // Export from localStorage
        const vocabulary = localStorageHelper.getVocabulary();
        const favorites = localStorageHelper.getFavorites();
        const apiKey = localStorageHelper.getApiKey();

        return {
          vocabulary,
          favorites,
          settings: { apiKey },
          exportDate: new Date().toISOString(),
        };
      }
    },

    async clearAllData() {
      const backend = getStorageBackend();

      if (backend === 'firestore') {
        return await migrationService.clearAllData();
      } else {
        // Clear localStorage
        localStorage.removeItem('englishVocabulary');
        localStorage.removeItem('favorites');
        localStorage.removeItem('geminiApiKey');
        // Mark that user has had data before (so we know this isn't first time use)
        localStorageHelper.setHasEverHadData(true);
        console.log('Local Storage cleared successfully!');
        return true;
      }
    },

    // Switch storage backend (useful for testing and migration)
    async switchToFirestore() {
      if (!isFirestoreAvailable()) {
        throw new Error('Firestore is not available');
      }

      // First import current data to Firestore
      await this.importFromLocalStorage();

      // Update config
      STORAGE_CONFIG.backend = 'firestore';

      console.log('Switched to Firestore storage backend');
      return true;
    },

    async switchToLocalStorage() {
      // Export current data if using Firestore
      if (getStorageBackend() === 'firestore') {
        const data = await this.exportAllData();

        // Save to localStorage
        if (data.vocabulary) localStorageHelper.setVocabulary(data.vocabulary);
        if (data.favorites) localStorageHelper.setFavorites(data.favorites);
        if (data.settings?.apiKey)
          localStorageHelper.setApiKey(data.settings.apiKey);
      }

      // Update config
      STORAGE_CONFIG.backend = 'localStorage';

      console.log('Switched to Local Storage backend');
      return true;
    },
  },
};

// Convenience exports for backward compatibility
export const storage = storageService;
export default storageService;
