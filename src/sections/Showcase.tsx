import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Database,
  MessageCircle,
  Smartphone,
  Share2,
  Link,
  Code,
  CheckCircle2,
  Bot,
  Send,
  User,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.showcase-header', {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });

      if (widgetRef.current) {
        gsap.from(widgetRef.current, {
          opacity: 0,
          yPercent: 30,
          scale: 0.95,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: widgetRef.current,
            start: 'top 80%',
          },
        });
      }

      if (floatingRef.current) {
        const items = floatingRef.current.querySelectorAll('.float-item');
        gsap.from(items, {
          opacity: 0,
          yPercent: 20,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: floatingRef.current,
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-20 md:py-[120px] overflow-hidden">
      {/* Background grid effect */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 91, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 91, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="showcase-header text-center">
          <span className="text-[11px] font-bold text-bc-accent uppercase tracking-[0.15em]">
            SEE IT IN ACTION
          </span>
          <h2 className="font-display text-[28px] md:text-[36px] lg:text-[48px] font-bold mt-4 leading-tight">
            <span className="text-bc-text">Your AI Assistant,</span>
            <br />
            <span className="text-bc-accent">Live on Your Site</span>
          </h2>
        </div>

        {/* Showcase area */}
        <div
          ref={floatingRef}
          className="relative mt-16 flex justify-center items-center min-h-[500px] md:min-h-[600px]"
        >
          {/* Floating elements */}
          <div className="float-item absolute top-4 left-4 md:top-8 md:left-12 bg-bc-surface-elevated border border-bc-border rounded-xl px-4 py-3 animate-float z-20">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-bc-accent" />
              <span className="text-[12px] text-bc-text-secondary">
                12 data sources connected
              </span>
            </div>
          </div>

          <div
            className="float-item absolute top-8 right-4 md:top-12 md:right-16 bg-bc-surface-elevated border border-bc-border rounded-xl p-4 animate-float z-20"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex items-end gap-2 h-10">
              {[0.4, 0.7, 1, 0.6].map((h, i) => (
                <div
                  key={i}
                  className="w-3 rounded-sm bg-bc-accent"
                  style={{ height: `${h * 100}%`, opacity: 0.5 + i * 0.15 }}
                />
              ))}
            </div>
            <p className="text-[11px] text-bc-text-secondary mt-2">
              2,847 conversations this week
            </p>
          </div>

          <div
            className="float-item absolute bottom-16 left-4 md:bottom-24 md:left-8 flex gap-2 animate-float z-20"
            style={{ animationDelay: '2s' }}
          >
            {[MessageCircle, Smartphone, Share2, Link, Code].map((Icon, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-bc-surface-light border border-bc-border flex items-center justify-center"
              >
                <Icon className="w-4 h-4 text-bc-text-secondary" />
              </div>
            ))}
          </div>

          <div
            className="float-item absolute bottom-8 right-4 md:bottom-16 md:right-12 bg-bc-surface-elevated border border-bc-border rounded-xl px-4 py-3 animate-float z-20"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-bc-success" />
              <span className="text-[12px] text-bc-text-secondary">
                99.7% uptime
              </span>
            </div>
          </div>

          {/* Chat Widget Mockup */}
          <div
            ref={widgetRef}
            className="relative w-[340px] md:w-[420px] bg-bc-surface border border-bc-border rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden z-10"
          >
            {/* Widget header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-bc-border">
              <div className="w-9 h-9 rounded-xl bg-bc-accent/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-bc-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-bc-text">
                  BotCraft Assistant
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-bc-success" />
                  <span className="text-[11px] text-bc-text-muted">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="px-4 py-5 space-y-4 min-h-[280px]">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-bc-surface-light rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm text-bc-text">
                    What&apos;s your refund policy?
                  </p>
                  <span className="text-[10px] text-bc-text-muted mt-1 block">
                    10:23 AM
                  </span>
                </div>
              </div>

              {/* Bot message */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-bc-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-bc-accent" />
                </div>
                <div className="max-w-[85%]">
                  <div className="bg-bc-surface-elevated border border-bc-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-bc-text leading-relaxed">
                      Our refund policy is simple and customer-friendly:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {[
                        'Full refund within 30 days',
                        'No questions asked',
                        'Processed within 5 business days',
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-bc-text-secondary"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-bc-success shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-bc-text mt-3">
                      Would you like me to process a return for you?
                    </p>
                  </div>
                  <span className="text-[10px] text-bc-text-muted mt-1 block">
                    10:23 AM
                  </span>
                </div>
              </div>

              {/* User reply */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-bc-surface-light rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm text-bc-text">
                    Yes please! Order #2847
                  </p>
                  <span className="text-[10px] text-bc-text-muted mt-1 block">
                    10:24 AM
                  </span>
                </div>
              </div>

              {/* Bot processing */}
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-bc-accent/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-bc-accent" />
                </div>
                <div className="bg-bc-surface-elevated border border-bc-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-bc-accent animate-typing-dot" />
                    <div
                      className="w-2 h-2 rounded-full bg-bc-accent animate-typing-dot"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-bc-accent animate-typing-dot"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-bc-border">
              <div className="flex items-center gap-2 bg-bc-surface-light border border-bc-border rounded-xl px-4 py-2.5">
                <User className="w-4 h-4 text-bc-text-muted shrink-0" />
                <span className="text-sm text-bc-text-muted flex-1">
                  Type your message...
                </span>
                <div className="w-8 h-8 rounded-lg bg-bc-accent flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
