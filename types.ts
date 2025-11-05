// types.ts
export interface Photo {
  id: string;
  url: string;
  alt: string;
  storagePath?: string; // To track file in Firebase Storage for deletion
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  storagePath?: string; // To track file in Firebase Storage for deletion
}

export interface MenuCategory {
    id: string;
    name: string;
}

export interface Reservation {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    submittedAt: any; // Firestore ServerTimestamp
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    message: string;
    submittedAt: any; // Firestore ServerTimestamp
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
    storagePath?: string;
  };
  about: {
    title: string;
    paragraph: string;
    imageUrl: string;
    storagePath?: string;
  };
  gallery: {
    title: string;
  };
  reservations: {
    title: string;
    paragraph: string;
  };
  location: {
    title: string;
    address: string;
    hours: string;
    mapUrl: string;
  };
  contact: {
    title: string;
    paragraph: string;
    phone: string;
    email: string;
    instagramUrl: string;
    facebookUrl: string;
  };
}
