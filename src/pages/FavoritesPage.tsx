import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import { productsAPI } from '../services/api';
import { toggleFavorite, useFavorites } from '../utils/marketplaceStorage';

const FavoritesPage = () => {
  const favorites = useFavorites();
  const [allProducts, setAllProducts] = useState<any[]>(STATIC_PRODUCTS);

  useEffect(() => {
    let active = true;

    productsAPI
      .getAll({ limit: 500 })
      .then((response) => {
        if (!active) return;

        const apiProducts = response?.data?.products || [];
        const mergedProducts = [...apiProducts, ...STATIC_PRODUCTS].reduce((products, product) => {
          if (!product?.id || products.some((entry: any) => String(entry.id) === String(product.id))) {
            return products;
          }

          return [...products, product];
        }, [] as any[]);

        setAllProducts(mergedProducts.length ? mergedProducts : STATIC_PRODUCTS);
      })
      .catch(() => {
        if (active) setAllProducts(STATIC_PRODUCTS);
      });

    return () => {
      active = false;
    };
  }, []);

  const products = favorites
    .map((id) => allProducts.find((entry) => String(entry.id) === String(id)))
    .filter(Boolean);

  const handleToggle = (id: string | number) => {
    toggleFavorite(id).catch((error) => {
      console.error('Favorite sync error:', error);
    });
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-['Clash_Display'] text-5xl text-white">Favorites</h1>
          <p className="mt-3 text-white/60">Keep track of apps you want to revisit later.</p>
        </div>

        {products.length === 0 ? (
          <div className="market-card p-10 text-center">
            <Heart className="mx-auto h-10 w-10 text-cyan-300" />
            <h2 className="mt-4 text-2xl font-semibold text-white">No favorites yet</h2>
            <p className="mt-2 text-white/55">Tap the heart on any app to save it here.</p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black"
            >
              Browse Apps
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="market-card p-4">
                <img src={product.image} alt={product.name} className="h-48 w-full rounded-xl object-cover" />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-semibold">{product.name}</div>
                    <div className="mt-1 text-sm text-white/55">{product.description}</div>
                    <div className="mt-3 text-lg font-bold text-white">${product.price}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle(product.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
