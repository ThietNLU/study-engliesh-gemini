// Flashcard feature exports - New SM-2 based flashcard system
export { default as FlashcardMode } from './components/FlashcardMode';
export { default as FlashcardManager } from './components/FlashcardManager';
export { default as FlashcardStats } from './components/FlashcardStats';

// Legacy StudyMode (keeping for compatibility)
export { default as StudyMode } from './components/StudyMode';

// Export services
export { 
  default as flashcardService,
  reviewService,
  sessionService,
  flashcardUtils
} from './services/flashcardService';

// Export store
export { default as useFlashcardStore } from '../../shared/stores/flashcardStore';
