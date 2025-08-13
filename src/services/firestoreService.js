import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  // limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection names
const COLLECTIONS = {
  VOCABULARY: 'vocabulary',
  FAVORITES: 'favorites',
  USER_SETTINGS: 'userSettings',
};

// User ID fallback for local development (khi chưa có authentication)
const DEFAULT_USER_ID = 'default_user';

// Get current user ID (sẽ được cập nhật khi có authentication)
const getCurrentUserId = () => {
  // TODO: Integrate with Firebase Auth when implemented
  return DEFAULT_USER_ID;
};

// ===== VOCABULARY OPERATIONS =====

export const vocabularyService = {
  // Get all vocabulary words for current user
  async getAll() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
      const q = query(
        vocabularyRef,
        where('userId', '==', userId),
        orderBy('dateAdded', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const vocabulary = [];

      querySnapshot.forEach(doc => {
        vocabulary.push({
          id: doc.id,
          ...doc.data(),
          dateAdded:
            doc.data().dateAdded?.toDate?.()?.toISOString() ||
            doc.data().dateAdded,
        });
      });

      return vocabulary;
    } catch (error) {
      console.error('Error getting vocabulary:', error);
      throw error;
    }
  },

  // Add a new word
  async add(wordData) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);

      const newWord = {
        ...wordData,
        userId,
        dateAdded: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(vocabularyRef, newWord);

      // Return the word with the generated ID
      return {
        id: docRef.id,
        ...newWord,
        dateAdded: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  },

  // Add multiple words (from AI)
  async addMultiple(wordsArray) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const batch = writeBatch(db);
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);

      const addedWords = [];

      for (const wordData of wordsArray) {
        const docRef = doc(vocabularyRef);
        const newWord = {
          ...wordData,
          userId,
          dateAdded: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        batch.set(docRef, newWord);
        addedWords.push({
          id: docRef.id,
          ...newWord,
          dateAdded: new Date().toISOString(),
        });
      }

      await batch.commit();
      return addedWords;
    } catch (error) {
      console.error('Error adding multiple words:', error);
      throw error;
    }
  },

  // Update a word
  async update(wordId, updateData) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      // Ensure wordId is a string
      const wordIdString = String(wordId);
      const wordRef = doc(db, COLLECTIONS.VOCABULARY, wordIdString);

      const updatedData = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(wordRef, updatedData);
      return { id: wordId, ...updatedData };
    } catch (error) {
      console.error('Error updating word:', error);
      throw error;
    }
  },

  // Delete a word
  async delete(wordId) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      // Ensure wordId is a string
      const wordIdString = String(wordId);
      const wordRef = doc(db, COLLECTIONS.VOCABULARY, wordIdString);
      await deleteDoc(wordRef);
      return wordId;
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  },

  // Get words by category
  async getByCategory(category) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
      const q = query(
        vocabularyRef,
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('dateAdded', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const vocabulary = [];

      querySnapshot.forEach(doc => {
        vocabulary.push({
          id: doc.id,
          ...doc.data(),
          dateAdded:
            doc.data().dateAdded?.toDate?.()?.toISOString() ||
            doc.data().dateAdded,
        });
      });

      return vocabulary;
    } catch (error) {
      console.error('Error getting vocabulary by category:', error);
      throw error;
    }
  },

  // Get words by CEFR level
  async getByCEFRLevel(level) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
      const q = query(
        vocabularyRef,
        where('userId', '==', userId),
        where('level', '==', level),
        orderBy('dateAdded', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const vocabulary = [];

      querySnapshot.forEach(doc => {
        vocabulary.push({
          id: doc.id,
          ...doc.data(),
          dateAdded:
            doc.data().dateAdded?.toDate?.()?.toISOString() ||
            doc.data().dateAdded,
        });
      });

      return vocabulary;
    } catch (error) {
      console.error('Error getting vocabulary by CEFR level:', error);
      throw error;
    }
  },

  // Clear all vocabulary for current user
  async clear() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
      const q = query(vocabularyRef, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('All vocabulary cleared successfully!');
      return true;
    } catch (error) {
      console.error('Error clearing vocabulary:', error);
      throw error;
    }
  },
};

// ===== FAVORITES OPERATIONS =====

