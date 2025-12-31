
import React, { useState } from 'react';
import { Notice } from '../types.ts';

interface NoticesPageProps {
  notices: Notice[];
}

const NoticesPage: React.FC<NoticesPageProps> = ({ notices }) => {
  const [search, setSearch] = useState('');

  const sortedNotices = [...notices].sort((a, b) => {
    // Sort logic: Urgent first, then by date descending
    const aUrgent = a.category === 'Urgent';
    const bUrgent = b.category === 'Urgent';
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filtered = sortedNotices.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.description.toLowerCase().includes(search.toLowerCase())
  );

  const getTagStyles = (category?: string) => {
    switch(category) {
      case 'Urgent': return 'bg-red-600 text-white animate-pulse';
      case 'New': return 'bg-emerald-600 text-white';
      case 'Holiday': return 'bg-amber-500 text-white';
      case 'Event': return 'bg-blue-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-6">Notices & Announcements</h1>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search notices..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-8">
            {filtered.map(notice => (
              <div 
                key={notice.id} 
                className={`bg-white p-8 rounded-3xl border-2 transition-all hover:shadow-xl ${
                  notice.category === 'Urgent' ? 'border-red-100' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {new Date(notice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {notice.category && (
                      <span className={`px-4 py-1.5 text-[10px] font-black rounded-full shadow-sm tracking-[0.1em] uppercase ${getTagStyles(notice.category)}`}>
                        {notice.category}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className={`text-2xl md:text-3xl font-black mb-4 leading-tight ${notice.category === 'Urgent' ? 'text-red-700' : 'text-slate-800'}`}>
                  {notice.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-8 text-lg whitespace-pre-line">
                  {notice.description}
                </p>
                {notice.link && (
                  <a 
                    href={notice.link}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                  >
                    View Details <i className="fa-solid fa-arrow-right-long text-sm"></i>
                  </a>
                )}
              </div>
            ))}
            
            {filtered.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <i className="fa-solid fa-wind text-4xl text-slate-200 mb-4 block"></i>
                <p className="text-slate-400 text-lg font-medium">It looks quiet here... Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticesPage;
