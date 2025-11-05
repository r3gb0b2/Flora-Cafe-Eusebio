
import React, { useState } from 'react';
import { Photo } from '../types';

interface AdminPanelProps {
  photos: Photo[];
  addPhoto: (src: string, alt: string) => void;
  deletePhoto: (id: number) => void;
  setView: (view: 'user' | 'admin') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ photos, addPhoto, deletePhoto, setView }) => {
  const [newPhotoAlt, setNewPhotoAlt] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          addPhoto(reader.result, newPhotoAlt || 'Nova foto da cafeteria');
          setNewPhotoAlt('');
          e.target.value = ''; // Reset file input
          setSuccess('Foto adicionada com sucesso!');
          setError('');
          setTimeout(() => setSuccess(''), 3000);
        }
      };
      reader.onerror = () => {
        setError('Ocorreu um erro ao ler o arquivo.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-brand-brown font-serif">Painel Administrativo - Galeria de Fotos</h1>
          <button
            onClick={() => setView('user')}
            className="bg-brand-accent hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center"
          >
            <i data-lucide="arrow-left" className="w-4 h-4 mr-2"></i>
            Voltar ao Site
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-6">
          <p>
            <strong>Atenção:</strong> As fotos são salvas apenas nesta sessão do navegador. Atualizar a página irá remover as imagens adicionadas.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-brand-brown">Adicionar Nova Foto</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{success}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="photoAlt" className="block text-sm font-medium text-gray-700">Descrição da Foto (Alt Text)</label>
              <input
                type="text"
                id="photoAlt"
                value={newPhotoAlt}
                onChange={(e) => setNewPhotoAlt(e.target.value)}
                placeholder="Ex: Mesa aconchegante perto da janela"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="photoFile" className="block text-sm font-medium text-gray-700">Arquivo da Imagem</label>
              <input
                type="file"
                id="photoFile"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-opacity-90"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-brand-brown">Fotos Atuais</h2>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <img src={photo.src} alt={photo.alt} className="w-full h-40 object-cover rounded-md shadow-md" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-opacity duration-300"
                      title="Deletar foto"
                    >
                      <i data-lucide="trash-2" className="w-5 h-5"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhuma foto na galeria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
