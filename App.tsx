import React, { useState, useEffect } from 'react';
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
import FirebaseNotConfigured from './components/FirebaseNotConfigured';
import { db, isFirebaseConfigured } from './firebase';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { SiteContent, MenuItem, Photo } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubContent = onSnapshot(doc(db, "siteContent", "main"), (doc) => {
      if (doc.exists()) {
        setSiteContent(doc.data() as SiteContent);
      }
      setIsLoading(false);
    });

    const unsubMenu = onSnapshot(collection(db, "menuItems"), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
      setMenuItems(items);
    });

    const unsubPhotos = onSnapshot(collection(db, "photos"), (snapshot) => {
      const photoItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
      setPhotos(photoItems);
    });
    
    return () => {
      unsubContent();
      unsubMenu();
      unsubPhotos();
    };
  }, []);

  useEffect(() => {
    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }, [view, isLoading, siteContent]);

  if (!isFirebaseConfigured) {
    return <FirebaseNotConfigured />;
  }
  
  if (isLoading) {
    return (
      <div className="bg-brand-cream text-gray-800 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
            <i data-lucide="coffee" className="w-16 h-16 text-brand-brown animate-bounce"></i>
            <p className="mt-4 text-lg font-serif">Carregando o sabor...</p>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return <AdminPanel setView={setView} siteContent={siteContent} menuItems={menuItems} photos={photos} />;
  }

  return (
    <div className="bg-brand-cream text-gray-800">
      <Header />
      <main>
        {siteContent && (
          <>
            <Hero content={siteContent.hero} />
            <About content={siteContent.about} />
            <Menu menuItems={menuItems} />
            <Gallery content={siteContent.gallery} photos={photos} isLoading={isLoading}/>
            <Reservations content={siteContent.reservations}/>
            <Location content={siteContent.location} />
            <Contact content={siteContent.contact} />
          </>
        )}
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default App;
