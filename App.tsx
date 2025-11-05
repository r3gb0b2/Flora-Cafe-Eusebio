import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured, auth } from './firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Photo, MenuItem, SiteContent } from './types';
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
import Login from './components/Login';
import FirebaseNotConfigured from './components/FirebaseNotConfigured';
import { createIcons, icons } from 'lucide';

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This is to render icons used in other components
    createIcons({ icons });
  }, [view, siteContent, isLoading]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchData = async () => {
      try {
        const contentDocRef = doc(db, 'siteContent', 'main');
        const contentSnap = await getDoc(contentDocRef);
        if (contentSnap.exists()) {
          setSiteContent(contentSnap.data() as SiteContent);
        } else {
          console.error("Site content document does not exist!");
          setError("Conteúdo do site não encontrado. Configure o Firestore.");
        }

        const menuUnsubscribe = onSnapshot(doc(db, 'menu', 'items'), (doc) => {
          if (doc.exists()) {
            setMenuItems(doc.data().items || []);
          }
        });
        
        const photosUnsubscribe = onSnapshot(doc(db, 'gallery', 'photos'), (doc) => {
          if (doc.exists()) {
            setPhotos(doc.data().photos || []);
          }
        });

        setIsLoading(false);
        
        return () => {
          menuUnsubscribe();
          photosUnsubscribe();
        };

      } catch (e) {
        console.error("Error fetching data: ", e);
        setError("Falha ao carregar os dados do site.");
        setIsLoading(false);
      }
    };
    
    fetchData();

    return () => authUnsubscribe();
  }, []);

  if (!isFirebaseConfigured) {
    return <FirebaseNotConfigured />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-cream">
        <div className="text-center">
            <div className="w-16 h-16 text-brand-accent animate-spin mx-auto" dangerouslySetInnerHTML={{__html: icons.loader.toSvg()}} />
            <p className="text-brand-brown text-xl mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 text-red-500 mx-auto" dangerouslySetInnerHTML={{__html: icons.alertCircle.toSvg()}} />
                <h2 className="text-2xl font-bold text-red-700 mt-4">Ocorreu um Erro</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        </div>
     );
  }

  if (view === 'admin') {
    if (user) {
      return <AdminPanel setView={setView} siteContent={siteContent} menuItems={menuItems} photos={photos} />;
    }
    return <Login setView={setView} />;
  }

  return (
    <div className="bg-brand-cream">
      {siteContent ? (
        <>
          <Header />
          <main>
            <Hero content={siteContent.hero} />
            <About content={siteContent.about} />
            <Menu menuItems={menuItems} />
            <Gallery photos={photos} content={siteContent.gallery} isLoading={false} />
            <Reservations content={siteContent.reservations} />
            <Location content={siteContent.location} />
            <Contact content={siteContent.contact} />
          </main>
          <Footer setView={setView} />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p>Conteúdo do site não carregado.</p>
        </div>
      )}
    </div>
  );
};

export default App;
