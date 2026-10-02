import { useTranslation } from 'react-i18next';

const exchangeRates = {
  en: 1,
  ru: 92,
  uz: 12600,
};

const currencySymbols = {
  en: '$',
  ru: '₽',
  uz: "so'm",
};

export const useCurrency = () => {
  const { i18n } = useTranslation();

  const formatPrice = (priceInUSD: number) => {
    // Determine language, fallback to 'en'
    let lang = i18n.language || 'en';
    if (lang.includes('-')) {
      lang = lang.split('-')[0];
    }
    if (!exchangeRates[lang as keyof typeof exchangeRates]) {
      lang = 'en'; // fallback
    }

    const rate = exchangeRates[lang as keyof typeof exchangeRates] || 1;
    const symbol = currencySymbols[lang as keyof typeof currencySymbols] || '$';
    
    const convertedPrice = priceInUSD * rate;

    if (lang === 'uz') {
      return `${convertedPrice.toLocaleString('uz-UZ', { maximumFractionDigits: 0 })} ${symbol}`;
    } else if (lang === 'ru') {
      return `${convertedPrice.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ${symbol}`;
    }
    
    return `${symbol}${convertedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return { formatPrice };
};
