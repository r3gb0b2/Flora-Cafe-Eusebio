import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Photo, MenuItem, SiteContent, MenuCategory, Reservation, ContactSubmission } from '../types';
import { GoogleGenAI } from '@google/genai';

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
  siteContent: initialSiteContent,
  menuItems,
  photos,
  menuCategories,
  reservations,
  contactSubmissions,
}) => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'geral');
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [isLoading, setIsLoading] = useState(false);
  
  // States for Menu Management
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, 'id'>>({ name: '', description: '', price: 0, category: '', imageUrl: '' });
  const [menuItemImageFile, setMenuItemImageFile] = useState<File | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // States for Category Management
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  // States for Gallery Management
  const [newPhotoAlt, setNewPhotoAlt] = useState('');
  const [newPhotoImageFile, setNewPhotoImageFile] = useState<File | null>(null);

  // States for General Content Images
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);


  useEffect(() => {
    setSiteContent(initialSiteContent);
  }, [initialSiteContent]);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeTab]);
  
  const handleSiteContentChange = (section: keyof SiteContent, field: string, value: string) => {
    setSiteContent(prev => {
      if (!prev) return null;
      const newContent = { ...prev };
      (newContent[section] as any)[field] = value;
      return newContent;
    });
  };

  const handleSaveSiteContent = async () => {
    if (!siteContent) return;
    setIsLoading(true);
    try {
        const contentRef = doc(db, 'siteContent', 'main');
        const finalContent = { ...siteContent };

        // Handle Hero Image Upload
        if (heroImageFile) {
            const oldPath = finalContent.hero.storagePath;
            const newPath = `site/hero_${Date.now()}_${heroImageFile.name}`;
            const imageRef = ref(storage, newPath);
            await uploadBytes(imageRef, heroImageFile);
            finalContent.hero.imageUrl = await getDownloadURL(imageRef);
            finalContent.hero.storagePath = newPath;
            if (oldPath) await deleteObject(ref(storage, oldPath)).catch(e => console.error("Old hero image delete failed:", e));
        }

        // Handle About Image Upload
        if (aboutImageFile) {
            const oldPath = finalContent.about.storagePath;
            const newPath = `site/about_${Date.now()}_${aboutImageFile.name}`;
            const imageRef = ref(storage, newPath);
            await uploadBytes(imageRef, aboutImageFile);
            finalContent.about.imageUrl = await getDownloadURL(imageRef);
            finalContent.about.storagePath = newPath;
            if (oldPath) await deleteObject(ref(storage, oldPath)).catch(e => console.error("Old about image delete failed:", e));
        }

        await setDoc(contentRef, finalContent);
        alert('Conteúdo salvo com sucesso!');
        setHeroImageFile(null);
        setAboutImageFile(null);

    } catch (error) {
        console.error("Error saving content:", error);
        alert('Falha ao salvar conteúdo.');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('adminActiveTab');
    try {
      await signOut(auth);
      setView('user');
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Falha ao sair.");
    }
  };

  const uploadFile = async (file: File, path: string): Promise<{ downloadURL: string, storagePath: string }> => {
        const storagePath = `${path}/${Date.now()}_${file.name}`;
        const imageRef = ref(storage, storagePath);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        return { downloadURL, storagePath };
  };

  // Menu Item Handlers
    const handleAddMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMenuItem.name || !newMenuItem.category || !menuItemImageFile) {
            alert("Nome, categoria e imagem são obrigatórios.");
            return;
        }
        setIsLoading(true);
        try {
            const { downloadURL, storagePath } = await uploadFile(menuItemImageFile, 'menuItems');
            await addDoc(collection(db, 'menuItems'), { ...newMenuItem, imageUrl: downloadURL, storagePath });
            setNewMenuItem({ name: '', description: '', price: 0, category: '', imageUrl: '' });
            setMenuItemImageFile(null);
            alert("Item adicionado!");
        } catch (error) {
            console.error(error);
            alert("Falha ao adicionar item.");
        }
        setIsLoading(false);
    };

    const handleUpdateMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMenuItem) return;
        setIsLoading(true);
        try {
            const itemRef = doc(db, 'menuItems', editingMenuItem.id);
            const updatedData = { ...editingMenuItem };

            if (menuItemImageFile) { // If a new image is uploaded
                const oldPath = editingMenuItem.storagePath;
                const { downloadURL, storagePath } = await uploadFile(menuItemImageFile, 'menuItems');
                updatedData.imageUrl = downloadURL;
                updatedData.storagePath = storagePath;
                if(oldPath) await deleteObject(ref(storage, oldPath)).catch(e => console.error(e));
            }
            delete (updatedData as any).id;
            await updateDoc(itemRef, updatedData);
            
            setEditingMenuItem(null);
            setMenuItemImageFile(null);
            alert("Item atualizado!");
        } catch (error) {
            console.error(error);
            alert("Falha ao atualizar item.");
        }
        setIsLoading(false);
    };


    const handleDeleteMenuItem = async (item: MenuItem) => {
        if (!window.confirm(`Tem certeza que deseja apagar ${item.name}?`)) return;
        try {
            await deleteDoc(doc(db, 'menuItems', item.id));
            if (item.storagePath) {
                await deleteObject(ref(storage, item.storagePath));
            }
            alert("Item apagado.");
        } catch (error) {
            console.error(error);
            alert("Falha ao apagar item.");
        }
    };
  
    // Category Handlers
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        try {
            await addDoc(collection(db, 'menuCategories'), { name: newCategoryName });
            setNewCategoryName('');
            alert('Categoria adicionada!');
        } catch (error) {
            console.error(error);
            alert('Falha ao adicionar categoria.');
        }
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!editingCategory) return;
        try {
            await updateDoc(doc(db, 'menuCategories', editingCategory.id), { name: editingCategory.name });
            setEditingCategory(null);
            alert('Categoria atualizada!');
        } catch (error) {
            console.error(error);
            alert('Falha ao atualizar categoria.');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("Apagar uma categoria não apaga os itens dentro dela. Deseja continuar?")) return;
        try {
            await deleteDoc(doc(db, 'menuCategories', id));
            alert("Categoria apagada.");
        } catch (error) {
            console.error(error);
            alert("Falha ao apagar categoria.");
        }
    };

    // Gallery Handlers
    const handleAddPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPhotoAlt || !newPhotoImageFile) {
            alert("Descrição e imagem são obrigatórios.");
            return;
        }
        setIsLoading(true);
        try {
            const { downloadURL, storagePath } = await uploadFile(newPhotoImageFile, 'gallery');
            await addDoc(collection(db, 'photos'), { alt: newPhotoAlt, url: downloadURL, storagePath });
            setNewPhotoAlt('');
            setNewPhotoImageFile(null);
            alert("Foto adicionada!");
        } catch (error) {
            console.error(error);
            alert("Falha ao adicionar foto.");
        }
        setIsLoading(false);
    };

    const handleDeletePhoto = async (photo: Photo) => {
        if (!window.confirm(`Tem certeza que deseja apagar esta foto?`)) return;
        try {
            await deleteDoc(doc(db, 'photos', photo.id));
            if (photo.storagePath) {
                await deleteObject(ref(storage, photo.storagePath));
            }
            alert("Foto apagada.");
        } catch (error) {
            console.error(error);
            alert("Falha ao apagar foto.");
        }
    };
  
   const generateDescription = async (itemName: string) => {
    if (!itemName) {
        alert("Por favor, insira um nome para o item.");
        return;
    }
    setIsLoading(true);
    try {
        if (!process.env.API_KEY) {
            alert("A chave da API do Gemini não foi configurada.");
            return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Crie uma descrição curta e apetitosa para um item de cardápio chamado "${itemName}". Fale dos ingredientes principais de forma atrativa. Máximo de 2 frases.`,
        });
        const description = response.text;
        if (editingMenuItem) {
            setEditingMenuItem(prev => prev ? { ...prev, description } : null);
        } else {
            setNewMenuItem(prev => ({ ...prev, description }));
        }
    } catch (error) {
        console.error("Error generating description:", error);
        alert("Falha ao gerar descrição com IA.");
    } finally {
        setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!siteContent) {
        return <p>Carregando conteúdo do site...</p>;
    }
    switch (activeTab) {
      case 'geral':
        return (
            <div className="space-y-8">
                {/* General Site Content */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Página Inicial (Hero)</h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Título Principal" value={siteContent.hero.title} onChange={e => handleSiteContentChange('hero', 'title', e.target.value)} className="w-full p-2 border rounded"/>
                        <textarea placeholder="Subtítulo" value={siteContent.hero.subtitle} onChange={e => handleSiteContentChange('hero', 'subtitle', e.target.value)} className="w-full p-2 border rounded" rows={2}/>
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Imagem de Fundo</label>
                           <img src={siteContent.hero.imageUrl} alt="Hero" className="w-48 h-auto my-2 rounded"/>
                           <input type="file" onChange={e => setHeroImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-opacity-90"/>
                        </div>
                    </div>
                </div>
                 {/* About Us Content */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Seção Sobre Nós</h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Título" value={siteContent.about.title} onChange={e => handleSiteContentChange('about', 'title', e.target.value)} className="w-full p-2 border rounded"/>
                        <textarea placeholder="Parágrafo" value={siteContent.about.paragraph} onChange={e => handleSiteContentChange('about', 'paragraph', e.target.value)} className="w-full p-2 border rounded" rows={5}/>
                         <div>
                           <label className="block text-sm font-medium text-gray-700">Imagem da Seção</label>
                           <img src={siteContent.about.imageUrl} alt="About Us" className="w-48 h-auto my-2 rounded"/>
                           <input type="file" onChange={e => setAboutImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-opacity-90"/>
                        </div>
                    </div>
                </div>
                {/* Contact & Location */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Contato e Localização</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="tel" placeholder="Telefone" value={siteContent.contact.phone} onChange={e => handleSiteContentChange('contact', 'phone', e.target.value)} className="w-full p-2 border rounded"/>
                        <input type="email" placeholder="Email" value={siteContent.contact.email} onChange={e => handleSiteContentChange('contact', 'email', e.target.value)} className="w-full p-2 border rounded"/>
                        <input type="text" placeholder="URL Instagram" value={siteContent.contact.instagramUrl} onChange={e => handleSiteContentChange('contact', 'instagramUrl', e.target.value)} className="w-full p-2 border rounded"/>
                        <input type="text" placeholder="URL Facebook" value={siteContent.contact.facebookUrl} onChange={e => handleSiteContentChange('contact', 'facebookUrl', e.target.value)} className="w-full p-2 border rounded"/>
                        <input type="text" placeholder="Endereço" value={siteContent.location.address} onChange={e => handleSiteContentChange('location', 'address', e.target.value)} className="w-full p-2 border rounded"/>
                        <input type="text" placeholder="Horário" value={siteContent.location.hours} onChange={e => handleSiteContentChange('location', 'hours', e.target.value)} className="w-full p-2 border rounded"/>
                        <textarea placeholder="URL Google Maps Embed" value={siteContent.location.mapUrl} onChange={e => handleSiteContentChange('location', 'mapUrl', e.target.value)} className="w-full p-2 border rounded md:col-span-2" rows={3}/>
                    </div>
                </div>
                <button onClick={handleSaveSiteContent} disabled={isLoading} className="w-full bg-brand-accent text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition disabled:opacity-50">
                    {isLoading ? 'Salvando...' : 'Salvar Conteúdo Geral'}
                </button>
            </div>
        );
      case 'cardapio':
            return (
                <div className="space-y-8">
                    {/* Add/Edit Menu Item Form */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">{editingMenuItem ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
                        <form onSubmit={editingMenuItem ? handleUpdateMenuItem : handleAddMenuItem} className="space-y-4">
                            <input type="text" placeholder="Nome do Item" value={editingMenuItem ? editingMenuItem.name : newMenuItem.name} onChange={e => editingMenuItem ? setEditingMenuItem({...editingMenuItem, name: e.target.value}) : setNewMenuItem({...newMenuItem, name: e.target.value})} className="w-full p-2 border rounded" required />
                            <div className="relative">
                               <textarea placeholder="Descrição" value={editingMenuItem ? editingMenuItem.description : newMenuItem.description} onChange={e => editingMenuItem ? setEditingMenuItem({...editingMenuItem, description: e.target.value}) : setNewMenuItem({...newMenuItem, description: e.target.value})} className="w-full p-2 border rounded" rows={3} required/>
                               <button type="button" onClick={() => generateDescription(editingMenuItem ? editingMenuItem.name : newMenuItem.name)} disabled={isLoading} className="absolute bottom-2 right-2 text-xs bg-brand-brown text-white px-2 py-1 rounded-full flex items-center disabled:opacity-50">
                                   <i data-lucide="sparkles" className="w-3 h-3 mr-1"></i> Gerar com IA
                                </button>
                            </div>
                            <input type="number" step="0.01" placeholder="Preço" value={editingMenuItem ? editingMenuItem.price : newMenuItem.price} onChange={e => editingMenuItem ? setEditingMenuItem({...editingMenuItem, price: parseFloat(e.target.value)}) : setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})} className="w-full p-2 border rounded" required/>
                             <select value={editingMenuItem ? editingMenuItem.category : newMenuItem.category} onChange={e => editingMenuItem ? setEditingMenuItem({...editingMenuItem, category: e.target.value}) : setNewMenuItem({...newMenuItem, category: e.target.value})} className="w-full p-2 border rounded" required>
                                <option value="">Selecione a Categoria</option>
                                {menuCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Imagem do Item</label>
                                {editingMenuItem?.imageUrl && <img src={editingMenuItem.imageUrl} alt="preview" className="w-24 h-24 object-cover my-2 rounded"/>}
                                <input type="file" onChange={e => setMenuItemImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-opacity-90" required={!editingMenuItem}/>
                            </div>
                            <div className="flex space-x-2">
                               <button type="submit" disabled={isLoading} className="bg-brand-accent text-white py-2 px-4 rounded font-bold hover:bg-opacity-90 disabled:opacity-50">
                                   {isLoading ? 'Salvando...' : (editingMenuItem ? 'Atualizar Item' : 'Adicionar Item')}
                               </button>
                               {editingMenuItem && <button type="button" onClick={() => {setEditingMenuItem(null); setMenuItemImageFile(null);}} className="bg-gray-200 text-gray-800 py-2 px-4 rounded font-bold">Cancelar</button>}
                            </div>
                        </form>
                    </div>

                    {/* Menu Items List */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Itens do Cardápio</h3>
                        <div className="space-y-2">
                            {menuItems.map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-lg shadow flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover mr-4"/>
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => setEditingMenuItem(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><i data-lucide="pencil" className="w-4 h-4"></i></button>
                                        <button onClick={() => handleDeleteMenuItem(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><i data-lucide="trash-2" className="w-4 h-4"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
      case 'categorias':
        return (
            <div className="space-y-8">
                 {/* Add/Edit Category Form */}
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
                    <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="flex space-x-2">
                        <input type="text" placeholder="Nome da Categoria" value={editingCategory ? editingCategory.name : newCategoryName} onChange={e => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)} className="w-full p-2 border rounded" required />
                        <button type="submit" className="bg-brand-accent text-white py-2 px-4 rounded font-bold hover:bg-opacity-90">
                           {editingCategory ? 'Atualizar' : 'Adicionar'}
                        </button>
                        {editingCategory && <button type="button" onClick={() => setEditingCategory(null)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded font-bold">Cancelar</button>}
                    </form>
                </div>
                 {/* Category List */}
                 <div>
                    <h3 className="text-xl font-bold mb-4">Categorias Existentes</h3>
                    <div className="space-y-2">
                        {menuCategories.map(cat => (
                            <div key={cat.id} className="bg-white p-3 rounded-lg shadow flex items-center justify-between">
                                <p className="font-bold">{cat.name}</p>
                                <div className="flex space-x-2">
                                    <button onClick={() => setEditingCategory(cat)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><i data-lucide="pencil" className="w-4 h-4"></i></button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><i data-lucide="trash-2" className="w-4 h-4"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        );
      case 'galeria':
        return (
             <div className="space-y-8">
                {/* Add Photo Form */}
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Adicionar Foto à Galeria</h3>
                    <form onSubmit={handleAddPhoto} className="space-y-4">
                        <input type="text" placeholder="Descrição da foto (alt text)" value={newPhotoAlt} onChange={e => setNewPhotoAlt(e.target.value)} className="w-full p-2 border rounded" required />
                        <input type="file" onChange={e => setNewPhotoImageFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-opacity-90" required />
                        <button type="submit" disabled={isLoading} className="bg-brand-accent text-white py-2 px-4 rounded font-bold hover:bg-opacity-90 disabled:opacity-50">
                           {isLoading ? 'Enviando...' : 'Adicionar Foto'}
                        </button>
                    </form>
                 </div>
                 {/* Photo List */}
                 <div>
                    <h3 className="text-xl font-bold mb-4">Fotos da Galeria</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="relative group">
                                <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover rounded-lg aspect-square" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeletePhoto(photo)} className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700">
                                        <i data-lucide="trash-2" className="w-5 h-5"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
        );
      case 'reservas':
         return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reservas Recebidas</h2>
            <div className="bg-white shadow rounded-lg">
              <ul className="divide-y divide-gray-200">
                {reservations.length > 0 ? (
                  reservations.map(r => (
                    <li key={r.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                           <div>
                                <p className="font-semibold">{r.name} - {r.guests} pessoa(s)</p>
                                <p className="text-sm text-gray-600">Data: {new Date(r.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {r.time}</p>
                                <p className="text-sm text-gray-600">Contato: {r.email} {r.phone && `/ ${r.phone}`}</p>
                           </div>
                           <button onClick={() => deleteDoc(doc(db, 'reservations', r.id))} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"><i data-lucide="trash-2" className="w-4 h-4"></i></button>
                        </div>
                    </li>
                  ))
                ) : <p className="p-4 text-gray-500">Nenhuma reserva encontrada.</p>}
              </ul>
            </div>
          </div>
        );
      case 'contatos':
        return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Mensagens de Contato</h2>
              <div className="bg-white shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {contactSubmissions.length > 0 ? (
                    contactSubmissions.map(s => (
                        <li key={s.id} className="p-4 hover:bg-gray-50">
                             <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-baseline space-x-2">
                                       <p className="font-semibold">{s.name}</p>
                                       <a href={`mailto:${s.email}`} className="text-sm text-blue-600 hover:underline">{s.email}</a>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{s.message}</p>
                                </div>
                                <button onClick={() => deleteDoc(doc(db, 'contactSubmissions', s.id))} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"><i data-lucide="trash-2" className="w-4 h-4"></i></button>
                             </div>
                        </li>
                    ))
                    ) : <p className="p-4 text-gray-500">Nenhuma mensagem encontrada.</p>}
                </ul>
              </div>
            </div>
          );
      default:
        return <p>Selecione uma categoria para gerenciar.</p>;
    }
  };

  const TabButton = ({ tabName, label }: { tabName: string, label: string }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md flex justify-between items-center ${activeTab === tabName ? 'bg-brand-accent text-white' : 'text-gray-600 hover:bg-gray-200'}`}
    >
        <span>{label}</span>
    </button>
  );

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
                    <TabButton tabName="geral" label="Geral e Conteúdo" />
                    <TabButton tabName="cardapio" label="Cardápio" />
                    <TabButton tabName="categorias" label="Categorias" />
                    <TabButton tabName="galeria" label="Galeria de Fotos" />
                    <TabButton tabName="reservas" label="Reservas" />
                    <TabButton tabName="contatos" label="Contatos" />
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
