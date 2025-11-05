
import React, { useState } from 'react';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-white hover:text-brand-accent transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">
    {children}
  </a>
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { href: '#sobre', text: 'Sobre Nós' },
    { href: '#cardapio', text: 'Cardápio' },
    { href: '#fotos', text: 'Fotos' },
    { href: '#reservas', text: 'Reservas' },
    { href: '#localizacao', text: 'Localização' },
    { href: '#contato', text: 'Contato' },
  ];

  return (
    <header className="bg-brand-brown bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-white font-serif text-2xl font-bold flex items-center">
              <i data-lucide="leaf" className="w-6 h-6 mr-2 text-brand-accent"></i>
              Flora Café Eusébio
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => <NavLink key={link.href} href={link.href}>{link.text}</NavLink>)}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-brand-accent focus:outline-none"
            >
              <i data-lucide={isOpen ? 'x' : 'menu'} className="w-6 h-6"></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
                 <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-white hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">{link.text}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;