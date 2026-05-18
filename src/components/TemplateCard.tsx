import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star } from 'lucide-react';

export interface TemplateCardProps {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  price: number | string;
  originalPrice?: number | string;
  rating?: number;
  sales?: number;
  technologies?: string[];
  href?: string;
  rankLabel?: string;
  favorite?: boolean;
  favoriteLabel?: string;
  onToggleFavorite?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  animationDelay?: string;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80';

const toSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const formatProductPrice = (price: number | string | null | undefined) => {
  const amount = Number(price || 0);
  return amount <= 0 ? 'Free' : `$${amount.toFixed(0)}`;
};

const TemplateCard: React.FC<TemplateCardProps> = React.memo(
  ({
    title,
    description,
    image,
    price,
    originalPrice,
    rating = 4.8,
    sales = 120,
    technologies = [],
    href = `/product/${toSlug(title)}`,
    rankLabel,
    favorite = false,
    favoriteLabel,
    onToggleFavorite,
    animationDelay,
  }) => {
    const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);
    const hasSale =
      originalPrice !== undefined &&
      Number(originalPrice) > Number(price);

    return (
      <div
        className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-300 hover:border-blue-400 animate-in fade-in slide-in-from-bottom-4 flex flex-col"
        style={{
          animationDelay,
          boxShadow: '0 4px 20px rgba(37,99,235,0.08)',
          transition:
            'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform =
            'translateY(-10px) scale(1.02)';
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 24px 48px rgba(37,99,235,0.18)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 4px 20px rgba(37,99,235,0.08)';
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-white">
          <img
            src={imgSrc}
            alt={title}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="h-full w-full object-fit transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-400" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Link
              to={href}
              className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 text-sm"
            >
              Quick View <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {rankLabel && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-lg shadow-md">
              {rankLabel}
            </div>
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                favorite
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/90 text-slate-500 hover:text-blue-600'
              }`}
              aria-label={
                favoriteLabel ||
                (favorite ? 'Remove from favorites' : 'Save product')
              }
            >
              <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          )}
          <div className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-md backdrop-blur-sm sm:bottom-3 sm:right-3">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{Number(rating || 0).toFixed(1)}</span>
            <span className="text-slate-500">({sales})</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-1 flex flex-row items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 font-bold text-slate-800 text-sm leading-tight transition-colors duration-300 group-hover:text-blue-600 sm:text-base">
              {title}
            </h3>
            <div className="flex shrink-0 flex-col items-end gap-0">
              <span className="text-xl font-black text-blue-600 leading-none">
                {formatProductPrice(price)}
              </span>
              {hasSale && (
                <span className="text-xs text-slate-400 line-through mt-1">
                  {formatProductPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          )}

          <div className="flex-1" />

          <div className="flex flex-wrap gap-1.5 mb-1 mt-4">
            {technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="border-t border-blue-50 pt-3">
            <Link
              to={href}
              className="btn-ripple w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  },
);

export default TemplateCard;
