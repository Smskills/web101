
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { INITIAL_CONTENT } from './data/defaultContent.ts';
import { AppState } from './types.ts';

// Components
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

// Pages
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';
import NoticesPage from './pages/NoticesPage.tsx';
import GalleryPage from './pages/GalleryPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import EnrollmentPage from './pages/EnrollmentPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsOfServicePage from './pages/TermsOfServicePage.tsx';
import CareerGuidancePage from './pages/CareerGuidancePage.tsx';
import PlacementReviewPage from './pages/PlacementReviewPage.tsx';
import FAQPage from './pages/FAQPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import CustomPageView from './pages/CustomPageView.tsx';
import LoginPage from './pages/LoginPage.tsx';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sms_is_auth') === 'true' && !!localStorage.getItem('sms_auth_token');
  });

  const [content, setContent] = useState<AppState>(() => {
    const saved = localStorage.getItem('edu_insta_content');
    if (!saved) return INITIAL_CONTENT;
    
    try {
      const parsed = JSON.parse(saved);
      
      if (!parsed || typeof parsed !== 'object' || !parsed.site || !parsed.home) {
        throw new Error("Invalid state structure detected.");
      }

      const deepMerge = (target: any, source: any) => {
        if (!source || typeof source !== 'object') return target;
        const result = { ...target };
        for (const key in source) {
          if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
             result[key] = deepMerge(target[key] || {}, source[key]);
          } else {
             result[key] = source[key];
          }
        }
        return result;
      };

      const migrateList = (key: string, defaultMeta: any): any => {
        const val = parsed[key];
        if (Array.isArray(val)) {
          return { list: val, pageMeta: defaultMeta };
        }
        if (val && typeof val === 'object' && val.list) {
          return {
            list: val.list,
            pageMeta: deepMerge(defaultMeta, val.pageMeta)
          };
        }
        return (INITIAL_CONTENT as any)[key] || { list: [], pageMeta: defaultMeta };
      };

      const baseSite = deepMerge(INITIAL_CONTENT.site, parsed.site);
      const hasFaq = baseSite.navigation.some((n: any) => n.path === '/faq');
      if (!hasFaq) {
        baseSite.navigation.push({ label: "FAQ", path: "/faq" });
      }

      const mergedState: AppState = {
        ...INITIAL_CONTENT,
        site: baseSite,
        theme: deepMerge(INITIAL_CONTENT.theme, parsed.theme),
        home: deepMerge(INITIAL_CONTENT.home, parsed.home),
        about: deepMerge(INITIAL_CONTENT.about, parsed.about),
        enrollmentForm: deepMerge(INITIAL_CONTENT.enrollmentForm, parsed.enrollmentForm),
        contactForm: deepMerge(INITIAL_CONTENT.contactForm, parsed.contactForm),
        placements: deepMerge(INITIAL_CONTENT.placements, parsed.placements),
        legal: deepMerge(INITIAL_CONTENT.legal, parsed.legal),
        career: deepMerge(INITIAL_CONTENT.career, parsed.career),
        courses: migrateList('courses', INITIAL_CONTENT.courses.pageMeta),
        notices: migrateList('notices', INITIAL_CONTENT.notices.pageMeta),
        gallery: migrateList('gallery', INITIAL_CONTENT.gallery.pageMeta),
        faqs: migrateList('faqs', INITIAL_CONTENT.faqs.pageMeta),
        customPages: parsed.customPages || INITIAL_CONTENT.customPages,
        galleryMetadata: parsed.galleryMetadata || INITIAL_CONTENT.galleryMetadata
      };

      return mergedState;
    } catch (e) {
      console.error("Educational CMS: Error restoring state. Reverting to defaults.", e);
      localStorage.removeItem('edu_insta_content');
      return INITIAL_CONTENT;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem('sms_is_auth') === 'true' && !!localStorage.getItem('sms_auth_token'));
    };

    window.addEventListener('authChange', handleAuthChange);
    const timer = setTimeout(() => setIsInitializing(false), 800);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      clearTimeout(timer);
    };
  }, []);

  const brandingStyles = useMemo(() => {
    const { primary, secondary, accent, radius } = content.theme;
    const borderRadius = radius === 'none' ? '0' : radius === 'small' ? '0.5rem' : radius === 'medium' ? '1rem' : radius === 'large' ? '2.5rem' : '9999px';
    
    return `
      :root {
        --brand-primary: ${primary};
        --brand-secondary: ${secondary};
        --brand-accent: ${accent};
        --brand-radius: ${borderRadius};
      }
      .bg-emerald-600 { background-color: var(--brand-primary) !important; }
      .text-emerald-600 { color: var(--brand-primary) !important; }
      .border-emerald-600 { border-color: var(--brand-primary) !important; }
      .bg-slate-900 { background-color: var(--brand-secondary) !important; }
      .bg-emerald-500 { background-color: var(--brand-accent) !important; }
      .text-emerald-500 { color: var(--brand-accent) !important; }
      .rounded-\\[2\\.5rem\\], .rounded-\\[3\\.5rem\\], .rounded-\\[3rem\\], .rounded-3xl, .rounded-2xl {
         border-radius: var(--brand-radius) !important;
      }
    `;
  }, [content.theme]);

  const updateContent = (newContent: AppState) => {
    setContent(newContent);
    try {
      localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
    } catch (err) {
      console.error("Educational CMS: Failed to save", err);
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <HashRouter>
      <style>{brandingStyles}</style>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header config={content.site} isAuthenticated={isAuthenticated} />
        <main id="main-content" className="flex-grow pt-32 focus:outline-none" tabIndex={-1}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600"></i></div>}>
            <Routes>
              <Route path="/" element={<HomePage content={content} />} />
              <Route path="/about" element={<AboutPage content={content.about} siteName={content.site.name} />} />
              <Route path="/courses" element={<CoursesPage coursesState={content.courses} isLoading={isInitializing} />} />
              <Route path="/notices" element={<NoticesPage noticesState={content.notices} />} />
              <Route path="/gallery" element={<GalleryPage content={content} />} />
              <Route path="/faq" element={<FAQPage faqsState={content.faqs} contact={content.site.contact} />} />
              <Route path="/contact" element={<ContactPage config={content.site.contact} social={content.site.social} content={content} />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard content={content} onUpdate={updateContent} />
                </ProtectedRoute>
              } />

              <Route path="/enroll" element={<EnrollmentPage content={content} />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage siteName={content.site.name} data={content.legal.privacy} />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage data={content.legal.terms} />} />
              <Route path="/career-guidance" element={<CareerGuidancePage data={content.career} />} />
              <Route path="/placement-review" element={<PlacementReviewPage placements={content.placements} label={content.home.sectionLabels.placementMainLabel} />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage siteConfig={content.site} />} />
              
              {content.customPages.filter(p => p.visible).map(page => (
                <Route key={page.id} path={page.slug.startsWith('/') ? page.slug : `/${page.slug}`} element={<CustomPageView page={page} siteConfig={content.site} />} />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer config={content.site} />
      </div>
    </HashRouter>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

export default App;
