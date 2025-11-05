export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Cafés' | 'Salgados' | 'Doces' | 'Bebidas';
  imageUrl?: string;
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  about: {
    title: string;
    paragraph: string;
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
