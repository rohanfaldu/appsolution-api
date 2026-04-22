import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { STATIC_PRODUCTS } from '../data/staticProducts';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        const apiProducts = response?.data?.products || [];
        if (Array.isArray(apiProducts) && apiProducts.length) {
          setProducts(apiProducts);
          setFilteredProducts(apiProducts);
        } else {
          setProducts(STATIC_PRODUCTS);
          setFilteredProducts(STATIC_PRODUCTS);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(STATIC_PRODUCTS);
        setFilteredProducts(STATIC_PRODUCTS);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product: any) => {
      const name = (product?.name || '').toLowerCase();
      const description = (product?.description || '').toLowerCase();
      const query = searchTerm.toLowerCase();
      return name.includes(query) || description.includes(query);
    });

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product: any) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, products]);

  const categories = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      { value: 'ecommerce', label: 'E-Commerce' },
      { value: 'delivery', label: 'Delivery' },
      { value: 'health', label: 'Health & Fitness' },
      { value: 'social', label: 'Social' },
      { value: 'productivity', label: 'Productivity' },
      { value: 'education', label: 'Education' },
    ],
    []
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white">All products</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-2xl mx-auto">
            Browse the full collection of ready-made mobile app solutions.
          </p>
        </Reveal>

        <Reveal className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-cyan-400/40 focus:bg-white/[0.07]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-[#39ff14]/40 bg-[#39ff14]/10 text-[#39ff14]'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`h-3 w-0.5 rounded-full ${active ? 'bg-[#39ff14]' : 'bg-[#39ff14]/40'}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="surface halo rounded-3xl p-10 inline-block">
                <div className="text-white font-semibold text-lg">No results</div>
                <div className="mt-2 text-gray-300">Try adjusting your search or filters.</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentProducts.map((product: any, idx: number) => (
                <Reveal key={product.id} delayMs={Math.min(240, idx * 45)}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Reveal className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-2xl surface border-white/15 text-white/90 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? 'px-4 py-2 rounded-2xl text-white font-semibold shadow-glow-sm bg-gradient-to-r from-blue-500 to-purple-600'
                    : 'px-4 py-2 rounded-2xl surface border-white/15 text-white/90 hover:bg-white/10 transition'
                }
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-2xl surface border-white/15 text-white/90 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
