
import React, { useState } from 'react';
import { GalleryItem, PageMeta, AppState } from '../types.ts';

interface GalleryTabProps {
  galleryState: AppState['gallery'];
  galleryMetadata?: Record<string, string>;
  updateGalleryItem: (id: string, field: keyof GalleryItem, value: string) => void;
  updatePageMeta: (field: keyof PageMeta, value: string) => void;
  deleteItem: (id: string) => void;
  triggerUpload: (category: string) => void;
  triggerThumbnailUpload: (category: string) => void;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ 
  galleryState, 
  galleryMetadata, 
  updateGalleryItem, 
  updatePageMeta,
  deleteItem, 
  triggerUpload, 
  triggerThumbnailUpload 
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const { list, pageMeta } = galleryState;

  const galleryCategories = Array.from(new Set([
    'Campus', 'Events', 'Classroom', 'Achievement', 'Project', 
    ...list.map(item => item.category)
  ]));

  const handleDelete = (id: string) => {
    if (window.confirm("Permanently delete this photo from the gallery?")) {
      deleteItem(id);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Media Albums</h2>
        <div className="flex gap-2">
          <input 
            placeholder="New Album Name..." 
            value={newCategoryName} 
            onChange={(e) => setNewCategoryName(e.target.value)} 
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none" 
          />
          <button 
            onClick={() => { if(newCategoryName.trim()) { triggerUpload(newCategoryName.trim()); setNewCategoryName(''); } }} 
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95"
          >
            CREATE
          </button>
        </div>
      </div>

      {/* Page Header Customization */}
      <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700 space-y-6">
        <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-heading"></i> PAGE HEADER</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Main Page Title</label>
            <input value={pageMeta.title} onChange={e => updatePageMeta('title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Top Tagline</label>
            <input value={pageMeta.tagline} onChange={e => updatePageMeta('tagline', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Intro Subtitle</label>
          <textarea value={pageMeta.subtitle} onChange={e => updatePageMeta('subtitle', e.target.value)} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300 resize-none" />
        </div>
      </div>

      {galleryCategories.map(category => {
        const items = list.filter(item => item.category === category);
        const thumbnail = galleryMetadata?.[category];
        return (
          <div key={category} className="space-y-6 bg-slate-900/20 p-6 rounded-[2rem] border border-slate-700/30">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <div className="flex items-center gap-4">
                <div onClick={() => triggerThumbnailUpload(category)} className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all group relative">
                  {thumbnail ? <img src={thumbnail} className="w-full h-full object-cover group-hover:opacity-50" /> : <i className="fa-solid fa-image text-slate-700"></i>}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] font-black text-white uppercase text-center p-1">Change Cover</div>
                </div>
                <div>
                   <h3 className="text-xl font-black text-white">{category}</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{items.length} Images</p>
                </div>
              </div>
              <button onClick={() => triggerUpload(category)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Add Photo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {items.map(item => (
                <div key={item.id} className="relative group bg-slate-900/40 p-4 rounded-2xl border border-slate-700/50 transition-all hover:border-emerald-500/20">
                  <div className="aspect-square rounded-xl overflow-hidden border border-slate-800 relative">
                     <img src={item.url} className="w-full h-full object-cover" />
                     <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:bg-red-500"><i className="fa-solid fa-trash-can text-xs text-white"></i></button>
                  </div>
                  <div className="mt-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Caption (Optional)</label>
                    <input 
                      value={item.title || ''} 
                      onChange={e => updateGalleryItem(item.id, 'title', e.target.value)} 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors" 
                      placeholder="Add a caption..." 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GalleryTab;
