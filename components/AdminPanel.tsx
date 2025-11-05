import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { SiteContent, MenuItem, Photo, MenuCategory, Reservation, ContactSubmission } from '../types';

interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
  siteContent: SiteContent | null;
  menuItems: MenuItem[];
  photos: Photo[];
  menuCategories: MenuCategory[];
  reservations: Reservation[];
  contactSubmissions: ContactSubmission[];
}

type AdminTab = 'dashboard' | 'content' | 'menu' | 'gallery' | 'reservations' | 'messages';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    setView, 
    siteContent,
    menuItems,
    photos,
    menuCategories,
    reservations,
    contactSubmissions,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('user');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const renderContent = () => {
    switch(activeTab) {
        case 'dashboard':
            return (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold">Reservas Pendentes</h3>
                            <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'pending').length}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold">Itens no Cardápio</h3>
                            <p className="text-3xl font-bold">{menuItems.length}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold">Fotos na Galeria</h3>
                            <p className="text-3xl font-bold">{photos.length}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold">Novas Mensagens</h3>
                            <p className="text-3xl font-bold">{contactSubmissions.length}</p>
                        </div>
                    </div>
                </div>
            );
        case 'reservations':
            return (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Reservas</h2>
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pessoas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reservations.map(r => (
                                    <tr key={r.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(r.date).toLocaleDateString()} às {r.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{String(r.guests)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.email} {r.phone && `/ ${r.phone}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {r.status || 'pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
         case 'messages':
            return (
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Mensagens de Contato</h2>
                    <div className="space-y-4">
                        {contactSubmissions.map(s => (
                            <div key={s.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{s.name} <span className="text-gray-500 font-normal">&lt;{s.email}&gt;</span></p>
                                    <p className="text-sm text-gray-500">{s.submittedAt?.toDate().toLocaleString()}</p>
                                </div>
                                <p className="mt-2 text-gray-700">{s.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        // Default case to render placeholder for other tabs
        default:
            return <div><h2 className="text-2xl font-bold mb-4 capitalize">{activeTab}</h2><p>Gerenciamento de {activeTab} aqui.</p></div>;
    }
  }

  const NavItem: React.FC<{tab: AdminTab, label: string, icon: string}> = ({tab, label, icon}) => (
    <button 
        onClick={() => setActiveTab(tab)}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left ${activeTab === tab ? 'bg-brand-accent text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    >
        <i data-lucide={icon} className="w-5 h-5 mr-3"></i>
        <span>{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-white shadow-md p-4 flex flex-col flex-shrink-0">
            <div className="flex items-center mb-8">
                <i data-lucide="leaf" className="w-8 h-8 mr-2 text-brand-accent"></i>
                <h1 className="text-xl font-bold text-brand-brown">Admin Flora Café</h1>
            </div>
            <nav className="flex flex-col space-y-2">
                <NavItem tab="dashboard" label="Dashboard" icon="layout-dashboard" />
                <NavItem tab="content" label="Conteúdo do Site" icon="file-text" />
                <NavItem tab="menu" label="Cardápio" icon="book-open" />
                <NavItem tab="gallery" label="Galeria" icon="image" />
                <NavItem tab="reservations" label="Reservas" icon="calendar" />
                <NavItem tab="messages" label="Mensagens" icon="message-square" />
            </nav>
            <div className="mt-auto">
                <button onClick={() => setView('user')} className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-200">
                    <i data-lucide="arrow-left-from-line" className="w-5 h-5 mr-3"></i>
                    Ver Site
                </button>
                 <button onClick={handleLogout} className="flex items-center w-full mt-2 px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-100">
                    <i data-lucide="log-out" className="w-5 h-5 mr-3"></i>
                    Sair
                </button>
            </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
            {renderContent()}
        </main>
    </div>
  );
};

export default AdminPanel;
