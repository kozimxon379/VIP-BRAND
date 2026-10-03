import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Shield, Truck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { useCurrency } from '../hooks/useCurrency';

export const Home = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { products } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-0 pb-12 w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] bg-black text-white flex items-end pb-24 justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        <div className="relative z-10 px-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter drop-shadow-lg">
            {t('discover')} <br/>
            <span className="text-[#D4AF37]">{t('premium')}</span> {t('heroProducts')}
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8 text-white/90 drop-shadow-md max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-black hover:bg-[#b8952c] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('shopNow')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 md:px-8 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <Zap className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-black uppercase tracking-wide mb-2">{t('fastDelivery')}</h3>
            <p className="text-foreground/70">{t('fastDeliveryDesc')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-black uppercase tracking-wide mb-2">{t('securePayment')}</h3>
            <p className="text-foreground/70">{t('securePaymentDesc')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Truck className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-black uppercase tracking-wide mb-2">{t('freeShipping')}</h3>
            <p className="text-foreground/70">{t('freeShippingDesc', { price: formatPrice(100) })}</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{t('featuredProductsTitle')}</h2>
            <p className="text-foreground/70">{t('featuredProductsDesc')}</p>
          </div>
          <Link to="/products" className="font-bold hover:text-foreground/70 flex items-center gap-1 uppercase text-sm tracking-wide">
            {t('viewAll')}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-gray-50 dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">{t('exploreByCategory')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Men', 'Women', 'Accessories', 'Shoes'].map((category, idx) => (
              <Link 
                key={category} 
                to={`/products?category=${category}`}
                className={`relative h-64 group overflow-hidden bg-black ${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <img 
                  src={`https://images.unsplash.com/photo-${category === 'Men' ? '1617137968427-85924c800a22' : category === 'Women' ? '1483985988355-763728e1935b' : category === 'Accessories' ? '1584916201218-f4242ceb4809' : '1549298916-b5c3820d8c9e'}?auto=format&fit=crop&w=800&q=80`}
                  alt={category}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <h3 className="text-3xl font-black text-white uppercase tracking-widest">{t(category)}</h3>
                  <span className="mt-4 px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                    {t('shopNow')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 text-center border-t border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">VIP CLUB</h2>
          <p className="text-foreground/70 mb-8 font-medium">
            Eng so'nggi aksiyalar va yangi kolleksiyalar haqida birinchilardan bo'lib xabardor bo'ling.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email manzilingiz" 
              className="px-6 py-4 bg-gray-50 dark:bg-[#111111] border border-border outline-none focus:border-black dark:focus:border-white w-full sm:w-96 text-center sm:text-left transition-colors"
              required
            />
            <button 
              type="submit" 
              className="px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Obuna bo'lish
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
