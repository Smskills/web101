
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState, Notice } from '../types';

interface HomePageProps {
  content: AppState;
}

const HomePage: React.FC<HomePageProps> = ({ content }) => {
  const { home, courses, notices, placements } = content;
  const placementLabel = home.sectionLabels.placementMainLabel || "Placement";

  const getNoticeTheme = (category?: string) => {
    switch(category) {
      case 'Urgent': return { bg: 'bg-red-600', text: 'text-white', lightBg: 'bg-red-50', lightText: 'text-red-600', border: 'border-red-100', icon: 'fa-fire-flame-curved' };
      case 'New': return { bg: 'bg-green-500', text: 'text-white', lightBg: 'bg-green-50', lightText: 'text-green-600', border: 'border-green-100', icon: 'fa-sparkles' };
      case 'Event': return { bg: 'bg-blue-600', text: 'text-white', lightBg: 'bg-blue-50', lightText: 'text-blue-600', border: 'border-blue-100', icon: 'fa-calendar-star' };
      case 'Holiday': return { bg: 'bg-amber-500', text: 'text-white', lightBg: 'bg-amber-50', lightText: 'text-amber-600', border: 'border-amber-100', icon: 'fa-umbrella-beach' };
      default: return { bg: 'bg-slate-600', text: 'text-white', lightBg: 'bg-slate-50', lightText: 'text-slate-600', border: 'border-slate-200', icon: 'fa-bullhorn' };
    }
  };

  const spotlightNotice = notices.list[0];
  const tickerNotices = notices.list.length > 1 ? notices.list.slice(1) : notices.list;

  const btnPrimary = "px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/30 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";
  const btnSecondary = "px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 focus-visible:ring-4 focus-visible:ring-slate-900/20 transition-all shadow-2xl active:scale-95 text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";
  const btnOutline = "px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 focus-visible:ring-4 focus-visible:ring-white/20 transition-all text-[11px] uppercase tracking-widest text-center min-h-[56px] flex items-center justify-center";

  const renderSections = () => {
    return home.sectionOrder.map((sectionId) => {
      if (!(home.sections as any)[sectionId]) return null;

      switch(sectionId) {
        case 'highlights':
          return (
            <section key="highlights" className="py-24 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  {home.highlights.map((item, idx) => (
                    <article key={idx} className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-3xl transition-all text-center group">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl mb-10 mx-auto group-hover:scale-110 transition-transform">
                        <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed font-medium">{item.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );

        case 'industryTieups':
          return placements.partners.length > 0 && (
            <section key="industryTieups" className="py-12 bg-slate-900 border-y border-white/5 relative z-20">
              <div className="container mx-auto px-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] whitespace-nowrap">Global Partner Network</span>
                  <div className="h-px bg-slate-800 flex-grow"></div>
                </div>
              </div>
              <div className="overflow-hidden flex relative">
                <div className="flex animate-marquee-horizontal whitespace-nowrap py-4">
                  {[...placements.partners, ...placements.partners].map((partner, idx) => (
                    <div key={`${partner.id}-${idx}`} className="flex items-center gap-6 px-16 group cursor-default">
                      {partner.image ? (
                        <img src={partner.image} alt={partner.name} className="h-10 md:h-12 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                      ) : (
                        <i className={`fa-brands ${partner.icon || 'fa-building'} text-3xl md:text-4xl text-slate-600 group-hover:text-emerald-500 transition-colors`}></i>
                      )}
                      <span className="text-xl md:text-2xl font-black text-slate-600 group-hover:text-slate-200 transition-colors uppercase tracking-widest">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );

        case 'placementReviews':
          return (
            <section key="placementReviews" className="py-24 bg-slate-50 relative overflow-hidden">
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
                  <div className="max-w-2xl text-left">
                    <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Proven Outcomes</span>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">{home.sectionLabels.placementsTitle}</h2>
                    <p className="text-slate-500 text-lg md:text-xl mt-6 font-medium leading-relaxed">{home.sectionLabels.placementsSubtitle}</p>
                  </div>
                  <Link to="/placement-review" className={btnSecondary}>
                    View {placementLabel} Wall <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {placements.reviews.slice(0, 4).map((p, idx) => (
                    <article key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-emerald-500 transition-all hover:shadow-3xl group flex flex-col items-center text-center">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-emerald-50 transition-all">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-black text-slate-900 text-xl md:text-2xl mb-1">{p.name}</h4>
                      <p className="text-emerald-600 font-black text-[10px] md:text-[11px] uppercase tracking-widest mb-8">{p.course}</p>
                      <div className="w-full pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hired at</span>
                        <div className="flex items-center gap-4 text-slate-900 font-black">
                          <i className={`fa-brands ${p.companyIcon} text-2xl md:text-3xl`} aria-hidden="true"></i>
                          <span className="text-lg md:text-xl">{p.company}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );

        case 'notices':
          return notices.list.length > 0 && (
            <section key="notices" className="py-24 bg-slate-900 overflow-hidden relative">
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                  <div className="max-w-xl">
                    <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Official Feed</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">{home.sectionLabels.noticesTitle}</h2>
                    <p className="text-slate-400 text-lg md:text-xl mt-6 font-medium">{home.sectionLabels.noticesSubtitle}</p>
                  </div>
                  <Link to="/notices" className="group flex items-center gap-6 px-10 py-5 bg-white/5 hover:bg-emerald-600 text-white rounded-2xl transition-all border border-white/10 hover:border-emerald-500 shadow-2xl min-h-[56px]">
                    <span className="text-[11px] font-black uppercase tracking-widest">Open Notice Board</span>
                    <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform" aria-hidden="true"></i>
                  </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  <div className="lg:col-span-7">
                    {spotlightNotice && (
                      <article key={spotlightNotice.id} className="h-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col justify-between group hover:border-emerald-500/50 transition-all shadow-3xl relative overflow-hidden min-h-[400px] md:min-h-[520px]">
                        <div>
                          <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full mb-10 ${getNoticeTheme(spotlightNotice.category).bg} ${getNoticeTheme(spotlightNotice.category).text} text-[10px] font-black uppercase tracking-widest shadow-xl`}>
                            <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon}`} aria-hidden="true"></i>
                            {spotlightNotice.category || 'Announcement'}
                          </div>
                          <h3 className="text-3xl md:text-6xl font-black text-white mb-10 leading-tight group-hover:text-emerald-400 transition-colors">
                            {spotlightNotice.title}
                          </h3>
                          <p className="text-slate-400 text-lg md:text-xl leading-relaxed line-clamp-4 font-medium max-w-2xl">
                            {spotlightNotice.description}
                          </p>
                        </div>
                        <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-10">
                           <div className="flex items-center gap-6">
                             <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-300">
                               <i className="fa-regular fa-clock text-xl md:text-2xl" aria-hidden="true"></i>
                             </div>
                             <span className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest">{new Date(spotlightNotice.date).toLocaleDateString()}</span>
                           </div>
                        </div>
                      </article>
                    )}
                  </div>
                  <div className="lg:col-span-5 h-[400px] md:h-[520px] relative">
                    <div className="h-full overflow-hidden border border-white/5 rounded-[3rem] bg-slate-800/20">
                      <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-30">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                          Recent Feed
                        </span>
                      </div>
                      <div className="relative h-full pt-6">
                        <div className="animate-marquee-vertical flex flex-col gap-6 px-8 pb-32">
                          {[...tickerNotices, ...tickerNotices].map((notice, idx) => {
                            const theme = getNoticeTheme(notice.category);
                            return (
                              <div key={`${notice.id}-${idx}`} className="bg-slate-800/60 border border-white/5 rounded-[2rem] p-8 md:p-10 flex gap-6 md:gap-8 hover:bg-slate-700/80 transition-all group cursor-pointer hover:border-emerald-500/30 shrink-0">
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 ${theme.lightBg} ${theme.lightText} text-2xl md:text-3xl group-hover:scale-110 transition-transform shadow-inner`}>
                                  <i className={`fa-solid ${theme.icon}`} aria-hidden="true"></i>
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden">
                                  <h4 className="text-white font-black text-lg md:text-xl group-hover:text-emerald-400 transition-colors truncate">{notice.title}</h4>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

        case 'featuredCourses':
          return (
            <section key="featuredCourses" className="py-24 bg-white border-t border-slate-100">
              <div className="container mx-auto px-4">
                <div className="text-center mb-24 max-w-4xl mx-auto">
                  <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Specialized Tracks</span>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">{home.sectionLabels.coursesTitle}</h2>
                  <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">{home.sectionLabels.coursesSubtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {courses.list.filter(c => c.status === 'Active').slice(0, 3).map(course => (
                    <article key={course.id} className="flex flex-col rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white hover:shadow-3xl transition-all group">
                      <div className="relative h-64 md:h-72 overflow-hidden">
                        <img src={course.image} alt={course.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl px-6 py-2 rounded-full font-black text-emerald-600 text-xs shadow-2xl tracking-widest">{course.price || 'FREE'}</div>
                      </div>
                      <div className="p-8 md:p-12 flex flex-col flex-grow">
                        <h3 className="text-2xl md:text-3xl font-black mb-6 text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{course.name}</h3>
                        <p className="text-base md:text-lg text-slate-500 line-clamp-2 mb-12 leading-relaxed flex-grow font-medium">{course.description}</p>
                        <Link to={`/enroll?course=${encodeURIComponent(course.name)}`} className={btnSecondary + " w-full flex justify-center gap-3"}>
                          <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i> Begin Application
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );

        case 'bigShowcase':
          return (
            <section key="bigShowcase" className="py-24 bg-white">
              <div className="container mx-auto px-4">
                <div className="relative h-[500px] md:h-[700px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden group shadow-3xl">
                  <img src={home.bigShowcase.image} alt={home.bigShowcase.title} className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 md:p-24 flex flex-col items-center text-center">
                    <div className="max-w-4xl">
                      <h2 className="text-3xl md:text-7xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl leading-[1.1] md:leading-none">{home.bigShowcase.title}</h2>
                      <p className="text-slate-200 text-lg md:text-2xl font-medium leading-relaxed drop-shadow-lg">{home.bigShowcase.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );

        default: return null;
      }
    });
  };

  return (
    <div className="space-y-0 overflow-x-hidden">
      <style>{`
        @keyframes marqueeVertical { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes marqueeHorizontal { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-vertical { animation: marqueeVertical 25s linear infinite; }
        .animate-marquee-horizontal { animation: marqueeHorizontal 30s linear infinite; }
        .animate-marquee-vertical:hover, .animate-marquee-horizontal:hover { animation-play-state: paused; }
      `}</style>

      {home.hero.visible && (
        <section 
          className="relative min-h-[85vh] md:min-h-[90vh] flex items-center bg-cover bg-center text-white overflow-hidden"
          style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${home.hero.bgImage})` }}
        >
          <div className="container mx-auto px-4 py-24 text-center max-w-5xl">
            <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] mb-8 block animate-fade-in-up">The Future of Vocational Excellence</span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-10 leading-[1] md:leading-[0.9] tracking-tighter animate-fade-in-up">
              {home.hero.title}
            </h1>
            <p className="text-base md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-3xl mx-auto font-medium animate-fade-in-up delay-100">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
              <Link to="/courses" className={btnPrimary}>{home.hero.ctaText}</Link>
              <Link to="/about" className={btnOutline}>Institutional Tour</Link>
            </div>
          </div>
        </section>
      )}

      {renderSections()}

      {home.ctaBlock.visible && (
        <section className="py-24 md:py-32 bg-emerald-600 overflow-hidden relative">
          <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
            <h2 className="text-4xl md:text-8xl font-black text-white mb-12 tracking-tighter leading-[1] md:leading-[0.9]">{home.ctaBlock.title}</h2>
            <p className="text-emerald-50 max-w-3xl mx-auto mb-16 text-lg md:text-2xl font-medium leading-relaxed opacity-90">
              {home.ctaBlock.subtitle}
            </p>
            <Link to={home.ctaBlock.buttonLink} className="inline-flex items-center gap-6 px-10 md:px-16 py-6 md:py-8 bg-slate-900 text-white font-black rounded-2xl md:rounded-[2rem] hover:bg-white hover:text-emerald-600 focus-visible:ring-4 focus-visible:ring-slate-900/30 transition-all shadow-3xl text-[11px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] active:scale-95 min-h-[56px]">
              {home.ctaBlock.buttonText} <i className="fa-solid fa-arrow-right-long text-xl" aria-hidden="true"></i>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
