
import React from 'react';

const SectionWrapper: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="py-16 md:py-24 bg-brand-cream">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-8">{title}</h2>
      {children}
    </div>
  </section>
);

const About: React.FC = () => (
  <SectionWrapper id="sobre" title="Nossa Paixão por Café">
    <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
      No Flora Café Eusébio, acreditamos que o café é mais do que uma bebida; é uma experiência. Desde 2015, nos dedicamos a selecionar os melhores grãos, torrá-los com perfeição e servir cada xícara com paixão. Nosso espaço foi projetado para ser um oásis urbano, um lugar para relaxar, trabalhar ou simplesmente desfrutar de um momento de tranquilidade.
    </p>
  </SectionWrapper>
);

export default About;