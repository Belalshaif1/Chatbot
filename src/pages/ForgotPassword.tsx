import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Bot, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/UserContext';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus('idle');
    
    try {
      const result = await forgotPassword(email);
      if (result.ok) {
        setStatus('success');
        setMessage(result.message);
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
          
          <h2 className="text-2xl font-bold text-white mb-2">Forgot password?</h2>
          <p className="text-white/60 text-sm mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {status === 'success' ? (
            <div className="bg-bc-success/10 border border-bc-success/20 rounded-xl p-4 mb-6 animate-scale-in">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-bc-success mt-0.5" />
                <div>
                  <p className="text-bc-success font-medium">Email Sent!</p>
                  <p className="text-bc-success/80 text-sm mt-1">{message}</p>
                </div>
              </div>
              <Link 
                to="/login" 
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
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

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2 ml-1">Email Address</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-bc-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-bc-primary/20 focus:border-bc-primary transition-all"
                    placeholder="name@example.com"
                  />
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
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-all mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
