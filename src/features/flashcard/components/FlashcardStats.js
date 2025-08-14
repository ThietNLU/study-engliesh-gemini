import React, { useState, useEffect } from 'react';
import useFlashcardStore from '../../../shared/stores/flashcardStore';
import { reviewService, sessionService } from '../services/flashcardService';

const FlashcardStats = () => {
  const { getCardStats } = useFlashcardStore();
  const [reviewStats, setReviewStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [dateRange, setDateRange] = useState('week'); // week, month, year
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadRecentSessions();
  }, [dateRange]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      const stats = await reviewService.getReviewStats(startDate, endDate);
      setReviewStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentSessions = async () => {
    try {
      const sessions = await sessionService.getRecentSessions(10);
      setRecentSessions(sessions);
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    }
  };

  const cardStats = getCardStats();

  const getRetentionRate = () => {
    if (!reviewStats || reviewStats.totalReviews === 0) return 0;
    const correctReviews = reviewStats.good + reviewStats.easy;
    return Math.round((correctReviews / reviewStats.totalReviews) * 100);
  };

  const getStreakData = () => {
    if (!reviewStats || !reviewStats.dailyStats) return [];

    const days = Object.keys(reviewStats.dailyStats).sort();
    return days.map(day => ({
      date: day,
      reviews: reviewStats.dailyStats[day].total,
      accuracy:
        reviewStats.dailyStats[day].total > 0
          ? Math.round(
              ((reviewStats.dailyStats[day].good +
                reviewStats.dailyStats[day].easy) /
                reviewStats.dailyStats[day].total) *
                100
            )
          : 0,
    }));
  };

  const formatDuration = minutes => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-6 max-w-6xl'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Study Statistics</h1>
          <p className='text-gray-600'>
            Track your flashcard learning progress
          </p>
        </div>
        <div>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className='p-2 border rounded-lg'
          >
            <option value='week'>Last Week</option>
            <option value='month'>Last Month</option>
            <option value='year'>Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8'>
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
          <div className='text-sm text-gray-600'>Due Today</div>
        </div>
        <div className='bg-purple-50 p-4 rounded-lg text-center'>
          <div className='text-2xl font-bold text-purple-600'>
            {getRetentionRate()}%
          </div>
          <div className='text-sm text-gray-600'>Retention</div>
        </div>
      </div>

      <div className='grid lg:grid-cols-2 gap-8'>
        {/* Review Statistics */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Review Statistics</h2>
          {reviewStats ? (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-gray-800'>
                    {reviewStats.totalReviews}
                  </div>
                  <div className='text-sm text-gray-600'>Total Reviews</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-gray-800'>
                    {reviewStats.averageTime
                      ? Math.round(reviewStats.averageTime) + 's'
                      : 'N/A'}
                  </div>
                  <div className='text-sm text-gray-600'>Avg Time</div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className='space-y-2'>
                <h3 className='font-medium text-gray-700'>
                  Rating Distribution
                </h3>
                <div className='space-y-2'>
                  <div className='flex items-center'>
                    <div className='w-16 text-sm text-red-600'>Again</div>
                    <div className='flex-1 bg-gray-200 rounded-full h-2 mx-2'>
                      <div
                        className='bg-red-500 h-2 rounded-full'
                        style={{
                          width: `${reviewStats.totalReviews > 0 ? (reviewStats.again / reviewStats.totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className='w-8 text-sm text-gray-600'>
                      {reviewStats.again}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 text-sm text-orange-600'>Hard</div>
                    <div className='flex-1 bg-gray-200 rounded-full h-2 mx-2'>
                      <div
                        className='bg-orange-500 h-2 rounded-full'
                        style={{
                          width: `${reviewStats.totalReviews > 0 ? (reviewStats.hard / reviewStats.totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className='w-8 text-sm text-gray-600'>
                      {reviewStats.hard}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 text-sm text-green-600'>Good</div>
                    <div className='flex-1 bg-gray-200 rounded-full h-2 mx-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full'
                        style={{
                          width: `${reviewStats.totalReviews > 0 ? (reviewStats.good / reviewStats.totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className='w-8 text-sm text-gray-600'>
                      {reviewStats.good}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 text-sm text-blue-600'>Easy</div>
                    <div className='flex-1 bg-gray-200 rounded-full h-2 mx-2'>
                      <div
                        className='bg-blue-500 h-2 rounded-full'
                        style={{
                          width: `${reviewStats.totalReviews > 0 ? (reviewStats.easy / reviewStats.totalReviews) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className='w-8 text-sm text-gray-600'>
                      {reviewStats.easy}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center text-gray-500 py-8'>
              No review data available for the selected period
            </div>
          )}
        </div>

        {/* Daily Activity */}
        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Daily Activity</h2>
          {reviewStats && reviewStats.dailyStats ? (
            <div className='space-y-3'>
              {getStreakData()
                .slice(-7)
                .map((day, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded'
                  >
                    <div className='text-sm font-medium'>
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='text-sm text-gray-600'>
                        {day.reviews} reviews
                      </div>
                      <div className='text-sm text-green-600'>
                        {day.accuracy}% accuracy
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className='text-center text-gray-500 py-8'>
              No daily activity data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className='bg-white rounded-lg shadow-lg p-6 mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Recent Study Sessions</h2>
        {recentSessions.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-2'>Date</th>
                  <th className='text-left py-2'>Duration</th>
                  <th className='text-left py-2'>Cards</th>
                  <th className='text-left py-2'>Again</th>
                  <th className='text-left py-2'>Hard</th>
                  <th className='text-left py-2'>Good</th>
                  <th className='text-left py-2'>Easy</th>
                  <th className='text-left py-2'>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session, index) => {
                  const totalCards =
                    session.stats.again +
                    session.stats.hard +
                    session.stats.good +
                    session.stats.easy;
                  const accuracy =
                    totalCards > 0
                      ? Math.round(
                          ((session.stats.good + session.stats.easy) /
                            totalCards) *
                            100
                        )
                      : 0;

                  return (
                    <tr key={index} className='border-b'>
                      <td className='py-2'>
                        {new Date(session.startedAt).toLocaleDateString()}
                      </td>
                      <td className='py-2'>
                        {session.duration
                          ? formatDuration(session.duration)
                          : 'N/A'}
                      </td>
                      <td className='py-2'>{totalCards}</td>
                      <td className='py-2 text-red-600'>
                        {session.stats.again}
                      </td>
                      <td className='py-2 text-orange-600'>
                        {session.stats.hard}
                      </td>
                      <td className='py-2 text-green-600'>
                        {session.stats.good}
                      </td>
                      <td className='py-2 text-blue-600'>
                        {session.stats.easy}
                      </td>
                      <td className='py-2'>
                        <span
                          className={`font-medium ${accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}
                        >
                          {accuracy}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center text-gray-500 py-8'>
            No study sessions found
          </div>
        )}
      </div>

      {/* Card Distribution */}
      <div className='bg-white rounded-lg shadow-lg p-6 mt-8'>
        <h2 className='text-xl font-semibold mb-4'>
          Card Distribution by Interval
        </h2>
        <div className='grid md:grid-cols-3 gap-4'>
          {/* New Cards */}
          <div className='text-center'>
            <div className='text-3xl font-bold text-yellow-600 mb-2'>
              {cardStats.newCards}
            </div>
            <div className='text-sm text-gray-600 mb-2'>New Cards</div>
            <div className='text-xs text-gray-500'>Never reviewed</div>
          </div>

          {/* Learning Cards */}
          <div className='text-center'>
            <div className='text-3xl font-bold text-orange-600 mb-2'>
              {cardStats.learning}
            </div>
            <div className='text-sm text-gray-600 mb-2'>Learning Cards</div>
            <div className='text-xs text-gray-500'>Interval &lt; 21 days</div>
          </div>

          {/* Mature Cards */}
          <div className='text-center'>
            <div className='text-3xl font-bold text-green-600 mb-2'>
              {cardStats.mature}
            </div>
            <div className='text-sm text-gray-600 mb-2'>Mature Cards</div>
            <div className='text-xs text-gray-500'>Interval ≥ 21 days</div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className='mt-6'>
          <div className='flex items-center justify-between text-sm text-gray-600 mb-2'>
            <span>Learning Progress</span>
            <span>
              {cardStats.total > 0
                ? Math.round((cardStats.mature / cardStats.total) * 100)
                : 0}
              % Mature
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-3'>
            <div className='flex h-3 rounded-full overflow-hidden'>
              <div
                className='bg-yellow-500'
                style={{
                  width: `${cardStats.total > 0 ? (cardStats.newCards / cardStats.total) * 100 : 0}%`,
                }}
              ></div>
              <div
                className='bg-orange-500'
                style={{
                  width: `${cardStats.total > 0 ? (cardStats.learning / cardStats.total) * 100 : 0}%`,
                }}
              ></div>
              <div
                className='bg-green-500'
                style={{
                  width: `${cardStats.total > 0 ? (cardStats.mature / cardStats.total) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStats;
