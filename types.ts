// types.ts
export interface SiteContent {
  hero: { title: string; subtitle: string; imageUrl: string; storagePath?: string; };
  about: { title: string; paragraph: string; imageUrl: string; storagePath?: string; };
  gallery: { title: string; };
  reservations: { title: string; paragraph: string; };
  location: { title: string; address: string; hours: string; mapUrl: string; };
  contact: { title: string; paragraph: string; phone: string; email: string; instagramUrl: string; facebookUrl: string; };
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
  storagePath: string;
}

export interface MenuItem {
  id:string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  imageUrl?: string;
  storagePath?: string;
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
  status: 'Pendente' | 'Confirmada' | 'Concluída' | 'Cancelada';
  type: string;
  notes?: string;
  adminNotes?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: any; // Firestore Timestamp
}