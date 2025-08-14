# Study English with AI - Smart Vocabulary & Quiz System

🚀 **Live Demo**: [https://study-english-app-67fd9.web.app](https://study-english-app-67fd9.web.app)

A modern English learning platform powered by AI, featuring intelligent flashcards with spaced repetition and an AI-powered quiz generator using Google Gemini.

## ✨ Key Features

### 🎯 AI Quiz Generator
- **7 Question Types**: Multiple choice, Fill blanks, Sentence transformation, True/false, Matching, Word ordering, Gap fill
- **CEFR Levels**: A1 (Beginner) to C2 (Proficient) 
- **Smart Topics**: Grammar, Vocabulary, Business English, Travel, Technology, and more
- **Powered by Gemini AI**: Advanced prompt engineering for high-quality questions

### 📚 Smart Flashcard System
- **Spaced Repetition (SM-2)**: Industry-standard algorithm like Anki
- **4-Level Rating**: Again/Hard/Good/Easy for optimal learning
- **Progress Tracking**: Detailed statistics and learning analytics
- **Import/Export**: Support for CSV, Anki formats, and vocabulary lists

### 💾 Cloud Integration
- **Firebase Firestore**: Real-time data synchronization
- **User Authentication**: Secure personal learning progress
- **Cross-device Sync**: Access your progress anywhere

## 🛠 Technology Stack

- **Frontend**: React 18, Zustand (State Management), Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **AI Integration**: Google Gemini API
- **Build Tools**: Create React App, ESLint, Prettier

## 📖 Documentation

- [AI Quiz Generator Guide](AI_QUIZ_GENERATOR.md) - Complete AI quiz features documentation
- [Flashcard System Guide](FLASHCARD_SYSTEM.md) - Spaced repetition and flashcard features

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Firebase project with Firestore enabled
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ThietNLU/study-engliesh-gemini.git
cd study-engliesh-gemini
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env` file:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**
```bash
npm start
```

5. **Build for production**
```bash
npm run build
```

## 🎓 How to Use

### AI Quiz Generator
1. Navigate to **AI Quiz** mode
2. Select your English level (A1-C2)
3. Choose question types and topics
4. Generate custom quizzes instantly
5. Practice with intelligent feedback

### Flashcard Learning
1. Go to **Add Words** to create vocabulary cards
2. Use **Study Mode** for spaced repetition practice
3. Rate your performance: Again/Hard/Good/Easy
4. Track progress in **Statistics** dashboard
5. Import/export your word lists

## 📊 Learning Analytics

- **Review Statistics**: Track daily/weekly/monthly progress
- **Retention Rates**: Monitor learning effectiveness  
- **Study Streaks**: Build consistent learning habits
- **Performance Insights**: Identify strengths and areas for improvement

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent quiz generation
- **Firebase** for robust backend infrastructure
- **SM-2 Algorithm** for effective spaced repetition
- **React Community** for excellent development tools

---

**Made with ❤️ for English learners worldwide**

