"use client";

import {
  User,
  Bell,
  CreditCard,
  Key,
  Globe,
  Clock,
  Palette,
  Shield,
  Save,
  X,
  Check,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    marketingEmails: false,
    activityAlerts: true,
    securityAlerts: true
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
    { id: "subscription", label: "Subscription", icon: <CreditCard className="h-5 w-5" /> },
    { id: "apiKeys", label: "API Keys", icon: <Key className="h-5 w-5" /> },
    { id: "preferences", label: "Preferences", icon: <Palette className="h-5 w-5" /> },
    { id: "security", label: "Security", icon: <Shield className="h-5 w-5" /> }
  ];

  const subscriptionFeatures = [
    "Advanced Analytics",
    "Custom Branding",
    "API Access",
    "Priority Support",
    "Team Collaboration"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="heading-lg mb-2">Settings</h1>
        <p className="text-body">Manage your account settings and preferences</p>
      </div>

      {/* Settings Navigation */}
      <div className="card p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-[#4A7AFF] text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="card p-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="heading-md mb-4">Profile Settings</h2>
            
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <button className="text-[#4A7AFF] hover:text-blue-700 transition-colors">
                Change Photo
              </button>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                  placeholder="Marketing Manager"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="heading-md mb-4">Notification Preferences</h2>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive notifications about {key.toLowerCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({...prev, [key]: !value}))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-[#4A7AFF]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-6">
            <h2 className="heading-md mb-4">Subscription Management</h2>
            
            {/* Current Plan */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Current Plan: Pro</h3>
                  <p className="text-sm text-gray-600">Your plan renews on April 21, 2025</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {subscriptionFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
              <button className="text-[#4A7AFF] hover:text-blue-700 transition-colors text-sm font-medium">
                View All Plans
              </button>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Payment Method</h3>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <span className="font-medium">•••• 4242</span>
                </div>
                <button className="text-[#4A7AFF] hover:text-blue-700 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "apiKeys" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="heading-md">API Integration</h2>
              <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Generate New Key
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Production Key", status: "Active", created: "2025-02-15" },
                { name: "Development Key", status: "Active", created: "2025-03-01" }
              ].map((key, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{key.name}</h3>
                    <span className="text-green-600 text-sm font-medium">{key.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Created: {key.created}</span>
                    <button className="text-red-600 hover:text-red-700 transition-colors">
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6">
            <h2 className="heading-md mb-4">Display & Language</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <select className="glass-input flex-1 px-4 py-2 rounded-lg">
                    <option>English (US)</option>
                    <option>Español</option>
                    <option>Français</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <select className="glass-input flex-1 px-4 py-2 rounded-lg">
                    <option>UTC+05:00 Tashkent</option>
                    <option>UTC+00:00 London</option>
                    <option>UTC-08:00 Los Angeles</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["Light", "Dark", "System"].map((theme) => (
                    <button
                      key={theme}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="heading-md mb-4">Security Settings</h2>
            
            {/* Two-Factor Authentication */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <button className="text-[#4A7AFF] hover:text-blue-700 transition-colors">
                  Enable
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>

            {/* Password Update */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="glass-input w-full px-4 py-2 rounded-lg"
                />
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { device: "Chrome - Mac", location: "Tashkent, UZ", current: true },
                  { device: "Firefox - Windows", location: "London, UK", current: false }
                ].map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{session.device}</div>
                      <div className="text-sm text-gray-600">{session.location}</div>
                    </div>
                    {session.current ? (
                      <span className="text-green-600 text-sm">Current Session</span>
                    ) : (
                      <button className="text-red-600 text-sm hover:text-red-700 transition-colors">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <X className="h-5 w-5" />
          Cancel
        </button>
        <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
