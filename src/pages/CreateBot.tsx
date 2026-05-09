import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Bot,
  Cpu,
  Zap,
  UploadCloud,
  Globe,
  FileText,
  Puzzle,
  Palette,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  FileCode,
} from 'lucide-react';
import { useBots } from '@/context/BotContext';
import { useAuth } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

const steps = [
  { label: 'Name', icon: Bot },
  { label: 'Model', icon: Cpu },
  { label: 'Data', icon: UploadCloud },
  { label: 'Customize', icon: Palette },
  { label: 'Review', icon: Sparkles },
];

const models = [
  {
    id: 'gpt4',
    name: 'GPT-4 Turbo',
    badge: 'Most capable',
    desc: 'Best for complex reasoning and detailed responses',
    icon: Sparkles,
  },
  {
    id: 'claude',
    name: 'Claude 3 Sonnet',
    badge: 'Balanced',
    desc: 'Great balance of speed and intelligence',
    icon: Bot,
  },
  {
    id: 'gemini',
    name: 'Gemini Pro',
    badge: 'Fastest',
    desc: 'Fast responses with strong multimodal support',
    icon: Zap,
  },
];

const dataTabs = [
  { id: 'upload', label: 'Upload Files', icon: UploadCloud },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'paste', label: 'Paste Text', icon: FileText },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
];

const integrations = [
  { name: 'Notion', icon: FileText },
  { name: 'Google Drive', icon: FileCode },
  { name: 'Confluence', icon: Globe },
  { name: 'Zendesk', icon: MessageSquare },
];

const colorOptions = [
  '#2E5BFF',
  '#7C3AED',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#06B6D4',
];

const avatarOptions = [
  { icon: Bot, label: 'Bot' },
  { icon: MessageSquare, label: 'Chat' },
  { icon: Sparkles, label: 'AI' },
  { icon: Zap, label: 'Fast' },
  { icon: Cpu, label: 'Tech' },
  { icon: Globe, label: 'Web' },
];

