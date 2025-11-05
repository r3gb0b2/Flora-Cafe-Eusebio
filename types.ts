export interface Photo {
  id: string;
  src: string;
  alt: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: 'Cafés' | 'Comidas' | 'Bebidas Geladas';
}