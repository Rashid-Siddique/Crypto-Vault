import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

// Firebase configuration — replace with your own project config
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyReplaceMeWithYourFirebaseKey",
    authDomain: "cryptovault-demo.firebaseapp.com",
    projectId: "cryptovault-demo",
    storageBucket: "cryptovault-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Anonymous auth helper
export async function ensureAuth() {
    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
            unsub();
            if (user) {
                resolve(user);
            } else {
                signInAnonymously(auth).then((cred) => resolve(cred.user)).catch(() => resolve(null));
            }
        });
    });
}

// Firestore wallet helpers
export async function saveWalletToFirestore(uid, walletData) {
    try {
        await setDoc(doc(db, 'users', uid, 'data', 'wallet'), walletData);
    } catch (e) {
        console.warn('Firestore save failed, using localStorage fallback', e);
    }
}

export async function getWalletFromFirestore(uid) {
    try {
        const snap = await getDoc(doc(db, 'users', uid, 'data', 'wallet'));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        console.warn('Firestore read failed', e);
        return null;
    }
}

export async function clearWalletFromFirestore(uid) {
    try {
        await deleteDoc(doc(db, 'users', uid, 'data', 'wallet'));
    } catch (e) {
        console.warn('Firestore delete failed', e);
    }
}
