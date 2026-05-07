import { useState } from 'react';
import {
  User,
  CreditCard,
  Users,
  Puzzle,
  Key,
  Palette,
  Save,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Globe,
  Clock,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'apikeys', label: 'API Keys', icon: Key },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const integrationsList = [
  { name: 'Slack', connected: true, desc: 'Get notifications in Slack' },
  { name: 'WhatsApp', connected: false, desc: 'Connect to WhatsApp Business' },
  { name: 'Messenger', connected: true, desc: 'Facebook Messenger integration' },
  { name: 'Discord', connected: false, desc: 'Bot notifications in Discord' },
  { name: 'Zapier', connected: false, desc: 'Automate workflows with Zapier' },
  { name: 'WordPress', connected: true, desc: 'Embed on WordPress sites' },
  { name: 'Shopify', connected: false, desc: 'Integrate with Shopify stores' },
  { name: 'Notion', connected: false, desc: 'Sync data from Notion' },
];

const apiKeysList = [
  { name: 'Production API Key', key: 'sk-bc-••••••••••••••••••••••••••••••', created: 'Jan 15, 2025', lastUsed: '2 hours ago' },
  { name: 'Development Key', key: 'sk-bc-••••••••••••••••••••••••••••••', created: 'Feb 1, 2025', lastUsed: '1 day ago' },
];

