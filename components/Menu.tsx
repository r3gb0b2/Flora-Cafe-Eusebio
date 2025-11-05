
import React, { useState } from 'react';
import { MenuItem } from '../types';

const menuItems: MenuItem[] = [
  { name: 'Espresso', description: 'Um clássico shot de café intenso e aromático.', price: 'R$ 6,00', category: 'Cafés' },
  { name: 'Cappuccino Italiano', description: 'Espresso, leite vaporizado e uma cremosa espuma de leite.', price: 'R$ 10,00', category: 'Cafés' },
  { name: 'Latte', description: 'Espresso com uma generosa porção de leite vaporizado.', price: 'R$ 12,00', category: 'Cafés' },
  { name: 'Mocha', description: 'Uma deliciosa mistura de espresso, leite e calda de chocolate.', price: 'R$ 14,00', category: 'Cafés' },
  { name: 'Croissant de Amêndoas', description: 'Massa folhada crocante com recheio de creme de amêndoas.', price: 'R$ 15,00', category: 'Comidas' },
  { name: 'Tosta de Abacate', description: 'Pão artesanal, abacate fresco, tomate cereja e um fio de azeite.', price: 'R$ 22,00', category: 'Comidas' },
  { name: 'Pão de Queijo', description: 'Tradicional pão de queijo mineiro, quentinho e macio.', price: 'R$ 7,00', category: 'Comidas' },
  { name: 'Bolo de Cenoura', description: 'Bolo fofinho de cenoura com cobertura de brigadeiro.', price: 'R$ 12,00', category: 'Comidas' },
  { name: 'Cold Brew', description: 'Café extraído a frio por 18 horas, suave e refrescante.', price: 'R$ 13,00', category: 'Bebidas Geladas' },
  { name: 'Frappuccino de Caramelo', description: 'Café, leite, gelo e calda de caramelo batidos e finalizados com chantilly.', price: 'R$ 18,00', category: 'Bebidas Geladas' },
  { name: 'Chá Gelado da Casa', description: 'Infusão de hibisco com frutas vermelhas e um toque de limão.', price: 'R$ 9,00', category: 'Bebidas Geladas' },
];

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Cafés' | 'Comidas' | 'Bebidas Geladas'>('Cafés');

  const categories: ('Cafés' | 'Comidas' | 'Bebidas Geladas')[] = ['Cafés', 'Comidas', 'Bebidas Geladas'];

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="cardapio" className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-brown mb-8">Nosso Cardápio</h2>
        <div className="flex justify-center mb-8 border-b-2 border-gray-200">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-lg font-medium transition-colors duration-300 ${
                activeCategory === category
                  ? 'border-b-4 border-brand-accent text-brand-brown'
                  : 'text-gray-500 hover:text-brand-brown'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map(item => (
            <div key={item.name} className="flex flex-col">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-bold font-serif text-brand-brown">{item.name}</h3>
                <p className="text-lg font-semibold text-brand-brown">{item.price}</p>
              </div>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
