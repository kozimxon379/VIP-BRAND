import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  user: any | null;
  setUser: (user: any | null) => void;

  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;

  favorites: Product[];
  toggleFavorite: (product: Product) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  removeToast: (id: string) => void;

  telegramBotToken: string;
  telegramChatId: string;
  setTelegramConfig: (token: string, chatId: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'VIP Premium Golden Watch',
    price: 1299.99,
    description: 'VIP Premium Golden Watch Desc',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '2',
    name: 'VIP Italian Leather Jacket',
    price: 899.99,
    description: 'VIP Italian Leather Jacket Desc',
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=500&q=60',
    category: 'Men'
  },
  {
    id: '3',
    name: 'VIP Signature Silk Gown',
    price: 1500.00,
    description: 'VIP Signature Silk Gown Desc',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=500&q=60',
    category: 'Women'
  },
  {
    id: '4',
    name: 'VIP Gold-Plated Sunglasses',
    price: 450.00,
    description: 'VIP Gold-Plated Sunglasses Desc',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '5',
    name: 'VIP Luxury Handbag',
    price: 2100.00,
    description: 'VIP Luxury Handbag Desc',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '6',
    name: 'VIP Royal Cashmere Scarf',
    price: 250.00,
    description: 'VIP Royal Cashmere Scarf Desc',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&q=60',
    category: 'Women'
  },
  {
    id: '7',
    name: 'Classic Blue Jeans',
    price: 79.99,
    description: 'Comfortable straight-leg blue jeans.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=60',
    category: 'Men'
  },
  {
    id: '8',
    name: 'Silk Scarf',
    price: 45.00,
    description: 'Elegant silk scarf with premium texture.',
    image: 'https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '9',
    name: 'Casual Hoodie',
    price: 55.00,
    description: 'Cozy and comfortable cotton blend hoodie.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=60',
    category: 'Unisex'
  },
  {
    id: '10',
    name: 'Formal Leather Shoes',
    price: 110.50,
    description: 'Classic formal leather shoes for special occasions.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=60',
    category: 'Shoes'
  },
  {
    id: '11',
    name: 'Black Canvas Backpack',
    price: 49.99,
    description: 'Durable and spacious black canvas backpack for everyday use.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=60',
    category: 'Unisex'
  },
  {
    id: '12',
    name: 'Trendy Sunglasses',
    price: 34.99,
    description: 'Stand out with these unique and trendy sunglasses.',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '13',
    name: 'Leather Wallet',
    price: 39.99,
    description: 'Premium leather wallet with multiple card slots.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '14',
    name: 'Vintage Pocket Watch',
    price: 120.00,
    description: 'Classic vintage pocket watch with intricate details.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '15',
    name: 'Women\'s Handbag',
    price: 79.99,
    description: 'Elegant handbag with spacious interior and gold accents.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=60',
    category: 'Women'
  },
  {
    id: '16',
    name: 'Nike Air Force 1 07',
    price: 115.00,
    description: 'Classic basketball icon with crisp leather and pristine style.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=60',
    category: 'Shoes'
  },
  {
    id: '17',
    name: 'Nike Air Max 90',
    price: 130.00,
    description: 'Nothing as fly, nothing as comfortable, nothing as proven.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60',
    category: 'Shoes'
  },
  {
    id: '18',
    name: 'Nike Dunk Low Retro',
    price: 115.00,
    description: 'Created for the hardwood but taken to the streets with classic 80s vibes.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=60',
    category: 'Shoes'
  },
  {
    id: '19',
    name: 'Nike Air Jordan 1 Mid',
    price: 125.00,
    description: 'Inspired by the original AJ1, offering classic court style and comfort.',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=500&q=60',
    category: 'Shoes'
  },
  {
    id: '20',
    name: 'Nike ZoomX Vaporfly Next',
    price: 250.00,
    description: 'Elite marathon racing shoes with unmatched responsiveness and speed.',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=60',
    category: 'Shoes'
  },
  {
    id: '21',
    name: 'Nike Tech Fleece Windrunner',
    price: 140.00,
    description: 'Premium lightweight fleece smooth both inside and out for optimal warmth.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=60',
    category: 'Men'
  },
  {
    id: '22',
    name: 'Nike Sportswear Club Fleece Hoodie',
    price: 65.00,
    description: 'Soft brushed-back fleece with standard fit for everyday cozy comfort.',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=500&q=60',
    category: 'Men'
  },
  {
    id: '23',
    name: 'Nike Pro Dri-FIT Leggings',
    price: 50.00,
    description: 'Stretchy fabric with sweat-wicking power to keep you supported and dry.',
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=500&q=60',
    category: 'Women'
  },
  {
    id: '24',
    name: 'Nike Indy Light-Support Sports Bra',
    price: 38.00,
    description: 'Soft and breathable design crafted for gentle support during daily workouts.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=60',
    category: 'Women'
  },
  {
    id: '25',
    name: 'Nike Sportswear Phoenix Fleece',
    price: 75.00,
    description: 'Exaggerated ribbing and structured comfort elevate your everyday style.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=60',
    category: 'Women'
  },
  {
    id: '26',
    name: 'Nike Heritage Waistpack',
    price: 28.00,
    description: 'Convenient hands-free storage for phone, keys and small essentials.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '27',
    name: 'Nike Club Cap',
    price: 26.00,
    description: 'Classic curved bill with adjustable strap and embroidered Swoosh logo.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '28',
    name: 'Nike Everyday Cushioned Socks',
    price: 22.00,
    description: 'Thick terry sole provides extra comfort for footdrills and lifts.',
    image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=500&q=60',
    category: 'Accessories'
  },
  {
    id: '29',
    name: 'Nike Sportswear Windrunner Jacket',
    price: 110.00,
    description: 'Iconic chevron chest lines and weather-resistant breathable shell.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=60',
    category: 'Unisex'
  },
  {
    id: '30',
    name: 'Nike Brasilia Training Duffel Bag',
    price: 42.00,
    description: 'Spacious main compartment and dedicated shoe storage for gym gear.',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=500&q=60',
    category: 'Unisex'
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      user: null,
      setUser: (user) => set({ user }),

      products: mockProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (product) => set((state) => ({
        products: state.products.map(p => p.id === product.id ? product : p)
      })),
      removeProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      cart: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const qty = quantity || 1;
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item => 
              item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: qty }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(item => item.id === id ? { ...item, quantity } : item)
      })),
      clearCart: () => set({ cart: [] }),

      favorites: [],
      toggleFavorite: (product) => set((state) => {
        const exists = state.favorites.find(p => p.id === product.id);
        if (exists) {
          return { favorites: state.favorites.filter(p => p.id !== product.id) };
        }
        return { favorites: [...state.favorites, product] };
      }),

      toasts: [],
      showToast: (message, type = 'success', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, duration }]
        }));

        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }));
        }, duration);
      },
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),

      telegramBotToken: '8790244945:AAGmQUSi8FEXOl8QEYWnF56beWHYWFuo4DM',
      telegramChatId: '6575332225',
      setTelegramConfig: (telegramBotToken, telegramChatId) => set({ telegramBotToken, telegramChatId })
    }),
    {
      name: 'online-store-storage',
      version: 16,
      migrate: (persistedState: any) => {
        return {
          ...(persistedState || {}),
          products: mockProducts,
          telegramBotToken: '8790244945:AAGmQUSi8FEXOl8QEYWnF56beWHYWFuo4DM',
          telegramChatId: '6575332225'
        };
      },
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        products: state.products,
        cart: state.cart,
        favorites: state.favorites,
        telegramBotToken: state.telegramBotToken,
        telegramChatId: state.telegramChatId
      })
    }
  )
);
