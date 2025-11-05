
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Cafés' | 'Salgados' | 'Doces' | 'Bebidas';
  imageUrl: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}
