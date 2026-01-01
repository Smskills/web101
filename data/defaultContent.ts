
import { AppState } from '../types';

export const INITIAL_CONTENT: AppState = {
  site: {
    name: "SM Skills Training Institute",
    tagline: "SM Skills Training Institute • ESTD 2024",
    logo: "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png", 
    loginLabel: "Institutional Login",
    contact: {
      email: "admissions@sm-skills.edu",
      phone: "+1 (555) 2024-SMS",
      address: "Campus A, Professional Avenue, Education District",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2zTWVsYm91cm5lIFZJQywgQXVzdHJhbGlh!5e0!3m2!1sen!2sus!4v1634567890123"
    },
    social: [
      { id: 's1', platform: 'Facebook', url: 'https://facebook.com', icon: 'fa-facebook-f' },
      { id: 's2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'fa-linkedin-in' },
      { id: 's3', platform: 'Instagram', url: 'https://instagram.com', icon: 'fa-instagram' }
    ],
    navigation: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Courses", path: "/courses" },
      { label: "Notices", path: "/notices" },
      { label: "Gallery", path: "/gallery" },
      { label: "Contact", path: "/contact" }
    ],
    footer: {
      brandDescription: "SM Skills Training Institute (SMS) is a premier center for technical education, providing industry-aligned training designed for immediate employability.",
      quickLinksLabel: "Navigation",
      supportLinksLabel: "Resources",
      reachUsLabel: "Connect",
      bottomText: "SM Skills Training Institute • ESTD 2024",
      supportLinks: [
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Terms of Service", path: "/terms-of-service" },
        { label: "Career Guidance", path: "/career-guidance" },
        { label: "Placement Wall", path: "/placement-review" }
      ]
    }
  },
  home: {
    hero: {
      title: "Master Skills for the Modern Industry",
      subtitle: "Join SM Skills for specialized training programs. Build your career with veterans.",
      ctaText: "Explore Courses",
      ctaLink: "/courses",
      bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600",
      visible: true
    },
    highlights: [
      {
        icon: "fa-graduation-cap",
        title: "Hands-on Mastery",
        description: "Practice in real-world scenarios with projects mentored by industry leads."
      },
      {
        icon: "fa-rocket",
        title: "Career-First Approach",
        description: "Our programs are optimized for placement success and high-growth trajectories."
      },
      {
        icon: "fa-briefcase",
        title: "94% Placement Rate",
        description: "Join a network of alumni currently working at top global technology firms."
      }
    ],
    sectionLabels: {
      noticesTitle: "Institute Feed",
      noticesSubtitle: "Recent announcements regarding batches, events, and scholarships.",
      coursesTitle: "Vocational Programs",
      coursesSubtitle: "Curated learning paths focused on high-demand professional skills.",
      galleryTitle: "Campus Life",
      gallerySubtitle: "Explore our facilities, classroom interactions, and achievement galleries.",
      placementsTitle: "Our Placement Record",
      placementsSubtitle: "Celebrating SM Skills graduates who have joined industry-leading organizations.",
      placementMainLabel: "Success Stories"
    },
    ctaBlock: {
      title: "Secure Your Future with SM Skills",
      subtitle: "Admissions for the 2024 academic cycle are now open. Consult with an advisor today.",
      buttonText: "Begin Application",
      buttonLink: "/enroll",
      visible: true
    },
    bigShowcase: {
      visible: true,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
      title: "Leading with Excellence",
      subtitle: "Our faculty and senior mentors bring decades of combined technical expertise to the classroom."
    },
    sections: {
      notices: true,
      featuredCourses: true,
      gallery: true,
      contact: true,
      industryTieups: true,
      placementReviews: true
    }
  },
  enrollmentForm: {
    title: "SMS Application Form",
    description: "Provide your details to begin the enrollment process.",
    fields: [
      { id: "f1", label: "Legal Full Name", type: "text", placeholder: "e.g. Michael Smith", required: true },
      { id: "f2", label: "Email Address", type: "email", placeholder: "mike@example.com", required: true },
      { id: "f3", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000", required: true },
      { id: "f4", label: "Program Track", type: "course-select", placeholder: "Choose a Course", required: true }
    ]
  },
  courses: [
    {
      id: "1",
      name: "Software Architecture",
      duration: "12 Months",
      mode: "Offline",
      description: "Comprehensive training on distributed systems and cloud-native engineering.",
      status: "Active",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      price: "$2,200"
    }
  ],
  notices: [
    {
      id: "n1",
      date: "2024-06-01",
      title: "Summer 2024 Intake Open",
      description: "Secure your place in our flagship engineering and design programs.",
      isImportant: true,
      category: 'New'
    }
  ],
  gallery: [],
  about: {
    intro: "SM Skills Training Institute (SMS) was founded in 2024 with a mission to modernize technical education through practical, industry-first curricula.",
    mission: "To empower students with the exact skills required by top global employers.",
    vision: "To be the most trusted name in professional skill development and career launching.",
    timeline: [
      { year: "2024", event: "SM Skills Campus Launch" }
    ]
  },
  placements: {
    pageDescription: "SM Skills graduates are consistently hired by the world's most innovative companies.",
    stats: [
      { id: "s1", label: "Average Hike", value: "85%", icon: "fa-chart-line" },
      { id: "s2", label: "Hiring Partners", value: "200+", icon: "fa-handshake" }
    ],
    reviews: [
      {
        id: "r1",
        name: "Jessica Chen",
        course: "Full Stack Dev",
        role: "Software Engineer",
        company: "Google",
        companyIcon: "fa-google",
        image: "https://i.pravatar.cc/150?u=jess",
        text: "The training at SM Skills was more rigorous than my actual job.",
        salaryIncrease: "+120% Hike"
      }
    ],
    partners: [
      { id: "p1", name: "Google", icon: "fa-google" },
      { id: 'p2', name: 'Meta', icon: 'fa-meta' },
      { id: 'p3', name: 'Amazon', icon: 'fa-amazon' }
    ]
  },
  legal: {
    privacy: {
      title: "Data Privacy",
      subtitle: "How SM Skills manages your records.",
      sections: [
        { id: "p1", title: "Information Handling", content: "Student records are encrypted." }
      ]
    },
    terms: {
      title: "Terms of Enrollment",
      subtitle: "Code of conduct.",
      sections: [
        { id: "t1", title: "Academic Integrity", content: "Professionalism is required." }
      ]
    }
  },
  career: {
    hero: {
      title: "Career Lab",
      subtitle: "Interview prep with industry vets.",
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600"
    },
    services: [
      { id: "cs1", title: "Mock Interviews", description: "Practice with leads.", icon: "fa-comments" }
    ],
    cta: {
      title: "Ready for Launch?",
      subtitle: "Schedule a session."
    }
  }
};
