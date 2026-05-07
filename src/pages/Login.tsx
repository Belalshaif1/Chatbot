import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, Mail, Lock, ArrowRight, Bot, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      
      if (success) {
        navigate('/dashboard');
      } else {
        // This is handled by login logic for now
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bc-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-bc-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-bc-surface border border-bc-border flex items-center justify-center mb-6 shadow-card">
            <Hexagon className="w-8 h-8 text-bc-accent fill-bc-accent/20" strokeWidth={2} />
          </div>
          <h1 className="font-display text-3xl font-bold text-bc-text">
            BotCraft<span className="text-bc-accent">AI</span>
          </h1>
          <p className="text-bc-text-secondary mt-2 text-center max-w-[320px]">
            Welcome back! Log in to manage your AI chatbots and data sources.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-bc-surface border border-bc-border rounded-2xl p-8 shadow-card backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-bc-text-secondary ml-1">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-bc-text-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl focus:ring-bc-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label htmlFor="password" className="text-[13px] font-medium text-bc-text-secondary">
                  Password
                </Label>
                <Link to="#" className="text-[11px] font-semibold text-bc-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-bc-text-muted" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-12 rounded-xl focus:ring-bc-accent"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white h-12 rounded-xl font-semibold shadow-glow group transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-bc-border text-center">
            <p className="text-[13px] text-bc-text-muted">
              Don't have an account?{' '}
              <Link to="/" className="font-semibold text-bc-accent hover:underline">
                Start for free
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <Bot className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">GPT-4 Turbo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
