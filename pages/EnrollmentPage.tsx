
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

  // Defensive fallback for enrollmentForm
  const { enrollmentForm = { title: 'Application Form', description: '', fields: [] }, courses = [], site } = content;

  useEffect(() => {
    if (!enrollmentForm?.fields) return;

    // Initialize form data state with empty values for each field
    const initialData: Record<string, string> = {};
    enrollmentForm.fields.forEach(field => {
      initialData[field.id] = '';
    });

    // Pre-fill course if present in URL
    const courseFromUrl = searchParams.get('course');
    if (courseFromUrl) {
      const courseField = enrollmentForm.fields.find(f => f.type === 'course-select');
      if (courseField) {
        initialData[courseField.id] = decodeURIComponent(courseFromUrl);
      }
    }
    setFormData(initialData);
  }, [enrollmentForm, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enrollment Application Data:', formData);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
            <i className="fa-solid fa-check"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Application Sent!</h2>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">
            Thank you for your interest. Our admissions team will review your application and contact you within 48 hours.
          </p>
          <Link 
            to="/courses" 
            className="inline-block px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
          >
            Explore More Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Admission 2024-25</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{enrollmentForm.title}</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              {enrollmentForm.description}
            </p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar Info */}
              <div className="bg-slate-900 md:w-80 p-12 text-white shrink-0">
                <h3 className="text-xl font-black mb-8 text-emerald-400">Application Guide</h3>
                <ul className="space-y-8">
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-sm">Fill Information</h4>
                      <p className="text-xs text-slate-400 mt-1">Provide your accurate details.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-sm">Review Process</h4>
                      <p className="text-xs text-slate-400 mt-1">Our team verifies your profile.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-sm">Confirmation</h4>
                      <p className="text-xs text-slate-400 mt-1">Receive admission status via call.</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-20 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Need Assistance?</p>
                  <p className="text-xs text-slate-300">Call admissions at <br/><span className="text-white font-bold">{site.contact.phone}</span></p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-grow p-12 md:p-16">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {enrollmentForm.fields && enrollmentForm.fields.length > 0 ? (
                    enrollmentForm.fields.map(field => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                          <textarea 
                            required={field.required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            rows={4}
                            placeholder={field.placeholder}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all resize-none font-medium"
                          />
                        ) : field.type === 'course-select' ? (
                          <select 
                            required={field.required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-bold text-slate-700"
                          >
                            <option value="">{field.placeholder || 'Select a Program'}</option>
                            {courses.filter(c => c.status === 'Active').map(course => (
                              <option key={course.id} value={course.name}>{course.name}</option>
                            ))}
                          </select>
                        ) : field.type === 'select' ? (
                          <select 
                            required={field.required}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-bold text-slate-700"
                          >
                            <option value="">{field.placeholder}</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            required={field.required}
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-medium"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-slate-400 text-sm">
                      <i className="fa-solid fa-triangle-exclamation mb-2 block text-xl"></i>
                      The enrollment form configuration is missing. Please contact administration.
                    </div>
                  )}

                  {enrollmentForm.fields && enrollmentForm.fields.length > 0 && (
                    <button 
                      type="submit"
                      className="w-full py-6 bg-emerald-600 text-white font-black text-lg rounded-[2rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] uppercase tracking-widest"
                    >
                      Submit Application <i className="fa-solid fa-paper-plane ml-3"></i>
                    </button>
                  )}

                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    By submitting, you agree to our <Link to="/privacy-policy" className="text-emerald-600 hover:underline">privacy policy</Link> and <Link to="/terms-of-service" className="text-emerald-600 hover:underline">terms of service</Link>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
