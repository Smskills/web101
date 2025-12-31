
import React, { useState, useRef } from 'react';
import { AppState, Course, Notice, GalleryItem } from '../types.ts';

interface AdminDashboardProps {
  content: AppState;
  onUpdate: (newContent: AppState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ content, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'site' | 'home' | 'courses' | 'notices' | 'gallery'>('site');
  const [localContent, setLocalContent] = useState(content);
  const [statusMsg, setStatusMsg] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const activeUploadCategory = useRef<string>('General');
  const activeThumbnailCategory = useRef<string | null>(null);

  const handleSave = () => {
    onUpdate(localContent);
    setStatusMsg('Changes saved successfully! All updates are now live.');
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('site', 'logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerGalleryUpload = (category: string) => {
    activeUploadCategory.current = category;
    galleryInputRef.current?.click();
  };

  const triggerThumbnailUpload = (category: string) => {
    activeThumbnailCategory.current = category;
    thumbnailInputRef.current?.click();
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const category = activeThumbnailCategory.current;
    if (file && category) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalContent(prev => ({
          ...prev,
          galleryMetadata: {
            ...(prev.galleryMetadata || {}),
            [category]: reader.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: GalleryItem = {
          id: Date.now().toString(),
          url: reader.result as string,
          category: activeUploadCategory.current,
          title: `New ${activeUploadCategory.current} Photo`
        };
        setLocalContent(prev => ({
          ...prev,
          gallery: [newItem, ...prev.gallery]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (section: keyof AppState, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const updateNestedField = (section: keyof AppState, parent: string, field: string, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [parent]: {
          ...(prev[section] as any)[parent],
          [field]: value
        }
      }
    }));
  };

  const updateGalleryItem = (id: string, field: keyof GalleryItem, value: string) => {
    setLocalContent(prev => ({
      ...prev,
      gallery: prev.gallery.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const updateCourseItem = (id: string, field: keyof Course, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const updateNoticeItem = (id: string, field: keyof Notice, value: any) => {
    setLocalContent(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const addItem = (section: 'courses' | 'notices', item: any) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), { ...item, id: Date.now().toString() }]
    }));
  };

  const deleteItem = (section: 'courses' | 'notices' | 'gallery', id: string) => {
    setLocalContent(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((item: any) => item.id !== id)
    }));
  };

  // Group gallery items by category for the dashboard
  const galleryCategories = Array.from(new Set([
    'Classroom', 'Achievement', 'Project', 'Event', 
    ...localContent.gallery.map(item => item.category)
  ]));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Hidden Inputs */}
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
      <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={handleThumbnailUpload} />

      <div className="bg-slate-800 border-b border-slate-700 p-6 sticky top-16 z-40 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <i className="fa-solid fa-gauge-high text-emerald-500"></i>
              INSTITUTE ADMIN
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">Creative Control Suite</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localContent, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "site_config.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold transition-all border border-slate-600"
            >
              <i className="fa-solid fa-download mr-2"></i> EXPORT
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-black shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <i className="fa-solid fa-check mr-2"></i> SAVE CHANGES
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
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {(['site', 'home', 'courses', 'notices', 'gallery'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all capitalize flex items-center gap-3 border ${
                activeTab === tab 
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl translate-x-1' 
                  : 'text-slate-500 border-transparent hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fa-solid fa-${tab === 'site' ? 'globe' : tab === 'home' ? 'house' : tab === 'courses' ? 'graduation-cap' : tab === 'notices' ? 'bullhorn' : 'images'} text-lg`}></i>
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Editor View */}
        <div className="flex-grow bg-slate-800 rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-3xl overflow-hidden min-h-[70vh]">
          
          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <SectionHeader title="Media Library & Albums" />
                <div className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    placeholder="New Category Name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none w-full"
                  />
                  <button 
                    onClick={() => {
                      if(newCategoryName.trim()) {
                        triggerGalleryUpload(newCategoryName.trim());
                        setNewCategoryName('');
                      }
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border border-slate-600"
                  >
                    <i className="fa-solid fa-folder-plus mr-2"></i> Create Section
                  </button>
                </div>
              </div>

              <div className="space-y-16">
                {galleryCategories.map(category => {
                  const items = localContent.gallery.filter(item => item.category === category);
                  const thumbnail = localContent.galleryMetadata?.[category];

                  return (
                    <div key={category} className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-700/50 pb-6 gap-6">
                        <div className="flex items-center gap-5">
                          {/* Album Thumbnail */}
                          <div 
                            onClick={() => triggerThumbnailUpload(category)}
                            className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer group relative shrink-0"
                          >
                            {thumbnail ? (
                              <img src={thumbnail} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700 group-hover:text-emerald-500 transition-colors">
                                <i className="fa-solid fa-image text-xl"></i>
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-[8px] font-black text-white uppercase text-center p-1">
                              Set Album Cover
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-black text-white">{category}</h3>
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xs">
                                <i className={`fa-solid ${
                                  category === 'Classroom' ? 'fa-chalkboard-user' : 
                                  category === 'Achievement' ? 'fa-trophy' : 
                                  category === 'Project' ? 'fa-diagram-project' : 
                                  category === 'Event' ? 'fa-calendar-check' : 'fa-folder-open'
                                }`}></i>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{items.length} Photos Stored</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => triggerThumbnailUpload(category)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-600"
                          >
                            <i className="fa-solid fa-camera mr-2"></i> Cover
                          </button>
                          <button 
                            onClick={() => triggerGalleryUpload(category)}
                            className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all"
                          >
                            <i className="fa-solid fa-plus mr-2"></i> Add Photo
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {items.map(item => (
                          <div key={item.id} className="bg-slate-900/40 p-4 rounded-[1.5rem] border border-slate-700/50 flex flex-col gap-4 group hover:border-emerald-500/30 transition-all shadow-sm">
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800">
                              <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                              <button 
                                onClick={() => deleteItem('gallery', item.id)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 shadow-xl"
                              >
                                <i className="fa-solid fa-trash-can text-xs"></i>
                              </button>
                            </div>
                            <div className="space-y-3 px-1">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Caption</label>
                                <input 
                                  value={item.title} 
                                  onChange={e => updateGalleryItem(item.id, 'title', e.target.value)} 
                                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-emerald-500 outline-none" 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {items.length === 0 && (
                          <div className="col-span-full py-12 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-700">
                            <i className="fa-solid fa-images text-3xl text-slate-700 mb-3 block"></i>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No photos in {category} yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SITE TAB */}
          {activeTab === 'site' && (
            <div className="space-y-12 animate-fade-in">
              <SectionHeader title="Global Brand" />
              <div className="bg-slate-900/50 p-10 rounded-[2rem] border border-slate-700 text-center">
                 <div className="relative inline-block group mb-6">
                   <div className="w-40 h-40 rounded-full border-8 border-slate-800 overflow-hidden bg-slate-800 flex items-center justify-center transition-all group-hover:border-emerald-500/50 shadow-2xl">
                      {localContent.site.logo ? <img src={localContent.site.logo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-building-columns text-5xl text-slate-700"></i>}
                   </div>
                   <button onClick={() => logoInputRef.current?.click()} className="absolute bottom-1 right-1 w-12 h-12 bg-emerald-600 rounded-full border-4 border-slate-800 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors shadow-xl">
                     <i className="fa-solid fa-camera text-lg"></i>
                   </button>
                   <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">{localContent.site.name || 'Your Institute'}</h4>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Primary Identity Asset</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Institute Official Name</label>
                  <input value={localContent.site.name} onChange={e => updateField('site', 'name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Brand Tagline</label>
                  <input value={localContent.site.tagline} onChange={e => updateField('site', 'tagline', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-12 animate-fade-in">
              <SectionHeader title="Home Page Configuration" />
              <div className="grid grid-cols-1 gap-8">
                <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-700 space-y-8">
                  <h3 className="text-emerald-500 font-black text-lg flex items-center gap-3"><i className="fa-solid fa-wand-magic-sparkles"></i> HERO EXPERIENCE</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl border border-slate-700">
                      <div>
                        <span className="text-sm font-black text-white block">Hero Visibility</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Show/Hide the main introduction section</span>
                      </div>
                      <button 
                        onClick={() => updateNestedField('home', 'hero', 'visible', !localContent.home.hero.visible)}
                        className={`w-14 h-7 rounded-full transition-all flex items-center px-1.5 ${localContent.home.hero.visible ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'}`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Main Title Headline</label>
                      <input value={localContent.home.hero.title} onChange={e => updateNestedField('home', 'hero', 'title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 font-black" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Sub-text Description</label>
                      <textarea value={localContent.home.hero.subtitle} onChange={e => updateNestedField('home', 'hero', 'subtitle', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-slate-200 h-32 resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex justify-between items-center">
                <SectionHeader title="Course Catalog" />
                <button 
                  onClick={() => addItem('courses', { 
                    name: 'New Professional Program', 
                    duration: '6 Months', 
                    mode: 'Hybrid', 
                    description: 'Brief overview of the curriculum...', 
                    status: 'Active', 
                    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', 
                    price: '$0.00' 
                  })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> ADD PROGRAM
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {localContent.courses.map(course => (
                  <div key={course.id} className="bg-slate-900/50 p-8 rounded-[2rem] border border-slate-700 flex flex-col xl:flex-row gap-8 hover:border-emerald-500/20 transition-all group">
                    <div className="w-full xl:w-64 h-48 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-800">
                       <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="flex-grow space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Program Title</label>
                          <input value={course.name} onChange={e => updateCourseItem(course.id, 'name', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-white font-black" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Investment/Price</label>
                          <input value={course.price} onChange={e => updateCourseItem(course.id, 'price', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-emerald-400 font-black" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="col-span-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Duration</label>
                          <input value={course.duration} onChange={e => updateCourseItem(course.id, 'duration', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold" />
                        </div>
                        <div className="col-span-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Learning Mode</label>
                          <select value={course.mode} onChange={e => updateCourseItem(course.id, 'mode', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold">
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div className="col-span-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Status</label>
                          <select value={course.status} onChange={e => updateCourseItem(course.id, 'status', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="col-span-1 flex items-end">
                          <button onClick={() => deleteItem('courses', course.id)} className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all">
                             <i className="fa-solid fa-trash-can mr-2"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTICES TAB */}
          {activeTab === 'notices' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex justify-between items-center">
                <SectionHeader title="Public Notice Board" />
                <button 
                  onClick={() => addItem('notices', { date: new Date().toISOString().split('T')[0], title: 'Important Update', description: 'Enter description...', isImportant: false, category: 'General' })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> NEW NOTICE
                </button>
              </div>
              <div className="space-y-8">
                {localContent.notices.map(notice => (
                  <div key={notice.id} className={`bg-slate-900/50 p-8 rounded-[2rem] border transition-all ${notice.category === 'Urgent' ? 'border-red-500/50 shadow-2xl shadow-red-900/10' : 'border-slate-700'}`}>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="flex-grow">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Announcement Headline</label>
                        <input value={notice.title} onChange={e => updateNoticeItem(notice.id, 'title', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 text-white font-black" />
                      </div>
                      <div className="w-full md:w-56">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Notice Type/Priority</label>
                        <select value={notice.category || 'General'} onChange={e => updateNoticeItem(notice.id, 'category', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 text-xs font-black text-slate-300">
                          <option value="General">General Notice</option>
                          <option value="Urgent">Urgent Alert</option>
                          <option value="New">New Announcement</option>
                          <option value="Holiday">Holiday Break</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Message Body (Custom Writing)</label>
                      <textarea value={notice.description} onChange={e => updateNoticeItem(notice.id, 'description', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 text-sm text-slate-300 h-40 resize-none font-medium leading-relaxed" />
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">PUBLISHED: {notice.date}</div>
                      <button onClick={() => deleteItem('notices', notice.id)} className="text-red-500/60 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"><i className="fa-solid fa-trash-can mr-2"></i> Remove Notice</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-6 mb-8">
    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
    <div className="flex-grow h-px bg-slate-700 opacity-50"></div>
  </div>
);

export default AdminDashboard;
