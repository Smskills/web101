import React from 'react';
import { SiteConfig, SocialLink, FormField, AppState } from '../types.ts';

interface ContactTabProps {
  contact: SiteConfig['contact'];
  social: SiteConfig['social'];
  contactForm: AppState['contactForm'];
  updateContactField: (field: string, value: any) => void;
  addSocialLink: () => void;
  updateSocialLink: (id: string, field: keyof SocialLink, value: string) => void;
  removeSocialLink: (id: string) => void;
  addFormField: () => void;
  updateFormField: (id: string, updates: Partial<FormField>) => void;
  deleteFormField: (id: string) => void;
  updateFormTitle: (title: string) => void;
}

const ContactTab: React.FC<ContactTabProps> = ({ 
  contact, 
  social = [], 
  contactForm,
  updateContactField, 
  addSocialLink, 
  updateSocialLink, 
  removeSocialLink,
  addFormField,
  updateFormField,
  deleteFormField,
  updateFormTitle
}) => {
  const handleRemoveSocial = (id: string, platform: string) => {
    if (window.confirm(`Remove ${platform} link?`)) {
      removeSocialLink(id);
    }
  };

  const updateOptions = (id: string, optionsStr: string) => {
    const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);
    updateFormField(id, { options });
  };

  const formFields = contactForm?.fields || [];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex items-center gap-6 mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Contact & Support</h2>
        <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-envelope-open-text"></i> CORE CONTACT</h3>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Campus Address</label>
              <textarea value={contact.address} onChange={e => updateContactField('address', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200" rows={3} placeholder="Address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                <input value={contact.phone} onChange={e => updateContactField('phone', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200" placeholder="Phone" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <input value={contact.email} onChange={e => updateContactField('email', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200" placeholder="Email" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Map Iframe URL</label>
              <input value={contact.mapUrl} onChange={e => updateContactField('mapUrl', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-emerald-400 font-mono" placeholder="Map URL" />
            </div>
          </div>
        </div>

        <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-share-nodes"></i> SOCIAL MEDIA</h3>
            <button onClick={addSocialLink} className="px-4 py-1.5 bg-emerald-600 rounded-full text-[10px] font-black uppercase transition-all shadow-lg">ADD SOCIAL</button>
          </div>
          <div className="space-y-4">
            {social.map((s) => (
              <div key={s.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 relative group">
                <button onClick={() => handleRemoveSocial(s.id, s.platform)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-trash-can text-xs"></i></button>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input value={s.platform} onChange={e => updateSocialLink(s.id, 'platform', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" placeholder="Platform" />
                  <input value={s.icon} onChange={e => updateSocialLink(s.id, 'icon', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-500 font-mono" placeholder="Icon" />
                </div>
                <input value={s.url} onChange={e => updateSocialLink(s.id, 'url', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300" placeholder="URL" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[3rem] border border-slate-700">
        <div className="flex justify-between items-center border-b border-slate-700 pb-6">
          <div>
            <h3 className="text-emerald-500 font-black text-xl flex items-center gap-3">
              <i className="fa-solid fa-file-signature"></i> ENQUIRY FORM BUILDER
            </h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Manage fields on the Contact Page form</p>
          </div>
          <button 
            onClick={addFormField}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-[10px] font-black shadow-xl transition-all active:scale-95"
          >
            <i className="fa-solid fa-plus mr-2"></i> ADD FIELD
          </button>
        </div>

        <div className="space-y-1 mb-8">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Form Section Title</label>
          <input 
            value={contactForm?.title || ''} 
            onChange={e => updateFormTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-black"
            placeholder="e.g. Send Enquiry"
          />
        </div>

        <div className="space-y-4">
          {formFields.map((field, idx) => (
            <div key={field.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-all group relative">
              <button 
                onClick={() => { if(window.confirm('Remove this field?')) deleteFormField(field.id) }} 
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Label</label>
                  <input value={field.label} onChange={e => updateFormField(field.id, { label: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" placeholder="Label" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                  <select value={field.type} onChange={e => updateFormField(field.id, { type: e.target.value as any })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                    <option value="text">Short Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="course-select">Course Selector</option>
                    <option value="select">Dropdown</option>
                    <option value="textarea">Large Message</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Placeholder</label>
                  <input value={field.placeholder} onChange={e => updateFormField(field.id, { placeholder: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" placeholder="Placeholder" />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button 
                    onClick={() => updateFormField(field.id, { required: !field.required })} 
                    className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {field.required ? 'REQUIRED' : 'OPTIONAL'}
                  </button>
                </div>
              </div>

              {field.type === 'select' && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1 block mb-2">Options (Comma Separated)</label>
                  <input 
                    defaultValue={(field.options || []).join(', ')} 
                    onBlur={e => updateOptions(field.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-xs text-white" 
                    placeholder="General, Support, Technical" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactTab;