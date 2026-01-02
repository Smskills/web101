
import React from 'react';
import { FormField, RoadmapStep } from '../types.ts';

interface FormTabProps {
  formData: {
    title: string;
    description: string;
    successTitle: string;
    successMessage: string;
    roadmapTitle: string;
    roadmapSteps: RoadmapStep[];
    fields: FormField[];
  };
  addField: () => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  deleteField: (id: string) => void;
  updatePageInfo: (field: string, value: any) => void;
}

const FormTab: React.FC<FormTabProps> = ({ formData, addField, updateField, deleteField, updatePageInfo }) => {
  // Defensive check for missing formData
  if (!formData) return <div className="p-10 text-slate-500 font-black uppercase tracking-widest text-center border-2 border-dashed border-slate-700 rounded-[3rem]">No application form data available</div>;

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Are you sure you want to permanently delete the application field "${label || 'Untitled'}"? This action cannot be undone.`)) {
      deleteField(id);
    }
  };

  const updateOptions = (id: string, optionsStr: string) => {
    const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);
    updateField(id, { options });
  };

  const updateStep = (id: string, field: 'title' | 'description', value: string) => {
    const nextSteps = (formData.roadmapSteps || []).map(s => s.id === id ? { ...s, [field]: value } : s);
    updatePageInfo('roadmapSteps', nextSteps);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header & Success UI Builder */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
          <i className="fa-solid fa-pager"></i> PAGE TEXT & SUCCESS FEEDBACK
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Header</h4>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Title</label>
              <input 
                value={formData.title || ''} 
                onChange={e => updatePageInfo('title', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Subtitle</label>
              <textarea 
                value={formData.description || ''} 
                onChange={e => updatePageInfo('description', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 font-medium resize-none"
                rows={2}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Success Feedback</h4>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Success Title</label>
              <input 
                value={formData.successTitle || ''} 
                onChange={e => updatePageInfo('successTitle', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-black"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Success Message</label>
              <textarea 
                value={formData.successMessage || ''} 
                onChange={e => updatePageInfo('successMessage', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 font-medium resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Builder */}
      <div className="space-y-8 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700">
        <div className="flex justify-between items-center">
          <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3">
            <i className="fa-solid fa-stairs"></i> SIDEBAR ROADMAP
          </h3>
          <div className="space-y-1">
            <input 
              value={formData.roadmapTitle || ''} 
              onChange={e => updatePageInfo('roadmapTitle', e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-[10px] text-white font-black uppercase tracking-widest"
              placeholder="Roadmap Label"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(formData.roadmapSteps || []).map((step, idx) => (
            <div key={step.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  {idx + 1}
                </span>
                <input 
                  value={step.title || ''} 
                  onChange={e => updateStep(step.id, 'title', e.target.value)}
                  className="bg-transparent border-b border-slate-700 text-white font-black text-sm outline-none focus:border-emerald-500 w-full"
                  placeholder="Step Title"
                />
              </div>
              <textarea 
                value={step.description || ''} 
                onChange={e => updateStep(step.id, 'description', e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-[11px] text-slate-400 font-medium resize-none"
                rows={2}
                placeholder="Brief instruction..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Field Builder */}
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Application Fields</h2>
          <button onClick={addField} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-full text-xs font-black shadow-xl transition-all flex items-center gap-2 active:scale-95">
            <i className="fa-solid fa-plus"></i> ADD FIELD
          </button>
        </div>
        
        <div className="space-y-4">
          {(formData.fields || []).map((field, idx) => (
            <div key={field.id} className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-700 flex flex-col gap-4 group hover:border-emerald-500/30 transition-all">
              <div className="flex gap-4 items-center">
                <span className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-emerald-500 border border-slate-700">{idx + 1}</span>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-grow">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Label</label>
                    <input value={field.label || ''} onChange={e => updateField(field.id, { label: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-white" placeholder="Field Label" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                    <select value={field.type || 'text'} onChange={e => updateField(field.id, { type: e.target.value as any })} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300">
                        <option value="text">Short Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="date">Date Selector</option>
                        <option value="course-select">Course Dropdown</option>
                        <option value="select">Custom Dropdown</option>
                        <option value="textarea">Large Message</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Placeholder</label>
                    <input value={field.placeholder || ''} onChange={e => updateField(field.id, { placeholder: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-white" placeholder="Placeholder..." />
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => updateField(field.id, { required: !field.required })} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {field.required ? 'REQUIRED' : 'OPTIONAL'}
                  </button>
                  <button onClick={() => handleDelete(field.id, field.label)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
              {field.type === 'select' && (
                <div className="mt-2 space-y-1 pl-14">
                  <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1">Options (Comma Separated)</label>
                  <input 
                    defaultValue={(field.options || []).join(', ')} 
                    onBlur={e => updateOptions(field.id, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-white font-medium" 
                    placeholder="Option 1, Option 2, Option 3..." 
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

export default FormTab;
