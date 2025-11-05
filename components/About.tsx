
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-brand-accent font-semibold tracking-wide uppercase">Nossa História</h2>
          <p className="mt-2 text-3xl leading-8 font-serif font-bold tracking-tight text-brand-brown sm:text-4xl">
            Um Café Nascido da Paixão
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto">
            O Flora Café Eusébio nasceu do sonho de criar um refúgio acolhedor, onde o aroma do café fresco se mistura com a beleza da natureza.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-serif text-brand-brown font-semibold mb-4">Nosso Compromisso</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos ingredientes locais e de alta qualidade para criar pratos e bebidas que encantam o paladar. Nosso café é especialmente selecionado e torrado para garantir uma experiência única a cada xícara.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Mais do que uma cafeteria, somos um ponto de encontro para amigos, um espaço tranquilo para trabalhar e um lugar para celebrar os pequenos momentos da vida.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img className="rounded-lg shadow-2xl" src="/placeholder-about.jpg" alt="Interior do Flora Café" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
