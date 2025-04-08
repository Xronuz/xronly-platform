"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/auth";
import { Loader2, Twitter, Instagram, Facebook, Linkedin, Plus, Shield } from "lucide-react";

export default function AccountsPage() {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setUserProfile);
    }
  }, [user]);

  const platforms = [
    {
      name: "Twitter",
      icon: Twitter,
      connected: false,
      status: "Not connected",
    },
    {
      name: "Instagram",
      icon: Instagram,
      connected: false,
      status: "Not connected",
    },
    {
      name: "Facebook",
      icon: Facebook,
      connected: false,
      status: "Not connected",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      connected: false,
      status: "Not connected",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-primary">Connected Accounts</h1>
        <button className="inline-flex items-center glass rounded-xl px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {platforms.map((platform) => (
          <div key={platform.name} className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <platform.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-primary">{platform.name}</h3>
              </div>
              <div className={`h-2 w-2 rounded-full ${platform.connected ? 'bg-accent animate-pulse' : 'bg-primary/50'}`} />
            </div>
            <p className="text-sm text-primary/70 mb-4">{platform.status}</p>
            <button
              className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300
                ${platform.connected
                  ? 'glass text-primary hover:bg-primary/5'
                  : 'glass bg-accent/10 text-accent hover:bg-accent/20'
              }`}
            >
              {platform.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      {/* Connection History */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-medium text-primary">Connection History</h2>
        </div>
        <div className="space-y-4">
          {/* Sample history items */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-4 rounded-xl hover:bg-primary/5 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Account connection updated</p>
                  <p className="text-xs text-primary/70">2 hours ago</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Permissions */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-accent/10">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-medium text-accent">Permission Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="glass p-4 rounded-xl hover:bg-accent/5 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">Automated Posting</p>
                <p className="text-xs text-accent/70">Allow AI agents to post content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-900/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent/30"></div>
              </label>
            </div>
          </div>
          <div className="glass p-4 rounded-xl hover:bg-accent/5 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">Analytics Collection</p>
                <p className="text-xs text-accent/70">Gather engagement metrics</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-900/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent/30"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
