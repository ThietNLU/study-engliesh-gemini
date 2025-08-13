import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// SM-2 Algorithm Constants
const SM2_CONSTANTS = {
  MIN_EASE_FACTOR: 1.3,
  INITIAL_EASE_FACTOR: 2.5,
  INITIAL_INTERVAL: 1,
  INTERVAL_MULTIPLIER: {
    AGAIN: 0,      // Reset interval
    HARD: 0.85,    // Reduce ease factor and interval
    GOOD: 1,       // Normal progression
    EASY: 1.3      // Bonus multiplier
  },
  EASE_FACTOR_DELTA: {
    AGAIN: -0.2,
    HARD: -0.15,
    GOOD: 0,
    EASY: 0.15
  }
};

// SM-2 Algorithm Implementation
const calculateNextReview = (card, rating) => {
  const now = new Date();
  let { interval, easeFactor, repetitions } = card;

  // Initialize defaults if card is new
  if (!interval) interval = SM2_CONSTANTS.INITIAL_INTERVAL;
  if (!easeFactor) easeFactor = SM2_CONSTANTS.INITIAL_EASE_FACTOR;
  if (!repetitions) repetitions = 0;

  let newInterval = interval;
  let newEaseFactor = easeFactor;
  let newRepetitions = repetitions;

  switch (rating) {
    case 'again':
      // Reset the card
      newInterval = SM2_CONSTANTS.INITIAL_INTERVAL;
      newRepetitions = 0;
      newEaseFactor = Math.max(
        SM2_CONSTANTS.MIN_EASE_FACTOR,
        easeFactor + SM2_CONSTANTS.EASE_FACTOR_DELTA.AGAIN
      );
      break;

    case 'hard':
      // Reduce ease factor and set shorter interval
      newEaseFactor = Math.max(
        SM2_CONSTANTS.MIN_EASE_FACTOR,
        easeFactor + SM2_CONSTANTS.EASE_FACTOR_DELTA.HARD
      );
      newInterval = Math.max(1, Math.round(interval * SM2_CONSTANTS.INTERVAL_MULTIPLIER.HARD));
      newRepetitions += 1;
      break;

    case 'good':
      // Normal progression
      newRepetitions += 1;
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      break;

    case 'easy':
      // Bonus progression
      newRepetitions += 1;
      newEaseFactor = easeFactor + SM2_CONSTANTS.EASE_FACTOR_DELTA.EASY;
      if (newRepetitions === 1) {
        newInterval = 4;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor * SM2_CONSTANTS.INTERVAL_MULTIPLIER.EASY);
      }
      break;

    default:
      console.warn('Invalid rating:', rating);
      return card;
  }

  // Calculate next review date
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    ...card,
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
    lastReviewed: now.toISOString(),
    nextReview: nextReviewDate.toISOString(),
    totalReviews: (card.totalReviews || 0) + 1
  };
};

// Get cards due for review
const getCardsToReview = (cards) => {
  const now = new Date();
  return cards.filter(card => {
    if (!card.nextReview) return true; // New cards
    return new Date(card.nextReview) <= now;
  });
};

// Sort cards by priority (new cards first, then by due date)
const sortCardsByPriority = (cards) => {
  return cards.sort((a, b) => {
    // New cards first
    if (!a.nextReview && b.nextReview) return -1;
    if (a.nextReview && !b.nextReview) return 1;
    if (!a.nextReview && !b.nextReview) return 0;

    // Then by due date (overdue cards first)
    return new Date(a.nextReview) - new Date(b.nextReview);
  });
};

const useFlashcardStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        cards: [],
        currentCard: null,
        currentCardIndex: 0,
        showAnswer: false,
        studySession: {
          isActive: false,
          cardsToReview: [],
          currentSessionCards: [],
          startTime: null,
          completedCards: 0,
          stats: {
            again: 0,
            hard: 0,
            good: 0,
            easy: 0
          }
        },
        filters: {
          category: '',
          level: '',
          status: 'all' // all, new, learning, mature
        },
        isLoading: false,
        lastSync: null,

        // Actions
        setCards: (cards) => set({ cards }),

        addCard: (card) => set((state) => ({
          cards: [...state.cards, {
            ...card,
            id: card.id || Date.now().toString(),
            createdAt: new Date().toISOString(),
            interval: SM2_CONSTANTS.INITIAL_INTERVAL,
            easeFactor: SM2_CONSTANTS.INITIAL_EASE_FACTOR,
            repetitions: 0,
            totalReviews: 0,
            lastReviewed: null,
            nextReview: new Date().toISOString() // Available immediately
          }]
        })),

        updateCard: (cardId, updates) => set((state) => ({
          cards: state.cards.map(card => 
            card.id === cardId ? { ...card, ...updates } : card
          )
        })),

        deleteCard: (cardId) => set((state) => ({
          cards: state.cards.filter(card => card.id !== cardId)
        })),

        // Study session management
        startStudySession: (filters = {}) => {
          const state = get();
          let cardsToReview = getCardsToReview(state.cards);

          // Apply filters
          if (filters.category) {
            cardsToReview = cardsToReview.filter(card => card.category === filters.category);
          }
          if (filters.level) {
            cardsToReview = cardsToReview.filter(card => card.level === filters.level);
          }
          if (filters.status && filters.status !== 'all') {
            cardsToReview = cardsToReview.filter(card => {
              if (filters.status === 'new') return !card.lastReviewed;
              if (filters.status === 'learning') return card.lastReviewed && card.interval < 21;
              if (filters.status === 'mature') return card.interval >= 21;
              return true;
            });
          }

          // Sort by priority
          cardsToReview = sortCardsByPriority(cardsToReview);

          set({
            studySession: {
              isActive: true,
              cardsToReview,
              currentSessionCards: [...cardsToReview],
              startTime: new Date().toISOString(),
              completedCards: 0,
              stats: { again: 0, hard: 0, good: 0, easy: 0 }
            },
            currentCard: cardsToReview[0] || null,
            currentCardIndex: 0,
            showAnswer: false
          });

          return cardsToReview.length;
        },

        reviewCard: (rating) => {
          const state = get();
          const { currentCard, studySession } = state;

          if (!currentCard || !studySession.isActive) return;

          // Calculate next review using SM-2
          const updatedCard = calculateNextReview(currentCard, rating);

          // Update stats
          const newStats = {
            ...studySession.stats,
            [rating]: studySession.stats[rating] + 1
          };

          // Remove current card from session and update in main collection
          const remainingCards = studySession.cardsToReview.slice(1);
          const nextCard = remainingCards[0] || null;

          set((state) => ({
            cards: state.cards.map(card => 
              card.id === currentCard.id ? updatedCard : card
            ),
            studySession: {
              ...studySession,
              cardsToReview: remainingCards,
              completedCards: studySession.completedCards + 1,
              stats: newStats
            },
            currentCard: nextCard,
            currentCardIndex: 0,
            showAnswer: false
          }));

          // End session if no more cards
          if (remainingCards.length === 0) {
            get().endStudySession();
          }

          return {
            cardUpdated: updatedCard,
            hasMoreCards: remainingCards.length > 0,
            nextCard,
            sessionStats: newStats
          };
        },

        endStudySession: () => {
          const state = get();
          const endTime = new Date().toISOString();
          const duration = new Date(endTime) - new Date(state.studySession.startTime);

          set({
            studySession: {
              isActive: false,
              cardsToReview: [],
              currentSessionCards: [],
              startTime: null,
              completedCards: 0,
              stats: { again: 0, hard: 0, good: 0, easy: 0 }
            },
            currentCard: null,
            currentCardIndex: 0,
            showAnswer: false
          });

          return {
            completedCards: state.studySession.completedCards,
            stats: state.studySession.stats,
            duration: Math.round(duration / 1000 / 60) // minutes
          };
        },

        toggleShowAnswer: () => set((state) => ({
          showAnswer: !state.showAnswer
        })),

        setFilters: (filters) => set((state) => ({
          filters: { ...state.filters, ...filters }
        })),

        // Getters
        getCardStats: () => {
          const state = get();
          const total = state.cards.length;
          const newCards = state.cards.filter(card => !card.lastReviewed).length;
          const learning = state.cards.filter(card => 
            card.lastReviewed && card.interval < 21
          ).length;
          const mature = state.cards.filter(card => card.interval >= 21).length;
          const due = getCardsToReview(state.cards).length;

          return { total, newCards, learning, mature, due };
        },

        getDueCards: () => {
          const state = get();
          return getCardsToReview(state.cards);
        },

        getFilteredCards: () => {
          const state = get();
          let filtered = [...state.cards];

          if (state.filters.category) {
            filtered = filtered.filter(card => card.category === state.filters.category);
          }
          if (state.filters.level) {
            filtered = filtered.filter(card => card.level === state.filters.level);
          }
          if (state.filters.status && state.filters.status !== 'all') {
            filtered = filtered.filter(card => {
              if (state.filters.status === 'new') return !card.lastReviewed;
              if (state.filters.status === 'learning') return card.lastReviewed && card.interval < 21;
              if (state.filters.status === 'mature') return card.interval >= 21;
              return true;
            });
          }

          return filtered;
        },

        // Bulk operations
        importCards: (cardsData) => {
          const newCards = cardsData.map(cardData => ({
            ...cardData,
            id: cardData.id || Date.now().toString() + Math.random(),
            createdAt: new Date().toISOString(),
            interval: SM2_CONSTANTS.INITIAL_INTERVAL,
            easeFactor: SM2_CONSTANTS.INITIAL_EASE_FACTOR,
            repetitions: 0,
            totalReviews: 0,
            lastReviewed: null,
            nextReview: new Date().toISOString()
          }));

          set((state) => ({
            cards: [...state.cards, ...newCards]
          }));

          return newCards.length;
        },

        exportCards: () => {
          const state = get();
          return state.cards.map(card => ({
            front: card.front,
            back: card.back,
            category: card.category,
            level: card.level,
            tags: card.tags,
            notes: card.notes,
            interval: card.interval,
            easeFactor: card.easeFactor,
            repetitions: card.repetitions,
            totalReviews: card.totalReviews,
            lastReviewed: card.lastReviewed,
            nextReview: card.nextReview,
            createdAt: card.createdAt
          }));
        },

        clearAllCards: () => set({ cards: [] }),

        setLoading: (isLoading) => set({ isLoading }),
        setLastSync: (timestamp) => set({ lastSync: timestamp })
      }),
      {
        name: 'flashcard-store',
        partialize: (state) => ({
          cards: state.cards,
          filters: state.filters,
          lastSync: state.lastSync
        })
      }
    ),
    { name: 'flashcard-store' }
  )
);

export default useFlashcardStore;
