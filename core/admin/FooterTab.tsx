import React from 'react';
import { SiteConfig } from '../types.ts';

interface FooterTabProps {
  footer: SiteConfig['footer'];
  updateFooterField: (field: string, value: any) => void;
  addSupportLink: () => void;
  updateSupportLink: (index: number, field: 'label' | 'path', value: string) => void;
  deleteSupportLink: (index: number) => void;
}

const FooterTab: React.FC<FooterTabProps> = ({ 
  footer, 
  updateFooterField, 
  addSupportLink, 
  updateSupportLink, 
  deleteSupportLink 
}) => {
  const handleDeleteLink = (idx: number, label: string) => {
    if (window.confirm(`Delete link "${label}"?`)) {
      deleteSupportLink(idx);
    }
  };

  const supportLinks = footer?.supportLinks || [];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex items-center gap-6 mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Footer Architecture</h2>
        <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
            <i className="fa-solid fa-font"></i> CONTENT & LABELS
          </h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Description</label>
              <textarea value={footer.brandDescription} onChange={e => updateFooterField('brandDescription', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium resize-none" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nav Column Label</label>
                <input value={footer.quickLinksLabel} onChange={e => updateFooterField('quickLinksLabel', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resources Column Label</label>
                <input value={footer.supportLinksLabel} onChange={e => updateFooterField('supportLinksLabel', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reach Us Label</label>
                <input value={footer.reachUsLabel} onChange={e => updateFooterField('reachUsLabel', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bottom Footer Text</label>
                <input value={footer.bottomText} onChange={e => updateFooterField('bottomText', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 font-medium" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
              <i className="fa-solid fa-link"></i> RESOURCE LINKS
            </h3>
            <button onClick={addSupportLink} className="bg-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95">ADD LINK</button>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {supportLinks.map((link, idx) => (
              <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2 group relative">
                <button onClick={() => handleDeleteLink(idx, link.label)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-trash-can text-xs"></i></button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Label</label>
                    <input value={link.label} onChange={e => updateSupportLink(idx, 'label', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest">URL/Path</label>
                    <input value={link.path} onChange={e => updateSupportLink(idx, 'path', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-500 font-mono" />
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

export default FooterTab;