
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteConfig } from '../types';

interface HeaderProps {
  config: SiteConfig;
}

const Header: React.FC<HeaderProps> = ({ config }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoUrl = config.logo || "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png";

  const isInternalLink = (path: string) => {
    if (!path) return false;
    return path.startsWith('#/') || path.startsWith('/') || path.includes(window.location.origin);
  };

  const getCleanPath = (path: string) => {
    if (!path) return '/';
    // Remove both #/ and # prefixes for Link component
    if (path.startsWith('#/')) return path.substring(1);
    if (path.startsWith('#')) return path.substring(1);
    return path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-32 transition-all">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-6 group">
          <div className="w-40 h-28 flex items-center justify-center transition-all group-hover:scale-105">
            <img 
              src={logoUrl} 
              alt={config.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight -ml-2">
            <span className="font-black text-2xl md:text-3xl text-slate-900 tracking-tighter uppercase whitespace-nowrap">
              {config.name}
            </span>
            <span className="text-[10px] md:text-xs text-emerald-600 font-black uppercase tracking-[0.3em] mt-1">
              {config.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-10">
          {config.navigation.map((item) => {
            const isInternal = isInternalLink(item.path);
            const cleanPath = getCleanPath(item.path);
            
            return isInternal ? (
              <Link
                key={item.label}
                to={cleanPath}
                className="text-slate-600 hover:text-emerald-600 font-black transition-colors text-[11px] uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.path}
                className="text-slate-600 hover:text-emerald-600 font-black transition-colors text-[11px] uppercase tracking-widest"
              >
                {item.label}
              </a>
            );
          })}
          <Link
            to="/admin"
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl active:scale-95"
          >
            <i className="fa-solid fa-user-gear mr-2"></i>
            {config.loginLabel || "Login"}
          </Link>
        </nav>

        <button 
          className="lg:hidden text-slate-900 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-3xl`}></i>
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-32 left-0 right-0 bg-white border-t border-slate-100 shadow-3xl animate-fade-in-down overflow-hidden">
          <div className="flex flex-col p-8 space-y-6">
            {config.navigation.map((item) => {
              const isInternal = isInternalLink(item.path);
              const cleanPath = getCleanPath(item.path);

              return isInternal ? (
                <Link
                  key={item.label}
                  to={cleanPath}
                  className="text-slate-900 font-black text-lg uppercase tracking-widest px-4 py-4 hover:bg-slate-50 rounded-2xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-slate-900 font-black text-lg uppercase tracking-widest px-4 py-4 hover:bg-slate-50 rounded-2xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              to="/admin"
              className="bg-emerald-600 text-white font-black py-6 rounded-3xl text-center shadow-2xl mt-4 uppercase tracking-[0.2em] text-xs"
              onClick={() => setIsMenuOpen(false)}
            >
              {config.loginLabel || "Institutional Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
