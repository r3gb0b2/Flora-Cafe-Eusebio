import React from 'react';
import { SiteContent } from '../types';

interface ObservationsProps {
  content: SiteContent['observations'];
}

const Observations: React.FC<ObservationsProps> = ({ content }) => {
  if (!content || !content.lines || content.lines.length === 0) {
    return null;
  }

  return (
    <section id="observacoes" className="py-20 bg-brand-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t-2 border-brand-secondary pt-12">
        <h2 className="text-3xl font-serif font-bold text-brand-brown mb-6">{content.title}</h2>
        <div className="space-y-3 text-gray-600">
          {content.lines.map((line, index) => (
            <p key={index} className="text-sm tracking-wider">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Observations;
