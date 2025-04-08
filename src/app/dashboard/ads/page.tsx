"use client";

import {
  BarChart,
  Target,
  DollarSign,
  Users,
  ImagePlus,
  Settings,
  Plus,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  Bell,
  AlertTriangle,
  Copy,
  Edit,
  Trash,
  Save,
  LineChart,
  PieChart
} from "lucide-react";
import { useState } from "react";

export default function AdsManagerPage() {
  const [activeCampaigns] = useState([
    {
      name: "Spring Collection Launch",
      status: "Active",
      budget: 5000,
      spent: 1234,
      results: 156,
      roas: 2.4
    },
    {
      name: "Brand Awareness",
      status: "Paused",
      budget: 3000,
      spent: 2100,
      results: 89,
      roas: 1.8
    },
    {
      name: "Retargeting Campaign",
      status: "Active",
      budget: 2500,
      spent: 1500,
      results: 234,
      roas: 3.1
    }
  ]);

  const [adGroups] = useState([
    {
      name: "Product Carousel",
      platform: "Facebook",
      impressions: "45.2K",
      clicks: 1245,
      ctr: "2.8%"
    },
    {
      name: "Story Ads",
      platform: "Instagram",
      impressions: "32.1K",
      clicks: 892,
      ctr: "2.4%"
    },
    {
      name: "Search Ads",
      platform: "Google",
      impressions: "28.9K",
      clicks: 734,
      ctr: "2.1%"
    }
  ]);

  const [insights] = useState([
    {
      type: "optimization",
      message: "Increase budget for best performing ad set",
      impact: "High",
      metric: "+28% ROAS potential"
    },
    {
      type: "alert",
      message: "CPM increasing in Campaign 'Spring Collection'",
      impact: "Medium",
      metric: "+15% vs. last week"
    },
    {
      type: "optimization",
      message: "New audience segment identified",
      impact: "High",
      metric: "3.2x better conversion rate"
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="heading-lg mb-2">AI Ads Manager</h1>
            <p className="text-body">Create and optimize your advertising campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </button>
            <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Ad Spend",
              value: "$12,345",
              change: "+12.5%",
              icon: <DollarSign className="h-6 w-6 text-blue-600" />,
              color: "bg-blue-50"
            },
            {
              label: "Total Conversions",
              value: "1,234",
              change: "+8.3%",
              icon: <Target className="h-6 w-6 text-green-600" />,
              color: "bg-green-50"
            },
            {
              label: "Avg. ROAS",
              value: "2.8x",
              change: "+15.2%",
              icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
              color: "bg-purple-50"
            },
            {
              label: "Active Campaigns",
              value: "8",
              change: "2 paused",
              icon: <BarChart className="h-6 w-6 text-orange-600" />,
              color: "bg-orange-50"
            }
          ].map((metric, idx) => (
            <div key={idx} className="metric-card">
              <div className={`metric-icon ${metric.color}`}>
                {metric.icon}
              </div>
              <div>
                <div className="metric-label">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6">
        <h2 className="heading-md mb-4">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === "optimization" ? "bg-blue-100" : "bg-yellow-100"
                }`}>
                  {insight.type === "optimization" ? (
                    <TrendingUp className={`h-5 w-5 ${
                      insight.type === "optimization" ? "text-blue-600" : "text-yellow-600"
                    }`} />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">{insight.message}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      insight.impact === "High"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {insight.impact} Impact
                    </span>
                    <span className="text-sm text-gray-600">{insight.metric}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-md">Active Campaigns</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="search-input"
              />
            </div>
            <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Campaign</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Budget</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Spent</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Results</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">ROAS</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeCampaigns.map((campaign, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{campaign.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      campaign.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">${campaign.budget.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">${campaign.spent.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{campaign.results}</td>
                  <td className="text-right py-3 px-4">{campaign.roas}x</td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-900">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ad Groups Performance */}
        <div className="card p-6">
          <h2 className="heading-md mb-6">Ad Groups Performance</h2>
          <div className="space-y-4">
            {adGroups.map((group, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.platform}</p>
                  </div>
                  <button className="text-[#4A7AFF] hover:text-blue-700">View Details</button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="font-medium text-gray-900">{group.impressions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clicks</p>
                    <p className="font-medium text-gray-900">{group.clicks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CTR</p>
                    <p className="font-medium text-gray-900">{group.ctr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Charts */}
        <div className="card p-6">
          <h2 className="heading-md mb-6">Performance Analytics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
              <LineChart className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900">Cost Trends</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
              <PieChart className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900">Budget Allocation</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
