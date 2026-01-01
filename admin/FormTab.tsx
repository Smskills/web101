
import React from 'react';
import { FormField } from '../types.ts';

interface FormTabProps {
  fields: FormField[];
  addField: () => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  deleteField: (id: string) => void;
}

const FormTab: React.FC<FormTabProps> = ({ fields, addField, updateField, deleteField }) => {
  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Delete the application field "${label}"? This might break existing application data patterns.`)) {
      deleteField(id);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Admission Form Builder</h2>
        </div>
        <button onClick={addField} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-full text-xs font-black shadow-xl transition-all flex items-center gap-2 active:scale-95"><i className="fa-solid fa-plus"></i> ADD FIELD</button>
      </div>
      <div className="space-y-4">
        {fields.map((field, idx) => (
          <div key={field.id} className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-700 flex gap-4 items-center group hover:border-emerald-500/30 transition-all">
            <span className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-emerald-500 border border-slate-700">{idx + 1}</span>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-grow">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Label</label>
                <input value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-white" placeholder="Field Label" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                <select value={field.type} onChange={e => updateField(field.id, { type: e.target.value as any })} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-slate-300">
                    <option value="text">Short Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="course-select">Course Dropdown</option>
                    <option value="textarea">Large Message</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Placeholder</label>
                <input value={field.placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })} className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg text-sm text-white" placeholder="Placeholder..." />
              </div>
            </div>
            <div className="flex flex-col gap-2">
               <button onClick={() => updateField(field.id, { required: !field.required })} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${field.required ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                {field.required ? 'REQUIRED' : 'OPTIONAL'}
               </button>
               <button onClick={() => handleDelete(field.id, field.label)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><i className="fa-solid fa-trash"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormTab;
