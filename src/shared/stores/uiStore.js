import { create } from 'zustand';

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
