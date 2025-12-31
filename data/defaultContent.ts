
import { AppState } from '../types';

export const INITIAL_CONTENT: AppState = {
  site: {
    name: "Apex International Institute",
    tagline: "Empowering Minds, Shaping Futures",
    logo: "https://picsum.photos/id/1/200/200",
    contact: {
      email: "info@apex-institute.edu",
      phone: "+1 (555) 123-4567",
      address: "123 Academic Way, Education District, City, Country",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2zTWVsYm91cm5lIFZJQywgQXVzdHJhbGlh!5e0!3m2!1sen!2sus!4v1634567890123"
    },
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    },
    navigation: [
      { label: "Home", path: "#/" },
      { label: "About", path: "#/about" },
      { label: "Courses", path: "#/courses" },
      { label: "Notices", path: "#/notices" },
      { label: "Gallery", path: "#/gallery" },
      { label: "Contact", path: "#/contact" }
    ]
  },
  home: {
    hero: {
      title: "Unlock Your Potential with Modern Learning",
      subtitle: "Industry-standard training programs designed to get you hired and certified within months.",
      ctaText: "Explore Courses",
      ctaLink: "#/courses",
      bgImage: "https://images.unsplash.com/photo-1523050853063-bd8012fec046?auto=format&fit=crop&q=80&w=1600",
      visible: true
    },
    highlights: [
      {
        icon: "fa-graduation-cap",
        title: "Expert Mentors",
        description: "Learn from industry professionals with years of real-world experience."
      },
      {
        icon: "fa-laptop-code",
        title: "Hands-on Training",
        description: "Work on live projects and build a portfolio that stands out to recruiters."
      },
      {
        icon: "fa-certificate",
        title: "Global Certification",
        description: "Earn recognized certificates that validate your skills worldwide."
      }
    ],
    sections: {
      notices: true,
      featuredCourses: true,
      gallery: true,
      contact: true
    }
  },
  courses: [
    {
      id: "1",
      name: "Full Stack Web Development",
      duration: "6 Months",
      mode: "Hybrid",
      description: "Master React, Node.js, and modern cloud deployment strategies.",
      status: "Active",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      price: "$1,200"
    },
    {
      id: "2",
      name: "Data Science & AI",
      duration: "8 Months",
      mode: "Online",
      description: "Analyze complex data patterns using Python and Machine Learning.",
      status: "Active",
      image: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?auto=format&fit=crop&q=80&w=800",
      price: "$1,500"
    },
    {
      id: "3",
      name: "Cyber Security Specialist",
      duration: "4 Months",
      mode: "Offline",
      description: "Learn ethical hacking, network defense, and risk management.",
      status: "Active",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      price: "$900"
    }
  ],
  notices: [
    {
      id: "n1",
      date: "2024-05-20",
      title: "Summer Admissions Open",
      description: "Enroll now to get a 20% early bird discount on all technical courses.",
      isImportant: true,
      link: "#/courses"
    },
    {
      id: "n2",
      date: "2024-05-15",
      title: "Upcoming Career Fair",
      description: "Join us on June 10th for the annual career fair featuring top tech companies.",
      isImportant: false
    }
  ],
  gallery: [
    { id: "g1", url: "https://picsum.photos/id/10/800/600", category: "Campus", title: "Library Wing" },
    { id: "g2", url: "https://picsum.photos/id/20/800/600", category: "Events", title: "Tech Fest 2023" },
    { id: "g3", url: "https://picsum.photos/id/30/800/600", category: "Campus", title: "Main Auditorium" }
  ],
  galleryMetadata: {
    "Campus": "https://picsum.photos/id/10/400/400",
    "Events": "https://picsum.photos/id/20/400/400"
  },
  about: {
    intro: "Apex International Institute is a leading provider of technical education, founded in 2010 with a vision to bridge the gap between academia and industry.",
    mission: "To provide accessible, high-quality professional training that transforms lives.",
    vision: "To become the global standard for industry-ready specialized education.",
    timeline: [
      { year: "2010", event: "Institute Founded" },
      { year: "2015", event: "Reached 5,000 Graduates" },
      { year: "2022", event: "Awarded Best Vocational Training Center" }
    ]
  }
};
