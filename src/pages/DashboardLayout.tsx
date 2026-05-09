import { useState } from 'react';
import {
  Hexagon,
  LayoutDashboard,
  Plus,
  MessageSquare,
  BarChart3,
  Database,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  Share2,
  Shield,
  LogOut,
  Languages,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/UserContext';
import { useLang } from '@/context/LangContext';
import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const { currentUser, isSuperAdmin, logout } = useAuth();
  const { lang, setLang, t, isRTL } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const { botId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const getPageTitle = () => {
    if (botId) return t.titles.manageBot;
    switch (location.pathname) {
      case '/dashboard': return t.titles.dashboard;
      case '/dashboard/create': return t.titles.createBot;
      case '/dashboard/chat': return t.titles.conversations;
      case '/dashboard/analytics': return t.titles.analytics;
      case '/dashboard/sources': return t.titles.dataSources;
      case '/dashboard/settings': return t.titles.settings;
      case '/dashboard/admin': return t.titles.adminPanel;
      default: return t.titles.dashboard;
    }
  };

  const globalNavItems = [
    { icon: LayoutDashboard, label: t.nav.overview, href: '/dashboard' },
    { icon: Plus, label: t.nav.createBot, href: '/dashboard/create' },
    { icon: MessageSquare, label: t.nav.conversations, href: '/dashboard/chat' },
    { icon: BarChart3, label: t.nav.analytics, href: '/dashboard/analytics' },
    { icon: Database, label: t.nav.dataSources, href: '/dashboard/sources' },
    { icon: Settings, label: t.nav.settings, href: '/dashboard/settings' },
  ];

  const getBotNavItems = (id: string) => [
    { icon: MessageSquare, label: t.nav.playground, href: `/dashboard/bot/${id}` },
    { icon: Database, label: t.nav.dataSources, href: `/dashboard/sources` },
    { icon: BarChart3, label: t.nav.analytics, href: `/dashboard/analytics` },
    { icon: Share2, label: t.nav.connect, href: `/dashboard/bot/${id}?tab=embed` },
    { icon: Settings, label: t.nav.settings, href: `/dashboard/settings` },
  ];

  const navItems = botId ? getBotNavItems(botId) : globalNavItems;
  const pageTitle = getPageTitle();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <Hexagon className="w-6 h-6 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
          <span className="font-display text-lg font-bold text-bc-text">
            BotCraft<span className="text-bc-accent">AI</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1">
          {botId && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-2.5 mb-4 rounded-lg text-sm font-medium text-bc-accent bg-bc-accent/10 border border-bc-accent/20 hover:bg-bc-accent/20 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t.nav.backToDashboard}
            </Link>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `bg-bc-surface-light text-bc-accent ${isRTL ? 'border-r-[3px]' : 'border-l-[3px]'} border-bc-accent`
                    : 'text-bc-text-secondary hover:bg-bc-surface-elevated hover:text-bc-text'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {/* Admin Panel link — superadmin only */}
          {isSuperAdmin && !botId && (
            <div className="pt-4 mt-4 border-t border-bc-border-subtle">
              <Link
                to="/dashboard/admin"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/dashboard/admin'
                    ? `bg-amber-500/10 text-amber-400 ${isRTL ? 'border-r-[3px]' : 'border-l-[3px]'} border-amber-500`
                    : 'text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-400'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Shield className="w-[18px] h-[18px]" />
                {t.nav.adminPanel}
              </Link>
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Language Toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] font-medium text-bc-text-muted hover:bg-bc-surface-light hover:text-bc-text transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Languages className="w-4 h-4" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          <span className="ml-auto mr-0 text-[10px] bg-bc-surface-light px-1.5 py-0.5 rounded font-bold uppercase">
            {lang === 'en' ? 'AR' : 'EN'}
          </span>
        </button>
      </div>

      {/* User card */}
      <div className="p-4 border-t border-bc-border space-y-2">
        <div className={`flex items-center gap-3 p-3 rounded-lg bg-bc-surface-light ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <div className={`w-9 h-9 rounded-full ${isSuperAdmin ? 'bg-amber-500' : 'bg-bc-accent/20'} flex items-center justify-center shrink-0`}>
            <span className={`text-xs font-bold ${isSuperAdmin ? 'text-white' : 'text-bc-accent'}`}>
              {currentUser.avatarInitials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-bc-text truncate">{currentUser.name}</p>
            <p className={`text-[11px] font-semibold ${isSuperAdmin ? 'text-amber-400' : 'text-bc-text-muted'}`}>
              {isSuperAdmin ? t.nav.superadmin : `${currentUser.plan?.toUpperCase()} PLAN`}
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] text-bc-text-muted hover:text-bc-error hover:bg-bc-error/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <LogOut className="w-4 h-4" />
          {t.common.signOut}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-bc-bg">
      {/* Sidebar - desktop */}
      <aside className={`hidden lg:flex fixed top-0 h-full w-[260px] bg-bc-surface border-bc-border flex-col z-40 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 h-full w-[260px] bg-bc-surface border-bc-border flex flex-col z-50 lg:hidden transition-transform duration-300 ${
          isRTL ? 'right-0 border-l' : 'left-0 border-r'
        } ${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}`}
      >
        <div className={`p-4 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-bc-text-secondary" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className={isRTL ? 'lg:mr-[260px]' : 'lg:ml-[260px]'}>
        {/* Top bar */}
        <header className={`sticky top-0 z-30 h-16 bg-bc-bg/90 backdrop-blur-xl border-b border-bc-border flex items-center justify-between px-4 lg:px-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button className="lg:hidden p-2 text-bc-text-secondary" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-lg font-semibold text-bc-text">{pageTitle}</h1>
              <div className={`hidden sm:flex items-center gap-1 text-[11px] text-bc-text-muted ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Link to="/dashboard" className="hover:text-bc-text-secondary">{t.titles.dashboard}</Link>
                {location.pathname !== '/dashboard' && (
                  <>
                    <ChevronRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                    <span className="text-bc-text-secondary">{pageTitle}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button className="w-10 h-10 rounded-lg hover:bg-bc-surface-elevated flex items-center justify-center text-bc-text-secondary transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="relative w-10 h-10 rounded-lg hover:bg-bc-surface-elevated flex items-center justify-center text-bc-text-secondary transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              <span className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} w-1.5 h-1.5 rounded-full bg-bc-error`} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bc-surface border-t border-bc-border z-30 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 ${isActive ? 'text-bc-accent' : 'text-bc-text-muted'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
