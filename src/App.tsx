import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles, Database, ShieldCheck, Heart, Trash2, HelpCircle } from 'lucide-react';
import PhoneSimulator from './components/PhoneSimulator';
import StorefrontApp from './components/StorefrontApp';
import StudioManager from './components/StudioManager';
import SalesMetrics from './components/SalesMetrics';
import { DEFAULT_STORES } from './data';
import { StoreConfig, Product, CartItem, OrderLog, ChatMessage } from './types';

export default function App() {
  const [activeStoreId, setActiveStoreId] = useState<string>('aether');
  
  // Custom Product catalogs state map: Record of storeId to customized products arrays
  const [customProductsMap, setCustomProductsMap] = useState<Record<string, Product[]>>(() => {
    const saved = localStorage.getItem('studio_custom_catalogs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default initial map
    const initialMap: Record<string, Product[]> = {};
    DEFAULT_STORES.forEach((s) => {
      initialMap[s.id] = s.products;
    });
    return initialMap;
  });

  // Individual active store customization inputs
  const [storeConfigOverrideMap, setStoreConfigOverrideMap] = useState<Record<string, Partial<StoreConfig>>>(() => {
    const saved = localStorage.getItem('studio_store_overrides');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  // Global carts state matching items
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('studio_cart_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Simulated validated historic transactions orders state
  const [ordersLog, setOrdersLog] = useState<OrderLog[]>(() => {
    const saved = localStorage.getItem('studio_orders_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Active loaded store configs
  const activeStoreBase = DEFAULT_STORES.find(s => s.id === activeStoreId) || DEFAULT_STORES[0];
  const activeCustomOverride = storeConfigOverrideMap[activeStoreId] || {};
  const activeStoreConfig: StoreConfig = {
    ...activeStoreBase,
    name: activeCustomOverride.name ?? activeStoreBase.name,
    tagline: activeCustomOverride.tagline ?? activeStoreBase.tagline,
    themeColor: activeCustomOverride.themeColor ?? activeStoreBase.themeColor,
    fontFamily: activeCustomOverride.fontFamily ?? activeStoreBase.fontFamily,
    products: customProductsMap[activeStoreId] || activeStoreBase.products
  };

  // Active coupon reduction codes
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);

  // Gemini assistant active config key diagnostic check
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<'cms' | 'sales'>('cms');

  // Load individual Store chatbot greeting dialogue
  const [aiChatLogsMap, setAiChatLogsMap] = useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    const fetchApiConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        setHasGeminiKey(data.hasGeminiKey);
      } catch (e) {
        console.warn('API config diagnostic skipped.');
      }
    };
    fetchApiConfig();
  }, []);

  // Sync state data items to local storage
  useEffect(() => {
    localStorage.setItem('studio_custom_catalogs', JSON.stringify(customProductsMap));
  }, [customProductsMap]);

  useEffect(() => {
    localStorage.setItem('studio_store_overrides', JSON.stringify(storeConfigOverrideMap));
  }, [storeConfigOverrideMap]);

  useEffect(() => {
    localStorage.setItem('studio_cart_items', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('studio_orders_logs', JSON.stringify(ordersLog));
  }, [ordersLog]);

  // Clean-up reset triggers
  const resetToDefaults = () => {
    const freshMap: Record<string, Product[]> = {};
    DEFAULT_STORES.forEach((s) => {
      freshMap[s.id] = s.products;
    });
    setCustomProductsMap(freshMap);
    setStoreConfigOverrideMap({});
    setCart([]);
    setAppliedDiscount(null);
  };

  // State handlers inside cart items
  const addToCart = (product: Product, color: string, size?: string) => {
    const compId = `${product.id}-${color}-${size || 'default'}`;
    setCart((prev) => {
      const existing = prev.find(item => item.id === compId);
      if (existing) {
        return prev.map(item => item.id === compId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: compId, product, quantity: 1, selectedColor: color, selectedSize: size }];
    });
  };

  const updateQuantity = (itemId: string, direction: 'inc' | 'dec') => {
    setCart((prev) => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;
      if (direction === 'dec' && item.quantity === 1) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i => i.id === itemId ? { ...i, quantity: direction === 'inc' ? i.quantity + 1 : i.quantity - 1 } : i);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const handleApplyDiscount = (code: string) => {
    setAppliedDiscount(code);
  };

  // Track Successful checkout simulation inside general orders log
  const handleCheckoutSuccess = (order: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: { productName: string; quantity: number; price: number; color: string; size?: string }[];
    total: number;
  }) => {
    const orderLogEntry: OrderLog = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      storeId: activeStoreId,
      storeName: activeStoreConfig.name,
      items: order.items,
      total: order.total,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      status: 'confirmed',
      timestamp: new Date().toLocaleString()
    };

    setOrdersLog(prev => [orderLogEntry, ...prev]);

    // Fast-tick mock shipping statuses (packing ➔ intransit ➔ delivered)
    setTimeout(() => {
      setOrdersLog(prev => prev.map(o => o.id === orderLogEntry.id ? { ...o, status: 'packing' } : o));
    }, 7000);
    setTimeout(() => {
      setOrdersLog(prev => prev.map(o => o.id === orderLogEntry.id ? { ...o, status: 'intransit' } : o));
    }, 14000);
    setTimeout(() => {
      setOrdersLog(prev => prev.map(o => o.id === orderLogEntry.id ? { ...o, status: 'delivered' } : o));
    }, 21000);
  };

  // Lazy instantiate active dialogues maps
  const activeChatLogs = aiChatLogsMap[activeStoreId] || [
    {
      id: 'greet-1',
      role: 'assistant',
      text: activeStoreId === 'aether' 
        ? "Hello! I am your Aether Sport virtual shopping guide. I can recommend carbon-plated runners, look up windbreakers, or apply the coupon score code RUNATHLETICS! Try asking: 'Add details for running shoes' or 'can you suggest accessories?'" 
        : activeStoreId === 'nova' 
        ? "Welcome to Nova Audio Labs. I am the Nova tech co-pilot. I can locate adaptive ANC headphones, omnidirectional spatial speakers, and apply NOVASOUND. Ask me any headphone tech questions!" 
        : "Greetings, creative writer. Vellum Slate assistant here. I can recommend modernist linen journals, weighted brass writing ink sets, and apply the code ARTIFACT. What items shall we look up?"
    }
  ];

  const handleUpdateActiveChatLogs = (updater: React.SetStateAction<ChatMessage[]>) => {
    setAiChatLogsMap(prev => {
      const current = prev[activeStoreId] || [
        {
          id: 'greet-1',
          role: 'assistant',
          text: activeStoreId === 'aether' 
            ? "Hello! I am your Aether Sport virtual shopping guide. I can recommend carbon-plated runners, look up windbreakers, or apply the coupon score code RUNATHLETICS! Try asking: 'Add details for running shoes' or 'can you suggest accessories?'" 
            : activeStoreId === 'nova' 
            ? "Welcome to Nova Audio Labs. I am the Nova tech co-pilot. I can locate adaptive ANC headphones, omnidirectional spatial speakers, and apply NOVASOUND. Ask me any headphone tech questions!" 
            : "Greetings, creative writer. Vellum Slate assistant here. I can recommend modernist linen journals, weighted brass writing ink sets, and apply the code ARTIFACT. What items shall we look up?"
        }
      ];
      const next = typeof updater === 'function' ? updater(current) : updater;
      return { ...prev, [activeStoreId]: next };
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Studio Header Nav block */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md px-6 py-5 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-neutral-100 border border-neutral-250/80 rounded-xl text-[#1A1A1A]">
              <Smartphone className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-semibold text-stone-400">STUDIO ENVIRONMENT // COLLECTION 2026</div>
              <h1 className="text-2xl font-serif font-black tracking-tight text-[#1A1A1A] flex items-center gap-1.5 mt-0.5">
                Aurore <span className="italic font-normal text-stone-400">Maison</span> <span className="text-[10px] font-mono tracking-normal bg-stone-100 border border-stone-200 text-stone-600 py-0.5 px-2.5 rounded-full font-bold">SIMULATOR v1.4</span>
              </h1>
              <p className="text-xs text-stone-550 font-light mt-0.5 max-w-lg">
                Refining digital shopping previews through intentional minimalism and editorial precision.
              </p>
            </div>
          </div>

          {/* AI Connection Status Diagnostics */}
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 bg-neutral-100 border border-stone-200 px-3 py-1.5 rounded-full text-stone-650 text-[10px] uppercase font-semibold">
              <Database className="h-3.5 w-3.5 text-stone-500" /> State: LOCAL_DURABLE
            </span>
            <span className={`flex items-center gap-1.5 bg-neutral-100 border border-stone-200 px-3 py-1.5 rounded-full ${hasGeminiKey ? 'text-emerald-750' : 'text-stone-750'} text-[10px] uppercase font-semibold`}>
              <Sparkles className="h-3.5 w-3.5" /> AI: {hasGeminiKey ? 'GENAI_MODEL_ACTIVE' : 'RULE_SIMULATOR_ACTIVE'}
            </span>
          </div>

        </div>
      </header>

      {/* Main Studio Split Layout Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center Area: Dynamic Smartphone frame displaying shop preview */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center">
            
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold font-mono uppercase tracking-[0.3em] text-stone-400 bg-neutral-100 py-1.5 px-4 border border-stone-205 rounded-full">
                Interactive Viewport
              </span>
              <p className="text-xs text-stone-500 italic font-serif mt-2.5">
                Every interaction is styled with editorial precision. Select, chat, and test.
              </p>
            </div>

            <PhoneSimulator themeColor={activeStoreConfig.themeColor}>
              <StorefrontApp
                store={activeStoreConfig}
                customProducts={customProductsMap[activeStoreId] || activeStoreBase.products}
                cart={cart}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                onCheckoutSuccess={handleCheckoutSuccess}
                appliedDiscount={appliedDiscount}
                applyDiscountCode={handleApplyDiscount}
                aiMessages={activeChatLogs}
                setAiMessages={handleUpdateActiveChatLogs}
              />
            </PhoneSimulator>

          </div>

          {/* Right Area: Workspace Configuration CMS Panel & sales logs dashboards */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            
            {/* Double tabs buttons selectors */}
            <div className="flex bg-[#F9F7F5] rounded-2xl p-1 border border-stone-200">
              <button
                onClick={() => setActiveRightTab('cms')}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  activeRightTab === 'cms'
                    ? 'bg-white text-[#1A1A1A] shadow-xs border border-stone-200/80 font-serif'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                1. Edit Styling & Catalog (CMS)
              </button>
              <button
                onClick={() => setActiveRightTab('sales')}
                className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                  activeRightTab === 'sales'
                    ? 'bg-white text-[#1A1A1A] shadow-xs border border-stone-200/80 font-serif'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                2. Live Sales Desk
              </button>
            </div>

            {/* Display active container tab */}
            {activeRightTab === 'cms' ? (
              <StudioManager
                stores={DEFAULT_STORES}
                activeStoreId={activeStoreId}
                setActiveStoreId={setActiveStoreId}
                customProducts={customProductsMap[activeStoreId] || activeStoreBase.products}
                setCustomProducts={(updater) => {
                  setCustomProductsMap(prev => {
                    const current = prev[activeStoreId] || activeStoreBase.products;
                    const next = typeof updater === 'function' ? updater(current) : updater;
                    return { ...prev, [activeStoreId]: next };
                  });
                }}
                storeConfigOverride={storeConfigOverrideMap[activeStoreId] || {}}
                setStoreConfigOverride={(updater) => {
                  setStoreConfigOverrideMap(prev => {
                    const current = prev[activeStoreId] || {};
                    const next = typeof updater === 'function' ? updater(current) : updater;
                    return { ...prev, [activeStoreId]: next };
                  });
                }}
                resetToDefaults={resetToDefaults}
              />
            ) : (
              <SalesMetrics
                orders={ordersLog}
                cart={cart}
                themeColor={activeStoreConfig.themeColor}
              />
            )}

            {/* Simulated instructions panel */}
            <div className="bg-[#F9F7F5] p-5 rounded-3xl border border-stone-200 font-serif text-[11px] text-stone-600 space-y-3 shadow-xs">
              <span className="uppercase font-bold text-[#1A1A1A] tracking-wider text-[11px] block border-b border-stone-200 pb-2">💡 Quick Guide Details</span>
              <p className="leading-relaxed"> Speak to the <strong className="text-stone-800">AI Assistant</strong> in the phone to test real-world agent integration (e.g. Try typing: <span className="italic text-stone-500 font-sans">"add the red runner to my cart"</span> or asking <span className="italic text-stone-550 font-sans">"What is unique about your wireless speakers?"</span>).</p>
              <p className="leading-relaxed"> Make changes to branding text or prices in the CMS, and they will reflect <strong className="text-[#1A1A1A]">instantly</strong> inside the AMOLED phone simulation frame.</p>
            </div>

          </div>

        </div>
      </main>

      {/* Humble neat footer alignment */}
      <footer className="border-t border-stone-200 py-8 text-center text-[10px] text-stone-400 font-serif italic bg-[#F9F7F5]">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Mobile Store Studio. All Rights Reserved. Crafted with editorial precision.</p>
        </div>
      </footer>

    </div>
  );
}

