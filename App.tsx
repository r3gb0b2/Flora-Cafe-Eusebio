
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

const App: React.FC = () => {
  const [view, setView] = useState<'user' | 'admin'>('user');

  // A simple side-effect to initialize any scripts after render, e.g. for icons
  useEffect(() => {
    // Assuming lucide icons are used, this would initialize them.
    // In a real app, you might use a library like `lucide-react`.
    if (typeof (window as any).lucide !== 'undefined') {
      (window as any).lucide.createIcons();
    }
  }, [view]);

  if (view === 'admin') {
    return <AdminPanel setView={setView} />;
  }

  return (
    <div className="bg-brand-cream text-gray-800">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Reservations />
        <Location />
        <Contact />
      </main>
      <Footer setView={setView} />
    </div>
  );
};

export default App;
