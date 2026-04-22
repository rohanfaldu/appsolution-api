import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  LayoutGrid,
  LucideIcon,
  Search,
  ShoppingBag,
  Sparkles,
  TabletSmartphone,
  Truck,
  Users,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { STATIC_PRODUCTS } from '../data/staticProducts';

type PlatformFilter = 'all' | 'ios' | 'flutter' | 'android';
type SortFilter = 'bestseller' | 'top-selling' | 'new' | 'recommended' | 'sale';

const heroPreviewProducts = [...STATIC_PRODUCTS].sort((a, b) => b.sales - a.sales).slice(0, 2);

const heroParticles = [
  { left: '10%', top: '18%', size: '0.45rem', delay: '0s', duration: '11s' },
  { left: '18%', top: '62%', size: '0.35rem', delay: '0.7s', duration: '13s' },
  { left: '28%', top: '30%', size: '0.5rem', delay: '1.2s', duration: '12s' },
  { left: '46%', top: '14%', size: '0.3rem', delay: '0.3s', duration: '10s' },
  { left: '54%', top: '68%', size: '0.42rem', delay: '1.6s', duration: '14s' },
  { left: '66%', top: '24%', size: '0.36rem', delay: '0.9s', duration: '12s' },
  { left: '74%', top: '58%', size: '0.48rem', delay: '0.4s', duration: '15s' },
  { left: '84%', top: '20%', size: '0.32rem', delay: '1.4s', duration: '11s' },
  { left: '88%', top: '48%', size: '0.44rem', delay: '2s', duration: '13s' },
  { left: '16%', top: '40%', size: '0.28rem', delay: '1.1s', duration: '9s' },
];

