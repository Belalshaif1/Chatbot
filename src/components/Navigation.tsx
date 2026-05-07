import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/#hero' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Docs', href: '/dashboard' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && isHome) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-bc-bg/90 backdrop-blur-xl border-b border-bc-border'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Hexagon className="w-7 h-7 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
          <span className="font-display text-xl font-bold text-bc-text">
            BotCraft<span className="text-bc-accent">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[15px] font-medium text-bc-text-secondary hover:text-bc-text transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-bc-accent transition-all duration-250 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-bc-text-secondary hover:text-bc-text text-[13px] font-medium"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/dashboard/create">
            <Button className="bg-bc-accent hover:bg-bc-accent-hover text-white text-[13px] font-medium px-6 rounded-[10px] transition-all duration-200 hover:shadow-glow">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-bc-text p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-bc-bg/95 backdrop-blur-xl border-b border-bc-border md:hidden">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[15px] font-medium text-bc-text-secondary hover:text-bc-text py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-bc-border">
              <Link to="/login">
                <Button variant="ghost" className="w-full text-bc-text-secondary">
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard/create">
                <Button className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
