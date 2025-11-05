import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { SiteContent, MenuItem, Photo, MenuCategory, Reservation, ContactSubmission } from '../types';
import { doc, updateDoc, collection, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { GoogleGenAI } from '@google/genai';
import Dashboard from './Dashboard'; // Import the new Dashboard component

// Props Interface
interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
  siteContent: SiteContent | null;
  menuItems: MenuItem[];
  photos: Photo[];
  menuCategories: MenuCategory[];
  reservations: Reservation[];
  contactSubmissions: ContactSubmission[];
}

export type AdminTab = 'dashboard' | 'geral' | 'cardapio' | 'categorias' | 'galeria' | 'reservas' | 'contatos';

// Helper function for file uploads
const uploadFile = async (file: File, path: string): Promise<{ url: string, storagePath: string }> => {
    const storagePath = `${path}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, storagePath };
};

// Helper function to delete a file from storage
const deleteFile = async (storagePath: string) => {
    if (!storagePath) return;
    try {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
            console.error("Error deleting file:", error);
        }
    }
};

const AdminPanel: React.FC<AdminPanelProps> = ({ 
    setView, 
    siteContent: initialSiteContent,
    menuItems,
    photos,
    menuCategories,
    reservations,
    contactSubmissions,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(() => (localStorage.getItem('adminTab') as AdminTab) || 'dashboard');
  const [siteContent, setSiteContent] = useState<SiteContent | null>(initialSiteContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // States for modals and forms
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, 'id'>>({ name: '', description: '', price: '', category: '', imageUrl: '', storagePath: '' });
  const [menuImageFile, setMenuImageFile] = useState<File | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const [newPhoto, setNewPhoto] = useState<{ alt: string, file: File | null }>({ alt: '', file: null });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  
  useEffect(() => {
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    setSiteContent(initialSiteContent);
  }, [initialSiteContent]);

  useEffect(() => {
    // Re-render icons when tab changes or sidebar opens
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeTab, isSidebarOpen]);
  
  const handleContentChange = (section: keyof SiteContent, field: string, value: string) => {
    setSiteContent(prev => {
        if (!prev) return null;
        const keys = field.split('.');
        const newContent = JSON.parse(JSON.stringify(prev)); // Deep copy
        let current = newContent[section] as any;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newContent;
    });
  };

  const handleSaveContent = async (section: keyof SiteContent) => {
      if (!siteContent) return;
      setIsSaving(true);
      try {
          let updatedSectionData = { ...siteContent[section] };

          if (section === 'hero' && heroImageFile) {
              await deleteFile(siteContent.hero.storagePath || '');
              const { url, storagePath } = await uploadFile(heroImageFile, 'site-images');
              updatedSectionData = { ...updatedSectionData, imageUrl: url, storagePath: storagePath };
              setHeroImageFile(null);
          }
          if (section === 'about' && aboutImageFile) {
              await deleteFile(siteContent.about.storagePath || '');
              const { url, storagePath } = await uploadFile(aboutImageFile, 'site-images');
              updatedSectionData = { ...updatedSectionData, imageUrl: url, storagePath: storagePath };
              setAboutImageFile(null);
          }

          const contentRef = doc(db, 'siteContent', 'main');
          await updateDoc(contentRef, { [section]: updatedSectionData });
          alert(`${section.charAt(0).toUpperCase() + section.slice(1)} content saved!`);
      } catch (error) {
          console.error("Error saving content:", error);
          alert("Failed to save content.");
      } finally {
          setIsSaving(false);
      }
  };

  // Menu Item Handlers
  const openMenuModal = (item: MenuItem | null = null) => {
      if (item) {
          setEditingMenuItem(item);
          setNewMenuItem(item);
      } else {
          setEditingMenuItem(null);
          setNewMenuItem({ name: '', description: '', price: '', category: menuCategories[0]?.name || '', imageUrl: '', storagePath: '' });
      }
      setMenuImageFile(null);
      setIsMenuModalOpen(true);
  };
  
  const handleMenuSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      try {
          let imageUrl = newMenuItem.imageUrl || '';
          let storagePath = newMenuItem.storagePath || '';

          if (menuImageFile) {
              if (storagePath) await deleteFile(storagePath);
              const uploadResult = await uploadFile(menuImageFile, 'menu-items');
              imageUrl = uploadResult.url;
              storagePath = uploadResult.storagePath;
          }

          const itemData = { ...newMenuItem, price: Number(newMenuItem.price), imageUrl, storagePath };

          if (editingMenuItem) {
              const itemRef = doc(db, 'menuItems', editingMenuItem.id);
              await updateDoc(itemRef, itemData);
          } else {
              await addDoc(collection(db, 'menuItems'), itemData);
          }
          setIsMenuModalOpen(false);
      } catch (error) {
          console.error("Error saving menu item:", error);
      } finally {
          setIsSaving(false);
      }
  };
  
  const handleMenuDelete = async (item: MenuItem) => {
      if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
          if (item.storagePath) await deleteFile(item.storagePath);
          await deleteDoc(doc(db, 'menuItems', item.id));
      }
  };

  // Category Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const categoryData = { name: newCategoryName };
    if (editingCategory) {
        await setDoc(doc(db, 'menuCategories', editingCategory.id), categoryData);
    } else {
        await addDoc(collection(db, 'menuCategories'), categoryData);
    }
    setNewCategoryName('');
    setEditingCategory(null);
  };
  
  const handleCategoryDelete = async (id: string) => {
    if (window.confirm("Are you sure? This will also affect menu items in this category.")) {
        await deleteDoc(doc(db, 'menuCategories', id));
    }
  };

  // Gallery Handlers
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.file || !newPhoto.alt) {
        alert("Please provide a file and a description.");
        return;
    }
    setIsSaving(true);
    try {
        const { url, storagePath } = await uploadFile(newPhoto.file, 'gallery');
        await addDoc(collection(db, 'photos'), {
            url,
            alt: newPhoto.alt,
            storagePath,
            createdAt: new Date(),
        });
        setNewPhoto({ alt: '', file: null });
    } catch (error) {
        console.error("Error uploading photo:", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handlePhotoDelete = async (photo: Photo) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
        await deleteFile(photo.storagePath);
        await deleteDoc(doc(db, 'photos', photo.id));
    }
  };

  // Reservation Handlers
  const handleReservationStatusChange = async (reservationId: string, status: Reservation['status']) => {
      const resRef = doc(db, 'reservations', reservationId);
      await updateDoc(resRef, { status });
  };
  
  const handleReservationDetails = (reservation: Reservation) => {
      setSelectedReservation(reservation);
      setAdminNotes(reservation.adminNotes || '');
      setIsReservationModalOpen(true);
  };
  
  const handleSaveAdminNotes = async () => {
      if (!selectedReservation) return;
      const resRef = doc(db, 'reservations', selectedReservation.id);
      await updateDoc(resRef, { adminNotes });
      setSelectedReservation(prev => prev ? {...prev, adminNotes} : null);
      // Don't close modal, let user close it.
  };

  // Contact Handlers
  const handleContactDelete = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this message?")){
          await deleteDoc(doc(db, 'contactSubmissions', id));
      }
  };
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem('adminTab');
      await signOut(auth);
      setView('user');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
        case 'Pendente': return 'bg-yellow-100 text-yellow-800';
        case 'Confirmada': return 'bg-green-100 text-green-800';
        case 'Cancelada': return 'bg-red-100 text-red-800';
        case 'Concluída': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    if (!siteContent) return <p>Loading content...</p>;

    switch(activeTab) {
        case 'dashboard':
            return <Dashboard 
                reservations={reservations} 
                contactSubmissions={contactSubmissions} 
                menuItems={menuItems} 
                setActiveTab={setActiveTab} 
            />;
        case 'geral':
            return (
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Página Inicial (Hero)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Título</label>
                                <input type="text" value={siteContent.hero.title} onChange={e => handleContentChange('hero', 'title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Subtítulo</label>
                                <textarea value={siteContent.hero.subtitle} onChange={e => handleContentChange('hero', 'subtitle', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Imagem de Fundo</label>
                                <img src={siteContent.hero.imageUrl} alt="Hero background" className="my-2 max-h-48 rounded"/>
                                <input type="file" onChange={e => setHeroImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm"/>
                            </div>
                        </div>
                        <button onClick={() => handleSaveContent('hero')} disabled={isSaving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar Página Inicial'}</button>
                    </div>

                    {/* About Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Seção "Sobre Nós"</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Título</label>
                                <input type="text" value={siteContent.about.title} onChange={e => handleContentChange('about', 'title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Parágrafo</label>
                                <textarea value={siteContent.about.paragraph} onChange={e => handleContentChange('about', 'paragraph', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={5}></textarea>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Imagem da Seção</label>
                                <img src={siteContent.about.imageUrl} alt="About section" className="my-2 max-h-48 rounded"/>
                                <input type="file" onChange={e => setAboutImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm"/>
                            </div>
                        </div>
                        <button onClick={() => handleSaveContent('about')} disabled={isSaving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar Seção Sobre'}</button>
                    </div>

                    {/* Contact & Location Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                         <h3 className="text-xl font-bold mb-4">Contato e Localização</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" placeholder="Telefone" value={siteContent.contact.phone} onChange={e => handleContentChange('contact', 'phone', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                            <input type="email" placeholder="Email" value={siteContent.contact.email} onChange={e => handleContentChange('contact', 'email', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                            <input type="text" placeholder="Instagram URL" value={siteContent.contact.instagramUrl} onChange={e => handleContentChange('contact', 'instagramUrl', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                            <input type="text" placeholder="Facebook URL" value={siteContent.contact.facebookUrl} onChange={e => handleContentChange('contact', 'facebookUrl', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                            <input type="text" placeholder="Endereço" value={siteContent.location.address} onChange={e => handleContentChange('location', 'address', e.target.value)} className="md:col-span-2 block w-full rounded-md border-gray-300 shadow-sm" />
                            <input type="text" placeholder="Horário de Funcionamento" value={siteContent.location.hours} onChange={e => handleContentChange('location', 'hours', e.target.value)} className="md:col-span-2 block w-full rounded-md border-gray-300 shadow-sm" />
                            <textarea placeholder="Google Maps URL" value={siteContent.location.mapUrl} onChange={e => handleContentChange('location', 'mapUrl', e.target.value)} className="md:col-span-2 block w-full rounded-md border-gray-300 shadow-sm" rows={3}></textarea>
                         </div>
                         <button onClick={() => { handleSaveContent('contact'); handleSaveContent('location'); }} disabled={isSaving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar Contato e Localização'}</button>
                    </div>
                </div>
            );
        case 'cardapio':
             return (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Gerenciar Cardápio</h2>
                        <button onClick={() => openMenuModal()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex-shrink-0">Adicionar Item</button>
                    </div>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {menuItems.map(item => (
                            <div key={item.id} className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <img src={item.imageUrl || '/placeholder-espresso.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded mr-4"/>
                                    <div>
                                        <p className="font-bold">{item.name} - <span className="font-normal">R${Number(item.price).toFixed(2)}</span></p>
                                        <p className="text-sm text-gray-600">{item.category}</p>
                                    </div>
                                </div>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => openMenuModal(item)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Editar</button>
                                    <button onClick={() => handleMenuDelete(item)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Apagar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'categorias':
            return(
                <div>
                     <h2 className="text-2xl font-bold mb-4">Gerenciar Categorias do Cardápio</h2>
                     <form onSubmit={handleCategorySubmit} className="mb-4 bg-white p-4 rounded shadow flex gap-4">
                         <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Nome da Categoria" className="flex-grow rounded-md border-gray-300 shadow-sm"/>
                         <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editingCategory ? 'Atualizar' : 'Adicionar'}</button>
                         {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setNewCategoryName(''); }} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>}
                     </form>
                      <div className="bg-white shadow rounded-lg overflow-hidden">
                         {menuCategories.map(cat => (
                            <div key={cat.id} className="p-4 border-b flex items-center justify-between">
                                <p>{cat.name}</p>
                                <div className="space-x-2">
                                    <button onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); }} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Editar</button>
                                    <button onClick={() => handleCategoryDelete(cat.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Apagar</button>
                                </div>
                            </div>
                         ))}
                     </div>
                </div>
            );
        case 'galeria':
            return (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Gerenciar Galeria</h2>
                     <form onSubmit={handlePhotoSubmit} className="mb-8 bg-white p-4 rounded shadow space-y-4">
                         <input type="text" value={newPhoto.alt} onChange={e => setNewPhoto({...newPhoto, alt: e.target.value})} placeholder="Descrição da foto" className="block w-full rounded-md border-gray-300 shadow-sm"/>
                         <input type="file" required onChange={e => setNewPhoto({...newPhoto, file: e.target.files ? e.target.files[0] : null})} className="block w-full text-sm"/>
                         <button type="submit" disabled={isSaving} className="px-4 py-2 bg-green-600 text-white rounded">{isSaving ? 'Enviando...' : 'Adicionar Foto'}</button>
                     </form>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="relative group">
                                <img src={photo.url} alt={photo.alt} className="w-full h-48 object-cover rounded-lg"/>
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handlePhotoDelete(photo)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Apagar</button>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            );
        case 'reservas':
             return (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Gerenciar Reservas</h2>
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pessoas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reservations.map(r => (
                                    <tr key={r.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(r.status)}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(r.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {r.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{r.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{String(r.guests)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => handleReservationDetails(r)} className="text-indigo-600 hover:text-indigo-900">Detalhes</button>
                                            {r.status === 'Pendente' && <button onClick={() => handleReservationStatusChange(r.id, 'Confirmada')} className="text-green-600 hover:text-green-900">Confirmar</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
         case 'contatos':
            return (
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Mensagens de Contato</h2>
                    <div className="space-y-4">
                        {contactSubmissions.map(s => (
                            <div key={s.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-semibold">{s.name} <span className="text-gray-500 font-normal">&lt;{s.email}&gt;</span></p>
                                        <p className="text-sm text-gray-500">{s.submittedAt?.toDate().toLocaleString('pt-BR')}</p>
                                    </div>
                                    <button onClick={() => handleContactDelete(s.id)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0">
                                        <i data-lucide="trash-2" className="w-5 h-5"></i>
                                    </button>
                                </div>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{s.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        default:
            return <div>Página não encontrada</div>;
    }
  }

  const NavItem: React.FC<{tab: AdminTab, label: string, icon: string}> = ({tab, label, icon}) => (
    <button 
        onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${activeTab === tab ? 'bg-brand-accent text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    >
        <i data-lucide={icon} className="w-5 h-5 mr-3"></i>
        <span>{label}</span>
    </button>
  )

  return (
    <>
    <div className="relative min-h-screen md:flex bg-gray-100">
        {/* Mobile Header */}
        <header className="bg-white text-gray-800 flex justify-between items-center md:hidden sticky top-0 z-20 shadow-md">
            <div className="flex items-center p-4">
                <i data-lucide="leaf" className="w-6 h-6 mr-2 text-brand-accent"></i>
                <span className="text-lg font-bold text-brand-brown">Admin Flora Café</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-4 focus:outline-none focus:bg-gray-200" aria-label="Open menu">
                <i data-lucide="menu" className="h-6 w-6"></i>
            </button>
        </header>

        {/* Sidebar */}
        <aside className={`bg-white w-64 p-4 flex flex-col flex-shrink-0 fixed inset-y-0 left-0 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-lg md:shadow-md ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <i data-lucide="leaf" className="w-8 h-8 mr-2 text-brand-accent"></i>
                    <h1 className="text-xl font-bold text-brand-brown">Admin Flora Café</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 rounded-full hover:bg-gray-200" aria-label="Close menu">
                    <i data-lucide="x" className="w-5 h-5"></i>
                </button>
            </div>
            <nav className="flex flex-col space-y-2">
                <NavItem tab="dashboard" label="Dashboard" icon="layout-dashboard" />
                <NavItem tab="geral" label="Conteúdo Geral" icon="file-text" />
                <NavItem tab="cardapio" label="Cardápio" icon="book-open" />
                <NavItem tab="categorias" label="Categorias" icon="list" />
                <NavItem tab="galeria" label="Galeria" icon="image" />
                <NavItem tab="reservas" label="Reservas" icon="calendar" />
                <NavItem tab="contatos" label="Contatos" icon="message-square" />
            </nav>
            <div className="mt-auto">
                <button onClick={() => setView('user')} className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-200 transition-colors">
                    <i data-lucide="arrow-left-from-line" className="w-5 h-5 mr-3"></i>
                    Ver Site
                </button>
                 <button onClick={handleLogout} className="flex items-center w-full mt-2 px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-100 transition-colors">
                    <i data-lucide="log-out" className="w-5 h-5 mr-3"></i>
                    Sair
                </button>
            </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            {renderContent()}
        </main>
        
        {/* Overlay for mobile */}
        {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"></div>}

    </div>

    {/* Menu Item Modal */}
    {isMenuModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">{editingMenuItem ? 'Editar' : 'Adicionar'} Item do Cardápio</h3>
                <form onSubmit={handleMenuSubmit} className="space-y-4">
                    <input type="text" placeholder="Nome" value={newMenuItem.name} onChange={e => setNewMenuItem({...newMenuItem, name: e.target.value})} className="w-full rounded border-gray-300" required/>
                    <textarea placeholder="Descrição" value={newMenuItem.description} onChange={e => setNewMenuItem({...newMenuItem, description: e.target.value})} className="w-full rounded border-gray-300" rows={3} required/>
                    <input type="number" placeholder="Preço" value={newMenuItem.price} onChange={e => setNewMenuItem({...newMenuItem, price: e.target.value})} className="w-full rounded border-gray-300" required/>
                    <select value={newMenuItem.category} onChange={e => setNewMenuItem({...newMenuItem, category: e.target.value})} className="w-full rounded border-gray-300" required>
                        <option value="" disabled>Selecione uma categoria</option>
                        {menuCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <div>
                        <label className="block text-sm font-medium">Imagem</label>
                        <input type="file" onChange={e => setMenuImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm"/>
                        {newMenuItem.imageUrl && !menuImageFile && <img src={newMenuItem.imageUrl} className="w-24 h-24 mt-2 object-cover rounded" />}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsMenuModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded">{isSaving ? 'Salvando...' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {/* Reservation Details Modal */}
    {isReservationModalOpen && selectedReservation && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Detalhes da Reserva</h3>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Nome:</strong> {selectedReservation.name}</p>
                    <p><strong>Contato:</strong> {selectedReservation.email} / {selectedReservation.phone}</p>
                    <p><strong>Data:</strong> {new Date(selectedReservation.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {selectedReservation.time}</p>
                    <p><strong>Pessoas:</strong> {String(selectedReservation.guests)}</p>
                    <p><strong>Tipo:</strong> {selectedReservation.type}</p>
                    {selectedReservation.notes && <p><strong>Observações do Cliente:</strong> {selectedReservation.notes}</p>}
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium">Notas Administrativas</label>
                    <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="mt-1 w-full rounded border-gray-300" rows={3}></textarea>
                </div>
                 <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                    <div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedReservation.status)}`}>{selectedReservation.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleReservationStatusChange(selectedReservation.id, 'Confirmada')} className="px-3 py-1 text-sm bg-green-500 text-white rounded">Confirmar</button>
                        <button onClick={() => handleReservationStatusChange(selectedReservation.id, 'Cancelada')} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Cancelar</button>
                        <button onClick={() => handleReservationStatusChange(selectedReservation.id, 'Concluída')} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Concluir</button>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={() => setIsReservationModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Fechar</button>
                    <button type="button" onClick={handleSaveAdminNotes} className="px-4 py-2 bg-blue-600 text-white rounded">Salvar Notas</button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};

export default AdminPanel;