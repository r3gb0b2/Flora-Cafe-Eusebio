import React, { useState, useEffect } from 'react';
import { Photo, SiteContent } from '../types';

interface GalleryProps {
    photos: Photo[];
    content: SiteContent['gallery'];
    isLoading: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ photos, content, isLoading }) => {
    const PHOTOS_TO_SHOW = 6;
    const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
    const [fadingIndex, setFadingIndex] = useState<number | null>(null);

    useEffect(() => {
        if (photos.length > 0) {
            // Initialize with the first set of photos
            setDisplayedPhotos(photos.slice(0, PHOTOS_TO_SHOW));
        }
    }, [photos]);

    useEffect(() => {
        if (photos.length <= PHOTOS_TO_SHOW) {
            return; // No need to cycle if there aren't enough photos to swap
        }

        const intervalId = setInterval(() => {
            if (displayedPhotos.length === 0) return;

            // Pick a random slot to replace
            const indexToReplace = Math.floor(Math.random() * displayedPhotos.length);
            
            // Start fade-out animation
            setFadingIndex(indexToReplace);

            // After fade-out duration, swap the photo and start fade-in
            setTimeout(() => {
                setDisplayedPhotos(currentPhotos => {
                    const displayedIds = new Set(currentPhotos.map(p => p.id));
                    const availableToSwap = photos.filter(p => !displayedIds.has(p.id));

                    if (availableToSwap.length === 0) {
                        // Failsafe, should not be reached if photos.length > PHOTOS_TO_SHOW
                        return currentPhotos;
                    }
                    
                    const newPhoto = availableToSwap[Math.floor(Math.random() * availableToSwap.length)];
                    
                    const newPhotos = [...currentPhotos];
                    newPhotos[indexToReplace] = newPhoto;
                    return newPhotos;
                });
                
                // End animation, allowing the new item to fade in
                setFadingIndex(null);
            }, 500); // This must match the CSS transition duration

        }, 3000); // Change photo every 3 seconds

        return () => clearInterval(intervalId);
    }, [photos, displayedPhotos]);


    if (isLoading) {
        return (
            <section id="fotos" className="py-20 bg-brand-cream">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>Carregando fotos...</p>
                 </div>
            </section>
        );
    }
    
    // On initial render, displayedPhotos might be empty, so we take a slice from props
    const photosToRender = displayedPhotos.length > 0 ? displayedPhotos : photos.slice(0, PHOTOS_TO_SHOW);

    return (
        <section id="fotos" className="py-20 bg-brand-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
                    <p className="mt-4 text-lg text-gray-600">Um pouco do nosso cantinho especial.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {photosToRender.map((image, index) => (
                        <div 
                            key={`gallery-slot-${index}`} // A stable key for the grid slot is crucial for the animation
                            className={`group relative aspect-square transition-opacity duration-500 ease-in-out ${fadingIndex === index ? 'opacity-0' : 'opacity-100'}`}
                        >
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
