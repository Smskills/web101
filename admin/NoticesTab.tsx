
import React from 'react';
import { Notice } from '../types.ts';

interface NoticesTabProps {
  notices: Notice[];
  updateNoticeItem: (id: string, field: keyof Notice, value: any) => void;
  addItem: () => void;
  deleteItem: (id: string) => void;
}

const NoticesTab: React.FC<NoticesTabProps> = ({ notices, updateNoticeItem, addItem, deleteItem }) => {
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Permanently remove the announcement: "${title}"?`)) {
      deleteItem(id);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight shrink-0">Notice Board</h2>
        </div>
        <button onClick={addItem} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl flex items-center gap-2 transition-all active:scale-95">
          <i className="fa-solid fa-plus"></i> NEW NOTICE
        </button>
      </div>
      <div className="space-y-6">
        {notices.map(notice => (
          <div key={notice.id} className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-slate-700 flex gap-4 hover:border-emerald-500/30 transition-all">
            <div className="flex-grow space-y-4">
              <div className="flex flex-col md:row gap-4">
                <input value={notice.title} onChange={e => updateNoticeItem(notice.id, 'title', e.target.value)} className="bg-transparent border-b border-slate-700 font-bold text-white flex-grow outline-none focus:border-emerald-500 transition-colors" placeholder="Notice Headline" />
                <div className="flex gap-2">
                  <input type="date" value={notice.date} onChange={e => updateNoticeItem(notice.id, 'date', e.target.value)} className="bg-slate-800 text-xs p-2 rounded text-slate-300" />
                  <select value={notice.category} onChange={e => updateNoticeItem(notice.id, 'category', e.target.value)} className="bg-slate-800 text-xs p-2 rounded text-slate-300">
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                    <option value="New">New</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <textarea value={notice.description} onChange={e => updateNoticeItem(notice.id, 'description', e.target.value)} className="w-full bg-slate-800 p-3 rounded-lg text-xs h-24 text-slate-300 outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Notice details..." />
                <p className="text-[9px] text-emerald-500/70 font-bold uppercase mt-1 tracking-widest italic">Supports basic HTML tags: &lt;b&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;</p>
              </div>
            </div>
            <button onClick={() => handleDelete(notice.id, notice.title)} className="text-red-500 self-center p-3 hover:bg-red-500/10 rounded-xl transition-colors"><i className="fa-solid fa-trash-can"></i></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticesTab;
