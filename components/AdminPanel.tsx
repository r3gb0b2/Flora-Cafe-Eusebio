
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// Fix: Initialize GoogleGenAI with apiKey from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AdminPanelProps {
  setView: (view: 'user' | 'admin') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setView }) => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDescription = async () => {
    if (!itemName) {
        setError('Por favor, insira o nome do item.');
        return;
    }
    setIsLoading(true);
    setError('');
    setItemDescription('');

    try {
        const prompt = `Crie uma descrição curta e apetitosa para um item de cardápio de cafeteria chamado "${itemName}". A descrição deve ter no máximo 20 palavras e destacar o sabor e a qualidade.`;
        
        // Fix: Use ai.models.generateContent according to guidelines
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        // Fix: Use response.text to get the text output
        const text = response.text;
        
        setItemDescription(text);

    } catch (e) {
        console.error(e);
        setError('Ocorreu um erro ao gerar a descrição. Tente novamente.');
    } finally {
        setIsLoading(false);
    }
  };


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
        <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                        <h2 className="text-2xl font-serif font-bold text-brand-brown mb-6">Gerador de Descrição de Cardápio com IA</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Nome do Item</label>
                                <input
                                    type="text"
                                    name="itemName"
                                    id="itemName"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="Ex: Cappuccino Cremoso"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
                                />
                            </div>

                            <button
                                onClick={generateDescription}
                                disabled={isLoading}
                                className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Gerando...
                                    </>
                                ) : 'Gerar Descrição'}
                            </button>

                            <div>
                                <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">Descrição Gerada</label>
                                <textarea
                                    id="itemDescription"
                                    name="itemDescription"
                                    rows={4}
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                    placeholder="A descrição gerada pela IA aparecerá aqui..."
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm bg-gray-50"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default AdminPanel;
