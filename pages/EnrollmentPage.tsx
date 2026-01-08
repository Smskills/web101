
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppState } from '../types.ts';

interface EnrollmentPageProps {
  content: AppState;
}

const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ content }) => {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Destructure with comprehensive fallbacks to prevent "undefined" access crashes
  const { 
    enrollmentForm = { 
      title: 'Enrollment Form', 
      description: '', 
      roadmapTitle: 'Flow', 
      roadmapSteps: [], 
      fields: [], 
      successTitle: 'Thank You', 
      successMessage: 'We received your application.' 
    }, 
    courses = { list: [], pageMeta: { title: '', subtitle: '' } }, 
    site = { contact: { phone: 'N/A', email: '', address: '' } } 
  } = content || {};

  useEffect(() => {
    if (!enrollmentForm?.fields) return;
    
    const initialData: Record<string, string> = {};
    enrollmentForm.fields.forEach(field => { 
      if (field?.id) initialData[field.id] = ''; 
    });
    
    const courseFromUrl = searchParams.get('course');
    if (courseFromUrl) {
      const courseField = enrollmentForm.fields.find(f => f.type === 'course-select');
      if (courseField?.id) { 
        initialData[courseField.id] = decodeURIComponent(courseFromUrl); 
      }
    }
    setFormData(initialData);
  }, [enrollmentForm, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (id: string, value: string) => { 
    setFormData(prev => ({ ...prev, [id]: value })); 
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl w-full bg-white p-12 md:p-16 rounded-[3.5rem] shadow-3xl text-center border border-slate-100" role="alert">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl md:text-5xl mx-auto mb-10 shadow-2xl animate-bounce">
            <i className="fa-solid fa-check" aria-hidden="true"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">{enrollmentForm.successTitle}</h2>
          <p className="text-slate-600 mb-12 text-lg md:text-xl font-medium leading-relaxed">
            {enrollmentForm.successMessage}
          </p>
          <Link to="/courses" className="inline-block px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20 transition-all shadow-3xl active:scale-95 uppercase tracking-widest text-[11px]">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Enrollment</span>
          <h1 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{enrollmentForm.title}</h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">{enrollmentForm.description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-32">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Side Roadmap */}
          <div className="bg-slate-900 lg:w-96 p-10 md:p-14 text-white shrink-0 relative">
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-black mb-12 text-white uppercase tracking-tighter border-b border-white/5 pb-6">
                {enrollmentForm.roadmapTitle}
              </h3>
              
              <div className="relative space-y-12">
                <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500 via-slate-700 to-slate-800 hidden md:block" aria-hidden="true"></div>

                {(enrollmentForm.roadmapSteps || []).map((step, idx) => (
                  <div key={step.id} className="relative flex gap-8 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.35)] relative z-20 border border-emerald-400/30">
                      {idx + 1}
                    </div>
                    <div className="flex-grow pt-1">
                      <h4 className="font-black text-lg uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 p-8 bg-white/[0.03] backdrop-blur-sm rounded-[2.5rem] border border-white/5 text-center group hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-white/5">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Help Desk</p>
                <p className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">{site?.contact?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-grow p-10 md:p-16 lg:p-20">
            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-10">
                {(enrollmentForm.fields || []).map(field => {
                  const isWide = field.type === 'textarea' || (field.label && field.label.toLowerCase().includes('name'));
                  
                  return (
                    <div key={field.id} className={`space-y-3 ${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}>
                      <label htmlFor={`field-${field.id}`} className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] ml-1 block">
                        {field.label} {field.required && <span className="text-emerald-600 font-black" aria-hidden="true">*</span>}
                      </label>
                      
                      {field.type === 'textarea' ? (
                        <textarea 
                          id={`field-${field.id}`}
                          required={field.required}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          rows={field.id.includes('remarks') || field.id.includes('additional') ? 8 : 4}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none placeholder-slate-400 shadow-sm"
                          placeholder={field.placeholder}
                        />
                      ) : field.type === 'course-select' ? (
                        <div className="relative">
                          <select 
                            id={`field-${field.id}`}
                            required={field.required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-black text-[11px] text-slate-900 uppercase tracking-widest appearance-none pr-12 shadow-sm cursor-pointer"
                          >
                            <option value="">{field.placeholder || 'Select Track'}</option>
                            {(courses.list || []).filter(c => c?.status === 'Active').map(course => (
                              <option key={course.id} value={course.name}>
                                {course.name} {course.price ? ` — ${course.price}` : ''}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <i className="fa-solid fa-chevron-down text-xs"></i>
                          </div>
                        </div>
                      ) : field.type === 'select' ? (
                        <div className="relative">
                          <select 
                            id={`field-${field.id}`}
                            required={field.required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-black text-[11px] text-slate-900 uppercase tracking-widest appearance-none pr-12 shadow-sm cursor-pointer"
                          >
                            <option value="">{field.placeholder || 'Choose Option'}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <i className="fa-solid fa-chevron-down text-xs"></i>
                          </div>
                        </div>
                      ) : (
                        <input 
                          id={`field-${field.id}`}
                          required={field.required}
                          type={field.type}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-sm"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6">
                <button type="submit" className="w-full py-6 md:py-8 bg-emerald-600 text-white font-black text-base md:text-lg rounded-3xl hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 transition-all shadow-2xl shadow-emerald-600/20 active:scale-[0.98] uppercase tracking-[0.2em] mt-8">
                  Submit Admission Request <i className="fa-solid fa-paper-plane ml-3 text-sm" aria-hidden="true"></i>
                </button>
                <p className="text-[11px] text-slate-500 font-medium text-center leading-relaxed max-w-lg mx-auto">
                  By submitting this application, you acknowledge that you have read and agree to our <Link to="/privacy-policy" className="text-emerald-600 font-black hover:underline">Privacy Policy</Link> and <Link to="/terms-of-service" className="text-emerald-600 font-black hover:underline">Terms of Service</Link>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
