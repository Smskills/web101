
import React from 'react';
import { Course } from '../types.ts';

interface CoursesTabProps {
  courses: Course[];
  updateCourseItem: (id: string, field: keyof Course, value: any) => void;
  onCourseImageClick: (id: string) => void;
  addItem: () => void;
  deleteItem: (id: string) => void;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ 
  courses, 
  updateCourseItem, 
  onCourseImageClick, 
  addItem, 
  deleteItem 
}) => {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the program "${name}"? This action cannot be undone.`)) {
      deleteItem(id);
    }
  };

  const handlePriceChange = (id: string, value: string) => {
    // Basic validation to prevent negative values if a number is entered
    let sanitized = value;
    if (value.startsWith('-')) sanitized = value.replace('-', '');
    updateCourseItem(id, 'price', sanitized);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Program Management</h2>
        </div>
        <button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl flex items-center gap-2 transition-all active:scale-95">
          <i className="fa-solid fa-plus"></i> ADD PROGRAM
        </button>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {courses.map(course => (
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <input value={course.duration} onChange={e => updateCourseItem(course.id, 'duration', e.target.value)} className="bg-slate-800 p-2 rounded text-sm text-white" placeholder="Duration" />
                  <input 
                    value={course.price} 
                    onChange={e => handlePriceChange(course.id, e.target.value)} 
                    className="bg-slate-800 p-2 rounded text-sm text-white" 
                    placeholder="Price Tag (e.g. $2200)" 
                  />
                  <select value={course.status} onChange={e => updateCourseItem(course.id, 'status', e.target.value)} className="bg-slate-800 p-2 rounded text-sm text-white outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
