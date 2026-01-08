
import React from 'react';
import { Link } from 'react-router-dom';
import { AboutState } from '../types';

interface AboutPageProps {
  content: AboutState;
  siteName: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ content, siteName }) => {
  const btnSecondary = "inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 text-[11px] uppercase tracking-widest";

  // Using destructuring with defaults to handle potential missing data gracefully
  const {
    beginning = { label: '', title: '', story: '', image: '' },
    learning = { label: '', title: '', description: '', image1: '', image2: '', caption1: '', caption2: '' },
    faculty = { label: '', title: '', description: '', members: [] },
    vision = { label: '', title: '', content: '', values: [], image: '' },
    achievements = { label: '', title: '', image: '', stats: [], ctaLabel: '' }
  } = content;

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-slate-900 py-32 text-white relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">{beginning.label}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none">{beginning.title}</h1>
          <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
            {beginning.story}
          </p>
        </div>
      </section>

      {/* Chapter 2: Methodology */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{learning.label}</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{learning.title}</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">{learning.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group relative rounded-[2.5rem] overflow-hidden">
               <img src={learning.image1} className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110" alt={learning.caption1} />
               <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="font-bold">{learning.caption1}</p>
               </div>
            </div>
            <div className="group relative rounded-[2.5rem] overflow-hidden">
               <img src={learning.image2} className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110" alt={learning.caption2} />
               <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <p className="font-bold">{learning.caption2}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-emerald-600 p-16 rounded-[2.5rem] text-white relative overflow-hidden group shadow-3xl">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full group-hover:scale-125 transition-transform"></div>
              <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center text-3xl mb-10 shadow-inner">
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">Our Mission</h2>
              <p className="text-emerald-50 leading-relaxed text-xl font-medium">{vision.content}</p>
            </div>
            <div className="bg-slate-900 p-16 rounded-[2.5rem] text-white relative overflow-hidden group shadow-3xl">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full group-hover:scale-125 transition-transform"></div>
              <div className="w-20 h-20 bg-emerald-500/20 rounded-[1.5rem] flex items-center justify-center text-3xl mb-10 shadow-inner text-emerald-400">
                <i className="fa-solid fa-eye"></i>
              </div>
              <h2 className="text-4xl font-black mb-6 tracking-tight text-white">Core Values</h2>
              <ul className="space-y-4">
                {vision.values.map((v, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-medium text-lg">
                    <i className="fa-solid fa-check text-emerald-500"></i> {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline/Milestones - Reusing stats as journey markers */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{achievements.label}</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">{achievements.title}</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mt-8"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.stats.map((item) => (
              <div key={item.id} className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center shadow-sm hover:shadow-2xl transition-all">
                <div className="text-5xl font-black text-emerald-600 mb-4">{item.value}</div>
                <div className="text-slate-500 font-black uppercase tracking-widest text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <Link to="/courses" className={btnSecondary}>
              {achievements.ctaLabel || 'Start Your Journey'} <i className="fa-solid fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
