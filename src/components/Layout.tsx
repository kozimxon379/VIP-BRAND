import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, User, Sun, Moon, Search, Globe, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCurrency } from '../hooks/useCurrency';

export const Layout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { theme, setTheme, cart, favorites, user, setUser, products } = useStore();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'uz' ? 'ru' : i18n.language === 'ru' ? 'en' : 'uz';
    i18n.changeLanguage(nextLang);
  };

  const [searchValue, setSearchValue] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  const searchResults = React.useMemo(() => {
    if (!searchValue.trim()) return [];
    const lowerSearch = searchValue.toLowerCase();
    return products.filter(p => 
      t(p.name).toLowerCase().includes(lowerSearch) || 
      t(p.description).toLowerCase().includes(lowerSearch) ||
      p.name.toLowerCase().includes(lowerSearch)
    ).slice(0, 5);
  }, [searchValue, products, t]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setIsSearchFocused(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background  border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl sm:text-3xl font-black tracking-tighter uppercase flex items-center">
            <span className="text-foreground ">VIP</span>
            <span className="text-foreground/70 ml-1.5">BRAND</span>
          </Link>

          <nav className="hidden md:flex space-x-6 items-center uppercase font-bold text-sm tracking-wide">
            <Link to="/" className="hover:text-foreground/70 transition-colors">{t('home')}</Link>
            <Link to="/products" className="hover:text-foreground/70 transition-colors">{t('products')}</Link>
            <Link to="/categories" className="hover:text-foreground/70 transition-colors">{t('categories')}</Link>
            <Link to="/sale" className="hover:text-foreground/70 transition-colors">{t('sale')}</Link>
            <Link to="/contact" className="hover:text-foreground/70 transition-colors">{t('contact')}</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground">
                <Search className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                placeholder={t('search')} 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="pl-9 pr-4 py-2 rounded-full bg-gray-100 dark:bg-[#222222] text-foreground border-none outline-none transition-all w-48 focus:w-64 font-medium"
              />
              
              {/* Search Dropdown */}
              {isSearchFocused && searchValue.trim() && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      {searchResults.map(product => (
                        <Link 
                          key={product.id} 
                          to={`/products/${product.id}`}
                          onClick={() => setSearchValue('')}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors border-b border-border last:border-0"
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 overflow-hidden text-left">
                            <p className="text-sm font-bold text-foreground truncate">{t(product.name)}</p>
                            <p className="text-xs text-foreground/70 mt-0.5">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-foreground/70 font-bold">
                      {t('productNotFound')}
                    </div>
                  )}
                </div>
              )}
            </form>

            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222]  text-foreground  transition-colors flex items-center gap-1 text-sm font-medium">
              <Globe className="w-5 h-5" />
              <span className="uppercase">{i18n.language.substring(0,2)}</span>
            </button>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222]  text-foreground  transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link to="/favorites" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222]  text-foreground  transition-colors relative">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-secondary text-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222]  text-foreground  transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-foreground text-xs rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to={(user.role === 'admin' || user.username.includes('islomxonov')) ? '/admin' : '/profile'} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222]  text-foreground  transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#222222]  transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2 bg-[#D4AF37]  text-black  rounded-full hover:opacity-70 transition-opacity font-bold text-sm uppercase tracking-wide">
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-background text-foreground py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/60 mb-4 font-medium">&copy; {new Date().getFullYear()} VIP BRAND. {t('allRightsReserved')}</p>
          <div className="flex justify-center gap-6 uppercase font-bold text-xs tracking-wider">
            <Link to="/" className="text-foreground/60 hover:text-foreground transition-colors">{t('home')}</Link>
            <Link to="/products" className="text-foreground/60 hover:text-foreground transition-colors">{t('products')}</Link>
            <Link to="/categories" className="text-foreground/60 hover:text-foreground transition-colors">{t('categories')}</Link>
            <Link to="/sale" className="text-foreground/60 hover:text-foreground transition-colors">{t('sale')}</Link>
            <Link to="/contact" className="text-foreground/60 hover:text-foreground transition-colors">{t('contact')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
