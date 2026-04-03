'use client';

import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { FileText, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  total: number;
}

const GET_ORDERS = `
  query GetOrders {
    myOrders {
      id
      status
      total
    }
  }
`;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await graphqlClient<{ myOrders: Order[] }>(GET_ORDERS);
        setOrders(data.myOrders);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'COMPLETED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
        <div className="p-4 bg-emerald-500/20 rounded-2xl">
          <FileText className="text-emerald-400 w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">My Orders</h1>
          <p className="text-slate-400 mt-1">Track and manage your recent orders.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50">
          <p className="text-slate-400 text-lg mb-6">You haven't placed any orders yet.</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-full font-medium transition-transform hover:scale-105"
          >
            Start exploring <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 text-slate-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center justify-center ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
