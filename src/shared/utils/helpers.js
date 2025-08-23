// Helper function to find best voice for accent
const findBestVoiceForAccent = (accent, selectedVoice) => {
  const voices = speechSynthesis.getVoices();

  // If selectedVoice matches the requested accent, use it
  if (
    selectedVoice &&
    selectedVoice.lang &&
    ((accent === 'us' &&
      (selectedVoice.lang.includes('US') || selectedVoice.lang === 'en-US')) ||
      (accent === 'uk' &&
        (selectedVoice.lang.includes('GB') || selectedVoice.lang === 'en-GB')))
  ) {
    return selectedVoice;
  }

  // Otherwise, find the best voice for the requested accent
  let preferredVoices;
  if (accent === 'us') {
    // Prioritize US voices
    preferredVoices = voices.filter(
      voice =>
        voice.lang === 'en-US' ||
        voice.lang.includes('US') ||
        (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('us'))
    );
  } else {
    // Prioritize UK/GB voices
    preferredVoices = voices.filter(
      voice =>
        voice.lang === 'en-GB' ||
        voice.lang.includes('GB') ||
        voice.lang.includes('UK') ||
        (voice.lang.startsWith('en') &&
          voice.name.toLowerCase().includes('british'))
    );
  }

  // Sort by preference: local service first, then by quality indicators
  preferredVoices.sort((a, b) => {
    // Prefer local voices
    if (a.localService && !b.localService) return -1;
    if (!a.localService && b.localService) return 1;

    // Prefer default voices
    if (a.default && !b.default) return -1;
    if (!a.default && b.default) return 1;

    return 0;
  });

  // Return first available voice, or null if none found
  return preferredVoices.length > 0 ? preferredVoices[0] : null;
};

// Speech synthesis utility
export const speak = (text, accent = 'us', selectedVoice = null) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find the best voice for the requested accent
    const bestVoice = findBestVoiceForAccent(accent, selectedVoice);

    if (
      bestVoice &&
      typeof bestVoice === 'object' &&
      bestVoice.name &&
      bestVoice.lang &&
      bestVoice.voiceURI
    ) {
      // Use the best voice found
      utterance.voice = bestVoice;
    } else {
      // Fallback to language setting
      utterance.lang = accent === 'us' ? 'en-US' : 'en-GB';
    }

    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Stop current speech before starting new one
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
};

// Local storage utilities
export const storage = {
  getVocabulary: () => {
    try {
      return JSON.parse(localStorage.getItem('englishVocabulary') || '[]');
    } catch (error) {
      console.error('Error loading vocabulary:', error);
      return [];
    }
  },

  setVocabulary: vocabulary => {
    try {
      localStorage.setItem('englishVocabulary', JSON.stringify(vocabulary));
    } catch (error) {
      console.error('Error saving vocabulary:', error);
    }
  },

  getFavorites: () => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  setFavorites: favorites => {
    try {
      localStorage.setItem('favorites', JSON.stringify([...favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  getApiKey: () => {
    try {
      return localStorage.getItem('geminiApiKey') || '';
    } catch (error) {
      console.error('Error loading API key:', error);
      return '';
    }
  },

  setApiKey: apiKey => {
    try {
      if (apiKey) {
        localStorage.setItem('geminiApiKey', apiKey);
      }
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  },

  // Flag to track if user has ever had data (to distinguish first use from cleared data)
  getHasEverHadData: () => {
    try {
      return localStorage.getItem('hasEverHadData') === 'true';
    } catch (error) {
      console.error('Error loading hasEverHadData flag:', error);
      return false;
    }
  },

  setHasEverHadData: (hasData = true) => {
    try {
      localStorage.setItem('hasEverHadData', hasData.toString());
    } catch (error) {
      console.error('Error saving hasEverHadData flag:', error);
    }
  },
};

// Generate unique ID
export const generateId = (existingIds = []) => {
  return Math.max(...existingIds, 0) + 1;
};

// Check for duplicate words
export const checkDuplicate = (vocabulary, newWord) => {
  return vocabulary.find(
    w => w.english.toLowerCase() === newWord.toLowerCase().trim()
  );
};

// Filter vocabulary
export const filterVocabulary = (vocabulary, searchTerm) => {
  if (!searchTerm.trim()) return vocabulary;

  const term = searchTerm.toLowerCase();
  return vocabulary.filter(
    word =>
      word.english.toLowerCase().includes(term) ||
      word.vietnamese.toLowerCase().includes(term) ||
      word.category.toLowerCase().includes(term)
  );
};

// Get unique categories
export const getCategories = vocabulary => {
  return [...new Set(vocabulary.map(word => word.category))];
};

// Get category display info
export const getCategoryInfo = (categoryId, categories) => {
  return (
    categories.find(cat => cat.id === categoryId) || {
      id: categoryId,
      name: categoryId,
      icon: '📚',
      description: 'Danh mục khác',
    }
  );
};

// Get category statistics
export const getCategoryStats = (vocabulary, categories) => {
  return categories
    .map(category => ({
      ...category,
      count: vocabulary.filter(word => word.category === category.id).length,
      percentage:
        Math.round(
          (vocabulary.filter(word => word.category === category.id).length /
            vocabulary.length) *
            100
        ) || 0,
    }))
    .filter(cat => cat.count > 0);
};

// Filter vocabulary by category
export const filterByCategory = (vocabulary, categoryId) => {
  if (!categoryId) return vocabulary;
  return vocabulary.filter(word => word.category === categoryId);
};

// Get most common categories
export const getTopCategories = (vocabulary, limit = 5) => {
  const categoryCounts = {};
  vocabulary.forEach(word => {
    categoryCounts[word.category] = (categoryCounts[word.category] || 0) + 1;
  });

  return Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
};

// CEFR Level utilities
export const mapLevelToDisplay = level => {
  const levelMap = {
    A1: 'A1 - Khởi đầu',
    A2: 'A2 - Cơ bản',
    B1: 'B1 - Trung cấp thấp',
    B2: 'B2 - Trung cấp cao',
    C1: 'C1 - Cao cấp',
    C2: 'C2 - Thành thạo',
    // Backward compatibility
    beginner: 'A1-A2',
    intermediate: 'B1-B2',
    advanced: 'C1-C2',
  };
  return levelMap[level] || level;
};

export const getLevelColor = level => {
  const colorMap = {
    A1: 'green',
    A2: 'green',
    B1: 'yellow',
    B2: 'orange',
    C1: 'red',
    C2: 'purple',
    // Backward compatibility
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'red',
  };
  return colorMap[level] || 'gray';
};

export const getAllLevels = () => {
  return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
};
