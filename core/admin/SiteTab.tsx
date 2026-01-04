import React from 'react';
import { AppState } from '../types.ts';

interface SiteTabProps {
  data: AppState['site'];
  theme: AppState['theme'];
  updateField: (field: string, value: any) => void;
  updateTheme: (field: string, value: any) => void;
  onLogoUploadClick: () => void;
  updateNavigation: (index: number, field: 'label' | 'path', value: string) => void;
  addNavigation: () => void;
  removeNavigation: (index: number) => void;
  onExport: () => void;
  onImport: () => void;
}

const SiteTab: React.FC<SiteTabProps> = ({ 
  data, 
  theme,
  updateField, 
  updateTheme,
  onLogoUploadClick, 
  updateNavigation, 
  addNavigation, 
  removeNavigation,
  onExport,
  onImport
}) => {
  const handleRemoveNav = (idx: number, label: string) => {
    if (window.confirm(`Remove "${label}" link?`)) removeNavigation(idx);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Site & Branding</h2>
        <div className="flex items-center gap-2">
           <button onClick={onImport} className="text-[10px] font-black bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors">IMPORT BACKUP</button>
           <button onClick={onExport} className="text-[10px] font-black bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors">EXPORT BACKUP</button>
        </div>
      </div>
      
      {/* Identity */}
      <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
          <div className="space-y-4 text-center md:text-left">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Institutional Logo</label>
            <div onClick={onLogoUploadClick} className="w-48 h-32 bg-white rounded-3xl border-2 border-slate-700 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-center p-4 overflow-hidden group relative">
              <img src={data.logo} className="max-w-full max-h-full object-contain group-hover:opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-black text-[10px] uppercase">Update PNG</div>
            </div>
          </div>

          <div className="flex-grow space-y-8 w-full">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institute Name</label>
              <input value={data.name} onChange={e => updateField('name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Tagline</label>
              <input value={data.tagline} onChange={e => updateField('tagline', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Global Theme Engine */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-palette"></i> THEME ENGINE</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Primary Brand</label>
            <div className="flex items-center gap-4">
              <input type="color" value={theme.primary} onChange={e => updateTheme('primary', e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer rounded-lg overflow-hidden border-2 border-slate-700" />
              <span className="text-xs font-mono text-slate-400 uppercase">{theme.primary}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Backgrounds</label>
            <div className="flex items-center gap-4">
              <input type="color" value={theme.secondary} onChange={e => updateTheme('secondary', e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer rounded-lg overflow-hidden border-2 border-slate-700" />
              <span className="text-xs font-mono text-slate-400 uppercase">{theme.secondary}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Accents</label>
            <div className="flex items-center gap-4">
              <input type="color" value={theme.accent} onChange={e => updateTheme('accent', e.target.value)} className="w-12 h-12 bg-transparent cursor-pointer rounded-lg overflow-hidden border-2 border-slate-700" />
              <span className="text-xs font-mono text-slate-400 uppercase">{theme.accent}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Corner Radius</label>
            <select value={theme.radius} onChange={e => updateTheme('radius', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-black tracking-widest">
               <option value="none">Sharp (0px)</option>
               <option value="small">Sleek (8px)</option>
               <option value="medium">Modern (16px)</option>
               <option value="large">Institutional (40px)</option>
               <option value="full">Round Pill</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Editor */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <div className="flex justify-between items-center">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-compass"></i> NAVIGATION</h3>
          <button onClick={addNavigation} className="bg-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">ADD LINK</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.navigation.map((nav, idx) => (
            <div key={idx} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 group relative">
              <button onClick={() => handleRemoveNav(idx, nav.label)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><i className="fa-solid fa-trash-can text-xs"></i></button>
              <div className="grid grid-cols-1 gap-3">
                  <input value={nav.label} onChange={e => updateNavigation(idx, 'label', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" placeholder="Label" />
                  <input value={nav.path} onChange={e => updateNavigation(idx, 'path', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-500 font-mono" placeholder="/path" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteTab;