export type BusinessType = 'service' | 'product' | 'ecommerce';

export type BusinessCategory = 
  | 'technology'
  | 'retail'
  | 'consulting'
  | 'education'
  | 'healthcare'
  | 'food'
  | 'fashion'
  | 'other';

export interface BusinessProfile {
  id: string;
  name: string;
  type: BusinessType;
  category: BusinessCategory;
  description: string;
  established: string;
  size: 'small' | 'medium' | 'large';
  location: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
}

export interface ServiceBusiness extends BusinessProfile {
  type: 'service';
  services: Array<{
    id: string;
    name: string;
    description: string;
    price?: number;
    duration?: string;
  }>;
}

export interface ProductBusiness extends BusinessProfile {
  type: 'product';
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    sku?: string;
    inventory?: number;
  }>;
}

export interface EcommerceBusiness extends BusinessProfile {
  type: 'ecommerce';
  inventory: {
    tracking: boolean;
    locations?: string[];
  };
  shipping: {
    domestic: boolean;
    international: boolean;
    methods: string[];
  };
  payment: {
    methods: string[];
    gateway?: string;
  };
}

export type Business = ServiceBusiness | ProductBusiness | EcommerceBusiness;
