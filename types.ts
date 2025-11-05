export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id:string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  storagePath?: string;
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
  storagePath?: string;
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
  menu: {
    title: string;
    description: string;
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
