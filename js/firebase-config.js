// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCuvnOhoMATpBuTRFkUXPIkeBIGqtHiuA",
  authDomain: "blogcraft-platform.firebaseapp.com",
  projectId: "blogcraft-platform",
  storageBucket: "blogcraft-platform.firebasestorage.app",
  messagingSenderId: "590656644468",
  appId: "1:590656644468:web:de5c6bb250ad357400f821",
  measurementId: "G-62NYYWXN5N"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} else {
    console.error('Firebase SDK not loaded');
}