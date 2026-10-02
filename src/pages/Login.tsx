import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Lock, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (identifier === 'admin' || identifier.includes('islomxonov')) {
      setUser({ username: identifier, role: 'admin', name: identifier });
      navigate('/admin');
    } else {
      setUser({ username: identifier, role: 'user', name: identifier });
      navigate('/profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">{t('login')}</h2>
          <p className="text-foreground/70 font-medium">{t('welcomeBack')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-foreground/70">{t('phoneOrUsername')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
              <input 
                type="text" 
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t('usernamePlaceholder')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-foreground/70">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#111111] dark:bg-gray-900 border border-border text-foreground  outline-none focus:border-black dark:focus:border-white transition-colors font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-[#D4AF37] text-black font-black text-lg uppercase tracking-wide hover:bg-[#b8952c] transition-colors active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {t('submit')} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/70">
          <p className="font-medium">{t('adminCredentials')}</p>
        </div>
      </div>
    </div>
  );
};
