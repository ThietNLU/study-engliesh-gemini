import React, { useEffect } from 'react';

// Feature imports
import { AddWordMode, ManageMode } from '../features/vocab';
import { AIMode, geminiService } from '../features/ai';
import DictionaryMode from '../features/dictionary/components/DictionaryMode';

// Shared imports - import individually to debug
import Header from '../shared/ui/Header';
import HomePage from '../shared/ui/HomePage';
import ModeSelector from '../shared/ui/ModeSelector';
import Footer from '../shared/ui/Footer';
import EmptyState from '../shared/ui/EmptyState';
// Simplified: remove voice settings UI
import NotificationToast from '../shared/ui/NotificationToast';
import ConfirmDialog from '../shared/ui/ConfirmDialog';

// Store imports
import { useUIStore, useDataStore } from '../shared/stores';

const EnglishVocabApp = () => {
  // Zustand stores
  const uiStore = useUIStore();
  const dataStore = useDataStore();

  // Destructure commonly used state and actions
  const {
    currentMode,
    editingWord,
    searchTerm,
    aiRequest,
    isLoading,
    showApiSettings,
    newWord,
    setCurrentMode,
    setEditingWord,
    setSearchTerm,
    setAiRequest,
    setIsLoading,
    setShowApiSettings,
    setNewWord,
    showNotification,
  } = uiStore;

  const {
    vocabulary,
    favorites,
    apiKey,
    addWord,
    updateWord,
    deleteWord,
    addWordsFromAI,
    toggleFavorite,
    setApiKey,
    initializeData,
    getFilteredVocabulary,
  } = dataStore;

  // Initialize data on app load
  useEffect(() => {
    initializeData();
    uiStore.initializeVoiceSettings();
  }, [initializeData]);

  // Watch vocabulary changes and reset to home when it becomes empty
  useEffect(() => {
    if (
      vocabulary.length === 0 &&
      currentMode !== 'home' &&
      currentMode !== 'add' &&
      currentMode !== 'ai'
    ) {
      setCurrentMode('home');
    }
  }, [vocabulary.length, currentMode, setCurrentMode]);

  // Event handlers

  // Quiz removed in streamlined version

  const generateVocabularyWithAI = async () => {
    setIsLoading(true);

    try {
      const existingWords = vocabulary.map(w => w.english.toLowerCase());
      console.log('Sending request to Gemini...');
      console.log('Request:', aiRequest);
      console.log('Existing words count:', existingWords.length);

      const aiWords = await geminiService.generateVocabulary(
        aiRequest,
        existingWords,
        apiKey
      );
      console.log('Received AI words:', aiWords);

      if (!aiWords || aiWords.length === 0) {
        throw new Error('AI không tạo được từ vựng nào');
      }

      // Add AI words to vocabulary
      await addWordsFromAI(aiWords);
      setAiRequest('');

      // If this was the first time adding words, switch to home mode
      if (vocabulary.length === 0) {
        setCurrentMode('home');
      }

      showNotification(
        'success',
        `✅ Đã thêm ${aiWords.length} từ vựng mới từ AI! Các từ mới: ${aiWords.map(w => w.english).join(', ')}`
      );
    } catch (error) {
      console.error('AI Generation Error:', error);
      showNotification(
        'error',
        `❌ ${error.message}. Gợi ý: Kiểm tra API key Gemini và kết nối internet`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Computed values
  const currentWord = vocabulary.length > 0 ? vocabulary[0] : null; // simplified: first word
  const filteredVocabulary = getFilteredVocabulary(searchTerm);

  // Handle word operations with notifications
  const handleAddWord = async wordData => {
    try {
      await addWord(wordData);
      showNotification('success', 'Đã thêm từ vựng mới thành công!');
      setNewWord({
        english: '',
        vietnamese: '',
        pronunciation_us: '',
        pronunciation_uk: '',
        category: 'nouns',
        definition: '',
        example: '',
        level: 'A1',
      });
    } catch (error) {
      showNotification('error', `Lỗi khi thêm từ: ${error.message}`);
    }
  };

  const handleDeleteWord = async id => {
    try {
      await deleteWord(id);
      showNotification('success', 'Đã xóa từ vựng thành công!');
    } catch (error) {
      showNotification('error', `Lỗi khi xóa từ: ${error.message}`);
    }
  };

  // Render empty state if no vocabulary AND user is on home mode
  if (vocabulary.length === 0 && currentMode === 'home') {
    return <EmptyState setCurrentMode={setCurrentMode} />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative'>
      {/* Background decorative elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 -left-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-40 right-1/4 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl'></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
        <Header />

        <ModeSelector
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
        />

        {/* Main Content */}
        <main className='relative z-10'>
          {/* Home Page */}
          {currentMode === 'home' && (
            <HomePage
              vocabulary={vocabulary}
              favorites={favorites}
              setCurrentMode={setCurrentMode}
              currentWord={currentWord}
            />
          )}

          {/* Add New Word Mode */}
          {currentMode === 'add' && (
            <div className='animate-fadeInUp'>
              <AddWordMode
                newWord={newWord}
                setNewWord={setNewWord}
                addNewWord={handleAddWord}
              />
            </div>
          )}

          {/* AI Generate Words Mode */}
          {currentMode === 'ai' && (
            <div className='animate-fadeInUp'>
              <AIMode
                aiRequest={aiRequest}
                setAiRequest={setAiRequest}
                apiKey={apiKey}
                setApiKey={setApiKey}
                showApiSettings={showApiSettings}
                setShowApiSettings={setShowApiSettings}
                isLoading={isLoading}
                generateVocabularyWithAI={generateVocabularyWithAI}
                vocabulary={vocabulary}
              />
            </div>
          )}

          {/* Manage Words Mode */}
          {currentMode === 'manage' && (
            <div className='animate-fadeInUp'>
              <ManageMode
                filteredVocabulary={filteredVocabulary}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                editingWord={editingWord}
                setEditingWord={setEditingWord}
                vocabulary={vocabulary}
                updateWord={updateWord}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                deleteWord={handleDeleteWord}
              />
            </div>
          )}

          {/* Dictionary (AI) */}
          {currentMode === 'dictionary' && (
            <div className='animate-fadeInUp'>
              <DictionaryMode
                apiKey={apiKey}
                setApiKey={setApiKey}
                showNotification={showNotification}
              />
            </div>
          )}
        </main>

        <Footer />

        {/* Global UI Components */}
        <NotificationToast />
        <ConfirmDialog />

        {/* Loading overlay */}
        {isLoading && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4'>
              <div className='w-12 h-12 mx-auto mb-4 relative'>
                <div className='w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Đang xử lý...
              </h3>
              <p className='text-sm text-gray-600'>
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishVocabApp;
