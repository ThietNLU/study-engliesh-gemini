// Deprecated migration utilities (flashcard feature removed). Keeping a safe stub.
export const migrationUtils = {
  async migrateVocabularyToFlashcards() {
    return { success: false, message: 'Flashcard feature removed' };
  },
  async migrateSelectedVocabularyToFlashcards() {
    return { success: false, message: 'Flashcard feature removed' };
  },
  async checkForDuplicates() {
    return { duplicates: [], vocabularyOnly: [], flashcardOnly: [] };
  },
  async getMigrationStats() {
    return {
      vocabularyCount: 0,
      flashcardCount: 0,
      vocabToFlashcardPercent: 0,
      flashcardToVocabPercent: 0,
    };
  },
};

export default migrationUtils;
