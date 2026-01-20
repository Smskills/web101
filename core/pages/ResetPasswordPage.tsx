
import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { SiteConfig } from '../types';

interface ResetPasswordPageProps {
  siteConfig: SiteConfig;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ siteConfig }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError('Invalid or missing recovery token.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.message || 'Unable to reset password.');
      }
    } catch (err) {
      setError('Connection Error: Institutional server offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Define New Credentials</h1>
          <p className="text-slate-500 text-sm font-medium mt-2">Set your new administrative password below.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-12">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-xl">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Access Restored</h3>
                  <p className="text-slate-500 text-sm font-medium">Your password has been updated. Redirecting to login...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!token && (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-700 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    Session Invalid: Token Missing
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">New Password</label>
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Confirm New Password</label>
                  <input 
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  disabled={isLoading || !token}
                  type="submit" 
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    isLoading || !token ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
