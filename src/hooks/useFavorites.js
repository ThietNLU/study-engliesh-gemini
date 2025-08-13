import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const savedFavorites = await storageService.favorites.getAll();
        setFavorites(savedFavorites);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError(err.message);
        setFavorites(new Set());
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async id => {
    setLoading(true);
    setError(null);

    try {
      const isFavorite = await storageService.favorites.toggle(id);

      // Update local state
      const newFavorites = new Set(favorites);
      if (isFavorite) {
        newFavorites.add(id);
      } else {
        newFavorites.delete(id);
      }
      setFavorites(newFavorites);

      return isFavorite;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    favorites,
    loading,
    error,
    toggleFavorite,
  };
};
