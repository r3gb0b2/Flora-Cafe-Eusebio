import React from 'react';

const FirebaseNotConfigured: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl text-center">
        <i data-lucide="alert-triangle" className="w-16 h-16 text-yellow-500 mx-auto mb-4"></i>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuração do Firebase Incompleta</h1>
        <p className="text-gray-600 mb-6">
          Parece que a aplicação ainda não foi conectada a um projeto Firebase. Para que o site funcione
          corretamente, você precisa configurar suas credenciais.
        </p>
        <div className="text-left bg-gray-50 p-4 rounded-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Passos para a Configuração:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Vá até o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Console do Firebase</a> e crie um novo projeto (ou use um existente).</li>
                <li>Nas configurações do projeto, adicione um novo aplicativo Web.</li>
                <li>O Firebase fornecerá um objeto de configuração `firebaseConfig`. Copie este objeto.</li>
                <li>Abra o arquivo <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">firebase.ts</code> no seu projeto.</li>
                <li>Cole o objeto que você copiou, substituindo as chaves de exemplo (YOUR_API_KEY, etc.).</li>
                <li>Salve o arquivo e atualize esta página.</li>
            </ol>
        </div>
      </div>
    </div>
  );
};

export default FirebaseNotConfigured;
