export interface BusinessContext {
  companyName: string;
  businessType: string;
  productsServices: string;
  targetAudience: string;
  brandTone: 'Professional' | 'Friendly' | 'Concise';
  productDescription: string;
  pricingStrategy: string;
}

export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  enabled: boolean;
  permissionLevel: 'Basic' | 'Advanced' | 'Full';
  dataAccess: string[];
}

export interface MarketingStrategy {
  currentPromotions: string[];
  pricingDisplay: 'Direct' | 'CustomerBased';
  referralSystem: {
    enabled: boolean;
    rewardAmount: number;
    rewardType: 'Percentage' | 'Fixed';
  };
}

export interface BusinessSettings {
  businessContext: BusinessContext;
  aiEmployees: AIEmployee[];
  marketingStrategy: MarketingStrategy;
}
