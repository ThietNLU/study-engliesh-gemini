import { storage as localStorageHelper } from '../utils/helpers';

// Safe storage service that only uses localStorage for now
export const safeStorageService = {
  // Get current storage backend
  getBackend() {
    return 'localStorage';
  },

  // Check if using Firestore
  isUsingFirestore() {
    return false;
  },

  // Vocabulary operations
  vocabulary: {
    async getAll() {
      return localStorageHelper.getVocabulary();
    },

    async add(wordData) {
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
    },

    async addMultiple(wordsArray) {
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
    },

    async update(wordId, updateData) {
      const existing = localStorageHelper.getVocabulary();
      const updated = existing.map(word =>
        word.id === wordId ? { ...word, ...updateData } : word
      );
      localStorageHelper.setVocabulary(updated);
      return { id: wordId, ...updateData };
    },

    async delete(wordId) {
      console.log('Safe delete - WordId:', wordId, 'Type:', typeof wordId);
      const existing = localStorageHelper.getVocabulary();
      const updated = existing.filter(word => word.id !== wordId);
      localStorageHelper.setVocabulary(updated);
      return wordId;
    },

    async getByCategory(category) {
      const vocabulary = localStorageHelper.getVocabulary();
      return vocabulary.filter(word => word.category === category);
    },
  },

  // Favorites operations
  favorites: {
    async getAll() {
      const favorites = localStorageHelper.getFavorites();
      return new Set(favorites);
    },

    async add(wordId) {
      const existing = localStorageHelper.getFavorites();
      const updated = [...new Set([...existing, wordId])];
      localStorageHelper.setFavorites(updated);
      return wordId;
    },

    async remove(wordId) {
      const existing = localStorageHelper.getFavorites();
      const updated = existing.filter(id => id !== wordId);
      localStorageHelper.setFavorites(updated);
      return wordId;
    },

    async toggle(wordId) {
      const existing = localStorageHelper.getFavorites();
      if (existing.includes(wordId)) {
        await this.remove(wordId);
        return false;
      } else {
        await this.add(wordId);
        return true;
      }
    },
  },

  // Settings operations
  settings: {
    async getApiKey() {
      return localStorageHelper.getApiKey();
    },

    async setApiKey(apiKey) {
      localStorageHelper.setApiKey(apiKey);
      return apiKey;
    },
  },

  // Migration and backup operations
  migration: {
    // Check if this is first time use (no vocabulary data exists)
    async isFirstTimeUse() {
      const hasVocab = localStorage.getItem('englishVocabulary');
      const hasEverHadData = localStorageHelper.getHasEverHadData();

      // First time use: no vocabulary AND never had data before
      return !hasVocab && !hasEverHadData;
    },

    async exportAllData() {
      const vocabulary = localStorageHelper.getVocabulary();
      const favorites = localStorageHelper.getFavorites();
      const apiKey = localStorageHelper.getApiKey();

      return {
        vocabulary,
        favorites,
        settings: { apiKey },
        exportDate: new Date().toISOString(),
      };
    },

    async clearAllData() {
      localStorage.removeItem('englishVocabulary');
      localStorage.removeItem('favorites');
      localStorage.removeItem('geminiApiKey');
      // Mark that user has had data before (so we know this isn't first time use)
      localStorageHelper.setHasEverHadData(true);
      console.log('Local Storage cleared successfully!');
      return true;
    },
  },
};

export default safeStorageService;
