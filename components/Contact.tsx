import React, { useState } from 'react';
import { SiteContent } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ContactProps {
  content: SiteContent['contact'];
}

const Contact: React.FC<ContactProps> = ({ content }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await addDoc(collection(db, 'contactSubmissions'), {
                ...formData,
                submittedAt: serverTimestamp(),
            });
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Falha ao enviar mensagem. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contato" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
                    <p className="mt-4 text-lg text-gray-600">{content.paragraph}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <i data-lucide="phone" className="w-10 h-10 text-brand-accent mx-auto mb-3"></i>
                            <h3 className="text-lg font-semibold text-brand-brown">Telefone</h3>
                            <a href={`tel:${content.phone}`} className="text-gray-600 hover:text-brand-accent">{content.phone}</a>
                        </div>
                        <div className="text-center">
                            <i data-lucide="mail" className="w-10 h-10 text-brand-accent mx-auto mb-3"></i>
                            <h3 className="text-lg font-semibold text-brand-brown">Email</h3>
                            <a href={`mailto:${content.email}`} className="text-gray-600 hover:text-brand-accent">{content.email}</a>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-serif font-semibold text-brand-brown mb-4">Siga-nos</h3>
                            <div className="flex justify-center space-x-4">
                                <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-accent">
                                    <i data-lucide="instagram" className="w-8 h-8"></i>
                                </a>
                                <a href={content.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-accent">
                                    <i data-lucide="facebook" className="w-8 h-8"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        {isSubmitted ? (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-brand-brown mb-2">Mensagem Enviada!</h3>
                                <p className="text-gray-600">Obrigado por entrar em contato. Responderemos em breve.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Seu Nome</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Seu Email</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Sua Mensagem</label>
                                    <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent" required />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-300 disabled:opacity-50">
                                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;