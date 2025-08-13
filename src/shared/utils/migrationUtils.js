import { flashcardService, flashcardUtils } from '../features/flashcard/services/flashcardService';
import { vocabularyService } from '../features/vocab/services/firestoreService';

/**
 * Migration utilities for converting vocabulary to flashcards
 */
export const migrationUtils = {
  /**
   * Convert all vocabulary words to flashcards
   */
  async migrateVocabularyToFlashcards() {
    try {
      console.log('Starting vocabulary to flashcards migration...');
      
      // Get all vocabulary words
      const vocabWords = await vocabularyService.getAll();
      console.log(`Found ${vocabWords.length} vocabulary words`);
      
      if (vocabWords.length === 0) {
        console.log('No vocabulary words found to migrate');
        return { success: true, count: 0 };
      }
      
      // Convert to flashcard format
      const flashcards = flashcardUtils.vocabArrayToCards(vocabWords);
      
      // Add to flashcard collection
      const addedCards = await flashcardService.addMultiple(flashcards);
      
      console.log(`Successfully migrated ${addedCards.length} flashcards`);
      
      return {
        success: true,
        count: addedCards.length,
        cards: addedCards
      };
    } catch (error) {
      console.error('Error migrating vocabulary to flashcards:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Convert specific vocabulary words to flashcards
   */
  async migrateSelectedVocabulary(vocabIds) {
    try {
      console.log(`Migrating ${vocabIds.length} selected vocabulary words...`);
      
      // Get all vocabulary words first
      const allVocab = await vocabularyService.getAll();
      
      // Filter by selected IDs
      const selectedVocab = allVocab.filter(word => vocabIds.includes(word.id));
      
      if (selectedVocab.length === 0) {
        console.log('No matching vocabulary words found');
        return { success: true, count: 0 };
      }
      
      // Convert to flashcard format
      const flashcards = flashcardUtils.vocabArrayToCards(selectedVocab);
      
      // Add to flashcard collection
      const addedCards = await flashcardService.addMultiple(flashcards);
      
      console.log(`Successfully migrated ${addedCards.length} selected flashcards`);
      
      return {
        success: true,
        count: addedCards.length,
        cards: addedCards
      };
    } catch (error) {
      console.error('Error migrating selected vocabulary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Check for duplicate cards before migration
   */
  async checkForDuplicates() {
    try {
      const [vocabWords, existingCards] = await Promise.all([
        vocabularyService.getAll(),
        flashcardService.getAll()
      ]);
      
      const existingFronts = new Set(existingCards.map(card => card.front.toLowerCase()));
      const duplicates = vocabWords.filter(word => 
        existingFronts.has(word.word.toLowerCase())
      );
      
      return {
        totalVocab: vocabWords.length,
        totalCards: existingCards.length,
        duplicates: duplicates.length,
        duplicateWords: duplicates
      };
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return null;
    }
  },

  /**
   * Get migration statistics
   */
  async getMigrationStats() {
    try {
      const [vocabWords, flashcards] = await Promise.all([
        vocabularyService.getAll(),
        flashcardService.getAll()
      ]);
      
      const vocabFromFlashcards = flashcards.filter(card => card.sourceType === 'vocabulary');
      
      return {
        totalVocabulary: vocabWords.length,
        totalFlashcards: flashcards.length,
        flashcardsFromVocab: vocabFromFlashcards.length,
        migrationComplete: vocabFromFlashcards.length >= vocabWords.length,
        unmigrated: Math.max(0, vocabWords.length - vocabFromFlashcards.length)
      };
    } catch (error) {
      console.error('Error getting migration stats:', error);
      return null;
    }
  }
};

/**
 * Example usage:
 * 
 * // Migrate all vocabulary
 * const result = await migrationUtils.migrateVocabularyToFlashcards();
 * if (result.success) {
 *   console.log(`Migrated ${result.count} flashcards`);
 * }
 * 
 * // Check for duplicates first
 * const duplicateInfo = await migrationUtils.checkForDuplicates();
 * console.log(`Found ${duplicateInfo.duplicates} potential duplicates`);
 * 
 * // Get migration progress
 * const stats = await migrationUtils.getMigrationStats();
 * console.log(`Migration progress: ${stats.flashcardsFromVocab}/${stats.totalVocabulary}`);
 */

export default migrationUtils;
