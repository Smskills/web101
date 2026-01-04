
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full text-center" role="main">
        <div className="relative mb-12">
          <div className="text-[12rem] font-black text-slate-100 leading-none select-none" aria-hidden="true">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-xl animate-bounce">
              <i className="fa-solid fa-map-signs" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Path Not Found</h1>
        <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back on track to your career goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
          >
            <i className="fa-solid fa-house mr-2" aria-hidden="true"></i> Return Home
          </Link>
          <Link 
            to="/courses" 
            className="px-10 py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 transition-all text-xs uppercase tracking-widest"
          >
            Browse Programs
          </Link>
        </div>
        <div className="mt-20 pt-10 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            S M Skills • Information Desk
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
