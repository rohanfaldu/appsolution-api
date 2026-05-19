import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';
import { ordersAPI } from '../services/api';

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  product: { name: string; image: string | null; category: string } | null;
};

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  transactionId: string | null;
  items: OrderItem[];
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI
      .getAll()
      .then((res) => setOrders(res.data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-['Clash_Display'] text-5xl text-white">My Orders</h1>
        <p className="mt-3 text-white/60">Track recent purchases and download history.</p>

        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <div className="market-card p-10 text-center">
              <PackageCheck className="mx-auto h-10 w-10 text-cyan-300" />
              <h2 className="mt-4 text-2xl font-semibold text-white">No orders yet</h2>
              <p className="mt-2 text-white/55">Your purchase history will appear here after checkout.</p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-black"
              >
                Browse Apps
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="market-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <PackageCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Order #{order.id.slice(-8).toUpperCase()}</div>
                      {order.transactionId && (
                        <div className="text-xs text-white/45">Txn: {order.transactionId}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/10 text-cyan-300 capitalize">
                      {order.status.toLowerCase()}
                    </span>
                    <div className="mt-1 text-white font-bold">${order.total.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 text-sm">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name ?? ''}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 text-white/80">
                        {item.product?.name ?? item.productId}
                        {item.quantity > 1 && <span className="text-white/45"> ×{item.quantity}</span>}
                      </div>
                      <div className="text-white/60">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs text-white/40">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
