'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { parseReferralCode, processReferral } from '@/services/referralService';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user] = useAuthState(auth);

  useEffect(() => {
    const handleReferral = async () => {
      if (!user) return;

      // Check for referral code in URL
      const referrerId = parseReferralCode();
      if (referrerId) {
        await processReferral(user.uid, referrerId);

        // Remove ref parameter from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    };

    handleReferral();
  }, [user]);

  return children;
}
