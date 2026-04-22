import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  addToCart,
  hasCartItem,
  hasFavorite,
  toggleFavorite,
} from '../utils/marketplaceStorage';

interface Product {
  id: number | string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sales: number;
  technologies: string[];
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const inCart = hasCartItem(product.id);
  const inFavorites = hasFavorite(product.id);

  const techPillClasses = (tech: string) => {
    const key = tech.toLowerCase();
    if (key.includes('flutter')) return 'bg-blue-400/10 text-blue-200 border-blue-400/30';
    if (key.includes('react')) return 'bg-cyan-400/10 text-cyan-200 border-cyan-400/30';
    if (key.includes('android')) return 'bg-emerald-400/10 text-emerald-200 border-emerald-400/30';
    if (key.includes('ios')) return 'bg-violet-400/10 text-violet-200 border-violet-400/30';
    return 'bg-white/5 text-white/70 border-white/10';
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }

    addToCart(product.id);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/favorites' } });
      return;
    }

    toggleFavorite(product.id);
  };

  return (
    <article className="group relative market-card market-card-hover overflow-hidden">
      <div className="relative aspect-[1.42] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.06] grayscale group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.82] via-black/25 to-transparent" />

        {product.sales > 250 && (
          <span className="absolute left-4 top-4 rounded-full border border-cyan-400/40 bg-cyan-400/[0.12] px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
            Bestseller
          </span>
        )}

        <div className="absolute left-4 bottom-4 flex items-center gap-2">
          <span className="premium-pill border-white/10 bg-black/[0.35] text-white/90">
            {product.category || 'Digital'}
          </span>
          <span className="premium-pill border-white/10 bg-black/[0.35] text-white/80">
            {product.sales} sales
          </span>
        </div>

        <button
          type="button"
          onClick={handleFavorite}
          className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition ${
            inFavorites
              ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-300'
              : 'border-white/10 bg-black/30 text-white/80 hover:border-cyan-400/30 hover:bg-white/10'
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`h-4 w-4 ${inFavorites ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="relative p-6">
        <div className="absolute inset-x-0 top-0 h-px opacity-30 divider-soft" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[1.35rem] font-semibold text-white leading-tight">{product.name}</h3>
            <p className="mt-1.5 text-xs text-white line-clamp-2">{product.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-baseline gap-1.5 justify-end">
              <div className="text-2xl font-bold text-white">${product.price}</div>
              {product.originalPrice ? (
                <div className="text-xs text-white/40 line-through">${product.originalPrice}</div>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {product.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide ${techPillClasses(tech)}`}
            >
              {tech}
            </span>
          ))}
          {product.technologies.length > 4 && (
            <span className="premium-pill">
              +{product.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/15'}`}
              />
            ))}
          </div>
          <span className="text-sm text-white/45">{product.rating.toFixed(1)}</span>
        </div>

        <div className="mt-1 text-sm text-white/45">{product.sales} sales</div>
        
        <div className="mt-6 flex gap-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/10"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`relative inline-flex items-center justify-center rounded-2xl px-4 py-3 font-semibold text-black transition ${
              inCart ? 'bg-cyan-300' : 'bg-cyan-400 hover:bg-cyan-300'
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
    </article>
  );
};

export default ProductCard;
