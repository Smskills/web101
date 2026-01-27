
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Course, PageMeta } from '../../types.ts';
import FormattedText from '../FormattedText.tsx';
import { CardSkeleton } from '../Skeleton.tsx';

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
  
  const { list, pageMeta } = coursesState;
  
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
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Professional Curricula</span>
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

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedCourse(null)}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-3xl relative z-10 overflow-y-auto custom-scrollbar animate-fade-in">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-8 right-8 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500">
               <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            
            <div className="p-10 md:p-16">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3">
                  <img src={selectedCourse.image} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-2xl" alt={selectedCourse.name} />
                  <div className="mt-8 space-y-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Program Value</p>
                      <p className="text-2xl font-black text-emerald-600">{selectedCourse.price || 'Rs. 0'}</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                   <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">{selectedCourse.mode} Track</span>
                   <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">{selectedCourse.name}</h2>
                   
                   <div className="prose prose-slate max-w-none mb-12">
                     <FormattedText text={selectedCourse.description} className="text-slate-600 text-lg leading-relaxed font-medium" />
                   </div>

                   {/* Eligibility Display */}
                   {selectedCourse.eligibility && (
                     <div className="mb-10 p-8 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center absolute -top-5 left-8 shadow-lg">
                          <i className="fa-solid fa-user-check"></i>
                        </div>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Candidate Eligibility</h4>
                        <FormattedText text={selectedCourse.eligibility} className="text-slate-700 font-medium leading-relaxed" />
                     </div>
                   )}

                   {/* Program Benefits Styled like the Reference Image */}
                   {selectedCourse.benefits && (
                     <div className="mb-12 p-8 bg-[#059669] text-white rounded-3xl relative group shadow-xl">
                       <h4 className="text-[10px] font-black text-emerald-100/80 uppercase tracking-[0.2em] mb-4">Program Benefits</h4>
                       <FormattedText text={selectedCourse.benefits} className="text-lg font-medium leading-relaxed" />
                     </div>
                   )}

                   {/* Duration and Certification Icons like the Reference Image */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12 items-center">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                          <i className="fa-regular fa-clock text-xl"></i>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                          <p className="text-xl font-black text-slate-900">{selectedCourse.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                          <i className="fa-solid fa-award text-xl"></i>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certification</p>
                          <p className="text-xl font-black text-slate-900 leading-tight">
                            {selectedCourse.certification || 'SMS Technical Diploma'}
                          </p>
                        </div>
                      </div>
                   </div>

                   <Link to={`/enroll?course=${encodeURIComponent(selectedCourse.name)}`} className="w-full py-6 bg-slate-900 text-white font-black rounded-full hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-4 shadow-3xl text-[12px] uppercase tracking-[0.3em]">
                     Apply for this program <i className="fa-solid fa-arrow-right"></i>
                   </Link>
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
