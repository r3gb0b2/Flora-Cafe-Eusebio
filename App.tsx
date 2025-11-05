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
import { db } from './firebase';

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
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This hook is used to re-trigger lucide icons when the view changes
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [view, photos]);
  
  useEffect(() => {
    // Listen for real-time updates from the 'photos' collection in Firestore
    const unsubscribe = db.collection('photos').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Photo[];
      setPhotos(photosData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching photos from Firestore:", error);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);


  return (
    <div className="bg-brand-cream text-brand-brown font-sans">
      {view === 'user' ? (
        <>
          <Header />
          <main>
            <Hero />
            <About />
            <Menu />
            <Gallery photos={photos} isLoading={loading} />
            <Reservations />
            <Location />
            <Contact />
          </main>
          <Footer setView={setView} />
        </>
      ) : (
        <AdminPanel 
          photos={photos} 
          setView={setView} 
        />
      )}
    </div>
  );
};

export default App;
