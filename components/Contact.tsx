
import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Mensagem de contato:', formData);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <section id="contato" className="py-20 bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">Mensagem Enviada!</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Obrigado por entrar em contato, {formData.name}. Responderemos em breve!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="contato" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">Fale Conosco</h2>
                    <p className="mt-4 text-lg text-gray-600">Tem alguma dúvida ou sugestão? Nos envie uma mensagem.</p>
                </div>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                            <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm" required></textarea>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="w-full bg-brand-accent hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300">
                                Enviar Mensagem
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
