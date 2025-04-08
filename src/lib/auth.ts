import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { UserProfile, UserMetrics } from '@/types/auth';

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));

    // If user doesn't exist in Firestore, create a new document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || 'User',
        email: user.email,
        phone: user.phoneNumber || '',
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || '',
        hasSubscription: false,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referralCount: 0,
        bonuses: [],
        connectedAccounts: [],
      });
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Get user metrics from Firestore
export const getUserMetrics = async (userId: string): Promise<UserMetrics | null> => {
  try {
    const metricsDoc = await getDoc(doc(db, 'users', userId, 'metrics', 'dashboard'));
    if (metricsDoc.exists()) {
      return metricsDoc.data() as UserMetrics;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return null;
  }
};

// Handle auth state changes
export const handleAuthStateChange = async (user: any) => {
  if (user) {
    try {
      const token = await user.getIdToken();
      // Set auth cookie when user signs in
      document.cookie = `__session=${token};path=/;max-age=3600;secure;`;
      
      // Check and update user profile in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || 'User',
          email: user.email,
          phone: user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          photoURL: user.photoURL || '',
        });
      }
    } catch (error) {
      console.error('Error handling auth state change:', error);
    }
  } else {
    // Remove auth cookie when user signs out
    document.cookie = '__session=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;secure;';
  }
};
