"use client";

import {
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  ChevronRight,
  FileText,
  ArrowUpRight,
  Zap,
  BarChart
} from "lucide-react";

export default function AIBusinessStrategistPage() {
  const insights = [
    {
      category: "Market Opportunities",
      items: [
        {
          title: "Emerging Market Trend",
          description: "AI-driven content creation shows 47% growth in your sector",
          impact: "High",
          action: "Expand AI content services"
        },
        {
          title: "Competitor Analysis",
          description: "Gap in enterprise-level solutions in your market",
          impact: "Medium",
          action: "Develop enterprise features"
        }
      ]
    },
    {
      category: "Growth Strategy",
      items: [
        {
          title: "Customer Segment Opportunity",
          description: "SMB segment shows 3x higher conversion rate",
          impact: "High",
          action: "Focus marketing on SMB"
        },
        {
          title: "Product Development",
          description: "API integration most requested feature",
          impact: "Medium",
          action: "Prioritize API development"
        }
      ]
    }
  ];

  const recommendations = [
    {
      title: "Optimize Pricing Strategy",
      description: "Current pricing analysis suggests potential for 15% revenue increase",
      metrics: [
        { label: "Revenue Impact", value: "+15%" },
        { label: "Implementation Time", value: "2 weeks" }
      ],
      priority: "High",
      icon: <Target className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Expand Market Reach",
      description: "Target new geographic markets with high demand potential",
      metrics: [
        { label: "Market Size", value: "$2.4B" },
        { label: "Growth Rate", value: "23% YoY" }
      ],
      priority: "Medium",
      icon: <TrendingUp className="h-5 w-5 text-green-600" />
    },
    {
      title: "Product Enhancement",
      description: "Add AI-powered features based on user behavior analysis",
      metrics: [
        { label: "User Demand", value: "78%" },
        { label: "Retention Impact", value: "+25%" }
      ],
      priority: "High",
      icon: <Zap className="h-5 w-5 text-purple-600" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="heading-lg mb-2">AI Business Strategist</h1>
            <p className="text-body">AI-powered insights and recommendations for your business growth</p>
          </div>
          <button className="bg-[#4A7AFF] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report
          </button>
        </div>

        {/* Strategic Score */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Strategic Health Score</h2>
            <p className="text-sm text-gray-600 mb-4">Based on market position, growth rate, and competitive analysis</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-[#4A7AFF]">8.4</div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">+1.2 this month</span>
              </div>
            </div>
          </div>
          <div className="h-24 w-24 bg-[#4A7AFF]/10 rounded-full flex items-center justify-center">
            <Brain className="h-12 w-12 text-[#4A7AFF]" />
          </div>
        </div>
      </div>

      {/* Market Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((section, idx) => (
          <div key={idx} className="card p-6">
            <h2 className="heading-md mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-[#4A7AFF]" />
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.impact === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.impact} Impact
                        </span>
                        <button className="text-sm text-[#4A7AFF] hover:text-blue-700 flex items-center gap-1">
                          {item.action}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <BarChart className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Recommendations */}
      <div className="card p-6">
        <h2 className="heading-md mb-4">Strategic Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-2 rounded-lg bg-white">
                  {rec.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                {rec.metrics.map((metric, metricIdx) => (
                  <div key={metricIdx} className="bg-white rounded-lg p-2">
                    <div className="text-sm text-gray-600">{metric.label}</div>
                    <div className="font-medium text-gray-900">{metric.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  rec.priority === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {rec.priority} Priority
                </span>
                <button className="text-sm text-[#4A7AFF] hover:text-blue-700 flex items-center gap-1">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
