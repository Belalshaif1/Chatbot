import { useState } from 'react';
import {
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Simulated data helpers
const generateLast7Days = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    conversations: Math.floor(Math.random() * 200) + 50,
    resolved: Math.floor(Math.random() * 150) + 30,
  }));
};

const topQuestions = [
  { question: 'What are your pricing plans?', count: 342, resolved: true },
  { question: 'How do I cancel my subscription?', count: 218, resolved: true },
  { question: 'Do you offer a free trial?', count: 197, resolved: false },
  { question: 'What payment methods do you accept?', count: 156, resolved: true },
  { question: 'How to integrate the chat widget?', count: 143, resolved: true },
  { question: 'Is my data secure?', count: 98, resolved: false },
];

const recentConversations = [
  { id: 'c1', user: 'User #4821', preview: 'What are your shipping options?', time: '2m ago', resolved: true, messages: 5, sentiment: 'positive' },
  { id: 'c2', user: 'User #3190', preview: 'I need help with my refund', time: '8m ago', resolved: false, messages: 3, sentiment: 'negative' },
  { id: 'c3', user: 'User #5521', preview: 'How do I connect to Slack?', time: '15m ago', resolved: true, messages: 8, sentiment: 'positive' },
  { id: 'c4', user: 'User #2048', preview: 'Is there an API available?', time: '32m ago', resolved: true, messages: 4, sentiment: 'neutral' },
  { id: 'c5', user: 'User #9012', preview: 'Can you speak Arabic?', time: '1h ago', resolved: false, messages: 2, sentiment: 'neutral' },
  { id: 'c6', user: 'User #1337', preview: 'Thanks, you were very helpful!', time: '2h ago', resolved: true, messages: 12, sentiment: 'positive' },
];

