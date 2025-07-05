# Class Diagram - Study English Vocabulary App

## Sơ đồ lớp của ứng dụng học từ vựng tiếng Anh với AI

```mermaid
classDiagram
    %% Main App Component
    class EnglishVocabApp {
        -currentMode: string
        -currentCard: number
        -showAnswer: boolean
        -score: Object
        -userAnswer: string
        -quizType: string
        -accent: string
        -editingWord: number
        -searchTerm: string
        -aiRequest: string
        -isLoading: boolean
        -showApiSettings: boolean
        -newWord: Object
        +nextCard()
        +prevCard()
        +checkAnswer()
        +resetQuiz()
        +addNewWord()
        +generateVocabularyWithAI()
        +render()
    }

    %% Custom Hooks
    class useVocabulary {
        -vocabulary: Array~VocabularyItem~
        -loading: boolean
        -error: string
        +addWord(newWord)
        +updateWord(id, updatedWord)
        +deleteWord(id)
        +addWordsFromAI(aiWords)
        +resetVocabulary()
    }

    class useFavorites {
        -favorites: Set~number~
        -loading: boolean
        -error: string
        +addFavorite(wordId)
        +removeFavorite(wordId)
        +toggleFavorite(wordId)
        +isFavorite(wordId)
    }

    class useApiKey {
        -apiKey: string
        -loading: boolean
        -error: string
        +setApiKey(key)
        +getApiKey()
        +clearApiKey()
    }

    %% UI Components
    class Header {
        -accent: string
        -setAccent: function
        +render()
    }

    class ModeSelector {
        -currentMode: string
        -setCurrentMode: function
        -resetQuiz: function
        +render()
    }

    class StudyMode {
        -currentWord: VocabularyItem
        -currentCard: number
        -vocabulary: Array~VocabularyItem~
        -favorites: Set~number~
        -toggleFavorite: function
        -accent: string
        -nextCard: function
        -prevCard: function
        +render()
    }

    class QuizMode {
        -currentWord: VocabularyItem
        -quizType: string
        -setQuizType: function
        -score: Object
        -userAnswer: string
        -setUserAnswer: function
        -showAnswer: boolean
        -checkAnswer: function
        -nextCard: function
        -accent: string
        +render()
    }

    class AddWordMode {
        -newWord: VocabularyItem
        -setNewWord: function
        -addNewWord: function
        +render()
    }

    class AIMode {
        -aiRequest: string
        -setAiRequest: function
        -apiKey: string
        -setApiKey: function
        -showApiSettings: boolean
        -setShowApiSettings: function
        -isLoading: boolean
        -generateVocabularyWithAI: function
        -vocabulary: Array~VocabularyItem~
        +handleTestApi()
        +render()
    }

    class ManageMode {
        -filteredVocabulary: Array~VocabularyItem~
        -searchTerm: string
        -setSearchTerm: function
        -editingWord: number
        -setEditingWord: function
        -vocabulary: Array~VocabularyItem~
        -updateWord: function
        -favorites: Set~number~
        -toggleFavorite: function
        -deleteWord: function
        -accent: string
        -selectedCategory: string
        +handleWordChange(wordId, field, value)
        +render()
    }

    class HomePage {
        -vocabulary: Array~VocabularyItem~
        -favorites: Set~number~
        -setCurrentMode: function
        -score: Object
        -currentWord: VocabularyItem
        +render()
    }

    class Statistics {
        -vocabulary: Array~VocabularyItem~
        -favorites: Set~number~
        +render()
    }

    class DatabaseManager {
        -vocabulary: Array~VocabularyItem~
        -favorites: Set~number~
        -stats: Object
        -currentBackend: string
        +exportData()
        +importData()
        +switchBackend()
        +render()
    }

    class EmptyState {
        -setCurrentMode: function
        +render()
    }

    class CategoryOverview {
        -vocabulary: Array~VocabularyItem~
        -selectedCategory: string
        -onCategorySelect: function
        +render()
    }

    class Footer {
        +render()
    }

    %% Services
    class GeminiService {
        -baseUrl: string
        +generateVocabulary(aiRequest, existingWords, apiKey)
        +createPrompt(aiRequest, existingWords)
        +parseResponse(aiText)
        +fixJsonFormat(jsonString)
    }

    class StorageService {
        -backend: string
        +vocabulary: VocabularyOperations
        +favorites: FavoritesOperations
        +settings: SettingsOperations
        +migration: MigrationOperations
        +getStorageBackend()
        +isFirestoreAvailable()
    }

    class FirestoreService {
        -db: Firestore
        +vocabularyService: VocabularyFirestoreService
        +favoritesService: FavoritesFirestoreService
        +userSettingsService: UserSettingsFirestoreService
        +migrationService: MigrationFirestoreService
    }

    class SafeStorageService {
        +getBackend()
        +isUsingFirestore()
        +vocabulary: VocabularyOperations
        +favorites: FavoritesOperations
        +settings: SettingsOperations
    }

    %% Data Models
    class VocabularyItem {
        +id: number
        +english: string
        +vietnamese: string
        +pronunciation_us: string
        +pronunciation_uk: string
        +category: string
        +definition: string
        +example: string
        +level: string
        +dateAdded: string
    }

    class Score {
        +correct: number
        +total: number
    }

    class Category {
        +id: string
        +name: string
        +icon: string
        +description: string
    }

    class Level {
        +id: string
        +name: string
        +description: string
    }

    %% Utility Classes
    class Helpers {
        +speak(text, accent)
        +checkDuplicate(word, vocabulary)
        +filterVocabulary(vocabulary, searchTerm)
        +getCategoryInfo(categoryId, categories)
        +getCategories(vocabulary)
        +mapLevelToDisplay(level)
        +storage: StorageHelpers
    }

    class StorageHelpers {
        +getVocabulary()
        +setVocabulary(vocabulary)
        +getFavorites()
        +setFavorites(favorites)
        +getApiKey()
        +setApiKey(apiKey)
        +clear()
    }

    class ApiTest {
        +testGeminiConnection(apiKey)
    }

    %% Data Classes
    class InitialVocabulary {
        +initialVocabulary: Array~VocabularyItem~
        +categories: Array~Category~
        +levels: Array~string~
        +levelLabels: Object
    }

    %% Relationships
    EnglishVocabApp --> useVocabulary
    EnglishVocabApp --> useFavorites
    EnglishVocabApp --> useApiKey
    EnglishVocabApp --> Header
    EnglishVocabApp --> ModeSelector
    EnglishVocabApp --> StudyMode
    EnglishVocabApp --> QuizMode
    EnglishVocabApp --> AddWordMode
    EnglishVocabApp --> AIMode
    EnglishVocabApp --> ManageMode
    EnglishVocabApp --> HomePage
    EnglishVocabApp --> Statistics
    EnglishVocabApp --> DatabaseManager
    EnglishVocabApp --> EmptyState
    EnglishVocabApp --> Footer
    EnglishVocabApp --> GeminiService
    EnglishVocabApp --> Helpers

    useVocabulary --> StorageService
    useFavorites --> StorageService
    useApiKey --> StorageService

    StudyMode --> VocabularyItem
    StudyMode --> Helpers
    
    QuizMode --> VocabularyItem
    QuizMode --> Helpers
    
    AddWordMode --> VocabularyItem
    
    AIMode --> GeminiService
    AIMode --> ApiTest
    AIMode --> VocabularyItem
    
    ManageMode --> VocabularyItem
    ManageMode --> Helpers
    ManageMode --> Category
    
    HomePage --> VocabularyItem
    HomePage --> Score
    
    Statistics --> VocabularyItem
    Statistics --> Category
    Statistics --> Helpers
    
    DatabaseManager --> StorageService
    DatabaseManager --> VocabularyItem
    
    CategoryOverview --> VocabularyItem
    CategoryOverview --> Category

    GeminiService --> VocabularyItem
    
    StorageService --> VocabularyItem
    StorageService --> FirestoreService
    StorageService --> SafeStorageService
    
    FirestoreService --> VocabularyItem
    
    SafeStorageService --> VocabularyItem
    SafeStorageService --> StorageHelpers
    
    Helpers --> StorageHelpers
    Helpers --> VocabularyItem
    
    InitialVocabulary --> VocabularyItem
    InitialVocabulary --> Category
    InitialVocabulary --> Level

    %% Composition relationships
    EnglishVocabApp *-- Score
    useVocabulary *-- VocabularyItem
    useFavorites *-- VocabularyItem
    
    %% Inheritance/Implementation (if any)
    StorageService <|-- FirestoreService
    StorageService <|-- SafeStorageService
```

