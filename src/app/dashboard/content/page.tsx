"use client";

import {
  PenTool,
  Calendar,
  Image as ImageIcon,
  LayoutTemplate,
  Zap,
  BarChart,
  Plus,
  ChevronRight,
  Settings,
  MessageSquare,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Save,
  Filter,
  Search,
  Sparkles
} from "lucide-react";
import { useState } from "react";

export default function ContentMakerPage() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTemplate, setSelectedTemplate] = useState("social");
  
  const contentTypes = [
    { id: "social", label: "Social Post", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "email", label: "Email", icon: <Mail className="h-5 w-5" /> },
    { id: "ad", label: "Advertisement", icon: <Zap className="h-5 w-5" /> }
  ];

  const templates = [
    {
      name: "Product Launch",
      description: "Announce new products or features",
      category: "Marketing",
      platform: "All Platforms"
    },
    {
      name: "Weekly Newsletter",
      description: "Keep your audience updated",
      category: "Email",
      platform: "Email"
    },
    {
      name: "Engagement Post",
      description: "Drive community interaction",
      category: "Social",
      platform: "Social Media"
    }
  ];

  const scheduledContent = [
    {
      title: "Product Feature Highlight",
      platform: "Instagram",
      scheduledFor: "Tomorrow, 10:00 AM",
      status: "Scheduled"
    },
    {
      title: "Monthly Newsletter",
      platform: "Email",
      scheduledFor: "March 25, 9:00 AM",
      status: "Draft"
    },
    {
      title: "Customer Success Story",
      platform: "LinkedIn",
      scheduledFor: "March 26, 2:00 PM",
      status: "Scheduled"
    }
  ];

  const mediaAssets = [
    { name: "product-demo.jpg", type: "image", size: "2.4 MB" },
    { name: "brand-logo.png", type: "image", size: "1.1 MB" },
    { name: "team-photo.jpg", type: "image", size: "3.2 MB" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="heading-lg mb-2">AI Content Maker</h1>
            <p className="text-body">Create, schedule, and manage your content across all channels</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </button>
            <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Content
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { id: "create", label: "Create", icon: <PenTool className="h-5 w-5" /> },
            { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
            { id: "templates", label: "Templates", icon: <LayoutTemplate className="h-5 w-5" /> },
            { id: "media", label: "Media", icon: <ImageIcon className="h-5 w-5" /> },
            { id: "analytics", label: "Analytics", icon: <BarChart className="h-5 w-5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 -mb-px ${
                activeTab === tab.id
                  ? "border-b-2 border-[#4A7AFF] text-[#4A7AFF]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Creation Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              {/* Content Type Selection */}
              <div className="flex gap-4 mb-6">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTemplate(type.id)}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      selectedTemplate === type.id
                        ? "border-[#4A7AFF] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Content Editor */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="glass-input w-full px-4 py-2 rounded-lg text-lg"
                />
                <div className="relative">
                  <textarea
                    placeholder="Start typing or use AI suggestions..."
                    className="glass-input w-full px-4 py-3 rounded-lg h-48 resize-none"
                  />
                  <button className="absolute bottom-4 right-4 bg-[#4A7AFF] text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    Get AI Suggestions
                  </button>
                </div>

                {/* Platform Selection */}
                <div className="flex gap-2">
                  {[
                    { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                    { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                    { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" }
                  ].map((platform, idx) => (
                    <button
                      key={idx}
                      className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      {platform.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Copy className="h-5 w-5" />
                Save as Template
              </button>
              <button className="flex-1 bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Save className="h-5 w-5" />
                Schedule Post
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <div className="card p-6">
              <h2 className="heading-md mb-4">AI Assistant</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  🎯 Optimize for engagement
                </button>
                <button className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  💡 Generate creative ideas
                </button>
                <button className="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  ✨ Improve readability
                </button>
              </div>
            </div>

            {/* Recent Content */}
            <div className="card p-6">
              <h2 className="heading-md mb-4">Recent Content</h2>
              <div className="space-y-3">
                {scheduledContent.map((content, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{content.title}</h3>
                      <p className="text-sm text-gray-600">{content.scheduledFor}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      content.status === "Scheduled" 
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {content.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <h2 className="heading-md">March 2025</h2>
              <button className="bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter
              </button>
              <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Schedule Content
              </button>
            </div>
          </div>
          <div className="h-[600px] bg-gray-50 rounded-lg"></div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* Template Search */}
          <div className="card p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="search-input"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, idx) => (
              <div key={idx} className="card-hover p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {template.category}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {template.platform}
                    </span>
                  </div>
                  <button className="text-[#4A7AFF] hover:text-blue-700 transition-colors">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "media" && (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="card p-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">Drop files to upload</h3>
                  <p className="text-sm text-gray-600">or click to browse</p>
                </div>
                <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Upload Files
                </button>
              </div>
            </div>
          </div>

          {/* Media Library */}
          <div className="card p-6">
            <h2 className="heading-md mb-4">Media Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaAssets.map((asset, idx) => (
                <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                    <p className="text-xs text-gray-300">{asset.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="card p-6">
            <h2 className="heading-md mb-6">Content Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Engagements", value: "12.4K", change: "+15%" },
                { label: "Avg. Reach", value: "45.2K", change: "+8%" },
                { label: "Conversion Rate", value: "3.2%", change: "+2%" }
              ].map((metric, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm text-gray-600 mb-1">{metric.label}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className="text-sm text-green-600">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="heading-md mb-4">Top Performing Content</h2>
              <div className="h-[300px] bg-gray-50 rounded-lg"></div>
            </div>
            <div className="card p-6">
              <h2 className="heading-md mb-4">Engagement by Platform</h2>
              <div className="h-[300px] bg-gray-50 rounded-lg"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
