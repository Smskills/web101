
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface ForgotPasswordPageProps {
  siteConfig: SiteConfig;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ siteConfig }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || 'Unable to process request.');
      }
    } catch (err) {
      setError('Connection Error: Institutional server offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Recover Access</h1>
          <p className="text-slate-500 text-sm font-medium mt-2">Reset your {siteConfig.name} administrator password.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-12">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-xl">
                  <i className="fa-solid fa-paper-plane-top"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Link Dispatched</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Check your inbox. We've sent a secure recovery link to <span className="font-bold text-slate-900">{email}</span>.
                  </p>
                </div>
                <Link to="/login" className="block w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Registered Email</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <input 
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@sm-skills.edu"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  type="submit" 
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    isLoading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing</> : 'Send Recovery Link'}
                </button>

                <div className="text-center pt-2">
                  <Link to="/login" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600">
                    Nevermind, I remember it
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