## Mô tả chi tiết các lớp

### 1. **EnglishVocabApp** - Lớp chính
- **Vai trò**: Component gốc của ứng dụng, quản lý state tổng thể
- **Chức năng**: Điều phối tương tác giữa các component con, quản lý routing giữa các mode

### 2. **Custom Hooks**
- **useVocabulary**: Quản lý CRUD operations cho từ vựng
- **useFavorites**: Quản lý danh sách từ yêu thích
- **useApiKey**: Quản lý API key cho Gemini service

### 3. **UI Components**
- **Header**: Thanh tiêu đề với selector giọng đọc
- **ModeSelector**: Navigation tabs giữa các chế độ
- **StudyMode**: Flashcard học từ vựng
- **QuizMode**: Chế độ kiểm tra với quiz
- **AddWordMode**: Form thêm từ vựng mới
- **AIMode**: Interface tương tác với Gemini AI
- **ManageMode**: Quản lý và chỉnh sửa từ vựng
- **HomePage**: Trang chủ với thống kê tổng quan
- **Statistics**: Thống kê chi tiết theo CEFR và category
- **DatabaseManager**: Quản lý database và migration
- **EmptyState**: Hiển thị khi chưa có dữ liệu
- **CategoryOverview**: Tổng quan theo danh mục
- **Footer**: Chân trang

