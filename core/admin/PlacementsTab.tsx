
import React from 'react';
import { PlacementStat, StudentReview, IndustryPartner, PageMeta } from '../types.ts';

interface PlacementsTabProps {
  stats: PlacementStat[];
  reviews: StudentReview[];
  partners: IndustryPartner[];
  pageMeta: PageMeta;
  wallTitle: string;
  pageDescription?: string;
  updateStat: (id: string, field: keyof PlacementStat, value: string) => void;
  addStat: () => void;
  deleteStat: (id: string) => void;
  updateReview: (id: string, field: keyof StudentReview, value: string) => void;
  addReview: () => void;
  deleteReview: (id: string) => void;
  updatePartner: (id: string, field: keyof IndustryPartner, value: string) => void;
  addPartner: () => void;
  deletePartner: (id: string) => void;
  updatePageMeta: (field: keyof PageMeta, value: string) => void;
  updateWallTitle: (value: string) => void;
  updatePageDescription: (value: string) => void;
  onReviewImageClick: (id: string) => void;
  onPartnerImageClick: (id: string) => void;
}

const PlacementsTab: React.FC<PlacementsTabProps> = ({
  stats,
  reviews,
  partners,
  pageMeta,
  wallTitle,
  pageDescription,
  updateStat,
  addStat,
  deleteStat,
  updateReview,
  addReview,
  deleteReview,
  updatePartner,
  addPartner,
  deletePartner,
  updatePageMeta,
  updateWallTitle,
  updatePageDescription,
  onReviewImageClick,
  onPartnerImageClick
}) => {
  const handleDeleteStat = (id: string, name: string) => {
    if (window.confirm(`Delete stat "${name}"?`)) deleteStat(id);
  };

  const handleDeleteReview = (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) deleteReview(id);
  };

  const handleDeletePartner = (id: string, name: string) => {
    if (window.confirm(`Delete partner "${name}"?`)) deletePartner(id);
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      {/* Page Header Customization */}
      <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-700 space-y-8">
         <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-heading"></i> PAGE CONFIGURATION</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Title</label>
              <input value={pageMeta.title} onChange={e => updatePageMeta('title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Top Tagline</label>
              <input value={pageMeta.tagline} onChange={e => updatePageMeta('tagline', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold" />
            </div>
         </div>
         <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Intro Heading Text</label>
           <textarea value={pageMeta.subtitle} onChange={e => updatePageMeta('subtitle', e.target.value)} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Review Wall Heading</label>
              <input value={wallTitle} onChange={e => updateWallTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detail Paragraph</label>
              <input value={pageDescription} onChange={e => updatePageDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-400" />
            </div>
         </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Hiring Partners</h2>
          <button onClick={addPartner} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black shadow-lg">ADD PARTNER</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map(partner => (
            <div key={partner.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 group relative flex items-center gap-6">
              <button onClick={() => handleDeletePartner(partner.id, partner.name)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl"><i className="fa-solid fa-trash text-[10px]"></i></button>
              <div onClick={() => onPartnerImageClick(partner.id)} className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-slate-700 relative">
                {partner.image ? <img src={partner.image} className="w-full h-full object-contain p-1" /> : <i className={`fa-brands ${partner.icon || 'fa-building'} text-2xl text-emerald-500`}></i>}
              </div>
              <div className="flex-grow space-y-1">
                <input value={partner.name} onChange={e => updatePartner(partner.id, 'name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white" placeholder="Name" />
                <input value={partner.icon} onChange={e => updatePartner(partner.id, 'icon', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-emerald-400 font-mono" placeholder="Icon Class" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Placement Stats</h2>
          <button onClick={addStat} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black shadow-lg">ADD STAT</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map(stat => (
            <div key={stat.id} className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 group relative">
              <button onClick={() => handleDeleteStat(stat.id, stat.label)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl"><i className="fa-solid fa-trash text-[10px]"></i></button>
              <div className="grid grid-cols-2 gap-4">
                <input value={stat.label} onChange={e => updateStat(stat.id, 'label', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white" placeholder="Label" />
                <input value={stat.value} onChange={e => updateStat(stat.id, 'value', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-black" placeholder="Value" />
              </div>
              <div className="mt-2">
                <input value={stat.icon} onChange={e => updateStat(stat.id, 'icon', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-[10px] text-slate-500 font-mono" placeholder="fa-icon-name" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Student Success Stories</h2>
          <button onClick={addReview} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl text-xs font-black shadow-lg">ADD REVIEW</button>
        </div>
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-700 group">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div onClick={() => onReviewImageClick(review.id)} className="lg:col-span-1 cursor-pointer">
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-800">
                    <img src={review.image} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex justify-between items-center">
                    <input value={review.name} onChange={e => updateReview(review.id, 'name', e.target.value)} className="text-xl font-black bg-transparent border-b border-slate-700 text-white w-full mr-4 outline-none" placeholder="Student Name" />
                    <button onClick={() => handleDeleteReview(review.id, review.name)} className="text-red-500"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={review.course} onChange={e => updateReview(review.id, 'course', e.target.value)} className="bg-slate-800 p-2 rounded text-xs text-white" placeholder="Course" />
                    <input value={review.company} onChange={e => updateReview(review.id, 'company', e.target.value)} className="bg-slate-800 p-2 rounded text-xs text-white" placeholder="Company" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={review.companyIcon} onChange={e => updateReview(review.id, 'companyIcon', e.target.value)} className="bg-slate-800 p-2 rounded text-[10px] text-emerald-500 font-mono" placeholder="fa-brands icon" />
                    <input value={review.salaryIncrease} onChange={e => updateReview(review.id, 'salaryIncrease', e.target.value)} className="bg-slate-800 p-2 rounded text-xs text-white" placeholder="+100% Hike" />
                  </div>
                  <textarea value={review.text} onChange={e => updateReview(review.id, 'text', e.target.value)} rows={3} className="w-full bg-slate-800 p-3 rounded-xl text-xs text-slate-300 resize-none" placeholder="Review Text" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementsTab;
