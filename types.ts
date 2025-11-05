
export interface Photo {
  id: number;
  src: string;
  alt: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: 'Cafés' | 'Comidas' | 'Bebidas Geladas';
}
