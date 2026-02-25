import React from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'Perfect for new businesses',
      features: ['1 Website', 'Basic CRM', 'Google Sheets Sync', 'Community Support'],
      buttonText: 'Start for Free',
      highlight: false
    },
    {
      name: 'Professional',
      price: '$19',
      description: 'Everything you need to grow',
      features: ['Unlimited Websites', 'Advanced CRM', 'Custom Domain', 'Priority Support', 'Remove Branding'],
      buttonText: 'Go Pro',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-zinc-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-zinc-500">Choose the plan that fits your business stage.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white p-10 rounded-[32px] border-2 transition-all hover:shadow-xl ${
                plan.highlight ? 'border-purple-600 shadow-purple-100' : 'border-zinc-100'
              }`}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-zinc-900">{plan.price}</span>
                  <span className="text-zinc-500 font-medium">/month</span>
                </div>
                <p className="text-zinc-500 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-700 font-medium">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/builder">
                <Button 
                  className={`w-full h-14 rounded-2xl text-lg font-bold ${
                    plan.highlight ? 'bg-purple-600 hover:bg-purple-700' : 'bg-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
