'use client';

import { useState } from 'react';
import { Check, CreditCard, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '#',
    priceMonthly: '$99',
    description: 'Essential monitoring for small deployments.',
    features: ['Up to 5 terminals', 'Daily usage reports', 'Standard support', 'Basic map view'],
    mostPopular: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '#',
    priceMonthly: '$299',
    description: 'Advanced features for growing networks.',
    features: [
      'Up to 50 terminals',
      'Real-time speed monitoring',
      'Priority 24/7 support',
      'Advanced analytics',
      'Custom alerts',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: 'Custom',
    description: 'Dedicated support and infrastructure for large fleets.',
    features: [
      'Unlimited terminals',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    mostPopular: false,
  },
];

export default function Subscription() {
  const [currentPlan, setCurrentPlan] = useState('tier-pro');
  const [isManaging, setIsManaging] = useState(false);
  const { role } = useAuth();

  const handleUpgrade = (tierId: string) => {
    if (tierId === 'tier-enterprise') {
      alert('Contacting sales...');
      return;
    }
    setCurrentPlan(tierId);
    alert(`Successfully upgraded to ${tiers.find(t => t.id === tierId)?.name} plan!`);
  };

  const currentTier = tiers.find(t => t.id === currentPlan);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Subscription & Billing</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-zinc-900">Current Plan: {currentTier?.name}</h2>
            <p className="text-sm text-zinc-500 mt-1">Your next billing date is April 1, 2026.</p>
          </div>
          <button 
            onClick={() => setIsManaging(!isManaging)}
            className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            <CreditCard className="-ml-0.5 h-4 w-4" aria-hidden="true" />
            {isManaging ? 'Close Billing' : 'Manage Billing'}
          </button>
        </div>
        
        {isManaging && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <h3 className="text-sm font-medium text-zinc-900 mb-4">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
              <CreditCard className="h-6 w-6 text-zinc-400" />
              <div>
                <p className="text-sm font-medium text-zinc-900">Visa ending in 4242</p>
                <p className="text-xs text-zinc-500">Expires 12/2028</p>
              </div>
              <button className="ml-auto text-sm font-medium text-emerald-600 hover:text-emerald-500">
                Update
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Pricing plans for teams of all sizes
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-600">
            Choose an affordable plan that&apos;s packed with the best features for monitoring your satellite network.
          </p>
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {tiers.map((tier, tierIdx) => {
              const isCurrentPlan = currentPlan === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl p-8 ring-1 ${
                    tier.mostPopular ? 'bg-zinc-900 ring-zinc-900' : 'bg-white ring-zinc-200'
                  } ${tierIdx === 0 ? 'lg:rounded-r-none' : ''} ${
                    tierIdx === 2 ? 'lg:rounded-l-none' : ''
                  }`}
                >
                  <h3
                    id={tier.id}
                    className={`text-lg font-semibold leading-8 ${
                      tier.mostPopular ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    {tier.name}
                    {isCurrentPlan && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        Current
                      </span>
                    )}
                  </h3>
                  <p
                    className={`mt-4 text-sm leading-6 ${
                      tier.mostPopular ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {tier.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span
                      className={`text-4xl font-bold tracking-tight ${
                        tier.mostPopular ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {tier.priceMonthly}
                    </span>
                    {tier.priceMonthly !== 'Custom' && (
                      <span
                        className={`text-sm font-semibold leading-6 ${
                          tier.mostPopular ? 'text-zinc-300' : 'text-zinc-600'
                        }`}
                      >
                        /month
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrentPlan}
                    aria-describedby={tier.id}
                    className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isCurrentPlan
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : tier.mostPopular
                          ? 'bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:outline-emerald-500'
                          : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:outline-zinc-600'
                    }`}
                  >
                    {isCurrentPlan 
                      ? 'Current Plan' 
                      : tier.priceMonthly === 'Custom' 
                        ? 'Contact sales' 
                        : 'Upgrade plan'}
                  </button>
                  <ul
                    role="list"
                    className={`mt-8 space-y-3 text-sm leading-6 ${
                      tier.mostPopular ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check
                          className={`h-6 w-5 flex-none ${
                            tier.mostPopular ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
