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

## Data Flow Diagram - Luồng dữ liệu

### Sơ đồ luồng dữ liệu của ứng dụng Study English

```mermaid
flowchart TD
    %% External Entities
    User[👤 User]
    GeminiAPI[🤖 Gemini API]
    LocalStorage[💾 Local Storage]
    Firestore[☁️ Firestore]
    WebSpeech[🔊 Web Speech API]

    %% Main App
    App[📱 EnglishVocabApp<br/>Main Controller]

    %% Custom Hooks Layer
    subgraph "Custom Hooks Layer"
        VocabHook[useVocabulary<br/>📚 Vocabulary Manager]
        FavHook[useFavorites<br/>⭐ Favorites Manager]
        ApiHook[useApiKey<br/>🔑 API Key Manager]
    end

    %% Service Layer
    subgraph "Service Layer"
        StorageService[📦 Storage Service<br/>Data Access Layer]
        GeminiService[🧠 Gemini Service<br/>AI Integration]
        FirestoreService[☁️ Firestore Service]
        SafeStorageService[💾 Safe Storage Service]
    end

    %% UI Components
    subgraph "UI Components"
        Header[📋 Header]
        ModeSelector[🎯 Mode Selector]
        HomePage[🏠 Home Page]
        StudyMode[📖 Study Mode]
        QuizMode[❓ Quiz Mode]
        AddWordMode[➕ Add Word Mode]
        AIMode[🤖 AI Mode]
        ManageMode[⚙️ Manage Mode]
        Statistics[📊 Statistics]
        DatabaseManager[🗄️ Database Manager]
    end

    %% Data Models
    subgraph "Data Models"
        VocabItem[📝 Vocabulary Item]
        Score[🎯 Score]
        Category[📂 Category]
        Settings[⚙️ Settings]
    end

    %% Utilities
    subgraph "Utilities"
        Helpers[🛠️ Helpers<br/>Speech, Filter, etc.]
        ApiTest[🔍 API Test]
    end

    %% Data Flow - User Interactions
    User -.->|1. Interacts| App
    App -->|2. State Management| VocabHook
    App -->|2. State Management| FavHook
    App -->|2. State Management| ApiHook

    %% Data Flow - Storage Operations
    VocabHook -->|3. CRUD Operations| StorageService
    FavHook -->|3. CRUD Operations| StorageService
    ApiHook -->|3. CRUD Operations| StorageService
    
    StorageService -->|4. Route to Backend| FirestoreService
    StorageService -->|4. Route to Backend| SafeStorageService
    FirestoreService -->|5. Cloud Storage| Firestore
    SafeStorageService -->|5. Local Storage| LocalStorage

    %% Data Flow - AI Integration
    AIMode -->|6. Generate Request| GeminiService
    GeminiService -->|7. API Call| GeminiAPI
    GeminiAPI -.->|8. Response| GeminiService
    GeminiService -->|9. Parsed Data| VocabHook

    %% Data Flow - UI Components
    App -->|10. Props/State| Header
    App -->|10. Props/State| ModeSelector
    App -->|10. Props/State| HomePage
    App -->|10. Props/State| StudyMode
    App -->|10. Props/State| QuizMode
    App -->|10. Props/State| AddWordMode
    App -->|10. Props/State| AIMode
    App -->|10. Props/State| ManageMode
    App -->|10. Props/State| Statistics
    App -->|10. Props/State| DatabaseManager

    %% Data Flow - Utilities
    StudyMode -->|11. Text-to-Speech| Helpers
    QuizMode -->|11. Text-to-Speech| Helpers
    Helpers -->|12. Speech API| WebSpeech
    
    AIMode -->|13. Test Connection| ApiTest
    ApiTest -->|14. Test Request| GeminiAPI

    %% Data Flow - Data Models
    VocabHook -.->|Uses| VocabItem
    App -.->|Uses| Score
    Statistics -.->|Uses| Category
    StorageService -.->|Uses| Settings

    %% Styling
    classDef userStyle fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef appStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef hookStyle fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef serviceStyle fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    classDef uiStyle fill:#f1f8e9,stroke:#558b2f,stroke-width:2px
    classDef dataStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef utilStyle fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    classDef externalStyle fill:#eeeeee,stroke:#424242,stroke-width:2px

    class User userStyle
    class App appStyle
    class VocabHook,FavHook,ApiHook hookStyle
    class StorageService,GeminiService,FirestoreService,SafeStorageService serviceStyle
    class Header,ModeSelector,HomePage,StudyMode,QuizMode,AddWordMode,AIMode,ManageMode,Statistics,DatabaseManager uiStyle
    class VocabItem,Score,Category,Settings dataStyle
    class Helpers,ApiTest utilStyle
    class GeminiAPI,LocalStorage,Firestore,WebSpeech externalStyle
```

### Detailed Data Flow Scenarios

