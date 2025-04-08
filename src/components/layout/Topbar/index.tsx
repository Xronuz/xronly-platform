"use client";
import React, { useEffect, useState } from "react";
import { Bell, User, LogOut, Calendar } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Topbar = ({ className = "", isSidebarExpanded = false }) => {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Hayrli tong" : hour < 18 ? "Hayrli kun" : "Hayrli kech";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.displayName) {
        setUserName(user.displayName);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`w-[100%] px-8 py-4 flex justify-between items-center z-[40] fixed top-0 right-0 transition-all duration-300 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] ring-1 ring-white/10 ${className}`}

    >
      {/* Left section with greeting */}
      <div className="flex-1">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in">
            {greeting}, {userName}
          </h1>
          <p className="text-base mt-1 text-gray-400 animate-fade-in opacity-90">
            Marketingni avtomatlashtirish vaqti keldi!
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-6">
        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          {/* Calendar button */}
          <button
  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-md hover:scale-[1.02] transition-all duration-300 group"
>
            <Calendar className="h-5 w-5 text-gray-300 hover:text-primary" />
          </button>

          {/* Notification bell */}
          <div className="relative group">
            <button className="p-2 rounded-xl bg-dark-300/50 hover:bg-primary-500/10 backdrop-blur-xl border border-white/5 hover:border-primary-500/20 shadow-lg hover:shadow-primary-500/20 transition-all duration-300 group">
              <Bell className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors duration-300" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-dark-400 shadow-lg shadow-primary-500/30 animate-scale-in">
                3
              </span>
            </button>

            {/* Notification dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-dark-400/95 backdrop-blur-xl rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] p-4 border border-white/5 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 opacity-30 rounded-xl"></div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-white">Notifications</h3>
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors duration-200">Mark all as read</button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: "New campaign performance report available",
                    time: "2 minutes ago",
                    type: "report"
                  },
                  {
                    title: "AI optimization completed for your latest campaign",
                    time: "1 hour ago",
                    type: "ai"
                  },
                  {
                    title: "Weekly marketing insights ready to view",
                    time: "3 hours ago",
                    type: "insights"
                  }
                ].map((notification, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 hover:bg-primary-500/5 rounded-xl transition-all duration-200 group/item">
                    <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-200 font-medium">{notification.title}</p>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-white">{userName}</span>
            <span className="text-xs text-gray-400">Premium Plan</span>
          </div>
          <div className="relative group">
            <button
  className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-md hover:scale-[1.02] transition-all duration-300 group"
>
              <User className="h-5 w-5 text-gray-300 group-hover:text-primary" />
            </button>
            {/* Profile Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-dark-400/95 backdrop-blur-xl rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] p-2 border border-white/5 animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 opacity-30 rounded-xl"></div>
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-dark-300/50 backdrop-blur-xl border border-white/5">
                    <User className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{userName}</div>
                    <div className="text-sm text-gray-400">{auth.currentUser?.email || ''}</div>
                  </div>
                </div>
              </div>
              <nav className="p-2">
              <button
                onClick={() => router.push('/dashboard/profile')}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-primary-500/10 hover:text-primary-400 rounded-xl transition-all duration-200 relative overflow-hidden group/btn"
              >
                View Profile
              </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors duration-200">
                  Settings
                </button>
                <button
                  onClick={async () => {
                    await signOut(auth);
                    document.cookie = 'firebase-auth-token=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    router.push('/');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 relative overflow-hidden group/btn"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
