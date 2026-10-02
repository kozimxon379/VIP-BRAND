import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { addToCart, favorites, toggleFavorite, showToast } = useStore();
  const isFavorite = favorites.some((p) => p.id === product.id);

  return (
    <div className="group bg-background border border-border hover:border-[#D4AF37] transition-all duration-500 flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D4AF37]/10">
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-[#111111]">
        <img 
          src={product.image} 
          alt={t(product.name)} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button 
          onClick={() => toggleFavorite(product)}
          className="absolute top-4 right-4 p-3 bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-300 shadow-sm"
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-foreground/70 font-bold uppercase tracking-widest mb-2">{t(product.category)}</div>
        <Link to={`/products/${product.id}`} className="text-lg font-black text-foreground mb-2 hover:text-foreground/70 transition-colors line-clamp-1 uppercase tracking-tight">
          {t(product.name)}
        </Link>
        <p className="text-foreground/70 text-sm line-clamp-2 mb-4 flex-1">
          {t(product.description)}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="text-xl font-black text-foreground">{formatPrice(product.price)}</span>
          <button 
            onClick={() => {
              addToCart(product);
              showToast(`${t(product.name)} - ${t('addedToCart')}!`, 'success', 3000);
            }}
            className="flex items-center justify-center bg-[#D4AF37] text-black hover:bg-[#b8952c] px-4 py-2 transition-all duration-300 font-bold text-sm gap-2 uppercase tracking-wide active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
