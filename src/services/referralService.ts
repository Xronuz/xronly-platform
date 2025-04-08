import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, DocumentData } from 'firebase/firestore';

// Reward amount for successful referrals
const REFERRAL_REWARD = 50;

interface ReferralStats {
  referralLink: string;
  referrerId: string | null;
}

interface UserSubscription {
  coins: number;
  [key: string]: any;
}

interface UserData extends DocumentData {
  referrer_id?: string;
  subscription?: UserSubscription;
}

/**
 * Generate a referral link for a user
 * @param userId - The ID of the referring user
 * @returns The referral link
 */
export const generateReferralLink = (userId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/?ref=${userId}`;
};

/**
 * Check if a referral code is valid
 * @param referrerId - The ID of the referring user
 * @returns Whether the referrer exists
 */
export const isValidReferral = async (referrerId: string): Promise<boolean> => {
  if (!referrerId) return false;

  try {
    const referrerDoc = await getDoc(doc(db, 'users', referrerId));
    return referrerDoc.exists();
  } catch (error) {
    console.error('Error checking referral:', error);
    return false;
  }
};

/**
 * Process a new user referral
 * @param userId - The ID of the new user
 * @param referrerId - The ID of the referring user
 */
export const processReferral = async (userId: string, referrerId: string): Promise<void> => {
  try {
    if (!userId || !referrerId || userId === referrerId) return;

    // Check if referrer exists
    const isValid = await isValidReferral(referrerId);
    if (!isValid) return;

    // Get the new user's document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserData | undefined;

    // Check if user already has a referrer (prevent duplicate referrals)
    if (userData?.referrer_id) return;

    // Update new user with referrer_id
    await updateDoc(userRef, {
      referrer_id: referrerId
    });

    // Reward the referrer
    const referrerRef = doc(db, 'users', referrerId);
    await updateDoc(referrerRef, {
      'subscription.coins': increment(REFERRAL_REWARD)
    });

  } catch (error) {
    console.error('Error processing referral:', error);
  }
};

/**
 * Get referral stats for a user
 * @param userId - The ID of the user
 * @returns Referral statistics
 */
export const getReferralStats = async (userId: string): Promise<ReferralStats | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data() as UserData | undefined;

    return {
      referralLink: generateReferralLink(userId),
      referrerId: userData?.referrer_id || null,
      // You can add more stats here like number of successful referrals, total rewards earned, etc.
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return null;
  }
};

/**
 * Parse referral code from URL
 * @returns The referrer's user ID or null
 */
export const parseReferralCode = (): string | null => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
};
