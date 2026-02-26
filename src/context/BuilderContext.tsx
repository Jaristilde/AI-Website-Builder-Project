import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { BusinessData, WizardStep, BusinessType, ServiceItem, BusinessFeatures, DesignStyle } from '../types/builder';
import { businessTemplates } from '../lib/templates';

// Shape that components expect when reading business data
interface BusinessDataView {
  name: string;
  ownerName?: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  tagline?: string;
  brandColor: string;
  designStyle: DesignStyle;
  businessType: BusinessType;
  customType?: string;
  services: ServiceItem[];
  features: BusinessFeatures;
}

interface BuilderState {
  step: WizardStep;
  data: BusinessData;
}

type BuilderAction =
  | { type: 'SET_STEP'; payload: WizardStep }
  | { type: 'SET_BUSINESS_TYPE'; payload: { type: BusinessType; customType?: string } }
  | { type: 'UPDATE_SERVICES'; payload: ServiceItem[] }
  | { type: 'UPDATE_FEATURES'; payload: BusinessFeatures }
  | { type: 'UPDATE_BUSINESS_INFO'; payload: Partial<BusinessData> }
  | { type: 'UPDATE_DESIGN'; payload: { style: DesignStyle; color: string } }
  | { type: 'IMPORT_FROM_URL'; payload: Partial<BusinessData> }
  | { type: 'LOAD_PUBLISHED_SITE'; payload: BusinessData }
  | { type: 'RESET' };

const initialState: BuilderState = {
  step: 1,
  data: {
    businessType: 'other',
    services: [],
    features: {
      booking: false,
      payments: false,
      gallery: false,
      menu: false,
      priceList: false,
      testimonials: false,
      map: false,
      socialMedia: false,
    },
    businessName: '',
    city: '',
    state: '',
    designStyle: 'modern',
    brandColor: '#7C3AED',
  },
};

const BuilderContext = createContext<{
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  businessData: BusinessDataView | null;
  setBusinessData: (updates: Partial<BusinessData>) => void;
} | null>(null);

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_BUSINESS_TYPE': {
      const template = businessTemplates[action.payload.type];
      return {
        ...state,
        data: {
          ...state.data,
          businessType: action.payload.type,
          customType: action.payload.customType,
          services: template.defaultServices,
          features: template.defaultFeatures,
        },
      };
    }
    case 'UPDATE_SERVICES':
      return { ...state, data: { ...state.data, services: action.payload } };
    case 'UPDATE_FEATURES':
      return { ...state, data: { ...state.data, features: action.payload } };
    case 'UPDATE_BUSINESS_INFO':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'UPDATE_DESIGN':
      return {
        ...state,
        data: {
          ...state.data,
          designStyle: action.payload.style,
          brandColor: action.payload.color,
        },
      };
    case 'IMPORT_FROM_URL': {
      const imported = action.payload;
      const template = imported.businessType ? businessTemplates[imported.businessType] : null;
      return {
        ...state,
        data: {
          ...state.data,
          ...(imported.businessType !== undefined && { businessType: imported.businessType }),
          ...(imported.businessName !== undefined && { businessName: imported.businessName }),
          ...(imported.services && imported.services.length > 0 && { services: imported.services }),
          ...(template && { features: template.defaultFeatures }),
          ...(imported.phone !== undefined && { phone: imported.phone }),
          ...(imported.email !== undefined && { email: imported.email }),
          ...(imported.city !== undefined && { city: imported.city }),
          ...(imported.state !== undefined && { state: imported.state }),
          ...(imported.tagline !== undefined && { tagline: imported.tagline }),
          ...(imported.designStyle !== undefined && { designStyle: imported.designStyle }),
          ...(imported.brandColor !== undefined && { brandColor: imported.brandColor }),
        },
      };
    }
    case 'LOAD_PUBLISHED_SITE':
      return {
        ...state,
        step: 6 as WizardStep,
        data: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const BuilderProvider: React.FC<{ children: React.ReactNode; readOnly?: boolean }> = ({ children, readOnly = false }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState, (initial) => {
    if (readOnly) return initial;
    const saved = localStorage.getItem('builder_state');
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    if (!readOnly) {
      localStorage.setItem('builder_state', JSON.stringify(state));
    }
    // Update brand color CSS variable
    document.documentElement.style.setProperty('--brand-color', state.data.brandColor);
  }, [state, readOnly]);

  // Derive businessData view that components expect (with .name instead of .businessName)
  const businessData = useMemo<BusinessDataView | null>(() => {
    if (!state.data.businessName?.trim()) return null;
    return {
      name: state.data.businessName,
      ownerName: state.data.ownerName,
      city: state.data.city,
      state: state.data.state,
      phone: state.data.phone,
      email: state.data.email,
      tagline: state.data.tagline,
      brandColor: state.data.brandColor,
      designStyle: state.data.designStyle,
      businessType: state.data.businessType,
      customType: state.data.customType,
      services: state.data.services,
      features: state.data.features,
    };
  }, [state.data]);

  const setBusinessData = (updates: Partial<BusinessData>) => {
    dispatch({ type: 'UPDATE_BUSINESS_INFO', payload: updates });
  };

  return (
    <BuilderContext.Provider value={{ state, dispatch, businessData, setBusinessData }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder must be used within a BuilderProvider');
  return context;
};
