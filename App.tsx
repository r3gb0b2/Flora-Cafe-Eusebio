import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured, auth } from './firebase';
import { doc, getDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Photo, MenuItem, SiteContent, MenuCategory, Reservation, ContactSubmission } from './types';
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

// Add type definition for window.lucide
declare global {
  interface Window {
    lucide: {
      createIcons: () => void;
    };
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Render icons whenever the view or data changes
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [view, siteContent, isLoading, user, photos, menuItems, menuCategories, reservations, contactSubmissions]);

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
        // Fetch site content once
        const contentDocRef = doc(db, 'siteContent', 'main');
        const contentSnap = await getDoc(contentDocRef);
        if (contentSnap.exists()) {
          setSiteContent(contentSnap.data() as SiteContent);
        } else {
          console.error("Site content document does not exist!");
          setError("Conteúdo do site não encontrado. Configure o Firestore.");
        }

        // Listen for real-time updates on collections
        const menuUnsubscribe = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
          setMenuItems(items);
        });
        
        const photosUnsubscribe = onSnapshot(collection(db, 'photos'), (snapshot) => {
          const photoItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
          setPhotos(photoItems);
        });

        const categoriesUnsubscribe = onSnapshot(collection(db, 'menuCategories'), (snapshot) => {
          const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuCategory));
          setMenuCategories(cats.sort((a, b) => a.name.localeCompare(b.name)));
        });

        const reservationsQuery = query(collection(db, 'reservations'), orderBy('submittedAt', 'desc'));
        const reservationsUnsubscribe = onSnapshot(reservationsQuery, (snapshot) => {
            const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
            setReservations(res);
        });

        const contactsQuery = query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc'));
        const contactsUnsubscribe = onSnapshot(contactsQuery, (snapshot) => {
            const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission));
            setContactSubmissions(subs);
        });

        setIsLoading(false);
        
        return () => {
          menuUnsubscribe();
          photosUnsubscribe();
          categoriesUnsubscribe();
          reservationsUnsubscribe();
          contactsUnsubscribe();
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
            <div className="w-16 h-16 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-brand-brown text-xl mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-700 mt-4">Ocorreu um Erro</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        </div>
     );
  }

  if (view === 'admin') {
    if (user) {
      return <AdminPanel 
        setView={setView} 
        siteContent={siteContent} 
        menuItems={menuItems} 
        photos={photos} 
        menuCategories={menuCategories} 
        reservations={reservations}
        contactSubmissions={contactSubmissions}
      />;
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