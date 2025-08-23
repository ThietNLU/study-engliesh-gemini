import { create } from 'zustand';

// Helper functions for voice settings
const saveVoiceToStorage = voice => {
  try {
    if (voice && voice.name && voice.lang) {
      const voiceData = {
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI,
        default: voice.default || false,
        localService: voice.localService || false,
      };
      localStorage.setItem('selectedVoice', JSON.stringify(voiceData));
    }
  } catch (error) {
    console.error('Error saving voice to storage:', error);
  }
};

const hasSpeechSynthesis = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

const loadVoiceFromStorage = () => {
  try {
    if (!hasSpeechSynthesis()) return null;
    const savedVoice = localStorage.getItem('selectedVoice');
    if (savedVoice) {
      const voiceData = JSON.parse(savedVoice);

      // Find matching voice from available voices
      const voices = hasSpeechSynthesis() ? speechSynthesis.getVoices() : [];
      const matchedVoice = voices.find(
        voice =>
          voice.name === voiceData.name &&
          voice.lang === voiceData.lang &&
          voice.voiceURI === voiceData.voiceURI
      );

      return matchedVoice || null;
    }
  } catch (error) {
    console.error('Error loading voice from storage:', error);
  }
  return null;
};

// UI State Store - quản lý UI state tạm thời (không persist)
export const useUIStore = create((set, get) => ({
  // Navigation and mode
  currentMode: 'home',

  // Form states
  editingWord: null,
  searchTerm: '',
  aiRequest: '',
  isLoading: false,
  showApiSettings: false,

  // New word form
  newWord: {
    english: '',
    vietnamese: '',
    pronunciation_us: '',
    pronunciation_uk: '',
    category: 'nouns',
    definition: '',
    example: '',
    level: 'A1',
  },

  // Settings
  accent: 'us', // 'us' | 'uk'
  selectedVoice: null, // Giọng đọc được chọn
  showVoiceSettings: false, // Hiển thị cài đặt giọng đọc

  // Modal and dialog states
  showConfirmDialog: false,
  confirmDialogConfig: {
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  },

  // Notification state
  notification: {
    show: false,
    type: 'info', // 'success' | 'error' | 'warning' | 'info'
    message: '',
    duration: 3000,
  },

  // Loading states for different operations
  loadingStates: {
    vocabulary: false,
    favorites: false,
    aiGeneration: false,
    wordOperation: false,
  },

  // Error states
  errors: {
    vocabulary: null,
    favorites: null,
    aiGeneration: null,
    wordOperation: null,
  },

  // Actions
  setCurrentMode: mode => set({ currentMode: mode }),
  setEditingWord: wordId => set({ editingWord: wordId }),
  setSearchTerm: term => set({ searchTerm: term }),
  setAiRequest: request => set({ aiRequest: request }),
  setIsLoading: loading => set({ isLoading: loading }),
  setShowApiSettings: show => set({ showApiSettings: show }),
  setAccent: accent => set({ accent: accent }),
  setSelectedVoice: voice => {
    saveVoiceToStorage(voice);
    set({ selectedVoice: voice });
  },
  setShowVoiceSettings: show => set({ showVoiceSettings: show }),

  // Initialize voice settings
  initializeVoiceSettings: () => {
    try {
      if (!hasSpeechSynthesis()) return; // Environment doesn't support speech synthesis

      const loadVoices = () => {
        const savedVoice = loadVoiceFromStorage();
        if (savedVoice) {
          set({ selectedVoice: savedVoice });
        }
      };

      // Try to load voices immediately
      const voices = speechSynthesis.getVoices?.() || [];
      if (voices.length > 0) {
        loadVoices();
      } else {
        // If voices are not ready, wait for them
        const handleVoicesChanged = () => {
          try {
            loadVoices();
          } finally {
            speechSynthesis.removeEventListener(
              'voiceschanged',
              handleVoicesChanged
            );
          }
        };
        speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      }
    } catch (error) {
      console.error('Failed to initialize voice settings:', error);
    }
  },

  // New word form actions
  setNewWord: word => set({ newWord: word }),
  updateNewWordField: (field, value) =>
    set(state => ({
      newWord: { ...state.newWord, [field]: value },
    })),
  resetNewWord: () =>
    set({
      newWord: {
        english: '',
        vietnamese: '',
        pronunciation_us: '',
        pronunciation_uk: '',
        category: 'nouns',
        definition: '',
        example: '',
        level: 'A1',
      },
    }),

  // Confirm dialog actions
  showConfirm: config =>
    set({
      showConfirmDialog: true,
      confirmDialogConfig: config,
    }),
  hideConfirm: () =>
    set({
      showConfirmDialog: false,
      confirmDialogConfig: {
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
      },
    }),

  // Notification actions
  showNotification: (type, message, duration = 3000) =>
    set({
      notification: {
        show: true,
        type,
        message,
        duration,
      },
    }),
  hideNotification: () =>
    set({
      notification: {
        show: false,
        type: 'info',
        message: '',
        duration: 3000,
      },
    }),

  // Loading state management
  setLoading: (operation, loading) =>
    set(state => ({
      loadingStates: {
        ...state.loadingStates,
        [operation]: loading,
      },
    })),

  isOperationLoading: operation => {
    return get().loadingStates[operation] || false;
  },

  // Error state management
  setError: (operation, error) =>
    set(state => ({
      errors: {
        ...state.errors,
        [operation]: error,
      },
    })),

  clearError: operation =>
    set(state => ({
      errors: {
        ...state.errors,
        [operation]: null,
      },
    })),

  getError: operation => {
    return get().errors[operation];
  },

  // Clear all errors
  clearAllErrors: () =>
    set({
      errors: {
        vocabulary: null,
        favorites: null,
        aiGeneration: null,
        wordOperation: null,
      },
    }),

  // Reset UI state to defaults
  resetUIState: () =>
    set({
      currentMode: 'home',
      editingWord: null,
      searchTerm: '',
      aiRequest: '',
      isLoading: false,
      showApiSettings: false,
      showConfirmDialog: false,
      notification: {
        show: false,
        type: 'info',
        message: '',
        duration: 3000,
      },
      loadingStates: {
        vocabulary: false,
        favorites: false,
        aiGeneration: false,
        wordOperation: false,
      },
      errors: {
        vocabulary: null,
        favorites: null,
        aiGeneration: null,
        wordOperation: null,
      },
    }),

  // Bulk state updates
  updateUIState: updates =>
    set(state => ({
      ...state,
      ...updates,
    })),
}));
