"use client";

import {
  MessageSquare, Settings, Plus, Tag, Users, Clock, ChevronRight, Search,
  Filter, Bot, Sparkles, BarChart, Package, Briefcase, RefreshCcw,
  Lock, Timer, Brain, Activity, PieChart, MessageCircle, TrendingUp, Settings2,
  MessageCircleIcon, Instagram, Facebook, Phone
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { connectToTelegram } from "@/lib/telegram";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AISalesManagerPage() {
  const [user] = useAuthState(auth);
  const [businessType, setBusinessType] = useState<'product' | 'service'>('product');
  const [subscriptionType, setSubscriptionType] = useState<'free' | 'pro'>('free');
  const [showProModal, setShowProModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemCount, setItemCount] = useState(() => {
    const savedItems = localStorage.getItem('catalogItems');
    if (savedItems) {
      const items = JSON.parse(savedItems);
      return items.product.length + items.service.length;
    }
    return 0;
  });
  const [addItemForm, setAddItemForm] = useState({
    name: '',
    type: '',
    description: '',
    price: '',
    stockQuantity: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [items, setItems] = useState<{
    product: Array<{
      name: string;
      price: string;
      type: string;
      description?: string;
      stockQuantity?: string;
      features: string[];
      conversionRate: string;
    }>;
    service: Array<{
      name: string;
      price: string;
      type: string;
      description?: string;
      features: string[];
      conversionRate: string;
    }>;
  }>(() => {
    const savedItems = localStorage.getItem('catalogItems');
    return savedItems ? JSON.parse(savedItems) : {
      product: [],
      service: []
    };
  });

  useEffect(() => {
    localStorage.setItem('catalogItems', JSON.stringify(items));
  }, [items]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!addItemForm.name.trim()) {
      errors.name = "Name is required";
    }
    if (!addItemForm.type.trim()) {
      errors.type = "Type is required";
    }
    if (!addItemForm.price.trim()) {
      errors.price = "Price is required";
    } else if (!/^\$?\d+(\.\d{2})?$/.test(addItemForm.price.replace(/,/g, ''))) {
      errors.price = "Invalid price format";
    }
    if (businessType === 'product' && !addItemForm.stockQuantity) {
      errors.stockQuantity = "Stock quantity is required";
    }
    return errors;
  };

  const [showConfigureAI, setShowConfigureAI] = useState(false);
  const [responseTime, setResponseTime] = useState(1.5);
  const [nlpEnabled, setNlpEnabled] = useState(false);
  const [sentimentEnabled, setSentimentEnabled] = useState(false);
  const [socialConnections, setSocialConnections] = useState({
    telegram: false,
    instagram: false,
    facebook: false,
    whatsapp: false
  });
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);

  const handleConnect = async (network: string) => {
    if (socialConnections[network as keyof typeof socialConnections]) return;
    setConnectingNetwork(network);
    try {
      switch (network) {
        case 'telegram':
          await connectToTelegram(user?.uid);
          break;
        case 'instagram':
          window.open("https://instagram.com", "_blank");
          break;
        case 'facebook':
          window.open("https://facebook.com", "_blank");
          break;
        case 'whatsapp':
          window.open("https://web.whatsapp.com", "_blank");
          break;
      }
      setSocialConnections(prev => ({...prev, [network]: true}));
    } catch (error) {
      console.error(`Error connecting to ${network}:`, error);
    } finally {
      setConnectingNetwork(null);
    }
  };

  const conversations = [
    {
      customer: "Sarah Miller",
      stage: "Closing",
      message: "I'm ready to proceed with the purchase",
      time: "1 hour ago",
      status: "completed"
    }
  ];

  const metrics = [
    { label: "Response Time", value: "1.2 min", icon: <Clock />, color: "text-blue-400", proOnly: false },
    { label: "Conversion Rate", value: "32%", icon: <ChevronRight />, color: "text-green-400", proOnly: false },
    { label: "Active Chats", value: "24", icon: <MessageSquare />, color: "text-orange-400", proOnly: false },
    { label: "Success Rate", value: "89%", icon: <BarChart />, color: "text-purple-400", proOnly: false },
    { label: "Lead Score", value: "8.5/10", icon: <TrendingUp />, color: "text-indigo-400", proOnly: true },
    { label: "Chat Activity", value: "+45%", icon: <Activity />, color: "text-pink-400", proOnly: true },
    { label: "AI Suggestions", value: "15 New", icon: <MessageCircle />, color: "text-cyan-400", proOnly: true }
  ];

  const proFeatures = [
    { icon: <Bot className="text-blue-400" />, title: "AI Auto-Reply Optimization" },
    { icon: <PieChart className="text-purple-400" />, title: "Advanced Analytics & Reports" },
    { icon: <Timer className="text-green-400" />, title: "Faster Response Time" },
    { icon: <Brain className="text-orange-400" />, title: "Smart AI Assistant Training" }
  ];

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        {/* Header with Business Type Switch */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Sales Manager</h1>
            <p className="text-gray-400">Sotuv agentingizni sozlang va biznesingizga moslashtiring</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="glass flex items-center p-1 rounded-lg">
              {['product', 'service'].map((type) => (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBusinessType(type as 'product' | 'service')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    businessType === type
                      ? 'bg-primary/20 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </motion.button>
              ))}
            </div>
            {subscriptionType === 'pro' && (
              <div className="bg-gradient-to-r from-primary/20 to-primary/30 backdrop-blur-lg text-white px-3 py-2 rounded-lg border border-primary/30">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">Pro</span>
              </div>
            )}
          </div>
        </div>

        {/* Social Media Connections */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(socialConnections).map((network) => (
            <motion.button
              key={network}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleConnect(network)}
              disabled={connectingNetwork === network || socialConnections[network as keyof typeof socialConnections]}
              className={`glass-card text-white px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                socialConnections[network as keyof typeof socialConnections]
                  ? 'bg-primary/20 border-primary/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                {network === 'telegram' && <MessageCircleIcon className="h-5 w-5" />}
                {network === 'instagram' && <Instagram className="h-5 w-5" />}
                {network === 'facebook' && <Facebook className="h-5 w-5" />}
                {network === 'whatsapp' && <Phone className="h-5 w-5" />}
                <span className="capitalize">
                  {connectingNetwork === network
                    ? 'Connecting...'
                    : socialConnections[network as keyof typeof socialConnections]
                      ? 'Connected'
                      : `Connect ${network}`}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Enhanced Subscription Banner */}
        {subscriptionType === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card from-primary/10 to-primary/20 rounded-lg p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 rounded-full p-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Unlock Pro Features</h3>
                    <p className="text-sm text-gray-400">Get advanced analytics and more</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                    <Timer className="h-4 w-4" />
                    🔥 Limited Time: Get 20% off your first month!
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    Pro Users: 87% higher success rate!
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => setShowProModal(true)}
                  className="btn-primary"
                >
                  Upgrade to Pro
                </Button>
                <Button
                  onClick={() => setShowProModal(true)}
                  variant="outline"
                  className="btn-outline"
                >
                  Try for Free
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configure AI Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowConfigureAI(!showConfigureAI)}
            className="glass-card w-full text-white hover:bg-white/5 mb-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Configure AI
            </div>
            <ChevronRight className={`h-5 w-5 transform transition-transform ${showConfigureAI ? 'rotate-90' : ''}`} />
          </Button>

          {showConfigureAI && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-card space-y-4 p-4 rounded-lg"
            >
              <div className="space-y-4">
                {/* Response Time */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Custom AI Response Time</span>
                  {subscriptionType === 'pro' ? (
                    <div className="flex-1 ml-4">
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={responseTime}
                        onChange={(e) => setResponseTime(parseFloat(e.target.value))}
                        className="glass-input w-full"
                      />
                      <div className="text-sm text-gray-400 mt-1 text-right">{responseTime}s</div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowProModal(true)}
                      variant="outline"
                      className="btn-outline flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Unlock Pro
                    </Button>
                  )}
                </div>

                {/* Advanced NLP Features */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Advanced NLP Features</span>
                  {subscriptionType === 'pro' ? (
                    <div
                      onClick={() => setNlpEnabled(!nlpEnabled)}
                      className={`toggle-switch ${
                        nlpEnabled ? 'bg-primary/50' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        nlpEnabled ? 'right-1' : 'left-1'
                      }`} />
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowProModal(true)}
                      variant="outline"
                      className="btn-outline flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Unlock Pro
                    </Button>
                  )}
                </div>

                {/* Sentiment Analysis */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Sentiment Analysis</span>
                  {subscriptionType === 'pro' ? (
                    <div
                      onClick={() => setSentimentEnabled(!sentimentEnabled)}
                      className={`toggle-switch ${
                        sentimentEnabled ? 'bg-primary/50' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        sentimentEnabled ? 'right-1' : 'left-1'
                      }`} />
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowProModal(true)}
                      variant="outline"
                      className="btn-outline flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Unlock Pro
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.filter(metric => !metric.proOnly || subscriptionType === 'pro').map((metric, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="metric-card"
            >
              <div className={`metric-icon ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="relative flex-1">
                {metric.proOnly && subscriptionType === 'free' && (
                  <Lock className="absolute top-0 right-0 h-4 w-4 text-gray-400" />
                )}
                <p className="metric-label">{metric.label}</p>
                <p className="metric-value">{metric.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Catalog */}
          <Card className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {businessType === 'product' ? 'Product' : 'Service'} Catalog
              </h2>
              <div>
                {subscriptionType === 'free' && itemCount > 0 && (
                  <span className="text-sm text-gray-400 mr-4">
                    Free plan: 1 item limit reached
                  </span>
                )}
                <Button
                  className="btn-primary"
                  onClick={() => {
                    if (subscriptionType === 'free' && itemCount >= 1) {
                      setShowProModal(true);
                    } else {
                      setShowAddModal(true);
                    }
                  }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add {businessType === 'product' ? 'Product' : 'Service'}
                </Button>
              </div>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm"
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  className="glass-card p-6 max-w-sm w-full"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Add New {businessType === 'product' ? 'Product' : 'Service'}
                  </h3>

                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    const errors = validateForm();
                    setFormErrors(errors);

                    if (Object.keys(errors).length === 0) {
                      setFormSubmitting(true);
                      try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        // Add new item to catalog
                        const newItem = {
                          name: addItemForm.name,
                          type: addItemForm.type,
                          price: addItemForm.price,
                          description: addItemForm.description || '',
                          features: [addItemForm.type],
                          conversionRate: "0%",
                          ...(businessType === 'product' ? { stockQuantity: addItemForm.stockQuantity } : {})
                        };

                        setItems(prev => ({
                          ...prev,
                          [businessType]: [newItem, ...prev[businessType]]
                        }));

                        setItemCount(prev => prev + 1);
                        setFormSubmitted(true);

                        setTimeout(() => {
                          setShowAddModal(false);
                          setFormSubmitted(false);
                          setAddItemForm({
                            name: '',
                            type: '',
                            description: '',
                            price: '',
                            stockQuantity: ''
                          });
                        }, 1500);
                      } finally {
                        setFormSubmitting(false);
                      }
                    }
                  }}>
                    {/* Common Fields */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        {businessType === 'product' ? 'Product' : 'Service'} Name
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={addItemForm.name}
                        onChange={(e) => setAddItemForm(prev => ({ ...prev, name: e.target.value }))}
                        className="glass-input w-full p-2 rounded-md text-white"
                        placeholder="e.g. Premium Widget"
                        title="Enter the name of your product/service"
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Type
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={addItemForm.type}
                        onChange={(e) => setAddItemForm(prev => ({ ...prev, type: e.target.value }))}
                        className="glass-input w-full p-2 rounded-md text-white"
                        placeholder={businessType === 'product' ? 'e.g. Electronics, Software' : 'e.g. Consulting, Training'}
                        title="Categorize your item to help with organization"
                        required
                      />
                      {formErrors.type && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.type}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Description
                      </label>
                      <textarea
                        value={addItemForm.description}
                        onChange={(e) => setAddItemForm(prev => ({ ...prev, description: e.target.value }))}
                        className="glass-input w-full p-2 rounded-md text-white"
                        placeholder="Enter description"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Price
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={addItemForm.price}
                        onChange={(e) => setAddItemForm(prev => ({ ...prev, price: e.target.value }))}
                        className="glass-input w-full p-2 rounded-md text-white"
                        placeholder="e.g. $99.99"
                        title="Enter the price (format: $XX.XX)"
                        required
                      />
                      {formErrors.price && (
                        <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>
                      )}
                    </div>

                    {/* Product-specific Fields */}
                    {businessType === 'product' && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Stock Quantity
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          value={addItemForm.stockQuantity}
                          onChange={(e) => setAddItemForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                          className="glass-input w-full p-2 rounded-md text-white"
                          placeholder="e.g. 100"
                          title="Enter the available stock quantity"
                          required
                        />
                        {formErrors.stockQuantity && (
                          <p className="text-red-400 text-xs mt-1">{formErrors.stockQuantity}</p>
                        )}
                      </div>
                    )}

                    {/* Freemium Plan Notice */}
                    {subscriptionType === 'free' && (
                      <div className="glass-card p-3 text-sm text-gray-300 flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          In the free plan, you can add only one product/service.
                          <button
                            type="button"
                            onClick={() => setShowProModal(true)}
                            className="text-primary hover:text-primary/80 ml-1"
                          >
                            Upgrade to Pro
                          </button>
                          for unlimited entries!
                        </span>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="submit"
                        disabled={subscriptionType === 'free' && itemCount >= 1}
                        className={`btn-primary flex-1 ${
                          subscriptionType === 'free' && itemCount >= 1
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        title={subscriptionType === 'free' && itemCount >= 1 ? 'Free plan limit reached' : ''}
                      >
                        {formSubmitting ? 'Adding...' : formSubmitted ? 'Added!' : 'Add Item'}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        variant="outline"
                        className="btn-outline flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            <div className="space-y-4">
              {items[businessType].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 hover:bg-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{item.price}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                      {item.conversionRate} Conversion
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full glass border border-white/10 text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Conversations */}
          <Card className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Active Conversations</h2>
              <Button variant="outline" size="sm" className="btn-outline">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="space-y-4">
              {conversations.map((conv, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        conv.status === "active" ? "bg-green-400" :
                        conv.status === "pending" ? "bg-yellow-400" :
                        "bg-blue-400"
                      }`} />
                      <h3 className="font-medium text-white">{conv.customer}</h3>
                    </div>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{conv.message}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      conv.stage === "Negotiation" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                      conv.stage === "Closing" ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                      "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {conv.stage}
                    </span>
                    <button className="text-primary hover:text-primary/80 text-sm">
                      View Chat
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { icon: <Bot className="text-blue-400" />, title: "Test AI Response", desc: "Simulate customer interactions" },
                { icon: <Sparkles className="text-purple-400" />, title: "Train AI Model", desc: "Improve response accuracy" },
                { icon: <BarChart className="text-green-400" />, title: "View Analytics", desc: "Performance insights" }
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card w-full flex items-center gap-3 p-3 hover:bg-white/5"
                >
                  <div className="p-2 bg-white/5 rounded-lg">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{action.title}</div>
                    <div className="text-sm text-gray-400">{action.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
