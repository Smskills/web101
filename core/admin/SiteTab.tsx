
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
  onImport: (content: string) => void;
}

const SiteTab: React.FC<SiteTabProps> = ({ 
  data, theme, updateField, updateTheme, onLogoUploadClick, 
  updateNavigation, addNavigation, removeNavigation 
}) => {
  const handleEmailsChange = (val: string) => {
    const emails = val.split(',').map(e => e.trim()).filter(e => e.includes('@'));
    updateField('notificationEmails', emails);
  };

  const updateAlert = (field: string, value: any) => {
    const currentAlert = data.admissionAlert || { enabled: false, text: '', subtext: '', linkText: '', linkPath: '/enroll' };
    updateField('admissionAlert', { ...currentAlert, [field]: value });
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Institutional Branding</h2>
      </div>
      
      <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-10">
          <div className="space-y-4 text-center md:text-left">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block ml-1">Institutional Logo</label>
            <div onClick={onLogoUploadClick} className="w-48 h-32 bg-white rounded-3xl border-2 border-slate-700 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-center p-4 overflow-hidden group relative">
              <img src={data.logo} className="max-w-full max-h-full object-contain group-hover:opacity-40" alt="Current Logo" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-black text-[10px] uppercase">Update PNG</div>
            </div>
          </div>

          <div className="flex-grow space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institute Name</label>
                    <input value={data.name} onChange={e => updateField('name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Tagline</label>
                    <input value={data.tagline} onChange={e => updateField('tagline', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white font-black outline-none focus:border-emerald-500" />
                </div>
            </div>

            <div className="space-y-3 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <i className="fa-solid fa-envelope-circle-check"></i> Lead Notifications
                </label>
                <input 
                    defaultValue={(data.notificationEmails || []).join(', ')} 
                    onBlur={e => handleEmailsChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-6 py-4 text-slate-200 font-mono text-xs focus:border-emerald-500 outline-none"
                    placeholder="e.g. registrar@sm-skills.edu"
                />
                <p className="text-[8px] text-slate-500 font-bold uppercase mt-1 ml-1 tracking-[0.2em]">Enquiry alerts will be dispatched to these addresses.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admission Alert Management */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <div className="flex justify-between items-center">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-bullhorn"></i> ADMISSION TOP BAR</h3>
          <button 
            onClick={() => updateAlert('enabled', !(data.admissionAlert?.enabled))} 
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${data.admissionAlert?.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            {data.admissionAlert?.enabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alert Headline</label>
              <input value={data.admissionAlert?.text} onChange={e => updateAlert('text', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold outline-none focus:border-emerald-500" placeholder="e.g. 2024 Admissions Now Open:" />
          </div>
          <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alert Description</label>
              <input value={data.admissionAlert?.subtext} onChange={e => updateAlert('subtext', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white font-medium outline-none focus:border-emerald-500" placeholder="e.g. Secure your future with our vocational tracks." />
          </div>
          <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Link Button Text</label>
              <input value={data.admissionAlert?.linkText} onChange={e => updateAlert('linkText', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold outline-none focus:border-emerald-500" placeholder="Apply Today" />
          </div>
          <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Link Path</label>
              <input value={data.admissionAlert?.linkPath} onChange={e => updateAlert('linkPath', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-emerald-400 font-mono text-xs outline-none focus:border-emerald-500" placeholder="/enroll" />
          </div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4">
           <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
           <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">The status dot is set to institutional red for high urgency visibility.</p>
        </div>
      </div>

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
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Corner Radius</label>
            <select value={theme.radius} onChange={e => updateTheme('radius', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase font-black tracking-widest">
               <option value="none">Sharp</option>
               <option value="small">Sleek</option>
               <option value="medium">Modern</option>
               <option value="large">Institutional</option>
               <option value="full">Round Pill</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteTab;
