
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import FormattedText from '../components/FormattedText.tsx';

interface CoursesPageProps {
  courses: Course[];
}

const CoursesPage: React.FC<CoursesPageProps> = ({ courses }) => {
  const [filter, setFilter] = useState<'All' | 'Online' | 'Offline' | 'Hybrid'>('All');
  
  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.mode === filter);

  const activeCourses = filteredCourses.filter(c => c.status === 'Active');

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Our Programs</h1>
            <p className="text-slate-600">Browse through our industry-verified technical courses.</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {(['All', 'Online', 'Offline', 'Hybrid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  filter === f 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCourses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all flex flex-col group">
              <div className="h-52 relative overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-emerald-600 font-bold px-4 py-1.5 rounded-full text-xs shadow-sm">
                  {course.price || 'Free'}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4">
                   <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                     <i className="fa-regular fa-clock"></i> {course.duration}
                   </span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                   <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase">
                     <i className="fa-solid fa-wifi"></i> {course.mode}
                   </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">{course.name}</h3>
                <FormattedText 
                  text={course.description} 
                  className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow"
                />
                <Link 
                  to={`/enroll?course=${encodeURIComponent(course.name)}`}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-graduation-cap"></i> Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {activeCourses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <i className="fa-regular fa-folder-open text-5xl text-slate-300 mb-4"></i>
             <p className="text-slate-500 font-medium">No courses found matching this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
