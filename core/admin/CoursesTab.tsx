
import React from 'react';
import { Course, PageMeta, AppState } from '../types.ts';

interface CoursesTabProps {
  coursesState: AppState['courses'];
  updateCourseItem: (id: string, field: keyof Course, value: any) => void;
  updatePageMeta: (field: keyof PageMeta, value: string) => void;
  onCourseImageClick: (id: string) => void;
  addItem: () => void;
  deleteItem: (id: string) => void;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ 
  coursesState, 
  updateCourseItem, 
  updatePageMeta,
  onCourseImageClick, 
  addItem, 
  deleteItem 
}) => {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the program "${name}"? This action cannot be undone.`)) {
      deleteItem(id);
    }
  };

  const { list, pageMeta } = coursesState;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Program Management</h2>
        <button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl flex items-center gap-2 transition-all active:scale-95">
          <i className="fa-solid fa-plus"></i> ADD PROGRAM
        </button>
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

      <div className="grid grid-cols-1 gap-8">
        {list.map(course => (
          <div key={course.id} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700 group transition-all hover:border-emerald-500/30">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-800 group/img cursor-pointer" onClick={() => onCourseImageClick(course.id)}>
                  <img src={course.image} className="w-full h-full object-cover transition-opacity group-hover/img:opacity-50" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"><i className="fa-solid fa-upload text-white text-2xl"></i></div>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                  <input value={course.name} onChange={e => updateCourseItem(course.id, 'name', e.target.value)} className="text-xl font-black bg-transparent border-b border-slate-700 text-white w-full mr-4 outline-none focus:border-emerald-500 transition-colors" placeholder="Course Name" />
                  <button onClick={() => handleDelete(course.id, course.name)} className="text-red-500 hover:text-red-400 p-2"><i className="fa-solid fa-trash-can"></i></button>
                </div>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration</label>
                    <input value={course.duration} onChange={e => updateCourseItem(course.id, 'duration', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white" placeholder="e.g. 12 Months" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Price</label>
                    <input value={course.price} onChange={e => updateCourseItem(course.id, 'price', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white" placeholder="e.g. $2200" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Delivery Mode</label>
                    <select value={course.mode} onChange={e => updateCourseItem(course.id, 'mode', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                    <select value={course.status} onChange={e => updateCourseItem(course.id, 'status', e.target.value)} className="w-full bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <textarea value={course.description} onChange={e => updateCourseItem(course.id, 'description', e.target.value)} className="w-full bg-slate-800 p-3 rounded text-sm text-slate-300 resize-none outline-none focus:ring-1 focus:ring-emerald-500" rows={3} placeholder="Course summary..." />
                  <p className="text-[9px] text-emerald-500/70 font-bold uppercase mt-1 tracking-widest italic">Supports basic HTML tags: &lt;b&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesTab;
