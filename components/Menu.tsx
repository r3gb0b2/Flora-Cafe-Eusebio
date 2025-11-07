import React from 'react';
import { MenuItem, MenuCategory } from '../types';

interface MenuProps {
    menuItems: MenuItem[];
    menuCategories: MenuCategory[];
}

const Menu: React.FC<MenuProps> = ({ menuItems, menuCategories }) => {
  
  const menuByCategory = menuCategories.map(category => ({
    ...category,
    items: menuItems.filter(item => item.category === category.name)
  })).filter(category => category.items.length > 0);

  // Manually order categories to match the PDF
  const categoryOrder = [
    'Entradas',
    'Tapiocas',
    'Tapiocas Doces',
    'Cuscuz',
    'Omeletes/Crepioca',
    'Croissant',
    'Croissant Doce',
    'Sanduiches no Pão Brioche',
    'Pães de Queijo',
    'Panquecas',
    'Docinhos',
    'Adicionais',
    'Cafés Espresso',
    'Cafés Filtrados',
    'Cafés ao Leite',
    'Cafés Gelados',
    'Frapês',
    'Sodas',
    'Sucos Especiais',
    'Sucos',
    'Chás Gelados',
    'Água/Refrigerante',
    'Cafés da Manhã Especiais',
  ];

  const sortedMenu = menuByCategory.sort((a, b) => {
    return categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name);
  });

  return (
    <section id="cardapio" className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-bold text-brand-brown sm:text-6xl">Cardápio</h2>
        </div>
        
        <div className="space-y-16">
          {sortedMenu.map(category => (
            <div key={category.id}>
              <div className="text-center mb-8">
                <h3 className="text-4xl font-serif font-bold text-brand-brown tracking-wide">{category.name}</h3>
                <div className="w-24 h-px bg-brand-secondary mx-auto mt-2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {category.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="pr-4">
                      <p className="font-bold text-lg text-brand-brown">{item.name}</p>
                      {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                    </div>
                    <p className="font-bold text-lg text-brand-brown whitespace-nowrap">R$ {Number(item.price).toFixed(2).replace('.',',')}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;