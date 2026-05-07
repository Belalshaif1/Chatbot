import { Link } from 'react-router-dom';
import { Hexagon, Twitter, Linkedin, Github, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const productLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Create Bot', href: '/dashboard/create' },
  { label: 'Analytics', href: '/dashboard/analytics' },
  { label: 'Integrations', href: '/dashboard/settings' },
];

const resourceLinks = [
  { label: 'Documentation', href: '/dashboard' },
  { label: 'Tutorials', href: '/dashboard' },
  { label: 'Blog', href: '/' },
  { label: 'Changelog', href: '/' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-bc-surface border-t border-bc-border">
      <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <Hexagon className="w-6 h-6 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
              <span className="font-display text-lg font-bold text-bc-text">
                BotCraft<span className="text-bc-accent">AI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-bc-text-secondary max-w-[280px]">
              Build AI chatbots that understand your business. Train, deploy, and scale in minutes.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {[Twitter, Linkedin, Github, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-bc-surface-light border border-bc-border flex items-center justify-center text-bc-text-muted hover:text-bc-accent hover:border-bc-accent/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[13px] font-semibold text-bc-text uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-bc-text-secondary hover:text-bc-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[13px] font-semibold text-bc-text uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[13px] text-bc-text-secondary hover:text-bc-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[13px] font-semibold text-bc-text uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-[13px] text-bc-text-muted mb-3">
              Get the latest features and updates.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Email address"
                className="bg-bc-surface-light border-bc-border text-[13px] h-9 placeholder:text-bc-text-muted"
              />
              <Button className="bg-bc-accent hover:bg-bc-accent-hover text-white text-[13px] h-9 px-3 shrink-0">
                Subscribe
              </Button>
            </div>
            <p className="text-[11px] text-bc-text-muted mt-2">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-bc-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-bc-text-muted">
            BotCraft AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[12px] text-bc-text-muted hover:text-bc-text-secondary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
