"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { generateReferralLink } from "@/services/referralService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Share2, Copy, CheckCircle } from "lucide-react";

export default function RewardReferral() {
  const [user] = useAuthState(auth);
  const [referralLink, setReferralLink] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Generate referral link
      const link = generateReferralLink(user.uid);
      setReferralLink(link);

      // Get referral count
      const fetchReferralCount = async () => {
        try {
          const q = query(
            collection(db, "users"),
            where("referrer_id", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          setReferralCount(querySnapshot.size);
        } catch (error) {
          console.error("Error fetching referral count:", error);
        }
      };

      fetchReferralCount();
    }
  }, [user]);

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Share2 className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-medium text-accent">Your Referral Program</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <div className="glass rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-5 transition-opacity" />
          <p className="text-sm text-primary/70 mb-2">Total Referrals</p>
          <p className="text-3xl font-bold text-primary">{referralCount}</p>
        </div>
        <div className="glass rounded-xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity" />
          <p className="text-sm text-accent/70 mb-2">Total Coins Earned</p>
          <p className="text-3xl font-bold text-primary">{referralCount * 50}</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <p className="text-sm text-primary/70 mb-2">Your Referral Link</p>
        <div className="flex items-center space-x-2">
          <code className="flex-1 glass bg-slate-900/50 px-4 py-2 rounded-lg font-mono text-sm text-primary">
            {referralLink}
          </code>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center glass px-4 py-2 rounded-lg text-primary hover:text-accent transition-colors"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
