
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppState, SiteConfig } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface FAQPageProps {
  faqsState: AppState['faqs'];
  contact: SiteConfig['contact'];
}

const FAQPage: React.FC<FAQPageProps> = ({ faqsState, contact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { list, pageMeta } = faqsState;

  const toggleItem = (id: string) => {
    const next = new Set(openItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenItems(next);
  };

  const filteredFaqs = list.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(list.map(f => f.category)));
  const sanitizedPhone = contact.phone.replace(/[^\d+]/g, '');

  const emptyFallback = (
    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
      <i className="fa-solid fa-circle-question text-6xl text-slate-100 mb-6 block" aria-hidden="true"></i>
      <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No matching topics found</h3>
      <button 
        onClick={() => setSearchTerm('')}
        className="mt-8 px-10 py-4 bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-xl active:scale-95"
      >
        Clear Search Filter
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">{pageMeta.tagline}</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">{pageMeta.title}</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">{pageMeta.subtitle}</p>
          <div className="mt-12 max-w-2xl mx-auto relative">
            <label htmlFor="faq-search" className="sr-only">Search help topics</label>
            <input 
              id="faq-search"
              type="text"
              placeholder="Search help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-6 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <PageStateGuard isEmpty={filteredFaqs.length === 0} emptyFallback={emptyFallback}>
          {categories.map(category => {
            const categoryFaqs = filteredFaqs.filter(f => f.category === category);
            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em] mb-8 ml-4">{category}</h2>
                <div className="space-y-4">
                  {categoryFaqs.map(faq => {
                    const isOpen = openItems.has(faq.id);
                    return (
                      <div key={faq.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-xl">
                        <button 
                          onClick={() => toggleItem(faq.id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-content-${faq.id}`}
                          className="w-full flex items-center justify-between p-8 text-left focus:outline-none group"
                        >
                          <span className="text-lg md:text-xl font-black text-slate-900 group-hover:text-emerald-600">
                            {faq.question}
                          </span>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-45' : 'bg-slate-50 text-slate-400'}`} aria-hidden="true">
                            <i className="fa-solid fa-plus"></i>
                          </div>
                        </button>
                        <div 
                          id={`faq-content-${faq.id}`}
                          role="region"
                          aria-hidden={!isOpen}
                          className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] border-t border-slate-50' : 'max-h-0'}`}
                        >
                          <div className="p-8 md:p-10 text-slate-600 font-medium leading-relaxed text-lg">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </PageStateGuard>
      </div>
    </div>
  );
};

export default FAQPage;
