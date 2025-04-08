"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/auth";
import { Loader2, Bot, AlertCircle, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AgentsPage() {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<any>(null);

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

  // If user doesn't have a subscription, show upgrade prompt
  if (!userProfile?.hasSubscription) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-medium text-primary">AI Agents</h1>

        <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity" />
          <div className="relative z-10">
            <div className="p-3 rounded-lg bg-accent/10 inline-flex mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-medium text-accent mb-4">
              Premium Feature
            </h2>
            <p className="text-foreground/70 mb-6">
              AI agents are available exclusively for subscribers. Upgrade your plan to access automated task management and more.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center glass rounded-xl px-6 py-3 text-sm font-medium text-accent hover:bg-accent/5 transition-colors"
            >
              View Plans
              <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-primary">AI Agents</h1>
        <button className="inline-flex items-center glass rounded-xl px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5 transition-colors">
          <Bot className="mr-2 h-4 w-4" />
          Create New Agent
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Agents */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
                <h3 className="text-lg font-medium text-primary">Agent {i}</h3>
              </div>
              <button className="text-primary/70 hover:text-primary transition-colors">
                <span className="sr-only">Configure agent</span>
                <span>•••</span>
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-primary/70">Tasks in progress: 3</p>
              <p className="text-sm text-primary/70">Last active: 2 min ago</p>
            </div>
            <div className="mt-4 space-x-2">
              <button className="inline-flex items-center glass rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/5 transition-colors">
                Pause
              </button>
              <button className="inline-flex items-center glass rounded-lg px-3 py-1.5 text-sm text-accent hover:bg-accent/5 transition-colors">
                View Tasks
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Activity Log */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-medium text-primary">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-4 rounded-xl hover:bg-primary/5 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    Agent completed task: Update social media profiles
                  </p>
                  <p className="text-xs text-primary/70">10 minutes ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
