
import React from 'react';

const Location: React.FC = () => {
  return (
    <section id="localizacao" className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">Nossa Localização</h2>
            <p className="mt-4 text-lg text-gray-700">
              Venha nos visitar e desfrutar de um momento especial.
            </p>
            <div className="mt-6 space-y-4 text-gray-600">
              <p className="flex items-center">
                <i data-lucide="map-pin" className="w-5 h-5 mr-3 text-brand-accent"></i>
                <span>Rua Fictícia, 123 - Centro, Eusébio - CE</span>
              </p>
              <p className="flex items-center">
                <i data-lucide="clock" className="w-5 h-5 mr-3 text-brand-accent"></i>
                <span>Seg - Sáb: 8:00 - 20:00 | Dom: 9:00 - 18:00</span>
              </p>
              <p className="flex items-center">
                <i data-lucide="phone" className="w-5 h-5 mr-3 text-brand-accent"></i>
                <span>(85) 91234-5678</span>
              </p>
            </div>
          </div>
          <div className="h-96 rounded-lg shadow-lg overflow-hidden">
             {/* Replace with a real map embed, e.g., from Google Maps */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15926.417031154388!2d-38.46011382509156!3d-3.868770742512613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c751a02157e84b%3A0x6734c5679a1f3c10!2sEus%C3%A9bio%2C%20CE!5e0!3m2!1spt-BR!2sbr!4v1689182342893!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Flora Café Eusébio"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
