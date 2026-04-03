'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export default function Home() {
  const [restaurantId, setRestaurantId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantId.trim()) {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Craving something <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            extraordinary?
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Enter a restaurant ID to explore menus, customize your order, and experience premium food delivery.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mt-10 relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-32 py-5 bg-slate-800/50 border border-slate-700 backdrop-blur-md rounded-full text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xl"
            placeholder="Enter Restaurant ID (e.g. 1)"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105"
          >
            Explore <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
