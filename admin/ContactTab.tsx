
import React from 'react';
import { SiteConfig, SocialLink } from '../types.ts';

interface ContactTabProps {
  contact: SiteConfig['contact'];
  social: SiteConfig['social'];
  updateContactField: (field: string, value: any) => void;
  addSocialLink: () => void;
  updateSocialLink: (id: string, field: keyof SocialLink, value: string) => void;
  removeSocialLink: (id: string) => void;
}

const ContactTab: React.FC<ContactTabProps> = ({ 
  contact, 
  social, 
  updateContactField, 
  addSocialLink, 
  updateSocialLink, 
  removeSocialLink 
}) => {
  const handleUrlUpdate = (id: string, value: string) => {
    // We allow the user to type, but highlight if it doesn't look like a URL
    updateSocialLink(id, 'url', value);
  };

  const handleRemoveSocial = (id: string, platform: string) => {
    if (window.confirm(`Remove ${platform} link?`)) {
      removeSocialLink(id);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex items-center gap-6 mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Contact & Reachability</h2>
        <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
            <i className="fa-solid fa-envelope-open-text"></i> CORE CONTACT
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Physical Address</label>
              <textarea value={contact.address} onChange={e => updateContactField('address', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium resize-none" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                <input value={contact.phone} onChange={e => updateContactField('phone', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                <input value={contact.email} onChange={e => updateContactField('email', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Google Maps Embed URL</label>
              <input value={contact.mapUrl} onChange={e => updateContactField('mapUrl', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-emerald-400 font-mono" placeholder="Paste iframe src..." />
              {!contact.mapUrl.startsWith('https://') && contact.mapUrl.length > 0 && <p className="text-[9px] text-red-400 font-bold uppercase mt-1 tracking-widest">Invalid URL format (must start with https://)</p>}
            </div>
          </div>
        </div>

        <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
              <i className="fa-solid fa-share-nodes"></i> SOCIAL MEDIA
            </h3>
            <button onClick={addSocialLink} className="px-4 py-1.5 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95">ADD SOCIAL</button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {social.map((s) => (
              <div key={s.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 relative group">
                <button onClick={() => handleRemoveSocial(s.id, s.platform)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><i className="fa-solid fa-trash-can text-xs"></i></button>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Platform</label>
                    <input value={s.platform} onChange={e => updateSocialLink(s.id, 'platform', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">FA Icon</label>
                    <input value={s.icon} onChange={e => updateSocialLink(s.id, 'icon', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-500 font-mono" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct URL</label>
                  <input value={s.url} onChange={e => handleUrlUpdate(s.id, e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300" />
                  {!s.url.startsWith('http') && s.url.length > 4 && <p className="text-[8px] text-red-400 font-black uppercase mt-1 tracking-widest italic">Broken URL format</p>}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center gap-3">
                   <span className="text-[9px] font-bold text-slate-500 uppercase">Preview:</span>
                   <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-emerald-500 border border-slate-700">
                     <i className={`fa-brands ${s.icon}`}></i>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
