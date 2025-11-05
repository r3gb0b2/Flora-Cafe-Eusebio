import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { doc, setDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { SiteContent, MenuItem, Photo } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
  siteContent: SiteContent | null;
  menuItems: MenuItem[];
  photos: Photo[];
}

type AdminTab = 'general' | 'hero' | 'about' | 'menu' | 'gallery';

const AdminPanel: React.FC<AdminPanelProps> = ({ setView, siteContent: initialContent, menuItems, photos }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [content, setContent] = useState<SiteContent | null>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (section: keyof SiteContent, field: any, value: any) => {
    setContent(prev => {
      if (!prev) return null;
      const newContent = { ...prev };
      (newContent[section] as any)[field] = value;
      return newContent;
    });
  };

  const handleSave = async (section: keyof SiteContent) => {
    if (!content) return;
    setIsSaving(true);
    try {
      const contentRef = doc(db, "siteContent", "main");
      await setDoc(contentRef, { [section]: content[section] }, { merge: true });
      alert(`${section} salvo com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Falha ao salvar. Verifique o console para mais detalhes.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'general': return <GeneralSettings content={content} onChange={handleContentChange} onSave={() => handleSave('contact')} isSaving={isSaving} />;
      case 'hero': return <HeroSettings content={content} onChange={handleContentChange} onSave={() => handleSave('hero')} isSaving={isSaving} />;
      case 'about': return <AboutSettings content={content} onChange={handleContentChange} onSave={() => handleSave('about')} isSaving={isSaving} />;
      case 'menu': return <MenuSettings menuItems={menuItems} />;
      case 'gallery': return <GallerySettings photos={photos} />;
      default: return null;
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
        <header className="bg-brand-brown shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
                <button
                    onClick={() => setView('user')}
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
                >
                    Voltar ao Site
                </button>
            </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex space-x-4 border-b mb-6">
                <TabButton name="general" label="Geral" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="hero" label="Página Inicial" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="about" label="Sobre" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="menu" label="Cardápio" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="gallery" label="Galeria" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div>
              {renderTabContent()}
            </div>
        </main>
    </div>
  );
};

const TabButton: React.FC<{name: AdminTab, label: string, activeTab: AdminTab, setActiveTab: (tab: AdminTab) => void}> = ({name, label, activeTab, setActiveTab}) => (
  <button onClick={() => setActiveTab(name)} className={`py-2 px-4 text-sm font-medium ${activeTab === name ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-gray-500 hover:text-gray-700'}`}>
    {label}
  </button>
);

const GeneralSettings: React.FC<{content: SiteContent | null, onChange: Function, onSave: Function, isSaving: boolean}> = ({ content, onChange, onSave, isSaving }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informações Gerais e Contato</h3>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <InputField label="Telefone" value={content?.contact.phone} onChange={e => onChange('contact', 'phone', e.target.value)} />
      <InputField label="Email" value={content?.contact.email} onChange={e => onChange('contact', 'email', e.target.value)} />
      <InputField label="Endereço" value={content?.location.address} onChange={e => onChange('location', 'address', e.target.value)} />
      <InputField label="Horários" value={content?.location.hours} onChange={e => onChange('location', 'hours', e.target.value)} />
      <InputField label="URL Instagram" value={content?.contact.instagramUrl} onChange={e => onChange('contact', 'instagramUrl', e.target.value)} />
      <InputField label="URL Facebook" value={content?.contact.facebookUrl} onChange={e => onChange('contact', 'facebookUrl', e.target.value)} />
      <div className="sm:col-span-2">
        <InputField label="URL do Iframe Google Maps" value={content?.location.mapUrl} onChange={e => onChange('location', 'mapUrl', e.target.value)} />
      </div>
    </div>
    <SaveButton onSave={onSave} isSaving={isSaving} />
  </div>
);

const HeroSettings: React.FC<{content: SiteContent | null, onChange: Function, onSave: Function, isSaving: boolean}> = ({ content, onChange, onSave, isSaving }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Seção Inicial (Hero)</h3>
    <div className="space-y-4">
      <InputField label="Título Principal" value={content?.hero.title} onChange={e => onChange('hero', 'title', e.target.value)} />
      <InputField label="Subtítulo" value={content?.hero.subtitle} onChange={e => onChange('hero', 'subtitle', e.target.value)} />
      <InputField label="URL da Imagem de Fundo" value={content?.hero.imageUrl} onChange={e => onChange('hero', 'imageUrl', e.target.value)} />
    </div>
    <SaveButton onSave={onSave} isSaving={isSaving} />
  </div>
);

const AboutSettings: React.FC<{content: SiteContent | null, onChange: Function, onSave: Function, isSaving: boolean}> = ({ content, onChange, onSave, isSaving }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Seção Sobre</h3>
     <div className="space-y-4">
      <InputField label="Título" value={content?.about.title} onChange={e => onChange('about', 'title', e.target.value)} />
      <label className="block text-sm font-medium text-gray-700">Parágrafo</label>
      <textarea value={content?.about.paragraph} onChange={e => onChange('about', 'paragraph', e.target.value)} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
    </div>
    <SaveButton onSave={onSave} isSaving={isSaving} />
  </div>
);

const MenuSettings: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  
  const handleNew = () => {
    setCurrentItem({});
    setIsModalOpen(true);
  }

  const handleSaveItem = async () => {
    if (!currentItem || !currentItem.name || !currentItem.category) return;
    try {
      if (currentItem.id) {
        // Update
        const itemRef = doc(db, 'menuItems', currentItem.id);
        await setDoc(itemRef, currentItem, { merge: true });
      } else {
        // Create
        await addDoc(collection(db, 'menuItems'), currentItem);
      }
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (e) { console.error(e); alert("Erro ao salvar item.")}
  }
  
  const handleDeleteItem = async (id: string) => {
    if(window.confirm("Tem certeza que deseja apagar este item?")) {
        try {
            await deleteDoc(doc(db, 'menuItems', id));
        } catch (e) { console.error(e); alert("Erro ao apagar item.")}
    }
  }

  const generateDescription = async () => {
    if (!process.env.API_KEY) {
        alert("A chave da API do Google GenAI não foi configurada. Esta funcionalidade está desabilitada.");
        return;
    }
    if (!currentItem?.name) {
        alert('Por favor, insira o nome do item.');
        return;
    }
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Crie uma descrição curta e apetitosa para um item de cardápio de cafeteria chamado "${currentItem.name}". A descrição deve ter no máximo 20 palavras e destacar o sabor e a qualidade.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setCurrentItem(prev => ({...prev, description: response.text}));
    } catch (e) {
        console.error(e);
        alert('Ocorreu um erro ao gerar a descrição.');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Itens do Cardápio</h3>
        <button onClick={handleNew} className="bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90">Adicionar Item</button>
      </div>
      <div className="space-y-2">
        {menuItems.map(item => (
          <div key={item.id} className="flex justify-between items-center p-2 border rounded">
            <div>
              <p className="font-semibold">{item.name} - <span className="font-normal">R${Number(item.price).toFixed(2)}</span></p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">Editar</button>
              <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-800">Apagar</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">{currentItem.id ? 'Editar' : 'Novo'} Item</h4>
            <div className="space-y-4">
              <InputField label="Nome" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea value={currentItem.description} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                 <button onClick={generateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 text-xs bg-brand-accent text-white px-2 py-1 rounded hover:bg-opacity-80 disabled:bg-gray-400">
                    {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                 </button>
              </div>
              <InputField label="Preço" type="number" value={currentItem.price} onChange={e => setCurrentItem({...currentItem, price: Number(e.target.value)})} />
              <InputField label="URL da Imagem" value={currentItem.imageUrl} onChange={e => setCurrentItem({...currentItem, imageUrl: e.target.value})} />
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select value={currentItem.category} onChange={e => setCurrentItem({...currentItem, category: e.target.value as any})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>Cafés</option>
                  <option>Salgados</option>
                  <option>Doces</option>
                  <option>Bebidas</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium">Cancelar</button>
              <button onClick={handleSaveItem} className="bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GallerySettings: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !altText) {
      alert("Por favor, selecione um arquivo e adicione um texto alternativo.");
      return;
    }
    setIsUploading(true);
    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      await addDoc(collection(db, 'photos'), { url, alt: altText });
      setFile(null);
      setAltText('');
    } catch(e) { console.error(e); alert("Erro no upload.")}
    finally { setIsUploading(false); }
  }

  const handleDelete = async (photo: Photo) => {
    if (window.confirm("Tem certeza que deseja apagar esta foto?")) {
      try {
        const imageRef = ref(storage, photo.url);
        await deleteObject(imageRef);
        await deleteDoc(doc(db, 'photos', photo.id));
      } catch(e) { console.error(e); alert("Erro ao apagar a foto.")}
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Gerenciar Galeria</h3>
      <div className="border p-4 rounded-md space-y-4">
        <h4 className="font-semibold">Adicionar Nova Foto</h4>
        <InputField label="Texto Alternativo (descrição)" value={altText} onChange={e => setAltText(e.target.value)} />
        <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-opacity-90"/>
        <button onClick={handleUpload} disabled={isUploading} className="bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 disabled:bg-gray-400">
          {isUploading ? 'Enviando...' : 'Enviar Foto'}
        </button>
      </div>
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Fotos Atuais</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative">
              <img src={photo.url} alt={photo.alt} className="w-full h-32 object-cover rounded"/>
              <button onClick={() => handleDelete(photo)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 leading-none">
                <i data-lucide="x" className="w-4 h-4"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{label: string, value: any, onChange: any, type?: string}> = ({label, value, onChange, type="text"}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} value={value || ''} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"/>
  </div>
);

const SaveButton: React.FC<{onSave: any, isSaving: boolean}> = ({onSave, isSaving}) => (
    <div className="pt-5">
        <div className="flex justify-end">
            <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-accent hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400"
            >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
    </div>
);

export default AdminPanel;