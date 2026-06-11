import React, { useState } from 'react';
import { 
  Compass, Settings, ChevronRight, Edit3, Save, 
  HelpCircle, Eye, RefreshCw, Smartphone, Layers, Palette, Sparkles, CheckCircle
} from 'lucide-react';
import { StoreConfig, Product } from '../types';

interface StudioManagerProps {
  stores: StoreConfig[];
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  customProducts: Product[];
  setCustomProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  storeConfigOverride: Partial<StoreConfig>;
  setStoreConfigOverride: React.Dispatch<React.SetStateAction<Partial<StoreConfig>>>;
  resetToDefaults: () => void;
}

export default function StudioManager({
  stores,
  activeStoreId,
  setActiveStoreId,
  customProducts,
  setCustomProducts,
  storeConfigOverride,
  setStoreConfigOverride,
  resetToDefaults
}: StudioManagerProps) {
  const activeStore = stores.find(s => s.id === activeStoreId);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const [editedName, setEditedName] = useState<string>('');

  if (!activeStore) return null;

  // Handle local updating of specific product values
  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setEditedPrice(product.price.toString());
    setEditedName(product.name);
  };

  const saveProductEdits = (productId: string) => {
    const parsedPrice = parseFloat(editedPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0 || !editedName.trim()) {
      alert('Please enter a valid product name and positive price.');
      return;
    }

    setCustomProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, name: editedName, price: parsedPrice } : p)
    );
    setEditingProductId(null);
  };

  const currentName = storeConfigOverride.name ?? activeStore.name;
  const currentTagline = storeConfigOverride.tagline ?? activeStore.tagline;
  const currentThemeColor = storeConfigOverride.themeColor ?? activeStore.themeColor;
  const currentFontFamily = storeConfigOverride.fontFamily ?? activeStore.fontFamily;

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-start h-full max-h-[750px] overflow-y-auto no-scrollbar">
      
      {/* Selector Headings Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-200 mb-5">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-[#1A1A1A]" />
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] font-serif">
            Storefront Configs
          </h3>
        </div>
        <button
          onClick={resetToDefaults}
          className="text-[9px] uppercase tracking-wider font-semibold text-[#1A1A1A] hover:bg-neutral-50 border border-stone-200 px-3 py-1.5 rounded-lg cursor-pointer transition"
          title="Reset CMS fields to original catalog"
        >
          Reset CMS
        </button>
      </div>

      {/* Select active app profile */}
      <div className="mb-5">
        <label className="block text-[9px] uppercase font-mono tracking-[0.2em] text-stone-400 mb-2.5">
          Active Storefront Profile
        </label>
        <div className="grid grid-cols-3 gap-2">
          {stores.map((s) => {
            const isActive = s.id === activeStoreId;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStoreId(s.id);
                  setStoreConfigOverride({}); // clear inputs overrides when swapping profiles
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-stone-50 border-[#1A1A1A] text-[#1A1A1A] font-medium font-serif shadow-xs scale-102' 
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-400'
                }`}
              >
                <Smartphone className="h-4 w-4 mb-1 text-stone-605" />
                <span className="text-[10px] truncate max-w-full tracking-tight">{s.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Branding configurations inputs */}
      <div className="bg-[#F9F7F5] p-4 rounded-2xl border border-stone-200 space-y-4 mb-5 shadow-xs">
        <div className="flex items-center space-x-1.5 text-[#1A1A1A] font-bold text-xs uppercase tracking-[0.1em] mb-1 font-serif">
          <Palette className="h-3.5 w-3.5 text-stone-500" />
          <span>Profile customizer</span>
        </div>

        {/* Change title input */}
        <div>
          <label className="block text-[8px] uppercase font-mono tracking-[0.2em] text-stone-550 mb-1.5">
            Branding App Title
          </label>
          <input
            type="text"
            value={currentName}
            onChange={(e) => setStoreConfigOverride(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-white border border-stone-250 text-xs text-[#1A1A1A] rounded-xl px-3 py-2.5 outline-none focus:border-stone-450 font-serif"
          />
        </div>

        {/* Change Tagline input */}
        <div>
          <label className="block text-[8px] uppercase font-mono tracking-[0.2em] text-stone-550 mb-1.5">
            Marketing Tagline
          </label>
          <input
            type="text"
            value={currentTagline}
            onChange={(e) => setStoreConfigOverride(prev => ({ ...prev, tagline: e.target.value }))}
            className="w-full bg-white border border-stone-250 text-xs text-[#1A1A1A] rounded-xl px-3 py-2.5 outline-none focus:border-stone-450 italic"
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Change font input selector */}
          <div>
            <label className="block text-[8px] uppercase font-mono tracking-[0.2em] text-stone-550 mb-1.5">
              Font Family
            </label>
            <select
              value={currentFontFamily}
              onChange={(e) => setStoreConfigOverride(prev => ({ ...prev, fontFamily: e.target.value as any }))}
              className="w-full bg-white border border-stone-250 text-xs text-[#1A1A1A] rounded-xl p-2 outline-none focus:border-stone-450"
            >
              <option value="sans">Inter (Sans)</option>
              <option value="serif">Playfair (Serif)</option>
              <option value="mono">JetBrains (Mono)</option>
            </select>
          </div>

          {/* Change theme accent selector */}
          <div>
            <label className="block text-[8px] uppercase font-mono tracking-[0.2em] text-stone-550 mb-1.5">
              App Core Accent
            </label>
            <select
              value={currentThemeColor}
              onChange={(e) => setStoreConfigOverride(prev => ({ ...prev, themeColor: e.target.value as any }))}
              className="w-full bg-white border border-stone-250 text-xs text-[#1A1A1A] rounded-xl p-2 outline-none focus:border-stone-450 capitalize"
            >
              <option value="emerald">Emerald</option>
              <option value="sky">Sky Blue</option>
              <option value="amber">Warm Amber</option>
              <option value="rose">Soft Rose</option>
              <option value="indigo">Violet Indigo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product list catalog modifier table */}
      <div className="flex-1">
        <label className="block text-[9px] uppercase font-mono tracking-[0.2em] text-stone-400 mb-3 block">
          STOCK & PRICE CATALOG CMS
        </label>

        <div className="space-y-2 overflow-y-auto no-scrollbar max-h-56 pr-0.5">
          {customProducts.map((p) => {
            const isEditing = editingProductId === p.id;
            return (
              <div 
                key={p.id} 
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-150 text-xs gap-3.5 transition"
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-md object-cover bg-neutral-200 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded px-2 py-1 text-[11px] text-[#1A1A1A]"
                    />
                  ) : (
                    <h5 className="font-serif font-semibold text-[#1A1A1A] text-[12px] truncate">{p.name}</h5>
                  )}
                  
                  <span className="text-[8px] text-stone-400 uppercase font-mono tracking-wider font-semibold block mt-0.5">{p.category}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-stone-400 font-mono text-[10px]">$</span>
                      <input 
                        type="text" 
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        className="w-14 bg-white border border-stone-300 rounded px-1.5 py-0.5 text-[10px] text-[#1A1A1A] text-center font-mono"
                      />
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold font-mono text-stone-600">${p.price}</span>
                  )}

                  {isEditing ? (
                    <button
                      onClick={() => saveProductEdits(p.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition"
                      title="Save product changes"
                    >
                      <Save className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditingProduct(p)}
                      className="p-1 text-stone-400 hover:text-[#1A1A1A] hover:bg-stone-200/50 rounded transition"
                      title="Edit product name or pricing"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
