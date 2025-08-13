import React, { useState, useEffect } from 'react';
import useFlashcardStore from '../../../shared/stores/flashcardStore';
import { flashcardService, flashcardUtils } from '../services/flashcardService';
import { vocabularyService } from '../../vocab/services/firestoreService';

const FlashcardManager = () => {
  const {
    cards,
    filters,
    isLoading,
    setCards,
    addCard,
    updateCard,
    deleteCard,
    setFilters,
    getFilteredCards,
    importCards,
    exportCards,
    clearAllCards,
    setLoading,
  } = useFlashcardStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState('csv'); // csv, anki, vocabulary

  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    category: '',
    level: '',
    tags: [],
    notes: '',
  });

  // Load cards on component mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const cards = await flashcardService.getAll();
      setCards(cards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    try {
      const addedCard = await flashcardService.add(newCard);
      addCard(addedCard);
      setNewCard({
        front: '',
        back: '',
        category: '',
        level: '',
        tags: [],
        notes: '',
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleEditCard = async card => {
    try {
      await flashcardService.update(card.id, card);
      updateCard(card.id, card);
      setEditingCard(null);
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async cardId => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      await flashcardService.delete(cardId);
      deleteCard(cardId);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleImport = async () => {
    if (!importText.trim() && importFormat !== 'vocabulary') return;

    try {
      let cardsToImport = [];

      if (importFormat === 'csv') {
        cardsToImport = flashcardUtils.parseCSV(importText);
      } else if (importFormat === 'anki') {
        cardsToImport = flashcardUtils.parseAnki(importText);
      } else if (importFormat === 'vocabulary') {
        // Import from vocabulary collection
        const vocabWords = await vocabularyService.getAll();
        cardsToImport = flashcardUtils.vocabArrayToCards(vocabWords);
      }

      if (cardsToImport.length > 0) {
        const addedCards = await flashcardService.addMultiple(cardsToImport);
        const importedCount = importCards(cardsToImport);
        setShowImportModal(false);
        setImportText('');
        loadCards(); // Reload to get updated cards
        alert(`Successfully imported ${importedCount} cards!`);
      } else {
        alert('No cards to import or invalid format!');
      }
    } catch (error) {
      console.error('Error importing cards:', error);
      alert('Error importing cards. Please check the format.');
    }
  };

  const handleExport = format => {
    const cardsToExport = getFilteredCards();

    if (cardsToExport.length === 0) {
      alert('No cards to export!');
      return;
    }

    let exportContent = '';
    let filename = '';

    if (format === 'csv') {
      exportContent = flashcardUtils.exportToCSV(cardsToExport);
      filename = 'flashcards.csv';
    } else if (format === 'anki') {
      exportContent = flashcardUtils.exportToAnki(cardsToExport);
      filename = 'flashcards.txt';
    }

    // Download file
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete ALL flashcards? This cannot be undone.'
      )
    )
      return;

    try {
      await flashcardService.clear();
      clearAllCards();
    } catch (error) {
      console.error('Error clearing cards:', error);
    }
  };

  const filteredCards = getFilteredCards();

  return (
    <div className='container mx-auto px-4 py-6 max-w-6xl'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>
            Flashcard Manager
          </h1>
          <p className='text-gray-600'>
            Create, edit, and manage your flashcards
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setShowAddForm(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold'
          >
            + Add Card
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold'
          >
            Import
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-lg p-4 mb-6'>
        <div className='grid md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Category</label>
            <select
              value={filters.category}
              onChange={e => setFilters({ category: e.target.value })}
              className='w-full p-2 border rounded-lg'
            >
              <option value=''>All Categories</option>
              <option value='vocabulary'>Vocabulary</option>
              <option value='grammar'>Grammar</option>
              <option value='phrases'>Phrases</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Level</label>
            <select
              value={filters.level}
              onChange={e => setFilters({ level: e.target.value })}
              className='w-full p-2 border rounded-lg'
            >
              <option value=''>All Levels</option>
              <option value='A1'>A1</option>
              <option value='A2'>A2</option>
              <option value='B1'>B1</option>
              <option value='B2'>B2</option>
              <option value='C1'>C1</option>
              <option value='C2'>C2</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Status</label>
            <select
              value={filters.status}
              onChange={e => setFilters({ status: e.target.value })}
              className='w-full p-2 border rounded-lg'
            >
              <option value='all'>All Cards</option>
              <option value='new'>New</option>
              <option value='learning'>Learning</option>
              <option value='mature'>Mature</option>
            </select>
          </div>

          <div className='flex items-end gap-2'>
            <button
              onClick={() => handleExport('csv')}
              className='bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm'
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('anki')}
              className='bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm'
            >
              Export Anki
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='bg-gray-50 rounded-lg p-4 mb-6'>
        <div className='text-center text-gray-600'>
          Showing {filteredCards.length} of {cards.length} cards
          {filteredCards.length > 0 && (
            <button
              onClick={handleClearAll}
              className='ml-4 text-red-600 hover:text-red-800 text-sm'
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredCards.map(card => (
            <div key={card.id} className='bg-white rounded-lg shadow-lg p-4'>
              <div className='mb-3'>
                <div className='flex justify-between items-start mb-2'>
                  <div className='font-semibold text-gray-800 flex-1 mr-2'>
                    {card.front}
                  </div>
                  <div className='flex gap-1'>
                    <button
                      onClick={() => setEditingCard(card)}
                      className='text-blue-600 hover:text-blue-800 text-sm'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className='text-red-600 hover:text-red-800 text-sm'
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className='text-gray-600 text-sm mb-2 line-clamp-3'>
                  {card.back}
                </div>
                <div className='flex gap-2 flex-wrap'>
                  {card.category && (
                    <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                      {card.category}
                    </span>
                  )}
                  {card.level && (
                    <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-xs'>
                      {card.level}
                    </span>
                  )}
                </div>
              </div>
              <div className='text-xs text-gray-500'>
                <div>Interval: {card.interval || 1}d</div>
                <div>Reviews: {card.totalReviews || 0}</div>
                <div>
                  Next:{' '}
                  {card.nextReview
                    ? new Date(card.nextReview).toLocaleDateString()
                    : 'Now'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      {showAddForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h2 className='text-xl font-semibold mb-4'>Add New Card</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Front (Question)
                </label>
                <input
                  type='text'
                  value={newCard.front}
                  onChange={e =>
                    setNewCard({ ...newCard, front: e.target.value })
                  }
                  className='w-full p-2 border rounded-lg'
                  placeholder='Enter question or word'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Back (Answer)
                </label>
                <textarea
                  value={newCard.back}
                  onChange={e =>
                    setNewCard({ ...newCard, back: e.target.value })
                  }
                  className='w-full p-2 border rounded-lg h-24'
                  placeholder='Enter answer or definition'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Category
                  </label>
                  <select
                    value={newCard.category}
                    onChange={e =>
                      setNewCard({ ...newCard, category: e.target.value })
                    }
                    className='w-full p-2 border rounded-lg'
                  >
                    <option value=''>Select Category</option>
                    <option value='vocabulary'>Vocabulary</option>
                    <option value='grammar'>Grammar</option>
                    <option value='phrases'>Phrases</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Level
                  </label>
                  <select
                    value={newCard.level}
                    onChange={e =>
                      setNewCard({ ...newCard, level: e.target.value })
                    }
                    className='w-full p-2 border rounded-lg'
                  >
                    <option value=''>Select Level</option>
                    <option value='A1'>A1</option>
                    <option value='A2'>A2</option>
                    <option value='B1'>B1</option>
                    <option value='B2'>B2</option>
                    <option value='C1'>C1</option>
                    <option value='C2'>C2</option>
                  </select>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Notes (Optional)
                </label>
                <textarea
                  value={newCard.notes}
                  onChange={e =>
                    setNewCard({ ...newCard, notes: e.target.value })
                  }
                  className='w-full p-2 border rounded-lg h-16'
                  placeholder='Additional notes'
                />
              </div>
            </div>
            <div className='flex gap-3 mt-6'>
              <button
                onClick={handleAddCard}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg'
              >
                Add Card
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl mx-4'>
            <h2 className='text-xl font-semibold mb-4'>Import Cards</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Import Format
                </label>
                <select
                  value={importFormat}
                  onChange={e => setImportFormat(e.target.value)}
                  className='w-full p-2 border rounded-lg'
                >
                  <option value='csv'>CSV Format</option>
                  <option value='anki'>Anki Format (Tab-separated)</option>
                  <option value='vocabulary'>From Vocabulary Collection</option>
                </select>
              </div>

              {importFormat !== 'vocabulary' && (
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Paste your {importFormat.toUpperCase()} data
                  </label>
                  <textarea
                    value={importText}
                    onChange={e => setImportText(e.target.value)}
                    className='w-full p-3 border rounded-lg h-48 font-mono text-sm'
                    placeholder={
                      importFormat === 'csv'
                        ? 'front,back,category,level\nHello,Xin chào,vocabulary,A1\nGoodbye,Tạm biệt,vocabulary,A1'
                        : 'Hello\tXin chào\tvocabulary\nGoodbye\tTạm biệt\tvocabulary'
                    }
                  />
                </div>
              )}

              {importFormat === 'vocabulary' && (
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <p className='text-blue-800'>
                    This will import all words from your vocabulary collection
                    as flashcards.
                  </p>
                </div>
              )}
            </div>
            <div className='flex gap-3 mt-6'>
              <button
                onClick={handleImport}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg'
              >
                Import Cards
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {editingCard && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <h2 className='text-xl font-semibold mb-4'>Edit Card</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Front</label>
                <input
                  type='text'
                  value={editingCard.front}
                  onChange={e =>
                    setEditingCard({ ...editingCard, front: e.target.value })
                  }
                  className='w-full p-2 border rounded-lg'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Back</label>
                <textarea
                  value={editingCard.back}
                  onChange={e =>
                    setEditingCard({ ...editingCard, back: e.target.value })
                  }
                  className='w-full p-2 border rounded-lg h-24'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Category
                  </label>
                  <select
                    value={editingCard.category || ''}
                    onChange={e =>
                      setEditingCard({
                        ...editingCard,
                        category: e.target.value,
                      })
                    }
                    className='w-full p-2 border rounded-lg'
                  >
                    <option value=''>Select Category</option>
                    <option value='vocabulary'>Vocabulary</option>
                    <option value='grammar'>Grammar</option>
                    <option value='phrases'>Phrases</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Level
                  </label>
                  <select
                    value={editingCard.level || ''}
                    onChange={e =>
                      setEditingCard({ ...editingCard, level: e.target.value })
                    }
                    className='w-full p-2 border rounded-lg'
                  >
                    <option value=''>Select Level</option>
                    <option value='A1'>A1</option>
                    <option value='A2'>A2</option>
                    <option value='B1'>B1</option>
                    <option value='B2'>B2</option>
                    <option value='C1'>C1</option>
                    <option value='C2'>C2</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => handleEditCard(editingCard)}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg'
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingCard(null)}
                className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardManager;
