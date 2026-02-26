import React from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Try it out — no credit card needed',
      features: [
        '1 Website (preview/draft only)',
        '2 AI Builds per month',
        '1 AI Import per month',
        'Community Support',
      ],
      buttonText: 'Start Free — No Credit Card',
      highlight: false,
      badge: null,
    },
    {
      name: 'Starter',
      price: '$15',
      description: 'Go live with your business website',
      features: [
        '2 Live Websites',
        '10 AI Builds per month',
        '5 AI Imports per month',
        'Custom Domain',
        'Remove Branding',
        'Priority Support',
      ],
      buttonText: 'Get Started',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For growing businesses with multiple sites',
      features: [
        '5 Live Websites',
        '30 AI Builds per month',
        '20 AI Imports per month',
        'Custom Domain',
        'Remove Branding',
        'Priority Support',
      ],
      buttonText: 'Go Pro',
      highlight: false,
      badge: null,
    },
    {
      name: 'Commerce',
      price: '$79',
      description: 'Sell online with a full storefront',
      features: [
        '10 Live Websites',
        '100 AI Builds per month',
        '50 AI Imports per month',
        'Custom Domain',
        'Remove Branding',
        'Ecommerce (products, checkout)',
        'Priority Support',
      ],
      buttonText: 'Launch Your Store',
      highlight: false,
      badge: 'Best for Sellers',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-zinc-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-zinc-500">Start free. Upgrade when you're ready to go live.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white p-8 rounded-[32px] border-2 transition-all hover:shadow-xl flex flex-col ${
                plan.highlight ? 'border-purple-600 shadow-purple-100' : 'border-zinc-100'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`text-xs font-bold px-4 py-1 rounded-full ${
                    plan.badge === 'Most Popular'
                      ? 'bg-purple-600 text-white'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-900">{plan.price}</span>
                  <span className="text-zinc-500 font-medium">/month</span>
                </div>
                <p className="text-zinc-500 mt-3 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-700 text-sm font-medium">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/builder">
                <Button
                  className={`w-full h-12 rounded-2xl text-base font-bold ${
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
