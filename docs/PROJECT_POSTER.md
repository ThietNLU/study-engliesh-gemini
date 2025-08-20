# 🎓 STUDY ENGLISH WITH AI - PROJECT POSTER

---

## 📋 **PROJECT OVERVIEW**

### **Study English with AI - Smart Vocabulary & Quiz System**
*A modern English learning platform powered by AI, featuring intelligent flashcards with spaced repetition and an AI-powered quiz generator using Google Gemini.*

**🚀 Live Demo**: [https://study-english-app-67fd9.web.app](https://study-english-app-67fd9.web.app)

---

## 🛠 **TECHNOLOGY STACK**

### **Frontend Technologies**
```
┌─────────────────────────────────────────────────┐
│                  Frontend Layer                 │
├─────────────────────────────────────────────────┤
│ React 18.2.0          │ Modern UI Framework     │
│ Zustand 5.0.7         │ State Management        │
│ Tailwind CSS 3.4.17   │ Utility-First CSS       │
│ Lucide React 0.263.1  │ Icon Components         │
│ ESLint + Prettier     │ Code Quality Tools      │
└─────────────────────────────────────────────────┘
```

### **Backend & Cloud Services**
```
┌─────────────────────────────────────────────────┐
│                 Backend Layer                   │
├─────────────────────────────────────────────────┤
│ Firebase 11.9.1       │ Cloud Platform          │
│ Firestore Database    │ NoSQL Real-time DB      │
│ Firebase Auth         │ User Authentication     │
│ Firebase Hosting      │ Static Site Hosting     │
│ Google Gemini API     │ AI Language Model       │
└─────────────────────────────────────────────────┘
```

---

## 🏗 **SYSTEM ARCHITECTURE**

```
                    📱 USER INTERFACE (React)
                           │
                    ┌──────┼──────┐
                    │      │      │
              ┌─────▼─┐ ┌─▼─┐ ┌──▼────┐
              │Quiz   │ │AI │ │Flashcard│
              │System │ │Mode│ │System  │
              └─────┬─┘ └─┬─┘ └──┬────┘
                    │     │      │
              ┌─────▼─────▼──────▼─────┐
              │   STATE MANAGEMENT     │
              │     (Zustand)          │
              └─────────┬──────────────┘
                        │
              ┌─────────▼──────────────┐
              │    SERVICE LAYER       │
              ├────────────────────────┤
              │ • Firebase Service     │
              │ • Gemini AI Service    │
              │ • Storage Service      │
              │ • Flashcard Service    │
              └─────────┬──────────────┘
                        │
              ┌─────────▼──────────────┐
              │    CLOUD BACKEND       │
              ├────────────────────────┤
              │ Firebase Firestore     │
              │ Google Gemini API      │
              │ Firebase Authentication│
              └────────────────────────┘
```

---

## ✨ **KEY FEATURES & MODULES**

### 🎯 **AI Quiz Generator**
- **7 Question Types**: Multiple choice, Fill blanks, Sentence transformation, True/false, Matching, Word ordering, Gap fill
- **CEFR Levels**: A1 (Beginner) to C2 (Proficient)
- **Smart Topics**: Grammar, Vocabulary, Business English, Travel, Technology
- **Powered by Gemini AI**: Advanced prompt engineering

### 📚 **Smart Flashcard System**
- **Spaced Repetition (SM-2)**: Industry-standard algorithm like Anki
- **4-Level Rating**: Again/Hard/Good/Easy for optimal learning
- **Progress Tracking**: Detailed statistics and learning analytics
- **Import/Export**: CSV, Anki formats, vocabulary lists

### 🔤 **Vocabulary Management**
- **Category Organization**: Structured word groups
- **CRUD Operations**: Add, edit, delete vocabulary
- **Favorites System**: Quick access to important words
- **Statistics Dashboard**: Learning progress visualization

---

## 📊 **DATA FLOW DIAGRAM**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    USER     │◄──►│  REACT APP   │◄──►│  ZUSTAND    │
│ INTERFACE   │    │ COMPONENTS   │    │   STORES    │
└─────────────┘    └──────┬───────┘    └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ SERVICES  │
                    │   LAYER   │
                    └─────┬─────┘
                          │
            ┌─────────────▼─────────────┐
            │                           │
       ┌────▼────┐                ┌────▼────┐
       │FIREBASE │                │ GEMINI  │
       │FIRESTORE│                │   API   │
       └─────────┘                └─────────┘
```

---

## 🔄 **LEARNING FLOW**

```
  👤 USER LOGIN
       │
       ▼
  📚 SELECT MODE
   ┌───┼───┐
   │   │   │
   ▼   ▼   ▼
 QUIZ AI FLASH
MODE MODE CARD
   │   │   │
   └───┼───┘
       ▼
   📊 PROGRESS
    TRACKING
       │
       ▼
   🎯 ADAPTIVE
    LEARNING
```

---

## 📁 **PROJECT STRUCTURE**

```
study-english-gemini/
├── 📁 src/
│   ├── 📁 app/                    # Main application
│   ├── 📁 features/               # Feature modules
│   │   ├── 📁 ai/                 # AI Quiz Generator
│   │   ├── 📁 flashcard/          # Spaced Repetition
│   │   ├── 📁 quiz/               # Quiz System
│   │   └── 📁 vocab/              # Vocabulary Management
│   ├── 📁 shared/                 # Shared utilities
│   │   ├── 📁 stores/             # Zustand stores
│   │   ├── 📁 services/           # Business logic
│   │   └── 📁 ui/                 # Reusable components
├── 📁 docs/                       # Documentation
├── 📁 build/                      # Production build
└── 📄 Configuration files
```

---

## 🎯 **PERFORMANCE METRICS**

### **Technical Achievements**
- ⚡ **Fast Loading**: React 18 with optimized bundles
- 🔄 **Real-time Sync**: Firebase Firestore integration
- 🧠 **Smart AI**: Advanced prompt engineering with Gemini
- 📱 **Responsive**: Mobile-first design approach
- 🔒 **Secure**: Firebase Authentication & Firestore rules

### **Learning Effectiveness**
- 📈 **Spaced Repetition**: Scientifically proven SM-2 algorithm
- 🎯 **Adaptive Learning**: AI-generated personalized quizzes
- 📊 **Progress Tracking**: Detailed analytics and statistics
- 🌐 **Cross-platform**: Web-based accessibility

---

## 🚀 **DEPLOYMENT & CI/CD**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   GITHUB    │───▶│   BUILD     │───▶│  FIREBASE   │
│ REPOSITORY  │    │  PROCESS    │    │  HOSTING    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │            ┌──────▼──────┐           │
       │            │  ESLint +   │           │
       └────────────┤  Prettier   ├───────────┘
                    │  Quality    │
                    │  Checks     │
                    └─────────────┘
```

---

## 👥 **TARGET USERS**

- 🎓 **Students**: Learning English at various levels (A1-C2)
- 👨‍🏫 **Teachers**: Creating customized learning materials
- 💼 **Professionals**: Improving business English skills
- 🌍 **Global Learners**: Anyone wanting to master English vocabulary

---

## 🏆 **PROJECT ACHIEVEMENTS**

### **Innovation**
- ✅ AI-powered question generation with multiple types
- ✅ Scientific spaced repetition implementation
- ✅ Modern React architecture with best practices
- ✅ Cloud-native design for scalability

### **User Experience**
- ✅ Intuitive and responsive interface
- ✅ Real-time progress tracking
- ✅ Cross-device synchronization
- ✅ Comprehensive learning analytics

---

**🔗 Repository**: [github.com/ThietNLU/study-engliesh-gemini](https://github.com/ThietNLU/study-engliesh-gemini)  
**📧 Contact**: [Your Email]  
**📅 Development Period**: 2024-2025

---

*Built with ❤️ using React, Firebase, and Google Gemini AI*
