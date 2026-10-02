import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2, Tag, ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCurrency } from '../hooks/useCurrency';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { cart, updateQuantity, removeFromCart, clearCart, showToast, telegramBotToken, telegramChatId } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - (subtotal * discount);

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DISCOUNT10') {
      setDiscount(0.1);
      setPromoMessage(t('promoApplied'));
      showToast(t('promoApplied'), 'success', 3000);
    } else if (promoCode.toUpperCase() === 'VIP20') {
      setDiscount(0.2);
      setPromoMessage(t('promoApplied'));
      showToast(t('promoApplied'), 'success', 3000);
    } else {
      setDiscount(0);
      setPromoMessage(t('promoInvalid'));
      showToast(t('promoInvalid'), 'error', 3000);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);

    const botToken = telegramBotToken || import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8790244945:AAGmQUSi8FEXOl8QEYWnF56beWHYWFuo4DM';
    const chatId = telegramChatId || import.meta.env.VITE_TELEGRAM_CHAT_ID || '6575332225';

    let orderText = `🛍 <b>${t('newOrder')}</b>\n\n`;
    orderText += `👤 <b>${t('customerName')}:</b> ${checkoutData.name}\n`;
    orderText += `📞 <b>${t('phone')}:</b> ${checkoutData.phone}\n`;
    orderText += `📍 <b>${t('deliveryAddress')}:</b> ${checkoutData.address}\n\n`;
    orderText += `📦 <b>${t('products')}:</b>\n`;
    
    cart.forEach((item, index) => {
      orderText += `${index + 1}. ${t(item.name)} — ${item.quantity} x ${formatPrice(item.price)}\n`;
    });

    orderText += `\n💰 <b>${t('total')}:</b> ${formatPrice(total)}`;

    if (discount > 0) {
      orderText += ` <i>(${t('withDiscount')})</i>`;
    }

    try {
      if (!botToken || !chatId || botToken === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
        console.warn("Telegram bot token yoki chat ID sozlanmagan! Order text:\n", orderText);
        showToast("Buyurtma qabul qilindi! (Telegram Bot Token ulanmagan)", 'info', 4000);
      } else {
        let apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        let reqBody: any = {
          chat_id: chatId,
          text: orderText,
          parse_mode: 'HTML'
        };

        if (cart.length === 1 && cart[0].image) {
          apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
          reqBody = {
            chat_id: chatId,
            photo: cart[0].image,
            caption: orderText,
            parse_mode: 'HTML'
          };
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody),
        });

        const data = await response.json();
        if (!data.ok) {
          console.error("Telegram API xatosi:", data);
          throw new Error(data.description || 'Telegram xabari yuborilmadi');
        }
        showToast(t('orderSuccess'), 'success', 3000);
      }
      
      clearCart();
      setIsCheckoutOpen(false);
    } catch (error: any) {
      console.error(error);
      showToast(`${t('orderError')}: ${error?.message || ''}`, 'error', 4000);
    } finally {
      setIsOrdering(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingCart className="w-20 h-20 text-gray-300  mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{t('cartEmpty')}</h2>
        <p className="text-foreground/70 mb-8">{t('cartEmptyDesc')}</p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-[#b8952c] transition-colors"
        >
          {t('shopNow')} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight">{t('cart')} ({cart.length})</h2>
          <button onClick={clearCart} className="text-sm text-foreground/70 hover:text-red-500 font-bold uppercase tracking-wide transition-colors">
            {t('clearCart')}
          </button>
        </div>
        
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-background  border border-border hover:border-black dark:hover:border-white transition-all duration-300 group">
              <img src={item.image} alt={t(item.name)} className="w-28 h-28 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight">{t(item.name)}</h3>
                    <p className="text-xs text-foreground/70 uppercase tracking-widest mt-1">{t(item.category)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-foreground/60 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-auto flex justify-between items-center pt-4">
                  <span className="font-black text-lg">{formatPrice(item.price * item.quantity)}</span>
                  
                  <div className="flex items-center gap-3 border border-border">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#222222] dark:hover:bg-gray-900 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#222222] dark:hover:bg-gray-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-background  p-8 border border-border sticky top-24">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8">{t('orderSummary')}</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-foreground/70">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-foreground/70">
              <span>{t('shipping')}</span>
              <span className="text-green-500 font-bold uppercase text-sm">{t('free')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500 font-bold">
                <span>{t('discount')} ({discount * 100}%)</span>
                <span>-{formatPrice(subtotal * discount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-4 flex justify-between font-black text-2xl">
              <span>{t('total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-8">
            <label className="text-xs font-bold uppercase tracking-widest mb-3 block text-foreground/70">{t('promoCode')}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={t('enterCode')} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none font-bold uppercase tracking-wide"
                />
              </div>
              <button 
                onClick={applyPromoCode}
                className="px-6 py-3 bg-[#D4AF37] text-black font-bold uppercase text-sm tracking-wide hover:bg-[#b8952c] transition-colors"
              >
                {t('apply')}
              </button>
            </div>
            {promoMessage && (
              <p className={`mt-2 text-sm font-bold ${discount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {promoMessage}
              </p>
            )}
          </div>

          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-5 bg-[#D4AF37] text-black font-black text-lg uppercase tracking-wide hover:bg-[#b8952c] transition-colors active:scale-[0.98]"
          >
            {t('checkout')}
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background  w-full max-w-md shadow-2xl overflow-hidden border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight">{t('checkoutTitle')}</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#222222] dark:hover:bg-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCheckout} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">{t('fullName')}</label>
                <input 
                  required type="text" 
                  value={checkoutData.name}
                  onChange={e => setCheckoutData({...checkoutData, name: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border outline-none font-medium"
                  placeholder={t('fullNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">{t('phone')}</label>
                <input 
                  required type="tel" 
                  value={checkoutData.phone}
                  onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border outline-none font-medium"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-foreground/70">{t('deliveryAddress')}</label>
                <textarea 
                  required rows={3}
                  value={checkoutData.address}
                  onChange={e => setCheckoutData({...checkoutData, address: e.target.value})}
                  className="w-full p-4 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border outline-none font-medium"
                  placeholder={t('addressPlaceholder')}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isOrdering}
                className="w-full py-4 mt-4 bg-[#D4AF37] text-black font-black text-lg uppercase tracking-wide hover:bg-[#b8952c] transition-colors disabled:opacity-50"
              >
                {isOrdering ? t('sending') : t('confirmOrder')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
