"use client";

import {
  BarChart4,
  LineChart,
  TrendingUp,
  Users,
  Target,
  ShoppingCart,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  RefreshCcw
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("last7Days");
  const [selectedMetrics] = useState([
    {
      label: "Total Conversions",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: <Target className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      label: "Avg. Conversion Rate",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      color: "bg-green-50"
    },
    {
      label: "Active Users",
      value: "14,583",
      change: "+23.1%",
      trend: "up",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      label: "Revenue",
      value: "$48,294",
      change: "+18.2%",
      trend: "up",
      icon: <ShoppingCart className="h-6 w-6 text-orange-600" />,
      color: "bg-orange-50"
    }
  ]);

  const [channelPerformance] = useState([
    {
      channel: "Social Media",
      conversions: 1245,
      revenue: 28430,
      cpa: 12.4,
      roi: 324
    },
    {
      channel: "Email Marketing",
      conversions: 892,
      revenue: 19845,
      cpa: 8.9,
      roi: 412
    },
    {
      channel: "PPC Campaigns",
      conversions: 673,
      revenue: 15240,
      cpa: 15.2,
      roi: 245
    },
    {
      channel: "Content Marketing",
      conversions: 438,
      revenue: 9840,
      cpa: 11.8,
      roi: 198
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="heading-lg mb-2">Analytics & Monitoring</h1>
            <p className="text-body">Track and analyze your marketing performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export
            </button>
            <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Date Range & Filters */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="glass-input py-1 px-3 rounded-lg text-sm"
              >
                <option value="last7Days">Last 7 Days</option>
                <option value="last30Days">Last 30 Days</option>
                <option value="last90Days">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select className="glass-input py-1 px-3 rounded-lg text-sm">
                <option>All Channels</option>
                <option>Social Media</option>
                <option>Email</option>
                <option>PPC</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Compare to:</span>
            <select className="glass-input py-1 px-3 rounded-lg text-sm">
              <option>Previous Period</option>
              <option>Same Period Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedMetrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <div className={`metric-icon ${metric.color}`}>
              {metric.icon}
            </div>
            <div>
              <div className="metric-value">{metric.value}</div>
              <div className="flex items-center gap-2">
                <div className="metric-label">{metric.label}</div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <ArrowUpRight className="h-4 w-4" />
                  {metric.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="heading-md mb-4">Conversion Funnel</h2>
          <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
            <BarChart4 className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="heading-md mb-4">Revenue Trends</h2>
          <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
            <LineChart className="h-12 w-12 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="card p-6">
        <h2 className="heading-md mb-4">Channel Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Channel</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Conversions</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">CPA</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">ROI</th>
              </tr>
            </thead>
            <tbody>
              {channelPerformance.map((channel, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{channel.channel}</td>
                  <td className="text-right py-3 px-4">{channel.conversions.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">${channel.revenue.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">${channel.cpa}</td>
                  <td className="text-right py-3 px-4">{channel.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Reports */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="heading-md mb-2">Custom Reports</h2>
            <p className="text-body">Create and export custom analytics reports</p>
          </div>
          <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Create New Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Campaign Performance', 'Revenue Analysis', 'User Behavior'].map((report, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <h3 className="font-medium text-gray-900 mb-2">{report}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last generated: 2 days ago</span>
                <button className="text-[#4A7AFF] hover:text-blue-700 transition-colors">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
