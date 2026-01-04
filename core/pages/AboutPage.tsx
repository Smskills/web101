
import React from 'react';
import { Link } from 'react-router-dom';
import { AboutState } from '../types';

interface AboutPageProps {
  content: AboutState;
  siteName: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ content, siteName }) => {
  const { beginning, learning, faculty, vision, achievements } = content;

  return (
    <div className="bg-white overflow-hidden">
      {/* Chapter 1: Our Beginning */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{beginning.label}</span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                {beginning.title}
              </h1>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-medium mb-8">
                {beginning.story}
              </p>
              <div className="w-20 h-1.5 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-50 rounded-[3rem] -z-10 transform rotate-2"></div>
                <img 
                  src={beginning.image} 
                  alt="" 
                  className="w-full h-[400px] md:h-[600px] object-cover rounded-[2.5rem] shadow-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: How Learning Happens */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{learning.label}</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{learning.title}</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">{learning.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group relative">
               <img src={learning.image1} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-700" alt="" />
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mastery Snapshot</p>
                 <p className="text-slate-900 font-bold">{learning.caption1}</p>
               </div>
            </div>
            <div className="group relative">
               <img src={learning.image2} className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-xl group-hover:scale-[1.02] transition-transform duration-700" alt="" />
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mastery Lab</p>
                 <p className="text-slate-900 font-bold">{learning.caption2}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Faculty */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{faculty.label}</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{faculty.title}</h2>
              <p className="text-slate-500 text-lg font-medium mt-6">{faculty.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {faculty.members.map(member => (
              <div key={member.id} className="group">
                <div className="mb-8 relative overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-[4/5]">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">{member.name}</h4>
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4">{member.role}</p>
                <p className="text-slate-500 font-medium leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 4: Vision & Values */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img src={vision.image} className="w-full h-full object-cover" alt="" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{vision.label}</span>
            <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter leading-none">{vision.title}</h2>
            <p className="text-slate-300 text-xl font-medium leading-relaxed mb-12">{vision.content}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {vision.values.map((v, idx) => (
                <div key={idx} className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:border-emerald-500 transition-colors">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 5: Achievements */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="relative">
                 <div className="absolute -inset-10 bg-emerald-600/5 rounded-full blur-3xl"></div>
                 <img src={achievements.image} className="w-full h-[500px] object-cover rounded-[3rem] shadow-3xl relative z-10" alt="" />
              </div>
            </div>
            <div className="lg:w-1/2">
               <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{achievements.label}</span>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 tracking-tight">{achievements.title}</h2>
               <div className="space-y-12">
                 {achievements.stats.map((stat, idx) => (
                   <div key={idx} className="flex items-end gap-6 group">
                     <span className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter group-hover:text-emerald-600 transition-colors">{stat.value}</span>
                     <div className="pb-1">
                        <div className="h-px w-12 bg-slate-200 mb-2"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</span>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-16">
                 <Link to="/courses" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-3xl active:scale-95 text-[11px] uppercase tracking-widest">
                   {achievements.ctaLabel} <i className="fa-solid fa-arrow-right"></i>
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
