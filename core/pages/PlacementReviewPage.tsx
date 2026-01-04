
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface PlacementReviewPageProps {
  placements: AppState['placements'];
  label?: string;
}

const PlacementReviewPage: React.FC<PlacementReviewPageProps> = ({ placements, label = "Placement" }) => {
  const { stats, reviews, pageDescription, wallTitle, pageMeta } = placements;
  const meta = pageMeta || { title: "Placements Reviews", tagline: "Proven Outcomes", subtitle: "" };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{meta.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">{meta.title}</h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            {meta.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 text-center group hover:bg-emerald-600 transition-all duration-500">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:text-white">
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <div className="text-3xl font-black text-slate-900 group-hover:text-white mb-1">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 group-hover:text-emerald-100 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Wall */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">{wallTitle}</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
            {pageDescription && <p className="text-slate-500 mt-6 max-w-2xl mx-auto font-medium">{pageDescription}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative group hover:shadow-2xl transition-all">
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <i className="fa-solid fa-quote-right text-6xl text-slate-900"></i>
                </div>
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                    <img src={review.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{review.name}</h4>
                    <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">{review.course}</p>
                  </div>
                </div>

                <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">
                  "{review.text}"
                </p>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Placed at:</span>
                    <span className="font-black text-slate-900 text-sm">{review.company}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                    {review.salaryIncrease}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Network */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mb-12">Our Students are Hired By</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale group hover:grayscale-0 transition-all">
             {Array.from(new Set(reviews.map(r => r.companyIcon))).map(icon => (
                <i key={icon} className={`fa-brands ${icon} text-5xl`}></i>
             ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Ready to be our next success story?</h2>
          <Link to="/enroll" className="inline-block px-12 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest">
            Apply For Admission
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PlacementReviewPage;