const chartData = generateLast7Days();
const maxVal = Math.max(...chartData.map((d) => d.conversations));

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [searchConvo, setSearchConvo] = useState('');

  const filteredConvos = recentConversations.filter(
    (c) =>
      c.preview.toLowerCase().includes(searchConvo.toLowerCase()) ||
      c.user.toLowerCase().includes(searchConvo.toLowerCase())
  );

  const stats = [
    {
      label: 'Total Conversations',
      value: '1,284',
      change: '+12.5%',
      up: true,
      icon: MessageSquare,
      color: 'text-bc-accent',
      bg: 'bg-bc-accent/10',
    },
    {
      label: 'Resolution Rate',
      value: '78%',
      change: '+3.2%',
      up: true,
      icon: ThumbsUp,
      color: 'text-bc-success',
      bg: 'bg-bc-success/10',
    },
    {
      label: 'Avg. Response Time',
      value: '1.2s',
      change: '-0.3s',
      up: true,
      icon: Clock,
      color: 'text-bc-warning',
      bg: 'bg-bc-warning/10',
    },
    {
      label: 'Unanswered',
      value: '47',
      change: '-8',
      up: true,
      icon: AlertCircle,
      color: 'text-bc-error',
      bg: 'bg-bc-error/10',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-bc-text-secondary">Performance overview for your chatbots</p>
        <div className="flex gap-1 p-1 bg-bc-surface-light border border-bc-border rounded-lg">
          {['24h', '7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${timeRange === r
                  ? 'bg-bc-surface text-bc-text shadow-sm'
                  : 'text-bc-text-muted hover:text-bc-text-secondary'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-bc-surface border border-bc-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${stat.up ? 'bg-bc-success/10 text-bc-success' : 'bg-bc-error/10 text-bc-error'
                  }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-bc-text">{stat.value}</p>
              <p className="text-[12px] text-bc-text-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Chart */}
        <div className="lg:col-span-2 bg-bc-surface border border-bc-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-bc-text">Conversations Over Time</h3>
              <p className="text-[12px] text-bc-text-muted mt-0.5">Daily conversation volume</p>
            </div>
            <TrendingUp className="w-4 h-4 text-bc-accent" />
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-40">
            {chartData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative flex flex-col justify-end" style={{ height: '128px' }}>
                  {/* Resolved bar */}
                  <div
                    className="w-full rounded-t-sm bg-bc-success/30 absolute bottom-0"
                    style={{ height: `${(d.resolved / maxVal) * 100}%` }}
                  />
                  {/* Total bar */}
                  <div
                    className="w-full rounded-t-md bg-bc-accent absolute bottom-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ height: `${(d.conversations / maxVal) * 85}%` }}
                    title={`${d.conversations} conversations`}
                  />
                </div>
                <span className="text-[10px] text-bc-text-muted">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-bc-accent opacity-80" />
              <span className="text-[11px] text-bc-text-muted">Total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-bc-success/40" />
              <span className="text-[11px] text-bc-text-muted">Resolved</span>
            </div>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-bc-text mb-1">User Satisfaction</h3>
          <p className="text-[12px] text-bc-text-muted mb-6">Based on thumbs up/down</p>
          {/* Donut Chart (CSS) */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1a1a2e" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.915" fill="none"
                  stroke="#10B981" strokeWidth="3"
                  strokeDasharray="72 28"
                  strokeLinecap="round"
                />
                <circle
                  cx="18" cy="18" r="15.915" fill="none"
                  stroke="#2E5BFF" strokeWidth="3"
                  strokeDasharray="15 85"
                  strokeDashoffset="-72"
                  strokeLinecap="round"
                />
                <circle
                  cx="18" cy="18" r="15.915" fill="none"
                  stroke="#EF4444" strokeWidth="3"
                  strokeDasharray="13 87"
                  strokeDashoffset="-87"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-bc-text">72%</span>
                <span className="text-[10px] text-bc-text-muted">Positive</span>
              </div>
            </div>
            <div className="space-y-2 mt-6 w-full">
              {[
                { label: 'Positive 👍', value: 72, color: 'bg-bc-success' },
                { label: 'Neutral 😐', value: 15, color: 'bg-bc-accent' },
                { label: 'Negative 👎', value: 13, color: 'bg-bc-error' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-bc-text-secondary">{item.label}</span>
                    <span className="text-[12px] font-semibold text-bc-text">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-bc-surface-light rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Questions */}
      <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-bc-text mb-5">Top Questions Asked</h3>
        <div className="space-y-3">
          {topQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-[12px] font-bold text-bc-text-muted w-5 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] text-bc-text truncate">{q.question}</p>
                  {!q.resolved && (
                    <span className="shrink-0 text-[10px] font-semibold text-bc-warning bg-bc-warning/10 px-1.5 py-0.5 rounded-full">
                      Unanswered
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-bc-surface-light rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${q.resolved ? 'bg-bc-accent' : 'bg-bc-warning'}`}
                    style={{ width: `${(q.count / topQuestions[0].count) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-[12px] font-semibold text-bc-text shrink-0">{q.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversations Log */}
      <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-bc-text">Recent Conversations</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-bc-text-muted" />
            <Input
              placeholder="Search conversations..."
              value={searchConvo}
              onChange={(e) => setSearchConvo(e.target.value)}
              className="pl-9 bg-bc-surface-light border-bc-border text-bc-text text-[12px] placeholder:text-bc-text-muted h-8 w-52"
            />
          </div>
        </div>
        <div className="divide-y divide-bc-border-subtle">
          {filteredConvos.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center gap-4 py-3 hover:bg-bc-surface-light/50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-bc-surface-light flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-bc-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-bc-text">{conv.user}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${conv.sentiment === 'positive'
                      ? 'bg-bc-success/10 text-bc-success'
                      : conv.sentiment === 'negative'
                        ? 'bg-bc-error/10 text-bc-error'
                        : 'bg-bc-surface-elevated text-bc-text-muted'
                    }`}>
                    {conv.sentiment === 'positive' ? '👍' : conv.sentiment === 'negative' ? '👎' : '😐'}
                  </span>
                </div>
                <p className="text-[12px] text-bc-text-muted truncate">{conv.preview}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-bc-text-muted">{conv.time}</p>
                <span className={`text-[10px] font-semibold ${conv.resolved ? 'text-bc-success' : 'text-bc-warning'}`}>
                  {conv.resolved ? 'Resolved' : 'Open'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
