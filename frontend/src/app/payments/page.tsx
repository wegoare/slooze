'use client';

import { useEffect, useState } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { CreditCard, Loader2, Plus, Trash2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  provider: string;
  last4: string;
}

const GET_PAYMENT_METHODS = `
  query GetPaymentMethods {
    myPaymentMethods {
      id
      provider
      last4
    }
  }
`;

const ADD_PAYMENT_METHOD = `
  mutation AddPaymentMethod($provider: String!, $last4: String!) {
    addPaymentMethod(input: { provider: $provider, last4: $last4 }) {
      id
      provider
      last4
    }
  }
`;

const DELETE_PAYMENT_METHOD = `
  mutation DeletePaymentMethod($id: String!) {
    deletePaymentMethod(id: $id) {
      id
    }
  }
`;

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add payment method form state
  const [isAdding, setIsAdding] = useState(false);
  const [provider, setProvider] = useState('Visa');
  const [last4, setLast4] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  async function fetchPaymentMethods() {
    try {
      const data = await graphqlClient<{ myPaymentMethods: PaymentMethod[] }>(GET_PAYMENT_METHODS);
      setPaymentMethods(data.myPaymentMethods);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (last4.length !== 4) {
      setError('Last 4 digits must be exactly 4 characters');
      return;
    }

    setAddLoading(true);
    setError('');
    try {
      const data = await graphqlClient<{ addPaymentMethod: PaymentMethod }>(ADD_PAYMENT_METHOD, {
        provider,
        last4,
      });
      setPaymentMethods([...paymentMethods, data.addPaymentMethod]);
      setIsAdding(false);
      setLast4('');
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await graphqlClient(DELETE_PAYMENT_METHOD, { id });
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete payment method');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/20 rounded-2xl">
            <CreditCard className="text-cyan-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Payment Methods</h1>
            <p className="text-slate-400 mt-1">Manage your saved cards and payment options.</p>
          </div>
        </div>
        
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors border border-slate-700"
          >
            <Plus className="w-5 h-5" />
            Add Method
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl p-4 mb-8">
          {error}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-8 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Amex">American Express</option>
                <option value="Discover">Discover</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Last 4 Digits</label>
              <input
                type="text"
                required
                maxLength={4}
                pattern="\d{4}"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="1234"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addLoading}
              className="px-5 py-2.5 rounded-xl font-medium text-black bg-cyan-500 hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {addLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Payment Method'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : paymentMethods.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50">
          <p className="text-slate-400 text-lg">You have no saved payment methods.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="group bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex items-center justify-between hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-900 rounded border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                  {pm.provider}
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• {pm.last4}</p>
                  <p className="text-xs text-slate-400 mt-1">Expiry 12/25</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(pm.id)}
                className="p-2 text-slate-500 hover:text-red-400 bg-slate-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                aria-label="Delete payment method"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
