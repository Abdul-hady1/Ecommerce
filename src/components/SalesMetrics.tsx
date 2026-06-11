import React from 'react';
import { 
  TrendingUp, Users, ShoppingCart, DollarSign, Calendar, MapPin, CheckCircle, Clock 
} from 'lucide-react';
import { OrderLog, CartItem } from '../types';

interface SalesMetricsProps {
  orders: OrderLog[];
  cart: CartItem[];
  themeColor: 'emerald' | 'sky' | 'amber' | 'rose' | 'indigo';
}

export default function SalesMetrics({ orders, cart, themeColor }: SalesMetricsProps) {
  // Compute analytics numbers
  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const activeCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeCartValue = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const getThemeText = () => {
    switch (themeColor) {
      case 'emerald': return 'text-emerald-700';
      case 'sky': return 'text-sky-700';
      case 'amber': return 'text-amber-700';
      case 'rose': return 'text-rose-700';
      case 'indigo': return 'text-indigo-700';
    }
  };

  const themeText = getThemeText();

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-start h-full max-h-[750px] overflow-y-auto no-scrollbar">
      
      {/* Title block */}
      <div className="flex items-center space-x-2 pb-3.5 border-b border-stone-200 mb-5">
        <TrendingUp className="h-4 w-4 text-[#1A1A1A]" />
        <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-[0.2em] font-serif">
          Simulator Analytics (Sales Desk)
        </h3>
      </div>

      {/* Grid of 3 KPI dashboard cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {/* Metric 1 */}
        <div className="bg-[#F9F7F5] p-3.5 rounded-2xl border border-stone-200/80 flex flex-col justify-between shadow-xs">
          <span className="text-[8px] uppercase font-serif tracking-[0.1em] text-stone-400 font-semibold block">Simulated Sales</span>
          <div className="text-sm font-extrabold text-[#1A1A1A] font-mono mt-2.5 flex items-center gap-0.5">
            <DollarSign className="h-3.5 w-3.5 text-stone-500" />
            <span>{totalSales.toFixed(2)}</span>
          </div>
          <span className="text-[8px] text-stone-400 font-serif italic mt-1.5 block">Live updates</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#F9F7F5] p-3.5 rounded-2xl border border-stone-200/80 flex flex-col justify-between shadow-xs">
          <span className="text-[8px] uppercase font-serif tracking-[0.1em] text-stone-400 font-semibold block">Orders Count</span>
          <div className="text-sm font-extrabold text-[#1A1A1A] font-mono mt-2.5">
            {orders.length}
          </div>
          <span className="text-[8px] text-stone-400 font-serif italic mt-1.5 block">Checkouts made</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#F9F7F5] p-3.5 rounded-2xl border border-stone-200/80 flex flex-col justify-between shadow-xs">
          <span className="text-[8px] uppercase font-serif tracking-[0.1em] text-stone-400 font-semibold block">In-Cart Value</span>
          <div className="text-sm font-extrabold text-[#1A1A1A] font-mono mt-2.5 flex items-center gap-0.5">
            <ShoppingCart className="h-3.5 w-3.5 text-stone-500" />
            <span>{activeCartValue.toFixed(2)}</span>
          </div>
          <span className="text-[8px] text-stone-400 font-serif italic mt-1.5 block">{activeCartCount} active items</span>
        </div>
      </div>

      {/* Abstract Simulated Sales Charts via neat pure CSS bars */}
      <div className="bg-[#F9F7F5] border border-stone-200 p-4 rounded-3xl mb-5 shadow-xs">
        <span className="text-[8px] uppercase font-serif tracking-[0.2em] text-[#1A1A1A] block mb-3 font-semibold">Weekly Simulation Frequency</span>
        
        {/* CSS Flex layout bar graph */}
        <div className="flex items-end justify-between h-20 px-2 pt-2 pb-0.5 font-mono">
          {[
            { tag: "Mon", val: 32, num: 1 },
            { tag: "Tue", val: 45, num: 2 },
            { tag: "Wed", val: 28, num: 1 },
            { tag: "Thu", val: 55, num: 3 },
            { tag: "Fri", val: 78, num: 4 },
            { tag: "Sat", val: 92, num: 5 },
            { tag: "Sun", val: 120, num: 6 }
          ].map((bar, index) => {
            // Include active completed order ticks for dynamic bump
            const bump = orders.length * 8;
            const finalHeight = Math.min(100, bar.val + bump);
            return (
              <div key={index} className="flex flex-col items-center flex-1 group relative">
                {/* Floating tooltip hover information */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition duration-300 bg-[#1A1A1A] text-white py-1 px-2.5 rounded-lg text-[8px] whitespace-nowrap z-50 shadow-sm font-mono">
                  Amt: ${(finalHeight * 3.5).toFixed(0)} ({bar.num + orders.length} checkouts)
                </div>
                {/* Visual Cylinder bar */}
                <div className="w-4 bg-stone-200 rounded-t-xs h-14 flex items-end overflow-hidden">
                  <div 
                    className={`w-full bg-[#1A1A1A] transition-all duration-1000`} 
                    style={{ height: `${finalHeight}%` }} 
                  />
                </div>
                <span className="text-[8px] text-stone-400 mt-1.5 font-mono scale-90">{bar.tag}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Orders Log table listing recent checkouts */}
      <div className="flex-1">
        <span className="text-[8px] uppercase font-serif tracking-[0.2em] text-stone-400 block mb-3">Simulated Shipping Queue Logs</span>
        
        <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-stone-50 p-3 rounded-xl border border-stone-150 flex flex-col text-[11px] gap-1.5 hover:border-stone-300 hover:bg-stone-100 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-605">#{order.id.slice(-5)}</span>
                <span className={`text-[8px] py-0.5 px-2 rounded-full uppercase tracking-wider font-semibold font-mono ${
                  order.status === 'delivered' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-stone-100 text-stone-605 border border-stone-250 animate-pulse'
                }`}>
                  {order.status === 'delivered' ? 'ARRIVED' : 'OUT_ROAD'}
                </span>
              </div>

              <div className="text-[10px] text-stone-550 font-sans">
                Customer: <span className="text-stone-800 font-medium font-serif">{order.customerName}</span> (Receipt: {order.customerEmail})
              </div>

              {/* Items in summary list */}
              <div className="text-[9.5px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200/55 mt-0.5 font-sans">
                <ul className="list-inside space-y-0.5 font-light">
                  {order.items.map((it, idx) => (
                    <li key={idx} className="truncate">
                      • {it.productName} ({it.quantity}x)
                      {it.size && ` - Sz: ${it.size}`}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-stone-800 mt-1 font-sans">
                <span className="text-stone-405 text-[10px] font-light">Total Transaction value:</span>
                <span className={themeText}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="p-8 text-center text-[10px] font-serif italic text-stone-400 bg-[#F9F7F5] rounded-xl border border-stone-200 border-dashed">
              No simulated transactions found. Try making a checkout inside the mobile phone!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
