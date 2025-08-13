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
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../shared/config/firebase';

// Collection names
const COLLECTIONS = {
  CARDS: 'cards',
  REVIEWS: 'reviews',
  SESSIONS: 'sessions',
};

// User ID fallback for local development (khi chưa có authentication)
const DEFAULT_USER_ID = 'default_user';

// Get current user ID (sẽ được cập nhật khi có authentication)
const getCurrentUserId = () => {
  // TODO: Integrate with Firebase Auth when implemented
  return DEFAULT_USER_ID;
};

// Helper function to get user's subcollection reference
const getUserCollection = collectionName => {
  const userId = getCurrentUserId();
  return collection(db, 'users', userId, collectionName);
};

// Helper function to convert Firestore timestamps
const convertTimestamps = data => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate().toISOString();
    }
  });
  return converted;
};

// ===== CARD OPERATIONS =====

export const flashcardService = {
  // Get all flashcards for current user
  async getAll() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const q = query(cardsRef, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      const cards = [];

      querySnapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        cards.push({
          id: doc.id,
          ...data,
        });
      });

      return cards;
    } catch (error) {
      console.error('Error getting flashcards:', error);
      throw error;
    }
  },

  // Add a new flashcard
  async add(cardData) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);

      const newCard = {
        ...cardData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // SM-2 algorithm initial values
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        totalReviews: 0,
        lastReviewed: null,
        nextReview: serverTimestamp(), // Available immediately
      };

      const docRef = await addDoc(cardsRef, newCard);

      // Return the card with the generated ID
      return {
        id: docRef.id,
        ...newCard,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nextReview: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error adding flashcard:', error);
      throw error;
    }
  },

  // Add multiple flashcards in batch
  async addMultiple(cardsArray) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const batch = writeBatch(db);
      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const addedCards = [];

      for (const cardData of cardsArray) {
        const docRef = doc(cardsRef);
        const newCard = {
          ...cardData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          interval: 1,
          easeFactor: 2.5,
          repetitions: 0,
          totalReviews: 0,
          lastReviewed: null,
          nextReview: serverTimestamp(),
        };

        batch.set(docRef, newCard);
        addedCards.push({
          id: docRef.id,
          ...newCard,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nextReview: new Date().toISOString(),
        });
      }

      await batch.commit();
      return addedCards;
    } catch (error) {
      console.error('Error adding multiple flashcards:', error);
      throw error;
    }
  },

  // Update a flashcard
  async update(cardId, updateData) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const cardRef = doc(cardsRef, cardId);

      const updatedData = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };

      // Convert date strings to Timestamps for Firestore
      if (updatedData.lastReviewed) {
        updatedData.lastReviewed = Timestamp.fromDate(
          new Date(updatedData.lastReviewed)
        );
      }
      if (updatedData.nextReview) {
        updatedData.nextReview = Timestamp.fromDate(
          new Date(updatedData.nextReview)
        );
      }

      await updateDoc(cardRef, updatedData);
      return { id: cardId, ...updatedData };
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  },

  // Delete a flashcard
  async delete(cardId) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const cardRef = doc(cardsRef, cardId);

      await deleteDoc(cardRef);
      return cardId;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }
  },

  // Get cards due for review
  async getDueCards() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const now = Timestamp.now();

      const q = query(
        cardsRef,
        where('nextReview', '<=', now),
        orderBy('nextReview', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const cards = [];

      querySnapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        cards.push({
          id: doc.id,
          ...data,
        });
      });

      return cards;
    } catch (error) {
      console.error('Error getting due cards:', error);
      throw error;
    }
  },

  // Get cards by category
  async getByCategory(category) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const q = query(
        cardsRef,
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const cards = [];

      querySnapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        cards.push({
          id: doc.id,
          ...data,
        });
      });

      return cards;
    } catch (error) {
      console.error('Error getting cards by category:', error);
      throw error;
    }
  },

  // Clear all cards
  async clear() {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const cardsRef = getUserCollection(COLLECTIONS.CARDS);
      const querySnapshot = await getDocs(cardsRef);
      const batch = writeBatch(db);

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('All flashcards cleared successfully!');
      return true;
    } catch (error) {
      console.error('Error clearing flashcards:', error);
      throw error;
    }
  },
};

// ===== REVIEW OPERATIONS =====

