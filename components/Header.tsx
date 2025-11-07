
import React, { useState, useEffect } from 'react';

const NavLink: React.FC<{ href: string; children: React.ReactNode; onClick: () => void }> = ({ href, children, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-brand-brown hover:text-brand-accent transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium tracking-wider"
  >
    {children}
  </a>
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '#sobre', text: 'Sobre Nós' },
    { href: '#cardapio', text: 'Cardápio' },
    { href: '#fotos', text: 'Fotos' },
    { href: '#reservas', text: 'Reservas' },
    { href: '#localizacao', text: 'Localização' },
    { href: '#contato', text: 'Contato' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-cream/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#" className="text-brand-brown font-serif text-3xl font-bold flex items-center">
              FLORA CAFÉ
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => <NavLink key={link.href} href={link.href} onClick={() => setIsOpen(false)}>{link.text}</NavLink>)}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-brown hover:text-brand-accent focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <i data-lucide={isOpen ? 'x' : 'menu'} className="w-6 h-6"></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-cream/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
                 <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-brand-brown hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">{link.text}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;