import React from 'react';
import { SiteContent } from '../types';

interface AboutProps {
  content: SiteContent['about'];
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section id="sobre" className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-brand-accent font-semibold tracking-wide uppercase">Nossa História</h2>
          <p className="mt-2 text-3xl leading-8 font-serif font-bold tracking-tight text-brand-brown sm:text-4xl">
            {content.title}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-serif text-brand-brown font-semibold mb-4">Nosso Compromisso</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content.paragraph}
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img className="rounded-lg shadow-2xl w-full h-full object-cover aspect-video" src={content.imageUrl} alt="Interior do Flora Café" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
