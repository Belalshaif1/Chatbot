import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, Mail, Lock, ArrowRight, Bot, ShieldCheck, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/UserContext';
import { useLang } from '@/context/LangContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, lang, setLang, isRTL } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) navigate('/dashboard');
      else setError(result.message);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bc-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-bc-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bc-surface border border-bc-border text-[12px] font-medium text-bc-text-secondary hover:text-bc-text hover:bg-bc-surface-light transition-colors z-10`}
      >
        <Languages className="w-3.5 h-3.5" />
        {lang === 'en' ? 'العربية' : 'English'}
      </button>

      <div className={`relative z-10 w-full max-w-[440px] ${isRTL ? 'text-right' : ''}`}>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-bc-surface border border-bc-border flex items-center justify-center mb-6 shadow-card">
            <Hexagon className="w-8 h-8 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
          </div>
          <h1 className="font-display text-3xl font-bold text-bc-text">
            BotCraft<span className="text-bc-accent">AI</span>
          </h1>
          <p className="text-bc-text-secondary mt-2 text-center max-w-[320px]">
            {t.login.subtitle}
          </p>
        </div>

        <div className="bg-bc-surface border border-bc-border rounded-2xl p-8 shadow-card backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className={`text-[13px] font-medium text-bc-text-secondary ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.login.email}
              </Label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted`} />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.login.emailPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${isRTL ? 'pr-11 text-right' : 'pl-11'} bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 mr-1">
                <Label htmlFor="password" className="text-[13px] font-medium text-bc-text-secondary">
                  {t.login.password}
                </Label>
                <Link to="/forgot-password" className="text-[12px] text-bc-accent hover:underline">
                  {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted`} />
                <Input
                  id="password"
                  type="password"
                  placeholder={t.login.passwordPlaceholder}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${isRTL ? 'pr-11 text-right' : 'pl-11'} bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl`}
                />
              </div>
            </div>

            {error && (
              <div className="bg-bc-error/10 border border-bc-error/30 rounded-xl px-4 py-3">
                <p className="text-[13px] text-bc-error">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white h-12 rounded-xl font-semibold shadow-glow group transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t.login.signIn}
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-bc-border text-center">
            <p className="text-[13px] text-bc-text-muted">
              {t.login.noAccount}{' '}
              <Link to="/register" className="font-semibold text-bc-accent hover:underline">
                {t.login.createFree}
              </Link>
            </p>
          </div>
        </div>

        <div className={`flex items-center justify-center gap-6 mt-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.login.secureLogin}</span>
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <Bot className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.login.aiPowered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
