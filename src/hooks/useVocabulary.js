import { useState, useEffect } from 'react';
import storageService from '../services/storageService';
import { initialVocabulary } from '../data/initialVocabulary';

export const useVocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load vocabulary on mount
  useEffect(() => {
    const loadVocabulary = async () => {
      setLoading(true);
      setError(null);

      try {
        const savedVocab = await storageService.vocabulary.getAll();
        // Always use saved vocabulary, even if empty
        // If no saved vocabulary exists, use initial vocabulary as fallback
        if (savedVocab.length > 0) {
          setVocabulary(savedVocab);
        } else {
          // Check if this is first time use (no data in storage at all)
          const isFirstTime = await storageService.migration.isFirstTimeUse();

          if (isFirstTime) {
            // First time use - initialize with sample data
            setVocabulary(initialVocabulary);
            // Save initial vocabulary to storage
            await storageService.vocabulary.addMultiple(initialVocabulary);
          } else {
            // User has explicitly cleared data - show empty vocabulary
            setVocabulary([]);
          }
        }
      } catch (err) {
        console.error('Error loading vocabulary:', err);
        setError(err.message);
        // Fallback to initial vocabulary on error
        setVocabulary(initialVocabulary);
      } finally {
        setLoading(false);
      }
    };

    loadVocabulary();
  }, []);

  const addWord = async newWord => {
    setLoading(true);
    setError(null);

    try {
      const wordToAdd = await storageService.vocabulary.add(newWord);
      setVocabulary(prev => [...prev, wordToAdd]);
      return wordToAdd;
    } catch (err) {
      console.error('Error adding word:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWord = async (id, updatedWord) => {
    setLoading(true);
    setError(null);

    try {
      await storageService.vocabulary.update(id, updatedWord);
      setVocabulary(prev =>
        prev.map(word => (word.id === id ? { ...word, ...updatedWord } : word))
      );
    } catch (err) {
      console.error('Error updating word:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async id => {
    setLoading(true);
    setError(null);

    try {
      await storageService.vocabulary.delete(id);
      setVocabulary(prev => prev.filter(word => word.id !== id));
    } catch (err) {
      console.error('Error deleting word:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addWordsFromAI = async aiWords => {
    setLoading(true);
    setError(null);

    try {
      const newWords = await storageService.vocabulary.addMultiple(aiWords);
      setVocabulary(prev => [...prev, ...newWords]);
      return newWords;
    } catch (err) {
      console.error('Error adding words from AI:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshVocabulary = async () => {
    setLoading(true);
    setError(null);

    try {
      const savedVocab = await storageService.vocabulary.getAll();

      // Apply the same logic as in useEffect
      if (savedVocab.length > 0) {
        setVocabulary(savedVocab);
      } else {
        // Check if this is first time use (no data in storage at all)
        const isFirstTime = await storageService.migration.isFirstTimeUse();

        if (isFirstTime) {
          // First time use - initialize with sample data
          setVocabulary(initialVocabulary);
          // Save initial vocabulary to storage
          await storageService.vocabulary.addMultiple(initialVocabulary);
        } else {
          // User has explicitly cleared data - show empty vocabulary
          setVocabulary([]);
        }
      }
    } catch (err) {
      console.error('Error refreshing vocabulary:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    vocabulary,
    loading,
    error,
    addWord,
    updateWord,
    deleteWord,
    addWordsFromAI,
    refreshVocabulary,
  };
};