const platformFilters: Array<{ label: string; value: PlatformFilter }> = [
  { label: 'All Platforms', value: 'all' },
  { label: 'iOS', value: 'ios' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Android', value: 'android' },
];

const sortFilters: Array<{ label: string; value: SortFilter }> = [
  { label: 'Bestseller', value: 'bestseller' },
  { label: 'Top Selling', value: 'top-selling' },
  { label: 'New', value: 'new' },
  { label: 'Recommended', value: 'recommended' },
  { label: 'Sale', value: 'sale' },
];

const categoryCards: Array<{ label: string; icon: LucideIcon; accent: string; description: string }> = [
  {
    label: 'E-Commerce',
    icon: ShoppingBag,
    accent: 'from-cyan-400/20 to-cyan-400/5',
    description: 'Launch ready storefronts',
  },
  {
    label: 'Delivery',
    icon: Truck,
    accent: 'from-violet-400/20 to-violet-400/5',
    description: 'Logistics and tracking flows',
  },
  {
    label: 'Health',
    icon: TabletSmartphone,
    accent: 'from-emerald-400/20 to-emerald-400/5',
    description: 'Wellness and habit apps',
  },
  {
    label: 'Education',
    icon: GraduationCap,
    accent: 'from-amber-400/20 to-amber-400/5',
    description: 'Learning marketplaces',
  },
  {
    label: 'Social',
    icon: Users,
    accent: 'from-pink-400/20 to-pink-400/5',
    description: 'Community products',
  },
  {
    label: 'SaaS',
    icon: LayoutGrid,
    accent: 'from-slate-300/20 to-slate-300/5',
    description: 'Dashboards and admin tools',
  },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [sortFilter, setSortFilter] = useState<SortFilter>('bestseller');

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const matchesPlatform = (technologies: string[]) => {
      if (platformFilter === 'all') return true;

      const normalized = technologies.map((tech) => tech.toLowerCase());
      if (platformFilter === 'flutter') return normalized.includes('flutter');
      if (platformFilter === 'ios') return normalized.includes('ios') || normalized.includes('flutter') || normalized.includes('react native');
      if (platformFilter === 'android') return normalized.includes('android') || normalized.includes('flutter') || normalized.includes('react native');
      return true;
    };

    const base = STATIC_PRODUCTS.filter((product) => {
      const haystack = [product.name, product.description, product.category, ...product.technologies]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query) && matchesPlatform(product.technologies);
    });

    const sorted = [...base].sort((a, b) => {
      switch (sortFilter) {
        case 'sale':
          return (b.originalPrice ? 1 : 0) - (a.originalPrice ? 1 : 0) || b.sales - a.sales;
        case 'recommended':
          return b.rating - a.rating || b.sales - a.sales;
        case 'new':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'top-selling':
        case 'bestseller':
        default:
          return b.sales - a.sales;
      }
    });

    if (sortFilter === 'sale') {
      return sorted.filter((product) => Boolean(product.originalPrice));
    }

    return sorted;
  }, [platformFilter, searchTerm, sortFilter]);

  const visibleProducts = filteredProducts.slice(0, 6);

  return (
    <div className="pt-16">
      <section className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,245,212,0.14),transparent_20%),radial-gradient(circle_at_18%_26%,rgba(139,92,246,0.16),transparent_26%),radial-gradient(circle_at_82%_30%,rgba(66,245,186,0.14),transparent_24%),linear-gradient(180deg,#050507_0%,#07070b_45%,#050507_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(110,96,255,0.14),transparent_26%),radial-gradient(circle_at_50%_70%,rgba(0,245,212,0.08),transparent_22%)]" />

        {/* Scan line */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-scan-line absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        </div>

        {/* Pulse rings */}
        <div className="pointer-events-none absolute left-1/2 top-[42%]">
          <div className="animate-pulse-ring absolute h-[28rem] w-[28rem] rounded-full border border-cyan-400/10" style={{ animationDelay: '0s' }} />
          <div className="animate-pulse-ring absolute h-[42rem] w-[42rem] rounded-full border border-violet-400/8" style={{ animationDelay: '1.4s' }} />
          <div className="animate-pulse-ring absolute h-[56rem] w-[56rem] rounded-full border border-cyan-400/5" style={{ animationDelay: '2.8s' }} />
        </div>

        {/* Orbiting dots */}
        <div className="pointer-events-none absolute left-1/2 top-[42%]">
          <div className="animate-orbit absolute h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,245,212,0.9)]" />
          <div className="animate-orbit-reverse absolute h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]" style={{ animationDelay: '-6s' }} />
        </div>

        {/* Floating data stream labels */}
        <div className="pointer-events-none absolute right-[8%] top-[55%] hidden lg:flex flex-col gap-3">
          {['API_CALL', 'STREAM_OK', 'MODEL_V4', 'TOKENS_∞'].map((label, i) => (
            <div
              key={label}
              className="animate-data-stream font-mono text-[10px] tracking-widest text-cyan-400/50"
              style={{ animationDelay: `${i * 0.75}s`, animationDuration: '4s' }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-0">
              <div className="animate-hero-glow-1 absolute left-1/2 top-[42%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),rgba(139,92,246,0)_70%)] blur-3xl" />
              <div className="animate-hero-glow-2 absolute left-1/2 top-[42%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,245,212,0.12),rgba(0,245,212,0)_65%)] blur-3xl" />
              {heroParticles.map((particle, index) => (
                <span
                  key={`particle-${index}`}
                  className="absolute rounded-full bg-gradient-to-br from-cyan-300 via-teal-300 to-violet-400 opacity-80 shadow-[0_0_18px_rgba(0,245,212,0.45)] animate-float"
                  style={{
                    left: particle.left,
                    top: particle.top,
                    width: particle.size,
                    height: particle.size,
                    animationDelay: particle.delay,
                    animationDuration: particle.duration,
                  }}
                />
              ))}
            </div>

            <div className="relative mx-auto max-w-4xl text-center">
              <div className="animate-hero-badge">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold tracking-[0.32em] text-cyan-200 uppercase backdrop-blur-md">
                  <Sparkles className="h-4 w-4" />
                  New digital drops
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="animate-hero-h1-1">
                  <h1 className="mx-auto max-w-5xl font-['Clash_Display'] text-[clamp(3.4rem,9.6vw,8.6rem)] leading-[0.88] tracking-[-0.07em] text-white [text-shadow:0_0_30px_rgba(0,0,0,0.35)]">
                    Build faster
                  </h1>
                </div>
                <div className="animate-hero-h1-2">
                  <h1 className="mx-auto max-w-5xl font-['Clash_Display'] text-[clamp(3.4rem,9.6vw,8.6rem)] leading-[0.88] tracking-[-0.07em] text-white">
                    with
                  </h1>
                </div>
                <div className="animate-hero-h1-3">
                  <h1 className="mx-auto max-w-5xl font-['Clash_Display'] text-[clamp(3.4rem,9.6vw,8.6rem)] leading-[0.88] tracking-[-0.07em]">
                    <span className="block text-gradient-cyan-violet">premium digital</span>
                    <span className="block text-white">products.</span>
                  </h1>
                </div>
              </div>

              <div className="animate-hero-sub">
                <p className="mx-auto mt-8 max-w-2xl text-balance text-base leading-8 text-white/68 sm:text-lg">
                  A neon-lit marketplace for builders who want polished apps, bold UI kits, and ready-to-ship digital products that feel fresh instead of generic.
                </p>
              </div>

              <div className="animate-hero-pills">
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/55 sm:text-sm">
                  <span className="premium-pill border-cyan-400/20 bg-cyan-400/10 text-cyan-100">120+ assets</span>
                  <span className="premium-pill border-violet-400/20 bg-violet-400/10 text-violet-100">4.9/5 rating</span>
                  <span className="premium-pill border-emerald-400/20 bg-emerald-400/10 text-emerald-100">Instant access</span>
                </div>
              </div>

              <div className="animate-hero-cta">
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300 px-7 py-4 font-semibold text-black shadow-[0_20px_60px_rgba(139,92,246,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(0,245,212,0.28)]"
                  >
                    Browse Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 px-7 py-4 font-semibold text-white/90 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-white/10"
                  >
                    View Demo Store
                  </Link>
                </div>
              </div>
            </div>

            <div className="pointer-events-none">
              <Reveal delayMs={120} className="absolute left-[2%] top-[20%] hidden w-[250px] xl:block">
                <div className="market-card market-card-hover animate-float overflow-hidden border-white/10 bg-black/55 shadow-2xl shadow-black/45 [transform:rotate(-8deg)]">
                  <div className="h-40 overflow-hidden rounded-t-[16px]">
                    <img
                      src={heroPreviewProducts[0]?.image}
                      alt={heroPreviewProducts[0]?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-200 uppercase">Featured pick</p>
                        <div className="mt-2 text-lg font-semibold text-white">{heroPreviewProducts[0]?.name}</div>
                        <div className="mt-1 text-sm text-white/55">{heroPreviewProducts[0]?.category}</div>
                      </div>
                      <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-right">
                        <div className="text-[10px] tracking-[0.24em] text-cyan-100/70 uppercase">Price</div>
                        <div className="text-xl font-bold text-white">${heroPreviewProducts[0]?.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={210} className="absolute right-[4%] top-[18%] hidden w-[280px] xl:block">
                <div className="market-card market-card-hover animate-float overflow-hidden border-white/10 bg-black/55 shadow-2xl shadow-black/45 [animation-delay:1.3s] [transform:rotate(9deg)]">
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-3 py-2">
                        <Sparkles className="h-5 w-5 text-violet-200" />
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase">
                        Live preview
                      </div>
                    </div>
                    <div className="text-sm font-semibold tracking-[0.24em] text-white/45 uppercase">Kit</div>
                    <div className="mt-2 text-2xl font-semibold text-white">UI craft bundle</div>
                    <div className="mt-3 text-sm leading-6 text-white/60">
                      Ready-made components, motion, and layouts with a polished, modern feel.
                    </div>
                    <div className="mt-6 h-2 rounded-full bg-white/10">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300" />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={280} className="absolute left-[18%] bottom-[14%] hidden w-[230px] lg:block">
                <div className="market-card market-card-hover animate-float overflow-hidden border-white/10 bg-black/55 shadow-2xl shadow-black/45 [animation-delay:0.9s] [transform:rotate(6deg)]">
                  <img
                    src={heroPreviewProducts[1]?.image}
                    alt={heroPreviewProducts[1]?.name}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="text-[11px] font-semibold tracking-[0.28em] text-emerald-200 uppercase">Recommended</div>
                    <div className="mt-2 text-base font-semibold text-white">{heroPreviewProducts[1]?.name}</div>
                    <div className="mt-1 text-sm text-white/55">{heroPreviewProducts[1]?.category}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-2xl font-bold text-white">${heroPreviewProducts[1]?.price}</div>
                      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                        <Sparkles className="h-4 w-4 text-cyan-200" />
                        4.9
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="absolute inset-x-0 top-12 mx-auto hidden max-w-sm lg:block">
                <div className="mx-auto h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Reveal className="market-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-b border-white/10 px-8 py-8 md:border-b-0 md:border-r md:border-white/10">
                <div className="text-5xl font-bold text-white">50+</div>
                <div className="mt-3 text-sm text-white/50">Production-ready solutions</div>
              </div>
              <div className="border-b border-white/10 px-8 py-8 md:border-b-0 md:border-r md:border-white/10">
                <div className="text-5xl font-bold text-white">4.9/5</div>
                <div className="mt-3 text-sm text-white/50">Average rating</div>
              </div>
              <div className="px-8 py-8">
                <div className="text-5xl font-bold text-white">10K+</div>
                <div className="mt-3 text-sm text-white/50">Downloads to date</div>
              </div>
            </div>
            <div className="border-t border-white/10 px-8 py-8 text-center">
              <p className="mx-auto max-w-3xl text-lg text-white/75">
                &ldquo;The quality of apps on AppSell Point is unmatched. It's our first stop for every new project.&rdquo;
              </p>
              <p className="mt-4 text-sm text-white/45">Name, Role</p>
            </div>
            <div className="border-t border-white/10 px-8 py-6 text-center">
              <div className="text-[11px] tracking-[0.45em] text-white/20 uppercase">
                Stark • Nexus • Volt • Prism • Core
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-8">
            <h2 className="text-white text-5xl md:text-6xl leading-[0.95] tracking-[-0.04em]">
              <span className="font-['Clash_Display'] font-bold">Explore </span>
              <span className="font-['DM_Serif_Display'] font-light italic">apps </span>
              <span className="font-['Clash_Display'] font-bold">with </span>
              <span className="font-['DM_Serif_Display'] font-light italic">clarity</span>
            </h2>
          </Reveal>

          <Reveal className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product, category, or technology"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]"
              />
            </div>
          </Reveal>

          <Reveal className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {platformFilters.map((filter) => {
                const active = platformFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setPlatformFilter(filter.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {sortFilters.map((filter) => {
                const active = sortFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSortFilter(filter.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categoryCards.map((card, index) => (
              <div
                key={card.label}
                className="group market-card market-card-hover p-4"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-white">{card.label}</div>
                <div className="mt-1 text-xs text-white/45">{card.description}</div>
              </div>
            ))}
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product, index) => (
              <Reveal key={product.id} delayMs={Math.min(260, index * 50)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10"
            >
              View More Apps
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
