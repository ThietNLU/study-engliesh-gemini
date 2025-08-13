import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Learning Progress State - tiến độ học tập, điểm, lịch ôn
export const useLearningStore = create(
  persist(
    (set, get) => ({
      // Quiz scores and progress
      score: { correct: 0, total: 0 },
      bestScore: { correct: 0, total: 0, percentage: 0 },

      // Study session tracking
      currentCard: 0,
      showAnswer: false,
      userAnswer: '',
      quizType: 'meaning', // 'meaning' | 'english'

      // Study progress tracking
      studyHistory: [], // Array of study sessions
      dailyGoal: 10, // words per day
      streak: 0, // consecutive days
      lastStudyDate: null,

      // Study schedule and review system
      reviewSchedule: {}, // wordId -> next review date
      learningStage: {}, // wordId -> stage (new, learning, reviewing, mastered)

      // Study statistics
      totalStudyTime: 0, // in minutes
      wordsLearned: 0,
      sessionsCompleted: 0,

      // Actions for quiz and study
      setScore: newScore => set({ score: newScore }),

      updateBestScore: () => {
        const { score, bestScore } = get();
        if (score.total > 0) {
          const percentage = Math.round((score.correct / score.total) * 100);
          if (percentage > bestScore.percentage) {
            set({
              bestScore: {
                correct: score.correct,
                total: score.total,
                percentage,
              },
            });
          }
        }
      },

      setCurrentCard: card => set({ currentCard: card }),
      setShowAnswer: show => set({ showAnswer: show }),
      setUserAnswer: answer => set({ userAnswer: answer }),
      setQuizType: type => set({ quizType: type }),

      // Navigation actions
      nextCard: vocabularyLength => {
        const { currentCard } = get();
        set({
          currentCard: (currentCard + 1) % vocabularyLength,
          showAnswer: false,
          userAnswer: '',
        });
      },

      prevCard: vocabularyLength => {
        const { currentCard } = get();
        set({
          currentCard: (currentCard - 1 + vocabularyLength) % vocabularyLength,
          showAnswer: false,
          userAnswer: '',
        });
      },

      resetQuiz: () =>
        set({
          score: { correct: 0, total: 0 },
          currentCard: 0,
          showAnswer: false,
          userAnswer: '',
        }),

      // Study session tracking
      startStudySession: () => {
        const now = new Date();
        const today = now.toDateString();
        const { lastStudyDate, streak } = get();

        // Update streak
        let newStreak = streak;
        if (lastStudyDate !== today) {
          const yesterday = new Date(
            now.getTime() - 24 * 60 * 60 * 1000
          ).toDateString();
          newStreak = lastStudyDate === yesterday ? streak + 1 : 1;
        }

        set({
          lastStudyDate: today,
          streak: newStreak,
        });
      },

      completeStudySession: (duration, wordsStudied) => {
        const {
          studyHistory,
          totalStudyTime,
          sessionsCompleted,
          wordsLearned,
        } = get();
        const session = {
          date: new Date().toISOString(),
          duration,
          wordsStudied,
          score: get().score,
        };

        set({
          studyHistory: [session, ...studyHistory.slice(0, 29)], // Keep last 30 sessions
          totalStudyTime: totalStudyTime + duration,
          sessionsCompleted: sessionsCompleted + 1,
          wordsLearned: wordsLearned + wordsStudied,
        });
      },

      // Spaced repetition system
      scheduleReview: (wordId, stage = 'new') => {
        const { reviewSchedule, learningStage } = get();
        const now = new Date();
        let nextReview = new Date(now);

        // Spaced repetition intervals (in days)
        const intervals = {
          new: 1,
          learning: 3,
          reviewing: 7,
          mastered: 30,
        };

        nextReview.setDate(now.getDate() + intervals[stage]);

        set({
          reviewSchedule: {
            ...reviewSchedule,
            [wordId]: nextReview.toISOString(),
          },
          learningStage: {
            ...learningStage,
            [wordId]: stage,
          },
        });
      },

      // Get words due for review
      getWordsToReview: vocabulary => {
        const { reviewSchedule } = get();
        const now = new Date();

        return vocabulary.filter(word => {
          const reviewDate = reviewSchedule[word.id];
          if (!reviewDate) return true; // New words
          return new Date(reviewDate) <= now;
        });
      },

      // Update learning progress for a word
      updateWordProgress: (wordId, isCorrect) => {
        const { learningStage } = get();
        const currentStage = learningStage[wordId] || 'new';

        let nextStage = currentStage;
        if (isCorrect) {
          const progression = {
            new: 'learning',
            learning: 'reviewing',
            reviewing: 'mastered',
            mastered: 'mastered',
          };
          nextStage = progression[currentStage];
        } else {
          // Reset to earlier stage if incorrect
          if (currentStage !== 'new') {
            nextStage = 'learning';
          }
        }

        get().scheduleReview(wordId, nextStage);
      },

      // Get study statistics
      getStudyStats: () => {
        const {
          studyHistory,
          streak,
          totalStudyTime,
          wordsLearned,
          sessionsCompleted,
        } = get();
        const today = new Date().toDateString();
        const thisWeek = studyHistory.filter(session => {
          const sessionDate = new Date(session.date);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return sessionDate >= weekAgo;
        });

        return {
          streak,
          totalStudyTime,
          wordsLearned,
          sessionsCompleted,
          averageScore:
            studyHistory.length > 0
              ? studyHistory.reduce((acc, session) => {
                  const sessionScore =
                    session.score.total > 0
                      ? (session.score.correct / session.score.total) * 100
                      : 0;
                  return acc + sessionScore;
                }, 0) / studyHistory.length
              : 0,
          weeklyProgress: {
            sessions: thisWeek.length,
            totalTime: thisWeek.reduce(
              (acc, session) => acc + session.duration,
              0
            ),
            wordsStudied: thisWeek.reduce(
              (acc, session) => acc + session.wordsStudied,
              0
            ),
          },
        };
      },
    }),
    {
      name: 'learning-progress-storage',
      partialize: state => ({
        // Only persist necessary learning data
        bestScore: state.bestScore,
        studyHistory: state.studyHistory,
        dailyGoal: state.dailyGoal,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        reviewSchedule: state.reviewSchedule,
        learningStage: state.learningStage,
        totalStudyTime: state.totalStudyTime,
        wordsLearned: state.wordsLearned,
        sessionsCompleted: state.sessionsCompleted,
      }),
    }
  )
);
