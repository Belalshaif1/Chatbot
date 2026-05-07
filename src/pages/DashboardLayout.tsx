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
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const globalNavItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Plus, label: 'Create Bot', href: '/dashboard/create' },
  { icon: MessageSquare, label: 'Conversations', href: '/dashboard/chat' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Database, label: 'Data Sources', href: '/dashboard/sources' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const getBotNavItems = (botId: string) => [
  { icon: MessageSquare, label: 'Playground', href: `/dashboard/bot/${botId}` },
  { icon: Database, label: 'Data Sources', href: `/dashboard/sources` },
  { icon: BarChart3, label: 'Analytics', href: `/dashboard/analytics` },
  { icon: Share2, label: 'Connect', href: `/dashboard/bot/${botId}?tab=embed` },
  { icon: Settings, label: 'Settings', href: `/dashboard/settings` },
];

const getPageTitle = (pathname: string, botId?: string) => {
  if (botId) return 'Manage Chatbot';
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/dashboard/create':
      return 'Create Chatbot';
    case '/dashboard/chat':
      return 'Conversations';
    case '/dashboard/analytics':
      return 'Analytics';
    case '/dashboard/sources':
      return 'Data Sources';
    case '/dashboard/settings':
      return 'Settings';
    default:
      return 'Dashboard';
  }
};

import { useUser } from '@/context/UserContext';

import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const { user, isAdmin, setAdminMode } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { botId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const pageTitle = getPageTitle(location.pathname, botId);

  const navItems = botId ? getBotNavItems(botId) : globalNavItems;

  return (
    <div className="min-h-screen bg-bc-bg">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[260px] bg-bc-surface border-r border-bc-border flex-col z-40">
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
                className="flex items-center gap-3 px-4 py-2.5 mb-4 rounded-lg text-sm font-medium text-bc-accent bg-bc-accent/10 border border-bc-accent/20 hover:bg-bc-accent/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
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
                      ? 'bg-bc-surface-light text-bc-accent border-l-[3px] border-bc-accent'
                      : 'text-bc-text-secondary hover:bg-bc-surface-elevated hover:text-bc-text'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User card */}
        <div className="p-4 border-t border-bc-border">
          <div className="group relative flex items-center gap-3 p-3 rounded-lg bg-bc-surface-light hover:bg-bc-surface-elevated transition-colors cursor-pointer" onClick={() => !isAdmin && setAdminMode()}>
            <div className={`w-9 h-9 rounded-full ${isAdmin ? 'bg-bc-accent' : 'bg-bc-accent/20'} flex items-center justify-center transition-colors`}>
              <span className={`text-xs font-bold ${isAdmin ? 'text-white' : 'text-bc-accent'}`}>
                {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-bc-text truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className={`text-[11px] font-semibold ${isAdmin ? 'text-bc-accent' : 'text-bc-text-muted'}`}>
                {isAdmin ? 'ADMIN ACCESS' : 'Pro Plan'}
              </p>
            </div>
            {!isAdmin && (
              <div className="absolute inset-0 bg-bc-accent/80 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Click for Admin Mode</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-bc-surface border-r border-bc-border flex-col z-50 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <Hexagon className="w-6 h-6 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
            <span className="font-display text-lg font-bold text-bc-text">
              BotCraft<span className="text-bc-accent">AI</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-bc-text-secondary" />
          </button>
        </div>
        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1">
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
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-bc-surface-light text-bc-accent border-l-[3px] border-bc-accent'
                      : 'text-bc-text-secondary hover:bg-bc-surface-elevated hover:text-bc-text'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-bc-bg/90 backdrop-blur-xl border-b border-bc-border flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-bc-text-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-bc-text">{pageTitle}</h1>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-bc-text-muted">
                <Link to="/dashboard" className="hover:text-bc-text-secondary">Dashboard</Link>
                {location.pathname !== '/dashboard' && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-bc-text-secondary">{pageTitle}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-lg hover:bg-bc-surface-elevated flex items-center justify-center text-bc-text-secondary transition-colors">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="relative w-10 h-10 rounded-lg hover:bg-bc-surface-elevated flex items-center justify-center text-bc-text-secondary transition-colors">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-bc-error" />
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
              className={`flex flex-col items-center gap-1 py-2 px-3 ${
                isActive ? 'text-bc-accent' : 'text-bc-text-muted'
              }`}
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
