import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-headline', {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
      gsap.from('.cta-desc', {
        opacity: 0,
        yPercent: 15,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
      gsap.from('.cta-btn', {
        opacity: 0,
        yPercent: 10,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;

    let animationId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      c.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    interface Particle {
      x: number;
      y: number;
      r: number;
      speed: number;
      opacity: number;
      color: string;
      wobble: number;
    }

    const particles: Particle[] = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random(),
        speed: 0.2 + Math.random() * 0.3,
        opacity: 0.3 + Math.random() * 0.4,
        color: Math.random() > 0.5 ? '#2E5BFF' : '#ffffff',
        wobble: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      c!.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.wobble += 0.01;
        p.x += Math.sin(p.wobble) * 0.3;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        const fadeStart = h * 0.85;
        let op = p.opacity;
        if (p.y > fadeStart) op *= (h - p.y) / (h - fadeStart);
        if (p.y < h * 0.1) op *= p.y / (h * 0.1);

        c!.beginPath();
        c!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c!.fillStyle =
          p.color === '#2E5BFF'
            ? `rgba(46, 91, 255, ${op})`
            : `rgba(255, 255, 255, ${op})`;
        c!.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-[100px] overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0D1B3E 0%, #131B26 50%, #1A0B2E 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />
      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
        <h2 className="cta-headline font-display text-[28px] md:text-[36px] lg:text-[48px] font-bold text-bc-text leading-tight">
          Ready to Transform Your Customer Experience?
        </h2>
        <p className="cta-desc mt-4 text-lg text-bc-text-secondary">
          Join 10,000+ businesses using BotCraft AI to deliver instant,
          intelligent support.
        </p>
        <Link to="/dashboard/create" className="inline-block mt-8">
          <Button className="cta-btn bg-bc-accent hover:bg-bc-accent-hover text-white text-base font-semibold px-10 py-6 rounded-[10px] transition-all duration-300 hover:scale-[1.03] hover:shadow-glow-strong">
            Start Building Free — No Credit Card Required
          </Button>
        </Link>
        <p className="text-[13px] text-bc-text-muted mt-4">
          Setup takes less than 5 minutes
        </p>
      </div>
    </section>
  );
}
