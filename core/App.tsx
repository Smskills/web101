
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

const ProtectedRoute: React.FC<{ isAuthenticated: boolean; children: React.ReactNode }> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Correct check for Point 2: Hardened JWT Security
    return localStorage.getItem('sms_is_auth') === 'true' && !!localStorage.getItem('sms_auth_token');
  });

  const [content, setContent] = useState<AppState>(INITIAL_CONTENT);

  useEffect(() => {
    const bootstrapConfig = async () => {
      try {
        // 1. Attempt to fetch master configuration from the real backend
        const response = await fetch('http://localhost:5000/api/config');
        const result = await response.json();
        
        if (result.success && result.data) {
          setContent(prev => ({
            ...INITIAL_CONTENT,
            ...result.data,
            site: { ...INITIAL_CONTENT.site, ...result.data.site },
            home: { ...INITIAL_CONTENT.home, ...result.data.home },
            theme: { ...INITIAL_CONTENT.theme, ...result.data.theme }
          }));
        } else {
          // 2. Fallback to local storage if DB is empty
          const saved = localStorage.getItem('edu_insta_content');
          if (saved) setContent(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Bootstrap: Backend DB unreachable. Using local cache.");
        const saved = localStorage.getItem('edu_insta_content');
        if (saved) setContent(JSON.parse(saved));
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrapConfig();

    const handleAuthChange = () => {
      // Re-verify the session storage when the login status changes
      setIsAuthenticated(localStorage.getItem('sms_is_auth') === 'true' && !!localStorage.getItem('sms_auth_token'));
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
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

  const updateContent = async (newContent: AppState) => {
    setContent(newContent);
    localStorage.setItem('edu_insta_content', JSON.stringify(newContent));
    
    // Sync back to central database if admin is authenticated
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('sms_auth_token');
        await fetch('http://localhost:5000/api/config', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newContent)
        });
      } catch (e) {
        console.error("Central Sync Error: Backend unreachable.");
      }
    }
  };

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><i className="fa-solid fa-circle-notch fa-spin text-4xl text-emerald-600"></i></div>;
  }

  return (
    <HashRouter>
      <style>{brandingStyles}</style>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Header config={content.site} isAuthenticated={isAuthenticated} />
        <main id="main-content" className="flex-grow pt-32 focus:outline-none" tabIndex={-1}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-4xl text-emerald-600"></i></div>}>
            <Routes>
              <Route path="/" element={<HomePage content={content} />} />
              <Route path="/about" element={<AboutPage content={content.about} siteName={content.site.name} />} />
              <Route path="/courses" element={<CoursesPage coursesState={content.courses} isLoading={isInitializing} />} />
              <Route path="/notices" element={<NoticesPage noticesState={content.notices} />} />
              <Route path="/gallery" element={<GalleryPage content={content} />} />
              <Route path="/faq" element={<FAQPage faqsState={content.faqs} contact={content.site.contact} />} />
              <Route path="/contact" element={<ContactPage config={content.site.contact} social={content.site.social} content={content} />} />
              <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminDashboard content={content} onUpdate={updateContent} /></ProtectedRoute>} />
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
