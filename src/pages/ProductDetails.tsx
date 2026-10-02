import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCurrency } from '../hooks/useCurrency';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { products, addToCart, toggleFavorite, favorites, showToast } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black mb-4 uppercase">{t('productNotFound')}</h2>
        <Link to="/products" className="text-foreground/70 hover:text-foreground dark:hover:text-foreground flex items-center justify-center gap-2 font-bold uppercase text-sm tracking-wide">
          <ArrowLeft className="w-4 h-4" /> {t('backToProducts')}
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.some(p => p.id === product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-16">
      <Link to="/products" className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground dark:hover:text-foreground transition-colors font-bold uppercase text-sm tracking-wide">
        <ArrowLeft className="w-5 h-5" />
        {t('backToProducts')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-[#222222] dark:bg-gray-900 group">
          <img 
            src={product.image} 
            alt={t(product.name)} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <button 
            onClick={() => toggleFavorite(product)}
            className="absolute top-6 right-6 p-4 bg-background/90 backdrop-blur-sm hover:bg-background dark:hover:bg-background transition-all shadow-lg"
          >
            <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="inline-block px-4 py-1.5 bg-gray-100 dark:bg-[#222222] dark:bg-gray-900 text-xs font-bold uppercase tracking-widest mb-6 w-max">
            {t(product.category)}
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">{t(product.name)}</h1>
          <p className="text-3xl font-black text-foreground  mb-8">{formatPrice(product.price)}</p>
          
          <div className="text-foreground/70 mb-8 text-lg leading-relaxed">
            {t(product.description)}
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <span className="block text-xs font-bold uppercase tracking-widest text-foreground/70 mb-3">{t('quantity')}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#333333]  transition-colors font-bold text-foreground  active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-black text-lg text-foreground  select-none">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#333333]  transition-colors font-bold text-foreground  active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm font-bold text-foreground/70">
                = <span className="text-foreground  text-lg font-black">{formatPrice(product.price * quantity)}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              addToCart(product, quantity);
              showToast(`${t(product.name)} (${quantity}x) - ${t('addedToCart')}!`, 'success', 3000);
            }}
            className="flex items-center justify-center bg-[#D4AF37] text-black hover:bg-[#b8952c] px-8 py-5 font-black text-lg gap-3 transition-all active:scale-[0.98] w-full lg:w-auto uppercase tracking-wide"
          >
            <ShoppingCart className="w-6 h-6" />
            {t('addToCart')}
          </button>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-border">
            <div className="text-center">
              <Truck className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-black text-sm uppercase tracking-wide">{t('freeShippingShort')}</h4>
              <p className="text-xs text-foreground/70 mt-1">{t('freeShippingShortDesc', { price: formatPrice(100) })}</p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-black text-sm uppercase tracking-wide">{t('warranty')}</h4>
              <p className="text-xs text-foreground/70 mt-1">{t('warrantyDesc')}</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-8 h-8 mx-auto mb-3" />
              <h4 className="font-black text-sm uppercase tracking-wide">{t('returns')}</h4>
              <p className="text-xs text-foreground/70 mt-1">{t('returnsDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-border">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">{t('relatedProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
