import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Upload,
  Palette,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Check,
  Hexagon,
  FileText,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBots } from '@/context/BotContext';
import { useAuth } from '@/context/UserContext';
import { useSources } from '@/context/SourceContext';
import { formatFileSize } from '@/lib/extractor';

const steps = [
  { id: 1, label: 'Name Your Bot', icon: Bot },
  { id: 2, label: 'Train Your Bot', icon: Upload },
  { id: 3, label: 'Customize', icon: Palette },
  { id: 4, label: 'Deploy', icon: Rocket },
];

const categories = [
  { value: 'customer-support', label: '🎧 Customer Support' },
  { value: 'sales', label: '💼 Sales & Lead Gen' },
  { value: 'hr', label: '👥 HR & Onboarding' },
  { value: 'faq', label: '❓ FAQ Bot' },
  { value: 'ecommerce', label: '🛒 E-Commerce' },
  { value: 'education', label: '📚 Education' },
];

const colorOptions = ['#2E5BFF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { addBot } = useBots();
  const { currentUser } = useAuth();
  const { addSource } = useSources();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [trainingMethod, setTrainingMethod] = useState<'text' | 'website' | 'file' | null>(null);
  const [trainingContent, setTrainingContent] = useState('');
  const [color, setColor] = useState(colorOptions[0]);
  const [avatar, setAvatar] = useState('🤖');
  const avatarOptions = ['🤖', '💬', '🧠', '⚡', '✨', '🎯'];

  const handleNext = async () => {
    if (step === 3) {
      setIsCreating(true);
      try {
        const newBot = await addBot(
          {
            name: botName || 'My First Bot',
            description: description || 'AI chatbot assistant',
            welcomeMessage: `Hi! I'm ${botName || 'your assistant'}. How can I help you?`,
            model: 'Gemini 1.5 Flash',
            status: 'live',
            accentColor: color,
            avatar: 0,
            darkTheme: true,
            widgetPosition: 'right',
          },
          currentUser?.id || 'unknown'
        );

        // If training data was provided, save it
        if (trainingContent && trainingMethod) {
          await addSource({
            botId: newBot.id,
            name: trainingMethod === 'website' ? trainingContent : 'Initial Knowledge',
            type: trainingMethod === 'website' ? 'website' : 'text',
            content: trainingContent,
            sizeLabel: trainingMethod === 'website' ? 'URL' : formatFileSize(trainingContent.length),
            charCount: trainingContent.length,
            status: 'ready',
          });
        }
      } catch (error) {
        console.error('Error creating bot:', error);
      } finally {
        setIsCreating(false);
      }
    }
    if (step < 4) setStep(step + 1);
  };

  const handleFinish = () => {
    localStorage.setItem('bc_onboarded', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bc-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-bc-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <Hexagon className="w-7 h-7 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
          <span className="font-display text-2xl font-bold text-bc-text">
            BotCraft<span className="text-bc-accent">AI</span>
          </span>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone
                      ? 'bg-bc-accent border-bc-accent'
                      : isActive
                      ? 'border-bc-accent bg-bc-accent/10'
                      : 'border-bc-border bg-bc-surface'
                  }`}>
                    {isDone ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isActive ? 'text-bc-accent' : 'text-bc-text-muted'}`} />
                    )}
                  </div>
                  <span className={`text-[11px] font-medium mt-1.5 ${isActive ? 'text-bc-accent' : 'text-bc-text-muted'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 mb-5 ${step > s.id ? 'bg-bc-accent' : 'bg-bc-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-bc-surface border border-bc-border rounded-2xl p-8 shadow-card">

          {/* Step 1 — Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-bc-text">Let's create your first bot 🤖</h2>
                <p className="text-bc-text-secondary mt-1.5">Give your AI assistant a name and pick a category.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-bc-text-secondary">Bot Name <span className="text-bc-error">*</span></Label>
                <Input
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="e.g. Support Assistant, Sales Bot..."
                  className="bg-bc-surface-light border-bc-border text-bc-text h-12 text-base placeholder:text-bc-text-muted"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label className="text-bc-text-secondary">Short Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will this bot help with?"
                  className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-bc-text-secondary">Category</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`py-2.5 px-3 text-[13px] rounded-lg border text-left font-medium transition-all ${
                        category === cat.value
                          ? 'border-bc-accent bg-bc-accent/10 text-bc-accent'
                          : 'border-bc-border text-bc-text-secondary hover:border-bc-accent/40'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Train */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-bc-text">Train your bot 🧠</h2>
                <p className="text-bc-text-secondary mt-1.5">Add data so your bot can answer questions accurately.</p>
              </div>

              {!trainingMethod ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { method: 'text' as const, icon: FileText, label: 'Paste Text', desc: 'Copy-paste your content' },
                    { method: 'website' as const, icon: Globe, label: 'Website URL', desc: 'Crawl your website' },
                    { method: 'file' as const, icon: Upload, label: 'Upload File', desc: 'PDF, DOCX, CSV' },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.method}
                        onClick={() => setTrainingMethod(opt.method)}
                        className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-bc-border rounded-xl hover:border-bc-accent hover:bg-bc-accent/5 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-bc-surface-light flex items-center justify-center">
                          <Icon className="w-6 h-6 text-bc-accent" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-bc-text">{opt.label}</p>
                          <p className="text-[12px] text-bc-text-muted mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setTrainingMethod(null)}
                    className="text-[13px] text-bc-accent hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to options
                  </button>
                  {trainingMethod === 'text' && (
                    <textarea
                      value={trainingContent}
                      onChange={(e) => setTrainingContent(e.target.value)}
                      rows={8}
                      placeholder="Paste your content here — product info, FAQs, policies, etc."
                      className="w-full bg-bc-surface-light border border-bc-border rounded-xl p-4 text-[13px] text-bc-text resize-none focus:outline-none focus:ring-2 focus:ring-bc-accent/30"
                    />
                  )}
                  {trainingMethod === 'website' && (
                    <div className="space-y-3">
                      <Input
                        value={trainingContent}
                        onChange={(e) => setTrainingContent(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="bg-bc-surface-light border-bc-border text-bc-text h-12"
                      />
                      <p className="text-[12px] text-bc-text-muted">We'll crawl this URL and extract all text for training.</p>
                    </div>
                  )}
                  {trainingMethod === 'file' && (
                    <div className="border-2 border-dashed border-bc-border rounded-xl p-10 text-center hover:border-bc-accent/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-bc-text-muted mx-auto mb-3" />
                      <p className="font-medium text-bc-text">Drop a file here or click to browse</p>
                      <p className="text-[12px] text-bc-text-muted mt-1">PDF, DOCX, TXT, CSV — Max 50MB</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-bc-surface-light rounded-xl border border-bc-border">
                <Check className="w-4 h-4 text-bc-success shrink-0" />
                <p className="text-[12px] text-bc-text-secondary">
                  You can always add more sources later from the Data Sources tab.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 — Customize */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-bc-text">Customize your bot 🎨</h2>
                <p className="text-bc-text-secondary mt-1.5">Choose a color and avatar for your chatbot widget.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary">Bot Avatar</Label>
                  <div className="flex gap-2">
                    {avatarOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setAvatar(emoji)}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          avatar === emoji
                            ? 'ring-2 ring-bc-accent ring-offset-2 ring-offset-bc-surface bg-bc-surface-light scale-110'
                            : 'bg-bc-surface-light hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-bc-text-secondary">Primary Color</Label>
                  <div className="flex gap-3">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          color === c
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-bc-surface scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Mini Preview */}
                <div className="mt-4 p-4 bg-bc-surface-light rounded-xl border border-bc-border">
                  <p className="text-[11px] text-bc-text-muted uppercase tracking-wider mb-3">Preview</p>
                  <div className="flex items-end gap-3">
                    <div
                      className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: color }}
                    >
                      {avatar}
                    </div>
                    <div
                      className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-white max-w-[220px]"
                      style={{ backgroundColor: color }}
                    >
                      Hi! I'm {botName || 'your assistant'}. How can I help?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Deploy */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-bc-success/20 flex items-center justify-center mx-auto">
                <Rocket className="w-10 h-10 text-bc-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-bc-text">
                  {botName || 'Your bot'} is ready! 🎉
                </h2>
                <p className="text-bc-text-secondary mt-2 max-w-md mx-auto">
                  Your chatbot has been created and is live. You can now test it in the playground, add more training data, or embed it on your website.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left">
                {[
                  { emoji: '🧪', label: 'Test in Playground', desc: 'Chat with your bot' },
                  { emoji: '📄', label: 'Add Sources', desc: 'Upload more data' },
                  { emoji: '🔗', label: 'Get Embed Code', desc: 'Deploy to website' },
                ].map((item) => (
                  <div key={item.label} className="p-4 bg-bc-surface-light rounded-xl border border-bc-border">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <p className="text-[13px] font-semibold text-bc-text">{item.label}</p>
                    <p className="text-[11px] text-bc-text-muted mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleFinish}
                className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white h-12 font-semibold text-base shadow-glow"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
              className="text-[13px] text-bc-text-muted hover:text-bc-text transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? 'Skip for now' : 'Back'}
            </button>
            <Button
              onClick={handleNext}
              disabled={(step === 1 && !botName.trim()) || isCreating}
              className="bg-bc-accent hover:bg-bc-accent-hover text-white px-8 h-10 gap-2"
            >
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {step === 3 ? 'Create Bot' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
