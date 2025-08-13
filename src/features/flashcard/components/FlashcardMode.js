import React, { useState, useEffect } from 'react';
import useFlashcardStore from '../../../shared/stores/flashcardStore';
import { flashcardService, reviewService } from '../services/flashcardService';

const FlashcardMode = () => {
  const {
    currentCard,
    showAnswer,
    studySession,
    filters,
    isLoading,
    startStudySession,
    reviewCard,
    endStudySession,
    toggleShowAnswer,
    setFilters,
    getCardStats,
    setCards,
    setLoading,
  } = useFlashcardStore();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [studyFilters, setStudyFilters] = useState({
    category: '',
    level: '',
    status: 'all',
    maxCards: 20,
  });
  const [reviewStartTime, setReviewStartTime] = useState(null);

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

  const handleStartSession = () => {
    const cardsToStudy = startStudySession(studyFilters);
    if (cardsToStudy > 0) {
      setSessionStarted(true);
      setReviewStartTime(Date.now());
    }
  };

  const handleCardReview = async rating => {
    if (!currentCard) return;

    const timeTaken = reviewStartTime
      ? Math.round((Date.now() - reviewStartTime) / 1000)
      : null;

    try {
      // Review card in store (SM-2 algorithm)
      const result = reviewCard(rating);

      // Save review to Firestore
      await Promise.all([
        flashcardService.update(currentCard.id, {
          interval: result.cardUpdated.interval,
          easeFactor: result.cardUpdated.easeFactor,
          repetitions: result.cardUpdated.repetitions,
          lastReviewed: result.cardUpdated.lastReviewed,
          nextReview: result.cardUpdated.nextReview,
          totalReviews: result.cardUpdated.totalReviews,
        }),
        reviewService.addReview(currentCard.id, rating, timeTaken),
      ]);

      // Reset timer for next card
      setReviewStartTime(Date.now());

      // End session if no more cards
      if (!result.hasMoreCards) {
        setSessionStarted(false);
        // Could show session summary here
      }
    } catch (error) {
      console.error('Error reviewing card:', error);
    }
  };

  const handleEndSession = () => {
    const sessionStats = endStudySession();
    setSessionStarted(false);
    // Could show session summary modal here
    console.log('Session ended:', sessionStats);
  };

  const cardStats = getCardStats();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-6 max-w-4xl'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          Flashcard Study
        </h1>
        <p className='text-gray-600'>
          Spaced repetition learning with SM-2 algorithm
        </p>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
        <div className='bg-blue-50 p-4 rounded-lg text-center'>
          <div className='text-2xl font-bold text-blue-600'>
            {cardStats.total}
          </div>
          <div className='text-sm text-gray-600'>Total Cards</div>
        </div>
        <div className='bg-yellow-50 p-4 rounded-lg text-center'>
          <div className='text-2xl font-bold text-yellow-600'>
            {cardStats.newCards}
          </div>
          <div className='text-sm text-gray-600'>New</div>
        </div>
        <div className='bg-orange-50 p-4 rounded-lg text-center'>
          <div className='text-2xl font-bold text-orange-600'>
            {cardStats.learning}
          </div>
          <div className='text-sm text-gray-600'>Learning</div>
        </div>
        <div className='bg-green-50 p-4 rounded-lg text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {cardStats.mature}
          </div>
          <div className='text-sm text-gray-600'>Mature</div>
        </div>
        <div className='bg-red-50 p-4 rounded-lg text-center'>
          <div className='text-2xl font-bold text-red-600'>{cardStats.due}</div>
          <div className='text-sm text-gray-600'>Due</div>
        </div>
      </div>

      {!sessionStarted ? (
        /* Session Setup */
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Start Study Session</h2>

          <div className='grid md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium mb-2'>Category</label>
              <select
                value={studyFilters.category}
                onChange={e =>
                  setStudyFilters({ ...studyFilters, category: e.target.value })
                }
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
                value={studyFilters.level}
                onChange={e =>
                  setStudyFilters({ ...studyFilters, level: e.target.value })
                }
                className='w-full p-2 border rounded-lg'
              >
                <option value=''>All Levels</option>
                <option value='A1'>A1 (Beginner)</option>
                <option value='A2'>A2 (Elementary)</option>
                <option value='B1'>B1 (Intermediate)</option>
                <option value='B2'>B2 (Upper-Intermediate)</option>
                <option value='C1'>C1 (Advanced)</option>
                <option value='C2'>C2 (Proficient)</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Card Status
              </label>
              <select
                value={studyFilters.status}
                onChange={e =>
                  setStudyFilters({ ...studyFilters, status: e.target.value })
                }
                className='w-full p-2 border rounded-lg'
              >
                <option value='all'>All Cards</option>
                <option value='new'>New Cards</option>
                <option value='learning'>Learning Cards</option>
                <option value='mature'>Mature Cards</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Max Cards
              </label>
              <select
                value={studyFilters.maxCards}
                onChange={e =>
                  setStudyFilters({
                    ...studyFilters,
                    maxCards: parseInt(e.target.value),
                  })
                }
                className='w-full p-2 border rounded-lg'
              >
                <option value={10}>10 cards</option>
                <option value={20}>20 cards</option>
                <option value={50}>50 cards</option>
                <option value={100}>100 cards</option>
              </select>
            </div>
          </div>

          <div className='flex justify-center'>
            <button
              onClick={handleStartSession}
              disabled={cardStats.due === 0}
              className={`px-8 py-3 rounded-lg font-semibold text-white ${
                cardStats.due === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {cardStats.due === 0
                ? 'No Cards Due'
                : `Start Session (${cardStats.due} due)`}
            </button>
          </div>
        </div>
      ) : (
        /* Study Session */
        <div className='space-y-6'>
          {/* Session Progress */}
          <div className='bg-white rounded-lg shadow-lg p-4'>
            <div className='flex justify-between items-center'>
              <div className='text-sm text-gray-600'>
                Card {studySession.completedCards + 1} of{' '}
                {studySession.currentSessionCards.length}
              </div>
              <div className='text-sm text-gray-600'>
                Completed: {studySession.completedCards}
              </div>
              <button
                onClick={handleEndSession}
                className='text-red-600 hover:text-red-800 text-sm font-medium'
              >
                End Session
              </button>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
              <div
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${(studySession.completedCards / studySession.currentSessionCards.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Current Card */}
          {currentCard && (
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <div className='text-center'>
                {/* Card Category/Level */}
                <div className='flex justify-center gap-2 mb-4'>
                  {currentCard.category && (
                    <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm'>
                      {currentCard.category}
                    </span>
                  )}
                  {currentCard.level && (
                    <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>
                      {currentCard.level}
                    </span>
                  )}
                </div>

                {/* Card Front */}
                <div className='mb-8'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                    {currentCard.front}
                  </h2>
                </div>

                {/* Show Answer Button or Answer */}
                {!showAnswer ? (
                  <button
                    onClick={toggleShowAnswer}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold'
                  >
                    Show Answer
                  </button>
                ) : (
                  <div className='space-y-6'>
                    {/* Card Back */}
                    <div className='bg-gray-50 rounded-lg p-6'>
                      <div className='text-lg text-gray-800 whitespace-pre-line'>
                        {currentCard.back}
                      </div>
                      {currentCard.notes && (
                        <div className='mt-4 text-sm text-gray-600 italic'>
                          Notes: {currentCard.notes}
                        </div>
                      )}
                    </div>

                    {/* Rating Buttons */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                      <button
                        onClick={() => handleCardReview('again')}
                        className='bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold'
                      >
                        <div className='text-sm'>Again</div>
                        <div className='text-xs opacity-80'>&lt;1 day</div>
                      </button>
                      <button
                        onClick={() => handleCardReview('hard')}
                        className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold'
                      >
                        <div className='text-sm'>Hard</div>
                        <div className='text-xs opacity-80'>
                          {Math.round(currentCard.interval * 0.85)}d
                        </div>
                      </button>
                      <button
                        onClick={() => handleCardReview('good')}
                        className='bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold'
                      >
                        <div className='text-sm'>Good</div>
                        <div className='text-xs opacity-80'>
                          {Math.round(
                            currentCard.interval *
                              (currentCard.easeFactor || 2.5)
                          )}
                          d
                        </div>
                      </button>
                      <button
                        onClick={() => handleCardReview('easy')}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold'
                      >
                        <div className='text-sm'>Easy</div>
                        <div className='text-xs opacity-80'>
                          {Math.round(
                            currentCard.interval *
                              (currentCard.easeFactor || 2.5) *
                              1.3
                          )}
                          d
                        </div>
                      </button>
                    </div>

                    {/* Card Info */}
                    <div className='text-xs text-gray-500 text-center'>
                      Interval: {currentCard.interval}d | Ease:{' '}
                      {(currentCard.easeFactor || 2.5).toFixed(1)} | Reviews:{' '}
                      {currentCard.totalReviews || 0}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardMode;
