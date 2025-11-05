import React, { useState } from 'react';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { SiteContent, MenuItem, Photo, MenuCategory } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
  siteContent: SiteContent | null;
  menuItems: MenuItem[];
  photos: Photo[];
  menuCategories: MenuCategory[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setView, siteContent: initialContent, menuItems, photos, menuCategories }) => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // State for new menu item
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '0', category: '' });
  const [newItemImage, setNewItemImage] = useState<File | null>(null);

  // State for new gallery photo
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newPhotoAlt, setNewPhotoAlt] = useState('');
  
  // State for menu categories
  const [newCategory, setNewCategory] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    setView('user');
  };

  const handleContentChange = (section: keyof SiteContent, field: string, value: any) => {
    if (!siteContent) return;
    setSiteContent({
      ...siteContent,
      [section]: {
        ...siteContent[section as keyof SiteContent],
        [field]: value,
      },
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return null;
    const storagePath = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return { downloadUrl, storagePath };
  };

  const saveGeneralContent = async () => {
    if (!siteContent) return;
    setIsSaving(true);
    try {
      const contentRef = doc(db, 'siteContent', 'main');
      await setDoc(contentRef, siteContent, { merge: true });
      alert('Conteúdo salvo com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
      alert('Falha ao salvar conteúdo.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- MENU CRUD ---
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category) {
      alert("Nome e categoria são obrigatórios.");
      return;
    }
    setIsSaving(true);
    try {
      let imageUrl, storagePath;
      if (newItemImage) {
        const uploadResult = await handleFileUpload(newItemImage);
        if (uploadResult) {
            imageUrl = uploadResult.downloadUrl;
            storagePath = uploadResult.storagePath;
        }
      }
      await addDoc(collection(db, 'menuItems'), {
        ...newItem,
        price: parseFloat(newItem.price),
        imageUrl: imageUrl || '',
        storagePath: storagePath || '',
      });
      setNewItem({ name: '', description: '', price: '0', category: '' });
      setNewItemImage(null);
      alert('Item do cardápio adicionado!');
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert('Falha ao adicionar item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    if (!window.confirm(`Tem certeza que deseja apagar "${item.name}"?`)) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'menuItems', item.id));
      if (item.storagePath) {
        await deleteObject(ref(storage, item.storagePath));
      }
      alert('Item apagado com sucesso.');
    } catch (error) {
      console.error("Erro ao apagar item:", error);
      alert('Falha ao apagar item.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- GALLERY CRUD ---
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto) {
      alert("Por favor, selecione uma imagem.");
      return;
    }
    setIsSaving(true);
    try {
      const uploadResult = await handleFileUpload(newPhoto);
      if(uploadResult) {
        await addDoc(collection(db, 'photos'), {
          url: uploadResult.downloadUrl,
          storagePath: uploadResult.storagePath,
          alt: newPhotoAlt || 'Foto do Flora Café',
        });
        setNewPhoto(null);
        setNewPhotoAlt('');
        alert('Foto adicionada à galeria!');
      }
    } catch (error) {
        console.error("Erro ao adicionar foto:", error);
        alert('Falha ao adicionar foto.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!window.confirm(`Tem certeza que deseja apagar esta foto?`)) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'photos', photo.id));
      if (photo.storagePath) {
        await deleteObject(ref(storage, photo.storagePath));
      }
      alert('Foto apagada com sucesso.');
    } catch (error) {
      console.error("Erro ao apagar foto:", error);
      alert('Falha ao apagar foto.');
    } finally {
      setIsSaving(false);
    }
  };
  
    // --- CATEGORY CRUD ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setIsSaving(true);
    try {
        await addDoc(collection(db, 'menuCategories'), { name: newCategory.trim() });
        setNewCategory('');
        alert('Categoria adicionada!');
    } catch (error) {
        alert('Erro ao adicionar categoria.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
      if (!window.confirm("Tem certeza? Apagar uma categoria não apaga os itens dentro dela. Eles ficarão sem categoria.")) return;
      setIsSaving(true);
      try {
          await deleteDoc(doc(db, 'menuCategories', categoryId));
          alert('Categoria apagada.');
      } catch (error) {
          alert('Erro ao apagar categoria.');
      } finally {
          setIsSaving(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <div>
            <button onClick={() => setView('user')} className="text-blue-600 hover:underline mr-4">Ver Site</button>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Sair</button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              <button onClick={() => setActiveTab('general')} className={`${activeTab === 'general' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Geral</button>
              <button onClick={() => setActiveTab('menu')} className={`${activeTab === 'menu' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Cardápio</button>
              <button onClick={() => setActiveTab('categories')} className={`${activeTab === 'categories' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Categorias</button>
              <button onClick={() => setActiveTab('gallery')} className={`${activeTab === 'gallery' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Galeria</button>
            </nav>
          </div>

          {activeTab === 'general' && siteContent && (
             <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Conteúdo Geral</h2>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Título Principal (Hero)</label>
                    <input value={siteContent.hero.title} onChange={e => handleContentChange('hero', 'title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Subtítulo (Hero)</label>
                    <textarea value={siteContent.hero.subtitle} onChange={e => handleContentChange('hero', 'subtitle', e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="pt-4">
                  <button onClick={saveGeneralContent} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar Conteúdo Geral'}</button>
                </div>
             </div>
          )}

          {activeTab === 'menu' && (
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Gerenciar Cardápio</h2>
                <form onSubmit={handleAddMenuItem} className="mb-8 p-4 border rounded-lg space-y-4">
                  <h3 className="text-lg font-medium">Adicionar Novo Item</h3>
                  <input placeholder="Nome do prato" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm" required />
                  <textarea placeholder="Descrição" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm" />
                  <input type="number" step="0.01" placeholder="Preço" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm" required />
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm" required>
                    <option value="">Selecione uma Categoria</option>
                    {menuCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Imagem do Item</label>
                      <input type="file" accept="image/*" onChange={e => setNewItemImage(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-brand-accent hover:file:bg-violet-100"/>
                  </div>
                  <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">{isSaving ? 'Adicionando...' : 'Adicionar Item'}</button>
                </form>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Itens Existentes</h3>
                  {menuItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded-md">
                      <span>{item.name} - R${item.price} ({item.category})</span>
                      <button onClick={() => handleDeleteMenuItem(item)} disabled={isSaving} className="text-red-500 hover:text-red-700 disabled:opacity-50">Apagar</button>
                    </div>
                  ))}
                </div>
            </div>
          )}

           {activeTab === 'categories' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Gerenciar Categorias do Cardápio</h2>
              <form onSubmit={handleAddCategory} className="mb-8 p-4 border rounded-lg flex items-center gap-4">
                  <input placeholder="Nova Categoria" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" required />
                  <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">Adicionar</button>
              </form>
              <div className="space-y-2">
                  {menuCategories.map(cat => (
                      <div key={cat.id} className="flex justify-between items-center p-2 border rounded-md">
                          <span>{cat.name}</span>
                          <button onClick={() => handleDeleteCategory(cat.id)} disabled={isSaving} className="text-red-500 hover:text-red-700 disabled:opacity-50">Apagar</button>
                      </div>
                  ))}
              </div>
            </div>
           )}

          {activeTab === 'gallery' && (
             <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Gerenciar Galeria</h2>
                 <form onSubmit={handleAddPhoto} className="mb-8 p-4 border rounded-lg space-y-4">
                     <h3 className="text-lg font-medium">Adicionar Nova Foto</h3>
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Arquivo de Imagem</label>
                         <input type="file" accept="image/*" onChange={e => setNewPhoto(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-brand-accent hover:file:bg-violet-100" required/>
                     </div>
                     <input placeholder="Descrição da imagem (alt text)" value={newPhotoAlt} onChange={e => setNewPhotoAlt(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                     <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50">{isSaving ? 'Enviando...' : 'Adicionar Foto'}</button>
                 </form>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                     {photos.map(photo => (
                         <div key={photo.id} className="relative group">
                             <img src={photo.url} alt={photo.alt} className="w-full h-40 object-cover rounded-md" />
                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleDeletePhoto(photo)} disabled={isSaving} className="text-white bg-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-700 disabled:opacity-50">Apagar</button>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
