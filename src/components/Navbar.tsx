import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  Menu,
  ShoppingCart,
  Smartphone,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getCartCount,
  getFavoriteCount,
  MARKETPLACE_CHANGE_EVENT,
} from '../utils/marketplaceStorage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState({ cart: 0, favorites: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { isAuthenticated } = useAuth();
  const [indicator, setIndicator] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const activeIndexRef = useRef<number>(-1);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const activeIndex = useMemo(() => navLinks.findIndex((l) => isActive(l.path)), [location.pathname]);

  const moveIndicatorToIndex = (index: number) => {
    const el = linkRefs.current[index];
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setIndicator({
      left: rect.left - parentRect.left,
      width: rect.width,
      opacity: 1,
    });
  };

  useEffect(() => {
    const syncCounts = () => {
      setCounts({
        cart: getCartCount(),
        favorites: getFavoriteCount(),
      });
    };

    syncCounts();
    window.addEventListener('storage', syncCounts);
    window.addEventListener(MARKETPLACE_CHANGE_EVENT, syncCounts);

    return () => {
      window.removeEventListener('storage', syncCounts);
      window.removeEventListener(MARKETPLACE_CHANGE_EVENT, syncCounts);
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const id = window.requestAnimationFrame(() => {
      if (activeIndex >= 0) moveIndicatorToIndex(activeIndex);
      else setIndicator((s) => ({ ...s, opacity: 0 }));
    });

    const onResize = () => {
      if (activeIndexRef.current >= 0) moveIndicatorToIndex(activeIndexRef.current);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
    };
  }, [activeIndex]);

  const handleGate = (target: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: target } });
      return;
    }

    navigate(target);
    setIsOpen(false);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/8 bg-black/25 backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.08] via-transparent to-violet-500/[0.08]" />
      <div className="absolute inset-x-0 bottom-0 h-px opacity-70 divider-soft" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid min-h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-4 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative rounded-2xl bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300 p-[1px] shadow-[0_0_24px_rgba(0,245,212,0.18)] transition duration-300 group-hover:shadow-[0_0_32px_rgba(139,92,246,0.22)]">
              <div className="relative rounded-[15px] bg-black/75 p-2.5">
                <Smartphone className="h-6 w-6 text-white" />
                <div className="absolute inset-0 rounded-[15px] bg-gradient-to-r from-cyan-300 to-violet-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[1.05rem] font-bold tracking-[0.16em] text-white uppercase">
                AppSolutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-8 relative">
            <div
              aria-hidden="true"
              className="absolute -bottom-1 h-[2px] transition-[left,width,opacity] duration-300 ease-out motion-reduce:transition-none"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
                background:
                  'linear-gradient(90deg, rgba(59,130,246,.0), rgba(59,130,246,.95), rgba(168,85,247,.9), rgba(59,130,246,.0))',
              }}
              />

            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                ref={(node) => {
                  linkRefs.current[idx] = node;
                }}
                onMouseEnter={() => moveIndicatorToIndex(idx)}
                onMouseLeave={() => {
                  if (activeIndexRef.current >= 0) moveIndicatorToIndex(activeIndexRef.current);
                }}
                className={`relative py-2 text-[13px] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 ${
                  isActive(link.path) ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center justify-self-end gap-3">
            <button
              type="button"
              onClick={() => handleGate('/favorites')}
              className="relative inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-cyan-400/30 hover:bg-white/10"
            >
              <Heart className="h-4 w-4" />
              Favorites
              {isAuthenticated && counts.favorites > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
                  {counts.favorites}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleGate('/cart')}
              className="relative inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-cyan-400/30 hover:bg-white/10"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {isAuthenticated && counts.cart > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-black">
                  {counts.cart}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login', { state: { from: location.pathname } })}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-emerald-300 px-5 py-2 text-sm font-semibold text-black shadow-[0_18px_50px_rgba(139,92,246,0.22)] transition hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="absolute top-full left-4 right-4 mt-2 px-2 pt-2 pb-3 space-y-1 surface halo rounded-2xl shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-white bg-white/10'
                      : 'text-white/65 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleGate('/favorites')}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white/80"
                >
                  Favorites
                </button>
                <button
                  type="button"
                  onClick={() => handleGate('/cart')}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white/80"
                >
                  Cart
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate('/login', { state: { from: location.pathname } });
                  setIsOpen(false);
                }}
                className="mt-2 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
