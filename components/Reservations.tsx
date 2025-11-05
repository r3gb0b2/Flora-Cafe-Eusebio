import React, { useState } from 'react';
import { SiteContent } from '../types';

interface ReservationsProps {
  content: SiteContent['reservations'];
}

const Reservations: React.FC<ReservationsProps> = ({ content }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation
    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    console.log('Reserva enviada:', formData);
    // Here you would typically send data to a backend or Firebase
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="reservas" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">Obrigado!</h2>
            <p className="mt-4 text-lg text-gray-600">
                Sua solicitação de reserva para {formData.guests} pessoa(s) no dia {new Date(formData.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {formData.time} foi recebida. Entraremos em contato em breve para confirmar.
            </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reservas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
          <p className="mt-4 text-lg text-gray-600">{content.paragraph}</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Horário</label>
              <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Número de Pessoas</label>
              <input type="number" name="guests" id="guests" value={formData.guests} onChange={handleChange} min="1" max="10" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" />
            </div>
            {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
            <div className="md:col-span-2 text-center">
              <button type="submit" className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300">
                Solicitar Reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Reservations;
