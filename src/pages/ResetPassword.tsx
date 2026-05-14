import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Loader2, Bot, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/UserContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    
    try {
      const result = await updatePassword(password);
      if (result.ok) {
        setStatus('success');
        setMessage('Your password has been reset successfully.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bc-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bc-primary to-bc-accent flex items-center justify-center shadow-lg shadow-bc-primary/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            BotCraftAI
          </span>
        </div>

        <div className="bg-bc-card border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bc-primary via-bc-accent to-bc-primary bg-[length:200%_auto] animate-gradient-x opacity-50"></div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Set new password</h2>
          <p className="text-white/60 text-sm mb-8">
            Please enter your new password below.
          </p>

          {status === 'success' ? (
            <div className="bg-bc-success/10 border border-bc-success/20 rounded-xl p-4 mb-6 animate-scale-in text-center">
              <CheckCircle className="w-12 h-12 text-bc-success mx-auto mb-4" />
              <h3 className="text-bc-success font-bold text-lg">Success!</h3>
              <p className="text-bc-success/80 text-sm mt-1">{message}</p>
              <p className="text-white/40 text-xs mt-4">Redirecting to login...</p>
              <Link 
                to="/login" 
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-bc-success text-white font-semibold shadow-lg shadow-bc-success/20 transition-all hover:brightness-110"
              >
                Login Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-bc-error/10 border border-bc-error/20 rounded-xl p-4 animate-shake">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-bc-error" />
                    <p className="text-bc-error text-sm">{message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2 ml-1">New Password</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-bc-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-bc-primary/20 focus:border-bc-primary transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2 ml-1">Confirm New Password</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-bc-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-bc-primary/20 focus:border-bc-primary transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-bc-primary to-bc-accent text-white font-semibold rounded-xl shadow-lg shadow-bc-primary/25 hover:shadow-bc-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
