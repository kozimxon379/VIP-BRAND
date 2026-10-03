import { useTranslation } from 'react-i18next';
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

export const Contact = () => {
  const { t } = useTranslation();
  const position: [number, number] = [41.2995, 69.2401]; // Tashkent, Uzbekistan

  return (
    <div className="w-full pb-12">
      {/* Store Location & Telegram Bot */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-[#111111]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">{t('storeLocation')}</h2>
            <p className="text-foreground/70 mb-8 text-lg">{t('storeLocationDesc')}</p>
            
            <div className="mb-12">
              <h3 className="font-bold text-xl mb-2 uppercase">{t('address')}</h3>
              <p className="text-foreground/80  text-lg">{t('addressValue')}</p>
            </div>

            <div className="bg-background text-foreground p-8 rounded-none border border-border">
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

          <div className="h-[500px] border border-border z-0">
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
