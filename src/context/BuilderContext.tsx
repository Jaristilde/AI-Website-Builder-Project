import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { BusinessData, WizardStep, BusinessType, ServiceItem, BusinessFeatures, DesignStyle } from '../types/builder';
import { businessTemplates } from '../lib/templates';

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
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState, (initial) => {
    const saved = localStorage.getItem('builder_state');
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem('builder_state', JSON.stringify(state));
    // Update brand color CSS variable
    document.documentElement.style.setProperty('--brand-color', state.data.brandColor);
  }, [state]);

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error('useBuilder must be used within a BuilderProvider');
  return context;
};
