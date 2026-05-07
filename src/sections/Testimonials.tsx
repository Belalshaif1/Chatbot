import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "BotCraft AI reduced our support ticket volume by 73% in the first month. Our customers get instant answers, and our team can focus on complex issues. The setup took literally 10 minutes.",
    author: 'Sarah Chen',
    role: 'Head of Support at TechFlow',
    initials: 'SC',
    avatarColor: 'bg-gradient-to-br from-bc-accent to-purple-600',
    rating: 5,
  },
  {
    quote:
      "We trained the bot on our 200-page product documentation. Now it answers technical questions more accurately than our senior engineers. The multi-model switching is a game-changer.",
    author: 'Marcus Johnson',
    role: 'CTO at DataVerse',
    initials: 'MJ',
    avatarColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    rating: 5,
  },
  {
    quote:
      "The WhatsApp integration helped us reach customers in markets where email doesn't work. BotCraft handles 5,000+ conversations daily across 3 languages without breaking a sweat.",
    author: 'Elena Rodriguez',
    role: 'VP Operations at CloudNine',
    initials: 'ER',
    avatarColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonials-header', {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      const cards = sectionRef.current?.querySelectorAll('.testimonial-card');
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          yPercent: 25,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
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
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-[120px]"
      style={{
        background:
          'linear-gradient(180deg, #0D1219 0%, #060B14 100%)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="testimonials-header text-center">
          <span className="text-[11px] font-bold text-bc-accent uppercase tracking-[0.15em]">
            CUSTOMER STORIES
          </span>
          <h2 className="font-display text-[28px] md:text-[36px] lg:text-[48px] font-bold mt-4 leading-tight">
            <span className="text-bc-text">Loved by Teams</span>{' '}
            <span className="text-bc-accent">Worldwide</span>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="testimonial-card relative bg-bc-surface-elevated border border-bc-border rounded-2xl p-8 hover:border-bc-accent/25 hover:-translate-y-[3px] transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 left-6 w-10 h-10 text-bc-accent/10" />

              {/* Stars */}
              <div className="flex gap-1 mb-4 relative z-10">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-bc-text italic leading-relaxed relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px bg-bc-border my-6" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className={`w-12 h-12 ${t.avatarColor}`}>
                  <AvatarFallback className="text-white font-semibold text-sm">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[15px] font-semibold text-bc-text">
                    {t.author}
                  </p>
                  <p className="text-[13px] text-bc-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
