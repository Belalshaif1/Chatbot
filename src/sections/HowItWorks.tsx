import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, Brain, Settings, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '1',
    icon: Upload,
    title: 'Upload Your Data',
    description:
      'Add documents, paste text, or enter your website URL. We support 50+ file formats.',
  },
  {
    number: '2',
    icon: Brain,
    title: 'AI Learns Instantly',
    description:
      'Our AI processes your content in minutes, building a knowledge base tailored to your business.',
  },
  {
    number: '3',
    icon: Settings,
    title: 'Customize Your Bot',
    description:
      'Adjust the tone, appearance, and behavior. Add your logo, colors, and welcome message.',
  },
  {
    number: '4',
    icon: Globe,
    title: 'Deploy Anywhere',
    description:
      'Embed on your website, share a link, or connect to messaging platforms. Your bot is live 24/7.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.from('.hiw-header', {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      // Connecting line
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 75%',
          },
        });
      }

      // Steps
      if (stepsRef.current) {
        const stepEls = stepsRef.current.querySelectorAll('.step-item');
        stepEls.forEach((step, i) => {
          const num = step.querySelector('.step-num');
          const content = step.querySelector('.step-content');

          gsap.from(num, {
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: 0.5 + i * 0.15,
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 75%',
            },
          });

          gsap.from(content, {
            opacity: 0,
            yPercent: 20,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.5 + i * 0.15,
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 75%',
            },
          });
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="hiw-header text-center">
          <span className="text-[11px] font-bold text-bc-accent uppercase tracking-[0.15em]">
            GET STARTED IN MINUTES
          </span>
          <h2 className="font-display text-[28px] md:text-[36px] lg:text-[48px] font-bold mt-4 leading-tight">
            <span className="text-bc-text">How It</span>{' '}
            <span className="text-bc-accent">Works</span>
          </h2>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative mt-20">
          {/* Connecting line - desktop */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-[2px] bg-bc-surface-light"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="step-item flex flex-col items-center text-center"
                >
                  <div className="step-num relative z-10 w-12 h-12 rounded-full bg-bc-accent text-white font-display text-xl font-bold flex items-center justify-center shadow-glow hover:scale-110 hover:shadow-glow-strong transition-all duration-300">
                    {step.number}
                  </div>
                  <div className="step-content mt-6">
                    <Icon className="w-8 h-8 text-bc-accent mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-bc-text mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-bc-text-secondary max-w-[240px] mx-auto leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
