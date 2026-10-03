import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import type { Product } from '../store/useStore';
import { useCurrency } from '../hooks/useCurrency';
import { Navigate, Link } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, X, LayoutDashboard, Package, 
  ShoppingCart, Users, TrendingUp, DollarSign, Globe, Box, Activity, ArrowUpRight, ArrowDownRight, BarChart3, Star, Sun, Moon, Settings, Send
} from 'lucide-react';

export const Admin = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const { 
    user, products, addProduct, updateProduct, removeProduct, 
    theme, setTheme, showToast, telegramBotToken, telegramChatId, setTelegramConfig 
  } = useStore();
  
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'uz' ? 'ru' : i18n.language === 'ru' ? 'en' : 'uz';
    i18n.changeLanguage(nextLang);
  };
  
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('adminTab') || 'dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [botTokenInput, setBotTokenInput] = useState(telegramBotToken || '');
  const [chatIdInput, setChatIdInput] = useState(telegramChatId || '');
  const [isTestingBot, setIsTestingBot] = useState(false);

  useEffect(() => {
    setBotTokenInput(telegramBotToken || '');
    setChatIdInput(telegramChatId || '');
  }, [telegramBotToken, telegramChatId]);

  useEffect(() => {
    sessionStorage.setItem('adminTab', activeTab);
  }, [activeTab]);

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramConfig(botTokenInput.trim(), chatIdInput.trim());
    showToast(t('saveChanges'), 'success', 3000);
  };

  const handleTestBot = async () => {
    if (!botTokenInput.trim() || !chatIdInput.trim()) {
      showToast("Bot Token va Chat ID ni kiriting!", 'error', 3000);
      return;
    }
    setIsTestingBot(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${botTokenInput.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatIdInput.trim(),
          text: '🔔 <b>VIP Store test xabari!</b>\n\nTelegram Bot muvaffaqiyatli ulandi va cheklar yuborishga tayyor! ✅',
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.description || 'Xatolik yuz berdi');
      }
      showToast("Sinov xabari Telegram botingizga yuborildi! ✅", 'success', 4000);
    } catch (err: any) {
      showToast(`Telegram xatosi: ${err?.message || ''}`, 'error', 4000);
    } finally {
      setIsTestingBot(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });

  if (!user || (user.role !== 'admin' && !user.username.includes('islomxonov'))) {
    return <Navigate to="/login" replace />;
  }

  // MOCK DATA FOR ADMIN DASHBOARD
  const mockOrders = [
    { id: '#ORD-001', customer: 'John Doe', total: 299.99, status: 'Delivered', date: '2026-09-20' },
    { id: '#ORD-002', customer: 'Islomxon Kozim', total: 149.99, status: 'Shipped', date: '2026-09-25' },
    { id: '#ORD-003', customer: 'Jane Smith', total: 89.00, status: 'Pending', date: '2026-09-26' },
    { id: '#ORD-004', customer: 'Alex Johnson', total: 450.50, status: 'Processing', date: '2026-09-26' },
  ];

  const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@store.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
    { id: 3, name: 'Islomxon Kozim', email: 'islomxonovkozim@gmail.com', role: 'Customer', status: 'Active' },
    { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', status: 'Inactive' },
  ];

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', description: '', category: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60'
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: 'dashboard', label: t('incomeExpenses'), icon: LayoutDashboard },
    { id: 'warehouse', label: t('warehouse'), icon: Box },
    { id: 'order_abroad', label: t('orderAbroad'), icon: Globe },
    { id: 'products', label: t('manageProducts'), icon: Package },
    { id: 'orders', label: t('orders'), icon: ShoppingCart },
    { id: 'users', label: t('customers'), icon: Users },
    { id: 'settings', label: t('storeSettings'), icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#111111] ">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 w-72 h-screen bg-[#D4AF37] text-black p-6 flex flex-col z-50 border-r border-gray-900">
        <div className="mb-12 mt-4">
          <Link to="/" className="text-3xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity block">
            VIP <span className="text-black/70">ADMIN</span>
          </Link>
          <p className="text-black/70 text-sm mt-2 font-medium uppercase tracking-widest">{t('adminPanel')}</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-bold text-left uppercase text-sm tracking-wide ${
                  isActive 
                    ? 'border border-black text-black shadow-lg scale-[1.02]' 
                    : 'text-black/70 hover:bg-black/10 hover:text-black'
                }`}
              >
                <Icon className={`w-5 h-5 ${!isActive && 'opacity-70'}`} />
                <span className="leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-black/20 pt-6 space-y-4">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-black/70 hover:text-black hover:bg-black/10 rounded-xl transition-colors font-bold uppercase text-sm tracking-wide">
             <Globe className="w-5 h-5" /> {t('backToSite')}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8 lg:p-12 min-h-screen">
        
        {/* Topbar for Admin */}
        <div className="flex justify-end items-center gap-4 mb-12">
          <button onClick={toggleLanguage} className="flex items-center gap-2 p-2 px-4 rounded-none bg-background  border border-border text-foreground  hover:bg-gray-100 dark:hover:bg-[#222222] dark:hover:bg-gray-900 transition-colors font-bold uppercase text-xs tracking-widest">
            <Globe className="w-4 h-4" />
            {i18n.language.substring(0,2)}
          </button>
          <button onClick={toggleTheme} className="p-2 px-4 rounded-none bg-background  border border-border text-foreground  hover:bg-gray-100 dark:hover:bg-[#222222] dark:hover:bg-gray-900 transition-colors font-bold uppercase text-xs tracking-widest flex items-center gap-2">
            {theme === 'dark' ? <><Sun className="w-4 h-4" /> LGT</> : <><Moon className="w-4 h-4" /> DRK</>}
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground ">
                {t('overview')}
              </h2>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground/70 uppercase tracking-widest bg-background dark:bg-gray-900 px-4 py-2 border border-border">
                <Activity className="w-4 h-4 text-green-500 animate-pulse" /> {t('live')}
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Card 1: Revenue */}
              <div className="bg-background  p-6 border border-border hover:border-black dark:hover:border-white transition-all duration-500 group animate-in fade-in zoom-in duration-500 delay-100 hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-[#D4AF37] text-black   group-hover:scale-110 transition-transform duration-500">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="flex items-center text-green-500 text-sm font-bold">
                    +15% <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground/70 text-xs font-bold uppercase tracking-widest mb-2">{t('totalRevenue')}</h3>
                  <p className="text-4xl font-black text-foreground  tracking-tight">{formatPrice(24599)}</p>
                </div>
              </div>

              {/* Card 2: Orders */}
              <div className="bg-background  p-6 border border-border hover:border-black dark:hover:border-white transition-all duration-500 group animate-in fade-in zoom-in duration-500 delay-200 hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-[#D4AF37] text-black   group-hover:scale-110 transition-transform duration-500">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <span className="flex items-center text-green-500 text-sm font-bold">
                    +8.2% <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground/70 text-xs font-bold uppercase tracking-widest mb-2">{t('totalOrders')}</h3>
                  <p className="text-4xl font-black text-foreground  tracking-tight">1,245</p>
                </div>
              </div>

              {/* Card 3: Users */}
              <div className="bg-background  p-6 border border-border hover:border-black dark:hover:border-white transition-all duration-500 group animate-in fade-in zoom-in duration-500 delay-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-[#D4AF37] text-black   group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="flex items-center text-green-500 text-sm font-bold">
                    +12% <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground/70 text-xs font-bold uppercase tracking-widest mb-2">{t('activeUsers')}</h3>
                  <p className="text-4xl font-black text-foreground  tracking-tight">8,430</p>
                </div>
              </div>

              {/* Card 4: Conversion Rate */}
              <div className="bg-background  p-6 border border-border hover:border-black dark:hover:border-white transition-all duration-500 group animate-in fade-in zoom-in duration-500 delay-400 hover:-translate-y-2 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-[#D4AF37] text-black   group-hover:scale-110 transition-transform duration-500">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="flex items-center text-red-500 text-sm font-bold">
                    -2.4% <ArrowDownRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground/70 text-xs font-bold uppercase tracking-widest mb-2">{t('conversion')}</h3>
                  <p className="text-4xl font-black text-foreground  tracking-tight">3.2%</p>
                </div>
              </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700 delay-500">
              <div className="bg-background  p-8 border border-border">
                <h3 className="text-2xl font-black mb-2 text-foreground  uppercase tracking-tighter">{t('revenueFlow')}</h3>
                <p className="text-sm text-foreground/70 uppercase tracking-widest mb-8">{t('monthlyEarnings')}</p>
                
                {/* SVG Bar Chart */}
                <div className="flex items-end justify-between h-48 border-b border-border pb-2">
                  {[40, 60, 45, 80, 50, 90, 75, 60, 85, 55, 70, 95].map((val, i) => (
                    <div key={i} className="w-1/12 mx-1 relative group h-full flex items-end">
                      <div 
                        className="w-full bg-background  transition-all duration-500 group-hover:bg-gray-400" 
                        style={{ height: `${val}%` }}
                      ></div>
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#D4AF37] text-black  text-xs px-2 py-1 rounded-none font-bold transition-opacity z-10 pointer-events-none">
                        {val}k
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-foreground/60 uppercase tracking-widest">
                  <span>{t('chartJan')}</span><span>{t('chartApr')}</span><span>{t('chartJul')}</span><span>{t('chartOct')}</span><span>{t('chartDec')}</span>
                </div>
              </div>

              <div className="bg-background  p-8 border border-border">
                <h3 className="text-2xl font-black mb-2 text-foreground  uppercase tracking-tighter">{t('userTraffic')}</h3>
                <p className="text-sm text-foreground/70 uppercase tracking-widest mb-8">{t('activeVisitorsOverTime')}</p>
                
                {/* SVG Line Chart */}
                <div className="w-full h-48 relative border-b border-border pb-2">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <path 
                      d="M 0,35 L 10,25 L 20,28 L 30,15 L 40,20 L 50,10 L 60,18 L 70,12 L 80,22 L 90,8 L 100,10" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className="text-foreground  drop-shadow-md"
                    />
                    <circle cx="10" cy="25" r="1.5" className="fill-black dark:fill-white" />
                    <circle cx="30" cy="15" r="1.5" className="fill-black dark:fill-white" />
                    <circle cx="50" cy="10" r="1.5" className="fill-black dark:fill-white" />
                    <circle cx="70" cy="12" r="1.5" className="fill-black dark:fill-white" />
                    <circle cx="90" cy="8" r="1.5" className="fill-black dark:fill-white" />
                  </svg>
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-foreground/60 uppercase tracking-widest">
                  <span>{t('chartMon')}</span><span>{t('chartWed')}</span><span>{t('chartFri')}</span><span>{t('chartSun')}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-background  p-8 border border-border animate-in slide-in-from-left-8 duration-700 delay-500">
                <h3 className="text-2xl font-black mb-8 text-foreground  uppercase tracking-tighter flex items-center gap-3">
                  <TrendingUp className="w-6 h-6" /> {t('recentActivity')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 group cursor-default">
                    <div className="p-4 bg-gray-100 dark:bg-[#222222] dark:bg-gray-900 group-hover:bg-background group-hover:text-foreground dark:group-hover:bg-background dark:group-hover:text-foreground transition-colors duration-300"><Package className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <p className="text-foreground  font-bold text-lg">{t('recentActivity1')}</p>
                      <p className="text-sm text-foreground/70 uppercase tracking-wider mt-1">{t('twoMinsAgo')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group cursor-default">
                    <div className="p-4 bg-gray-100 dark:bg-[#222222] dark:bg-gray-900 group-hover:bg-background group-hover:text-foreground dark:group-hover:bg-background dark:group-hover:text-foreground transition-colors duration-300"><ShoppingCart className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <p className="text-foreground  font-bold text-lg">{t('recentActivity2')}</p>
                      <p className="text-sm text-foreground/70 uppercase tracking-wider mt-1">{t('oneHourAgo')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group cursor-default">
                    <div className="p-4 bg-gray-100 dark:bg-[#222222] dark:bg-gray-900 group-hover:bg-background group-hover:text-foreground dark:group-hover:bg-background dark:group-hover:text-foreground transition-colors duration-300"><Users className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <p className="text-foreground  font-bold text-lg">{t('recentActivity3')}</p>
                      <p className="text-sm text-foreground/70 uppercase tracking-wider mt-1">{t('fiveHoursAgo')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-background  p-8 border border-border animate-in slide-in-from-right-8 duration-700 delay-500">
                <h3 className="text-2xl font-black mb-8 text-foreground  uppercase tracking-tighter flex items-center gap-3">
                  <Star className="w-6 h-6" /> {t('topProducts')}
                </h3>
                <div className="space-y-6">
                  {products.slice(0, 3).map((product, idx) => (
                    <div key={product.id} className="flex items-center gap-4 group">
                      <div className="text-3xl font-black text-gray-200  group-hover:text-foreground dark:group-hover:text-foreground transition-colors duration-300">0{idx + 1}</div>
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="flex-1">
                        <p className="font-bold text-lg truncate max-w-[200px] text-foreground ">{t(product.name)}</p>
                        <p className="text-foreground/70 text-sm uppercase tracking-wider mt-1">{t(product.category)}</p>
                      </div>
                      <div className="font-black text-lg">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background  p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10 mb-4 sm:mb-0">
                <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-1">
                  {t('manageProducts')}
                </h2>
                <p className="text-foreground/70">{t('manageProductsDesc')}</p>
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="relative z-10 flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 text-foreground px-6 py-3.5 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                {t('addProduct')}
              </button>
            </div>

            <div className="bg-background  rounded-3xl shadow-lg overflow-x-auto border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#111111]/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-border">
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('product')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('category')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('price')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider text-right">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#111111]/50 dark:hover:bg-gray-900/20 transition-colors group">
                      <td className="p-5 flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                        <div>
                          <span className="font-bold block text-foreground ">{t(product.name)}</span>
                          <span className="text-xs text-foreground/60 line-clamp-1 mt-1">{t(product.description)}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-[#222222]  text-foreground/80 ">
                          {t(product.category)}
                        </span>
                      </td>
                      <td className="p-5 font-black text-foreground ">{formatPrice(product.price)}</td>
                      <td className="p-5 text-right space-x-2">
                        <button onClick={() => handleOpenModal(product)} className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => removeProduct(product.id)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WAREHOUSE TAB */}
        {activeTab === 'warehouse' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-5 mb-2">
              <div className="p-4 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner">
                <Box className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground  tracking-tight">{t('warehouse')}</h2>
                <p className="text-foreground/70 /60 font-medium mt-1">{t('warehouseDesc')}</p>
              </div>
            </div>

            <div className="bg-background  rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-foreground/70 text-sm">
                      <th className="p-4 font-medium">{t('product')}</th>
                      <th className="p-4 font-medium">{t('category')}</th>
                      <th className="p-4 font-medium">{t('warehouseStock')}</th>
                      <th className="p-4 font-medium text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-[#111111] dark:hover:bg-gray-700/20 transition-colors">
                        <td className="p-4 flex items-center gap-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          <span className="font-bold text-foreground  line-clamp-1 max-w-[200px]">{t(product.name)}</span>
                        </td>
                        <td className="p-4 text-foreground/70">{t(product.category)}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center justify-center w-12 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold">
                            {parseInt(product.id, 16) % 100 || 24}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => showToast(`${t(product.name)}: ${t('restock')} ${t('orderSent')}`, 'success', 3000)} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-xl font-bold text-sm transition-colors shadow-sm">
                            {t('restock')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDER ABROAD TAB */}
        {activeTab === 'order_abroad' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-5 mb-2">
              <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground  tracking-tight">{t('orderAbroad')}</h2>
                <p className="text-foreground/70 /60 font-medium mt-1">{t('orderAbroadDesc')}</p>
              </div>
            </div>

            <div className="bg-background  rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
              <form onSubmit={(e) => { e.preventDefault(); showToast(t('orderSent'), 'success', 3000); e.currentTarget.reset(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground  mb-2">{t('productName')}</label>
                  <input type="text" required placeholder={t('productNamePlaceholder')} className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground  mb-2">{t('productLink')}</label>
                  <input type="url" required placeholder="https://..." className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-foreground  mb-2">{t('quantity')}</label>
                    <input type="number" required min="1" placeholder="100" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground  mb-2">{t('expectedPrice')}</label>
                    <input type="text" required placeholder="$1000" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-foreground rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99]">
                  {t('placeOrder')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-1">
              {t('orders')}
            </h2>
            <div className="bg-background  rounded-3xl shadow-lg overflow-x-auto border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#111111]/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-border">
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('orderId')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('customer')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('date')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('total')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {mockOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-[#111111]/50 dark:hover:bg-gray-900/20 transition-colors group">
                      <td className="p-5 font-bold text-primary">{order.id}</td>
                      <td className="p-5 font-medium text-foreground ">{order.customer}</td>
                      <td className="p-5 text-foreground/70">{order.date}</td>
                      <td className="p-5 font-black text-foreground ">{formatPrice(order.total)}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.status === 'Delivered' ? t('delivered') :
                           order.status === 'Processing' ? t('processing') :
                           order.status === 'Shipped' ? t('shipped') :
                           t('pending')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-1">
              {t('customers')}
            </h2>
            <div className="bg-background  rounded-3xl shadow-lg overflow-x-auto border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#111111]/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-border">
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('name')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('email')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('role')}</th>
                    <th className="p-5 font-bold text-foreground/70 uppercase text-xs tracking-wider">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {mockUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#111111]/50 dark:hover:bg-gray-900/20 transition-colors group">
                      <td className="p-5 font-bold text-foreground  flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-foreground text-xs">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </td>
                      <td className="p-5 text-foreground/70">{u.email}</td>
                      <td className="p-5 font-medium text-foreground ">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-[#222222]  text-foreground/80 ">
                          {u.role === 'Admin' ? t('admin') : t('customer')}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          u.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 dark:bg-[#333333] text-foreground dark:bg-gray-700 '
                        }`}>
                          {u.status === 'Active' ? t('active') : t('inactive')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-foreground  uppercase tracking-tight mb-1">
                {t('storeSettings')}
              </h2>
              <p className="text-foreground/70 font-medium">Do'kon va Telegram bot integratsiyasini sozlash</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Telegram Bot Integration Card */}
              <div className="bg-background  p-8 border border-border shadow-sm relative">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-border">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground  uppercase tracking-tight">Telegram Bot (Cheklar)</h3>
                    <p className="text-xs text-foreground/70 font-bold uppercase tracking-wider">Buyurtmalarni Telegramga yuborish</p>
                  </div>
                </div>

                <form onSubmit={handleSaveTelegram} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground  mb-2">
                      Bot Token (API Token)
                    </label>
                    <input 
                      type="text" 
                      value={botTokenInput}
                      onChange={(e) => setBotTokenInput(e.target.value)}
                      placeholder="Masalan: 7123456789:AAH..." 
                      className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white font-mono text-xs transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground  mb-2">
                      Chat ID (Guruh yoki Profil ID)
                    </label>
                    <input 
                      type="text" 
                      value={chatIdInput}
                      onChange={(e) => setChatIdInput(e.target.value)}
                      placeholder="Masalan: 123456789 yoki -100..." 
                      className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white font-mono text-xs transition-colors" 
                    />
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900/60 border border-border rounded-xl text-xs space-y-1.5 text-foreground/70 leading-relaxed">
                    <p className="font-bold text-foreground ">📌 Botni ulash bo'yicha ko'rsatma:</p>
                    <p>1. Telegramda <b>@BotFather</b> ga kirib, <code>/newbot</code> buyrug'i bilan bot oching va tokenni oling.</p>
                    <p>2. Telegramda <b>@userinfobot</b> ga kirib, o'z raqamli <b>Id</b> raqamingizni oling.</p>
                    <p>3. Ochgan botingizga kirib, <b>/start</b> tugmasini bir marta bosing (aks holda Telegram bot sizga xabar yuborolmaydi)!</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                      type="submit" 
                      className="flex-1 py-3.5 bg-[#D4AF37] text-black  font-bold uppercase text-xs tracking-widest hover:opacity-80 transition-opacity"
                    >
                      {t('saveChanges')}
                    </button>
                    <button 
                      type="button"
                      disabled={isTestingBot}
                      onClick={handleTestBot}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-300 dark:border-gray-700 font-bold uppercase text-xs tracking-widest hover:bg-gray-100 dark:hover:bg-[#222222] dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isTestingBot ? 'Yuborilmoqda...' : 'Botni tekshirish'}
                    </button>
                  </div>
                </form>
              </div>

              {/* General Store Info Card */}
              <div className="bg-background  p-8 border border-border shadow-sm">
                <h3 className="text-xl font-black text-foreground  uppercase tracking-tight mb-6 pb-4 border-b border-gray-100 dark:border-border">
                  {t('storeSettings')}
                </h3>
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); showToast(t('saveChanges'), 'success', 3000); }}>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground  mb-2">{t('storeNameLabel')}</label>
                    <input type="text" defaultValue="VIP BRAND" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white font-medium text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground  mb-2">{t('supportEmail')}</label>
                    <input type="email" defaultValue="support@vipbrand.uz" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white font-medium text-sm transition-colors" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#D4AF37] text-black  font-bold uppercase text-xs tracking-widest hover:opacity-80 transition-opacity">
                    {t('saveChanges')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-background dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-border">
              <h2 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {editingProduct ? t('editProduct') : t('addProduct')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-[#222222]  hover:bg-gray-200 dark:hover:bg-[#333333] dark:hover:bg-gray-700 text-foreground/70 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground  mb-2">{t('nameLabel')}</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#111111]  border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-foreground  mb-2">{t('priceLabel')}</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#111111]  border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground  mb-2">{t('categoryLabel')}</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#111111]  border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground  mb-2">{t('imageLabel')}</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#111111]  border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-primary transition-all" placeholder={t('imagePlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground  mb-2">{t('descLabel')}</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-[#111111]  border-none ring-1 ring-gray-200 dark:ring-gray-700 text-foreground  outline-none focus:ring-2 focus:ring-primary transition-all"></textarea>
              </div>
              
              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3.5 rounded-xl bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:hover:bg-[#333333]  dark:hover:bg-gray-700 font-bold transition-colors">
                  {t('cancel')}
                </button>
                <button type="submit" className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-foreground font-bold transition-all shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
                  {t('saveProduct')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