const reviewService = {
  // Add a review record
  async addReview(cardId, rating, timeTaken = null) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const reviewsRef = getUserCollection(COLLECTIONS.REVIEWS);

      const reviewData = {
        cardId,
        rating, // 'again', 'hard', 'good', 'easy'
        reviewedAt: serverTimestamp(),
        timeTaken, // in seconds
      };

      const docRef = await addDoc(reviewsRef, reviewData);

      return {
        id: docRef.id,
        ...reviewData,
        reviewedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Get review history for a card
  async getCardReviews(cardId) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const reviewsRef = getUserCollection(COLLECTIONS.REVIEWS);
      const q = query(
        reviewsRef,
        where('cardId', '==', cardId),
        orderBy('reviewedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reviews = [];

      querySnapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        reviews.push({
          id: doc.id,
          ...data,
        });
      });

      return reviews;
    } catch (error) {
      console.error('Error getting card reviews:', error);
      throw error;
    }
  },

  // Get review statistics for a date range
  async getReviewStats(startDate, endDate) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const reviewsRef = getUserCollection(COLLECTIONS.REVIEWS);
      const start = Timestamp.fromDate(new Date(startDate));
      const end = Timestamp.fromDate(new Date(endDate));

      const q = query(
        reviewsRef,
        where('reviewedAt', '>=', start),
        where('reviewedAt', '<=', end),
        orderBy('reviewedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reviews = [];

      querySnapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        reviews.push({
          id: doc.id,
          ...data,
        });
      });

      // Calculate statistics
      const stats = {
        totalReviews: reviews.length,
        again: reviews.filter(r => r.rating === 'again').length,
        hard: reviews.filter(r => r.rating === 'hard').length,
        good: reviews.filter(r => r.rating === 'good').length,
        easy: reviews.filter(r => r.rating === 'easy').length,
        averageTime: 0,
        dailyStats: {},
      };

      // Calculate average time
      const reviewsWithTime = reviews.filter(r => r.timeTaken);
      if (reviewsWithTime.length > 0) {
        stats.averageTime =
          reviewsWithTime.reduce((sum, r) => sum + r.timeTaken, 0) /
          reviewsWithTime.length;
      }

      // Group by date for daily stats
      reviews.forEach(review => {
        const date = new Date(review.reviewedAt).toDateString();
        if (!stats.dailyStats[date]) {
          stats.dailyStats[date] = {
            again: 0,
            hard: 0,
            good: 0,
            easy: 0,
            total: 0,
          };
        }
        stats.dailyStats[date][review.rating]++;
        stats.dailyStats[date].total++;
      });

      return stats;
    } catch (error) {
      console.error('Error getting review stats:', error);
      throw error;
    }
  },
};

// ===== SESSION OPERATIONS =====

const sessionService = {
  // Start a study session
  async startSession(filters = {}) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const sessionsRef = getUserCollection(COLLECTIONS.SESSIONS);

      const sessionData = {
        startedAt: serverTimestamp(),
        filters,
        completedCards: 0,
        stats: { again: 0, hard: 0, good: 0, easy: 0 },
        isActive: true,
      };

      const docRef = await addDoc(sessionsRef, sessionData);

      return {
        id: docRef.id,
        ...sessionData,
        startedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  },

  // End a study session
  async endSession(sessionId, stats) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const sessionsRef = getUserCollection(COLLECTIONS.SESSIONS);
      const sessionRef = doc(sessionsRef, sessionId);

      const updateData = {
        endedAt: serverTimestamp(),
        completedCards: stats.completedCards,
        stats: stats.stats,
        duration: stats.duration, // in minutes
        isActive: false,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(sessionRef, updateData);

      return {
        id: sessionId,
        ...updateData,
        endedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  },

  // Get recent sessions
  async getRecentSessions(limitCount = 10) {
    try {
      if (!db) throw new Error('Firebase not initialized');

      const sessionsRef = getUserCollection(COLLECTIONS.SESSIONS);
      const q = query(
        sessionsRef,
        orderBy('startedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const sessions = [];

      querySnapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        sessions.push({
          id: doc.id,
          ...data,
        });
      });

      return sessions;
    } catch (error) {
      console.error('Error getting recent sessions:', error);
      throw error;
    }
  },
};

// ===== UTILITY FUNCTIONS =====

const flashcardUtils = {
  // Convert vocabulary word to flashcard format
  vocabToCard: vocabWord => ({
    front: vocabWord.word,
    back: `${vocabWord.definition}\n\nExample: ${vocabWord.example}`,
    category: vocabWord.category,
    level: vocabWord.level,
    tags: vocabWord.tags || [],
    notes: vocabWord.notes || '',
    sourceType: 'vocabulary',
    sourceId: vocabWord.id,
  }),

  // Batch convert vocabulary to flashcards
  vocabArrayToCards: vocabArray => {
    return vocabArray.map(flashcardUtils.vocabToCard);
  },

  // Parse CSV format for import
  parseCSV: csvText => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const card = {};

      headers.forEach((header, index) => {
        card[header] = values[index] || '';
      });

      return card;
    });
  },

  // Export cards to CSV format
  exportToCSV: cards => {
    if (cards.length === 0) return '';

    const headers = ['front', 'back', 'category', 'level', 'tags', 'notes'];
    const csvContent = [
      headers.join(','),
      ...cards.map(card =>
        headers.map(header => `"${card[header] || ''}"`).join(',')
      ),
    ].join('\n');

    return csvContent;
  },

  // Export cards to Anki format
  exportToAnki: cards => {
    // Anki format: Front TAB Back TAB Tags
    return cards
      .map(card => {
        const tags = Array.isArray(card.tags)
          ? card.tags.join(' ')
          : card.tags || '';
        return `${card.front}\t${card.back}\t${tags}`;
      })
      .join('\n');
  },

  // Parse Anki format
  parseAnki: ankiText => {
    const lines = ankiText.split('\n').filter(line => line.trim());

    return lines.map(line => {
      const parts = line.split('\t');
      return {
        front: parts[0] || '',
        back: parts[1] || '',
        tags: parts[2] ? parts[2].split(' ').filter(tag => tag.trim()) : [],
      };
    });
  },
};

// Export everything
export {
  flashcardService as default,
  reviewService,
  sessionService,
  flashcardUtils,
};
