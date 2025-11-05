// Fix: Define interfaces for data types used throughout the application.
export interface SiteContent {
  hero: { title: string; subtitle: string; imageUrl: string; };
  about: { title: string; paragraph: string; imageUrl: string; };
  gallery: { title: string; };
  reservations: { title: string; paragraph: string; };
  location: { title: string; address: string; hours: string; mapUrl: string; };
  contact: { title: string; paragraph: string; phone: string; email: string; instagramUrl: string; facebookUrl: string; };
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
}

export interface MenuItem {
  id:string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  imageUrl?: string;
}

export interface MenuCategory {
    id: string;
    name:string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number | string;
  submittedAt: any; // Firestore Timestamp
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: any; // Firestore Timestamp
}
