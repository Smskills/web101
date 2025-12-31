
import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  // Defensive fallbacks for data sanity
  const socialLinks = Array.isArray(config.social) ? config.social : [];
  const navigationLinks = Array.isArray(config.navigation) ? config.navigation : [];
  const supportLinks = Array.isArray(config.footer?.supportLinks) ? config.footer.supportLinks : [];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-xl font-bold mb-4">{config.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {config.footer?.brandDescription || 'Empowering professional education for over a decade.'}
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(social => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-md"
                  title={social.platform}
                >
                  <i className={`fa-brands ${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">{config.footer?.quickLinksLabel || 'Quick Links'}</h4>
            <ul className="space-y-4 text-sm">
              {navigationLinks.map(nav => (
                <li key={nav.label}>
                  <a href={nav.path} className="hover:text-white transition-colors">{nav.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">{config.footer?.supportLinksLabel || 'Support'}</h4>
            <ul className="space-y-4 text-sm">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-6">{config.footer?.reachUsLabel || 'Reach Us'}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-emerald-500"></i>
                <span>{config.contact?.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-emerald-500"></i>
                <span>{config.contact?.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fa-solid fa-envelope text-emerald-500"></i>
                <span>{config.contact?.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {config.name}. All rights reserved.</p>
          <p className="mt-4 md:mt-0">{config.footer?.bottomText || 'Design & Architecture by Senior Architect'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
