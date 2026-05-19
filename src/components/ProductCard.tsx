import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hasFavorite, toggleFavorite, useFavorites } from '../utils/marketplaceStorage';
import TemplateCard from './TemplateCard';

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
  useFavorites();
  const inFavorites = hasFavorite(product.id);

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/favorites' } });
      return;
    }

    toggleFavorite(product.id).catch((error) => {
      console.error('Favorite sync error:', error);
    });
  };

  return (
    <TemplateCard
      id={product.id}
      title={product.name}
      description={product.description}
      image={product.image}
      price={product.price}
      originalPrice={product.originalPrice}
      rating={product.rating}
      sales={product.sales}
      technologies={product.technologies}
      rankLabel={product.sales > 250 ? 'Bestseller' : undefined}
      favorite={inFavorites}
      favoriteLabel={inFavorites ? 'Remove from favorites' : 'Save product'}
      onToggleFavorite={handleFavorite}
    />
  );
};

export default ProductCard;
