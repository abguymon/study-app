import { browser } from '$app/environment';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export let db;
export let app;
export let auth;

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};

export const initializeFirebase = () => {
    if (import.meta.env.MODE === 'development') {
        console.log('Firebase config:', firebaseConfig);
    }
    if (!browser) {
        throw new Error("Can't use the Firebase client on the server.");
    }
    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        if (import.meta.env.MODE === 'development') {
            console.log('Using Firebase emulator');
            connectAuthEmulator(auth, 'http://127.0.0.1:9099');
            connectFirestoreEmulator(db, 'localhost', 8080);
        }
    }
};