import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppState } from '../types.ts';
import { validateField } from '../utils/validation.ts';

interface EnrollmentPageProps {
  content: AppState;
}

const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ content }) => {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Destructure with comprehensive fallbacks to prevent "undefined" access crashes
  const { 
    enrollmentForm = { 
      title: 'Enrollment Form', 
      description: '', 
      roadmapTitle: 'Flow', 
      roadmapSteps: [], 
      fields: [], 
      successTitle: 'Thank You', 
      successMessage: 'We received your application.',
      helpPhone: ''
    }, 
    courses = [], 
    site = { contact: { phone: 'N/A' } } 
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

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    enrollmentForm.fields.forEach(field => {
      if (field.required) {
        const err = validateField(field.type, formData[field.id], field.label);
        if (err) newErrors[field.id] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const allTouched: Record<string, boolean> = {};
      enrollmentForm.fields.forEach(f => allTouched[f.id] = true);
      setTouched(allTouched);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (touched[id]) {
      const field = enrollmentForm.fields.find(f => f.id === id);
      if (field) {
        const err = validateField(field.type, value, field.label);
        setErrors(prev => ({ ...prev, [id]: err || '' }));
      }
    }
  };

  const handleBlur = (id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    const field = enrollmentForm.fields.find(f => f.id === id);
    if (field) {
      const err = validateField(field.type, formData[id], field.label);
      setErrors(prev => ({ ...prev, [id]: err || '' }));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
        <div className="max-w-2xl w-full bg-white p-12 md:p-16 rounded-[3.5rem] shadow-3xl text-center border border-slate-100" role="alert" aria-live="polite">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto mb-10 shadow-2xl animate-bounce">
            <i className="fa-solid fa-check" aria-hidden="true"></i>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">{enrollmentForm.successTitle}</h2>
          <p className="text-slate-600 mb-12 text-lg font-medium">{enrollmentForm.successMessage}</p>
          <Link to="/courses" className="inline-block px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all uppercase tracking-widest text-[11px]">
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
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">{enrollmentForm.description}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-32">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          <div className="bg-slate-900 lg:w-96 p-10 md:p-14 text-white shrink-0 relative">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-12 text-white uppercase tracking-tighter border-b border-white/5 pb-6">
                {enrollmentForm.roadmapTitle}
              </h3>
              <div className="space-y-12">
                {enrollmentForm.roadmapSteps.map((step, idx) => (
                  <div key={step.id} className="relative flex gap-8 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 border border-emerald-400/30" aria-hidden="true">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-white">{step.title}</h4>
                      <p className="text-sm text-slate-400 mt-2 font-medium">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Help Desk Phone customizable below steps */}
              <div className="mt-20 p-8 bg-white/[0.03] backdrop-blur-sm rounded-[2.5rem] border border-white/5 text-center group hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-white/5">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Help Desk</p>
                <p className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {enrollmentForm.helpPhone || site.contact.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow p-10 md:p-16 lg:p-20">
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {enrollmentForm.fields.map(field => (
                  <div key={field.id} className={`space-y-3 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                    <label htmlFor={`enroll-${field.id}`} className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] ml-1 block">
                      {field.label} {field.required && <span className="text-red-500" aria-hidden="true">*</span>}
                    </label>
                    <div className="flex flex-col">
                      {field.type === 'textarea' ? (
                        <textarea 
                          id={`enroll-${field.id}`}
                          required={field.required} 
                          aria-required={field.required}
                          aria-invalid={touched[field.id] && !!errors[field.id]}
                          aria-describedby={touched[field.id] && errors[field.id] ? `err-${field.id}` : undefined}
                          className={`w-full px-6 py-4 bg-slate-50 border ${touched[field.id] && errors[field.id] ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:border-emerald-500 outline-none transition-all resize-none shadow-sm`} 
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          onBlur={() => handleBlur(field.id)}
                        />
                      ) : field.type === 'course-select' || field.type === 'select' ? (
                        <div className="relative">
                          <select 
                            id={`enroll-${field.id}`}
                            required={field.required} 
                            aria-required={field.required}
                            aria-invalid={touched[field.id] && !!errors[field.id]}
                            aria-describedby={touched[field.id] && errors[field.id] ? `err-${field.id}` : undefined}
                            className={`w-full px-6 py-4 bg-slate-50 border ${touched[field.id] && errors[field.id] ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none cursor-pointer pr-12`}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            onBlur={() => handleBlur(field.id)}
                          >
                            <option value="">{field.placeholder || 'Select Option'}</option>
                            {field.type === 'course-select' ? (
                              courses.filter(c => c.status === 'Active').map(c => (
                                <option key={c.id} value={c.name}>{c.name}</option>
                              ))
                            ) : (
                              field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))
                            )}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <i className="fa-solid fa-chevron-down text-xs"></i>
                          </div>
                        </div>
                      ) : (
                        <input 
                          id={`enroll-${field.id}`}
                          required={field.required} 
                          aria-required={field.required}
                          aria-invalid={touched[field.id] && !!errors[field.id]}
                          aria-describedby={touched[field.id] && errors[field.id] ? `err-${field.id}` : undefined}
                          type={field.type} 
                          className={`w-full px-6 py-4 bg-slate-50 border ${touched[field.id] && errors[field.id] ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:border-emerald-500 outline-none transition-all shadow-sm`} 
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          onBlur={() => handleBlur(field.id)}
                        />
                      )}
                      {touched[field.id] && errors[field.id] && <span id={`err-${field.id}`} className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors[field.id]}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6 pt-10">
                <button type="submit" className="w-full py-6 bg-emerald-600 text-white font-black text-lg rounded-3xl hover:bg-emerald-700 transition-all shadow-2xl active:scale-[0.98] uppercase tracking-[0.2em] shadow-emerald-600/20">
                  Submit Application
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