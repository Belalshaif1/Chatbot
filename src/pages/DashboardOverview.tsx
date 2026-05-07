import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  Bot,
  MessageSquare,
  Clock,
  Zap,
  Edit,
  Eye,
  MoreVertical,
  Sparkles,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const stats = [
  {
    label: 'TOTAL BOTS',
    value: 3,
    change: '+1 this week',
    changeType: 'positive' as const,
    icon: Bot,
  },
  {
    label: 'MESSAGES THIS MONTH',
    value: 1247,
    change: '+23% vs last month',
    changeType: 'positive' as const,
    icon: MessageSquare,
    progress: 62,
  },
  {
    label: 'ACTIVE CONVERSATIONS',
    value: 18,
    change: '5 waiting',
    changeType: 'warning' as const,
    icon: Clock,
  },
  {
    label: 'AVG. RESPONSE TIME',
    value: '1.2s',
    change: '-0.3s improvement',
    changeType: 'positive' as const,
    icon: Zap,
  },
];


const activities = [
  {
    icon: MessageSquare,
    text: 'New conversation on Sales Assistant',
    time: '2 min ago',
    color: 'text-bc-accent',
    bg: 'bg-bc-accent/15',
  },
  {
    icon: Zap,
    text: 'Data source synced for Support Bot',
    time: '15 min ago',
    color: 'text-bc-success',
    bg: 'bg-bc-success/15',
  },
  {
    icon: Bot,
    text: 'Switched FAQ Helper to Gemini Pro',
    time: '1 hour ago',
    color: 'text-purple-400',
    bg: 'bg-purple-400/15',
  },
  {
    icon: Sparkles,
    text: 'Updated welcome message settings',
    time: '3 hours ago',
    color: 'text-amber-400',
    bg: 'bg-amber-400/15',
  },
];

const tips = [
  'Add more data sources for better answers',
  'Customize your bot\'s tone in Settings',
  'Connect WhatsApp for wider reach',
];

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

import { useBots } from '@/context/BotContext';
import { useUser } from '@/context/UserContext';

export default function DashboardOverview() {
  const { bots } = useBots();
  const { isAdmin } = useUser();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.querySelectorAll('.stat-card');
      gsap.from(cards, {
        opacity: 0,
        yPercent: 15,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
      });

      const cols = cardsRef.current!.querySelectorAll('.dash-col');
      gsap.from(cols, {
        opacity: 0,
        yPercent: 20,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.3,
      });
    }, cardsRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardsRef} className="space-y-6">
      <div className="flex items-center gap-3">
        <p className="text-bc-text-secondary">Welcome back, overview of your chatbots</p>
        {isAdmin && (
          <span className="bg-bc-accent/10 text-bc-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-bc-accent/20">
            ADMIN VIEW
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const TrendIcon =
            stat.changeType === 'positive'
              ? TrendingUp
              : stat.changeType === 'warning'
                ? AlertCircle
                : TrendingDown;
          return (
            <div
              key={stat.label}
              className="stat-card bg-bc-surface border border-bc-border rounded-xl p-5"
            >
              <p className="text-[11px] font-medium text-bc-text-muted uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="font-display text-[28px] font-bold text-bc-text mt-2">
                {typeof stat.value === 'number' ? (
                  <AnimatedNumber value={stat.value} />
                ) : (
                  stat.value
                )}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendIcon
                  className={`w-3.5 h-3.5 ${
                    stat.changeType === 'positive'
                      ? 'text-bc-success'
                      : stat.changeType === 'warning'
                        ? 'text-bc-warning'
                        : 'text-bc-error'
                  }`}
                />
                <span
                  className={`text-[12px] ${
                    stat.changeType === 'positive'
                      ? 'text-bc-success'
                      : stat.changeType === 'warning'
                        ? 'text-bc-warning'
                        : 'text-bc-error'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              {stat.progress && (
                <Progress value={stat.progress} className="h-1 mt-3 bg-bc-surface-light" />
              )}
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chatbots list */}
        <div className="lg:col-span-2 dash-col bg-bc-surface border border-bc-border rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-bc-border">
            <h3 className="text-base font-semibold text-bc-text">Your Chatbots</h3>
            <Link to="/dashboard/create">
              <Button
                size="sm"
                className="bg-bc-accent hover:bg-bc-accent-hover text-white text-[12px] gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                New Bot
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-bc-border-subtle">
            {bots.map((bot) => (
              <Link
                key={bot.id}
                to={`/dashboard/bot/${bot.id}`}
                className="flex items-center gap-4 p-4 hover:bg-bc-surface-elevated/50 transition-colors border-b border-bc-border-subtle last:border-0"
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${bot.gradient} flex items-center justify-center shrink-0`}
                >
                  <span className="text-xs font-bold text-white">{bot.initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-bc-text truncate">
                    {bot.name}
                  </p>
                  <p className="text-[11px] text-bc-text-muted">{bot.model}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 text-[11px] ${
                      bot.status === 'live' ? 'text-bc-success' : 'text-bc-warning'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        bot.status === 'live' ? 'bg-bc-success' : 'bg-bc-warning'
                      }`}
                    />
                    {bot.status === 'live' ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="text-[11px] text-bc-text-muted hidden sm:block">
                  {bot.conversations.toLocaleString()} conversations
                </p>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="dash-col bg-bc-surface border border-bc-border rounded-xl">
            <div className="p-5 border-b border-bc-border">
              <h3 className="text-base font-semibold text-bc-text">
                Recent Activity
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {activities.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${activity.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-bc-text leading-snug">
                        {activity.text}
                      </p>
                      <p className="text-[11px] text-bc-text-muted mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="dash-col bg-bc-surface border border-bc-border rounded-xl">
            <div className="p-5 border-b border-bc-border">
              <h3 className="text-base font-semibold text-bc-text">Quick Tips</h3>
            </div>
            <div className="p-4 space-y-3">
              {tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 border-l-2 border-bc-accent pl-3"
                >
                  <Sparkles className="w-3.5 h-3.5 text-bc-accent shrink-0 mt-0.5" />
                  <p className="text-[13px] text-bc-text-secondary">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
