import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();
const USERS_COLLECTION = 'users';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUserDocument = async (user, fullName) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: fullName || user.displayName,
                photoURL: user.photoURL || null,
                createdAt: new Date(),
                lastLogin: new Date(),
            };
            await setDoc(userRef, userData);
            setUserProfile(userData);
        } catch (error) {
            console.error('Error creating user document:', error);
        }
    };

    const loadUserProfile = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data());
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    const signup = async (email, password, fullName) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {
            displayName: fullName
        });
        await createUserDocument(result.user, fullName);
        return result;
    };

    const signin = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result;
    };

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            await createUserDocument(result.user, result.user.displayName);
        }
        return result;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserProfile = async (updates) => {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, updates, { merge: true });
        setUserProfile(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await loadUserProfile(user);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        signin,
        signInWithGoogle,
        logout,
        updateUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};