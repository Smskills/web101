
import React, { useState } from 'react';
import { Notice } from '../types.ts';
import FormattedText from '../components/FormattedText.tsx';

interface NoticesPageProps {
  notices: Notice[];
}

const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Urgent' | 'Event' | 'Holiday' | 'New'>('All');

  const getNoticeTheme = (category?: string) => {
    switch(category) {
      case 'Urgent': return { bg: 'bg-red-600', text: 'text-white', lightBg: 'bg-red-50', lightText: 'text-red-600', border: 'border-red-100', icon: 'fa-fire-flame-curved' };
      case 'New': return { bg: 'bg-green-500', text: 'text-white', lightBg: 'bg-green-50', lightText: 'text-green-600', border: 'border-green-100', icon: 'fa-sparkles' };
      case 'Event': return { bg: 'bg-blue-600', text: 'text-white', lightBg: 'bg-blue-50', lightText: 'text-blue-600', border: 'border-blue-100', icon: 'fa-calendar-star' };
      case 'Holiday': return { bg: 'bg-amber-500', text: 'text-white', lightBg: 'bg-amber-50', lightText: 'text-amber-600', border: 'border-amber-100', icon: 'fa-umbrella-beach' };
      default: return { bg: 'bg-slate-600', text: 'text-white', lightBg: 'bg-slate-50', lightText: 'text-slate-600', border: 'border-slate-200', icon: 'fa-bullhorn' };
    }
  };

  const filtered = notices
    .filter(n => activeFilter === 'All' || n.category === activeFilter)
    .filter(n => 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Header */}
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5 opacity-50 blur-[100px] -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
           <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Official Feed</span>
           <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Campus Announcements</h1>
           <div className="flex flex-col md:flex-row gap-4 justify-center">
             <div className="relative flex-grow max-w-md mx-auto md:mx-0">
               <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"></i>
               <input 
                 type="text" 
                 placeholder="Search all announcements..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
               />
             </div>
           </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-20 pb-32">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {(['All', 'Urgent', 'Event', 'Holiday', 'New'] as const).map(cat => {
            const theme = getNoticeTheme(cat);
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  isActive 
                    ? 'bg-emerald-600 text-white border-transparent' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Notice List */}
        <div className="max-w-5xl mx-auto space-y-8">
          {filtered.map(notice => {
            const theme = getNoticeTheme(notice.category);
            return (
              <div key={notice.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row gap-8 md:items-start relative overflow-hidden">
                {/* Visual Category Sidebar */}
                <div className={`hidden md:flex w-20 h-20 rounded-3xl flex-col items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-3xl group-hover:scale-110 transition-transform shadow-inner`}>
                  <i className={`fa-solid ${theme.icon}`}></i>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <i className="fa-regular fa-clock"></i>
                       {new Date(notice.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${theme.bg} ${theme.text}`}>
                       {notice.category || 'Announcement'}
                    </span>
                    {notice.isImportant && (
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[9px] font-black animate-pulse shadow-md">
                         CRITICAL
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight group-hover:text-emerald-600 transition-colors">
                    {notice.title}
                  </h3>
                  
                  <FormattedText 
                    text={notice.description} 
                    className="text-slate-600 text-lg leading-relaxed font-medium mb-8 whitespace-pre-line"
                  />

                  {notice.link && (
                    <a href={notice.link} className="inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                      View full details <i className="fa-solid fa-arrow-right-long"></i>
                    </a>
                  )}
                </div>

                {/* Decoration */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <i className={`fa-solid ${theme.icon} text-9xl`}></i>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
               <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                 <i className="fa-solid fa-wind"></i>
               </div>
               <h3 className="text-xl font-bold text-slate-400">No notices match your criteria.</h3>
               <button onClick={() => { setActiveFilter('All'); setSearch(''); }} className="mt-4 text-emerald-600 font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
