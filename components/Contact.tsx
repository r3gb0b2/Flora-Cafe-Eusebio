
import React from 'react';

const Contact: React.FC = () => (
  <section id="contato" className="py-16 md:py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-8">Entre em Contato</h2>
      <p className="text-lg text-gray-600 mb-8">Tem alguma dúvida? Adoraríamos ouvir você!</p>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
        <a href="tel:+5511999998888" className="text-lg text-brand-brown hover:text-brand-accent transition-colors duration-300 flex items-center">
          <i data-lucide="phone" className="w-5 h-5 mr-3"></i>
          (11) 99999-8888
        </a>
        <a href="mailto:contato@floracafeeusebio.com" className="text-lg text-brand-brown hover:text-brand-accent transition-colors duration-300 flex items-center">
          <i data-lucide="mail" className="w-5 h-5 mr-3"></i>
          contato@floracafeeusebio.com
        </a>
      </div>
      <div className="flex justify-center space-x-6 mt-10">
        <a href="#" className="text-brand-brown hover:text-brand-accent transition-colors duration-300"><i data-lucide="instagram" className="w-7 h-7"></i></a>
        <a href="#" className="text-brand-brown hover:text-brand-accent transition-colors duration-300"><i data-lucide="facebook" className="w-7 h-7"></i></a>
        <a href="#" className="text-brand-brown hover:text-brand-accent transition-colors duration-300"><i data-lucide="twitter" className="w-7 h-7"></i></a>
      </div>
    </div>
  </section>
);

export default Contact;