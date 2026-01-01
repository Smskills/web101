
import React from 'react';
import { AppState } from '../types.ts';

interface SiteTabProps {
  data: AppState['site'];
  updateField: (field: string, value: any) => void;
  onLogoUploadClick: () => void;
  updateNavigation: (index: number, field: 'label' | 'path', value: string) => void;
  addNavigation: () => void;
  removeNavigation: (index: number) => void;
}

const SiteTab: React.FC<SiteTabProps> = ({ 
  data, 
  updateField, 
  onLogoUploadClick, 
  updateNavigation, 
  addNavigation, 
  removeNavigation 
}) => (
  <div className="space-y-12 animate-fade-in">
    <div className="flex items-center gap-6 mb-8">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Brand Identity</h2>
      <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
    </div>
    
    <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700">
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
        <div className="space-y-4 text-center md:text-left">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Institutional Logo</label>
          <div 
            onClick={onLogoUploadClick}
            className="w-48 h-32 bg-white rounded-3xl border-2 border-slate-700 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-center p-4 overflow-hidden group relative"
          >
            <img 
              src={data.logo || "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png"} 
              alt="Logo Preview" 
              className="max-w-full max-h-full object-contain transition-opacity group-hover:opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <span className="text-white font-black text-[10px] uppercase tracking-widest bg-emerald-600 px-3 py-1.5 rounded-full shadow-2xl">
                Update PNG
              </span>
            </div>
          </div>
        </div>

        <div className="flex-grow space-y-8 w-full">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institute Name</label>
            <input 
              value={data.name} 
              onChange={e => updateField('name', e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black focus:border-emerald-500 outline-none transition-colors" 
              placeholder="e.g. SM Skills Training Institute"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Tagline</label>
              <input 
                value={data.tagline} 
                onChange={e => updateField('tagline', e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black focus:border-emerald-500 outline-none transition-colors" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Header Login Button Text</label>
              <input 
                value={data.loginLabel || "Institutional Login"} 
                onChange={e => updateField('loginLabel', e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black focus:border-emerald-500 outline-none transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Navigation Editor */}
    <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
      <div className="flex justify-between items-center">
        <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
          <i className="fa-solid fa-compass"></i> HEADER NAVIGATION
        </h3>
        <button onClick={addNavigation} className="bg-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">ADD LINK</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.navigation.map((nav, idx) => (
          <div key={idx} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4 group relative">
            <button 
              onClick={() => removeNavigation(idx)} 
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl hover:bg-red-500"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Label</label>
                <input 
                  value={nav.label} 
                  onChange={e => updateNavigation(idx, 'label', e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Path</label>
                <input 
                  value={nav.path} 
                  onChange={e => updateNavigation(idx, 'path', e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-500 font-mono" 
                  placeholder="/courses"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-6">
      <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-xl shadow-lg shrink-0">
        <i className="fa-solid fa-wand-magic-sparkles"></i>
      </div>
      <div>
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Navigation Helper</p>
        <p className="text-emerald-200/70 text-xs font-medium italic">
          Internal paths should start with a slash (e.g. /courses). Using standard paths ensures consistent redirection across all local and remote environments.
        </p>
      </div>
    </div>
  </div>
);

export default SiteTab;
