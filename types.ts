
export interface SiteConfig {
  name: string;
  tagline: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    mapUrl: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  navigation: Array<{ label: string; path: string; }>;
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
  sections: {
    notices: boolean;
    featuredCourses: boolean;
    gallery: boolean;
    contact: boolean;
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

export interface AppState {
  site: SiteConfig;
  home: HomeConfig;
  courses: Course[];
  notices: Notice[];
  gallery: GalleryItem[];
  galleryMetadata?: Record<string, string>; // Stores category name -> thumbnail URL mapping
  about: {
    intro: string;
    mission: string;
    vision: string;
    timeline: Array<{ year: string; event: string; }>;
  };
}
