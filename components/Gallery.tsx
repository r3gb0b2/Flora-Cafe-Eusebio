
import React from 'react';
import { GalleryImage } from '../types';

const images: GalleryImage[] = [
    { id: '1', url: '/gallery/1.jpg', alt: 'Ambiente aconchegante do café' },
    { id: '2', url: '/gallery/2.jpg', alt: 'Detalhe de um café sendo preparado' },
    { id: '3', url: '/gallery/3.jpg', alt: 'Mesa com doces e salgados' },
    { id: '4', url: '/gallery/4.jpg', alt: 'Cliente sorrindo com um cappuccino' },
    { id: '5', url: '/gallery/5.jpg', alt: 'Fachada do Flora Café Eusébio' },
    { id: '6', url: '/gallery/6.jpg', alt: 'Área externa com plantas' },
];

const Gallery: React.FC = () => {
    return (
        <section id="fotos" className="py-20 bg-brand-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">Nossa Galeria</h2>
                    <p className="mt-4 text-lg text-gray-600">Um pouco do nosso cantinho especial.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className="group relative">
                            <img src={image.url} alt={image.alt} className="w-full h-full object-cover rounded-lg shadow-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
                                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">{image.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