### 4. **Services**
- **GeminiService**: Tương tác với Google Gemini API
- **StorageService**: Abstraction layer cho storage operations
- **FirestoreService**: Implementation cho Firestore
- **SafeStorageService**: Fallback implementation cho localStorage

### 5. **Data Models**
- **VocabularyItem**: Model cho một từ vựng
- **Score**: Model cho điểm quiz
- **Category**: Model cho danh mục từ loại
- **Level**: Model cho cấp độ CEFR

### 6. **Utilities**
- **Helpers**: Utility functions (speak, filter, etc.)
- **StorageHelpers**: Helper functions cho localStorage
- **ApiTest**: Test kết nối API
- **InitialVocabulary**: Dữ liệu khởi tạo

## Luồng dữ liệu chính

1. **App khởi tạo** → useVocabulary → StorageService → Load dữ liệu
2. **User thêm từ** → AddWordMode → useVocabulary → StorageService → Save
3. **AI tạo từ** → AIMode → GeminiService → useVocabulary → StorageService
4. **Học từ vựng** → StudyMode → Helpers.speak() → Web Speech API
5. **Quiz** → QuizMode → Tính điểm → Update Score state
6. **Quản lý** → ManageMode → useVocabulary → CRUD operations

## Patterns sử dụng

- **Custom Hooks Pattern**: Tách logic ra khỏi UI components
- **Service Layer Pattern**: Tách biệt business logic và data access
- **Strategy Pattern**: StorageService có thể switch giữa localStorage và Firestore
- **Observer Pattern**: React hooks để theo dõi state changes
- **Facade Pattern**: StorageService che giấu complexity của storage backends

Sơ đồ này thể hiện kiến trúc modular và scalable của ứng dụng, với separation of concerns rõ ràng giữa UI, business logic, và data layer.