#### 1. **🔄 App Initialization Flow**
```mermaid
sequenceDiagram
    participant User
    participant App
    participant VocabHook
    participant StorageService
    participant Storage as LocalStorage/Firestore

    User->>App: Opens App
    App->>VocabHook: Initialize useVocabulary
    VocabHook->>StorageService: Load vocabulary
    StorageService->>Storage: Get stored data
    Storage-->>StorageService: Return data
    StorageService-->>VocabHook: Return vocabulary array
    VocabHook-->>App: Update vocabulary state
    App-->>User: Display Home Page
```

#### 2. **➕ Add New Word Flow**
```mermaid
sequenceDiagram
    participant User
    participant AddWordMode
    participant VocabHook
    participant StorageService
    participant Storage as LocalStorage/Firestore

    User->>AddWordMode: Fill form & submit
    AddWordMode->>VocabHook: Call addWord()
    VocabHook->>StorageService: Store new word
    StorageService->>Storage: Save to storage
    Storage-->>StorageService: Confirm save
    StorageService-->>VocabHook: Return saved word
    VocabHook-->>AddWordMode: Update state
    AddWordMode-->>User: Show success message
```

#### 3. **🤖 AI Generate Words Flow**
```mermaid
sequenceDiagram
    participant User
    participant AIMode
    participant GeminiService
    participant GeminiAPI
    participant VocabHook
    participant StorageService

    User->>AIMode: Enter AI request
    AIMode->>GeminiService: generateVocabulary()
    GeminiService->>GeminiAPI: API call with prompt
    GeminiAPI-->>GeminiService: Return AI response
    GeminiService-->>AIMode: Parsed vocabulary array
    AIMode->>VocabHook: addWordsFromAI()
    VocabHook->>StorageService: Batch save words
    StorageService-->>VocabHook: Confirm save
    VocabHook-->>AIMode: Update state
    AIMode-->>User: Show generated words
```

#### 4. **📖 Study Mode Flow**
```mermaid
sequenceDiagram
    participant User
    participant StudyMode
    participant Helpers
    participant WebSpeechAPI
    participant FavHook

    User->>StudyMode: View word card
    StudyMode->>Helpers: speak(word, accent)
    Helpers->>WebSpeechAPI: Text-to-speech
    WebSpeechAPI-->>User: Audio pronunciation
    User->>StudyMode: Click favorite button
    StudyMode->>FavHook: toggleFavorite()
    FavHook-->>StudyMode: Update favorites
    StudyMode-->>User: Update UI
```

#### 5. **❓ Quiz Mode Flow**
```mermaid
sequenceDiagram
    participant User
    participant QuizMode
    participant App
    participant Helpers

    User->>QuizMode: Answer question
    QuizMode->>App: checkAnswer()
    App->>App: Calculate score
    App-->>QuizMode: Return result
    QuizMode->>Helpers: speak(correctAnswer)
    Helpers-->>User: Audio feedback
    QuizMode-->>User: Show result & next question
```

#### 6. **🗄️ Database Management Flow**
```mermaid
sequenceDiagram
    participant User
    participant DatabaseManager
    participant StorageService
    participant LocalStorage
    participant Firestore

    User->>DatabaseManager: Switch to Firestore
    DatabaseManager->>StorageService: switchBackend()
    StorageService->>LocalStorage: Export data
    LocalStorage-->>StorageService: Return data
    StorageService->>Firestore: Import data
    Firestore-->>StorageService: Confirm import
    StorageService-->>DatabaseManager: Update backend
    DatabaseManager-->>User: Show success
```

## Key Data Flow Patterns

### 1. **Unidirectional Data Flow**
- Data flows down from App → Hooks → Components
- Actions flow up from Components → Hooks → Services
- State is managed centrally in custom hooks

### 2. **Service Layer Pattern**
- All external API calls go through service layer
- Services handle data transformation and error handling
- Storage abstraction allows switching between backends

### 3. **Observer Pattern**
- React hooks observe state changes
- Components re-render when relevant state updates
- Automatic UI updates when data changes

### 4. **Command Pattern**
- User actions trigger commands (functions)
- Commands are processed by appropriate handlers
- Results update application state

### 5. **Strategy Pattern**
- Storage service uses different strategies (localStorage vs Firestore)
- Pronunciation uses different accents (US vs UK)
- Dynamic backend switching without code changes

## Data States & Transitions

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Empty : No data found
    Loading --> Loaded : Data found
    Empty --> Adding : User adds first word
    Adding --> Loaded : Word added successfully
    Loaded --> Studying : User studies words
    Loaded --> Quizzing : User takes quiz
    Loaded --> Managing : User manages words
    Loaded --> GeneratingAI : User requests AI words
    GeneratingAI --> Loaded : AI words generated
    Studying --> Loaded : Return to main
    Quizzing --> Loaded : Quiz completed
    Managing --> Loaded : Management done
    Loaded --> Syncing : Data sync with cloud
    Syncing --> Loaded : Sync completed
    Loaded --> Exporting : Export data
    Exporting --> Loaded : Export completed
```

Sơ đồ này minh họa luồng dữ liệu chi tiết, từ user interactions đến data persistence, bao gồm cả AI integration và cross-platform synchronization.
