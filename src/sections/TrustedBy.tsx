import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap,
  Database,
  Cloud,
  Rocket,
  Activity,
  Workflow,
  Orbit,
  Triangle,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const companies = [
  { name: 'TechFlow', icon: Zap },
  { name: 'DataVerse', icon: Database },
  { name: 'CloudNine', icon: Cloud },
  { name: 'NexGen', icon: Rocket },
  { name: 'PulseAI', icon: Activity },
  { name: 'StreamLine', icon: Workflow },
  { name: 'Orbital', icon: Orbit },
  { name: 'Vertex', icon: Triangle },
];

export default function TrustedBy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        yPercent: 10,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 border-t border-b border-bc-border/50"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-center text-[13px] text-bc-text-muted mb-10">
          Trusted by innovative teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {companies.map((company) => {
            const Icon = company.icon;
            return (
              <div
                key={company.name}
                className="flex items-center gap-2 text-bc-text-muted/50 hover:text-bc-text-muted/80 transition-opacity duration-300"
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium tracking-wide">
                  {company.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
