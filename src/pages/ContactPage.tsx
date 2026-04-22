import React, { useState } from 'react';
import ContactForm from '../components/ContactForm';

const faqs = [
  { q: 'What is the typical deployment timeline?', a: '' },
  { q: 'Do you offer custom enterprise integrations?', a: 'Yes, our platform is designed to be highly extensible. Our team provides specialized engineering support for legacy system bridges and custom API development for teams over 50 seats.' },
  { q: 'Is there a dedicated support channel?', a: '' },
  { q: 'How secure is the asset storage?', a: '' },
];

const ContactPage = () => {
  const [openIndex, setOpenIndex] = useState(1);

  return (
    <div className="pt-32 pb-24 max-w-[1440px] mx-auto px-6">
      {/* Contact Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-32">
        {/* Left */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-8">
            <span className="font-label text-sm text-primary font-bold bg-primary-container px-3 py-1 rounded-full mb-6 inline-block">
              CONTACT US
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-none text-on-surface mb-6">
              LET'S BUILD <br />THE <span className="bg-primary-fixed px-2">FUTURE.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
              Have a complex architectural challenge? Our engineering team is standing by to help you forge your next breakthrough.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex items-center gap-6 group hover:border-primary-fixed transition-all duration-300">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-1">Direct Email</p>
                <p className="text-xl font-headline font-bold">forge@appforge.dev</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 flex items-center gap-6 group hover:border-primary-fixed transition-all duration-300">
              <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center text-primary group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <div>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest mb-1">Community Hub</p>
                <p className="text-xl font-headline font-bold">discord.gg/appforge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_20px_40px_rgba(45,47,44,0.05)] border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-fixed" />
            <ContactForm />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-4 text-on-surface">FREQUENTLY ASKED</h2>
          <div className="w-16 h-1 bg-primary-fixed mx-auto" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="group">
              {openIndex === i && faq.a ? (
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary-fixed flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary-fixed shadow-[0_0_8px_#bfff5a]" />
                      <h3 className="font-headline font-bold text-lg">{faq.q}</h3>
                    </div>
                    <button onClick={() => setOpenIndex(-1)}>
                      <span className="material-symbols-outlined text-primary rotate-45">add</span>
                    </button>
                  </div>
                  <div className="pl-6 border-l-2 border-primary-fixed/20">
                    <p className="text-on-surface-variant leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-surface-container-low p-6 rounded-xl flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors"
                  onClick={() => setOpenIndex(i)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary-fixed shadow-[0_0_8px_#bfff5a]" />
                    <h3 className="font-headline font-bold text-lg">{faq.q}</h3>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:rotate-45 transition-transform">add</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
