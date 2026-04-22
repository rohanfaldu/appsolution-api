import React from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck } from 'lucide-react';

const OrdersPage = () => {
  const lastPurchaseRaw = localStorage.getItem('lastPurchase');
  const lastPurchase = lastPurchaseRaw ? JSON.parse(lastPurchaseRaw) : null;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-['Clash_Display'] text-5xl text-white">My Orders</h1>
        <p className="mt-3 text-white/60">Track recent purchases and download history.</p>

        <div className="mt-8 space-y-4">
          {lastPurchase ? (
            <div className="market-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{lastPurchase.productName}</div>
                  <div className="mt-1 text-sm text-white/55">
                    Transaction {lastPurchase.transactionId}
                  </div>
                  <div className="mt-2 text-sm text-white/45">
                    Purchased {new Date(lastPurchase.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
