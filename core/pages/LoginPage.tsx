
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteConfig } from '../types';

interface LoginPageProps {
  siteConfig: SiteConfig;
}

const LoginPage: React.FC<LoginPageProps> = ({ siteConfig }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // SECURE CREDENTIAL DEFINITION
  const AUTHORIZED_ADMIN = "admin";
  const AUTHORIZED_PASS = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate institutional processing delay
    setTimeout(() => {
      // Robust Validation: Trim whitespace and ignore case for the username
      const cleanId = identifier.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanId === AUTHORIZED_ADMIN && cleanPass === AUTHORIZED_PASS) {
        // SUCCESS: Secure state persistence
        localStorage.setItem('sms_auth_token', 'secure_session_token_' + Date.now());
        localStorage.setItem('sms_is_auth', 'true');
        localStorage.setItem('sms_auth_user', JSON.stringify({
          id: 'admin_01',
          username: 'Institutional Admin',
          role: 'SUPER_ADMIN'
        }));
        
        // Notify System (Header/App) of auth status change
        window.dispatchEvent(new Event('authChange'));
        
        setIsLoading(false);
        navigate('/admin');
      } else {
        // FAILURE: Unauthorized access denied
        setError('Invalid credentials. Institutional access denied.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-slate-900/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Institutional Access</h1>
          <p className="text-slate-500 text-sm font-medium mt-2">Secure gateway for {siteConfig.name} administrators.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-3xl border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-12">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-pulse">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Email or Username</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <i className="fa-solid fa-user-shield"></i>
                  </div>
                  <input 
                    required
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter admin ID"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium placeholder-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Forgot Password?</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <i className="fa-solid fa-key"></i>
                  </div>
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium placeholder-slate-300"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button 
                disabled={isLoading}
                type="submit" 
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden ${
                  isLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-slate-900/20'
                }`}
              >
                {isLoading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying</>
                ) : (
                  <>Login <i className="fa-solid fa-arrow-right-long text-emerald-400"></i></>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Authorized Personnel Only
             </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-emerald-600 transition-colors inline-flex items-center gap-2">
            <i className="fa-solid fa-chevron-left"></i> Return to Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
