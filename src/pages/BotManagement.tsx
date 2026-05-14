import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Settings,
  Database,
  Share2,
  BarChart3,
  Bot,
  Zap,
  Sparkles,
  Shield,
  Globe,
  Palette,
  Copy,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import ChatInterface from './ChatInterface';
import DataSources from './DataSources';
import Analytics from './Analytics';
import BotCustomizer from '@/components/BotCustomizer';
import { useBots } from '@/context/BotContext';

const tabs = [
  { id: 'playground', label: 'Playground', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'sources', label: 'Sources', icon: Database },
  { id: 'customize', label: 'Customize', icon: Palette },
  { id: 'embed', label: 'Connect', icon: Share2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function BotManagement() {
  const { botId } = useParams();
  const { getBot, updateBot, deleteBot } = useBots();
  const [activeTab, setActiveTab] = useState('playground');
  const [copied, setCopied] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');

  const botData = getBot(botId || '');

  // Initialize prompt from bot data
  useEffect(() => {
    if (botData && !systemPrompt) {
      setSystemPrompt(botData.prompt || `You are a helpful AI assistant for ${botData.name}.`);
    }
  }, [botData, systemPrompt]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!botData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Bot className="w-16 h-16 text-bc-text-muted mb-4" />
        <h2 className="text-2xl font-bold text-bc-text">Bot not found</h2>
        <p className="text-bc-text-muted mt-2">The bot you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard" className="mt-6">
          <Button className="bg-bc-accent hover:bg-bc-accent-hover text-white">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const origin = window.location.origin;
  const shareUrl = `${origin}/share/${botData.id}`;

  const scriptCode = `<script
  src="${origin}/embed.js"
  data-bot-id="${botData.id}"
  defer
></script>`;

  const iframeCode = `<iframe
  src="${shareUrl}"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`;

  const apiCode = `curl -X POST ${origin}/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "botId": "${botData.id}",
    "message": "Hello!",
    "conversationId": "optional-session-id"
  }'`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bc-surface border border-bc-border rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-bc-accent/20 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-bc-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-bc-text">{botData.name}</h2>
              <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                botData.status === 'live'
                  ? 'bg-bc-success/15 text-bc-success'
                  : 'bg-bc-warning/15 text-bc-warning'
              }`}>
                {botData.status === 'live' ? '● Live' : '○ Draft'}
              </span>
            </div>
            <p className="text-bc-text-muted text-xs mt-1">
              ID: <span className="font-mono">{botData.id}</span> · Model: {botData.model} · {botData.conversations.toLocaleString()} conversations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-bc-border text-bc-text-secondary text-xs h-9 gap-1.5"
            onClick={() => window.open(shareUrl, '_blank')}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview
          </Button>
          <Button
            variant="outline"
            className="border-bc-border text-bc-text-secondary text-xs h-9 gap-1.5"
            onClick={() => handleCopy(shareUrl, 'link')}
          >
            {copied === 'link' ? <Check className="w-3.5 h-3.5 text-bc-success" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied === 'link' ? 'Copied!' : 'Share Link'}
          </Button>
          <Button 
            onClick={() => updateBot(botData.id, { status: 'live' })}
            disabled={botData.status === 'live'}
            className="bg-bc-accent hover:bg-bc-accent-hover text-white text-xs h-9 px-4 disabled:opacity-50"
          >
            {botData.status === 'live' ? 'Published' : 'Publish Bot'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-bc-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-bc-accent text-bc-accent bg-bc-accent/5'
                  : 'border-transparent text-bc-text-muted hover:text-bc-text-secondary hover:bg-bc-surface-light'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {/* Playground */}
        {activeTab === 'playground' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-bc-surface border border-bc-border rounded-xl overflow-hidden h-[600px]">
                <ChatInterface isEmbedded={true} botId={botData.id} />
              </div>
            </div>
            <div className="space-y-5">
              {/* Base Prompt */}
              <div className="bg-bc-surface border border-bc-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-bc-text flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-bc-accent" />
                  System Prompt
                </h3>
                <p className="text-xs text-bc-text-muted mb-3 leading-relaxed">
                  Define your bot's personality, tone, and behavior.
                </p>
                <textarea
                  className="w-full h-40 bg-bc-surface-light border border-bc-border rounded-lg p-3 text-xs text-bc-text focus:outline-none focus:ring-1 focus:ring-bc-accent resize-none font-mono leading-relaxed"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
                <Button 
                  onClick={() => updateBot(botData.id, { prompt: systemPrompt })}
                  className="w-full mt-3 bg-bc-accent hover:bg-bc-accent-hover text-white text-xs h-9"
                >
                  Save Prompt
                </Button>
              </div>

              {/* Model Config */}
              <div className="bg-bc-surface border border-bc-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-bc-text flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-bc-accent" />
                  Model Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] text-bc-text-muted uppercase tracking-wider block mb-2">AI Model</label>
                    <select className="w-full bg-bc-surface-light border border-bc-border rounded-lg px-3 py-2 text-xs text-bc-text">
                      <option value="gpt4">GPT-4 Turbo (Recommended)</option>
                      <option value="gpt35">GPT-3.5 Turbo (Faster)</option>
                      <option value="claude">Claude 3.5 Sonnet</option>
                      <option value="gemini">Gemini 1.5 Pro</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[11px] text-bc-text-muted uppercase tracking-wider">Temperature</label>
                      <span className="text-[11px] font-bold text-bc-accent">0.7</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" className="w-full accent-bc-accent" defaultValue="0.7" />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-bc-text-muted">Precise</span>
                      <span className="text-[10px] text-bc-text-muted">Creative</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-[11px] text-bc-text-muted uppercase tracking-wider">Confidence Threshold</label>
                      <span className="text-[11px] font-bold text-bc-accent">0.5</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.1" className="w-full accent-bc-accent" defaultValue="0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
            <div className="lg:col-span-2 space-y-5">
              {/* General Settings */}
              <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
                <h3 className="text-base font-semibold text-bc-text mb-5">General Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-bc-text-secondary">Bot Name</label>
                    <Input
                      defaultValue={botData.name}
                      className="bg-bc-surface-light border-bc-border text-bc-text"
                      onChange={(e) => updateBot(botData.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-bc-text-secondary">Description</label>
                    <Input
                      defaultValue={botData.description}
                      className="bg-bc-surface-light border-bc-border text-bc-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-bc-text-secondary">Welcome Message</label>
                    <Input
                      defaultValue={botData.welcomeMessage}
                      className="bg-bc-surface-light border-bc-border text-bc-text"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Visibility */}
              <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
                <h3 className="text-base font-semibold text-bc-text mb-5">Security & Visibility</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Public Visibility', desc: 'Anyone with the link can chat with this bot.', defaultChecked: true },
                    { label: 'Lead Capture Form', desc: 'Ask for user email before starting the chat.' },
                    { label: 'Rate Limiting', desc: 'Limit to 20 messages per user per day.' },
                    { label: 'GDPR Consent Banner', desc: 'Show data consent before first message.' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-bc-surface-light rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-bc-text">{item.label}</p>
                        <p className="text-xs text-bc-text-muted">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <div className="bg-bc-surface border border-bc-error/30 rounded-xl p-5 border-l-4 border-l-bc-error">
                <h3 className="text-sm font-semibold text-bc-error mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Danger Zone
                </h3>
                <p className="text-xs text-bc-text-muted mb-4 leading-relaxed">
                  Permanently remove this chatbot and all its training data. This cannot be undone.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-bc-error text-bc-error hover:bg-bc-error/10 text-xs h-9"
                  onClick={() => deleteBot(botData.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete {botData.name}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sources */}
        {activeTab === 'sources' && <DataSources />}

        {/* Customize */}
        {activeTab === 'customize' && (
          <BotCustomizer botName={botData.name} />
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && <Analytics />}

        {/* Connect / Embed */}
        {activeTab === 'embed' && (
          <div className="space-y-6 max-w-3xl">
            {/* Public URL */}
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-bc-accent/15 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-bc-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-bc-text">Public Shareable Link</h3>
                  <p className="text-xs text-bc-text-muted">Share a direct link to your chatbot</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[200px] flex gap-2">
                  <Input
                    readOnly
                    value={shareUrl}
                    className="bg-bc-surface-light border-bc-border text-bc-text-secondary text-sm font-mono"
                  />
                  <Button
                    variant="outline"
                    className="border-bc-border shrink-0 gap-1.5"
                    onClick={() => handleCopy(shareUrl, 'url')}
                  >
                    {copied === 'url' ? <Check className="w-4 h-4 text-bc-success" /> : <Copy className="w-4 h-4" />}
                    {copied === 'url' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-green-500/30 text-green-500 hover:bg-green-500/10 gap-1.5"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Chat with my AI assistant: ' + shareUrl)}`, '_blank')}
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="border-bc-accent/30 text-bc-accent hover:bg-bc-accent/10 gap-1.5"
                    onClick={() => window.open(`mailto:?subject=Chat with our AI Assistant&body=${encodeURIComponent('You can chat with our AI assistant here: ' + shareUrl)}`, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Embed Codes */}
            {[
              { key: 'script', label: 'Script Tag (Floating Widget)', desc: 'Add to your website <head> or <body>', code: scriptCode },
              { key: 'iframe', label: 'Iframe (Inline Chat)', desc: 'Embed inline within your page', code: iframeCode },
              { key: 'api', label: 'API (cURL)', desc: 'Integrate with your own backend', code: apiCode },
            ].map((embed) => (
              <div key={embed.key} className="bg-bc-surface border border-bc-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-bc-text">{embed.label}</h3>
                    <p className="text-xs text-bc-text-muted mt-0.5">{embed.desc}</p>
                  </div>
                  <Button
                    className="bg-bc-surface border border-bc-border text-bc-text hover:bg-bc-surface-light h-8 text-[11px] px-3 gap-1.5"
                    onClick={() => handleCopy(embed.code, embed.key)}
                  >
                    {copied === embed.key ? <Check className="w-3 h-3 text-bc-success" /> : <Copy className="w-3 h-3" />}
                    {copied === embed.key ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                <pre className="bg-bc-surface-light border border-bc-border rounded-xl p-4 text-[12px] text-bc-text overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
                  {embed.code}
                </pre>
              </div>
            ))}

            {/* Domain whitelist */}
            <div className="bg-bc-surface border border-bc-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-bc-text flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-bc-success" />
                Allowed Domains
              </h3>
              <p className="text-xs text-bc-text-muted mb-4">
                Restrict your bot widget to specific domains for security.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://yourwebsite.com"
                  className="bg-bc-surface-light border-bc-border text-bc-text text-sm placeholder:text-bc-text-muted"
                />
                <Button variant="outline" className="border-bc-border text-bc-text-secondary shrink-0">
                  Add Domain
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
