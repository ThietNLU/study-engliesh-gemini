# Flashcard System with Spaced Repetition (SM-2)

This implementation provides a complete flashcard system with spaced repetition using the SM-2 algorithm, similar to Anki.

## Features

### 🎯 Core Features
- **SM-2 Algorithm**: Industry-standard spaced repetition algorithm
- **4-Level Rating System**: Again/Hard/Good/Easy (Anki-style)
- **Firestore Integration**: Stores cards and reviews in `users/{uid}/cards` and `users/{uid}/reviews`
- **Import/Export**: Support for CSV, Anki format, and vocabulary conversion
- **Study Sessions**: Track progress and statistics
- **Comprehensive Statistics**: Review history, retention rates, and progress tracking

### 📊 Database Structure

#### Cards Collection (`users/{uid}/cards`)
```javascript
{
  id: "card_id",
  front: "Question or word",
  back: "Answer or definition",
  category: "vocabulary|grammar|phrases",
  level: "A1|A2|B1|B2|C1|C2",
  tags: ["tag1", "tag2"],
  notes: "Additional notes",
  
  // SM-2 Algorithm fields
  interval: 1,              // Days until next review
  easeFactor: 2.5,         // Ease factor (1.3 - ∞)
  repetitions: 0,          // Number of successful reviews
  totalReviews: 0,         // Total number of reviews
  lastReviewed: "2025-08-14T10:00:00Z",
  nextReview: "2025-08-15T10:00:00Z",
  
  // Metadata
  createdAt: "2025-08-14T10:00:00Z",
  updatedAt: "2025-08-14T10:00:00Z",
  sourceType: "vocabulary", // If converted from vocabulary
  sourceId: "vocab_id"     // Original vocabulary ID
}
```

#### Reviews Collection (`users/{uid}/reviews`)
```javascript
{
  id: "review_id",
  cardId: "card_id",
  rating: "again|hard|good|easy",
  reviewedAt: "2025-08-14T10:00:00Z",
  timeTaken: 5             // Seconds taken to review
}
```

#### Sessions Collection (`users/{uid}/sessions`)
```javascript
{
  id: "session_id",
  startedAt: "2025-08-14T10:00:00Z",
  endedAt: "2025-08-14T10:30:00Z",
  filters: {
    category: "vocabulary",
    level: "B1"
  },
  completedCards: 15,
  stats: {
    again: 2,
    hard: 3,
    good: 8,
    easy: 2
  },
  duration: 30,            // Minutes
  isActive: false
}
```

### 🧠 SM-2 Algorithm Implementation

The SM-2 algorithm calculates the next review interval based on:

#### Rating Effects:
- **Again (1)**: Reset interval to 1 day, decrease ease factor by 0.2
- **Hard (2)**: Reduce interval by 15%, decrease ease factor by 0.15
- **Good (3)**: Normal progression based on ease factor
- **Easy (4)**: Bonus progression, increase ease factor by 0.15

#### Interval Calculation:
```javascript
// First review: 1 day
// Second review: 6 days
// Subsequent reviews: previous_interval × ease_factor

if (repetitions === 1) interval = 1;
else if (repetitions === 2) interval = 6;
else interval = Math.round(previous_interval × ease_factor);
```

#### Ease Factor:
- Initial: 2.5
- Minimum: 1.3
- Adjusted based on review rating

### 🚀 Usage

#### 1. Study Session
```javascript
import { useFlashcardStore } from '../shared/stores';

const { startStudySession, reviewCard, endStudySession } = useFlashcardStore();

// Start session with filters
const cardCount = startStudySession({
  category: 'vocabulary',
  level: 'B1',
  status: 'all',
  maxCards: 20
});

// Review current card
const result = reviewCard('good'); // 'again', 'hard', 'good', 'easy'

// End session
const sessionStats = endStudySession();
```

#### 2. Card Management
```javascript
import { flashcardService } from '../features/flashcard';

// Add new card
const newCard = await flashcardService.add({
  front: 'Hello',
  back: 'Xin chào',
  category: 'vocabulary',
  level: 'A1'
});

// Update card
await flashcardService.update(cardId, {
  back: 'Updated definition'
});

// Get due cards
const dueCards = await flashcardService.getDueCards();
```

