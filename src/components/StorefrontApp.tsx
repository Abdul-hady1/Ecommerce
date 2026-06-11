import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Search, Sparkles, ArrowLeft, Star, Heart, 
  Trash2, Plus, Minus, ChevronRight, CreditCard, ShieldCheck, 
  CheckCircle, RefreshCw, Send, HelpCircle, MapPin, Compass
} from 'lucide-react';
import { Product, CartItem, ChatMessage, StoreConfig } from '../types';

interface StorefrontAppProps {
  store: StoreConfig;
  customProducts: Product[];
  cart: CartItem[];
  addToCart: (product: Product, color: string, size?: string) => void;
  updateQuantity: (itemId: string, direction: 'inc' | 'dec') => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  onCheckoutSuccess: (orderDetails: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    items: { productName: string; quantity: number; price: number; color: string; size?: string }[];
    total: number;
  }) => void;
  appliedDiscount: string | null;
  applyDiscountCode: (code: string) => void;
  aiMessages: ChatMessage[];
  setAiMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function StorefrontApp({
  store,
  customProducts,
  cart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  onCheckoutSuccess,
  appliedDiscount,
  applyDiscountCode,
  aiMessages,
  setAiMessages
}: StorefrontAppProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'cart' | 'assistant'>('home');
  const [activeScreen, setActiveScreen] = useState<'browse' | 'details' | 'checkout' | 'success'>('browse');
  
  // Navigation stack state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Checkout Form Details
  const [customerName, setCustomerName] = useState('Jane Doe');
  const [customerEmail, setCustomerEmail] = useState('jane.doe@example.com');
  const [shippingAddress, setShippingAddress] = useState('1088 Amphitheatre Pkwy, Mountain View, CA');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('505');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [couponBadge, setCouponBadge] = useState<string | null>(null);

  // Delivery status tracker details
  const [deliveryStep, setDeliveryStep] = useState(0);
  const [activeOrderDetails, setActiveOrderDetails] = useState<any>(null);

  // Chat/AI State
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Favorites collection setup
  const [favorites, setFavorites] = useState<string[]>([]);

  // Category listing resolve
  const categories = ['All', ...Array.from(new Set(customProducts.map(p => p.category)))];

  // Map theme setup
  const getThemeColors = () => {
    switch (store.themeColor) {
      case 'emerald':
        return {
          primary: 'bg-emerald-900 hover:bg-[#1A1A1A] text-white tracking-widest font-serif transition-colors',
          bgLight: 'bg-emerald-50 border border-emerald-100',
          text: 'text-emerald-800',
          border: 'border-emerald-200/60',
          ring: 'focus:ring-emerald-750',
          textOn: 'text-emerald-950',
          bgHex: '#064E3B',
          accentBorder: 'border-emerald-900'
        };
      case 'sky':
        return {
          primary: 'bg-cyan-950 hover:bg-[#1A1A1A] text-white tracking-widest font-serif transition-colors',
          bgLight: 'bg-sky-50/80 border border-sky-100/80',
          text: 'text-sky-850',
          border: 'border-sky-205/60',
          ring: 'focus:ring-sky-750',
          textOn: 'text-sky-950',
          bgHex: '#082F49',
          accentBorder: 'border-sky-900'
        };
      case 'amber':
        return {
          primary: 'bg-amber-950 hover:bg-[#1A1A1A] text-white tracking-widest font-serif transition-colors',
          bgLight: 'bg-amber-50/80 border border-amber-100/80',
          text: 'text-amber-850',
          border: 'border-amber-205/60',
          ring: 'focus:ring-amber-700',
          textOn: 'text-amber-950',
          bgHex: '#451A03',
          accentBorder: 'border-amber-900'
        };
      case 'rose':
        return {
          primary: 'bg-rose-950 hover:bg-[#1A1A1A] text-white tracking-widest font-serif transition-colors',
          bgLight: 'bg-rose-50 border border-rose-100',
          text: 'text-rose-850',
          border: 'border-rose-205/60',
          ring: 'focus:ring-rose-700',
          textOn: 'text-rose-950',
          bgHex: '#4C0519',
          accentBorder: 'border-rose-900'
        };
      case 'indigo':
        return {
          primary: 'bg-neutral-900 hover:bg-stone-900 text-white tracking-widest font-serif transition-colors',
          bgLight: 'bg-stone-100/80 border border-stone-200/60',
          text: 'text-stone-850',
          border: 'border-stone-250/60',
          ring: 'focus:ring-neutral-750',
          textOn: 'text-stone-950',
          bgHex: '#1C1917',
          accentBorder: 'border-stone-800'
        };
    }
  };

  const style = getThemeColors();

  const getFontClass = () => {
    if (store.fontFamily === 'serif') return 'font-serif';
    if (store.fontFamily === 'mono') return 'font-mono';
    return 'font-sans';
  };

  const selectProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes ? product.sizes[0] : '');
    setActiveScreen('details');
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Helper pricing calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  const getDiscountValue = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount === 'RUNATHLETICS') return subtotal * 0.15; // 15% off
    if (appliedDiscount === 'NOVASOUND') return Math.min(20, subtotal); // $20 off
    if (appliedDiscount === 'ARTIFACT') return subtotal * 0.10; // 10% off
    return 0;
  };

  const discount = getDiscountValue();
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount + shipping);

  // Trigger Promo applying
  const handleApplyPromo = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'RUNATHLETICS' && store.id === 'aether') {
      applyDiscountCode(cleanCode);
      setPromoError('');
      setCouponBadge('15% OFF applied');
    } else if (cleanCode === 'NOVASOUND' && store.id === 'nova') {
      applyDiscountCode(cleanCode);
      setPromoError('');
      setCouponBadge('$20.00 OFF applied');
    } else if (cleanCode === 'ARTIFACT' && store.id === 'vellum') {
      applyDiscountCode(cleanCode);
      setPromoError('');
      setCouponBadge('10% OFF applied');
    } else {
      setPromoError('Invalid code for this applet.');
    }
    setPromoInput('');
  };

  // Trigger Checkout finalize
  const handleSubmitCheckout = () => {
    setIsSubmittingOrder(true);
    
    setTimeout(() => {
      const orderItems = cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        color: item.selectedColor,
        size: item.selectedSize
      }));

      const finalOrder = {
        customerName,
        customerEmail,
        shippingAddress,
        items: orderItems,
        total: parseFloat(total.toFixed(2))
      };

      onCheckoutSuccess(finalOrder);
      setActiveOrderDetails(finalOrder);
      setIsSubmittingOrder(false);
      clearCart();
      setActiveScreen('success');
      setDeliveryStep(0);
    }, 1500);
  };

  // Simulated live delivery tracker ticks
  useEffect(() => {
    if (activeScreen === 'success' && deliveryStep < 3) {
      const interval = setInterval(() => {
        setDeliveryStep(prev => prev + 1);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [activeScreen, deliveryStep]);

  // Handle AI Chat submissions
  const handleSendChat = async (messageText?: string) => {
    const textToSend = messageText || userInput;
    if (!textToSend.trim() || isAiTyping) return;

    setUserInput('');
    
    // Add user message to history
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };
    
    const nextMessages = [...aiMessages, userMsg];
    setAiMessages(nextMessages);
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeId: store.id,
          messages: nextMessages,
          customProducts: customProducts
        }),
      });

      const data = await response.json();
      
      setIsAiTyping(false);

      if (data.reply) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: data.reply,
          action: data.action
        };
        
        setAiMessages(prev => [...prev, assistantMsg]);

        // Process Action returned from Gemini!
        if (data.action) {
          const { type, productId, discountCode } = data.action;
          
          if (type === 'add_to_cart' && productId) {
            const product = customProducts.find(p => p.id === productId);
            if (product) {
              addToCart(product, product.colors[0], product.sizes?.[0]);
            }
          } else if (type === 'view_product' && productId) {
            const product = customProducts.find(p => p.id === productId);
            if (product) {
              selectProductDetails(product);
            }
          } else if (type === 'apply_discount' && discountCode) {
            handleApplyPromo(discountCode);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsAiTyping(false);
      setAiMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: "I'm having trouble connecting to my central nerve. Check client-side setups or reload!"
        }
      ]);
    }
  };

  // Scroll chat down automatically
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiTyping]);

  // Support navigation between tabs
  useEffect(() => {
    if (activeTab === 'assistant') {
      setActiveScreen('browse');
    } else if (activeTab === 'cart') {
      setActiveScreen('browse');
    } else if (activeTab === 'search') {
      setActiveScreen('browse');
    }
  }, [activeTab]);

  return (
    <div className={`flex flex-col flex-1 h-full select-none ${getFontClass()}`}>
      
      {/* App banner line (e.g. coupon updates scrolling) */}
      <div className="w-full bg-[#1A1A1A] border-b border-stone-200/80 py-2.5 px-4 text-[8px] uppercase tracking-[0.25em] font-semibold text-center text-stone-100 overflow-hidden whitespace-nowrap block relative">
        <span className="inline-block animate-pulse duration-1000">
          ✦ {store.bannerText} ✦
        </span>
      </div>

      {/* Primary screens area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: SUCCESS ORDER WITH SIMULATED LIVE MAP ROUTE & PROGRESS */}
          {activeScreen === 'success' && activeOrderDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 flex flex-col items-center justify-start text-center h-full min-h-[60vh] bg-transparent"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-stone-50 mb-4 border border-stone-200 text-stone-800`}>
                <CheckCircle className="h-8 w-8 text-[#1A1A1A]" />
              </div>
              <h2 className="text-xl font-serif font-black tracking-tight text-[#1A1A1A]">Order Completed</h2>
              <p className="text-xs text-stone-500 mt-2 font-serif italic">
                Order ID: <span className="font-mono text-[#1A1A1A] not-italic font-bold">#EA-{Math.floor(Date.now() / 100000 % 10000)}</span>
              </p>

              {/* Progress visual steps */}
              <div className="w-full mt-6 bg-[#F9F7F5] p-5 rounded-2.5xl border border-stone-200 text-left shadow-xs">
                <span className="text-[9px] uppercase font-serif tracking-[0.2em] font-semibold text-stone-400">Delivery Status</span>
                
                {/* 4 horizontal dots progress bar */}
                <div className="flex items-center justify-between mt-4 mb-2.5 relative">
                  <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-[1.5px] bg-stone-200 z-0">
                    <div 
                      className={`h-full bg-[#1A1A1A] transition-all duration-1000`} 
                      style={{ width: `${(deliveryStep / 3) * 100}%` }} 
                    />
                  </div>
                  {[0, 1, 2, 3].map((step) => {
                    const isActive = deliveryStep >= step;
                    return (
                      <div 
                        key={step} 
                        className={`w-6 h-6 rounded-full z-10 flex items-center justify-center text-[9px] font-bold border transition-all ${
                          isActive 
                            ? `bg-[#1A1A1A] text-white border-transparent scale-110 shadow-xs` 
                            : 'bg-white text-stone-400 border-stone-200'
                        }`}
                      >
                        {step + 1}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[8px] uppercase tracking-wide text-stone-400 font-semibold px-0.5">
                  <span className={deliveryStep >= 0 ? 'text-[#1A1A1A]' : ''}>Confirmed</span>
                  <span className={deliveryStep >= 1 ? 'text-[#1A1A1A]' : ''}>Packing</span>
                  <span className={deliveryStep >= 2 ? 'text-[#1A1A1A]' : ''}>En Route</span>
                  <span className={deliveryStep >= 3 ? 'text-[#1A1A1A]' : ''}>Arrived</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-serif mt-4 bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
                  {deliveryStep === 0 && "⚡️ Store warehouse is processing items."}
                  {deliveryStep === 1 && "📦 Wrapped & packed in biodegradable casing."}
                  {deliveryStep === 2 && "🚚 Out with driver. Shipping route simulated."}
                  {deliveryStep === 3 && "🏠 Arrived! Handed to resident or secure porch."}
                </p>
              </div>

              {/* Live interactive Delivery Map */}
              <div className="w-full mt-4 h-32 rounded-2.5xl border border-stone-200 bg-white p-2 relative overflow-hidden flex items-center justify-center shadow-xs">
                
                {/* Map Grid Elements Mock */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(0,0,0,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.08)_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Abstract Route Line */}
                <svg className="absolute inset-0 h-full w-full opacity-60 pointer-events-none">
                  <path 
                    d="M 30,90 Q 150,20 180,70 T 320,30" 
                    fill="none" 
                    stroke="#E5E7EB" 
                    strokeWidth="3" 
                    strokeDasharray="4 4" 
                  />
                  {deliveryStep > 0 && (
                    <motion.path 
                      d="M 30,90 Q 150,20 180,70 T 320,30" 
                      fill="none" 
                      stroke="#1A1A1A" 
                      strokeWidth="3.5" 
                      strokeDasharray="1000"
                      strokeDashoffset={1000 - (deliveryStep / 3) * 1000}
                      className="transition-all duration-1000"
                    />
                  )}
                </svg>

                {/* Warehouse Location Dot */}
                <div className="absolute left-[30px] bottom-[30px] flex flex-col items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300 animate-ping absolute" />
                  <div className="w-2 h-2 rounded-full bg-stone-400 relative z-10" />
                  <span className="text-[7px] text-stone-400 font-mono scale-90 mt-1">HUB</span>
                </div>

                {/* Customer Home Dot */}
                <div className="absolute right-[30px] top-[26px] flex flex-col items-center justify-center">
                  <div className={`w-3 h-3 rounded-full bg-[#1A1A1A] absolute animate-ping opacity-20`} />
                  <MapPin className={`h-4.5 w-4.5 text-[#1A1A1A] relative z-10`} />
                  <span className="text-[7px] text-stone-500 font-mono scale-90">HOME</span>
                </div>

                {/* Tracking Truck Symbol moving along path */}
                {deliveryStep > 0 && deliveryStep < 3 && (
                  <motion.div 
                    initial={{ left: "20%", top: "70%" }}
                    animate={{ 
                      left: deliveryStep === 1 ? "40%" : "65%",
                      top: deliveryStep === 1 ? "45%" : "60%"
                    }}
                    transition={{ duration: 2 }}
                    className="absolute bg-[#1A1A1A] ring-1 ring-white/10 p-1.5 rounded-lg flex items-center justify-center text-[10px]"
                  >
                    🚚
                  </motion.div>
                )}

                <div className="absolute bottom-2 right-2 bg-stone-50 text-[7px] border border-stone-200/60 font-mono py-0.5 px-2 rounded uppercase text-stone-400 tracking-wider">
                  Satellite coordinates active
                </div>
              </div>

              {/* Back to browse button */}
              <button
                onClick={() => {
                  setActiveScreen('browse');
                  setActiveTab('home');
                }}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold mt-5 shadow h-11 ${style.primary} active:scale-98 transition-all flex items-center justify-center gap-1.5`}
              >
                Continue Simulating Store
              </button>
            </motion.div>
          )}

          {/* SCREEN: CHECKOUT COMPONENT */}
          {activeScreen === 'checkout' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-5 flex flex-col h-full bg-transparent"
            >
              {/* Back nav bar */}
              <div className="flex items-center space-x-2 mb-4">
                <button 
                  onClick={() => setActiveScreen('browse')} 
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition"
                  title="Back to products"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-stone-400">Checkout</span>
              </div>

              <h2 className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-[0.16em] bg-stone-50 border border-stone-200/80 py-2.5 px-3 rounded-xl mb-4 text-center select-none">
                🔒 Secured simulated gateway
              </h2>

              <div className="space-y-4 flex-1">
                {/* Simulated Customer Info form inputs */}
                <div>
                  <label className="block text-[9px] text-[#1A1A1A] uppercase font-serif tracking-[0.15em] mb-1.5 font-medium">customer name</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-xs rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-stone-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[#1A1A1A] uppercase font-serif tracking-[0.15em] mb-1.5 font-medium">shipping email</label>
                  <input 
                    type="email" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-xs rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-stone-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-[#1A1A1A] uppercase font-serif tracking-[0.15em] mb-1.5 font-medium font-serif">destination address</label>
                  <textarea 
                    rows={2} 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-xs rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none focus:border-[#1A1A1A] resize-none transition"
                  />
                </div>

                {/* Animated Simulated Card Visual */}
                <div className="bg-gradient-to-br from-stone-850 to-stone-950 border border-stone-700/40 p-4 rounded-2xl relative overflow-hidden my-3 shadow-sm flex flex-col justify-between h-28">
                  <div className="absolute right-3 top-3 opacity-25 text-white/85 font-mono text-[8px] tracking-widest uppercase font-extrabold select-none">
                    VIRTUAL TESTING
                  </div>
                  <div className="flex justify-between items-center z-10">
                    <div className="w-8 h-6 bg-amber-500/60 rounded-md shadow-xs border border-amber-600/85" />
                    <CreditCard className="h-4.5 w-4.5 text-stone-300" />
                  </div>
                  <div className="text-right text-xs font-semibold tracking-widest text-[#FDFCFB] z-10 font-mono mt-2">
                    {cardNumber}
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] uppercase font-mono text-stone-400 z-10">
                    <span className="truncate max-w-[150px]">Holder: {customerName}</span>
                    <span>EXP: {cardExpiry}</span>
                  </div>
                </div>

                {/* Order Summary Calculations */}
                <div className="bg-[#FBF9F6] p-4 rounded-xl border border-stone-200 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-serif">Subtotal:</span>
                    <span className="text-stone-800 font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-serif">
                      <span>Promo Coupon:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-serif">Shipping:</span>
                    <span className="text-stone-800 font-medium">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="h-[1px] bg-stone-200/85 my-1" />
                  <div className="flex justify-between font-serif font-bold text-stone-900 text-sm">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#1A1A1A] font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Checkout button */}
              <button
                onClick={handleSubmitCheckout}
                disabled={isSubmittingOrder || subtotal === 0}
                className={`w-full py-3.5 rounded-xl text-xs font-semibold mt-4 shadow h-12 flex items-center justify-center gap-2 ${
                  isSubmittingOrder ? 'bg-stone-300 text-stone-500 pointer-events-none' : style.primary
                }`}
              >
                {isSubmittingOrder ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Authorizing Sandbox...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Authorize Simulated Payment (${total.toFixed(2)})
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* SCREEN: DETAILED DRAWER / PRODUCT DETAIL */}
          {activeScreen === 'details' && selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="px-5 py-4 flex flex-col h-full bg-transparent"
            >
              {/* Top back bar and fav */}
              <div className="flex items-center justify-between mb-3 z-10">
                <button 
                  onClick={() => setActiveScreen('browse')} 
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition"
                  title="Back"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition"
                    title="Favorite"
                  >
                    <Heart className={`h-4.5 w-4.5 ${favorites.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Detailed view */}
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* Hero image visual card */}
                <div className="relative rounded-2.5xl overflow-hidden aspect-video max-h-48 bg-stone-50 border border-stone-200/80 select-none my-1 flex items-center justify-center shadow-xs">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full hover:scale-103 transition-all duration-700"
                  />
                  <span className={`absolute top-3 left-3 bg-[#1A1A1A] text-[7px] px-2 py-0.5 rounded font-serif border border-stone-800 uppercase text-stone-100 tracking-wider font-semibold`}>
                    {selectedProduct.category}
                  </span>
                </div>

                {/* Rating & reviews summary row */}
                <div className="flex items-center space-x-1.5 mt-3 text-xs text-amber-500">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-semibold text-stone-800 ml-1">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-[10px] text-stone-300">•</span>
                  <span className="text-[10px] text-stone-400 font-serif font-medium">({selectedProduct.reviewsCount} reviews)</span>
                </div>

                {/* Product Core Details */}
                <h2 className="text-lg font-serif font-black text-[#1A1A1A] tracking-tight mt-1.5 leading-tight">{selectedProduct.name}</h2>
                <div className="text-lg font-bold font-mono text-stone-800 mt-1">${selectedProduct.price.toFixed(2)}</div>
                
                <p className="text-xs text-stone-600 leading-relaxed font-serif mt-2.5 overflow-y-auto max-h-24 no-scrollbar font-light">
                  {selectedProduct.description}
                </p>

                {/* Variants Picking Section: COLOR */}
                <div className="mt-3.5">
                  <label className="text-[9px] text-stone-400 uppercase font-serif tracking-[0.16em] font-bold block mb-1.5">Select Color Variant</label>
                  <div className="flex items-center space-x-2">
                    {selectedProduct.colors.map((colorHex) => {
                      const isChosen = selectedColor === colorHex;
                      return (
                        <button
                          key={colorHex}
                          onClick={() => setSelectedColor(colorHex)}
                          className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                            isChosen ? 'border-[#1A1A1A] scale-110 shadow-xs' : 'border-stone-200'
                          }`}
                          style={{ backgroundColor: colorHex }}
                          title={`Color hex: ${colorHex}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Variants Picking Section: SIZE if applicable */}
                {selectedProduct.sizes && (
                  <div className="mt-3.5">
                    <label className="text-[9px] text-stone-400 uppercase font-serif tracking-[0.16em] font-bold block mb-1.5">Select Size Choice</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.sizes.map((sz) => {
                        const isChosen = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-3 py-1 text-[10px] font-semibold font-mono rounded-lg border transition-all ${
                              isChosen 
                                ? `${style.primary} text-white border-transparent shadow-xs` 
                                : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Unique key features lists */}
                {selectedProduct.features && (
                  <div className="mt-3.5 border-t border-stone-250 pt-3 pb-1 bg-stone-50/40 p-3 rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                    <span className="text-[8px] font-serif font-black uppercase tracking-[0.15em] text-stone-400">Specifications details</span>
                    <ul className="text-[9.5px] text-stone-500 list-disc list-inside space-y-0.5 mt-1 font-serif">
                      {selectedProduct.features.slice(0, 2).map((item, id) => (
                        <li key={id} className="truncate">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Sticky bottom Add block */}
              <button
                onClick={() => {
                  addToCart(selectedProduct, selectedColor, selectedSize);
                  setActiveScreen('browse');
                }}
                className={`w-full py-4 rounded-xl text-xs font-semibold text-white mt-4 shadow h-12 active:scale-98 transition-all flex items-center justify-center gap-2 ${style.primary}`}
              >
                <ShoppingBag className="h-4 w-4" /> Add to Order Bag • ${(selectedProduct.price).toFixed(2)}
              </button>
            </motion.div>
          )}

          {/* SCREEN: PRIMARY BROWSE FLOW (FEED / SEARCH / CART / ASSISTANT) */}
          {activeScreen === 'browse' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full flex-1"
            >
              {/* Header Nav Panel inside phone */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-stone-200/80 bg-white/40">
                <div className="flex flex-col">
                  <span className={`text-base font-serif font-black tracking-tight text-[#1A1A1A]`}>
                    {store.name}
                  </span>
                  <span className="text-[9px] text-stone-400 tracking-wide font-serif italic line-clamp-1">
                    {store.tagline}
                  </span>
                </div>
                
                {/* Floating active assistant quick toggle button */}
                <button
                  onClick={() => setActiveTab('assistant')}
                  className={`p-2 rounded-full relative flex items-center justify-center border transition-all ${
                    activeTab === 'assistant' 
                      ? `${style.primary} border-transparent text-white scale-105 shadow-sm` 
                      : 'bg-white border-stone-200 hover:border-stone-400 text-stone-600'
                  }`}
                  title="Talk to Shopping AI"
                >
                  <Sparkles className="h-4 w-4" />
                  {activeTab !== 'assistant' && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A1A1A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A1A1A]"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Feed tabs selector */}
              {activeTab === 'home' && (
                <div className="flex-1 flex flex-col">
                  {/* Category scrolling slider items */}
                  <div className="px-5 py-2.5 overflow-x-auto whitespace-nowrap flex space-x-1.5 no-scrollbar border-b border-stone-150 bg-white/20">
                    {categories.map((cat) => {
                      const isChosen = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3.5 py-1 text-[10px] font-sans font-medium tracking-wide rounded-full border transition-all ${
                            isChosen 
                              ? `bg-[#1A1A1A] text-[#FDFCFB] border-transparent shadow-xs scale-102` 
                              : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Highlight banner in app feed */}
                  <div className="px-5 mt-4 select-none">
                    <div className="relative rounded-2.5xl overflow-hidden h-32 bg-stone-100 border border-stone-200/80 flex items-end p-4 shadow-xs">
                      <img 
                        src={store.bannerImage} 
                        alt="Hero Banner promotion" 
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 object-cover w-full h-full opacity-70 hover:scale-103 transition-all duration-750"
                      />
                      <div className="relative z-10 flex flex-col bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-stone-200 max-w-full">
                        <span className="text-[7.5px] tracking-[0.16em] font-serif uppercase text-stone-500 font-bold">SEASON HIGHLIGHT</span>
                        <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tight mt-0.5 leading-tight font-serif">
                          {store.id === 'aether' ? 'CARBON COLD MARATHON' : store.id === 'nova' ? 'ACOUSTIC ZERO FREQUENCE' : 'BELGIAN FLAX ESSENCE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* List grids layout */}
                  <div className="p-5 flex-1 min-h-0 bg-transparent mt-2">
                    <div className="text-[9px] uppercase font-serif tracking-[0.2em] font-semibold text-stone-400 mb-3">Shelf Collections</div>
                    
                    {/* Catalog bento grid */}
                    <div className="grid grid-cols-2 gap-3.5">
                      {customProducts
                        .filter(p => activeCategory === 'All' || p.category === activeCategory)
                        .map((product) => (
                          <div
                            key={product.id}
                            onClick={() => selectProductDetails(product)}
                            className="bg-white border border-stone-200 rounded-2.5xl p-2.5 cursor-pointer hover:border-[#1A1A1A] hover:bg-[#FDFCFB] transition-all duration-200 shadow-xs flex flex-col justify-between group overflow-hidden"
                          >
                            <div className="relative rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-stone-50 mb-2">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                referrerPolicy="no-referrer"
                                className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                              />
                              <button
                                onClick={(e) => toggleFavorite(product.id, e)}
                                className="absolute top-1.5 right-1.5 p-1.5 bg-white border border-stone-200 rounded-full text-stone-400 hover:text-stone-900 shadow-xs transition"
                                title="Add to Wishlist"
                              >
                                <Heart className={`h-3 w-3 ${favorites.includes(product.id) ? 'fill-[#1A1A1A] text-[#1A1A1A]' : ''}`} />
                              </button>
                            </div>
                            
                            <div>
                              <div className="text-[8px] uppercase font-serif tracking-[0.12em] font-semibold text-stone-400">
                                {product.category}
                              </div>
                              <h3 className="text-[11px] font-serif font-black text-[#1A1A1A] tracking-tight leading-tight mt-0.5 line-clamp-1">
                                {product.name}
                              </h3>
                            </div>

                            <div className="flex items-center justify-between mt-2.5">
                              <span className="text-[11px] font-bold text-stone-800 font-mono">${product.price.toFixed(2)}</span>
                              <span className={`text-[8.5px] uppercase tracking-widest font-serif font-bold text-stone-600`}>
                                VIEW
                              </span>
                            </div>
                          </div>
                      ))}
                    </div>

                    {customProducts.filter(p => activeCategory === 'All' || p.category === activeCategory).length === 0 && (
                      <div className="p-8 text-center text-xs text-stone-500 font-serif">
                        No product inventories found matching this collection filter.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: SEARCH PAGE */}
              {activeTab === 'search' && (
                <div className="flex-1 p-5 flex flex-col bg-transparent">
                  {/* Styled mock query bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Search general catalog items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-stone-200 text-xs rounded-xl pl-9 pr-4 py-2.5 text-[#1A1A1A] outline-none focus:border-stone-400 transition font-serif shadow-xs"
                    />
                  </div>

                  <span className="text-[9px] uppercase font-serif tracking-[0.2em] text-stone-400 mb-3 font-semibold">Search results</span>
                  
                  <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
                    {customProducts
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => selectProductDetails(p)}
                          className="flex items-center space-x-3 p-2.5 rounded-xl bg-white border border-stone-200/80 cursor-pointer hover:border-stone-400 transition-all shadow-xs"
                        >
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg bg-stone-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-serif font-black text-[#1A1A1A] truncate">{p.name}</h4>
                            <p className="text-[10px] text-stone-500 font-serif font-light line-clamp-1">{p.description}</p>
                            <span className="text-xs font-bold text-stone-800 font-mono mt-0.5 inline-block">${p.price}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-stone-400" />
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SHOPPING CART */}
              {activeTab === 'cart' && (
                <div className="flex-1 p-5 flex flex-col h-full bg-transparent">
                  <h3 className="text-xs font-serif font-black uppercase tracking-[0.15em] text-[#1A1A1A] border-b border-stone-200 pb-2.5 mb-4">
                    Shopping Bag ({cart.reduce((ac, im) => ac + im.quantity, 0)})
                  </h3>

                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
                      <ShoppingBag className="h-10 w-10 text-stone-300 mb-2 animate-pulse" />
                      <p className="text-xs text-stone-500 font-serif">Your shopping cart is currently empty.</p>
                      <button 
                        onClick={() => setActiveTab('home')}
                        className={`text-xs mt-3 underline font-serif font-bold text-stone-800 hover:text-stone-900`}
                      >
                        Let's load the store catalog ➔
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-0.5">
                        {cart.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex items-center space-x-3 p-3 rounded-2.5xl bg-white border border-stone-200 shadow-xs"
                          >
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded-xl bg-stone-50"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-serif font-black text-[#1A1A1A] truncate">{item.product.name}</h4>
                              
                              <div className="flex items-center space-x-1 mt-0.5 text-[8px] uppercase font-serif tracking-wider text-stone-400 font-bold">
                                <span>COL:</span>
                                <span className="inline-block w-2 h-2 rounded-full border border-stone-200" style={{ backgroundColor: item.selectedColor }} />
                                {item.selectedSize && (
                                  <>
                                    <span>•</span>
                                    <span>SZ: {item.selectedSize}</span>
                                  </>
                                )}
                              </div>
                              <span className="text-xs font-bold text-stone-800 font-mono mt-1 block">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-1.5 bg-stone-50 border border-stone-200 px-2 py-1 rounded-xl">
                              <button 
                                onClick={() => updateQuantity(item.id, 'dec')}
                                className="p-0.5 hover:text-[#1A1A1A] text-stone-400 transition"
                                title="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-mono font-bold text-stone-800 w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 'inc')}
                                className="p-0.5 hover:text-[#1A1A1A] text-stone-400 transition"
                                title="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Trash button */}
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                              title="Delete item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Promo Inputs Code */}
                      <div className="mt-4 border-t border-stone-200 pt-3.5 flex items-center space-x-2">
                        <input 
                          type="text" 
                          placeholder="PROMO CODE"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 bg-white border border-stone-200 text-[10px] font-mono rounded-xl px-2.5 py-2 text-[#1A1A1A] outline-none focus:border-stone-400 transition"
                        />
                        <button
                          onClick={() => handleApplyPromo(promoInput)}
                          className={`px-3.5 py-2 text-[10px] font-serif font-bold border rounded-xl transition border-stone-200 hover:bg-stone-50 text-stone-850`}
                        >
                          APPLY
                        </button>
                      </div>
                      
                      {promoError && (
                        <span className="text-[9px] text-rose-700 mt-1 block ml-0.5 font-mono">{promoError}</span>
                      )}

                      {couponBadge && (
                        <div className="mt-2 bg-emerald-50 border border-emerald-100/60 text-emerald-800 text-[9px] font-mono py-1 px-2.5 rounded-lg flex justify-between items-center shadow-xs">
                          <span>🎁 Coupon {appliedDiscount} Verified</span>
                          <span className="font-bold">{couponBadge}</span>
                        </div>
                      )}

                      {/* Subtotal summary section */}
                      <div className="border-t border-stone-150 pt-3.5 mt-3 text-xs space-y-1.5 font-mono">
                        <div className="flex justify-between">
                          <span className="text-stone-500 font-serif">Subtotal:</span>
                          <span className="text-stone-800 font-semibold">${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-emerald-800 font-serif">
                            <span>Promo Discount:</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-serif font-black text-[#1A1A1A] text-sm md:text-base">
                          <span>Est. Total:</span>
                          <span className="font-mono text-stone-900 font-bold">${total.toFixed(2)}</span>
                        </div>

                        {/* Checkout Trigger */}
                        <button
                          onClick={() => setActiveScreen('checkout')}
                          className={`w-full py-3 rounded-xl text-xs font-semibold text-white mt-3.5 shadow-sm flex items-center justify-center gap-1.5 ${style.primary} active:scale-98 transition`}
                        >
                          Secure Checkout <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: AI HELP MESSAGING */}
              {activeTab === 'assistant' && (
                <div className="flex-1 flex flex-col min-h-0 h-full bg-transparent p-4">
                  {/* Header identity */}
                  <div className="flex items-center space-x-2.5 bg-white p-3 rounded-2xl border border-stone-200 mb-4 shadow-xs">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#1A1A1A] text-white`}>
                      <Sparkles className="h-4 w-4 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-serif font-black text-[#1A1A1A] uppercase tracking-wider">Shopping AI Assistant</h4>
                      <p className="text-[8px] text-stone-400 font-mono">Powered by Gemini-3.5-Flash</p>
                    </div>
                  </div>

                  {/* Messages container list */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 mb-2.5 pr-0.5">
                    {aiMessages.map((msg) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[11px] font-serif ${
                            isUser 
                              ? 'bg-[#1A1A1A] text-stone-100 rounded-tr-none shadow-xs' 
                              : 'bg-white text-stone-850 border border-stone-205 rounded-tl-none leading-relaxed font-light shadow-xs'
                          }`}>
                            <p>{msg.text}</p>
                            
                            {/* Action Indicators if performed inside UI */}
                            {!isUser && msg.action && msg.action.type !== 'none' && (
                              <div className="mt-2 bg-stone-55 border border-stone-200 p-1.5 rounded-lg text-[8px] font-mono text-stone-500 flex items-center gap-1 inline-block">
                                🔧 <span className="uppercase text-stone-700 font-semibold">{msg.action.type.replace('_', ' ')}</span>
                                {msg.action.productId && <span>({msg.action.productId})</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* typing bubbles */}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-stone-200 px-3.5 py-3 rounded-2xl rounded-tl-none flex space-x-1 items-center shadow-xs">
                          <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Floating quick queries aids */}
                  <div className="py-1 overflow-x-auto whitespace-nowrap flex space-x-2 no-scrollbar border-t border-stone-150 pt-2 mb-2.5">
                    {[
                      { text: "Suggest footwear", label: "👟 Suggest Shoes" },
                      { text: "Any tech products?", label: "🎧 Tech Items" },
                      { text: "Do you have coupons?", label: "🎁 Coupon Info" },
                      { text: "Help me find a gift", label: "💝 Gift Planner" }
                    ].map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChat(pill.text)}
                        className="px-3 py-1.5 text-[9px] font-sans font-medium text-stone-600 hover:text-[#1A1A1A] border border-stone-200 rounded-xl bg-white hover:border-stone-400 cursor-pointer shadow-2xs transition-all"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  {/* Message sending box */}
                  <div className="flex items-center bg-white rounded-xl border border-stone-250 pr-2 shadow-xs">
                    <input 
                      type="text" 
                      placeholder="Ask AI shopping guide..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      className="flex-1 bg-transparent text-xs rounded-xl px-3 py-2.5 text-[#1A1A1A] outline-none placeholder-stone-400 focus:placeholder-stone-500 font-serif"
                    />
                    <button
                      onClick={() => handleSendChat()}
                      disabled={!userInput.trim() || isAiTyping}
                      className={`p-1.5 rounded-lg transition-all ${
                        userInput.trim() ? `${style.primary} text-white scale-105 shadow-sm` : 'text-stone-300'
                      }`}
                      title="Send message"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Primary OS Tab Bar bottom inside phone chrome */}
      <div className="absolute bottom-6 left-0 right-0 h-13 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-around px-2 z-40">
        
        <button
          onClick={() => {
            setActiveTab('home');
            setActiveScreen('browse');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            activeTab === 'home' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Browse Catalog"
        >
          <Compass className="h-4.5 w-4.5 mb-0.5" />
          <span className="text-[8px] font-serif font-black uppercase tracking-[0.12em]">Browse</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            setActiveScreen('browse');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            activeTab === 'search' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Search Shelf"
        >
          <Search className="h-4.5 w-4.5 mb-0.5" />
          <span className="text-[8px] font-serif font-black uppercase tracking-[0.12em]">Search</span>
        </button>

        {/* CART tab with red bubble badge */}
        <button
          onClick={() => {
            setActiveTab('cart');
            setActiveScreen('browse');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all relative ${
            activeTab === 'cart' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Checkout Cart"
        >
          <ShoppingBag className="h-4.5 w-4.5 mb-0.5" />
          <span className="text-[8px] font-serif font-black uppercase tracking-[0.12em]">Cart</span>
          {cart.length > 0 && (
            <span className="absolute top-1.5 right-[24%] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#1A1A1A] text-[7.5px] font-mono leading-none font-extrabold text-white">
              {cart.reduce((ac, im) => ac + im.quantity, 0)}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('assistant');
            setActiveScreen('browse');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            activeTab === 'assistant' ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
          title="Shopping AI Guide"
        >
          <Sparkles className="h-4.5 w-4.5 mb-0.5" />
          <span className="text-[8px] font-serif font-black uppercase tracking-[0.12em]">Assistant</span>
        </button>

      </div>

    </div>
  );
}
