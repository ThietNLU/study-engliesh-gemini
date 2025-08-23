// Flashcard feature removed. No-op placeholder store.
export default function useFlashcardStore() {
  if (typeof window !== 'undefined' && !window.__FLASHCARD_REMOVED__) {
    window.__FLASHCARD_REMOVED__ = true;
    console.warn('Flashcard feature removed: flashcardStore is a noop.');
  }
  return {};
}
