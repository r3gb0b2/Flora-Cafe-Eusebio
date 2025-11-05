import React from 'react';
import { Photo } from '../types';

interface GalleryProps {
  photos: Photo[];
  isLoading: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ photos, isLoading }) => {
  return (
    <section id="fotos" className="py-16 md:py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-brown mb-12">Nossos Momentos</h2>
        {isLoading ? (
            <div className="text-center">
                <p className="text-lg text-gray-600">Carregando fotos...</p>
            </div>
        ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="overflow-hidden rounded-lg shadow-lg group">
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-600">Nenhuma foto adicionada ainda.</p>
        )}
      </div>
    </section>
  );
};

export default Gallery;
