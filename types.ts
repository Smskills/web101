
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  logo: string;
  loginLabel?: string;
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
  };
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

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'course-select' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[]; // For custom select types
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

export interface AppState {
  site: SiteConfig;
  home: HomeConfig;
  courses: Course[];
  notices: Notice[];
  gallery: GalleryItem[];
  galleryMetadata?: Record<string, string>;
  enrollmentForm: {
    title: string;
    description: string;
    fields: FormField[];
  };
  about: {
    intro: string;
    mission: string;
    vision: string;
    timeline: Array<{ year: string; event: string; }>;
  };
  placements: {
    stats: PlacementStat[];
    reviews: StudentReview[];
    partners: IndustryPartner[];
    pageDescription: string;
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
