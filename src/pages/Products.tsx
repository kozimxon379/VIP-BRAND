import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';

export const Products = () => {
  const { t } = useTranslation();
  const { products } = useStore();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc'>('none');
  const [category, setCategory] = useState<string>('All');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setCategory(cat);
    }
    const searchParam = params.get('search');
    setSearchTerm(searchParam || '');
  }, [location.search]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        t(p.name).toLowerCase().includes(lowerSearch) || 
        t(p.description).toLowerCase().includes(lowerSearch) ||
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, sortBy, category, t]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter">{t('products')}</h1>
        <p className="text-foreground/70 mt-2">{filteredProducts.length} {t('items')}</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-background  border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
          <input 
            type="text" 
            placeholder={t('search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white transition-colors font-medium"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-foreground/70" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border px-4 py-3 outline-none font-bold text-sm uppercase tracking-wide"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? t('All') : t(cat)}</option>
              ))}
            </select>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border px-4 py-3 outline-none font-bold text-sm uppercase tracking-wide"
          >
            <option value="none">{t('sort')}</option>
            <option value="price-asc">{t('priceAsc')}</option>
            <option value="price-desc">{t('priceDesc')}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Search className="w-16 h-16 text-gray-300  mx-auto mb-4" />
            <p className="text-xl font-bold text-foreground/70">{t('productNotFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
