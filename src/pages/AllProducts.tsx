import React, { useEffect, useMemo, useState } from 'react';
import { Search, Grid3X3, List, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { STATIC_PRODUCTS } from '../data/staticProducts';

const CATEGORIES = [
  { value: 'ecommerce', label: 'E-Commerce', count: 32 },
  { value: 'delivery', label: 'Delivery', count: 18 },
  { value: 'health', label: 'Health & Fitness', count: 24 },
  { value: 'social', label: 'Social', count: 21 },
  { value: 'productivity', label: 'Productivity', count: 29 },
  { value: 'education', label: 'Education', count: 23 },
];

const PRICE_OPTIONS = ['Free', 'Premium', 'Subscription'];
const PLATFORM_OPTIONS = ['Flutter', 'React Native', 'Android', 'iOS', 'Next.js'];

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        const apiProducts = response?.data?.products || [];
        const data = Array.isArray(apiProducts) && apiProducts.length ? apiProducts : STATIC_PRODUCTS;
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setProducts(STATIC_PRODUCTS);
        setFilteredProducts(STATIC_PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((p: any) => {
      const q = searchTerm.toLowerCase();
      return (p?.name || '').toLowerCase().includes(q) || (p?.description || '').toLowerCase().includes(q);
    });

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p: any) => selectedCategories.includes(p.category));
    }

    if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') filtered = [...filtered].reverse();

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, sortBy, products]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const Sidebar = () => (
    <div className="space-y-4">
      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.value)}
                  onChange={() => toggleCategory(cat.value)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">{cat.label}</span>
              </div>
              <span className="text-xs text-slate-500">{cat.count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price">
        <div className="space-y-2">
          {PRICE_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{opt}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Platform">
        <div className="space-y-2">
          {PLATFORM_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">{opt}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="pt-6 space-y-3 border-t border-slate-200">
        <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
          Apply Filters
        </button>
        <button
          onClick={() => setSelectedCategories([])}
          className="w-full px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative">
      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(226, 232, 240) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative">
        {/* Sticky header */}
        <div className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-16 z-40">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Browse Products</h1>
              <p className="text-lg text-slate-600">
                Discover high-quality mobile app templates for e-commerce, delivery, health, and more.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-2xl w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-slate-900"
                />
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer text-sm flex-1 lg:flex-initial text-slate-900"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* View toggle */}
                <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="hidden lg:block text-sm text-slate-600 whitespace-nowrap">
                  {filteredProducts.length} results
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-40">
                <Sidebar />
              </div>
            </aside>

            {/* Mobile filters */}
            {mobileFiltersOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileFiltersOpen(false)}>
                <div
                  className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Sidebar />
                </div>
              </div>
            )}

            {/* Products grid */}
            <main className="flex-1 min-w-0">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-white border border-slate-200 rounded-2xl p-10 inline-block">
                    <div className="text-slate-900 font-semibold text-lg">No results</div>
                    <div className="mt-2 text-slate-500">Try adjusting your search or filters.</div>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'flex flex-col gap-6'
                  }
                >
                  {currentProducts.map((product: any, idx: number) => (
                    <Reveal key={product.id} delayMs={Math.min(240, idx * 45)}>
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
