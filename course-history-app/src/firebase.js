import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCTOnrNW7Wp_SchhT6bdzaYz6y3pNXWCIY",
    authDomain: "course-history-app.firebaseapp.com",
    projectId: "course-history-app",
    storageBucket: "course-history-app.firebasestorage.app",
    messagingSenderId: "706253500931",
    appId: "1:706253500931:web:62fc832a5521f2558b9436"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app; 