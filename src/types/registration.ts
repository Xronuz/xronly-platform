import { BusinessType, BusinessCategory } from './business';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'select' | 'radio' | 'checkbox' | 'textarea';
  label: string;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  required?: boolean;
}

export interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface AIPreferences {
  salesStyle: {
    approach: 'aggressive' | 'consultative' | 'relationship-based';
    tone: 'professional' | 'casual' | 'friendly';
    focus: 'features' | 'benefits' | 'value';
  };
  marketingStyle: {
    channels: string[];
    content: 'educational' | 'promotional' | 'mixed';
    frequency: 'high' | 'medium' | 'low';
  };
  automationLevel: {
    sales: number; // 1-5
    support: number;
    marketing: number;
  };
}

export interface RegistrationFormData {
  // Step 1: Basic Auth
  email: string;
  password: string;

  // Step 2: Business Profile
  businessName: string;
  businessType: BusinessType;
  businessCategory: BusinessCategory;
  businessSize: 'small' | 'medium' | 'large';
  location: string;

  // Step 3: Business Details (varies by type)
  services?: Array<{
    name: string;
    description: string;
    price?: number;
  }>;
  products?: Array<{
    name: string;
    description: string;
    price: number;
    inventory?: number;
  }>;
  shipping?: {
    domestic: boolean;
    international: boolean;
    methods: string[];
  };

  // Step 4: AI Preferences
  aiPreferences: AIPreferences;
}
