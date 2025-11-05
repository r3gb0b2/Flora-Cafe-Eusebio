// Fix: Create the content for AdminPanel.tsx to provide a functional admin dashboard component.
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Photo, MenuItem, SiteContent, MenuCategory, Reservation, ContactSubmission } from '../types';

interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
  siteContent: SiteContent | null;
  menuItems: MenuItem[];
  photos: Photo[];
  menuCategories: MenuCategory[];
  reservations: Reservation[];
  contactSubmissions: ContactSubmission[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  setView,
  reservations,
  contactSubmissions,
}) => {
  const [activeTab, setActiveTab] = useState('reservations');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('user'); // Redirect to user view on logout
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Falha ao sair.");
    }
  };

  const TabButton = ({ tabName, label, count }: { tabName: string, label: string, count: number }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md flex justify-between items-center ${activeTab === tabName ? 'bg-brand-accent text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    >
        <span>{label}</span>
        <span className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{count}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'reservations':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reservas Recebidas</h2>
            <div className="bg-white shadow rounded-lg">
              <ul className="divide-y divide-gray-200">
                {reservations.length > 0 ? (
                  reservations.map(r => (
                    <li key={r.id} className="p-4">
                      <p className="font-semibold">{r.name} - {r.guests} pessoa(s)</p>
                      <p className="text-sm text-gray-600">Data: {new Date(r.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {r.time}</p>
                      <p className="text-sm text-gray-600">Contato: {r.email} {r.phone && `/ ${r.phone}`}</p>
                    </li>
                  ))
                ) : <p className="p-4 text-gray-500">Nenhuma reserva encontrada.</p>}
              </ul>
            </div>
          </div>
        );
      case 'messages':
        return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Mensagens de Contato</h2>
              <div className="bg-white shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {contactSubmissions.length > 0 ? (
                    contactSubmissions.map(s => (
                        <li key={s.id} className="p-4">
                            <div className="flex justify-between">
                                <p className="font-semibold">{s.name}</p>
                                <a href={`mailto:${s.email}`} className="text-sm text-blue-600 hover:underline">{s.email}</a>
                            </div>
                            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{s.message}</p>
                        </li>
                    ))
                    ) : <p className="p-4 text-gray-500">Nenhuma mensagem encontrada.</p>}
                </ul>
              </div>
            </div>
          );
      case 'menu':
        return <div><h2 className="text-2xl font-bold mb-4">Gerenciamento do Cardápio</h2><p>Funcionalidade a ser implementada.</p></div>;
      case 'gallery':
        return <div><h2 className="text-2xl font-bold mb-4">Gerenciamento da Galeria</h2><p>Funcionalidade a ser implementada.</p></div>;
      case 'content':
        return <div><h2 className="text-2xl font-bold mb-4">Conteúdo do Site</h2><p>Funcionalidade a ser implementada.</p></div>;
      default:
        return <p>Selecione uma categoria para gerenciar.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-brand-brown flex items-center">
              <i data-lucide="shield" className="w-5 h-5 mr-2"></i>
              Painel Administrativo
            </h1>
            <div className="flex items-center space-x-4">
                <button onClick={() => setView('user')} className="text-sm font-medium text-gray-600 hover:text-brand-accent transition-colors">Ver Site</button>
                <button onClick={handleLogout} className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors flex items-center">
                  <i data-lucide="log-out" className="w-4 h-4 mr-2"></i>
                  Sair
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <aside className="md:col-span-3">
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-1">
                    <TabButton tabName="reservations" label="Reservas" count={reservations.length} />
                    <TabButton tabName="messages" label="Mensagens" count={contactSubmissions.length} />
                    <TabButton tabName="menu" label="Cardápio" count={0} />
                    <TabButton tabName="gallery" label="Galeria" count={0} />
                    <TabButton tabName="content" label="Conteúdo do Site" count={0} />
                </div>
            </aside>
            <div className="md:col-span-9">
                {renderContent()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
