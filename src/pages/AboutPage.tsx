import React from 'react';
import Reveal from '../components/Reveal';

const team = [
  {
    name: 'Marcus Sterling',
    role: 'Founder / CEO',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    bio: 'Former lead architect at Vespera Systems with 15 years in distributed infrastructure.',
  },
  {
    name: 'Elena Rossi',
    role: 'CTO / Infrastructure',
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    bio: 'Open-source pioneer and creator of the ForgeCore runtime engine.',
  },
  {
    name: 'Julian Chen',
    role: 'Head of Product',
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg',
    bio: 'Obsessed with developer experience and low-latency interaction models.',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Lead Designer',
    image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    bio: "Visual systems expert behind the 'Electric Architect' design language.",
  },
  {
    name: 'Viktor Drago',
    role: 'Developer Relations',
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg',
    bio: 'Advocate for sustainable coding practices and community-led growth.',
  },
  {
    name: 'Anya Sokolov',
    role: 'Operations',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    bio: 'Ensuring the forge runs smoothly from deployment to global scaling.',
  },
];

const values = [
  { icon: 'architecture', title: 'Precision Engineering', desc: "We don't settle for \"good enough.\" Every component is optimized for speed, reliability, and architectural integrity." },
  { icon: 'bolt', title: 'Electric Momentum', desc: 'Innovation requires energy. We maintain a relentless pace to ensure our tools evolve faster than the market demands.' },
  { icon: 'group_work', title: 'Radical Openness', desc: 'Built for the community, by the community. Transparency is our foundation and extensibility is our promise.' },
];

const stats = [
  { label: 'Active Users', value: '1.2M+' },
  { label: 'Deployments', value: '450K' },
  { label: 'Plugin Ecosystem', value: '12.5K' },
  { label: 'Uptime Status', value: '99.9%' },
];

const timeline = [
  { quarter: 'Q1 2024', title: 'The Spark', desc: 'APPFORGE concept born in a small studio in Zurich, focused on extreme-performance UI.', side: 'left' },
  { quarter: 'Q2 2024', title: 'Engine Alpha', desc: 'First deployment of the Electric Architect engine to 50 select design firms.', side: 'right' },
  { quarter: 'Q3 2024', title: 'Global Scale', desc: 'Launched v1.0 globally, hitting 1M active users in under 90 days.', side: 'left' },
  { quarter: 'FUTURE', title: 'The Nexus', desc: 'Integrating AI-driven predictive layouts and collaborative neural design.', side: 'right' },
];

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="h-0.5 w-10 bg-primary-fixed mb-6" />
            <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-none text-on-surface mb-8">
              Built for <br />
              <span className="bg-primary-fixed px-2 text-on-surface">Builders</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
              We are architects of the digital frontier, crafting high-energy tools for the next generation of software engineers.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="font-label text-sm uppercase tracking-widest text-outline mb-4">ESTABLISHED 2024</p>
            <p className="font-body text-on-surface italic">"The code is the blueprint; the execution is the structure."</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
        <div className="bg-surface-container-low grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-xl border border-outline-variant/10">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest p-8 flex flex-col gap-2">
              <span className="font-label text-xs uppercase text-outline">{s.label}</span>
              <span className="text-4xl font-black font-headline text-on-surface tracking-tighter">{s.value}</span>
              <div className="h-1 w-full bg-primary-fixed mt-2" />
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
        <h2 className="font-headline text-4xl font-black tracking-tighter mb-12 flex items-center gap-4">
          Our Core Philosophy <span className="h-px grow bg-outline-variant/20" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <Reveal key={v.title} className="bg-surface-container-lowest p-10 rounded-xl border border-outline-variant/10 hover:border-primary-fixed transition-all">
              <span className="material-symbols-outlined text-4xl mb-6 text-primary-fixed block" style={{ fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
              <h3 className="font-headline text-2xl font-bold mb-4">{v.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
          <h2 className="font-headline text-4xl font-black tracking-tighter">The Architect Collective</h2>
          <span className="font-label text-sm text-outline">6 FOUNDING PARTNERS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <Reveal key={member.name} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 group">
              <div className="h-64 bg-surface-container-high overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <p className="font-label text-[10px] uppercase text-primary tracking-widest mb-1">{member.role}</p>
                <h4 className="font-headline text-xl font-bold mb-2">{member.name}</h4>
                <p className="text-sm text-on-surface-variant">{member.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-[1440px] mx-auto px-6 mb-32">
        <h2 className="font-headline text-4xl font-black tracking-tighter mb-16 text-center">The Trajectory</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-outline-variant/30 top-0" />
          {timeline.map((item, i) => (
            <div key={i} className={`relative flex items-center justify-between ${i < timeline.length - 1 ? 'mb-24' : ''} w-full`}>
              {item.side === 'left' ? (
                <>
                  <div className="w-[45%] text-right pr-8">
                    <span className="font-label text-sm text-primary font-bold">{item.quarter}</span>
                    <h4 className="font-headline text-xl font-bold mt-2">{item.title}</h4>
                    <p className="text-sm text-on-surface-variant mt-2">{item.desc}</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-fixed border-4 border-surface ring-4 ring-primary-fixed/20 rounded-full z-10" />
                  <div className="w-[45%] pl-8" />
                </>
              ) : (
                <>
                  <div className="w-[45%]" />
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-fixed border-4 border-surface ring-4 ring-primary-fixed/20 rounded-full z-10" />
                  <div className="w-[45%] text-left pl-8">
                    <span className="font-label text-sm text-primary font-bold">{item.quarter}</span>
                    <h4 className="font-headline text-xl font-bold mt-2">{item.title}</h4>
                    <p className="text-sm text-on-surface-variant mt-2">{item.desc}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1440px] mx-auto px-6">
        <div className="bg-zinc-900 text-white rounded-2xl p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-fixed opacity-10 skew-x-12 translate-x-12" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
                Ready to enter <br />the forge?
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl">
                Join the thousands of architects building the next generation of digital infrastructure.
              </p>
            </div>
            <button className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-lg font-headline font-black text-lg tracking-tight hover:scale-105 duration-200 ease-in-out whitespace-nowrap shadow-[0_0_30px_rgba(191,255,90,0.3)]">
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
