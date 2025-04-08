"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/auth";
import { Loader2, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import RewardReferral from "@/components/RewardReferral";

export default function RewardsPage() {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  const availableBonuses = [
    {
      title: "Free Month",
      description: "Get one month free subscription",
      condition: "Refer 3 friends",
      progress: userProfile?.referralCount || 0,
      target: 3,
    },
    {
      title: "Premium Features",
      description: "Unlock exclusive AI capabilities",
      condition: "Refer 5 friends",
      progress: userProfile?.referralCount || 0,
      target: 5,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium text-primary">Rewards & Referrals</h1>

      {/* Referral Section */}
      <RewardReferral />

      {/* Available Bonuses */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Gift className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-medium text-accent">Available Bonuses</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {availableBonuses.map((bonus, index) => (
            <div key={index} className="glass rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity" />
              <h3 className="text-lg font-medium text-accent mb-2">{bonus.title}</h3>
              <p className="text-sm text-accent/70 mb-4">{bonus.description}</p>
              <div className="space-y-2">
                <p className="text-xs text-primary">{bonus.condition}</p>
                <div className="h-2 w-full rounded-full bg-slate-900/50">
                  <div
                    className="h-2 rounded-full bg-gradient-accent"
                    style={{ width: `${(bonus.progress / bonus.target) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-primary/70">
                  Progress: {bonus.progress}/{bonus.target}
                </p>
              </div>
              <button
                disabled={bonus.progress < bonus.target}
                className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  bonus.progress >= bonus.target
                    ? 'glass bg-accent/10 text-accent hover:bg-accent/20'
                    : 'glass bg-slate-900/50 text-primary/50 cursor-not-allowed'
                }`}
              >
                {bonus.progress >= bonus.target ? 'Claim Reward' : 'In Progress'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reward History */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium text-primary">Reward History</h2>
        </div>
        <div className="space-y-4">
          {(userProfile?.bonuses || []).length > 0 ? (
            userProfile.bonuses.map((bonus: any, index: number) => (
              <div key={index} className="glass p-4 rounded-xl hover:bg-primary/5 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{bonus.name}</p>
                    <p className="text-xs text-primary/70">Claimed on {bonus.claimedDate}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass p-4 rounded-xl">
              <p className="text-primary/70">No rewards claimed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
