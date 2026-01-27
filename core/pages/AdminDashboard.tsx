
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Course, Notice, FAQItem, FormField, PlacementStat, StudentReview, IndustryPartner, LegalSection, CareerService, CustomPage, TeamMember, PageMeta, SocialLink, AchievementStat, ExtraChapter, Lead } from '../types.ts';
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
import LeadsTab from '../admin/LeadsTab.tsx';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'pages' | 'about' | 'courses' | 'notices' | 'gallery' | 'faq' | 'form' | 'contact' | 'footer' | 'placements' | 'legal' | 'career' | 'leads'>('site');
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

  const handleLogout = () => {
    if (window.confirm("End administrator session? Any unsaved changes will be lost.")) {
      localStorage.removeItem('sms_auth_token');
      localStorage.removeItem('sms_is_auth');
      window.dispatchEvent(new Event('authChange'));
      navigate('/login');
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
    if (!file || !activeUploadPath.current || isProcessing) return;
    
    // Clear input value immediately to allow re-uploading the same file if needed 
    // and prevent browser-level duplicate change triggers
    const inputElement = e.target;
    
    setIsProcessing(true);
    optimizeImage(file).then(url => {
      setLocalContent(prev => {
        // CRITICAL FIX: Ensure we clone nested objects to avoid direct state mutation.
        // Direct mutation causes bugs in React 18 Strict Mode where updaters run twice.
        const next = { ...prev };
        const pathParts = activeUploadPath.current!.split('.');
        
        if (pathParts[0] === 'courses' && activeCourseId.current) {
          next.courses = {
            ...next.courses,
            list: next.courses.list.map((c: any) => c.id === activeCourseId.current ? { ...c, image: url } : c)
          };
          return next;
        }
        
        if (pathParts[0] === 'gallery') {
           if (pathParts[1] === 'thumbnails') {
              next.galleryMetadata = { ...(next.galleryMetadata || {}), [activeThumbnailCategory.current!]: url };
           } else {
              // Properly clone gallery and list to prevent double-add in StrictMode
              next.gallery = {
                ...next.gallery,
                list: [{ id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, url, category: activeUploadCategory.current, title: '' }, ...next.gallery.list]
              };
           }
           return next;
        }
        
        if (pathParts[0] === 'placements') {
          next.placements = { ...next.placements };
          if (pathParts[1] === 'reviews') {
            next.placements.reviews = next.placements.reviews.map((r: any) => r.id === activeReviewId.current ? { ...r, image: url } : r);
          } else if (pathParts[1] === 'partners') {
            next.placements.partners = next.placements.partners.map((p: any) => p.id === activePartnerId.current ? { ...p, image: url } : p);
          }
          return next;
        }
        
        if (pathParts[0] === 'career' && activeCareerServiceId.current) {
          next.career = {
            ...next.career,
            services: next.career.services.map((s: any) => s.id === activeCareerServiceId.current ? { ...s, image: url } : s)
          };
          return next;
        }

        // Generic deep-ish fallback update
        let current: any = next;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const key = pathParts[i];
          if (key === 'members' && Array.isArray(current.members)) {
             const memberId = pathParts[i+1];
             current.members = current.members.map((m: any) => m.id === memberId ? { ...m, image: url } : m);
             return next;
          }
          // Clone the intermediate object
          current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
          current = current[key];
        }
        current[pathParts[pathParts.length - 1]] = url;
        return next;
      });
      setHasUnsavedChanges(true);
      setIsProcessing(false);
      inputElement.value = ''; // Reset file input
    }).catch(err => {
      console.error("Upload failed:", err);
      setIsProcessing(false);
      inputElement.value = '';
    });
  };

  const triggerGenericUpload = (path: string) => {
    activeUploadPath.current = path;
    genericUploadRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 font-sans">
      <input type="file" ref={genericUploadRef} className="hidden" accept="image/*" onChange={handleGenericUpload} />

      {/* Admin Action Bar - Sticky below the full header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-36 md:top-[11.5rem] z-[80] shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black uppercase tracking-tight">
              <i className="fa-solid fa-gauge-high text-emerald-500 mr-3"></i> Institute Admin
            </h1>
            {statusMsg && <span className="text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{statusMsg}</span>}
          </div>
          <div className="flex items-center gap-2">
              <button onClick={handleDiscard} className="px-5 py-2 text-slate-400 hover:text-white text-xs font-black transition-all border border-slate-700 rounded-lg">DISCARD</button>
              <button onClick={handleSave} className={`px-8 py-2 rounded-lg text-xs font-black transition-all active:scale-95 shadow-lg ${hasUnsavedChanges ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse shadow-emerald-500/20' : 'bg-slate-700 text-slate-300 cursor-default'}`}>SAVE DATABASE</button>
              <div className="w-px h-8 bg-slate-700 mx-2"></div>
              <button onClick={handleLogout} className="px-4 py-2 text-slate-400 hover:text-red-500 text-xs font-black transition-all flex items-center gap-2 group">
                <i className="fa-solid fa-power-off group-hover:scale-110 transition-transform"></i> LOGOUT
              </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <button
              onClick={() => setActiveTab('leads')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all capitalize flex items-center gap-3 border ${activeTab === 'leads' ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl' : 'text-emerald-500/70 bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10'}`}
            >
              <i className="fa-solid fa-user-graduate"></i>
              Student Leads
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="h-px bg-slate-700/50 my-4"></div>

          {(['site', 'home', 'pages', 'about', 'courses', 'notices', 'gallery', 'faq', 'form', 'contact', 'footer', 'placements', 'legal', 'career'] as const).map(tab => (
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

        <div className="flex-grow bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-3xl min-h-[70vh]">
          {activeTab === 'leads' && <LeadsTab leads={localContent.leads || []} onUpdateLeads={(updated) => { setLocalContent(prev => ({ ...prev, leads: updated })); trackChange(); }} />}
          
          {activeTab === 'site' && <SiteTab 
            data={localContent.site} theme={localContent.theme} 
            updateTheme={(f, v) => updateField('theme', f, v)} updateField={(f, v) => updateField('site', f, v)} 
            onLogoUploadClick={() => triggerGenericUpload('site.logo')} onExport={() => {}} onImport={() => {}}
            updateNavigation={(idx, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: prev.site.navigation.map((n, i) => i === idx ? { ...n, [f]: v } : n) } })); trackChange(); }} 
            addNavigation={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: [...prev.site.navigation, { label: 'New Link', path: '/' }] } })); trackChange(); }} 
            removeNavigation={(idx) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, navigation: prev.site.navigation.filter((_, i) => i !== idx) } })); trackChange(); }} 
          />}
          
          {activeTab === 'home' && <HomeTab 
            data={localContent.home} 
            updateNestedField={(p, f, v) => updateNestedField('home', p, f, v)} 
            updateHomeSubField={(p, f, v) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, [p]: { ...(prev.home as any)[p], [f]: v } } })); trackChange(); }}
            onHeroBgClick={() => triggerGenericUpload('home.hero.bgImage')} 
            onShowcaseImgClick={() => triggerGenericUpload('home.bigShowcase.image')} 
            addHighlight={() => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: [...prev.home.highlights, { icon: 'fa-star', title: 'New', description: '' }] } })); trackChange(); }} 
            updateHighlight={(idx, f, v) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.map((h, i) => i === idx ? { ...h, [f]: v } : h) } })); trackChange(); }} 
            deleteHighlight={(idx) => { setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.filter((_, i) => i !== idx) } })); trackChange(); }} 
            reorderSections={(idx, dir) => { setLocalContent(prev => { const order = [...prev.home.sectionOrder]; const t = dir === 'up' ? idx - 1 : idx + 1; if (t >= 0 && t < order.length) [order[idx], order[t]] = [order[t], order[idx]]; return { ...prev, home: { ...prev.home, sectionOrder: order } }; }); trackChange(); }}
          />}

          {activeTab === 'about' && <AboutTab 
            data={localContent.about}
            updateChapter={(ch, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, [ch]: { ...(prev.about as any)[ch], [f]: v } } })); trackChange(); }}
            triggerUpload={(p) => triggerGenericUpload(p)}
            addTeamMember={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: [...prev.about.faculty.members, { id: Date.now().toString(), name: 'Name', role: 'Role', bio: '', image: 'https://i.pravatar.cc/150' }] } } })); trackChange(); }}
            updateTeamMember={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: prev.about.faculty.members.map(m => m.id === id ? { ...m, [f]: v } : m) } } })); trackChange(); }}
            removeTeamMember={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, faculty: { ...prev.about.faculty, members: prev.about.faculty.members.filter(m => m.id !== id) } } })); trackChange(); }}
            updateStats={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: prev.about.achievements.stats.map(s => s.id === id ? { ...s, [f]: v } : s) } } })); trackChange(); }}
            addStat={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: [...prev.about.achievements.stats, { id: Date.now().toString(), label: 'Stat', value: '0' }] } } })); trackChange(); }}
            removeStat={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, achievements: { ...prev.about.achievements, stats: prev.about.achievements.stats.filter(s => s.id !== id) } } })); trackChange(); }}
            updateValues={(idx, v) => { setLocalContent(prev => { const next = [...prev.about.vision.values]; next[idx] = v; return { ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: next } } }; }); trackChange(); }}
            addValue={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: [...prev.about.vision.values, 'New Value'] } } })); trackChange(); }}
            removeValue={(idx) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, vision: { ...prev.about.vision, values: prev.about.vision.values.filter((_, i) => i !== idx) } } })); trackChange(); }}
            addExtraChapter={() => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, extraChapters: [...(prev.about.extraChapters || []), { id: Date.now().toString(), label: 'CH', title: 'Title', story: '', image: '' }] } })); trackChange(); }}
            updateExtraChapter={(id, f, v) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, extraChapters: prev.about.extraChapters.map(c => c.id === id ? { ...c, [f]: v } : c) } })); trackChange(); }}
            removeExtraChapter={(id) => { setLocalContent(prev => ({ ...prev, about: { ...prev.about, extraChapters: prev.about.extraChapters.filter(c => c.id !== id) } })); trackChange(); }}
          />}

          {activeTab === 'courses' && <CoursesTab 
            coursesState={localContent.courses}
            updateCourseItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: prev.courses.list.map(c => c.id === id ? { ...c, [f]: v } : c) } })); trackChange(); }}
            updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, pageMeta: { ...prev.courses.pageMeta, [f]: v } } })); trackChange(); }}
            onCourseImageClick={(id) => { activeCourseId.current = id; triggerGenericUpload('courses.list'); }}
            addItem={() => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: [{ id: Date.now().toString(), name: 'New Program', duration: '6 Months', mode: 'Offline', description: '', status: 'Active', image: 'https://picsum.photos/800/600' }, ...prev.courses.list] } })); trackChange(); }}
            deleteItem={(id) => { setLocalContent(prev => ({ ...prev, courses: { ...prev.courses, list: prev.courses.list.filter(c => c.id !== id) } })); trackChange(); }}
          />}

          {activeTab === 'notices' && <NoticesTab 
            noticesState={localContent.notices}
            updateNoticeItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: prev.notices.list.map(n => n.id === id ? { ...n, [f]: v } : n) } })); trackChange(); }}
            updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, pageMeta: { ...prev.notices.pageMeta, [f]: v } } })); trackChange(); }}
            addItem={() => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: [{ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], title: 'Announcement', description: '', isImportant: false, category: 'General' }, ...prev.notices.list] } })); trackChange(); }}
            deleteItem={(id) => { setLocalContent(prev => ({ ...prev, notices: { ...prev.notices, list: prev.notices.list.filter(n => n.id !== id) } })); trackChange(); }}
          />}

          {activeTab === 'gallery' && <GalleryTab 
            galleryState={localContent.gallery} galleryMetadata={localContent.galleryMetadata}
            updateGalleryItem={(id, f, v) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, list: prev.gallery.list.map(i => i.id === id ? { ...i, [f]: v } : i) } })); trackChange(); }}
            updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, pageMeta: { ...prev.gallery.pageMeta, [f]: v } } })); trackChange(); }}
            deleteItem={(id) => { setLocalContent(prev => ({ ...prev, gallery: { ...prev.gallery, list: prev.gallery.list.filter(i => i.id !== id) } })); trackChange(); }}
            triggerUpload={(cat) => { activeUploadCategory.current = cat; triggerGenericUpload('gallery'); }}
            triggerThumbnailUpload={(cat) => { activeThumbnailCategory.current = cat; triggerGenericUpload('gallery.thumbnails'); }}
          />}

          {activeTab === 'faq' && <FAQTab 
            faqsState={localContent.faqs}
            updateFAQ={(id, f, v) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: prev.faqs.list.map(i => i.id === id ? { ...i, [f]: v } : i) } })); trackChange(); }}
            updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, pageMeta: { ...prev.faqs.pageMeta, [f]: v } } })); trackChange(); }}
            addFAQ={() => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: [{ id: Date.now().toString(), question: 'Question?', answer: '', category: 'General' }, ...prev.faqs.list] } })); trackChange(); }}
            deleteFAQ={(id) => { setLocalContent(prev => ({ ...prev, faqs: { ...prev.faqs, list: prev.faqs.list.filter(i => i.id !== id) } })); trackChange(); }}
            reorderFAQs={(s, e) => { setLocalContent(prev => { const next = [...prev.faqs.list]; const [rem] = next.splice(s, 1); next.splice(e, 0, rem); return { ...prev, faqs: { ...prev.faqs, list: next } }; }); trackChange(); }}
          />}

          {activeTab === 'form' && <FormTab 
            formData={localContent.enrollmentForm}
            addField={() => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: [...prev.enrollmentForm.fields, { id: Date.now().toString(), label: 'New Field', type: 'text', placeholder: '', required: false }] } })); trackChange(); }}
            updateField={(id, up) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.map(f => f.id === id ? { ...f, ...up } : f) } })); trackChange(); }}
            deleteField={(id) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.filter(f => f.id !== id) } })); trackChange(); }}
            updatePageInfo={(f, v) => { setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, [f]: v } })); trackChange(); }}
          />}

          {activeTab === 'contact' && <ContactTab 
            contact={localContent.site.contact} social={localContent.site.social} contactForm={localContent.contactForm}
            updateContactField={(f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, contact: { ...prev.site.contact, [f]: v } } })); trackChange(); }}
            addSocialLink={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: [...prev.site.social, { id: Date.now().toString(), platform: 'New', url: '#', icon: 'fa-globe' }] } })); trackChange(); }}
            updateSocialLink={(id, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }}
            removeSocialLink={(id) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.filter(s => s.id !== id) } })); trackChange(); }}
            addFormField={() => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: [...prev.contactForm.fields, { id: Date.now().toString(), label: 'New', type: 'text', placeholder: '', required: false }] } })); trackChange(); }}
            updateFormField={(id, up) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: prev.contactForm.fields.map(f => f.id === id ? { ...f, ...up } : f) } })); trackChange(); }}
            deleteFormField={(id) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, fields: prev.contactForm.fields.filter(f => f.id !== id) } })); trackChange(); }}
            updateFormTitle={(v) => { setLocalContent(prev => ({ ...prev, contactForm: { ...prev.contactForm, title: v } })); trackChange(); }}
          />}

          {activeTab === 'footer' && <FooterTab 
            footer={localContent.site.footer}
            updateFooterField={(f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, [f]: v } } })); trackChange(); }}
            addSupportLink={() => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: [...prev.site.footer.supportLinks, { label: 'New', path: '#' }] } } })); trackChange(); }}
            updateSupportLink={(idx, f, v) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.map((l, i) => i === idx ? { ...l, [f]: v } : l) } } })); trackChange(); }}
            deleteSupportLink={(idx) => { setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.filter((_, i) => i !== idx) } } })); trackChange(); }}
          />}

          {activeTab === 'placements' && <PlacementsTab 
            stats={localContent.placements.stats} reviews={localContent.placements.reviews} partners={localContent.placements.partners} 
            pageMeta={localContent.placements.pageMeta} wallTitle={localContent.placements.wallTitle} pageDescription={localContent.placements.pageDescription}
            updateStat={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }}
            addStat={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: [...prev.placements.stats, { id: Date.now().toString(), label: 'Label', value: '0', icon: 'fa-chart-line' }] } })); trackChange(); }}
            deleteStat={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.filter(s => s.id !== id) } })); trackChange(); }}
            updateReview={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.map(r => r.id === id ? { ...r, [f]: v } : r) } })); trackChange(); }}
            addReview={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: [{ id: Date.now().toString(), name: 'Name', course: 'Track', company: 'Org', companyIcon: 'fa-building', image: 'https://i.pravatar.cc/150', text: '', salaryIncrease: '' }, ...prev.placements.reviews] } })); trackChange(); }}
            deleteReview={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.filter(r => r.id !== id) } })); trackChange(); }}
            updatePartner={(id, f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.map(p => p.id === id ? { ...p, [f]: v } : p) } })); trackChange(); }}
            addPartner={() => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: [...prev.placements.partners, { id: Date.now().toString(), name: 'New Partner', icon: 'fa-building' }] } })); trackChange(); }}
            deletePartner={(id) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.filter(p => p.id !== id) } })); trackChange(); }}
            updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, pageMeta: { ...prev.placements.pageMeta, [f]: v } } })); trackChange(); }}
            updateWallTitle={(v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, wallTitle: v } })); trackChange(); }}
            updatePageDescription={(v) => { setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, pageDescription: v } })); trackChange(); }}
            onReviewImageClick={(id) => { activeReviewId.current = id; triggerGenericUpload('placements.reviews'); }}
            onPartnerImageClick={(id) => { activePartnerId.current = id; triggerGenericUpload('placements.partners'); }}
          />}

          {activeTab === 'legal' && <LegalTab 
            legal={localContent.legal}
            updateLegal={(p, f, v) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], [f]: v } } })); trackChange(); }}
            updateSection={(p, id, f, v) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: prev.legal[p].sections.map(s => s.id === id ? { ...s, [f]: v } : s) } } })); trackChange(); }}
            addSection={(p) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: [...prev.legal[p].sections, { id: Date.now().toString(), title: 'New Section', content: '' }] } } })); trackChange(); }}
            deleteSection={(p, id) => { setLocalContent(prev => ({ ...prev, legal: { ...prev.legal, [p]: { ...prev.legal[p], sections: prev.legal[p].sections.filter(s => s.id !== id) } } })); trackChange(); }}
          />}

          {activeTab === 'career' && <CareerTab 
            career={localContent.career}
            updateHero={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, hero: { ...prev.career.hero, [f]: v } } })); trackChange(); }}
            updatePageMeta={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, pageMeta: { ...prev.career.pageMeta, [f]: v } } })); trackChange(); }}
            updateCta={(f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, cta: { ...prev.career.cta, [f]: v } } })); trackChange(); }}
            updateService={(id, f, v) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.map(s => s.id === id ? { ...s, [f]: v } : s) } })); trackChange(); }}
            addService={() => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: [...prev.career.services, { id: Date.now().toString(), title: 'New Service', description: '', icon: 'fa-compass' }] } })); trackChange(); }}
            deleteService={(id) => { setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.filter(s => s.id !== id) } })); trackChange(); }}
            onHeroBgClick={() => triggerGenericUpload('career.hero.bgImage')}
            onServiceImageClick={(id) => { activeCareerServiceId.current = id; triggerGenericUpload('career.services'); }}
          />}

          {activeTab === 'pages' && <PagesTab 
            pages={localContent.customPages}
            addPage={() => { setLocalContent(prev => ({ ...prev, customPages: [...prev.customPages, { id: Date.now().toString(), title: 'New Page', slug: '/new', content: '', visible: false, showHeader: true }] })); trackChange(); }}
            updatePage={(id, up) => { setLocalContent(prev => ({ ...prev, customPages: prev.customPages.map(p => p.id === id ? { ...p, ...up } : p) })); trackChange(); }}
            deletePage={(id) => { setLocalContent(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== id) })); trackChange(); }}
          />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
