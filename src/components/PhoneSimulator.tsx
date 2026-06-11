import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Volume2, VolumeX, Moon, Sun } from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  themeColor: 'emerald' | 'sky' | 'amber' | 'rose' | 'indigo';
}

export default function PhoneSimulator({ children, themeColor }: PhoneSimulatorProps) {
  const [time, setTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [screenBrightness, setScreenBrightness] = useState(100);

  // Update clock every minute
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      setTime(`${hours}:${minutesStr} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simple battery simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 10) {
          setIsCharging(true);
          return 98;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic wallpaper background colors matching the store accent
  const getWallpaper = () => {
    switch (themeColor) {
      case 'emerald':
        return 'from-white via-[#FDFCFB] to-[#F9F7F5]';
      case 'sky':
        return 'from-white via-[#FDFCFB] to-[#F9F7F5]';
      case 'amber':
        return 'from-white via-[#FDFCFB] to-[#F9F7F5]';
      case 'rose':
        return 'from-white via-[#FDFCFB] to-[#F9F7F5]';
      case 'indigo':
        return 'from-white via-[#FDFCFB] to-[#F9F7F5]';
      default:
        return 'from-white via-[#FDFCFB] to-[#F9F7F5]';
    }
  };

  return (
    <div className="relative mx-auto flex flex-col items-center justify-center p-3 select-none">
      {/* Phone side buttons container */}
      <div className="relative">
        {/* Left Side Buttons (Volume & Ring/Silent) */}
        <div className="absolute -left-[16px] top-[120px] h-[36px] w-[4px] rounded-l-md bg-stone-400 active:bg-stone-500 cursor-pointer shadow-xs transition-all border-l-2 border-stone-500"
             onClick={() => setIsMuted(prev => !prev)}
             title={isMuted ? "Unmute simulation" : "Mute simulation"}
         />
        <div className="absolute -left-[16px] top-[180px] h-[48px] w-[4px] rounded-l-md bg-stone-400 active:bg-stone-500 cursor-pointer shadow-xs transition-all border-l-2 border-stone-500" />
        <div className="absolute -left-[16px] top-[240px] h-[48px] w-[4px] rounded-l-md bg-stone-400 active:bg-stone-500 cursor-pointer shadow-xs transition-all border-l-2 border-stone-500" />

        {/* Right Side Power Button */}
        <div className="absolute -right-[16px] top-[200px] h-[58px] w-[4px] rounded-r-md bg-stone-400 active:bg-stone-500 cursor-pointer shadow-xs transition-all border-r-2 border-stone-500" />

        {/* Outer Phone Shell Case with elegant reflection & shadow */}
        <div className="relative h-[800px] w-[375px] rounded-[52px] bg-stone-850 p-[11px] shadow-2xl ring-12 ring-stone-900 ring-opacity-100 transition-all duration-500">
          
          {/* Speaker Earpiece Grille cutout */}
          <div className="absolute left-1/2 top-[16px] z-50 h-[4px] w-[50px] -translate-x-1/2 rounded-full bg-stone-800/80" />

          {/* Glare Glass Reflections overlay */}
          <div className="pointer-events-none absolute inset-0 z-50 rounded-[48px] border-[1px] border-white/5 bg-gradient-to-tr from-white/0 via-white/5 to-white/0" />

          {/* Simulated Inner Screen Canvas */}
          <div className={`relative flex h-full w-full flex-col overflow-hidden rounded-[40px] bg-gradient-to-b ${getWallpaper()} text-[#1A1A1A] transition-all duration-700`}>
            
            {/* Standard Status Bar */}
            <div className="relative z-40 flex h-11 items-center justify-between px-6 pt-2 text-[11px] font-medium tracking-tight text-stone-700">
              {/* Left Side Clock */}
              <div className="w-16 text-left drop-shadow-xs">{time || "11:54 AM"}</div>

              {/* Center Dynamic Island Notch Cutout */}
              <div className="absolute left-1/2 top-1 z-50 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-center rounded-full bg-stone-900 border border-stone-800 shadow-inner transition-all hover:w-[130px] duration-300">
                {/* Simulated Green Camera/Mic dot */}
                <div className="absolute right-4 h-1 w-1 rounded-full bg-green-500/80 animate-pulse" />
              </div>

              {/* Right Side Icons */}
              <div className="flex w-16 items-center justify-end space-x-1.5 text-right drop-shadow-xs">
                <Signal className="h-3 w-3 text-stone-600" />
                <Wifi className="h-3 w-3 text-stone-600" />
                <div className="flex items-center space-x-0.5">
                  <span className="text-[9px] scale-90 text-stone-600">{batteryLevel}%</span>
                  <Battery className="h-3.5 w-3.5 rotate-0 scale-95 text-stone-600" />
                </div>
              </div>
            </div>

            {/* Simulated Frame Content Space */}
            <div className="relative flex flex-1 flex-col overflow-hidden">
              {children}
            </div>

            {/* Dynamic bottom OS home bar indicator */}
            <div className="relative z-40 flex h-6 w-full items-center justify-center py-2 bg-stone-100/35">
              <div className="h-1 w-32 rounded-full bg-stone-400/80 shadow-xs" />
            </div>

          </div>
        </div>
      </div>

      {/* Floating interactive details underneath */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-[11px] text-stone-400 font-serif italic">
        <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-xs">
          {isMuted ? <VolumeX className="h-3.5 w-3.5 text-stone-400" /> : <Volume2 className="h-3.5 w-3.5 text-stone-700" />}
          OS Sound: {isMuted ? "MUTED" : "ACTIVE"}
        </span>
        <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-xs text-stone-400">
          <Moon className="h-3 w-3 text-stone-500" /> Display: Retina OLED
        </span>
      </div>
    </div>
  );
}
