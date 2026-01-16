
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SiteConfig } from '../types';

interface HeaderProps {
  config: SiteConfig;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ config, isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const logoUrl = config.logo || "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png";
  const alert = config.admissionAlert || { enabled: false, text: '', subtext: '', linkText: '', linkPath: '/enroll' };

  const isInternalLink = (path: string) => {
    if (!path) return false;
    return path.startsWith('#') || path.startsWith('/') || path.includes(window.location.origin);
  };

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    if (path.startsWith('#/')) return path.substring(1);
    if (path.startsWith('#') && !path.startsWith('#/')) return `/${path}`;
    return path;
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `relative text-[11px] font-black uppercase tracking-widest transition-all duration-300 py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg ${
      isActive 
        ? 'text-emerald-600' 
        : 'text-slate-600 hover:text-emerald-600'
    }`;

  const btnNavAction = "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30";
  
  // Dedicated styling for the Enroll primary action
  const btnEnroll = "px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:bg-emerald-500 active:scale-95 shadow-emerald-600/10";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      {/* Top Notification Bar - Controlled via Admin Dashboard */}
      {alert.enabled && (
        <div className="bg-slate-900 text-white py-2 px-4 border-b border-white/5 h-8 md:h-10 flex items-center">
          <div className="container mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-emerald-400">{alert.text}</span>
               <span className="hidden md:inline text-slate-300">{alert.subtext}</span>
            </div>
            <Link to={alert.linkPath} className="text-emerald-400 hover:text-white transition-colors underline decoration-1 underline-offset-4 flex items-center gap-2">
              {alert.linkText} <i className="fa-solid fa-chevron-right text-[7px]"></i>
            </Link>
          </div>
        </div>
      )}

      {/* Main Header Row */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 h-20 md:h-24 flex items-center shadow-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 md:gap-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl" aria-label={`${config.name} - Institutional Home`}>
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all group-hover:scale-105">
              <img 
                src={logoUrl} 
                alt="" 
                className="w-full h-full object-contain"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base md:text-2xl text-emerald-600 tracking-tighter uppercase whitespace-nowrap">
                {config.name}
              </span>
              <span className="text-[7px] md:text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mt-0.5">
                {config.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            {config.navigation.map((item) => {
              const isInternal = isInternalLink(item.path);
              const cleanPath = getCleanPath(item.path);
              
              return isInternal ? (
                <NavLink
                  key={item.label}
                  to={cleanPath}
                  className={navLinkClasses}
                  end={cleanPath === '/'}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${location.pathname === cleanPath ? 'scale-x-100' : ''}`}></span>
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-slate-600 hover:text-emerald-600 font-black transition-colors text-[11px] uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-2 py-1"
                >
                  {item.label}
                </a>
              );
            })}
            
            {/* Enroll Section Partition */}
            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <Link to="/enroll" className={btnEnroll}>
              Enroll Now
            </Link>

            <Link
              to={isAuthenticated ? "/admin" : "/login"}
              className={`${btnNavAction} ${
                location.pathname === '/login' || location.pathname === '/admin'
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                  : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/10'
              }`}
            >
              <i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-user-gear'} mr-2`} aria-hidden="true"></i>
              {isAuthenticated ? "Dashboard" : (config.loginLabel || "Login")}
            </Link>
          </nav>

          {/* Mobile Menu Toggle & Action */}
          <div className="flex lg:hidden items-center gap-3">
             <Link to="/enroll" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                Enroll
             </Link>
             <button 
                className="w-10 h-10 flex flex-col items-center justify-center text-slate-900 bg-slate-50 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group z-[110]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle Navigation Menu"
              >
                <div className="relative w-5 h-4">
                  <span className={`absolute left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
                  <span className={`absolute left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out top-2 ${isMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100'}`}></span>
                  <span className={`absolute left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
                </div>
              </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-28 md:top-34 bg-white border-t border-slate-100 shadow-3xl animate-fade-in-down z-[90] overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="flex flex-col p-8 space-y-4">
            {config.navigation.map((item) => {
              const isInternal = isInternalLink(item.path);
              const cleanPath = getCleanPath(item.path);

              return isInternal ? (
                <NavLink
                  key={item.label}
                  to={cleanPath}
                  end={cleanPath === '/'}
                  className={({ isActive }) => 
                    `font-black text-lg uppercase tracking-widest px-6 py-5 rounded-2xl transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-900 hover:bg-slate-50'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-slate-900 font-black text-lg uppercase tracking-widest px-6 py-5 hover:bg-slate-50 rounded-2xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            
            <div className="h-px bg-slate-100 my-2"></div>

            <Link
              to="/enroll"
              className="bg-emerald-600 text-white font-black py-6 rounded-3xl text-center shadow-2xl uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fa-solid fa-graduation-cap mr-2"></i> Start Application
            </Link>

            <Link
              to={isAuthenticated ? "/admin" : "/login"}
              className="bg-slate-900 text-white font-black py-6 rounded-3xl text-center shadow-2xl uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className={`fa-solid ${isAuthenticated ? 'fa-gauge-high' : 'fa-lock'} mr-2`} aria-hidden="true"></i>
              {isAuthenticated ? "Go to Dashboard" : "Institutional Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
