import React from 'react';
import { MenuItem } from '../types';

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
    <img src={item.imageUrl || '/placeholder-espresso.jpg'} alt={item.name} className="w-full h-48 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-serif font-semibold text-brand-brown">{item.name}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold text-brand-accent">R$ {Number(item.price).toFixed(2)}</span>
        <span className="text-sm bg-brand-brown text-white px-2 py-1 rounded-full">{item.category}</span>
      </div>
    </div>
  </div>
);


const Menu: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  return (
    <section id="cardapio" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">Nosso Cardápio</h2>
          <p className="mt-4 text-lg text-gray-600">Delícias preparadas com carinho para você.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
