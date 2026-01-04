import React, { useState, useRef, useEffect } from 'react';
import { AppState, Course, Notice, FAQItem, FormField, PlacementStat, StudentReview, IndustryPartner, LegalSection, CareerService, CustomPage, TeamMember, PageMeta, SocialLink } from '../types.ts';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';
import { optimizeImage } from '../utils/imageOptimizer.ts';

// Modular Sections
import SiteTab from '../admin/SiteTab.tsx';
import HomeTab from '../admin/HomeTab.tsx';
import AboutTab from '../admin/AboutTab.tsx';
import CoursesTab from '../admin/CoursesTab.tsx';
import NoticesTab from '../admin/NoticesTab.tsx';
import GalleryTab from '../admin/GalleryTab.tsx';
import FAQTab from '../admin/FAQTab.tsx';
import FormTab from '../admin/FormTab.tsx';
import ContactTab from '../admin/ContactTab.tsx';
import FooterTab from '../admin/FooterTab.tsx';
import PlacementsTab from '../admin/PlacementsTab.tsx';
import LegalTab from '../admin/LegalTab.tsx';
import CareerTab from '../admin/CareerTab.tsx';
import PagesTab from '../admin/PagesTab.tsx';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'pages' | 'about' | 'courses' | 'notices' | 'gallery' | 'faq' | 'form' | 'contact' | 'footer' | 'placements' | 'legal' | 'career'>('site');
  const [localContent, setLocalContent] = useState(content);
  const [statusMsg, setStatusMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  useEffect(() => {
    setLocalContent(content);
    setHasUnsavedChanges(false);
  }, [content]);

  const genericUploadRef = useRef<HTMLInputElement>(null);
  const activeUploadPath = useRef<string | null>(null);
  const activeCourseId = useRef<string | null>(null);
  const activeReviewId = useRef<string | null>(null);
  const activePartnerId = useRef<string | null>(null);
  const activeCareerServiceId = useRef<string | null>(null);
  const activeUploadCategory = useRef<string>('General');
  const activeThumbnailCategory = useRef<string | null>(null);

  const handleSave = async () => {
    setIsProcessing(true);
    setStatusMsg('Syncing Database...');
    await new Promise(r => setTimeout(r, 600)); 
    onUpdate(localContent);
    setStatusMsg('Changes Saved Successfully');
    setIsProcessing(false);
    setHasUnsavedChanges(false);
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setLocalContent(content);
      setHasUnsavedChanges(false);
    }
  };

  const trackChange = () => setHasUnsavedChanges(true);

  const updateField = (section: keyof AppState, field: string, value: any) => {
    setLocalContent(prev => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
    trackChange();
  };

  const updateNestedField = (section: keyof AppState, parent: string, field: string, value: any) => {
    setLocalContent(prev => ({ ...prev, [section]: { ...(prev[section] as any), [parent]: { ...(prev[section] as any)[parent], [field]: value } } }));
    trackChange();
  };

  const handleGenericUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadPath.current) return;
    
    setIsProcessing(true);
    optimizeImage(file).then(url => {
      setLocalContent(prev => {
        const next = { ...prev };
        const pathParts = activeUploadPath.current!.split('.');
        
        if (pathParts[0] === 'courses' && activeCourseId.current) {
          next.courses.list = next.courses.list.map((c: any) => c.id === activeCourseId.current ? { ...c, image: url } : c);
          return next;
        }
        if (pathParts[0] === 'gallery') {
           if (pathParts[1] === 'thumbnails') {
              next.galleryMetadata = { ...(next.galleryMetadata || {}), [activeThumbnailCategory.current!]: url };
           } else {
              next.gallery.list = [{ id: Date.now().toString(), url, category: activeUploadCategory.current, title: '' }, ...next.gallery.list];
           }
           return next;
        }
        if (pathParts[0] === 'placements') {
          if (pathParts[1] === 'reviews') {
            next.placements.reviews = next.placements.reviews.map((r: any) => r.id === activeReviewId.current ? { ...r, image: url } : r);
          } else if (pathParts[1] === 'partners') {
            next.placements.partners = next.placements.partners.map((p: any) => p.id === activePartnerId.current ? { ...p, image: url } : p);
          }
          return next;
        }
        if (pathParts[0] === 'career' && activeCareerServiceId.current) {
          next.career.services = next.career.services.map((s: any) => s.id === activeCareerServiceId.current ? { ...s, image: url } : s);
          return next;
        }

        let current: any = next;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (pathParts[i] === 'members' && Array.isArray(current.members)) {
             const memberId = pathParts[i+1];
             current.members = current.members.map((m: any) => m.id === memberId ? { ...m, image: url } : m);
             return next;
          }
          current = current[pathParts[i]];
        }
        current[pathParts[pathParts.length - 1]] = url;
        return next;
      });
      setHasUnsavedChanges(true);
      setIsProcessing(false);
    });
  };

  const updatePageMeta = (section: keyof AppState, field: keyof PageMeta, value: string) => {
    setLocalContent(prev => {
      const target: any = prev[section];
      if (target && target.pageMeta) {
        return { ...prev, [section]: { ...target, pageMeta: { ...target.pageMeta, [field]: value } } };
      }
      return prev;
    });
    trackChange();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <input type="file" ref={genericUploadRef} className="hidden" accept="image/*" onChange={handleGenericUpload} />

      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-40 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black uppercase tracking-tight">
              <i className="fa-solid fa-gauge-high text-emerald-500 mr-3"></i> Core Logic
            </h1>
            {statusMsg && <span className="text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{statusMsg}</span>}
          </div>
          <div className="flex items-center gap-2">
              <button onClick={handleDiscard} className="px-5 py-2 text-slate-400 hover:text-white text-xs font-black transition-all border border-slate-700 rounded-lg">DISCARD</button>
              <button onClick={handleSave} className={`px-8 py-2 rounded-lg text-xs font-black transition-all active:scale-95 shadow-lg ${hasUnsavedChanges ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse shadow-emerald-500/20' : 'bg-slate-700 text-slate-300 cursor-default'}`}>SAVE DATABASE</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {(['site', 'home', 'pages', 'about', 'courses', 'notices', 'gallery', 'faq', 'placements', 'career', 'legal', 'form', 'contact', 'footer'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all capitalize flex items-center gap-3 border ${activeTab === tab ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl' : 'text-slate-500 border-transparent hover:bg-slate-800'}`}
            >
              <i className={`fa-solid fa-${tab === 'site' ? 'globe' : tab === 'home' ? 'house' : tab === 'pages' ? 'file-lines' : tab === 'about' ? 'circle-info' : tab === 'courses' ? 'graduation-cap' : tab === 'notices' ? 'bullhorn' : tab === 'gallery' ? 'images' : tab === 'faq' ? 'circle-question' : tab === 'contact' ? 'address-book' : tab === 'footer' ? 'shoe-prints' : tab === 'placements' ? 'briefcase' : tab === 'career' ? 'user-graduate' : tab === 'legal' ? 'scale-balanced' : 'wpforms'}`}></i>
              {tab === 'form' ? 'Enroll Page' : tab}
            </button>
          ))}
        </div>

        <div className="flex-grow bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700 shadow-3xl min-h-[70vh]">
          {activeTab === 'site' && <SiteTab 
            data={localContent.site} theme={localContent.theme} 
            updateTheme={(f, v) => updateField('theme', f, v)} updateField={(f, v) => updateField('site', f, v)} 
            onLogoUploadClick={() => { activeUploadPath.current = 'site.logo'; genericUploadRef.current?.click(); }} onExport={() => {}} onImport={() => {}}
            updateNavigation={(idx, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: prev.site.navigation.map((n, i) => i === idx ? { ...n, [f]: v } : n) } })); trackChange(); }} 
            addNavigation={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: [...prev.site.navigation, { label: 'New Link', path: '/' }] } })); trackChange(); }} 
            removeNavigation={(idx) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: prev.site.navigation.filter((_, i) => i !== idx) } })); trackChange(); }} 
          />}
          
          {activeTab === 'home' && <HomeTab 
            data={localContent.home} 
            updateNestedField={(p, f, v) => updateNestedField('home', p, f, v)} 
            updateHomeSubField={(p, f, v) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, [p]: { ...(prev.home as any)[p], [f]: v } } })); trackChange(); }}
            onHeroBgClick={() => { activeUploadPath.current = 'home.hero.bgImage'; genericUploadRef.current?.click(); }} 
            onShowcaseImgClick={() => { activeUploadPath.current = 'home.bigShowcase.image'; genericUploadRef.current?.click(); }} 
            addHighlight={() => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: [...prev.home.highlights, { icon: 'fa-star', title: 'New Highlight', description: '' }] } })); trackChange(); }} 
            updateHighlight={(idx, f, v) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.map((h, i) => i === idx ? { ...h, [f]: v } : h) } })); trackChange(); }} 
            deleteHighlight={(idx) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.filter((_, i) => i !== idx) } })); trackChange(); }} 
            reorderSections={(idx, dir) => { setLocalContent(prev => { const order = [...prev.home.sectionOrder]; const t = dir === 'up' ? idx - 1 : idx + 1; if (t >= 0 && t < order.length) [order[idx], order[t]] = [order[t], order[idx]]; return { ...prev, home: { ...prev.home, sectionOrder: order } }; }); trackChange(); }}
          />}

          {activeTab === 'about' && <AboutTab 
             data={localContent.about} 
             updateChapter={(chap, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, [chap]: { ...(prev.about as any)[chap], [f]: v } } })); trackChange(); }}
             triggerUpload={(path) => { activeUploadPath.current = path; genericUploadRef.current?.click(); }}
             addTeamMember={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: [...prev.about.faculty.members, { id: Date.now().toString(), name: 'New Faculty', role: 'Mentor', bio: 'Expertise...', image: 'https://i.pravatar.cc/150' }] } } })); trackChange(); }}
             updateTeamMember={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: prev.about.faculty.members.map(m => m.id === id ? { ...m, [f]: v } : m) } } })); trackChange(); }}
             removeTeamMember={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: prev.about.faculty.members.filter(m => m.id !== id) } } })); trackChange(); }}
             updateStats={(idx, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: prev.about.achievements.stats.map((s, i) => i === idx ? { ...s, [f]: v } : s) } } })); trackChange(); }}
             updateValues={(idx, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: prev.about.vision.values.map((val, i) => i === idx ? v : val) } } })); trackChange(); }}
             addValue={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: [...prev.about.vision.values, 'New Value'] } } })); trackChange(); }}
             removeValue={(idx) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: prev.about.vision.values.filter((_, i) => i !== idx) } } })); trackChange(); }}
          />}

          {activeTab === 'form' && <FormTab 
            formData={localContent.enrollmentForm} 
            addField={() => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: [...(prev.enrollmentForm.fields || []), { id: Date.now().toString(), label: 'New Field', type: 'text', placeholder: '', required: false }] } })); trackChange(); }} 
            updateField={(id, up) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.map(f => f.id === id ? { ...f, ...up } : f) } })); trackChange(); }} 
            deleteField={(id) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.filter(f => f.id !== id) } })); trackChange(); }} 
            updatePageInfo={(f, v) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, [f]: v } })); trackChange(); }} 
          />}

          {activeTab === 'contact' && <ContactTab 
            contact={localContent.site.contact} 
            social={localContent.site.social} 
            contactForm={localContent.contactForm}
            updateContactField={(f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, contact: { ...prev.site.contact, [f]: v } } })); trackChange(); }} 
            addSocialLink={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: [...prev.site.social, { id: Date.now().toString(), platform: 'New', url: '#', icon: 'fa-globe' }] } })); trackChange(); }} 
            updateSocialLink={(id, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }} 
            removeSocialLink={(id) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.filter(s => s.id !== id) } })); trackChange(); }} 
            addFormField={() => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: [...(prev.contactForm.fields || []), { id: Date.now().toString(), label: 'New Field', type: 'text', placeholder: '', required: false }] } })); trackChange(); }}
            updateFormField={(id, up) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: prev.contactForm.fields.map(f => f.id === id ? { ...f, ...up } : f) } })); trackChange(); }}
            deleteFormField={(id) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: prev.contactForm.fields.filter(f => f.id !== id) } })); trackChange(); }}
            updateFormTitle={(v) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, title: v } })); trackChange(); }}
          />}

          {activeTab === 'footer' && <FooterTab 
            footer={localContent.site.footer} 
            updateFooterField={(f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, [f]: v } } })); trackChange(); }} 
            addSupportLink={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: [...prev.site.footer.supportLinks, { label: 'New Link', path: '#' }] } } })); trackChange(); }} 
            updateSupportLink={(idx, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.map((l, i) => i === idx ? { ...l, [f]: v } : l) } } })); trackChange(); }} 
            deleteSupportLink={(idx) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.filter((_, i) => i !== idx) } } })); trackChange(); }} 
          />}

          {activeTab === 'legal' && <LegalTab 
            legal={localContent.legal} 
            updateLegal={(p, f, v) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], [f]: v } } })); trackChange(); }} 
            updateSection={(p, id, f, v) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: prev.legal[p].sections.map(s => s.id === id ? { ...s, [f]: v } : s) } } })); trackChange(); }} 
            addSection={(p) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: [...(prev.legal[p].sections || []), { id: Date.now().toString(), title: 'New', content: '' }] } } })); trackChange(); }} 
            deleteSection={(p, id) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: prev.legal[p].sections.filter(s => s.id !== id) } } })); trackChange(); }} 
          />}

          {activeTab === 'courses' && <CoursesTab coursesState={localContent.courses} updateCourseItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: prev.courses.list.map(c => c.id === id ? { ...c, [f]: v } : c) } })); trackChange(); }} updatePageMeta={(f, v) => updatePageMeta('courses', f, v)} onCourseImageClick={(id) => { activeCourseId.current = id; activeUploadPath.current = 'courses'; genericUploadRef.current?.click(); }} addItem={() => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: [{ id: Date.now().toString(), name: 'New Track', duration: '6 Months', mode: 'Hybrid', description: 'Details...', status: 'Active', image: 'https://picsum.photos/800/600', price: '$1,000' }, ...prev.courses.list] } })); trackChange(); }} deleteItem={(id) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: prev.courses.list.filter(c => c.id !== id) } })); trackChange(); }} />}
          {activeTab === 'notices' && <NoticesTab noticesState={localContent.notices} updateNoticeItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: prev.notices.list.map(n => n.id === id ? { ...n, [f]: v } : n) } })); trackChange(); }} updatePageMeta={(f, v) => updatePageMeta('notices', f, v)} addItem={() => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: [{ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: 'New Notice', description: '', isImportant: false, category: 'General' }, ...prev.notices.list] } })); trackChange(); }} deleteItem={(id) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: prev.notices.list.filter(n => n.id !== id) } })); trackChange(); }} />}
          {activeTab === 'gallery' && <GalleryTab galleryState={localContent.gallery} galleryMetadata={localContent.galleryMetadata} updateGalleryItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, list: prev.gallery.list.map(i => i.id === id ? { ...i, [f]: v } : i) } })); trackChange(); }} updatePageMeta={(f, v) => updatePageMeta('gallery', f, v)} deleteItem={(id) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, list: prev.gallery.list.filter(i => i.id !== id) } })); trackChange(); }} triggerUpload={(cat) => { activeUploadCategory.current = cat; activeUploadPath.current = 'gallery'; genericUploadRef.current?.click(); }} triggerThumbnailUpload={(cat) => { activeThumbnailCategory.current = cat; activeUploadPath.current = 'gallery.thumbnails'; genericUploadRef.current?.click(); }} />}
          {activeTab === 'faq' && <FAQTab faqsState={localContent.faqs} updateFAQ={(id, f, v) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: prev.faqs.list.map(item => item.id === id ? { ...item, [f]: v } : item) } })); trackChange(); }} updatePageMeta={(f, v) => updatePageMeta('faqs', f, v)} addFAQ={() => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: [{ id: Date.now().toString(), question: 'New Question', answer: '', category: 'General' }, ...prev.faqs.list] } })); trackChange(); }} deleteFAQ={(id) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: prev.faqs.list.filter(f => f.id !== id) } })); trackChange(); }} reorderFAQs={(s, e) => { if (e < 0 || e >= localContent.faqs.list.length) return; setLocalContent(prev => { const res = Array.from(prev.faqs.list); const [rem] = res.splice(s, 1); res.splice(e, 0, rem); return { ...prev, faqs: { ...prev.faqs, list: res } }; }); trackChange(); }} />}
          {activeTab === 'placements' && <PlacementsTab stats={localContent.placements.stats} reviews={localContent.placements.reviews} partners={localContent.placements.partners} pageMeta={localContent.placements.pageMeta} wallTitle={localContent.placements.wallTitle} pageDescription={localContent.placements.pageDescription} updateStat={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }} addStat={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: [...prev.placements.stats, { id: Date.now().toString(), label: 'Stat', value: '0', icon: 'fa-chart-simple' }] } })); trackChange(); }} deleteStat={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.filter(s => s.id !== id) } })); trackChange(); }} updateReview={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.map(r => r.id === id ? { ...r, [f]: v } : r) } })); trackChange(); }} addReview={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: [{ id: Date.now().toString(), name: 'Student', course: 'Track', company: 'Company', companyIcon: 'fa-building', image: 'https://i.pravatar.cc/150', text: '', salaryIncrease: '' }, ...prev.placements.reviews] } })); trackChange(); }} deleteReview={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.filter(r => r.id !== id) } })); trackChange(); }} updatePartner={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.map(p => p.id === id ? { ...p, [f]: v } : p) } })); trackChange(); }} addPartner={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: [...prev.placements.partners, { id: Date.now().toString(), name: 'New Partner', icon: 'fa-building' }] } })); trackChange(); }} deletePartner={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.filter(p => p.id !== id) } })); trackChange(); }} updatePageMeta={(f, v) => updatePageMeta('placements', f, v)} updateWallTitle={(v) => updateField('placements', 'wallTitle', v)} updatePageDescription={(v) => updateField('placements', 'pageDescription', v)} onReviewImageClick={(id) => { activeReviewId.current = id; activeUploadPath.current = 'placements.reviews'; genericUploadRef.current?.click(); }} onPartnerImageClick={(id) => { activePartnerId.current = id; activeUploadPath.current = 'placements.partners'; genericUploadRef.current?.click(); }} />}
          {activeTab === 'career' && <CareerTab career={localContent.career} updateHero={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, hero: { ...prev.career.hero, [f]: v } } })); trackChange(); }} updatePageMeta={(f, v) => updatePageMeta('career', f, v)} updateCta={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, cta: { ...prev.career.cta, [f]: v } } })); trackChange(); }} updateService={(id, f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }} addService={() => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: [...prev.career.services, { id: Date.now().toString(), title: 'New Service', description: '', icon: 'fa-star' }] } })); trackChange(); }} deleteService={(id) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.filter(s => s.id !== id) } })); trackChange(); }} onHeroBgClick={() => { activeUploadPath.current = 'career.hero.bgImage'; genericUploadRef.current?.click(); }} onServiceImageClick={(id) => { activeCareerServiceId.current = id; activeUploadPath.current = 'career.services'; genericUploadRef.current?.click(); }} />}
          {activeTab === 'pages' && <PagesTab pages={localContent.customPages} addPage={() => { setLocalContent(prev => ({ ...prev, customPages: [...prev.customPages, { id: Date.now().toString(), title: 'New Page', slug: '/new', content: '', visible: false, showHeader: true }] })); trackChange(); }} updatePage={(id, up) => { setLocalContent(prev => ({ ...prev, customPages: prev.customPages.map(p => p.id === id ? { ...p, ...up } : p) })); trackChange(); }} deletePage={(id) => { setLocalContent(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== id) })); trackChange(); }} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;