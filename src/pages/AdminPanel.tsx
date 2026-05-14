import { useState } from 'react';
import {
  Users,
  Bot,
  Shield,
  Search,
  MoreVertical,
  UserX,
  UserCheck,
  Trash2,
  Crown,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/UserContext';
import { useBots } from '@/context/BotContext';
import { useLang } from '@/context/LangContext';
import { Link } from 'react-router-dom';

const PLANS = ['free', 'pro', 'enterprise'] as const;

export default function AdminPanel() {
  const { allUsers, isSuperAdmin, suspendUser, activateUser, deleteUser, updateUserPlan, updateUserRole } = useAuth();
  const { allBots, suspendBot, activateBot, deleteBot } = useBots();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bots'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [botSearch, setBotSearch] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Shield className="w-16 h-16 text-bc-error/50 mb-4" />
        <h2 className="text-xl font-bold text-bc-text">{t.admin.accessDenied}</h2>
        <p className="text-bc-text-muted mt-2">{t.admin.accessDeniedDesc}</p>
      </div>
    );
  }

  // ── Stats ──────────────────────────────────────────────────
  const totalUsers = allUsers.filter((u) => u.role !== 'superadmin').length;
  const activeUsers = allUsers.filter((u) => u.status === 'active' && u.role !== 'superadmin').length;
  const suspendedUsers = allUsers.filter((u) => u.status === 'suspended').length;
  const totalBots = allBots.length;
  const liveBots = allBots.filter((b) => b.status === 'live').length;

  const filteredUsers = allUsers.filter(
    (u) =>
      u.role !== 'superadmin' &&
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredBots = allBots.filter(
    (b) =>
      b.name.toLowerCase().includes(botSearch.toLowerCase()) ||
      b.id.includes(botSearch)
  );

  const getUserName = (userId: string) =>
    allUsers.find((u) => u.id === userId)?.name || 'Unknown User';

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
      active: { color: 'bg-bc-success/15 text-bc-success', icon: CheckCircle2 },
      suspended: { color: 'bg-bc-error/15 text-bc-error', icon: XCircle },
      pending: { color: 'bg-bc-warning/15 text-bc-warning', icon: AlertTriangle },
      live: { color: 'bg-bc-success/15 text-bc-success', icon: CheckCircle2 },
      draft: { color: 'bg-bc-text-muted/15 text-bc-text-muted', icon: Activity },
    };
    const cfg = map[status] || map.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const planBadge = (plan: string) => {
    const map: Record<string, string> = {
      free: 'bg-bc-surface-light text-bc-text-muted border border-bc-border',
      pro: 'bg-bc-accent/15 text-bc-accent border border-bc-accent/30',
      enterprise: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    };
    return (
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${map[plan] || map.free}`}>
        {plan}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
          <Shield className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-bc-text">{t.admin.title}</h2>
          <p className="text-bc-text-muted text-sm">{t.admin.subtitle}</p>
        </div>
        <span className="ml-auto bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full">
          {t.admin.badge}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-bc-border">
        {(['overview', 'users', 'bots'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab
                ? 'border-bc-accent text-bc-accent bg-bc-accent/5'
                : 'border-transparent text-bc-text-muted hover:text-bc-text-secondary'
            }`}
          >
            {tab === 'overview' && <Activity className="w-4 h-4" />}
            {tab === 'users' && <Users className="w-4 h-4" />}
            {tab === 'bots' && <Bot className="w-4 h-4" />}
            {t.admin.tabs[tab]}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: t.admin.stats.totalUsers, value: totalUsers, icon: Users, color: 'text-bc-accent', bg: 'bg-bc-accent/10' },
              { label: t.admin.stats.activeUsers, value: activeUsers, icon: CheckCircle2, color: 'text-bc-success', bg: 'bg-bc-success/10' },
              { label: t.admin.stats.suspended, value: suspendedUsers, icon: UserX, color: 'text-bc-error', bg: 'bg-bc-error/10' },
              { label: t.admin.stats.totalBots, value: totalBots, icon: Bot, color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { label: t.admin.stats.liveBots, value: liveBots, icon: TrendingUp, color: 'text-bc-success', bg: 'bg-bc-success/10' },
              { label: t.admin.stats.proUsers, value: allUsers.filter((u) => u.plan === 'pro').length, icon: Crown, color: 'text-bc-accent', bg: 'bg-bc-accent/10' },
              { label: t.admin.stats.enterprise, value: allUsers.filter((u) => u.plan === 'enterprise').length, icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { label: t.admin.stats.totalMessages, value: allBots.reduce((a, b) => a + b.conversations, 0), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-bc-surface border border-bc-border rounded-xl p-5">
                  <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-[11px] text-bc-text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-bc-text mt-1">{stat.value.toLocaleString()}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Users */}
          <div className="bg-bc-surface border border-bc-border rounded-xl">
            <div className="p-5 border-b border-bc-border flex items-center justify-between">
              <h3 className="text-base font-semibold text-bc-text">{t.admin.recentRegistrations}</h3>
              <button onClick={() => setActiveTab('users')} className="text-[12px] text-bc-accent hover:underline">
                {t.admin.viewAll}
              </button>
            </div>
            <div className="divide-y divide-bc-border-subtle">
              {allUsers.filter((u) => u.role !== 'superadmin').slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-9 h-9 rounded-full bg-bc-accent/20 flex items-center justify-center text-[13px] font-bold text-bc-accent shrink-0">
                    {user.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-bc-text truncate">{user.name}</p>
                    <p className="text-[11px] text-bc-text-muted truncate">{user.email}</p>
                  </div>
                  {planBadge(user.plan)}
                  {statusBadge(user.status)}
                  <p className="text-[11px] text-bc-text-muted hidden sm:block">{formatDate(user.createdAt)}</p>
                </div>
              ))}
              {allUsers.filter((u) => u.role !== 'superadmin').length === 0 && (
                <p className="text-center text-bc-text-muted text-sm py-8">{t.admin.noUsers}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
            <Input
              placeholder={t.admin.searchUsers}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-9 bg-bc-surface border-bc-border text-bc-text placeholder:text-bc-text-muted h-9"
            />
          </div>

          <div className="bg-bc-surface border border-bc-border rounded-xl pb-40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bc-border bg-bc-surface-light">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider">{t.admin.table.user}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider hidden md:table-cell">{t.admin.table.joined}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider hidden sm:table-cell">{t.admin.table.plan}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider">{t.admin.table.status}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider hidden lg:table-cell">{t.admin.table.bots}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-bc-border-subtle">
                {filteredUsers.map((user) => {
                  const userBotCount = allBots.filter((b) => b.userId === user.id).length;
                  return (
                    <tr key={user.id} className="hover:bg-bc-surface-elevated/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-bc-accent/20 flex items-center justify-center text-[13px] font-bold text-bc-accent shrink-0">
                            {user.avatarInitials}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-bc-text">{user.name}</p>
                            <p className="text-[11px] text-bc-text-muted flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-[12px] text-bc-text-secondary flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-bc-text-muted" />
                          {formatDate(user.createdAt)}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === `plan-${user.id}` ? null : `plan-${user.id}`)}
                            className="flex items-center gap-1 hover:bg-bc-surface-light px-2 py-1 rounded transition-colors"
                          >
                            {planBadge(user.plan)}
                            <ChevronDown className="w-3 h-3 text-bc-text-muted" />
                          </button>
                          {openMenuId === `plan-${user.id}` && (
                            <div className="absolute left-0 top-full mt-1 bg-bc-surface-elevated border border-bc-border rounded-lg shadow-lg z-20 min-w-[120px] overflow-hidden">
                              {PLANS.map((p) => (
                                <button
                                  key={p}
                                  onClick={() => { updateUserPlan(user.id, p); setOpenMenuId(null); }}
                                  className={`flex items-center gap-2 w-full px-3 py-2 text-[12px] hover:bg-bc-surface-light transition-colors capitalize ${user.plan === p ? 'text-bc-accent font-semibold' : 'text-bc-text-secondary'}`}
                                >
                                  {p === 'enterprise' && <Crown className="w-3 h-3 text-amber-400" />}
                                  {p === 'pro' && <Shield className="w-3 h-3 text-bc-accent" />}
                                  {p}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {statusBadge(user.status)}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-[13px] text-bc-text-secondary">{userBotCount} bots</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                            className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === user.id && (
                            <div
                              className="absolute right-0 top-full mt-1 bg-bc-surface-elevated border border-bc-border rounded-lg shadow-lg z-20 min-w-[160px]"
                              onMouseLeave={() => setOpenMenuId(null)}
                            >
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => { suspendUser(user.id); setOpenMenuId(null); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-warning hover:bg-bc-warning/10 transition-colors"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  Suspend Account
                                </button>
                              ) : (
                                <button
                                  onClick={() => { activateUser(user.id); setOpenMenuId(null); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-success hover:bg-bc-success/10 transition-colors"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Activate Account
                                </button>
                              )}
                              <button
                                onClick={() => { updateUserRole(user.id, user.role === 'user' ? 'superadmin' : 'user'); setOpenMenuId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-accent hover:bg-bc-accent/10 transition-colors"
                              >
                                <Crown className="w-3.5 h-3.5" />
                                {user.role === 'user' ? t.admin.actions.makeAdmin : t.admin.actions.removeAdmin}
                              </button>
                              <div className="border-t border-bc-border-subtle my-1" />
                              <button
                                onClick={() => {
                                  if (confirm(t.admin.confirmDelete(user.name))) {
                                    deleteUser(user.id);
                                    setOpenMenuId(null);
                                  }
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-error hover:bg-bc-error/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {t.admin.actions.deleteAccount}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-bc-text-muted text-sm py-12">{t.admin.noUsers}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BOTS ── */}
      {activeTab === 'bots' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
            <Input
              placeholder={t.admin.searchBots}
              value={botSearch}
              onChange={(e) => setBotSearch(e.target.value)}
              className="pl-9 bg-bc-surface border-bc-border text-bc-text placeholder:text-bc-text-muted h-9"
            />
          </div>

          <div className="bg-bc-surface border border-bc-border rounded-xl pb-40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bc-border bg-bc-surface-light">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider">{t.admin.table.bot}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider hidden md:table-cell">{t.admin.table.owner}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider hidden sm:table-cell">{t.admin.table.model}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider">{t.admin.table.status}</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-bc-text-muted uppercase tracking-wider hidden lg:table-cell">{t.admin.table.conversations}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-bc-border-subtle">
                {filteredBots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-bc-surface-elevated/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${bot.gradient} flex items-center justify-center text-[12px] font-bold text-white shrink-0`}>
                          {bot.initial}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-bc-text">{bot.name}</p>
                          <p className="text-[11px] text-bc-text-muted font-mono">{bot.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-[12px] text-bc-text-secondary">{getUserName(bot.userId)}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <p className="text-[12px] text-bc-text-secondary">{bot.model}</p>
                    </td>
                    <td className="px-4 py-4">
                      {statusBadge(bot.status)}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <p className="text-[13px] text-bc-text-secondary">{bot.conversations.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/dashboard/bot/${bot.id}`}
                          className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted hover:text-bc-accent transition-colors"
                          title="View Bot"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <div className="relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === `bot-${bot.id}` ? null : `bot-${bot.id}`)}
                            className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === `bot-${bot.id}` && (
                            <div className="absolute right-0 top-full mt-1 bg-bc-surface-elevated border border-bc-border rounded-lg shadow-lg z-20 min-w-[160px] overflow-hidden">
                              {bot.status !== 'suspended' ? (
                                <button
                                  onClick={() => { suspendBot(bot.id); setOpenMenuId(null); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-warning hover:bg-bc-warning/10 transition-colors"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  {t.admin.actions.suspendBot}
                                </button>
                              ) : (
                                <button
                                  onClick={() => { activateBot(bot.id); setOpenMenuId(null); }}
                                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-success hover:bg-bc-success/10 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {t.admin.actions.activateBot}
                                </button>
                              )}
                              <div className="border-t border-bc-border-subtle my-1" />
                              <button
                                onClick={() => {
                                  if (confirm(t.admin.confirmDeleteBot(bot.name))) {
                                    deleteBot(bot.id);
                                    setOpenMenuId(null);
                                  }
                                }}
                                className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] text-bc-error hover:bg-bc-error/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Bot
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBots.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-bc-text-muted text-sm py-12">{t.admin.noBots}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
