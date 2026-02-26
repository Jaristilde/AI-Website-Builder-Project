export type BusinessType =
  | 'barbershop'
  | 'salon'
  | 'restaurant'
  | 'consultant'
  | 'store'
  | 'mechanic'
  | 'tutor'
  | 'church'
  | 'other';

export type DesignStyle = 'modern' | 'luxury' | 'minimal' | 'bold' | 'dark' | 'warm';

export interface ServiceItem {
  id: string;
  name: string;
  price?: string;
  description?: string;
  category?: string;
}

export interface BusinessFeatures {
  booking: boolean;
  payments: boolean;
  gallery: boolean;
  menu: boolean;
  priceList: boolean;
  testimonials: boolean;
  map: boolean;
  socialMedia: boolean;
}

export interface BusinessData {
  // Step 1
  businessType: BusinessType;
  customType?: string;
  // Step 2
  services: ServiceItem[];
  // Step 3
  features: BusinessFeatures;
  // Step 4 (Phase 2)
  businessName: string;
  ownerName?: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  tagline?: string;
  // Step 5 (Phase 2)
  designStyle: DesignStyle;
  brandColor: string;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface BusinessTemplate {
  type: BusinessType;
  label: string;
  icon: string; // lucide-react icon name
  defaultServices: ServiceItem[];
  defaultFeatures: BusinessFeatures;
  heroImageKeyword: string;
  ctaText: string;
  suggestedStyles: DesignStyle[];
}

// --- Scrape + AI Extraction types (Phase 1 + 2) ---

export interface ScrapeResult {
  success: boolean;
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    sourceUrl?: string;
    [key: string]: unknown;
  };
  error?: string;
}

export interface AIExtractionResult {
  success: boolean;
  data?: Partial<BusinessData>;
  confidence?: number;
  message?: string;
}

// --- Published Site types ---

export interface PublishState {
  isPublished: boolean;
  slug: string | null;
  publishToken: string | null;
  url: string | null;
}
