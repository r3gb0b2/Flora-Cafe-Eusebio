
import React from 'react';

const Hero: React.FC = () => (
  <section id="hero" className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/hero-coffee/1920/1080')" }}>
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    <div className="relative z-10 p-4">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-lg">Onde cada xícara conta uma história.</h1>
      <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">Descubra o refúgio perfeito para os amantes de café e boa companhia.</p>
      <a href="#reservas" className="bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
        Faça sua Reserva
      </a>
    </div>
  </section>
);

export default Hero;
