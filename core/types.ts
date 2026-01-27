
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  radius: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  visible: boolean;
  showHeader: boolean;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  message?: string;
  source: 'contact' | 'enrollment';
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed';
  createdAt: string;
  details?: Record<string, any>; // For extra form fields
}

export interface AdmissionAlert {
  enabled: boolean;
  text: string;
  subtext: string;
  linkText: string;
  linkPath: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  logo: string;
  loginLabel?: string;
  notificationEmails?: string[];
  admissionAlert?: AdmissionAlert;
  contact: {
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
  social: SocialLink[];
  navigation: Array<{ label: string; path: string; }>;
  footer: {
    brandDescription: string;
    quickLinksLabel: string;
    supportLinksLabel: string;
    supportLinks: Array<{ label: string; path: string; }>;
    reachUsLabel: string;
    bottomText: string;
  };
}

export interface HomeConfig {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    bgImage: string;
    visible: boolean;
  };
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  sectionLabels: {
    noticesTitle: string;
    noticesSubtitle: string;
    coursesTitle: string;
    coursesSubtitle: string;
    galleryTitle: string;
    gallerySubtitle: string;
    placementsTitle: string;
    placementsSubtitle: string;
    placementMainLabel: string;
  };
  ctaBlock: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    visible: boolean;
  };
  bigShowcase: {
    visible: boolean;
    image: string;
    title: string;
    subtitle: string;
  };
  sections: {
    notices: boolean;
    featuredCourses: boolean;
    gallery: boolean;
    contact: boolean;
    industryTieups: boolean;
    placementReviews: boolean;
    highlights: boolean;
    bigShowcase: boolean;
  };
  sectionOrder: string[]; 
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface AchievementStat {
  id: string;
  label: string;
  value: string;
}

export interface ExtraChapter {
  id: string;
  label: string;
  title: string;
  story: string;
  image: string;
}

export interface AboutState {
  beginning: {
    label: string;
    title: string;
    story: string;
    image: string;
  };
  learning: {
    label: string;
    title: string;
    description: string;
    image1: string;
    image2: string;
    caption1: string;
    caption2: string;
  };
  faculty: {
    label: string;
    title: string;
    description: string;
    members: TeamMember[];
  };
  vision: {
    label: string;
    title: string;
    content: string;
    values: string[];
    image: string;
  };
  achievements: {
    label: string;
    title: string;
    image: string;
    stats: AchievementStat[];
    ctaLabel: string;
  };
  extraChapters: ExtraChapter[];
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  description: string;
  status: 'Active' | 'Inactive';
  image: string;
  price?: string;
}

export interface Notice {
  id: string;
  date: string;
  title: string;
  description: string;
  isImportant: boolean;
  category?: 'General' | 'Urgent' | 'New' | 'Holiday' | 'Event';
  link?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  title: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'course-select' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
}

export interface PageMeta {
  title: string;
  subtitle: string;
  tagline?: string;
}

export interface AppState {
  site: SiteConfig;
  theme: ThemeConfig;
  home: HomeConfig;
  courses: {
    list: Course[];
    pageMeta: PageMeta;
  };
  notices: {
    list: Notice[];
    pageMeta: PageMeta;
  };
  gallery: {
    list: GalleryItem[];
    pageMeta: PageMeta;
  };
  faqs: {
    list: FAQItem[];
    pageMeta: PageMeta;
  };
  leads?: Lead[];
  customPages: CustomPage[];
  galleryMetadata?: Record<string, string>;
  enrollmentForm: {
    title: string;
    description: string;
    successTitle: string;
    successMessage: string;
    roadmapTitle: string;
    roadmapSteps: RoadmapStep[];
    fields: FormField[];
  };
  contactForm: {
    title: string;
    fields: FormField[];
  };
  about: AboutState;
  placements: {
    pageMeta: PageMeta;
    stats: PlacementStat[];
    reviews: StudentReview[];
    partners: IndustryPartner[];
    pageDescription: string;
    wallTitle: string;
  };
  legal: {
    privacy: {
      title: string;
      subtitle: string;
      sections: LegalSection[];
    };
    terms: {
      title: string;
      subtitle: string;
      sections: LegalSection[];
    };
  };
  career: {
    pageMeta: PageMeta;
    hero: {
      title: string;
      subtitle: string;
      bgImage?: string;
    };
    services: CareerService[];
    cta: {
      title: string;
      subtitle: string;
    };
  };
}

export interface PlacementStat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface StudentReview {
  id: string;
  name: string;
  course: string;
  company: string;
  companyIcon: string;
  image: string;
  text: string;
  salaryIncrease: string;
  role?: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export interface CareerService {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}
