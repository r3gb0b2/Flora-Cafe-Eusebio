
import React from 'react';

const Location: React.FC = () => (
  <section id="localizacao" className="py-16 md:py-24 bg-brand-cream">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-6">Venha nos Visitar</h2>
        <div className="space-y-4 text-lg text-gray-700">
          <p className="flex items-center justify-center md:justify-start">
            <i data-lucide="map-pin" className="w-5 h-5 mr-3 text-brand-accent"></i>
            <span>Rua do Café, 123 - Centro, São Paulo - SP</span>
          </p>
          <p className="flex items-center justify-center md:justify-start">
            <i data-lucide="clock" className="w-5 h-5 mr-3 text-brand-accent"></i>
            <span>Seg - Sáb: 8:00 - 20:00 | Dom: 9:00 - 18:00</span>
          </p>
        </div>
      </div>
      <div className="h-80 md:h-96 rounded-lg shadow-xl overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.145891362622!2d-46.63546998502279!3d-23.56309948468205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59a8f0b3a8d9%3A0x8f3c75d6b4d3a4b3!2sAvenida%20Paulista!5e0!3m2!1spt-BR!2sbr!4v1678886450123!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Location"
        ></iframe>
      </div>
    </div>
  </section>
);

export default Location;
