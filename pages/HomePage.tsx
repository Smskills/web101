
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState, Notice } from '../types';

interface HomePageProps {
  content: AppState;
}

const HomePage: React.FC<HomePageProps> = ({ content }) => {
  const { home, courses, notices } = content;

  const getNoticeTheme = (category?: string) => {
    switch(category) {
      case 'Urgent': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: 'fa-fire-flame-curved' };
      case 'Event': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: 'fa-calendar-star' };
      case 'Holiday': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: 'fa-umbrella-beach' };
      case 'New': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: 'fa-sparkles' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: 'fa-bullhorn' };
    }
  };

  // Separate notices for Spotlight vs Ticker
  const spotlightNotice = notices[0];
  const tickerNotices = notices.length > 1 ? notices.slice(1) : notices;

  return (
    <div className="space-y-0">
      <style>{`
        @keyframes marqueeVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-vertical {
          animation: marqueeVertical 25s linear infinite;
        }
        .animate-marquee-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      {home.hero.visible && (
        <section 
          className="relative min-h-[80vh] flex items-center bg-cover bg-center text-white"
          style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${home.hero.bgImage})` }}
        >
          <div className="container mx-auto px-4 py-20 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-md animate-fade-in-up">
              {home.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-light animate-fade-in-up delay-100">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <a 
                href={home.hero.ctaLink}
                className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-600/20"
              >
                {home.hero.ctaText}
              </a>
              <a 
                href="#/about"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-full hover:bg-white/20 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {home.highlights.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all text-center group">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engaging Moving Notices Board */}
      {home.sections.notices && notices.length > 0 && (
        <section className="py-24 bg-slate-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full -mr-20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-1 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px]">Campus Pulse</span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">{home.sectionLabels.noticesTitle}</h2>
                <p className="text-slate-400 text-lg mt-3 font-medium">{home.sectionLabels.noticesSubtitle}</p>
              </div>
              <Link to="/notices" className="group flex items-center gap-4 px-6 py-3 bg-white/5 hover:bg-emerald-600 text-white rounded-full transition-all border border-white/10 hover:border-emerald-500 shadow-2xl">
                <span className="text-xs font-black uppercase tracking-widest">Full Notice Board</span>
                <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Spotlight Notice (Static/Featured) */}
              <div className="lg:col-span-7 h-full">
                {spotlightNotice && (
                  <div key={spotlightNotice.id} className="h-full bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-between group hover:border-emerald-500/50 transition-all shadow-2xl relative overflow-hidden min-h-[450px]">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                       <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon} text-9xl text-white`}></i>
                    </div>
                    <div>
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 ${getNoticeTheme(spotlightNotice.category).bg} ${getNoticeTheme(spotlightNotice.category).text} text-[10px] font-black uppercase tracking-widest`}>
                        <i className={`fa-solid ${getNoticeTheme(spotlightNotice.category).icon}`}></i>
                        {spotlightNotice.category || 'Announcement'}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight group-hover:text-emerald-400 transition-colors">
                        {spotlightNotice.title}
                      </h3>
                      <p className="text-slate-400 text-lg leading-relaxed line-clamp-4">
                        {spotlightNotice.description}
                      </p>
                    </div>
                    <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                           <i className="fa-regular fa-clock"></i>
                         </div>
                         <span className="text-xs font-bold text-slate-500">{new Date(spotlightNotice.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                       {spotlightNotice.link && (
                         <a href={spotlightNotice.link} className="text-emerald-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:text-emerald-400 transition-colors">
                           View Details <i className="fa-solid fa-chevron-right"></i>
                         </a>
                       )}
                    </div>
                  </div>
                )}
              </div>

              {/* Upward Moving Ticker */}
              <div className="lg:col-span-5 h-[450px] relative">
                <div className="absolute top-0 left-0 w-full z-20 h-20 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none rounded-t-3xl"></div>
                <div className="absolute bottom-0 left-0 w-full z-20 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-3xl"></div>
                
                <div className="h-full overflow-hidden border border-white/5 rounded-[2.5rem] bg-slate-800/20">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-30">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Live Feed
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{tickerNotices.length} Updates</span>
                  </div>

                  <div className="relative h-full pt-4">
                    <div className="animate-marquee-vertical flex flex-col gap-4 px-4">
                      {/* Original Items */}
                      {[...tickerNotices, ...tickerNotices].map((notice, idx) => {
                        const theme = getNoticeTheme(notice.category);
                        return (
                          <div 
                            key={`${notice.id}-${idx}`} 
                            className="bg-slate-800/40 border border-white/5 rounded-3xl p-6 flex gap-6 hover:bg-slate-700/60 transition-all group cursor-pointer hover:border-emerald-500/30 shrink-0"
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                              <i className={`fa-solid ${theme.icon}`}></i>
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(notice.date).toLocaleDateString()}</span>
                                <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${theme.bg} ${theme.text}`}>
                                  {notice.category}
                                </span>
                              </div>
                              <h4 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors line-clamp-1 truncate">{notice.title}</h4>
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
      )}

      {/* Featured Courses */}
      {home.sections.featuredCourses && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4 block">Our Curriculum</span>
              <h2 className="text-4xl font-extrabold text-slate-800 mb-6">{home.sectionLabels.coursesTitle}</h2>
              <p className="text-slate-500">{home.sectionLabels.coursesSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.filter(c => c.status === 'Active').slice(0, 3).map(course => (
                <div key={course.id} className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 bg-white hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-600">
                        {course.mode}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">{course.duration}</span>
                      <span className="text-lg font-bold text-emerald-600">{course.price || 'Contact Us'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">{course.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed flex-grow">{course.description}</p>
                    <Link 
                      to={`/enroll?course=${encodeURIComponent(course.name)}`}
                      className="w-full py-3 bg-slate-900 text-white text-center font-bold rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-graduation-cap"></i> Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Block */}
      {home.ctaBlock.visible && (
        <section className="py-20 bg-emerald-600 overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8">{home.ctaBlock.title}</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto mb-10 text-lg">
              {home.ctaBlock.subtitle}
            </p>
            <a href={home.ctaBlock.buttonLink} className="inline-block px-10 py-5 bg-white text-emerald-600 font-bold rounded-full hover:bg-slate-50 transition-all shadow-xl text-lg">
              {home.ctaBlock.buttonText} <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
