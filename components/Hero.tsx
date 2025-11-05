import React from 'react';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent['hero'];
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  return (
    <section id="hero" className="relative h-[80vh] min-h-[500px] bg-cover bg-center text-white" style={{ backgroundImage: `url('${content.imageUrl}')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 animate-fade-in-down">{content.title}</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 animate-fade-in-up">
          {content.subtitle}
        </p>
        <a href="#cardapio" className="bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
          Ver Cardápio
        </a>
      </div>
    </section>
  );
};

export default Hero;
