"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { connectToTelegram } from "@/lib/telegram";

const businessTypes = ['service', 'product', 'ecommerce'];

const businessCategories = [
  'technology',
  'retail',
  'consulting',
  'education',
  'healthcare',
  'food',
  'fashion',
  'other'
];

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

interface Business {
  type: 'service' | 'product' | 'ecommerce';
  name: string;
  category: string;
  description: string;
  location: string;
  website?: string;
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
  services?: Array<{
    id: string;
    name: string;
    description: string;
    price?: number;
    duration?: string;
  }>;
  products?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    sku?: string;
    inventory?: number;
  }>;
  ecommerce?: {
    inventory: {
      tracking: boolean;
      locations: string[];
    };
    shipping: {
      domestic: boolean;
      international: boolean;
      methods: string[];
    };
    payment: {
      methods: string[];
    };
  };
}

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [editedBusiness, setEditedBusiness] = useState<Business | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [socialConnections, setSocialConnections] = useState({
    telegram: false,
    instagram: false,
    facebook: false,
    whatsapp: false
  });
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);

  const handleTelegramConnect = async () => {
    if (socialConnections.telegram) return;
    setConnectingNetwork('telegram');
    try {
      await connectToTelegram(user?.uid);
      setSocialConnections(prev => ({...prev, telegram: true}));
    } catch (error) {
      console.error("Error connecting to Telegram:", error);
    } finally {
      setConnectingNetwork(null);
    }
  };

  const handleInstagramConnect = async () => {
    if (socialConnections.instagram) return;
    setConnectingNetwork('instagram');
    try {
      window.open("https://instagram.com", "_blank");
      setSocialConnections(prev => ({...prev, instagram: true}));
    } finally {
      setConnectingNetwork(null);
    }
  };

  const handleFacebookConnect = async () => {
    if (socialConnections.facebook) return;
    setConnectingNetwork('facebook');
    try {
      window.open("https://facebook.com", "_blank");
      setSocialConnections(prev => ({...prev, facebook: true}));
    } finally {
      setConnectingNetwork(null);
    }
  };

  const handleWhatsAppConnect = async () => {
    if (socialConnections.whatsapp) return;
    setConnectingNetwork('whatsapp');
    try {
      window.open("https://web.whatsapp.com", "_blank");
      setSocialConnections(prev => ({...prev, whatsapp: true}));
    } finally {
      setConnectingNetwork(null);
    }
  };

  // Initialize edited states when data is loaded
  useEffect(() => {
    if (profile) setEditedProfile(profile);
    if (business) setEditedBusiness(business);
  }, [profile, business]);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleBusinessChange = (field: keyof Business, value: any) => {
    setEditedBusiness(prev => {
      if (!prev) return null;

      // If changing business type, reset type-specific data
      if (field === 'type') {
        const newBusiness = {
          ...prev,
          type: value as 'service' | 'product' | 'ecommerce',
          // Remove all type-specific data
          services: undefined,
          products: undefined,
          ecommerce: undefined
        };

        // Initialize new type-specific data
        if (value === 'service') {
          newBusiness.services = [];
        } else if (value === 'product') {
          newBusiness.products = [];
        } else if (value === 'ecommerce') {
          newBusiness.ecommerce = {
            inventory: {
              tracking: false,
              locations: []
            },
            shipping: {
              domestic: false,
              international: false,
              methods: []
            },
            payment: {
              methods: []
            }
          };
        }

        return newBusiness;
      }

      // For other fields, just update the value
      return { ...prev, [field]: value };
    });
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setEditedBusiness(prev => prev ? {
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    } : null);
  };

  const handleSave = async () => {
    if (!user || !editedProfile || !editedBusiness) return;
    setIsSaving(true);
    try {
      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: editedProfile.name
      });

      // Update user profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, editedProfile);

      // Update business data in Firestore
      const businessDocRef = doc(db, "businesses", user.uid);

      // Create a clean business object without undefined values
      const businessData = {
        ...editedBusiness,
        // Always initialize arrays based on type and remove other type data
        services: editedBusiness.type === 'service' ? (editedBusiness.services || []) : null,
        products: editedBusiness.type === 'product' ? (editedBusiness.products || []) : null,
        ecommerce: editedBusiness.type === 'ecommerce' ? (editedBusiness.ecommerce || {
          inventory: { tracking: false, locations: [] },
          shipping: { domestic: false, international: false, methods: [] },
          payment: { methods: [] }
        }) : null
      };

      // Remove any null values from the object
      Object.keys(businessData).forEach(key =>
        businessData[key] === null && delete businessData[key]
      );

      await updateDoc(businessDocRef, businessData);

      // Update local state
      setProfile(editedProfile);
      setBusiness(editedBusiness);
      setIsEditingProfile(false);
      setIsEditingBusiness(false);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfile(userDocSnap.data() as UserProfile);
        }

        // Fetch business data
        const businessDocRef = doc(db, "businesses", user.uid);
        const businessDocSnap = await getDoc(businessDocRef);

        if (businessDocSnap.exists()) {
          setBusiness(businessDocSnap.data() as Business);
        }
      } catch (err) {
        setError("Error fetching data");
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Please sign in to view your profile</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Personal Profile */}
          <div className="rounded-lg border border-gray-800 bg-black p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Personal Profile</h1>
              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
            {editedProfile && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-400">Name</span>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded"
                    />
                  ) : (
                    <span className="text-white">{profile?.name}</span>
                  )}
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-400">Email</span>
                  <span className="text-white">{profile?.email}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-400">Member Since</span>
                  <span className="text-white">
                    {profile?.createdAt && new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Networks */}
          <div className="rounded-lg border border-gray-800 bg-black p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Social Networks</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Telegram */}
              <button
                onClick={handleTelegramConnect}
                disabled={connectingNetwork === 'telegram' || socialConnections.telegram}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  socialConnections.telegram
                    ? 'bg-green-900 hover:bg-green-800'
                    : 'bg-gray-800 hover:bg-gray-700'
                } ${connectingNetwork === 'telegram' ? 'opacity-50 cursor-wait' : ''}`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.495 7.952l-1.77 8.347c-.13.59-.477.736-.967.458l-2.67-1.967-1.287 1.24c-.142.142-.262.262-.54.262l.192-2.73 4.97-4.49c.216-.19-.047-.297-.335-.107l-6.14 3.87-2.644-.825c-.575-.18-.587-.575.12-.85l10.32-3.97c.476-.18.89.107.75.862z"/>
                </svg>
                <span className="text-white">
                  {connectingNetwork === 'telegram'
                    ? 'Connecting...'
                    : socialConnections.telegram
                      ? 'Connected'
                      : 'Connect'}
                </span>
              </button>

              {/* Instagram */}
              <button
                onClick={handleInstagramConnect}
                disabled={connectingNetwork === 'instagram' || socialConnections.instagram}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  socialConnections.instagram
                    ? 'bg-green-900 hover:bg-green-800'
                    : 'bg-gray-800 hover:bg-gray-700'
                } ${connectingNetwork === 'instagram' ? 'opacity-50 cursor-wait' : ''}`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-white">
                  {connectingNetwork === 'instagram'
                    ? 'Connecting...'
                    : socialConnections.instagram
                      ? 'Connected'
                      : 'Connect'}
                </span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookConnect}
                disabled={connectingNetwork === 'facebook' || socialConnections.facebook}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  socialConnections.facebook
                    ? 'bg-green-900 hover:bg-green-800'
                    : 'bg-gray-800 hover:bg-gray-700'
                } ${connectingNetwork === 'facebook' ? 'opacity-50 cursor-wait' : ''}`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-white">
                  {connectingNetwork === 'facebook'
                    ? 'Connecting...'
                    : socialConnections.facebook
                      ? 'Connected'
                      : 'Connect'}
                </span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppConnect}
                disabled={connectingNetwork === 'whatsapp' || socialConnections.whatsapp}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  socialConnections.whatsapp
                    ? 'bg-green-900 hover:bg-green-800'
                    : 'bg-gray-800 hover:bg-gray-700'
                } ${connectingNetwork === 'whatsapp' ? 'opacity-50 cursor-wait' : ''}`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-white">
                  {connectingNetwork === 'whatsapp'
                    ? 'Connecting...'
                    : socialConnections.whatsapp
                      ? 'Connected'
                      : 'Connect'}
                </span>
              </button>
            </div>
          </div>

          {/* Business Info */}
          {editedBusiness && (
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Business Information</h2>
                {!isEditingBusiness ? (
                  <button
                    onClick={() => setIsEditingBusiness(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit Business
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsEditingBusiness(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">Business Name</span>
                    {isEditingBusiness ? (
                      <input
                        type="text"
                        value={editedBusiness.name}
                        onChange={(e) => handleBusinessChange('name', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    ) : (
                      <span className="text-white">{business?.name}</span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">Category</span>
                    {isEditingBusiness ? (
                      <select
                        value={editedBusiness.category}
                        onChange={(e) => handleBusinessChange('category', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      >
                        {businessCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-white capitalize">{business?.category}</span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">Business Type</span>
                    {isEditingBusiness ? (
                      <select
                        value={editedBusiness.type}
                        onChange={(e) => handleBusinessChange('type', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      >
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-white capitalize">{business?.type}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">Location</span>
                    {isEditingBusiness ? (
                      <input
                        type="text"
                        value={editedBusiness.location}
                        onChange={(e) => handleBusinessChange('location', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    ) : (
                      <span className="text-white">{business?.location}</span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">Phone</span>
                    {isEditingBusiness ? (
                      <input
                        type="tel"
                        value={editedBusiness.contactInfo.phone}
                        onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    ) : (
                      <span className="text-white">{business?.contactInfo.phone}</span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-400">Website</span>
                    {isEditingBusiness ? (
                      <input
                        type="url"
                        value={editedBusiness.website || ''}
                        onChange={(e) => handleBusinessChange('website', e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded"
                      />
                    ) : (
                      <span className="text-white">{business?.website}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-400">Description</span>
                    {isEditingBusiness ? (
                    <textarea
                      value={editedBusiness.description}
                      onChange={(e) => handleBusinessChange('description', e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded min-h-[100px]"
                    />
                  ) : (
                    <span className="text-white whitespace-pre-wrap">{business?.description}</span>
                  )}
                </div>
              </div>

              {/* Service-specific information */}
              { (isEditingBusiness ? editedBusiness.type : business.type) === 'service' && (editedBusiness.services || business.services) && (editedBusiness.services?.length || business.services?.length) > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-xl font-bold text-white">Services</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {business.services.map(service => (
                      <div key={service.id} className="rounded border border-gray-700 p-4">
                        <h4 className="font-medium text-white">{service.name}</h4>
                        <p className="mt-1 text-sm text-gray-400">{service.description}</p>
                        {service.price && <p className="mt-2 text-white">${service.price}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product-specific information */}
              { (isEditingBusiness ? editedBusiness.type : business.type) === 'product' && (editedBusiness.products || business.products) && (editedBusiness.products?.length || business.products?.length) > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 text-xl font-bold text-white">Products</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {business.products.map(product => (
                      <div key={product.id} className="rounded border border-gray-700 p-4">
                        <h4 className="font-medium text-white">{product.name}</h4>
                        <p className="mt-1 text-sm text-gray-400">{product.description}</p>
                        <p className="mt-2 text-white">${product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* E-commerce-specific information */}
              { (isEditingBusiness ? editedBusiness.type : business.type) === 'ecommerce' && (editedBusiness.ecommerce || business.ecommerce) && (
                <div className="mt-6">
                  <h3 className="mb-4 text-xl font-bold text-white">E-commerce Details</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-400">Inventory Tracking</span>
                        <span className="text-white">{business.ecommerce.inventory.tracking ? 'Yes' : 'No'}</span>
                      </div>
                      {business.ecommerce.inventory.locations.length > 0 && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-400">Inventory Locations</span>
                          <span className="text-white">{business.ecommerce.inventory.locations.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-400">Shipping</span>
                        <span className="text-white">
                          {[
                            business.ecommerce.shipping.domestic && 'Domestic',
                            business.ecommerce.shipping.international && 'International'
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                      {business.ecommerce.shipping.methods.length > 0 && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-400">Shipping Methods</span>
                          <span className="text-white">{business.ecommerce.shipping.methods.join(', ')}</span>
                        </div>
                      )}
                      {business.ecommerce.payment.methods.length > 0 && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-400">Payment Methods</span>
                          <span className="text-white">{business.ecommerce.payment.methods.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}
