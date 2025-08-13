// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Thay đổi các thông tin này bằng config của bạn từ Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyBlWwpTPg32QRbBc-FNdQsUqRq926FRzoY',
  authDomain: 'study-english-app-67fd9.firebaseapp.com',
  projectId: 'study-english-app-67fd9',
  storageBucket: 'study-english-app-67fd9.firebasestorage.app',
  messagingSenderId: '705696678201',
  appId: '1:705696678201:web:93d9672681a7986a43e8e8',
  measurementId: 'G-P0BJHFC09J',
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);

  // Fallback to Local Storage if Firebase fails
  db = null;
  auth = null;
}

export { db, auth };
export default app;
