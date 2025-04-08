"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

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

export default function Register() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  // Start from business type selection since basic auth is done
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    auth: {
      name: "",
      email: "",
      password: ""
    },
    business: {
      type: "",
      name: "",
      category: "",
      description: "",
      established: "",
      size: "small",
      location: "",
      website: "",
      contactInfo: {
        email: "",
        phone: "",
        address: ""
      }
    },
    services: [],
    products: [],
    ecommerce: {
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
        methods: [],
      }
    }
  });

  useEffect(() => {
    // If not authenticated, redirect to homepage
    if (!loading && !user) {
      router.push('/');
      return;
    }

    // Check if business profile already exists
    if (user) {
      getDoc(doc(db, "businesses", user.uid)).then((docSnap) => {
        if (docSnap.exists()) {
          // If business profile exists, redirect to dashboard
          router.push('/dashboard');
        }
      });
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white" style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  const handleChange = (section, field, value) => {
    if (section === 'auth') {
      setFormData(prev => ({
        ...prev,
        auth: { ...prev.auth, [field]: value }
      }));
    } else if (section === 'business') {
      setFormData(prev => ({
        ...prev,
        business: { ...prev.business, [field]: value }
      }));
    }
  };

  const validateForm = () => {
    if (step === 1) {
      return formData.auth.name && formData.auth.email && formData.auth.password;
    } else if (step === 2) {
      return formData.business.type;
    } else if (step === 3) {
      return formData.business.name && formData.business.category && formData.business.description;
    } else if (step === 4) {
      return formData.business.location && formData.business.contactInfo.phone;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // Save business data to profile
      const businessData = {
        ...formData.business,
        contactInfo: {
          ...formData.business.contactInfo,
          email: user.email
        }
      };

      // Add specific business type data
      if (formData.business.type === 'service') {
        businessData.services = formData.services;
      } else if (formData.business.type === 'product') {
        businessData.products = formData.products;
      } else if (formData.business.type === 'ecommerce') {
        businessData.ecommerce = formData.ecommerce;
      }

      await setDoc(doc(db, "businesses", user.uid), businessData);

      alert("Business profile completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch(step) {
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Business Type</h3>
            <div className="grid grid-cols-1 gap-4">
              {businessTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleChange('business', 'type', type);
                    nextStep();
                  }}
                  className={`p-4 border rounded-lg text-left hover:bg-blue-500 hover:text-white transition-colors
                    ${formData.business.type === type ? 'bg-blue-500 text-white' : ''}`}
                >
                  <div className="font-medium capitalize">{type}</div>
                  <div className="text-sm opacity-75">
                    {type === 'service' && "Service-based business"}
                    {type === 'product' && "Product-based business"}
                    {type === 'ecommerce' && "Online retail"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Business Details</h3>
            <div>
              <input
                type="text"
                placeholder="Business Name"
                className="w-full p-2 border rounded mb-2 text-black"
                value={formData.business.name}
                onChange={(e) => handleChange('business', 'name', e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full p-2 border rounded mb-2 text-black"
                value={formData.business.category}
                onChange={(e) => handleChange('business', 'category', e.target.value)}
              >
                <option value="">Select Category</option>
                {businessCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                placeholder="Business Description"
                className="w-full p-2 border rounded mb-2 text-black"
                value={formData.business.description}
                onChange={(e) => handleChange('business', 'description', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Contact Information</h3>
            <div>
              <input
                type="text"
                placeholder="Business Address"
                className="w-full p-2 border rounded mb-2 text-black"
                value={formData.business.location}
                onChange={(e) => handleChange('business', 'location', e.target.value)}
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-2 border rounded mb-2 text-black"
                value={formData.business.contactInfo.phone}
                onChange={(e) => handleChange('business', 'contactInfo', {
                  ...formData.business.contactInfo,
                  phone: e.target.value
                })}
              />
            </div>
            <div>
              <input
                type="url"
                placeholder="Website (Optional)"
                className="w-full p-2 border rounded mb-2 text-black"
                value={formData.business.website}
                onChange={(e) => handleChange('business', 'website', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white p-4" style={{ backgroundImage: "url('/bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Business Profile</h2>
          <div className="text-sm">
            Step {step-1}/3
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="flex justify-between mt-6">
            {step > 2 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateForm()) {
                    nextStep();
                  } else {
                    alert("Please fill all required fields");
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded ml-auto"
              >
                Complete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
