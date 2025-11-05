
import React, { useState } from 'react';

const Reservations: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '', guests: '1' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle form submission to a backend
    console.log('Reservation submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', date: '', time: '', guests: '1' });
    setTimeout(() => setSubmitted(false), 5000); // Reset message after 5 seconds
  };

  return (
    <section id="reservas" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-brown mb-8">Faça sua Reserva</h2>
        <p className="text-center text-gray-600 mb-8">Garanta seu lugar em nosso refúgio. Preencha o formulário abaixo.</p>
        
        {submitted ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center" role="alert">
            <strong className="font-bold">Reserva enviada!</strong>
            <span className="block sm:inline"> Agradecemos o seu contato. Entraremos em contato para confirmar.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                <input type="date" name="date" id="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Hora</label>
                <input type="time" name="time" id="time" required value={formData.time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"/>
              </div>
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Número de Pessoas</label>
              <select id="guests" name="guests" value={formData.guests} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} pessoa{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
                Enviar Reserva
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Reservations;
