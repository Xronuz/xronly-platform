"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { MessagesSquare, LineChart, BarChart3, Share2, Brain, Zap } from "lucide-react";
import Topbar from "../Topbar";
import { auth } from "@/lib/firebase";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const aiTools = [
  {
    title: "AI Content Creation",
    description: "Generate engaging content for your marketing campaigns",
    icon: <LineChart className="h-6 w-6 text-blue-600" />,
    href: "/dashboard/content"
  },
  {
    title: "AI Ads Optimization",
    description: "Optimize your ad campaigns for better performance",
    icon: <Share2 className="h-6 w-6 text-green-600" />,
    href: "/dashboard/ads"
  },
  {
    title: "AI Sales Analytics",
    description: "Analyze sales patterns and get AI-powered insights",
    icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
    href: "/dashboard/sales"
  }
];

const metrics = [
  {
    label: "AI Optimization Rate",
    value: "93.4%",
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    color: "bg-blue-50"
  },
  {
    label: "Serviceable Market",
    value: "96.4%",
    icon: <BarChart3 className="h-6 w-6 text-green-600" />,
    color: "bg-green-50"
  },
  {
    label: "Active Campaigns",
    value: "12",
    icon: <Share2 className="h-6 w-6 text-purple-600" />,
    color: "bg-purple-50"
  },
  {
    label: "Performance Score",
    value: "4.8",
    icon: <Brain className="h-6 w-6 text-orange-600" />,
    color: "bg-orange-50"
  }
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        const returnUrl = encodeURIComponent(window.location.pathname);
        router.replace(`/auth/login?callbackUrl=${returnUrl}`);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return loading ? (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-mesh">
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent opacity-50"></div>
      <div className="flex flex-col items-center gap-6 z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-14 w-14 border-2 border-primary-200/20 border-t-primary-400"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/80 text-base font-medium">Loading your dashboard</p>
          <p className="text-white/40 text-sm">Please wait a moment...</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative flex h-screen overflow-hidden bg-gradient-mesh">
      <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent opacity-50"></div>
      <Sidebar onExpand={setIsSidebarExpanded} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col transition-all duration-300 relative mt-20">
        <Topbar 
          className="fixed top-0 left-0 right-0 bg-dark-400/80 backdrop-blur-xl border-b border-white/5 z-40 animate-fade-in"
          isSidebarExpanded={isSidebarExpanded}
        />
        <main 
          className={`
            flex-1 overflow-y-auto p-4 lg:p-8 
            ${isSidebarExpanded ? 'ml-[250px]' : 'ml-[70px]'} 
            transition-all duration-300 
            scrollbar-thin scrollbar-thumb-primary-600/50 scrollbar-track-dark-300/30
            animate-fade-in
          `}
        >
          {children}
        </main>
      </div>

      {/* Support Chat Button */}
      <button
        className="
          fixed bottom-6 right-6 z-[60] 
          bg-gradient-to-r from-primary-500 to-primary-600
          backdrop-blur-xl p-4 rounded-full 
          shadow-lg shadow-primary-500/20 
          hover:shadow-xl hover:shadow-primary-500/30 
          hover:scale-110 hover:-translate-y-1
          transition-all duration-300 
          border-0 group
          animate-scale-in
        "
        onClick={() => console.log('Open support chat')}
      >
        <MessagesSquare className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default DashboardLayout;
