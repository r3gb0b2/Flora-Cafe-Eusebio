import React from 'react';
import { SiteContent } from '../types';

interface ContactProps {
  content: SiteContent['contact'];
}

const Contact: React.FC<ContactProps> = ({ content }) => {
    return (
        <section id="contato" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-brand-brown sm:text-4xl">{content.title}</h2>
                    <p className="mt-4 text-lg text-gray-600">{content.paragraph}</p>
                </div>
                <div className="max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <i data-lucide="phone" className="w-10 h-10 text-brand-accent mx-auto mb-3"></i>
                        <h3 className="text-lg font-semibold text-brand-brown">Telefone</h3>
                        <a href={`tel:${content.phone}`} className="text-gray-600 hover:text-brand-accent">{content.phone}</a>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <i data-lucide="mail" className="w-10 h-10 text-brand-accent mx-auto mb-3"></i>
                        <h3 className="text-lg font-semibold text-brand-brown">Email</h3>
                        <a href={`mailto:${content.email}`} className="text-gray-600 hover:text-brand-accent">{content.email}</a>
                    </div>
                </div>
                <div className="text-center mt-8">
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
        </section>
    );
};

export default Contact;
