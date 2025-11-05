import React, { useState } from 'react';
import { SiteContent, Reservation } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
        guests: '1',
        type: 'Refeição Casual',
        notes: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.guests) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await addDoc(collection(db, 'reservations'), {
                ...formData,
                guests: parseInt(formData.guests, 10),
                submittedAt: serverTimestamp(),
                status: 'Pendente',
            } as Omit<Reservation, 'id' | 'submittedAt'> & { submittedAt: any });
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Falha ao enviar reserva. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="reservas" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
                    <p className="mt-4 text-lg text-gray-600">{content.paragraph}</p>
                </div>

                <div className="mt-12 max-w-lg mx-auto">
                    <div className="bg-brand-cream p-8 rounded-lg shadow-lg">
                        {isSubmitted ? (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-brand-brown mb-2">Reserva Enviada!</h3>
                                <p className="text-gray-600">Sua solicitação de reserva foi enviada e está pendente de confirmação. Entraremos em contato em breve. Agradecemos a preferência!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                 <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone/Whatsapp</label>
                                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                                    <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Horário</label>
                                    <input type="time" name="time" id="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                 <div>
                                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Nº de Pessoas</label>
                                    <input type="number" name="guests" id="guests" min="1" max="20" value={formData.guests} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Reserva</label>
                                    <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent">
                                        <option>Refeição Casual</option>
                                        <option>Aniversário</option>
                                        <option>Reunião de Negócios</option>
                                        <option>Outro Evento</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observações (opcional)</label>
                                    <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" placeholder="Ex: Preferência por mesa na janela, alergias, etc." />
                                </div>
                                
                                {error && <p className="text-red-500 text-sm sm:col-span-2">{error}</p>}

                                <div className="sm:col-span-2">
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-300 disabled:opacity-50">
                                        {isSubmitting ? 'Enviando...' : 'Solicitar Reserva'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reservations;