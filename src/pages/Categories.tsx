import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categoryImages: Record<string, string> = {
  'Accessories': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=60',
  'Men': 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=60',
  'Women': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=60',
  'Shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=60',
  'Unisex': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=60',
};

export const Categories = () => {
  const { t } = useTranslation();
  const { products } = useStore();
  
  const categoryMap = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryMap).map(([name, count]) => ({
    name,
    count,
    image: categoryImages[name] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=60'
  }));

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 min-h-[70vh]">
      <div className="text-center py-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{t('categories')}</h1>
        <p className="text-foreground/70 text-lg">{t('exploreByCategory')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <Link 
            key={cat.name} 
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group relative h-80 overflow-hidden bg-black flex items-end"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <img 
              src={cat.image} 
              alt={t(cat.name)} 
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
            />
            <div className="relative z-10 p-8 w-full">
              <h3 className="text-3xl font-black text-foreground uppercase tracking-tight mb-1">{t(cat.name)}</h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-300 font-bold text-sm uppercase tracking-widest">{t('productCount', { count: cat.count })}</p>
                <ArrowRight className="w-6 h-6 text-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
