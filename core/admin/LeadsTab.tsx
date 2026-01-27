
import React, { useState, useEffect } from 'react';
import { Lead } from '../types.ts';

interface LeadsTabProps {
  leads: Lead[];
  onUpdateLeads: (leads: Lead[]) => void;
}

const LeadsTab: React.FC<LeadsTabProps> = ({ onUpdateLeads }) => {
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<'All' | 'New' | 'Contacted' | 'Enrolled'>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('sms_auth_token');
      // Fetching from the hardened production backend
      const response = await fetch('http://localhost:5000/api/leads', {
        headers: {
          'Authorization': `Bearer ${token}` // Mandatory JWT token from Point 2 fix
        }
      });
      const data = await response.json();
      if (data.success) {
        const mapped = data.data.map((l: any) => ({
          id: l.id,
          fullName: l.full_name,
          email: l.email,
          phone: l.phone,
          course: l.course,
          message: l.message,
          source: l.source,
          status: l.status,
          createdAt: l.created_at,
          details: typeof l.details === 'string' ? JSON.parse(l.details) : (l.details || {})
        }));
        setDbLeads(mapped);
      } else {
        setFetchError(data.message || 'Authentication session has expired. Please log in again.');
      }
    } catch (e) {
      setFetchError('Institutional server offline. Ensure Node.js is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: Lead['status']) => {
    try {
      const token = localStorage.getItem('sms_auth_token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchLeads();
    } catch (e) { alert("Action failed: Insufficient permissions."); }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm("Permanently delete this student lead?")) return;
    try {
      const token = localStorage.getItem('sms_auth_token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) fetchLeads();
    } catch (e) { alert("Delete failed."); }
  };

  const filtered = dbLeads
    .filter(l => filter === 'All' || l.status === filter)
    .filter(l => (l.fullName || '').toLowerCase().includes(search.toLowerCase()) || (l.email || '').toLowerCase().includes(search.toLowerCase()));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'Contacted': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Enrolled': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
      default: return 'bg-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Lead Pipeline</h2>
          <button onClick={fetchLeads} className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline flex items-center gap-2">
            <i className="fa-solid fa-rotate"></i> Synchronize with MySQL
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500" />
          <div className="flex bg-slate-900 p-1 rounded-xl">
            {(['All', 'New', 'Contacted', 'Enrolled'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="p-8 bg-red-500/10 border-2 border-red-500/20 rounded-3xl text-center space-y-4">
           <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500"></i>
           <h3 className="text-white font-black uppercase tracking-tight">Secure Fetch Error</h3>
           <p className="text-red-400 text-sm font-medium max-w-md mx-auto leading-relaxed">{fetchError}</p>
           <div className="pt-4 flex justify-center gap-4">
              <button onClick={fetchLeads} className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg">Retry Sync</button>
              <button onClick={() => window.location.href = '#/login'} className="px-6 py-2 bg-slate-700 text-white text-[10px] font-black uppercase rounded-lg">Refresh Token</button>
           </div>
        </div>
      )}

      {!fetchError && isLoading ? (
        <div className="text-center py-20">
          <i className="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-500 mb-4"></i>
          <p className="text-slate-500 uppercase font-black text-xs tracking-widest">Querying MySQL Cloud...</p>
        </div>
      ) : !fetchError && (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(lead => (
            <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/40 transition-all cursor-pointer flex justify-between items-center group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${lead.source === 'enrollment' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {lead.source === 'enrollment' ? 'APP' : 'ENQ'}
                </div>
                <div>
                  <h4 className="text-white font-black text-lg group-hover:text-emerald-400 transition-colors">{lead.fullName}</h4>
                  <div className="flex gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    <span>{lead.phone}</span>
                    <span className="text-emerald-600/70">{lead.course}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusColor(lead.status)}`}>{lead.status}</span>
                <i className="fa-solid fa-chevron-right text-slate-700 group-hover:text-emerald-500 transition-colors"></i>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
             <div className="text-center py-20 text-slate-700 font-black uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-[3rem]">No student records found</div>
          )}
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-800 w-full max-w-3xl rounded-[3rem] border border-slate-700 overflow-hidden animate-fade-in shadow-4xl max-h-[90vh] flex flex-col">
                <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 shrink-0">
                    <div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 block">Student Lead Profile</span>
                      <h2 className="text-2xl md:text-3xl font-black text-white leading-none">{selectedLead.fullName}</h2>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="w-12 h-12 rounded-full bg-slate-700 hover:bg-red-500 text-white transition-all active:scale-90"><i className="fa-solid fa-xmark text-lg"></i></button>
                </div>
                <div className="p-8 md:p-12 space-y-10 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <p className="text-white font-bold select-all">{selectedLead.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Contact Phone</label>
                        <p className="text-white font-bold select-all">{selectedLead.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selected Course</label>
                        <p className="text-emerald-400 font-black uppercase tracking-tight">{selectedLead.course}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Submitted On</label>
                        <p className="text-slate-300 font-medium">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Message / Remarks</label>
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700 italic text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedLead.message || "No additional comments provided."}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Dynamic Form Data</label>
                          <div className="flex-grow h-px bg-slate-700"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedLead.details || {}).map(([key, val]) => (
                            <div key={key} className="p-4 bg-slate-800 border border-slate-700 rounded-xl group/item">
                               <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mb-1 group-hover/item:text-emerald-500 transition-colors">{key.replace(/_/g, ' ')}</p>
                               <p className="text-xs text-white font-medium">{val?.toString() || '—'}</p>
                            </div>
                          ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-700 shrink-0">
                        <button onClick={() => updateStatus(selectedLead.id, 'Contacted')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Mark Contacted</button>
                        <button onClick={() => updateStatus(selectedLead.id, 'Enrolled')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Mark Enrolled</button>
                        <div className="flex-grow"></div>
                        <button onClick={() => deleteLead(selectedLead.id)} className="px-6 py-3 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Delete Entry</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTab;
