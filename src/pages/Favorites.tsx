import { useTranslation } from 'react-i18next';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Favorites = () => {
  const { t } = useTranslation();
  const { favorites } = useStore();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <Heart className="w-12 h-12 text-red-500 fill-red-500" />
          {t('favorites')}
        </h1>
        <p className="text-foreground/70 mt-2 font-bold">{favorites.length} {t('items')}</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-background border border-border">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-foreground/70">{t('noFavorites')}</p>
          <Link to="/products" className="inline-block mt-4 px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase text-sm tracking-wide hover:opacity-80 transition-opacity">
            {t('startShopping')}
          </Link>
        </div>
      )}
    </div>
  );
};
