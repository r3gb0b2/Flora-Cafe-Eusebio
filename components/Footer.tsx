
import React from 'react';

interface FooterProps {
  setView: (view: 'user' | 'admin') => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-brand-brown text-brand-cream">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Flora Café Eusébio. Todos os direitos reservados.</p>
        <button
          onClick={() => setView('admin')}
          className="text-sm mt-2 sm:mt-0 text-gray-400 hover:text-white transition-colors duration-300"
        >
          Painel Administrativo
        </button>
      </div>
    </footer>
  );
};

export default Footer;