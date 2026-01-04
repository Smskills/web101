
import React from 'react';
import { CustomPage } from '../types.ts';

interface PagesTabProps {
  pages: CustomPage[];
  addPage: () => void;
  updatePage: (id: string, updates: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
}

const PagesTab: React.FC<PagesTabProps> = ({ pages, addPage, updatePage, deletePage }) => {
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Permanently delete custom page: "${title}"?`)) deletePage(id);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Institutional Pages</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Create unique standalone URLs</p>
        </div>
        <button onClick={addPage} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl">
          <i className="fa-solid fa-plus mr-2"></i> NEW PAGE
        </button>
      </div>

      <div className="space-y-6">
        {pages.map((page) => (
          <div key={page.id} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-700 group hover:border-emerald-500/40 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Page Title</label>
                  <input value={page.title} onChange={e => updatePage(page.id, { title: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">URL Path (Slug)</label>
                  <input value={page.slug} onChange={e => updatePage(page.id, { slug: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-emerald-500 font-mono" placeholder="/new-page" />
                </div>
              </div>
              <button onClick={() => handleDelete(page.id, page.title)} className="ml-6 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><i className="fa-solid fa-trash-can"></i></button>
            </div>

            <div className="space-y-2 mb-8">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Page Content (HTML/Markdown)</label>
               <textarea 
                 value={page.content} 
                 onChange={e => updatePage(page.id, { content: e.target.value })} 
                 rows={8} 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 font-medium font-mono" 
                 placeholder="<p>Welcome to our new institutional facility...</p>"
               />
            </div>

            <div className="flex items-center gap-6">
               <button onClick={() => updatePage(page.id, { visible: !page.visible })} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${page.visible ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                 {page.visible ? 'PUBLISHED' : 'DRAFT'}
               </button>
               <button onClick={() => updatePage(page.id, { showHeader: !page.showHeader })} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${page.showHeader ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-800 text-slate-600'}`}>
                 {page.showHeader ? 'SHOW HERO' : 'NO HERO'}
               </button>
               {page.visible && (
                 <a href={`#/${page.slug}`} target="_blank" rel="noreferrer" className="text-[9px] font-black text-emerald-500 hover:underline uppercase tracking-widest">
                   Preview <i className="fa-solid fa-external-link ml-1"></i>
                 </a>
               )}
            </div>
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-[3rem]">
           <p className="text-slate-500 font-black text-xs uppercase tracking-widest">No custom pages created</p>
        </div>
      )}
    </div>
  );
};

export default PagesTab;