export const favoritesService = {
  // Get all favorites for current user
  async getAll() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
      const q = query(favoritesRef, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      const favorites = new Set();

      querySnapshot.forEach(doc => {
        favorites.add(doc.data().wordId);
      });

      return favorites;
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },

  // Add to favorites
  async add(wordId) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const favoritesRef = collection(db, COLLECTIONS.FAVORITES);

      const favoriteData = {
        userId,
        wordId,
        createdAt: serverTimestamp(),
      };

      await addDoc(favoritesRef, favoriteData);
      return wordId;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  // Remove from favorites
  async remove(wordId) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
      const q = query(
        favoritesRef,
        where('userId', '==', userId),
        where('wordId', '==', wordId)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return wordId;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Toggle favorite status
  async toggle(wordId) {
    try {
      const favorites = await this.getAll();

      if (favorites.has(wordId)) {
        await this.remove(wordId);
        return false;
      } else {
        await this.add(wordId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },
};

// ===== USER SETTINGS OPERATIONS =====

export const userSettingsService = {
  // Initialize user settings if not exists
  async initialize() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
      const docSnap = await getDoc(settingsRef);

      if (!docSnap.exists()) {
        const defaultSettings = {
          apiKey: '',
          theme: 'light',
          language: 'vi',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(settingsRef, defaultSettings);
        console.log('User settings initialized with default values');
        return defaultSettings;
      }

      return docSnap.data();
    } catch (error) {
      console.error('Error initializing user settings:', error);
      throw error;
    }
  },

  // Get user settings
  async get() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
      const docSnap = await getDoc(settingsRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Initialize and return default settings
        return await this.initialize();
      }
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  // Update user settings
  async update(settingsData) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);

      // Get current settings first
      const currentDoc = await getDoc(settingsRef);
      const currentSettings = currentDoc.exists() ? currentDoc.data() : {};

      const updatedSettings = {
        ...currentSettings,
        ...settingsData,
        updatedAt: serverTimestamp(),
      };

      // Use setDoc to create or update the document
      await setDoc(settingsRef, updatedSettings, { merge: true });
      return updatedSettings;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  // Set API key
  async setApiKey(apiKey) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);

      // Use setDoc with merge to create or update
      const settingsData = {
        apiKey,
        updatedAt: serverTimestamp(),
      };

      await setDoc(settingsRef, settingsData, { merge: true });
      return { apiKey };
    } catch (error) {
      console.error('Error setting API key:', error);
      throw error;
    }
  },

  // Get API key
  async getApiKey() {
    try {
      const settings = await this.get();
      return settings.apiKey || '';
    } catch (error) {
      console.error('Error getting API key:', error);
      return '';
    }
  },
};

// ===== DATA MIGRATION AND BACKUP =====

export const migrationService = {
  // Import data from Local Storage to Firestore
  async importFromLocalStorage() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      // Get data from Local Storage
      const vocabularyData = JSON.parse(
        localStorage.getItem('englishVocabulary') || '[]'
      );
      const favoritesData = JSON.parse(
        localStorage.getItem('favorites') || '[]'
      );
      const apiKey = localStorage.getItem('geminiApiKey') || '';

      console.log(
        `Importing ${vocabularyData.length} words and ${favoritesData.length} favorites...`
      );

      // Import vocabulary
      if (vocabularyData.length > 0) {
        await vocabularyService.addMultiple(vocabularyData);
      }

      // Import favorites
      for (const wordId of favoritesData) {
        try {
          await favoritesService.add(wordId);
        } catch (error) {
          console.warn(`Failed to import favorite ${wordId}:`, error);
        }
      }

      // Import API key
      if (apiKey) {
        await userSettingsService.setApiKey(apiKey);
      }

      console.log('Data migration completed successfully!');
      return true;
    } catch (error) {
      console.error('Error during data migration:', error);
      throw error;
    }
  },

  // Export all data from Firestore
  async exportAllData() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const vocabulary = await vocabularyService.getAll();
      const favorites = await favoritesService.getAll();
      const settings = await userSettingsService.get();

      return {
        vocabulary,
        favorites: Array.from(favorites),
        settings,
        exportDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  // Clear all user data
  async clearAllData() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const userId = getCurrentUserId();
      const batch = writeBatch(db);

      // Delete all vocabulary
      const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
      const vocabQuery = query(vocabularyRef, where('userId', '==', userId));
      const vocabSnapshot = await getDocs(vocabQuery);

      vocabSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete all favorites
      const favoritesRef = collection(db, COLLECTIONS.FAVORITES);
      const favQuery = query(favoritesRef, where('userId', '==', userId));
      const favSnapshot = await getDocs(favQuery);

      favSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user settings
      const settingsRef = doc(db, COLLECTIONS.USER_SETTINGS, userId);
      batch.delete(settingsRef);

      await batch.commit();
      console.log('All user data cleared successfully!');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  },
};
