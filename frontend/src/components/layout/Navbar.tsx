'use client';

import Link from 'next/link';
import { ShoppingBag, ChevronDown, User, LogOut, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getToken, logout } from '@/lib/auth';

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    setIsLogged(!!getToken());
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
              Slooze
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {isLogged ? (
              <>
                <Link href="/orders" className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                  <FileText className="w-4 h-4" />
                  Orders
                </Link>
                <Link href="/payments" className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" />
                  Payments
                </Link>
                <button 
                  onClick={logout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
