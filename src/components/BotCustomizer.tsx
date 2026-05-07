import { useState } from 'react';
import { Bot, Send, X, Palette, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomizerProps {
  botName: string;
  onSave?: (settings: BotCustomSettings) => void;
}

export interface BotCustomSettings {
  name: string;
  welcomeMessage: string;
  placeholder: string;
  primaryColor: string;
  darkTheme: boolean;
  position: 'left' | 'right';
  showSources: boolean;
  suggestedQuestions: string[];
  avatar: string;
}

const defaultSettings: BotCustomSettings = {
  name: 'AI Assistant',
  welcomeMessage: "Hi there! I'm your AI assistant. How can I help you today?",
  placeholder: 'Type your message...',
  primaryColor: '#2E5BFF',
  darkTheme: true,
  position: 'right',
  showSources: true,
  suggestedQuestions: ['What can you help with?', 'Tell me more'],
  avatar: '🤖',
};

const avatarOptions = ['🤖', '💬', '🧠', '⚡', '✨', '🎯', '🛡️', '🔮'];
const colorOptions = ['#2E5BFF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#F97316'];

export default function BotCustomizer({ botName, onSave }: CustomizerProps) {
  const [settings, setSettings] = useState<BotCustomSettings>({
    ...defaultSettings,
    name: botName || defaultSettings.name,
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [previewInput, setPreviewInput] = useState('');
  const [saved, setSaved] = useState(false);

  const update = (key: keyof BotCustomSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave?.(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSuggestedQuestion = () => {
    if (!newQuestion.trim()) return;
    update('suggestedQuestions', [...settings.suggestedQuestions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const removeSuggestedQuestion = (i: number) => {
    update('suggestedQuestions', settings.suggestedQuestions.filter((_, idx) => idx !== i));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Settings Panel */}
      <div className="space-y-6">
        {/* General */}
        <div className="bg-bc-surface border border-bc-border rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-bc-text flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-bc-accent" />
            General
          </h3>
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Bot Display Name</Label>
            <Input
              value={settings.name}
              onChange={(e) => update('name', e.target.value)}
              className="bg-bc-surface-light border-bc-border text-bc-text"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Welcome Message</Label>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => update('welcomeMessage', e.target.value)}
              rows={3}
              className="w-full bg-bc-surface-light border border-bc-border rounded-lg p-3 text-[13px] text-bc-text resize-none focus:outline-none focus:ring-1 focus:ring-bc-accent"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Input Placeholder</Label>
            <Input
              value={settings.placeholder}
              onChange={(e) => update('placeholder', e.target.value)}
              className="bg-bc-surface-light border-bc-border text-bc-text"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-bc-surface border border-bc-border rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-bc-text flex items-center gap-2">
            <Palette className="w-4 h-4 text-bc-accent" />
            Appearance
          </h3>

          {/* Avatar */}
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Bot Avatar</Label>
            <div className="flex gap-2 flex-wrap">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => update('avatar', emoji)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    settings.avatar === emoji
                      ? 'ring-2 ring-bc-accent ring-offset-2 ring-offset-bc-surface bg-bc-surface-light'
                      : 'bg-bc-surface-light hover:bg-bc-surface-elevated'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Theme</Label>
            <div className="flex gap-2">
              <button
                onClick={() => update('darkTheme', true)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-all ${
                  settings.darkTheme
                    ? 'border-bc-accent bg-bc-accent/10 text-bc-accent'
                    : 'border-bc-border text-bc-text-muted'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => update('darkTheme', false)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-all ${
                  !settings.darkTheme
                    ? 'border-bc-accent bg-bc-accent/10 text-bc-accent'
                    : 'border-bc-border text-bc-text-muted'
                }`}
              >
                ☀️ Light
              </button>
            </div>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Primary Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => update('primaryColor', color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    settings.primaryColor === color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-bc-surface scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Widget Position */}
          <div className="space-y-2">
            <Label className="text-[13px] text-bc-text-secondary">Widget Position</Label>
            <div className="flex gap-2">
              <button
                onClick={() => update('position', 'left')}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-all ${
                  settings.position === 'left'
                    ? 'border-bc-accent bg-bc-accent/10 text-bc-accent'
                    : 'border-bc-border text-bc-text-muted'
                }`}
              >
                ← Bottom Left
              </button>
              <button
                onClick={() => update('position', 'right')}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border transition-all ${
                  settings.position === 'right'
                    ? 'border-bc-accent bg-bc-accent/10 text-bc-accent'
                    : 'border-bc-border text-bc-text-muted'
                }`}
              >
                Bottom Right →
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="bg-bc-surface border border-bc-border rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-bc-text">Suggested Questions</h3>
          <div className="flex flex-wrap gap-2">
            {settings.suggestedQuestions.map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-bc-surface-light border border-bc-border rounded-full px-3 py-1.5 text-[12px] text-bc-text-secondary"
              >
                {q}
                <button
                  onClick={() => removeSuggestedQuestion(i)}
                  className="text-bc-text-muted hover:text-bc-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSuggestedQuestion()}
              placeholder="Add a suggested question..."
              className="bg-bc-surface-light border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted"
            />
            <Button
              onClick={addSuggestedQuestion}
              variant="outline"
              className="border-bc-border text-bc-text-secondary shrink-0"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Save */}
        <Button
          onClick={handleSave}
          className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white h-11 font-semibold"
        >
          {saved ? '✓ Saved!' : 'Save Customization'}
        </Button>
      </div>

      {/* Live Preview */}
      <div className="sticky top-6">
        <p className="text-[11px] font-bold text-bc-text-muted uppercase tracking-wider mb-3">
          Live Preview
        </p>
        <div
          className={`rounded-2xl overflow-hidden border border-bc-border shadow-2xl w-full max-w-[360px] mx-auto ${
            settings.darkTheme ? 'bg-[#0f0f0f]' : 'bg-white'
          }`}
        >
          {/* Preview Header */}
          <div
            className="flex items-center gap-3 p-4"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {settings.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{settings.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[11px] text-white/80">Online</span>
              </div>
            </div>
          </div>

          {/* Preview Messages */}
          <div className={`p-4 space-y-3 min-h-[200px] ${settings.darkTheme ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
            {/* Bot message */}
            <div className="flex gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                style={{ backgroundColor: settings.primaryColor + '30' }}
              >
                {settings.avatar}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  settings.darkTheme ? 'bg-[#1a1a1a] text-gray-200' : 'bg-white text-gray-800'
                }`}
              >
                {settings.welcomeMessage}
              </div>
            </div>

            {/* Suggested questions */}
            {settings.suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 ml-9">
                {settings.suggestedQuestions.slice(0, 3).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewInput(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
                    style={{
                      borderColor: settings.primaryColor + '50',
                      color: settings.primaryColor,
                      backgroundColor: settings.primaryColor + '10',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* User message if typed */}
            {previewInput && (
              <div className="flex justify-end">
                <div
                  className="max-w-[75%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] text-white"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {previewInput}
                </div>
              </div>
            )}
          </div>

          {/* Preview Input */}
          <div className={`p-3 border-t ${settings.darkTheme ? 'border-white/10 bg-[#0f0f0f]' : 'border-gray-100 bg-white'}`}>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${settings.darkTheme ? 'bg-[#1a1a1a]' : 'bg-gray-50 border border-gray-200'}`}>
              <input
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                placeholder={settings.placeholder}
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-500"
                style={{ color: settings.darkTheme ? '#e5e5e5' : '#1a1a1a' }}
              />
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: previewInput ? settings.primaryColor : 'transparent' }}
              >
                <Send className={`w-3.5 h-3.5 ${previewInput ? 'text-white' : 'text-gray-400'}`} />
              </button>
            </div>
            <p className={`text-[10px] text-center mt-2 ${settings.darkTheme ? 'text-gray-600' : 'text-gray-400'}`}>
              Powered by BotCraftAI
            </p>
          </div>
        </div>

        {/* Widget bubble preview */}
        <div className={`mt-4 flex ${settings.position === 'left' ? 'justify-start' : 'justify-end'}`}>
          <div
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {settings.avatar}
          </div>
        </div>
        <p className="text-[11px] text-bc-text-muted text-center mt-2">Widget bubble ({settings.position})</p>
      </div>
    </div>
  );
}
