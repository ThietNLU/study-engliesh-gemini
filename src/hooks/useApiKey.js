import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export const useApiKey = () => {
  const [apiKey, setApiKeyState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load API key on mount
  useEffect(() => {
    const loadApiKey = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const savedApiKey = await storageService.settings.getApiKey();
        setApiKeyState(savedApiKey);
      } catch (err) {
        console.error('Error loading API key:', err);
        setError(err.message);
        setApiKeyState('');
      } finally {
        setLoading(false);
      }
    };

    loadApiKey();
  }, []);

  const setApiKey = async (newApiKey) => {
    setLoading(true);
    setError(null);
    
    try {
      await storageService.settings.setApiKey(newApiKey);
      setApiKeyState(newApiKey);
    } catch (err) {
      console.error('Error saving API key:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    apiKey,
    loading,
    error,
    setApiKey
  };
};
