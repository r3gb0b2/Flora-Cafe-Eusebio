import React, { useState } from 'react';
import { SiteContent } from '../types';

interface LocationProps {
  content: SiteContent['location'];
}

const Location: React.FC<LocationProps> = ({ content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetDirections = () => {
    if (!navigator.geolocation) {
      setError('A geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const destination = encodeURIComponent(content.address);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Você negou o pedido de geolocalização.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('A informação de localização não está disponível.');
            break;
          case err.TIMEOUT:
            setError('O pedido para obter a localização expirou.');
            break;
          default:
            setError('Ocorreu um erro desconhecido ao obter a localização.');
            break;
        }
        setIsLoading(false);
      }
    );
  };

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
            <div className="mt-8">
              <button
                onClick={handleGetDirections}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-accent hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i data-lucide="navigation" className="w-5 h-5 mr-3 -ml-1"></i>
                {isLoading ? 'Obtendo localização...' : 'Obter Rota'}
              </button>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