export default function CreateBot() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [botName, setBotName] = useState('');
  const [botDesc, setBotDesc] = useState('');
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [dataTab, setDataTab] = useState('upload');
  const [files, setFiles] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [accentColor, setAccentColor] = useState(colorOptions[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [widgetPosition, setWidgetPosition] = useState<'right' | 'left'>('right');
  const [darkTheme, setDarkTheme] = useState(true);
  const [enableOnCreate, setEnableOnCreate] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f) => f.name);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const { addBot } = useBots();
  const { currentUser } = useAuth();

  const handleCreate = () => {
    addBot(
      {
        name: botName,
        description: botDesc,
        welcomeMessage: welcomeMsg,
        model: selectedModel,
        status: enableOnCreate ? 'live' : 'draft',
        accentColor: accentColor,
        avatar: selectedAvatar,
        darkTheme: darkTheme,
        widgetPosition: widgetPosition,
      },
      currentUser?.id || 'unknown'
    );
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return botName.trim().length > 0;
      case 1:
        return true;
      case 2:
        return files.length > 0 || websiteUrl.trim().length > 0 || pastedText.trim().length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-[720px] mx-auto pb-20">
      <p className="text-bc-text-secondary text-sm mb-6">
        Set up your AI assistant in a few simple steps
      </p>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = i < step;
          const isCurrent = i === step;
          return (
            <div key={s.label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-bc-accent text-white'
                      : isCurrent
                        ? 'bg-bc-accent text-white ring-4 ring-bc-accent/20'
                        : 'bg-bc-surface border-2 border-bc-border text-bc-text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:block ${
                    isCurrent ? 'text-bc-accent' : 'text-bc-text-muted'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 sm:mx-4 transition-colors duration-300 ${
                    i < step ? 'bg-bc-accent' : 'bg-bc-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-bc-surface border border-bc-border rounded-xl p-6 md:p-8">
        {/* Step 1: Name */}
        {step === 0 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-bc-text">Name Your Bot</h3>
            <div className="space-y-2">
              <Label className="text-bc-text-secondary">Bot Name</Label>
              <Input
                placeholder="e.g., Sales Assistant"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-bc-text-secondary">Description</Label>
              <Textarea
                placeholder="What does this bot help with?"
                rows={3}
                value={botDesc}
                onChange={(e) => setBotDesc(e.target.value)}
                className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-bc-text-secondary">Welcome Message</Label>
              <Input
                placeholder="Hello! How can I help you today?"
                value={welcomeMsg}
                onChange={(e) => setWelcomeMsg(e.target.value)}
                className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
              />
            </div>
          </div>
        )}

        {/* Step 2: Model */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-bc-text">Choose AI Model</h3>
            <div className="grid grid-cols-1 gap-3">
              {models.map((model) => {
                const Icon = model.icon;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedModel === model.id
                        ? 'border-bc-accent bg-bc-accent/8'
                        : 'border-bc-border hover:border-bc-accent/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-bc-surface-light flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-bc-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-bc-text">
                          {model.name}
                        </span>
                        <span className="text-[10px] font-medium bg-bc-accent/15 text-bc-accent rounded-full px-2 py-0.5">
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[13px] text-bc-text-secondary mt-1">
                        {model.desc}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        selectedModel === model.id
                          ? 'border-bc-accent bg-bc-accent'
                          : 'border-bc-border'
                      }`}
                    >
                      {selectedModel === model.id && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Data Sources */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-bc-text">Add Data Sources</h3>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-bc-surface-light rounded-lg">
              {dataTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDataTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-medium transition-all ${
                      dataTab === tab.id
                        ? 'bg-bc-surface text-bc-text shadow-sm'
                        : 'text-bc-text-muted hover:text-bc-text-secondary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Upload Files */}
            {dataTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onClick={handleFileUpload}
                  className="border-2 border-dashed border-bc-border hover:border-bc-accent/50 rounded-xl p-8 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-10 h-10 text-bc-text-muted mx-auto mb-3" />
                  <p className="text-sm text-bc-text-secondary">
                    Drag files here or click to browse
                  </p>
                  <p className="text-[11px] text-bc-text-muted mt-1">
                    PDF, DOC, CSV, TXT, MD — Max 50MB each
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.csv,.txt,.md"
                />
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-bc-surface-light rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-bc-accent" />
                        <span className="text-[13px] text-bc-text flex-1">{f}</span>
                        <Check className="w-4 h-4 text-bc-success" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Website */}
            {dataTab === 'website' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary">Website URL</Label>
                  <Input
                    placeholder="https://your-website.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 bg-bc-surface-light rounded-lg">
                  <Switch
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                  <Label className="text-[13px] text-bc-text-secondary cursor-pointer">
                    Crawl entire site
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary">Max pages</Label>
                  <Input
                    type="number"
                    defaultValue={100}
                    className="bg-bc-surface-light border-bc-border text-bc-text w-32"
                  />
                </div>
              </div>
            )}

            {/* Paste Text */}
            {dataTab === 'paste' && (
              <div className="space-y-2">
                <Label className="text-bc-text-secondary">Paste or type your content</Label>
                <Textarea
                  placeholder="Paste or type your content here..."
                  rows={10}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted resize-none"
                />
              </div>
            )}

            {/* Integrations */}
            {dataTab === 'integrations' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrations.map((int) => {
                  const Icon = int.icon;
                  return (
                    <div
                      key={int.name}
                      className="flex items-center gap-3 p-4 bg-bc-surface-light border border-bc-border rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg bg-bc-surface flex items-center justify-center">
                        <Icon className="w-5 h-5 text-bc-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-bc-text">{int.name}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-[11px] h-8 border-bc-accent text-bc-accent hover:bg-bc-accent/10">
                        Connect
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Customize */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-bc-text">Customize Appearance</h3>

            {/* Color */}
            <div className="space-y-3">
              <Label className="text-bc-text-secondary">Accent Color</Label>
              <div className="flex gap-3 flex-wrap">
                {colorOptions.map((color) => (
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
                <Input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* Avatar */}
            <div className="space-y-3">
              <Label className="text-bc-text-secondary">Bot Avatar</Label>
              <div className="grid grid-cols-6 gap-2">
                {avatarOptions.map((av, i) => {
                  const Icon = av.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedAvatar(i)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedAvatar === i
                          ? 'bg-bc-accent text-white ring-2 ring-bc-accent/50'
                          : 'bg-bc-surface-light text-bc-text-muted hover:bg-bc-surface-elevated'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-3">
              <Label className="text-bc-text-secondary">Widget Position</Label>
              <div className="flex gap-2 p-1 bg-bc-surface-light rounded-lg w-fit">
                <button
                  onClick={() => setWidgetPosition('right')}
                  className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
                    widgetPosition === 'right'
                      ? 'bg-bc-surface text-bc-text shadow-sm'
                      : 'text-bc-text-muted'
                  }`}
                >
                  Bottom Right
                </button>
                <button
                  onClick={() => setWidgetPosition('left')}
                  className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
                    widgetPosition === 'left'
                      ? 'bg-bc-surface text-bc-text shadow-sm'
                      : 'text-bc-text-muted'
                  }`}
                >
                  Bottom Left
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <Label className="text-bc-text-secondary">Theme</Label>
              <div className="flex gap-2 p-1 bg-bc-surface-light rounded-lg w-fit">
                <button
                  onClick={() => setDarkTheme(true)}
                  className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
                    darkTheme
                      ? 'bg-bc-surface text-bc-text shadow-sm'
                      : 'text-bc-text-muted'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setDarkTheme(false)}
                  className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
                    !darkTheme
                      ? 'bg-bc-surface text-bc-text shadow-sm'
                      : 'text-bc-text-muted'
                  }`}
                >
                  Light
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-bc-surface-light rounded-xl border border-bc-border">
              <p className="text-[12px] font-medium text-bc-text-muted mb-3 uppercase tracking-wider">
                Preview
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: accentColor + '30' }}
                >
                  {(() => {
                    const Icon = avatarOptions[selectedAvatar].icon;
                    return <Icon className="w-5 h-5" style={{ color: accentColor }} />;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-bc-text">
                    {botName || 'Your Bot'}
                  </p>
                  <p className="text-[11px] text-bc-text-muted">
                    {models.find((m) => m.id === selectedModel)?.name || 'GPT-4 Turbo'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-bc-text">Review & Create</h3>
            <div className="bg-bc-surface-light rounded-xl p-5 space-y-4 border border-bc-border">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-bc-text-muted">Bot Name</span>
                <span className="text-sm font-medium text-bc-text">{botName}</span>
              </div>
              <div className="h-px bg-bc-border" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-bc-text-muted">AI Model</span>
                <span className="text-sm font-medium text-bc-text">
                  {models.find((m) => m.id === selectedModel)?.name}
                </span>
              </div>
              <div className="h-px bg-bc-border" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-bc-text-muted">Data Sources</span>
                <div className="flex items-center gap-2">
                  {files.length > 0 && (
                    <span className="flex items-center gap-1 text-[12px] text-bc-text-secondary">
                      <FileText className="w-3 h-3" /> {files.length} files
                    </span>
                  )}
                  {websiteUrl && (
                    <span className="flex items-center gap-1 text-[12px] text-bc-text-secondary">
                      <Globe className="w-3 h-3" /> Website
                    </span>
                  )}
                  {pastedText && (
                    <span className="flex items-center gap-1 text-[12px] text-bc-text-secondary">
                      <FileText className="w-3 h-3" /> Text
                    </span>
                  )}
                </div>
              </div>
              <div className="h-px bg-bc-border" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-bc-text-muted">Accent Color</span>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
              <div className="h-px bg-bc-border" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-bc-text-muted">Theme</span>
                <span className="text-sm text-bc-text">
                  {darkTheme ? 'Dark' : 'Light'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-bc-surface-light rounded-lg">
              <Switch checked={enableOnCreate} onCheckedChange={setEnableOnCreate} />
              <Label className="text-[13px] text-bc-text-secondary cursor-pointer">
                Enable bot on creation
              </Label>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleCreate}
                className="flex-1 bg-bc-accent hover:bg-bc-accent-hover text-white py-5 rounded-[10px] font-semibold hover:shadow-glow"
              >
                Create Bot
              </Button>
              <Button
                variant="outline"
                className="border-bc-border text-bc-text-secondary hover:bg-bc-surface-elevated py-5 rounded-[10px]"
              >
                Save as Draft
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-bc-text-secondary hover:text-bc-text disabled:opacity-30 gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={!canProceed()}
            className="bg-bc-accent hover:bg-bc-accent-hover text-white gap-1 disabled:opacity-50"
          >
            {step === 3 ? 'Review' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Progress */}
      <div className="mt-6">
        <Progress
          value={((step + 1) / steps.length) * 100}
          className="h-1 bg-bc-surface-light"
        />
        <p className="text-[11px] text-bc-text-muted mt-2 text-center">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
