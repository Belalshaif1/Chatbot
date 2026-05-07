import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Upload,
  Cpu,
  Code,
  BarChart3,
  Shield,
  Users,
  FileText,
  Table,
  Link,
  Lock,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Upload,
    title: 'Train on Any Data',
    description:
      'Upload PDFs, Word docs, CSV files, or connect your website. Our AI processes and understands your content in minutes, not hours.',
    large: true,
    extras: [
      { icon: FileText, label: 'PDF' },
      { icon: FileText, label: 'DOC' },
      { icon: Table, label: 'CSV' },
      { icon: Link, label: 'URL' },
    ],
  },
  {
    icon: Cpu,
    title: 'Multi-Model AI',
    description:
      'Choose from GPT-4, Claude 3, or Gemini. Switch models anytime based on your needs for speed, cost, or capability.',
    large: false,
  },
  {
    icon: Code,
    title: 'Embed Anywhere',
    description:
      'One line of JavaScript embeds your bot on any website. Or share via link, WhatsApp, Slack, or Messenger.',
    large: false,
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Track conversations, user satisfaction, topic trends, and resolution rates. Export reports or connect to your BI tools.',
    large: false,
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description:
      'SOC 2 Type II certified, GDPR compliant, end-to-end encryption. Your data never trains public models. SSO, audit logs, and role-based access for teams.',
    large: true,
    extras: [
      { icon: Lock, label: 'SOC 2' },
      { icon: Shield, label: 'GDPR' },
      { icon: Lock, label: 'Encrypted' },
    ],
  },
  {
    icon: Users,
    title: 'Human Handoff',
    description:
      'Seamlessly escalate complex conversations to your team. AI suggests responses and learns from every human interaction.',
    large: false,
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from('.features-header', {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.feature-card');
        gsap.from(cards, {
          opacity: 0,
          yPercent: 25,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full py-20 md:py-[120px]"
    >
      {/* Mesh gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(46, 91, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="features-header text-center max-w-[600px] mx-auto">
          <span className="text-[11px] font-bold text-bc-accent uppercase tracking-[0.15em]">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="font-display text-[28px] md:text-[36px] lg:text-[48px] font-bold mt-4 leading-tight">
            <span className="text-bc-text">Everything You Need to</span>
            <br />
            <span className="text-bc-accent">Build Smart Bots</span>
          </h2>
        </div>

        {/* Feature Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`feature-card group bg-bc-surface border border-bc-border rounded-2xl p-8 cursor-pointer transition-all duration-400 hover:bg-bc-surface-elevated hover:border-bc-accent/30 hover:-translate-y-1 hover:shadow-card ${
                  feature.large
                    ? feature.title === 'Train on Any Data'
                      ? 'md:row-span-2'
                      : 'md:col-span-2'
                    : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-bc-surface-light flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-bc-accent" />
                </div>
                <h4 className="text-lg font-semibold text-bc-text mb-3">
                  {feature.title}
                </h4>
                <p className="text-sm text-bc-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {feature.extras && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {feature.extras.map((extra) => {
                      const ExtraIcon = extra.icon;
                      return (
                        <span
                          key={extra.label}
                          className="inline-flex items-center gap-1.5 text-[11px] text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-3 py-1"
                        >
                          <ExtraIcon className="w-3 h-3" />
                          {extra.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
