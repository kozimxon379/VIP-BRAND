import { useTranslation } from 'react-i18next';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { Package, Heart, Settings } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export const Profile = () => {
  const { t } = useTranslation();
  const { favorites, user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin' || user.username.includes('islomxonov')) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Profile Header */}
      <div className="bg-[#D4AF37] text-black p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-28 h-28 bg-[#D4AF37] text-black flex items-center justify-center text-4xl font-black uppercase">
          {(user.name || user.username).charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">{user.name || user.username}</h1>
          <p className="text-foreground/60 font-medium">{user.phone || '@' + user.username}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
            <Link to="/cart" className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-black font-bold uppercase text-sm tracking-wide hover:opacity-80 transition-opacity">
              <Package className="w-4 h-4" />
              {t('myOrders')}
            </Link>
            <button className="flex items-center gap-2 px-5 py-3 border border-gray-700 text-foreground font-bold uppercase text-sm tracking-wide hover:bg-background hover:text-foreground transition-all">
              <Settings className="w-4 h-4" />
              {t('settings')}
            </button>
          </div>
        </div>
      </div>

      {/* Favorites */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          <h2 className="text-3xl font-black uppercase tracking-tight">{t('favorites')}</h2>
          <span className="text-sm text-foreground/70 font-bold ml-2">({favorites.length})</span>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-background  border border-border">
            <Heart className="w-16 h-16 text-gray-300  mx-auto mb-4" />
            <p className="text-xl font-bold text-foreground/70">{t('noFavorites')}</p>
            <Link to="/products" className="inline-block mt-4 text-sm font-bold uppercase tracking-wide text-foreground/70 hover:text-foreground dark:hover:text-foreground transition-colors">
              {t('startShopping')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
