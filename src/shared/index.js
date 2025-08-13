// Shared UI components
export { default as Header } from './ui/Header';
export { default as Footer } from './ui/Footer';
export { default as HomePage } from './ui/HomePage';
export { default as ModeSelector } from './ui/ModeSelector';
export { default as EmptyState } from './ui/EmptyState';
export { default as ApiKeyTester } from './ui/ApiKeyTester';
export { default as FirebaseStatus } from './ui/FirebaseStatus';
export { default as DetailedDebugger } from './ui/DetailedDebugger';
export { default as NotificationToast } from './ui/NotificationToast';
export { default as ConfirmDialog } from './ui/ConfirmDialog';

// Shared hooks
export { useApiKey } from './hooks/useApiKey';
export { 
  useVocabularyData, 
  useFavoritesData, 
  useApiKeyData,
  useFilteredVocabulary,
  useVocabularyStats 
} from './hooks/useStoreHooks';

// Shared services
export { default as storageService } from './services/storageService';
export { default as safeStorageService } from './services/safeStorageService';

// Shared stores
export * from './stores';

// Shared utilities
export * from './utils/helpers';
export * from './utils/apiTest';