const teamMembers = [
  { name: 'John Doe', email: 'john@company.com', role: 'Admin', initials: 'JD', color: 'bg-bc-accent' },
  { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Editor', initials: 'SC', color: 'bg-purple-600' },
  { name: 'Mike Ross', email: 'mike@company.com', role: 'Viewer', initials: 'MR', color: 'bg-emerald-500' },
];

const accentColors = ['#2E5BFF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

import { useUser } from '@/context/UserContext';

export default function Settings() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [accentColor, setAccentColor] = useState(accentColors[0]);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[720px] pb-8">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-bc-accent text-bc-accent'
                  : 'border-transparent text-bc-text-muted hover:text-bc-text-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {/* Account */}
        {activeTab === 'account' && (
          <div className="space-y-8">
            {/* Profile */}
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Profile</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-bc-accent/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-bc-accent">
                      {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-bc-border text-bc-text-secondary text-[12px]"
                  >
                    Change Avatar
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-bc-text-secondary text-[13px]">Full Name</Label>
                    <Input
                      defaultValue={user?.name || ''}
                      className="bg-bc-surface-light border-bc-border text-bc-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-bc-text-secondary text-[13px]">Email</Label>
                    <Input
                      defaultValue={user?.email || ''}
                      className="bg-bc-surface-light border-bc-border text-bc-text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Password</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      defaultValue="password123"
                      className="bg-bc-surface-light border-bc-border text-bc-text pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-bc-text-muted"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-bc-text-secondary text-[13px]">New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-bc-text-secondary text-[13px]">Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-bc-surface border border-bc-error/30 rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-error mb-3">Danger Zone</h4>
              <p className="text-[13px] text-bc-text-secondary mb-4">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <Button
                variant="outline"
                className="border-bc-error text-bc-error hover:bg-bc-error/10 text-[13px]"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Account
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-bc-accent hover:bg-bc-accent-hover text-white gap-1"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Billing */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Current Plan</h4>
              <div className="flex items-center justify-between p-4 bg-bc-surface-light rounded-lg">
                <div>
                  <p className="text-lg font-semibold text-bc-text">Professional</p>
                  <p className="text-[13px] text-bc-text-muted">$29/month, billed monthly</p>
                  <p className="text-[12px] text-bc-text-muted mt-1">Next billing: March 15, 2025</p>
                </div>
                <Button
                  variant="outline"
                  className="border-bc-accent text-bc-accent hover:bg-bc-accent/10 text-[12px]"
                >
                  Change Plan
                </Button>
              </div>
            </div>

            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Usage</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-bc-text-secondary">Messages</span>
                    <span className="text-[13px] text-bc-text">1,247 / 2,000</span>
                  </div>
                  <Progress value={62} className="h-2 bg-bc-surface-light" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-bc-text-secondary">Chatbots</span>
                    <span className="text-[13px] text-bc-text">3 / 5</span>
                  </div>
                  <Progress value={60} className="h-2 bg-bc-surface-light" />
                </div>
              </div>
            </div>

            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Payment Method</h4>
              <div className="flex items-center gap-3 p-3 bg-bc-surface-light rounded-lg">
                <CreditCard className="w-5 h-5 text-bc-accent" />
                <div className="flex-1">
                  <p className="text-sm text-bc-text">•••• •••• •••• 4242</p>
                  <p className="text-[11px] text-bc-text-muted">Expires 12/26</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-bc-border text-bc-text-secondary text-[12px]"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Team */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Team Members</h4>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center gap-3 p-3 bg-bc-surface-light rounded-lg"
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center`}
                    >
                      <span className="text-xs font-bold text-white">{member.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-bc-text">{member.name}</p>
                      <p className="text-[11px] text-bc-text-muted">{member.email}</p>
                    </div>
                    <select
                      defaultValue={member.role}
                      className="bg-bc-surface border border-bc-border text-[12px] text-bc-text rounded-md px-2 py-1"
                    >
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Email address"
                  className="bg-bc-surface-light border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted flex-1"
                />
                <Button className="bg-bc-accent hover:bg-bc-accent-hover text-white gap-1 text-[12px]">
                  <Plus className="w-4 h-4" />
                  Invite
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="space-y-4">
            {integrationsList.map((int) => (
              <div
                key={int.name}
                className="flex items-center gap-4 p-4 bg-bc-surface border border-bc-border rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-bc-surface-light flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-bc-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-bc-text">{int.name}</p>
                  <p className="text-[12px] text-bc-text-muted">{int.desc}</p>
                </div>
                <Button
                  variant={int.connected ? 'outline' : 'default'}
                  size="sm"
                  className={
                    int.connected
                      ? 'border-bc-success text-bc-success hover:bg-bc-success/10 text-[12px]'
                      : 'bg-bc-accent hover:bg-bc-accent-hover text-white text-[12px]'
                  }
                >
                  {int.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* API Keys */}
        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button className="bg-bc-accent hover:bg-bc-accent-hover text-white gap-1 text-[13px]">
                <Plus className="w-4 h-4" />
                Generate New Key
              </Button>
            </div>
            <div className="space-y-3">
              {apiKeysList.map((key) => (
                <div
                  key={key.name}
                  className="bg-bc-surface border border-bc-border rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-bc-text">{key.name}</p>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted hover:text-bc-error transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <code className="block text-[12px] text-bc-text-secondary bg-bc-surface-light rounded-md px-3 py-2 font-mono">
                    {key.key}
                  </code>
                  <div className="flex items-center gap-4 mt-3 text-[11px] text-bc-text-muted">
                    <span>Created: {key.created}</span>
                    <span>Last used: {key.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Theme</h4>
              <div className="flex gap-2 p-1 bg-bc-surface-light rounded-lg w-fit">
                {[
                  { value: 'dark' as const, label: 'Dark' },
                  { value: 'light' as const, label: 'Light' },
                  { value: 'system' as const, label: 'System' },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
                      theme === t.value
                        ? 'bg-bc-surface text-bc-text shadow-sm'
                        : 'text-bc-text-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Accent Color</h4>
              <div className="flex gap-3 flex-wrap">
                {accentColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-9 h-9 rounded-full transition-all ${
                      accentColor === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-bc-surface scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h4 className="text-base font-semibold text-bc-text mb-5">Language & Region</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">Language</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
                    <select className="w-full pl-9 pr-3 py-2 bg-bc-surface-light border border-bc-border rounded-md text-[13px] text-bc-text appearance-none">
                      <option>English</option>
                      <option>Arabic</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">Timezone</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
                    <select className="w-full pl-9 pr-3 py-2 bg-bc-surface-light border border-bc-border rounded-md text-[13px] text-bc-text appearance-none">
                      <option>UTC (GMT+0)</option>
                      <option>EST (GMT-5)</option>
                      <option>CST (GMT-6)</option>
                      <option>PST (GMT-8)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-bc-accent hover:bg-bc-accent-hover text-white gap-1"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
