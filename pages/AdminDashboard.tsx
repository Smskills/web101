
import React, { useState, useRef, useEffect } from 'react';
import { AppState, Course, Notice, GalleryItem, FormField, SocialLink, PlacementStat, StudentReview, IndustryPartner, LegalSection, CareerService } from '../types.ts';
import { INITIAL_CONTENT } from '../data/defaultContent.ts';
import { optimizeImage } from '../utils/imageOptimizer.ts';

// Modular Sections
import SiteTab from '../admin/SiteTab.tsx';
import HomeTab from '../admin/HomeTab.tsx';
import CoursesTab from '../admin/CoursesTab.tsx';
import NoticesTab from '../admin/NoticesTab.tsx';
import GalleryTab from '../admin/GalleryTab.tsx';
import FormTab from '../admin/FormTab.tsx';
import ContactTab from '../admin/ContactTab.tsx';
import FooterTab from '../admin/FooterTab.tsx';
import PlacementsTab from '../admin/PlacementsTab.tsx';
import LegalTab from '../admin/LegalTab.tsx';
import CareerTab from '../admin/CareerTab.tsx';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'courses' | 'notices' | 'gallery' | 'form' | 'contact' | 'footer' | 'placements' | 'legal' | 'career'>('site');
  const [localContent, setLocalContent] = useState(content);
  const [statusMsg, setStatusMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const courseInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);
  const showcaseImgInputRef = useRef<HTMLInputElement>(null);
  const reviewInputRef = useRef<HTMLInputElement>(null);
  const partnerInputRef = useRef<HTMLInputElement>(null);
  const careerHeroBgInputRef = useRef<HTMLInputElement>(null);
  const careerServiceInputRef = useRef<HTMLInputElement>(null);
  
  const activeUploadCategory = useRef<string>('General');
  const activeThumbnailCategory = useRef<string | null>(null);
  const activeCourseId = useRef<string | null>(null);
  const activeReviewId = useRef<string | null>(null);
  const activePartnerId = useRef<string | null>(null);
  const activeCareerServiceId = useRef<string | null>(null);

  const handleSave = async () => {
    setIsProcessing(true);
    setStatusMsg('Saving changes...');
    await new Promise(r => setTimeout(r, 600)); // UX feedback delay
    onUpdate(localContent);
    setStatusMsg('Changes saved successfully!');
    setIsProcessing(false);
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved changes and revert to the last saved version?")) {
      setLocalContent(content);
      setStatusMsg('Changes discarded.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleFactoryReset = () => {
    if (window.confirm("RESTORE FACTORY SETTINGS? This will delete all custom content and reset the institute to its original state.")) {
      setLocalContent(INITIAL_CONTENT);
      onUpdate(INITIAL_CONTENT);
      setStatusMsg('Site has been reset to defaults.');
      setTimeout(() => setStatusMsg(''), 5000);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const optimizedUrl = await optimizeImage(file);
        callback(optimizedUrl);
      } catch (err) {
        console.error("Optimization failed", err);
        setStatusMsg("Error: Image was too large or invalid.");
      } finally {
        setIsProcessing(false);
        e.target.value = '';
      }
    }
  };

  const updateField = (section: keyof AppState, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), [field]: value }
    }));
  };

  const updateNestedField = (section: keyof AppState, parent: string, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), [parent]: { ...(prev[section] as any)[parent], [field]: value } }
    }));
  };

  const updateHomeSubField = (parent: string, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      home: { ...prev.home, [parent]: { ...(prev.home as any)[parent], [field]: value } }
    }));
  };

  const updateContactField = (field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      site: { ...prev.site, contact: { ...prev.site.contact, [field]: value } }
    }));
  };

  // Site Specific Handlers
  const addNavigation = () => {
    setLocalContent(prev => ({ 
      ...prev, 
      site: { 
        ...prev.site, 
        navigation: [...prev.site.navigation, { label: 'New Link', path: '/' }] 
      } 
    }));
  };

  const updateNavigation = (index: number, field: 'label' | 'path', value: string) => {
    setLocalContent(prev => ({
      ...prev,
      site: {
        ...prev.site,
        navigation: prev.site.navigation.map((n, i) => i === index ? { ...n, [field]: value } : n)
      }
    }));
  };

  const removeNavigation = (index: number) => {
    setLocalContent(prev => ({
      ...prev,
      site: {
        ...prev.site,
        navigation: prev.site.navigation.filter((_, i) => i !== index)
      }
    }));
  };

  const addSocialLink = () => {
    const newLink: SocialLink = { id: Date.now().toString(), platform: 'New Platform', url: 'https://', icon: 'fa-share-nodes' };
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: [...prev.site.social, newLink] } }));
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.map(s => s.id === id ? { ...s, [field]: value } : s) } }));
  };

  const removeSocialLink = (id: string) => {
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, social: prev.site.social.filter(s => s.id !== id) } }));
  };

  const updateFooterField = (field: string, value: any) => {
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, [field]: value } } }));
  };

  const addSupportLink = () => {
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: [...prev.site.footer.supportLinks, { label: 'New Link', path: '#' }] } } }));
  };

  const updateSupportLink = (index: number, field: 'label' | 'path', value: string) => {
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.map((l, i) => i === index ? { ...l, [field]: value } : l) } } }));
  };

  const deleteSupportLink = (index: number) => {
    setLocalContent(prev => ({ ...prev, site: { ...prev.site, footer: { ...prev.site.footer, supportLinks: prev.site.footer.supportLinks.filter((_, i) => i !== index) } } }));
  };

  const updateGalleryItem = (id: string, field: keyof GalleryItem, value: string) => {
    setLocalContent(prev => ({ ...prev, gallery: prev.gallery.map(item => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const updateCourseItem = (id: string, field: keyof Course, value: any) => {
    setLocalContent(prev => ({ ...prev, courses: prev.courses.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  };

  const updateNoticeItem = (id: string, field: keyof Notice, value: any) => {
    setLocalContent(prev => ({ ...prev, notices: prev.notices.map(n => n.id === id ? { ...n, [field]: value } : n) }));
  };

  const addHighlight = () => {
    setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: [{ icon: 'fa-star', title: 'New Highlight', description: 'Brief description...' }, ...prev.home.highlights] } }));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.map((h, i) => i === index ? { ...h, [field]: value } : h) } }));
  };

  const deleteHighlight = (index: number) => {
    setLocalContent(prev => ({ ...prev, home: { ...prev.home, highlights: prev.home.highlights.filter((_, i) => i !== index) } }));
  };

  const addFormField = () => {
    const newField: FormField = { id: Date.now().toString(), label: 'New Field Label', type: 'text', placeholder: 'Enter placeholder...', required: false, options: [] };
    setLocalContent(prev => ({ 
      ...prev, 
      enrollmentForm: { 
        ...prev.enrollmentForm, 
        fields: [...prev.enrollmentForm.fields, newField] 
      } 
    }));
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.map(f => f.id === id ? { ...f, ...updates } : f) } }));
  };

  const deleteFormField = (id: string) => {
    setLocalContent(prev => ({ ...prev, enrollmentForm: { ...prev.enrollmentForm, fields: prev.enrollmentForm.fields.filter(f => f.id !== id) } }));
  };

  // Placements Logic
  const updateStatItem = (id: string, field: keyof PlacementStat, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      placements: { ...prev.placements, stats: prev.placements.stats.map(s => s.id === id ? { ...s, [field]: value } : s) }
    }));
  };

  const addStatItem = () => {
    const newStat: PlacementStat = { id: Date.now().toString(), label: 'New Stat', value: '0%', icon: 'fa-chart-simple' };
    setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: [...prev.placements.stats, newStat] } }));
  };

  const deleteStatItem = (id: string) => {
    setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, stats: prev.placements.stats.filter(s => s.id !== id) } }));
  };

  const updateReviewItem = (id: string, field: keyof StudentReview, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      placements: { ...prev.placements, reviews: prev.placements.reviews.map(r => r.id === id ? { ...r, [field]: value } : r) }
    }));
  };

  const addReviewItem = () => {
    const newReview: StudentReview = { id: Date.now().toString(), name: 'Student Name', course: 'Course Name', company: 'Google', companyIcon: 'fa-google', image: 'https://i.pravatar.cc/150', text: 'Great placement!', salaryIncrease: '+50% Hike', role: 'Software Engineer' };
    setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: [newReview, ...prev.placements.reviews] } }));
  };

  const deleteReviewItem = (id: string) => {
    setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, reviews: prev.placements.reviews.filter(r => r.id !== id) } }));
  };

  const updatePartnerItem = (id: string, field: keyof IndustryPartner, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      placements: { ...prev.placements, partners: prev.placements.partners.map(p => p.id === id ? { ...p, [field]: value } : p) }
    }));
  };

  const addPartnerItem = () => {
    const newPartner: IndustryPartner = { id: Date.now().toString(), name: 'New Company', icon: 'fa-building' };
    setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: [...prev.placements.partners, newPartner] } }));
  };

  const deletePartnerItem = (id: string) => {
    setLocalContent(prev => ({ ...prev, placements: { ...prev.placements, partners: prev.placements.partners.filter(p => p.id !== id) } }));
  };

  // Legal & Career Guidance Logic
  const updateLegal = (page: 'privacy' | 'terms', field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      legal: { ...prev.legal, [page]: { ...prev.legal[page], [field]: value } }
    }));
  };

  const updateLegalSection = (page: 'privacy' | 'terms', id: string, field: keyof LegalSection, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      legal: {
        ...prev.legal,
        [page]: {
          ...prev.legal[page],
          sections: prev.legal[page].sections.map(s => s.id === id ? { ...s, [field]: value } : s)
        }
      }
    }));
  };

  const addLegalSection = (page: 'privacy' | 'terms') => {
    const newSection: LegalSection = { id: Date.now().toString(), title: 'New Section', content: '' };
    setLocalContent(prev => ({
      ...prev,
      legal: {
        ...prev.legal,
        [page]: {
          ...prev.legal[page],
          sections: [...prev.legal[page].sections, newSection]
        }
      }
    }));
  };

  const deleteLegalSection = (page: 'privacy' | 'terms', id: string) => {
    setLocalContent(prev => ({
      ...prev,
      legal: {
        ...prev.legal,
        [page]: {
          ...prev.legal[page],
          sections: prev.legal[page].sections.filter(s => s.id !== id)
        }
      }
    }));
  };

  const updateCareerHero = (field: string, value: string) => {
    setLocalContent(prev => ({ ...prev, career: { ...prev.career, hero: { ...prev.career.hero, [field]: value } } }));
  };

  const updateCareerCta = (field: string, value: string) => {
    setLocalContent(prev => ({ ...prev, career: { ...prev.career, cta: { ...prev.career.cta, [field]: value } } }));
  };

  const updateCareerService = (id: string, field: keyof CareerService, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      career: { ...prev.career, services: prev.career.services.map(s => s.id === id ? { ...s, [field]: value } : s) }
    }));
  };

  const addCareerService = () => {
    const newService: CareerService = { id: Date.now().toString(), title: 'New Service', description: '', icon: 'fa-star' };
    setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: [...prev.career.services, newService] } }));
  };

  const deleteCareerService = (id: string) => {
    setLocalContent(prev => ({ ...prev, career: { ...prev.career, services: prev.career.services.filter(s => s.id !== id) } }));
  };

  const addItem = (section: 'courses' | 'notices', item: any) => {
    setLocalContent(prev => ({ ...prev, [section]: [{ ...item, id: Date.now().toString() }, ...(prev[section] as any[])] }));
  };

  const deleteItem = (section: 'courses' | 'notices' | 'gallery', id: string) => {
    setLocalContent(prev => ({ ...prev, [section]: (prev[section] as any[]).filter((item: any) => item.id !== id) }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Hidden File Inputs mapping to optimization utility */}
      <input type="file" ref={logoInputRef} className="hidden" accept="image/png,image/jpeg" onChange={(e) => handleUpload(e, (url) => updateField('site', 'logo', url))} />
      <input type="file" ref={heroBgInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => updateNestedField('home', 'hero', 'bgImage', url))} />
      <input type="file" ref={showcaseImgInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => updateNestedField('home', 'bigShowcase', 'image', url))} />
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
        const newItem: GalleryItem = { id: Date.now().toString(), url, category: activeUploadCategory.current, title: '' };
        setLocalContent(prev => ({ ...prev, gallery: [newItem, ...prev.gallery] }));
      })} />
      <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
        if (!activeThumbnailCategory.current) return;
        setLocalContent(prev => ({ ...prev, galleryMetadata: { ...(prev.galleryMetadata || {}), [activeThumbnailCategory.current!]: url } }));
      })} />
      <input type="file" ref={courseInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
        if (!activeCourseId.current) return;
        updateCourseItem(activeCourseId.current, 'image', url);
      })} />
      <input type="file" ref={reviewInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
        if (!activeReviewId.current) return;
        updateReviewItem(activeReviewId.current, 'image', url);
      })} />
      <input type="file" ref={partnerInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
        if (!activePartnerId.current) return;
        updatePartnerItem(activePartnerId.current, 'image', url);
      })} />
      <input type="file" ref={careerHeroBgInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => updateCareerHero('bgImage', url))} />
      <input type="file" ref={careerServiceInputRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, (url) => {
        if (!activeCareerServiceId.current) return;
        updateCareerService(activeCareerServiceId.current, 'image', url);
      })} />

      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-0 z-40 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <i className="fa-solid fa-gauge-high text-emerald-500"></i>
              INSTITUTE ADMIN
            </h1>
            {isProcessing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">Processing...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDiscard} 
              className="px-5 py-2 text-slate-400 hover:text-white text-xs font-black transition-all border border-slate-700 rounded-lg"
              disabled={isProcessing}
            >
              DISCARD
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-black transition-all active:scale-95 shadow-lg disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? 'SAVING...' : 'SAVE ALL CHANGES'}
            </button>
            <div className="w-px h-8 bg-slate-700 mx-2"></div>
            <button 
              onClick={handleFactoryReset} 
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Reset to Factory Defaults"
            >
              <i className="fa-solid fa-trash-arrow-up"></i>
            </button>
          </div>
        </div>
        {statusMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg text-center text-xs font-black animate-pulse">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {(['site', 'home', 'courses', 'notices', 'gallery', 'placements', 'career', 'legal', 'form', 'contact', 'footer'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all capitalize flex items-center gap-3 border ${
                activeTab === tab ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl translate-x-1' : 'text-slate-500 border-transparent hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid fa-${tab === 'site' ? 'globe' : tab === 'home' ? 'house' : tab === 'courses' ? 'graduation-cap' : tab === 'notices' ? 'bullhorn' : tab === 'gallery' ? 'images' : tab === 'contact' ? 'address-book' : tab === 'footer' ? 'shoe-prints' : tab === 'placements' ? 'briefcase' : tab === 'career' ? 'user-graduate' : tab === 'legal' ? 'scale-balanced' : 'wpforms'} text-lg`}></i>
              {tab === 'form' ? 'Apply Form' : tab === 'contact' ? 'Contact Info' : tab}
            </button>
          ))}
        </div>

        <div className="flex-grow bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-3xl min-h-[70vh]">
          {activeTab === 'site' && (
            <SiteTab 
              data={localContent.site} 
              updateField={(f, v) => updateField('site', f, v)} 
              onLogoUploadClick={() => logoInputRef.current?.click()} 
              updateNavigation={updateNavigation}
              addNavigation={addNavigation}
              removeNavigation={removeNavigation}
            />
          )}
          {activeTab === 'home' && <HomeTab data={localContent.home} updateNestedField={(p, f, v) => updateNestedField('home', p, f, v)} updateHomeSubField={updateHomeSubField} onHeroBgClick={() => heroBgInputRef.current?.click()} onShowcaseImgClick={() => showcaseImgInputRef.current?.click()} addHighlight={addHighlight} updateHighlight={updateHighlight} deleteHighlight={deleteHighlight} />}
          {activeTab === 'courses' && <CoursesTab courses={localContent.courses} updateCourseItem={updateCourseItem} onCourseImageClick={(id) => { activeCourseId.current = id; courseInputRef.current?.click(); }} addItem={() => addItem('courses', { name: 'New Program', duration: '0 Months', mode: 'Hybrid', description: 'Description...', status: 'Active', image: 'https://picsum.photos/800/600', price: '$0' })} deleteItem={(id) => deleteItem('courses', id)} />}
          {activeTab === 'notices' && <NoticesTab notices={localContent.notices} updateNoticeItem={updateNoticeItem} addItem={() => addItem('notices', { date: new Date().toISOString().split('T')[0], title: 'New Notice', description: 'Notice text...', isImportant: false, category: 'General' })} deleteItem={(id) => deleteItem('notices', id)} />}
          {activeTab === 'gallery' && <GalleryTab gallery={localContent.gallery} galleryMetadata={localContent.galleryMetadata} updateGalleryItem={updateGalleryItem} deleteItem={(id) => deleteItem('gallery', id)} triggerUpload={(cat) => { activeUploadCategory.current = cat; galleryInputRef.current?.click(); }} triggerThumbnailUpload={(cat) => { activeThumbnailCategory.current = cat; thumbnailInputRef.current?.click(); }} />}
          {activeTab === 'placements' && <PlacementsTab stats={localContent.placements.stats} reviews={localContent.placements.reviews} partners={localContent.placements.partners} updateStat={updateStatItem} addStat={addStatItem} deleteStat={deleteStatItem} updateReview={updateReviewItem} addReview={addReviewItem} deleteReview={deleteReviewItem} updatePartner={updatePartnerItem} addPartner={addPartnerItem} deletePartner={deletePartnerItem} onReviewImageClick={(id) => { activeReviewId.current = id; reviewInputRef.current?.click(); }} onPartnerImageClick={(id) => { activePartnerId.current = id; partnerInputRef.current?.click(); }} label={localContent.home.sectionLabels.placementMainLabel} />}
          {activeTab === 'legal' && <LegalTab legal={localContent.legal} updateLegal={updateLegal} updateSection={updateLegalSection} addSection={addLegalSection} deleteSection={deleteLegalSection} />}
          {activeTab === 'career' && <CareerTab career={localContent.career} updateHero={updateCareerHero} updateCta={updateCareerCta} updateService={updateCareerService} addService={addCareerService} deleteService={deleteCareerService} onHeroBgClick={() => careerHeroBgInputRef.current?.click()} onServiceImageClick={(id) => { activeCareerServiceId.current = id; careerServiceInputRef.current?.click(); }} />}
          {activeTab === 'form' && <FormTab fields={localContent.enrollmentForm.fields} addField={addFormField} updateField={updateFormField} deleteField={deleteFormField} />}
          {activeTab === 'contact' && <ContactTab contact={localContent.site.contact} social={localContent.site.social} updateContactField={updateContactField} addSocialLink={addSocialLink} updateSocialLink={updateSocialLink} removeSocialLink={removeSocialLink} />}
          {activeTab === 'footer' && <FooterTab footer={localContent.site.footer} updateFooterField={updateFooterField} addSupportLink={addSupportLink} updateSupportLink={updateSupportLink} deleteSupportLink={deleteSupportLink} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
