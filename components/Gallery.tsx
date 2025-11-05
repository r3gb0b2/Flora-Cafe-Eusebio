import React from 'react';
import { Photo, SiteContent } from '../types';

interface GalleryProps {
    photos: Photo[];
    content: SiteContent['gallery'];
    isLoading: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ photos, content, isLoading }) => {
    return (
        <section id="fotos" className="py-20 bg-brand-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
                    <p className="mt-4 text-lg text-gray-600">Um pouco do nosso cantinho especial.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {isLoading ? (
                        <p>Carregando fotos...</p>
                    ) : (
                        photos.map((image) => (
                            <div key={image.id} className="group relative aspect-square">
                                <img src={image.url} alt={image.alt} className="w-full h-full object-cover rounded-lg shadow-md" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                                    <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">{image.alt}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
