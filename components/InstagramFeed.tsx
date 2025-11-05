import React from 'react';
import { SiteContent } from '../types';

interface InstagramFeedProps {
  content: SiteContent['instagram'];
  instagramUrl: string;
}

// Placeholder images - in a real scenario, these would come from the API
const placeholderPosts = [
  { id: 1, url: 'https://images.unsplash.com/photo-1511920183353-3c9c6634d28c?q=80&w=600', alt: 'Close-up of a latte art heart' },
  { id: 2, url: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=600', alt: 'Freshly baked croissants on a plate' },
  { id: 3, url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600', alt: 'Cozy interior of the cafe with warm lighting' },
  { id: 4, url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600', alt: 'A cup of black coffee on a wooden table' },
  { id: 5, url: 'https://images.unsplash.com/photo-1528699633785-3b1615395874?q=80&w=600', alt: 'A smiling customer enjoying their drink' },
  { id: 6, url: 'https://images.unsplash.com/photo-1579992308829-e61b3c66f842?q=80&w=600', alt: 'A slice of delicious chocolate cake' },
];


const InstagramFeed: React.FC<InstagramFeedProps> = ({ content, instagramUrl }) => {
  return (
    <section id="instagram" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
        <a 
          href={instagramUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 text-xl text-brand-accent font-semibold hover:underline"
        >
          {content.username}
        </a>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{content.ctaText}</p>
        
        <div className="mt-12">
            <p className="text-center text-gray-500 mb-6 italic">
              (Esta é uma demonstração. A integração com o Instagram requer configuração de API.)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {placeholderPosts.map(post => (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" key={post.id} className="group relative aspect-square block">
                        <img 
                            src={post.url} 
                            alt={post.alt} 
                            className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-lg">
                             <i data-lucide="instagram" className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                        </div>
                    </a>
                ))}
            </div>
        </div>

        <div className="mt-12">
            <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all transform hover:scale-105"
            >
                <i data-lucide="instagram" className="w-5 h-5 mr-3 -ml-1"></i>
                Seguir no Instagram
            </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;