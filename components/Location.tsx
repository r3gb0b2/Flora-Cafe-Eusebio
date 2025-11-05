import React from 'react';
import { SiteContent } from '../types';

interface LocationProps {
  content: SiteContent['location'];
}

const Location: React.FC<LocationProps> = ({ content }) => {
  return (
    <section id="localizacao" className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
            <p className="mt-4 text-lg text-gray-700">
              Venha nos visitar e desfrutar de um momento especial.
            </p>
            <div className="mt-6 space-y-4 text-gray-600">
              <p className="flex items-center">
                <i data-lucide="map-pin" className="w-5 h-5 mr-3 text-brand-accent"></i>
                <span>{content.address}</span>
              </p>
              <p className="flex items-center">
                <i data-lucide="clock" className="w-5 h-5 mr-3 text-brand-accent"></i>
                <span>{content.hours}</span>
              </p>
            </div>
          </div>
          <div className="h-96 rounded-lg shadow-lg overflow-hidden">
            <iframe
              src={content.mapUrl}
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
