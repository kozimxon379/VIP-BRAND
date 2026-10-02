import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap, Shield, Truck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { useCurrency } from '../hooks/useCurrency';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const Home = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { products } = useStore();
  const featuredProducts = products.slice(0, 3);
  const position: [number, number] = [41.2995, 69.2401]; // Tashkent, Uzbekistan

  return (
    <div className="space-y-0 pb-12 w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] bg-black text-[#D4AF37] flex items-end pb-24 justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        <div className="relative z-10 px-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter">
            {t('discover')} <br/>{t('premium')} {t('heroProducts')}
          </h1>
          <p className="text-lg md:text-xl font-medium mb-8">
            {t('heroSubtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-black hover:bg-[#b8952c] px-8 py-4 rounded-full font-bold text-lg transition-all"
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
          </div>
          <Link to="/products" className="font-bold hover:text-foreground/70 flex items-center gap-1 uppercase text-sm tracking-wide">
            {t('viewAll')}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Store Location & Telegram Bot */}
      <section id="contact" className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-[#111111]  border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">{t('storeLocation')}</h2>
            <p className="text-foreground/70 mb-8 text-lg">{t('storeLocationDesc')}</p>
            
            <div className="mb-12">
              <h3 className="font-bold text-xl mb-2 uppercase">{t('address')}</h3>
              <p className="text-foreground/80  text-lg">{t('addressValue')}</p>
            </div>

            <div className="bg-background text-foreground   p-8 rounded-none">
              <h3 className="text-2xl font-black mb-4 uppercase">{t('telegramBot')}</h3>
              <p className="text-foreground/80 mb-8">{t('telegramBotDesc')}</p>
              <a 
                href="https://t.me/your_store_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:opacity-80 transition-opacity"
              >
                {t('openTelegram')}
              </a>
            </div>
          </div>

          <div className="h-[500px] border border-border z-0 grayscale">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  <strong>VIP BRAND</strong> <br /> {t('weAreHere')}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
};
