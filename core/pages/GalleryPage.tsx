
import React, { useState, useEffect, useRef } from 'react';
import { AppState, GalleryItem } from '../types.ts';
import PageStateGuard from '../components/PageStateGuard.tsx';

interface GalleryPageProps {
  content: AppState;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ content }) => {
  const { gallery, galleryMetadata } = content;
  const [view, setView] = useState<'albums' | 'photos'>('albums');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fullscreenItem, setFullscreenItem] = useState<GalleryItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const categories: string[] = Array.from(new Set(gallery.list.map(item => item.category)));
  
  const handleAlbumClick = (category: string) => {
    setSelectedCategory(category);
    setView('photos');
  };

  const filteredPhotos = selectedCategory 
    ? gallery.list.filter(item => item.category === selectedCategory)
    : [];

  useEffect(() => {
    if (!fullscreenItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenItem]);

  const emptyAlbumsFallback = (
    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
      <i className="fa-solid fa-images text-5xl text-slate-200 mb-6 block" aria-hidden="true"></i>
      <p className="text-slate-400 font-bold uppercase tracking-widest">No albums created yet.</p>
    </div>
  );

  const emptyPhotosFallback = (
    <div className="col-span-full text-center py-32">
      <p className="text-slate-400 font-bold">This album is currently empty.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        
        {fullscreenItem && (
          <div 
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setFullscreenItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Fullscreen view: ${fullscreenItem.title || 'Institutional Image'}`}
          >
            <div className="relative max-w-full max-h-full flex flex-col items-center">
              <img 
                src={fullscreenItem.url} 
                className="max-w-full max-h-[85vh] object-contain block mx-auto shadow-2xl" 
                alt={fullscreenItem.title || ""}
              />
              {fullscreenItem.title && (
                <div className="mt-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center max-w-2xl">
                  <p className="text-white font-medium text-lg leading-relaxed">
                    {fullscreenItem.title}
                  </p>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenItem(null); }}
                className="absolute -top-12 right-0 text-white text-4xl hover:text-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
            {view === 'albums' ? gallery.pageMeta.tagline : selectedCategory}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            {view === 'albums' ? gallery.pageMeta.title : 'Album Collection'}
          </h1>
          {view === 'albums' && (
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              {gallery.pageMeta.subtitle}
            </p>
          )}
          
          {view === 'photos' && (
            <button 
              onClick={() => setView('albums')}
              className="mt-4 inline-flex items-center gap-3 px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 focus-visible:ring-4 focus-visible:ring-emerald-500/30"
            >
              <i className="fa-solid fa-arrow-left-long" aria-hidden="true"></i> Back to Albums
            </button>
          )}
        </div>

        {view === 'albums' && (
          <PageStateGuard isEmpty={categories.length === 0} emptyFallback={emptyAlbumsFallback}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" role="list">
              {categories.map((cat: string) => {
                const thumbnail = galleryMetadata?.[cat];
                const count = gallery.list.filter(i => i.category === cat).length;
                
                return (
                  <button 
                    key={cat}
                    onClick={() => handleAlbumClick(cat)}
                    role="listitem"
                    className="group relative h-[400px] w-full text-left rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                  >
                    <img 
                      src={thumbnail || 'https://images.unsplash.com/photo-1523050853063-bd8012fec046'} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 shadow-lg">
                          {count} Photos
                        </span>
                        <h3 className="text-3xl font-black text-white mb-2 leading-tight">
                          {cat}
                        </h3>
                        <p className="text-slate-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                          Explore this collection <i className="fa-solid fa-arrow-right-long ml-2" aria-hidden="true"></i>
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </PageStateGuard>
        )}

        {view === 'photos' && (
          <PageStateGuard isEmpty={filteredPhotos.length === 0} emptyFallback={emptyPhotosFallback}>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 animate-fade-in" role="list">
              {filteredPhotos.map(item => (
                <button 
                  key={item.id} 
                  onClick={(e) => { triggerRef.current = e.currentTarget; setFullscreenItem(item); }}
                  role="listitem"
                  className="relative block w-full text-left group overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm cursor-zoom-in hover:shadow-2xl transition-all duration-500 break-inside-avoid focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                >
                  <img 
                    src={item.url} 
                    alt="" 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 ${!item.title ? 'pointer-events-none' : ''}`}>
                    {item.title && (
                      <>
                        <h3 className="text-white font-black text-xl leading-tight mb-2">
                          {item.title}
                        </h3>
                        <div className="w-12 h-1 bg-emerald-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </PageStateGuard>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
