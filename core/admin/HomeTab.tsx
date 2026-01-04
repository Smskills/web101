
import React from 'react';
import { AppState } from '../types.ts';

interface HomeTabProps {
  data: AppState['home'];
  updateNestedField: (parent: string, field: string, value: any) => void;
  updateHomeSubField: (parent: string, field: string, value: any) => void;
  onHeroBgClick: () => void;
  onShowcaseImgClick: () => void;
  addHighlight: () => void;
  updateHighlight: (index: number, field: string, value: string) => void;
  deleteHighlight: (index: number) => void;
  reorderSections: (idx: number, direction: 'up' | 'down') => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ 
  data, 
  updateNestedField, 
  updateHomeSubField, 
  onHeroBgClick,
  onShowcaseImgClick,
  addHighlight, 
  updateHighlight, 
  deleteHighlight,
  reorderSections
}) => {
  const handleDeleteHighlight = (idx: number, title: string) => {
    if (window.confirm(`Delete highlight "${title}"?`)) deleteHighlight(idx);
  };

  const sectionLabels: Record<string, string> = {
    highlights: 'Highlights Bar',
    industryTieups: 'Global Partners Ticker',
    placementReviews: 'Success Wall',
    notices: 'Announcement Feed',
    featuredCourses: 'Course Showcase',
    bigShowcase: 'Full-Width Showcase'
  };

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="flex items-center gap-6 mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Home Management</h2>
        <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
      </div>

      {/* Reordering Controls */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-arrows-up-down"></i> LAYOUT SEQUENCE</h3>
        <div className="space-y-3 max-w-2xl">
          {data.sectionOrder.map((sid, idx) => (
            <div key={sid} className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 group hover:border-emerald-500 transition-all">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500">{idx + 1}</span>
                <span className="text-[11px] font-black text-white uppercase tracking-widest">{sectionLabels[sid] || sid}</span>
                <button 
                  onClick={() => updateHomeSubField('sections', sid, !(data.sections as any)[sid])} 
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${ (data.sections as any)[sid] ? 'bg-emerald-600/20 text-emerald-500' : 'bg-slate-700 text-slate-500' }`}
                >
                  { (data.sections as any)[sid] ? 'VISIBLE' : 'HIDDEN' }
                </button>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => reorderSections(idx, 'up')} disabled={idx === 0} className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20"><i className="fa-solid fa-chevron-up"></i></button>
                 <button onClick={() => reorderSections(idx, 'down')} disabled={idx === data.sectionOrder.length - 1} className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20"><i className="fa-solid fa-chevron-down"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-wand-magic-sparkles"></i> HERO BANNERS</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div onClick={onHeroBgClick} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 group cursor-pointer">
            <img src={data.hero.bgImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-black text-[10px] uppercase">Change Background</div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <input value={data.hero.title} onChange={e => updateNestedField('hero', 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white font-black" placeholder="Headline" />
            <textarea value={data.hero.subtitle} onChange={e => updateNestedField('hero', 'subtitle', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-slate-300 font-medium resize-none" placeholder="Description" />
          </div>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <div className="flex justify-between items-center">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-list-check"></i> HIGHLIGHTS</h3>
          <button onClick={addHighlight} className="text-xs font-black bg-emerald-600 px-4 py-2 rounded-full">ADD HIGHLIGHT</button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {data.highlights.map((item, idx) => (
            <div key={idx} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-4 group relative">
              <button onClick={() => handleDeleteHighlight(idx, item.title)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-xmark"></i></button>
              <input value={item.title} onChange={e => updateHighlight(idx, 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-black" />
              <textarea value={item.description} onChange={e => updateHighlight(idx, 'description', e.target.value)} rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-400 resize-none" />
              <input value={item.icon} onChange={e => updateHighlight(idx, 'icon', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1 text-[10px] font-mono text-emerald-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
