
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../types';
import FormattedText from '../components/FormattedText.tsx';
import { CardSkeleton } from '../components/Skeleton.tsx';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface CoursesPageProps {
  coursesState: AppState['courses'];
  isLoading?: boolean;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ coursesState, isLoading = false }) => {
  const [filter, setFilter] = useState<'All' | 'Online' | 'Offline' | 'Hybrid'>('All');
  const { list, pageMeta } = coursesState;
  
  const filteredCourses = filter === 'All' 
    ? list 
    : list.filter(c => c.mode === filter);

  const activeCourses = filteredCourses.filter(c => c.status === 'Active');

  const btnSecondary = "w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-3 shadow-2xl text-[11px] uppercase tracking-widest";

  const loadingFallback = (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );

  const emptyFallback = (
    <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto shadow-sm">
       <i className="fa-solid fa-folder-open text-6xl text-slate-200 mb-8 block"></i>
       <p className="text-slate-400 font-black uppercase tracking-widest">No active programs found in this category.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{pageMeta.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{pageMeta.title}</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">{pageMeta.subtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-24">
        <div className="flex justify-center mb-20">
          <div className="flex bg-white/80 backdrop-blur-xl p-2 rounded-[2rem] border border-slate-200 shadow-3xl">
            {(['All', 'Online', 'Offline', 'Hybrid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-emerald-600 text-white shadow-xl' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <PageStateGuard 
          isLoading={isLoading} 
          isEmpty={activeCourses.length === 0} 
          loadingFallback={loadingFallback}
          emptyFallback={emptyFallback}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {activeCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-3xl transition-all flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md text-emerald-600 font-black px-6 py-2 rounded-full text-[10px] shadow-2xl tracking-[0.2em] uppercase">
                    {course.price || 'Scholarship'}
                  </div>
                </div>
                <div className="p-12 flex flex-col flex-grow">
                  <div className="flex items-center gap-6 mb-6">
                     <span className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <i className="fa-regular fa-clock text-emerald-500"></i> {course.duration}
                     </span>
                     <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                     <span className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                       <i className="fa-solid fa-wifi"></i> {course.mode}
                     </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors tracking-tight leading-tight">{course.name}</h3>
                  <FormattedText 
                    text={course.description} 
                    className="text-slate-500 text-lg leading-relaxed mb-10 flex-grow font-medium line-clamp-3"
                  />
                  <Link 
                    to={`/enroll?course=${encodeURIComponent(course.name)}`}
                    className={btnSecondary}
                  >
                    <i className="fa-solid fa-graduation-cap"></i> Begin Application
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </PageStateGuard>
      </div>
    </div>
  );
};

export default CoursesPage;
