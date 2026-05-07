import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'STARTER',
    priceMonthly: 'Free',
    priceAnnual: 'Free',
    billing: 'Forever free',
    features: [
      '1 chatbot',
      '50 messages/month',
      '1 data source',
      'Basic analytics',
      'BotCraft branding',
    ],
    cta: 'Get Started Free',
    highlighted: false,
    href: '/dashboard/create',
  },
  {
    name: 'PROFESSIONAL',
    priceMonthly: '$29',
    priceAnnual: '$23',
    billingMonthly: 'Billed monthly',
    billingAnnual: 'Billed annually',
    features: [
      '5 chatbots',
      '2,000 messages/month',
      'Unlimited data sources',
      'Advanced analytics',
      'Remove branding',
      'Custom domain',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
    href: '/dashboard/create',
  },
  {
    name: 'BUSINESS',
    priceMonthly: '$79',
    priceAnnual: '$63',
    billingMonthly: 'Billed monthly',
    billingAnnual: 'Billed annually',
    features: [
      'Unlimited chatbots',
      '10,000 messages/month',
      'Unlimited data sources',
      'Enterprise analytics',
      'Remove branding',
      'Custom domain',
      '24/7 priority support',
      'SSO & team roles',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    href: '/dashboard/create',
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-header', {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      const cards = sectionRef.current?.querySelectorAll('.pricing-card');
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          yPercent: 20,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="w-full py-20 md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="pricing-header text-center">
          <span className="text-[11px] font-bold text-bc-accent uppercase tracking-[0.15em]">
            SIMPLE PRICING
          </span>
          <h2 className="font-display text-[28px] md:text-[36px] lg:text-[48px] font-bold mt-4 leading-tight">
            <span className="text-bc-text">Choose Your</span>{' '}
            <span className="text-bc-accent">Plan</span>
          </h2>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span
            className={`text-sm ${!annual ? 'text-bc-text font-medium' : 'text-bc-text-secondary'}`}
          >
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span
            className={`text-sm ${annual ? 'text-bc-text font-medium' : 'text-bc-text-secondary'}`}
          >
            Annual
          </span>
          <span className="text-[12px] text-bc-accent bg-bc-accent/15 rounded-full px-2.5 py-0.5 font-medium">
            Save 20%
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative bg-bc-surface border rounded-2xl p-8 lg:p-10 transition-all duration-300 hover:-translate-y-[3px] ${
                plan.highlighted
                  ? 'border-bc-accent md:scale-[1.02] shadow-glow'
                  : 'border-bc-border hover:border-bc-accent/20'
              }`}
            >
              {plan.highlighted && (
                <>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bc-accent text-white text-[12px] font-bold rounded-full px-4 py-1">
                    Most Popular
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-bc-accent rounded-t-2xl" />
                </>
              )}

              <p
                className={`text-[11px] font-bold tracking-[0.15em] ${
                  plan.highlighted ? 'text-bc-accent' : 'text-bc-text-muted'
                }`}
              >
                {plan.name}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-[36px] md:text-[48px] font-bold text-bc-text">
                  {annual ? plan.priceAnnual : plan.priceMonthly}
                </span>
                {!plan.priceMonthly.includes('Free') && (
                  <span className="text-bc-text-secondary text-base">/mo</span>
                )}
              </div>

              <p className="text-[13px] text-bc-text-muted mt-1">
                {plan.priceMonthly === 'Free'
                  ? plan.billing
                  : annual
                    ? plan.billingAnnual
                    : plan.billingMonthly}
              </p>

              <div className="h-px bg-bc-border my-6" />

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-bc-success shrink-0 mt-0.5" />
                    <span className="text-[13px] text-bc-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to={plan.href} className="block mt-8">
                <Button
                  className={`w-full py-5 rounded-[10px] text-[13px] font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-bc-accent hover:bg-bc-accent-hover text-white hover:shadow-glow'
                      : 'bg-transparent border border-bc-accent text-bc-accent hover:bg-bc-accent/10'
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
