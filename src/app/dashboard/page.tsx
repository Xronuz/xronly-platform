"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/auth";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { 
  LineChart, 
  BarChart3, 
  Brain, 
  Share2, 
  PenTool, 
  Zap,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState([
    {
      label: "AI Optimization Rate",
      value: "0%",
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      label: "Serviceable Market",
      value: "0%",
      icon: <BarChart3 className="h-6 w-6 text-green-600" />,
      color: "bg-green-50"
    },
    {
      label: "Active Campaigns",
      value: "0",
      icon: <Share2 className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      label: "Performance Score",
      value: "0",
      icon: <Brain className="h-6 w-6 text-orange-600" />,
      color: "bg-orange-50"
    }
  ]);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setUserProfile);

      // Initialize metrics in Firestore if they don't exist
      const userMetricsDoc = doc(db, 'users', user.uid, 'metrics', 'dashboard');
      setDoc(userMetricsDoc, {
        metrics: metrics.map(m => ({
          label: m.label,
          value: m.value
        }))
      }, { merge: true });

      // Set up real-time listener for metrics
      const unsubscribe = onSnapshot(userMetricsDoc, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.metrics) {
            setMetrics(prev => prev.map((metric, idx) => ({
              ...metric,
              value: data.metrics[idx]?.value || metric.value
            })));
          }
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const aiTools = [
    {
      title: "AI Content Creation",
      description: "Generate engaging content for your marketing campaigns",
      icon: <PenTool className="h-6 w-6 text-blue-600" />,
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

  const socialPlatforms = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" /> },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" /> },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" /> }
  ];

  const campaigns = [
    { name: 'Social Media Campaign', status: 'Active', color: 'text-green-600' },
    { name: 'Email Marketing', status: 'In Progress', color: 'text-yellow-600' },
    { name: 'Content Strategy', status: 'Active', color: 'text-green-600' },
    { name: 'PPC Ads', status: 'Paused', color: 'text-red-600' }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <div className={`metric-icon ${metric.color}`}>
              {metric.icon}
            </div>
            <div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="heading-md">Performance Overview</h3>
          <div className="flex items-center gap-2">
            <label className="text-small">View:</label>
            <select className="glass-input py-1 px-3 rounded-lg text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
        <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Performance chart visualization coming soon</p>
        </div>
      </div>

      {/* Connected Accounts & Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="heading-md mb-4">Connected Accounts</h3>
          <div className="space-y-4">
            {socialPlatforms.map((platform, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  {platform.icon}
                  <span className="font-medium">{platform.name}</span>
                </div>
                <button className="text-[#4A7AFF] text-sm font-medium hover:text-blue-700 transition-colors">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="heading-md mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            {campaigns.map((campaign, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <span className="font-medium">{campaign.name}</span>
                <span className={`text-sm font-medium ${campaign.color}`}>
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {aiTools.map((tool, idx) => (
          <Link href={tool.href} key={idx}>
            <div className="card-hover p-6 h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  {tool.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tool.title}</h4>
                  <p className="text-small">{tool.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
