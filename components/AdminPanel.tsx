import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SiteContent, MenuItem, Photo } from '../types';
import { createIcons, icons } from 'lucide';

interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
  siteContent: SiteContent | null;
  menuItems: MenuItem[];
  photos: Photo[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setView, siteContent: initialContent, menuItems: initialMenuItems, photos: initialPhotos }) => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    createIcons({ icons });
  });

  const handleLogout = async () => {
    await signOut(auth);
    setView('user');
  };

  const handleContentChange = (section: keyof SiteContent, field: string, value: string) => {
    if (!siteContent) return;
    setSiteContent({
      ...siteContent,
      [section]: {
        ...siteContent[section as keyof SiteContent],
        [field]: value,
      },
    });
  };

  const saveContent = async () => {
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
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('general')} className={`${activeTab === 'general' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Geral</button>
              <button onClick={() => setActiveTab('menu')} className={`${activeTab === 'menu' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Cardápio</button>
              <button onClick={() => setActiveTab('gallery')} className={`${activeTab === 'gallery' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Galeria</button>
            </nav>
          </div>

          {activeTab === 'general' && siteContent && (
             <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Conteúdo Geral (Hero, Sobre, etc.)</h2>
                {/* Simplified form for demonstration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título do Hero</label>
                    <input value={siteContent.hero.title} onChange={e => handleContentChange('hero', 'title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Subtítulo do Hero</label>
                    <textarea value={siteContent.hero.subtitle} onChange={e => handleContentChange('hero', 'subtitle', e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Título da Seção Sobre</label>
                    <input value={siteContent.about.title} onChange={e => handleContentChange('about', 'title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Parágrafo da Seção Sobre</label>
                    <textarea value={siteContent.about.paragraph} onChange={e => handleContentChange('about', 'paragraph', e.target.value)} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
                </div>
                <div className="pt-4">
                  <button onClick={saveContent} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar Conteúdo Geral'}</button>
                </div>
             </div>
          )}

          {activeTab === 'menu' && (
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Itens do Cardápio</h2>
                <p className="text-gray-500 mb-4">Funcionalidade de edição do cardápio a ser implementada.</p>
                <button disabled={true} className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50">Salvar Cardápio</button>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Fotos da Galeria</h2>
                <p className="text-gray-500 mb-4">Funcionalidade de upload e edição da galeria a ser implementada.</p>
                <button disabled={true} className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50">Salvar Galeria</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
