
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Course, PageMeta } from '../types.ts';
import FormattedText from '../components/FormattedText.tsx';
import { CardSkeleton } from '../components/Skeleton.tsx';

interface CoursesPageProps {
  coursesState: {
    list: Course[];
    pageMeta: PageMeta;
  };
  isLoading?: boolean;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ coursesState, isLoading = false }) => {
  const [filter, setFilter] = useState<'All' | 'Online' | 'Offline' | 'Hybrid'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const { list = [], pageMeta = { title: 'Technical Programs', subtitle: '', tagline: 'Professional Curricula' } } = coursesState || {};
  
  const filteredCourses = filter === 'All' 
    ? list 
    : list.filter(c => c.mode === filter);

  const activeCourses = filteredCourses.filter(c => c.status === 'Active');

  const btnSecondary = "w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-3 shadow-2xl text-[11px] uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Header */}
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{pageMeta.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{pageMeta.title}</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">{pageMeta.subtitle}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-24">
        {/* Modern Filter Strip */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            activeCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-3xl transition-all flex flex-col group">
                <div className="h-64 relative overflow-hidden cursor-pointer" onClick={() => setSelectedCourse(course)}>
                  <img 
                    src={course.image} 
                    alt={course.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <i className="fa-regular fa-clock text-emerald-500"></i> {course.duration}
                       </span>
                       <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                       <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                         <i className="fa-solid fa-wifi"></i> {course.mode}
                       </span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 font-black px-4 py-1.5 rounded-lg text-[9px] shadow-sm tracking-widest uppercase border border-emerald-100">
                      {course.price || 'Scholarship'}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors tracking-tight leading-tight cursor-pointer" onClick={() => setSelectedCourse(course)}>{course.name}</h3>
                  <FormattedText 
                    text={course.description} 
                    className="text-slate-500 text-lg leading-relaxed mb-10 flex-grow font-medium line-clamp-3"
                  />
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className={btnSecondary}
                  >
                    <i className="fa-solid fa-graduation-cap"></i> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!isLoading && activeCourses.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-2xl mx-auto shadow-sm">
             <i className="fa-solid fa-folder-open text-6xl text-slate-200 mb-8 block"></i>
             <p className="text-slate-400 font-black uppercase tracking-widest">No active programs found in this category.</p>
          </div>
        )}
      </div>

      {/* Optimized Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedCourse(null)}></div>
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-4xl relative z-10 overflow-y-auto max-h-[90vh] custom-scrollbar animate-fade-in">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500 z-20">
               <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Left Side: Image and Value */}
                <div className="md:w-5/12 flex flex-col">
                  <img src={selectedCourse.image} className="w-full aspect-[4/5] object-cover rounded-[1.5rem] shadow-xl" alt={selectedCourse.name} />
                  <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Program Value</p>
                    <p className="text-2xl font-black text-emerald-600 leading-none">{selectedCourse.price || 'Rs. 0'}</p>
                  </div>
                </div>

                {/* Right Side: Information Content */}
                <div className="md:w-7/12 flex flex-col justify-between">
                   <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-widest mb-3">{selectedCourse.mode} Track</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">{selectedCourse.name}</h2>
                        
                        {/* Course description moved here - directly under name */}
                        <div className="prose prose-slate max-w-none">
                           <FormattedText text={selectedCourse.description} className="text-slate-600 text-sm md:text-base leading-relaxed font-medium" />
                        </div>
                      </div>
                      
                      {/* Eligibility Section */}
                      {selectedCourse.eligibility && (
                        <div className="flex gap-4 items-start pt-2">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-user-check text-xs"></i>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Candidate Eligibility</h4>
                            <FormattedText text={selectedCourse.eligibility} className="text-sm text-slate-700 font-bold" />
                          </div>
                        </div>
                      )}

                      {/* Benefits Section - Compact Green Box */}
                      {selectedCourse.benefits && (
                        <div className="p-6 bg-[#059669] text-white rounded-2xl shadow-lg">
                          <h4 className="text-[9px] font-black text-emerald-100 uppercase tracking-widest mb-3">Program Benefits</h4>
                          <FormattedText text={selectedCourse.benefits} className="text-sm md:text-base font-semibold leading-relaxed" />
                        </div>
                      )}
                   </div>

                   {/* Bottom Row: Icons & Button */}
                   <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100"><i className="fa-regular fa-clock"></i></div>
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                            <p className="text-sm font-black text-slate-900">{selectedCourse.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100"><i className="fa-solid fa-award"></i></div>
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Certification</p>
                            <p className="text-sm font-black text-slate-900 leading-tight truncate max-w-[120px] md:max-w-full">
                              {selectedCourse.certification || 'SMS Certificate'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link to={`/enroll?course=${encodeURIComponent(selectedCourse.name)}`} className="w-full py-4 bg-[#0f172a] text-white font-black rounded-full hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-3 shadow-xl text-[11px] uppercase tracking-[0.2em]">
                        Apply for this program <i className="fa-solid fa-arrow-right text-xs"></i>
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
