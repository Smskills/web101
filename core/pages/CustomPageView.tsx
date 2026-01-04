
import React from 'react';
import { CustomPage, SiteConfig } from '../types.ts';
import FormattedText from '../components/FormattedText.tsx';

interface CustomPageViewProps {
  page: CustomPage;
  siteConfig: SiteConfig;
}

const CustomPageView: React.FC<CustomPageViewProps> = ({ page, siteConfig }) => {
  return (
    <div className="min-h-screen bg-white pb-24">
      {page.showHeader && (
        <section className="bg-slate-900 py-32 text-white relative overflow-hidden text-center">
          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{siteConfig.name}</span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{page.title}</h1>
          </div>
        </section>
      )}

      <div className={`container mx-auto px-4 ${page.showHeader ? 'pt-20' : 'pt-32'} max-w-4xl`}>
        {!page.showHeader && (
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-12 tracking-tight">{page.title}</h1>
        )}
        
        <div className="prose prose-slate prose-lg lg:prose-xl max-w-none text-slate-700 leading-relaxed font-medium">
          <FormattedText text={page.content} />
        </div>
      </div>
    </div>
  );
};

export default CustomPageView;
