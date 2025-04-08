'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, query, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users2,
  Link2,
  CreditCard,
  Bot,
  Save
} from 'lucide-react';
import type { BusinessSettings, BusinessContext, AIEmployee, MarketingStrategy } from '@/types/business-settings';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BusinessSettings() {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  interface CompanyInfo {
    name: string;
    registrationNumber: string;
    address: string;
    email: string;
    phone: string;
    website: string;
  }

  interface Integration {
    id: string;
    name: string;
    description: string;
    connected: boolean;
  }

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    registrationNumber: '',
    address: '',
    email: '',
    phone: '',
    website: ''
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior',
      connected: false
    },
    {
      id: '2',
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace',
      connected: false
    },
    {
      id: '3',
      name: 'Stripe',
      description: 'Process payments and manage subscriptions',
      connected: false
    }
  ]);

  const [settings, setSettings] = useState<BusinessSettings>({
    businessContext: {
      companyName: '',
      businessType: '',
      productsServices: '',
      targetAudience: '',
      brandTone: 'Professional',
      productDescription: '',
      pricingStrategy: ''
    },
    aiEmployees: [
      { id: '1', name: 'AI Sales Manager', role: 'Sales', enabled: true, permissionLevel: 'Basic', dataAccess: ['sales', 'customers'] },
      { id: '2', name: 'AI Content Maker', role: 'Content', enabled: true, permissionLevel: 'Basic', dataAccess: ['content', 'brand'] }
    ],
    marketingStrategy: {
      currentPromotions: [],
      pricingDisplay: 'Direct',
      referralSystem: {
        enabled: false,
        rewardAmount: 0,
        rewardType: 'Percentage'
      }
    }
  });

  const debouncedCompanyInfo = useDebounce(companyInfo, 500);
  const debouncedSettings = useDebounce(settings, 500);
  const debouncedIntegrations = useDebounce(integrations, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!auth.currentUser) return;

        const settingsDoc = doc(db, 'businessSettings', auth.currentUser.uid);
        const docSnap = await getDoc(settingsDoc);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as BusinessSettings);
        }

        const companyDoc = doc(db, 'companies', auth.currentUser.uid);
        const companySnap = await getDoc(companyDoc);
        if (companySnap.exists()) {
          setCompanyInfo(companySnap.data() as CompanyInfo);
        }

        const integrationsDoc = doc(db, 'integrations', auth.currentUser.uid);
        const integrationsSnap = await getDoc(integrationsDoc);
        if (integrationsSnap.exists()) {
          setIntegrations(integrationsSnap.data().integrations);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompanyInfoSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const companyDoc = doc(db, 'companies', auth.currentUser.uid);
      await setDoc(companyDoc, companyInfo, { merge: true });
      alert('Company information saved successfully!');
    } catch (error) {
      console.error('Error saving company info:', error);
      alert('Error saving company information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegrationChange = (integrationId: string, connected: boolean) => {
    setIntegrations(prev => 
      prev.map(integration =>
        integration.id === integrationId ? { ...integration, connected } : integration
      )
    );
  };

  const handleIntegrationsSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const integrationsDoc = doc(db, 'integrations', auth.currentUser.uid);
      await setDoc(integrationsDoc, { integrations }, { merge: true });
      alert('Integration settings saved successfully!');
    } catch (error) {
      console.error('Error saving integrations:', error);
      alert('Error saving integration settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBusinessContextChange = (data: Partial<BusinessContext>) => {
    setSettings(prev => ({
      ...prev,
      businessContext: { ...prev.businessContext, ...data }
    }));
  };

  const handleAIEmployeeChange = (employeeId: string, data: Partial<AIEmployee>) => {
    setSettings(prev => ({
      ...prev,
      aiEmployees: prev.aiEmployees.map(emp => 
        emp.id === employeeId ? { ...emp, ...data } : emp
      )
    }));
  };

  const handleMarketingStrategyChange = (data: Partial<MarketingStrategy>) => {
    setSettings(prev => ({
      ...prev,
      marketingStrategy: { ...prev.marketingStrategy, ...data }
    }));
  };

  const handleSettingsSave = async (section: keyof BusinessSettings) => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      const settingsDoc = doc(db, 'businessSettings', auth.currentUser.uid);
      await setDoc(settingsDoc, { 
        ...settings,
        [section]: settings[section]
      }, { merge: true });
      alert(`${section} saved successfully!`);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Error saving ${section}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Business Settings</h1>
      
      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 flex flex-wrap gap-2">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Info
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            Users & Permissions
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing & Subscription
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Preferences
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="company">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Company Information</h2>
              <div className="grid gap-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Legal Company Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter company name"
                      value={companyInfo.name}
                      onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      placeholder="Enter registration number"
                      value={companyInfo.registrationNumber}
                      onChange={(e) => handleCompanyInfoChange('registrationNumber', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter full address"
                      value={companyInfo.address}
                      onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="company@example.com"
                      value={companyInfo.email}
                      onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={companyInfo.phone}
                      onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Company Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={companyInfo.website}
                      onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                    />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  className="flex items-center gap-2" 
                  onClick={handleCompanyInfoSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Users & Permissions</h2>
                <Button className="flex items-center gap-2">
                  <span>Add User</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Admin" },
                  { name: "Jane Smith", email: "jane@example.com", role: "Editor" },
                  { name: "Bob Wilson", email: "bob@example.com", role: "Viewer" }
                ].map((user, index) => (
                  <div key={index} className="border p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <select className="p-2 border rounded-md">
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <Button variant="outline">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  className="flex items-center gap-2" 
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      await setDoc(doc(db, 'users', auth.currentUser?.uid || ''), {
                        users: [
                          { name: "John Doe", email: "john@example.com", role: "Admin" },
                          { name: "Jane Smith", email: "jane@example.com", role: "Editor" },
                          { name: "Bob Wilson", email: "bob@example.com", role: "Viewer" }
                        ]
                      });
                      alert('User permissions saved successfully!');
                    } catch (error) {
                      alert('Error saving user permissions');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Integrations</h2>
              <div className="grid gap-6">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={integration.connected}
                          onChange={(e) => handleIntegrationChange(integration.id, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="text-sm">Configure</Button>
                      <Button variant="outline" className="text-sm">View Documentation</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  className="flex items-center gap-2" 
                  onClick={handleIntegrationsSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>
              <div className="grid gap-6">
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Current Plan</h3>
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Professional Plan</p>
                        <p className="text-sm text-gray-500">$49/month</p>
                      </div>
                      <Button>Upgrade Plan</Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Next billing date: April 1, 2025
                    </div>
                  </div>
                </div>

                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Payment Method</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline">Update</Button>
                    </div>
                  </div>
                </div>

                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <div className="grid gap-2">
                    {[
                      { date: "Mar 1, 2025", amount: "$49.00", status: "Paid" },
                      { date: "Feb 1, 2025", amount: "$49.00", status: "Paid" },
                      { date: "Jan 1, 2025", amount: "$49.00", status: "Paid" }
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{invoice.date}</p>
                          <p className="text-sm text-gray-500">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">{invoice.status}</span>
                          <Button variant="outline" className="text-sm">Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <div className="grid gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Business Context</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.businessContext.companyName}
                        onChange={(e) => handleBusinessContextChange({ companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        value={settings.businessContext.businessType}
                        onChange={(e) => handleBusinessContextChange({ businessType: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="productsServices">Products/Services</Label>
                    <Input
                      id="productsServices"
                      value={settings.businessContext.productsServices}
                      onChange={(e) => handleBusinessContextChange({ productsServices: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      value={settings.businessContext.targetAudience}
                      onChange={(e) => handleBusinessContextChange({ targetAudience: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="brandTone">Brand Tone</Label>
                    <select
                      id="brandTone"
                      className="w-full p-2 border rounded-md"
                      value={settings.businessContext.brandTone}
                      onChange={(e) => handleBusinessContextChange({ brandTone: e.target.value as any })}
                    >
                      <option value="Professional">Professional</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Concise">Concise</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="productDescription">Product Description</Label>
                    <textarea
                      id="productDescription"
                      className="w-full p-2 border rounded-md"
                      rows={4}
                      value={settings.businessContext.productDescription}
                      onChange={(e) => handleBusinessContextChange({ productDescription: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    className="flex items-center gap-2" 
                    onClick={() => handleSettingsSave('businessContext')}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">AI Access Controls</h2>
                <div className="space-y-4">
                  {settings.aiEmployees.map((employee) => (
                    <div key={employee.id} className="border p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">{employee.name}</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={employee.enabled}
                            onChange={(e) => handleAIEmployeeChange(employee.id, { enabled: e.target.checked })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="grid gap-4">
                        <div>
                          <Label>Permission Level</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={employee.permissionLevel}
                            onChange={(e) => handleAIEmployeeChange(employee.id, { permissionLevel: e.target.value as any })}
                          >
                            <option value="Basic">Basic</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Full">Full</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    className="flex items-center gap-2" 
                    onClick={() => handleSettingsSave('aiEmployees')}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Marketing & Discount Strategy</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Pricing Display</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={settings.marketingStrategy.pricingDisplay}
                      onChange={(e) => handleMarketingStrategyChange({ pricingDisplay: e.target.value as any })}
                    >
                      <option value="Direct">Direct Pricing</option>
                      <option value="CustomerBased">Customer-Based Pricing</option>
                    </select>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Referral System</h3>
                    <div className="grid gap-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.marketingStrategy.referralSystem.enabled}
                          onChange={(e) => handleMarketingStrategyChange({
                            referralSystem: {
                              ...settings.marketingStrategy.referralSystem,
                              enabled: e.target.checked
                            }
                          })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3">Enable Referral System</span>
                      </label>

                      {settings.marketingStrategy.referralSystem.enabled && (
                        <>
                          <div>
                            <Label>Reward Amount</Label>
                            <Input
                              type="number"
                              value={settings.marketingStrategy.referralSystem.rewardAmount}
                              onChange={(e) => handleMarketingStrategyChange({
                                referralSystem: {
                                  ...settings.marketingStrategy.referralSystem,
                                  rewardAmount: Number(e.target.value)
                                }
                              })}
                            />
                          </div>
                          <div>
                            <Label>Reward Type</Label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={settings.marketingStrategy.referralSystem.rewardType}
                              onChange={(e) => handleMarketingStrategyChange({
                                referralSystem: {
                                  ...settings.marketingStrategy.referralSystem,
                                  rewardType: e.target.value as any
                                }
                              })}
                            >
                              <option value="Percentage">Percentage Discount</option>
                              <option value="Fixed">Fixed Amount</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button 
                    className="flex items-center gap-2" 
                    onClick={() => handleSettingsSave('marketingStrategy')}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