#### 3. Import/Export
```javascript
import { flashcardUtils } from '../features/flashcard';

// Import from CSV
const csvData = "front,back,category\nHello,Xin chào,vocabulary";
const cards = flashcardUtils.parseCSV(csvData);
await flashcardService.addMultiple(cards);

// Export to Anki format
const cards = await flashcardService.getAll();
const ankiData = flashcardUtils.exportToAnki(cards);

// Convert vocabulary to flashcards
const vocabWords = await vocabularyService.getAll();
const flashcards = flashcardUtils.vocabArrayToCards(vocabWords);
```

#### 4. Migration from Vocabulary
```javascript
import { migrationUtils } from '../shared/utils/migrationUtils';

// Migrate all vocabulary
const result = await migrationUtils.migrateVocabularyToFlashcards();
console.log(`Migrated ${result.count} cards`);

// Check migration progress
const stats = await migrationUtils.getMigrationStats();
console.log(`Progress: ${stats.flashcardsFromVocab}/${stats.totalVocabulary}`);
```

### 📁 File Structure
```
src/
├── features/flashcard/
│   ├── components/
│   │   ├── FlashcardMode.js          # Study interface
│   │   ├── FlashcardManager.js       # Card management
│   │   └── FlashcardStats.js         # Statistics dashboard
│   ├── services/
│   │   └── flashcardService.js       # Firestore operations
│   └── index.js
├── shared/
│   ├── stores/
│   │   └── flashcardStore.js         # Zustand store with SM-2
│   └── utils/
│       └── migrationUtils.js         # Migration utilities
```

### 🎨 UI Components

#### Navigation
- **Flashcard**: Study mode with spaced repetition
- **Quản lý thẻ**: Card management (create/edit/import/export)
- **Thống kê**: Statistics and progress tracking

#### Study Interface
- Clean card presentation with front/back
- 4-button rating system with interval preview
- Progress bar and session statistics
- Category and level filtering

#### Management Interface
- Grid view of all cards
- Search and filter options
- Bulk import/export operations
- Edit in place functionality

#### Statistics Dashboard
- Card distribution (new/learning/mature)
- Review statistics and retention rates
- Daily activity tracking
- Session history

### 📊 Export Formats

#### CSV Format
```csv
front,back,category,level,tags,notes
Hello,Xin chào,vocabulary,A1,"greeting basic",""
```

#### Anki Format (Tab-separated)
```
Hello	Xin chào	greeting basic
Goodbye	Tạm biệt	greeting basic
```

### 🔧 Configuration

#### SM-2 Constants
```javascript
const SM2_CONSTANTS = {
  MIN_EASE_FACTOR: 1.3,
  INITIAL_EASE_FACTOR: 2.5,
  INITIAL_INTERVAL: 1,
  INTERVAL_MULTIPLIER: {
    AGAIN: 0,
    HARD: 0.85,
    GOOD: 1,
    EASY: 1.3
  },
  EASE_FACTOR_DELTA: {
    AGAIN: -0.2,
    HARD: -0.15,
    GOOD: 0,
    EASY: 0.15
  }
};
```

### 🚀 Getting Started

1. **Import existing vocabulary**:
   - Go to "Quản lý thẻ" → Import → "From Vocabulary Collection"

2. **Start studying**:
   - Go to "Flashcard" → Configure filters → Start Session

3. **Track progress**:
   - Go to "Thống kê" to view detailed statistics

4. **Export for backup**:
   - Use CSV or Anki format for external backup

### 🔄 Future Enhancements

- [ ] .apkg file support (Anki deck format)
- [ ] Audio pronunciation support
- [ ] Image attachments for cards
- [ ] Collaborative deck sharing
- [ ] Advanced analytics and insights
- [ ] Mobile app synchronization
- [ ] Offline support with sync

### 📚 References

- [SM-2 Algorithm Documentation](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki Manual](https://docs.ankiweb.net/)
- [Spaced Repetition Research](https://en.wikipedia.org/wiki/Spaced_repetition)
