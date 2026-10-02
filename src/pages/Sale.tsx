import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { Timer, Percent } from 'lucide-react';

export const Sale = () => {
  const { t } = useTranslation();
  const { products } = useStore();
  
  const saleProducts = products.filter(p => p.price < 100);

  return (
    <div className="py-8 space-y-12 min-h-[70vh]">
      {/* Sale Banner */}
      <div className="relative bg-[#D4AF37] text-black p-12 md:p-20 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <span className="text-[20rem] font-black">%</span>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-black/10 px-4 py-2 mb-6 uppercase text-xs tracking-widest font-bold">
            <Timer className="w-4 h-4" /> {t('limitedTime')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{t('sale')}</h1>
          <p className="text-xl text-foreground/60 font-medium max-w-xl mx-auto">{t('saleDesc')}</p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-4xl font-black">50%</div>
              <div className="text-xs text-foreground/70 uppercase tracking-widest mt-1">{t('upTo')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black">{saleProducts.length}</div>
              <div className="text-xs text-foreground/70 uppercase tracking-widest mt-1">{t('items')}</div>
            </div>
          </div>
        </div>
      </div>

      {saleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {saleProducts.map(product => (
            <div key={product.id} className="relative">
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-foreground px-3 py-1 text-xs font-black uppercase tracking-widest">
                {t('sale')}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/70">
          <Percent className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-bold">{t('noSaleItems')}</p>
        </div>
      )}
    </div>
  );
};
