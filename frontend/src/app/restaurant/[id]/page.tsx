'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { graphqlClient } from '@/lib/graphql-client';
import { Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const GET_MENU_ITEMS = `
  query GetMenuItems($restaurantId: String!) {
    menuItems(restaurantId: $restaurantId) {
      id
      name
      price
    }
  }
`;

const CREATE_ORDER = `
  mutation CreateOrder($items: [OrderItemInput!]!) {
    createOrder(input: { items: $items }) {
      id
      status
      total
    }
  }
`;

const CHECKOUT_ORDER = `
  mutation Checkout($orderId: String!) {
    checkoutOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

const ADD_MENU_ITEM = `
  mutation AddMenuItem($name: String!, $price: Float!, $restaurantId: String!) {
    addMenuItem(input: { name: $name, price: $price, restaurantId: $restaurantId }) {
      id
      name
      price
    }
  }
`;

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Add item form state
  const [isManager, setIsManager] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await graphqlClient<{ menuItems: MenuItem[] }>(GET_MENU_ITEMS, {
          restaurantId: unwrappedParams.id,
        });
        setMenuItems(data.menuItems);
      } catch (err: any) {
        setError(err.message || 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();

    import('@/lib/auth').then(({ getUserRole }) => {
      const role = getUserRole();
      if (role === 'MANAGER' || role === 'ADMIN') {
        setIsManager(true);
      }
    });
  }, [unwrappedParams.id]);

  const updateQuantity = (item: MenuItem, delta: number) => {
    setCart((prev) => {
      const currentQuantity = prev[item.id]?.quantity || 0;
      const newQuantity = Math.max(0, currentQuantity + delta);
      
      const newCart = { ...prev };
      if (newQuantity === 0) {
        delete newCart[item.id];
      } else {
        newCart[item.id] = { ...item, quantity: newQuantity };
      }
      return newCart;
    });
  };

  const handleCheckout = async () => {
    const items = Object.values(cart).map((item) => ({
      menuItemId: item.id,
      quantity: item.quantity,
    }));
    
    if (items.length === 0) return;

    setIsSubmitting(true);
    setError('');
    try {
      // 1. Create order
      const createData = await graphqlClient<{ createOrder: { id: string } }>(CREATE_ORDER, {
        items,
      });
      const orderId = createData.createOrder.id;

      // 2. Checkout
      await graphqlClient(CHECKOUT_ORDER, { orderId });
      
      router.push('/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to checkout');
      setIsSubmitting(false);
    }
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Restaurant Menu</h1>
          <p className="text-slate-400">Select items to add to your order.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4">
            {error}
          </div>
        )}

        {isManager && (
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setAddingItem(true);
              try {
                const data = await graphqlClient<{ addMenuItem: MenuItem }>(ADD_MENU_ITEM, {
                  name: newItemName,
                  price: parseFloat(newItemPrice),
                  restaurantId: unwrappedParams.id
                });
                setMenuItems([...menuItems, data.addMenuItem]);
                setNewItemName('');
                setNewItemPrice('');
              } catch (err: any) {
                setError(err.message);
              } finally {
                setAddingItem(false);
              }
            }} 
            className="bg-slate-800/30 border border-emerald-500/30 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="w-full">
              <label className="block text-sm text-slate-400 mb-1">Item Name</label>
              <input 
                type="text" 
                required 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                placeholder="e.g. Garlic Bread"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm text-slate-400 mb-1">Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                required 
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                placeholder="4.99"
              />
            </div>
            <button 
              disabled={addingItem}
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-colors disabled:opacity-50 flex items-center h-[42px]"
            >
              {addingItem ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Item'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center p-12 border border-slate-800 rounded-2xl bg-slate-900/50">
            <p className="text-slate-400">No items found for this restaurant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between group hover:border-emerald-500/50 transition-colors">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-emerald-400 font-medium">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 bg-slate-900 rounded-full p-1">
                    <button 
                      onClick={() => updateQuantity(item, -1)}
                      className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-4 text-center font-medium">
                      {cart[item.id]?.quantity || 0}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item, 1)}
                      className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <ShoppingBag className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Your Order</h2>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex gap-3">
                      <span className="font-medium text-emerald-400">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-black bg-emerald-500 hover:bg-emerald-400 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Checkout Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
