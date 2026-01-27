
import React, { useState } from 'react';
import { SiteConfig, AppState, FormField } from '../types';

interface ContactPageProps {
  config: SiteConfig['contact'];
  social?: SiteConfig['social'];
  content?: AppState;
}

const ContactPage: React.FC<ContactPageProps> = ({ config, social = [], content }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const contactForm = content?.contactForm || { title: "Send Enquiry", fields: [] };
  const coursesList = content?.courses?.list || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const fields = contactForm.fields || [];

    // --- HEURISTIC FIELD DISCOVERY ---
    let nameField = fields.find(f => (f.label || '').toLowerCase().includes('name')) || fields[0];
    let emailField = fields.find(f => f.type === 'email' || (f.label || '').toLowerCase().includes('email')) || fields[1];
    let phoneField = fields.find(f => f.type === 'tel' || (f.label || '').toLowerCase().includes('phone') || (f.label || '').toLowerCase().includes('contact'));

    const fullName = nameField ? formData[nameField.id] : 'Inquirer';
    const email = emailField ? formData[emailField.id] : 'no-email@example.com';
    const phone = phoneField ? formData[phoneField.id] : 'N/A';

    let courseField = fields.find(f => f.type === 'course-select');
    const course = courseField ? formData[courseField.id] : 'General Inquiry';

    let messageField = fields.find(f => f.type === 'textarea');
    const message = messageField ? formData[messageField.id] : 'Website Inquiry';

    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName || 'Inquirer',
          email: email || 'not-provided@example.com',
          phone: phone || '0000000000',
          course,
          message,
          source: 'contact',
          details: { ...formData }
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.message || 'The server rejected your inquiry.');
      }
    } catch (err) {
      setErrorMessage('Communication Error: Backend server is unreachable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const btnPrimary = "w-full py-6 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] uppercase tracking-widest text-[11px]";

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Institutional Support</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">Get In Touch</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Our academic advisors are available to guide your vocational journey.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:border-emerald-500 transition-all">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">Our Campus</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{config.address}</p>
                </div>
              </div>
              <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-6 group hover:border-emerald-500 transition-all">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">Call Center</h4>
                  <p className="text-slate-500 font-medium">{config.phone}</p>
                  <p className="text-[10px] text-emerald-600 mt-2 uppercase font-black tracking-widest">Mon - Sat, 9am - 6pm</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-[3rem] overflow-hidden shadow-3xl h-96 border-8 border-white group">
              <iframe src={config.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" title="Campus Map" className="grayscale group-hover:grayscale-0 transition-all duration-700"></iframe>
            </div>
          </div>

          <div className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-3xl border border-slate-100 sticky top-24">
            {submitted ? (
              <div className="text-center py-24" role="alert">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-10 shadow-xl animate-bounce">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Enquiry Logged</h2>
                <p className="text-slate-500 mb-12 text-lg font-medium">Your request has been queued. An advisor will contact you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all active:scale-95">Send New Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">{contactForm.title}</h2>
                  <div className="w-16 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>
                
                {errorMessage && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 animate-shake">{errorMessage}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {(contactForm.fields || []).map(field => {
                    const isWide = field.type === 'textarea' || (field.label && field.label.toLowerCase().includes('name'));
                    return (
                      <div key={field.id} className={`space-y-3 ${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}>

                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 block">
                          {field.label} {field.required && <span className="text-emerald-600">*</span>}

                        </label>
                        {field.type === 'textarea' ? (
                          <textarea required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} rows={5} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900 resize-none placeholder-slate-300" placeholder={field.placeholder} />
                        ) : field.type === 'course-select' ? (
                          <div className="relative">
                            <select required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-black text-[11px] text-slate-900 uppercase tracking-widest appearance-none pr-12 shadow-sm cursor-pointer">
                              <option value="">{field.placeholder || 'Select Track'}</option>
                              {coursesList.filter(c => c.status === 'Active').map(course => (
                                <option key={course.id} value={course.name}>{course.name}</option>
                              ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                          </div>
                        ) : field.type === 'select' ? (
                          <div className="relative">
                            <select required={field.required} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-black text-[11px] text-slate-900 uppercase tracking-widest appearance-none pr-12 shadow-sm cursor-pointer">
                              <option value="">{field.placeholder || 'Choose Option'}</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                          </div>
                        ) : (
                          <input required={field.required} type={field.type} value={formData[field.id] || ''} onChange={(e) => handleChange(field.id, e.target.value)} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-900 placeholder-slate-300 shadow-sm" placeholder={field.placeholder} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <button disabled={isSubmitting} type="submit" className={`${btnPrimary} flex items-center justify-center gap-4`}>
                  {isSubmitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Dispatching...</> : <>Submit Inquiry <i className="fa-solid fa-paper-plane text-sm"></i></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
