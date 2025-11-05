
import React, { useState, useEffect } from 'react';
import { Photo } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reservations from './components/Reservations';
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

// Fix: Add type definition for window.lucide to solve TypeScript error.
declare global {
  interface Window {
    lucide: {
      createIcons: () => void;
    };
  }
}

type View = 'user' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user');
  const [photos, setPhotos] = useState<Photo[]>([
    { id: 1, src: 'https://picsum.photos/seed/coffee1/800/600', alt: 'Interior of the coffee shop' },
    { id: 2, src: 'https://picsum.photos/seed/coffee2/800/600', alt: 'A freshly brewed latte' },
    { id: 3, src: 'https://picsum.photos/seed/coffee3/800/600', alt: 'Cozy seating area' },
    { id: 4, src: 'https://picsum.photos/seed/coffee4/800/600', alt: 'Close-up of a croissant' },
    { id: 5, src: 'https://picsum.photos/seed/coffee5/800/600', alt: 'Barista preparing coffee' },
    { id: 6, src: 'https://picsum.photos/seed/coffee6/800/600', alt: 'Outdoor patio seating' },
  ]);

  useEffect(() => {
    // This hook is used to re-trigger lucide icons when the view changes
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [view, photos]);

  const addPhoto = (newPhotoSrc: string, newPhotoAlt: string) => {
    setPhotos(prevPhotos => [
      ...prevPhotos,
      {
        id: Date.now(),
        src: newPhotoSrc,
        alt: newPhotoAlt,
      },
    ]);
  };
  
  const deletePhoto = (id: number) => {
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
  };


  return (
    <div className="bg-brand-cream text-brand-brown font-sans">
      {view === 'user' ? (
        <>
          <Header />
          <main>
            <Hero />
            <About />
            <Menu />
            <Gallery photos={photos} />
            <Reservations />
            <Location />
            <Contact />
          </main>
          <Footer setView={setView} />
        </>
      ) : (
        <AdminPanel 
          photos={photos} 
          addPhoto={addPhoto} 
          deletePhoto={deletePhoto}
          setView={setView} 
        />
      )}
    </div>
  );
};

export default App;