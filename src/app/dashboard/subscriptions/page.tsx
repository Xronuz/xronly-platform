'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getReferralStats } from '@/services/referralService';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  coins_reward: number;
}

interface Subscription {
  planId: string;
  startDate: Date;
  coins: number;
  xp: number;
}

interface ReferralStats {
  referralLink: string;
}

export default function SubscriptionsPage() {
  const [user] = useAuthState(auth);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSub, setUserSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [referralLink, setReferralLink] = useState<string>('');

  // XP levels configuration
  const MAX_XP = 1000;

  // Fetch subscription plans and user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get referral link
        const stats = await getReferralStats(user.uid) as ReferralStats;
        setReferralLink(stats?.referralLink || '');

        // Initialize subscription plans if they don't exist
        const plansRef = collection(db, 'subscription_plans');
        const plansSnapshot = await getDocs(plansRef);

        if (plansSnapshot.empty) {
          // Create initial plans
          const initialPlans: Plan[] = [
            {
              id: 'basic',
              name: 'Basic',
              price: 0,
              features: ['Bepul AI agentlar'],
              coins_reward: 100
            },
            {
              id: 'pro',
              name: 'Pro',
              price: 19.99,
              features: ['Kengaytirilgan xizmatlar'],
              coins_reward: 500
            }
          ];

          // Add plans to Firestore
          for (const plan of initialPlans) {
            const { id, ...planData } = plan;
            await setDoc(doc(plansRef, id), planData);
          }

          setPlans(initialPlans);
        } else {
          // Fetch existing plans
          const plansData = plansSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Plan[];
          setPlans(plansData);
        }

        // Fetch or initialize user subscription
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists() || !userDoc.data()?.subscription) {
          // Initialize user subscription
          const initialSubscription: Subscription = {
            planId: 'basic',
            startDate: new Date(),
            coins: 100,
            xp: 0
          };

          await setDoc(userRef, {
            subscription: initialSubscription
          }, { merge: true });

          setUserSub(initialSubscription);
        } else {
          setUserSub(userDoc.data().subscription as Subscription);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSelectPlan = async (plan: Plan) => {
    if (!user || !userSub) return;

    try {
      // Calculate new coins (add reward to existing coins)
      const newCoins = userSub.coins + plan.coins_reward;

      // Update user subscription in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        'subscription.planId': plan.id,
        'subscription.coins': newCoins,
      });

      // Update local state
      setUserSub({
        ...userSub,
        planId: plan.id,
        coins: newCoins,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="bg-gray-800 rounded px-3 py-2 text-sm w-64"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              // You could add a toast notification here
            }}
            className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* XP Progress Bar */}
      {userSub && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Loyalty Progress</span>
            <span className="text-sm font-medium">{userSub.xp} / {MAX_XP} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(userSub.xp / MAX_XP) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Coins Display */}
      {userSub && (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-xl">
            Your Coins: <span className="font-bold text-yellow-400">{userSub.coins}</span>
          </p>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-lg border-2 transition-all duration-300 ${
              userSub?.planId === plan.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-blue-500'
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">
              {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
            </p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-sm mb-4">
              Earn <span className="text-yellow-400">{plan.coins_reward}</span> coins
            </p>
            <button
              onClick={() => handleSelectPlan(plan)}
              disabled={userSub?.planId === plan.id}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                userSub?.planId === plan.id
                  ? 'bg-blue-500 cursor-not-allowed opacity-50'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {userSub?.planId === plan.id ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
