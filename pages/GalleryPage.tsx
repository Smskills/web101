
import React, { useState } from 'react';
import { GalleryItem } from '../types.ts';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', ...new Set(gallery.map(item => item.category))];
  
  const filtered = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Visual Tour</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Campus Life & Events</h1>
          <p className="text-slate-500 max-w-2xl mx-auto mb-12 text-lg">
            Experience the vibrant culture and modern facilities that define our institute.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/20' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {filtered.map(item => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:shadow-2xl transition-all duration-500 break-inside-avoid"
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
              />
              {/* Instagram-style Caption Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{item.category}</span>
                <h3 className="text-white font-bold text-xl leading-tight mb-2">{item.title}</h3>
                <div className="w-12 h-1 bg-emerald-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-40 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <i className="fa-regular fa-face-smile text-4xl text-slate-300 mb-4 block"></i>
            <p className="text-slate-400 font-medium italic">We're still gathering memories for this category...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
