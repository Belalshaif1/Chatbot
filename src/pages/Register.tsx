import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Hexagon, Mail, Lock, User, ArrowRight, ShieldCheck,
  Eye, EyeOff, CheckCircle2, Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/UserContext';
import { useLang } from '@/context/LangContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, lang, setLang, isRTL } = useLang();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = [
    '', t.register.strength.weak, t.register.strength.fair,
    t.register.strength.good, t.register.strength.strong,
  ];
  const strengthColor = ['', 'bg-bc-error', 'bg-bc-warning', 'bg-blue-500', 'bg-bc-success'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError(t.register.errors.passwordMismatch);
      return;
    }
    setIsLoading(true);
    try {
      const result = await register(form.name, form.email, form.password);
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

      <div className={`relative z-10 w-full max-w-[460px] ${isRTL ? 'text-right' : ''}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-bc-surface border border-bc-border flex items-center justify-center mb-5 shadow-card">
            <Hexagon className="w-8 h-8 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
          </div>
          <h1 className="font-display text-3xl font-bold text-bc-text">
            BotCraft<span className="text-bc-accent">AI</span>
          </h1>
          <p className="text-bc-text-secondary mt-2 text-center max-w-[320px] text-sm">
            {t.register.subtitle}
          </p>
        </div>

        <div className="bg-bc-surface border border-bc-border rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className={`text-[13px] font-medium text-bc-text-secondary ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.register.fullName}
              </Label>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted`} />
                <Input
                  id="name" type="text"
                  placeholder={t.register.fullNamePlaceholder}
                  required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${isRTL ? 'pr-11 text-right' : 'pl-11'} bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl`}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="reg-email" className={`text-[13px] font-medium text-bc-text-secondary ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.register.email}
              </Label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted`} />
                <Input
                  id="reg-email" type="email"
                  placeholder={t.register.emailPlaceholder}
                  required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`${isRTL ? 'pr-11 text-right' : 'pl-11'} bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="reg-password" className={`text-[13px] font-medium text-bc-text-secondary ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.register.password}
              </Label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted`} />
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.register.passwordPlaceholder}
                  required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${isRTL ? 'pr-11 pl-11 text-right' : 'pl-11 pr-11'} bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-bc-text-muted hover:text-bc-text`}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="space-y-1 mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-bc-surface-light'}`} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-medium ${strength >= 3 ? 'text-bc-success' : strength >= 2 ? 'text-blue-400' : 'text-bc-warning'}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-2">
              <Label htmlFor="confirm" className={`text-[13px] font-medium text-bc-text-secondary ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.register.confirmPassword}
              </Label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted`} />
                <Input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.register.confirmPlaceholder}
                  required value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`${isRTL ? 'pr-11 text-right' : 'pl-11'} bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl ${
                    form.confirmPassword && form.password !== form.confirmPassword ? 'border-bc-error' :
                    form.confirmPassword && form.password === form.confirmPassword ? 'border-bc-success' : ''
                  }`}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-bc-success`} />
                )}
              </div>
            </div>

            {error && (
              <div className="bg-bc-error/10 border border-bc-error/30 rounded-xl px-4 py-3">
                <p className="text-[13px] text-bc-error">{error}</p>
              </div>
            )}

            <Button
              type="submit" disabled={isLoading}
              className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white h-12 rounded-xl font-semibold shadow-glow group transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t.register.createAccount}
                  <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              )}
            </Button>

            <p className="text-[11px] text-bc-text-muted text-center leading-relaxed">
              {t.register.termsPrefix}{' '}
              <Link to="#" className="text-bc-accent hover:underline">{t.register.terms}</Link>{' '}
              {t.register.and}{' '}
              <Link to="#" className="text-bc-accent hover:underline">{t.register.privacy}</Link>.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-bc-border text-center">
            <p className="text-[13px] text-bc-text-muted">
              {t.register.alreadyHave}{' '}
              <Link to="/login" className="font-semibold text-bc-accent hover:underline">
                {t.register.signIn}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">{t.register.freePlan}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
