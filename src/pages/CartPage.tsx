import React from 'react';
import { Link } from 'react-router-dom';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import { getCartItems, removeFromCart } from '../utils/marketplaceStorage';

const CartPage = () => {
  const [items, setItems] = React.useState(getCartItems());

  const products = items
    .map((item) => {
      const product = STATIC_PRODUCTS.find((p) => String(p.id) === String(item.id));
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as Array<(typeof STATIC_PRODUCTS)[number] & { quantity: number }>;

  const handleRemove = (id: string | number) => {
    removeFromCart(id);
    setItems(getCartItems());
  };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 max-w-[1440px] mx-auto">
      <header className="mb-12">
        <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase mb-2 block">Checkout Journey</span>
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface">Your Cart.</h1>
      </header>

      {products.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-16 text-center border border-on-surface/5">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">shopping_cart</span>
          <h2 className="font-headline text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-on-surface-variant mb-8">Browse the marketplace and add apps you like.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg font-headline font-bold hover:bg-primary-fixed-dim transition-all"
          >
            Browse Apps
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-[65%] space-y-6">
            {products.map((product) => (
              <div key={product.id} className="bg-surface-container-lowest rounded-xl p-6 border border-on-surface/5 hover:border-primary-fixed transition-all group">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-headline text-xl font-bold">{product.name}</h3>
                        <p className="text-on-surface-variant text-sm mt-1">{product.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center gap-4 bg-surface-container-low rounded-lg p-1">
                        <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </span>
                        <span className="font-label w-4 text-center">{product.quantity}</span>
                        <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-label text-sm text-on-surface-variant block">Price</span>
                        <span className="font-headline font-bold text-xl">${(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-[35%]">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-container-lowest rounded-xl p-8 border border-on-surface/5 shadow-2xl shadow-on-surface/5">
                <h2 className="font-headline text-2xl font-bold mb-8">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-label text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Estimated Tax</span>
                    <span className="font-label text-on-surface">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Processing Fee</span>
                    <span className="text-primary font-bold">FREE</span>
                  </div>
                  <div className="pt-4 border-t border-on-surface/10 flex justify-between items-end">
                    <span className="font-headline font-bold text-lg">Total</span>
                    <span className="font-headline font-black text-3xl text-on-surface">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-primary-fixed text-on-primary-fixed py-5 rounded-lg font-headline font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-fixed-dim transition-all shadow-lg shadow-primary-fixed/20 group">
                  Proceed to Checkout
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>

                <div className="mt-8 flex flex-wrap justify-center gap-4 opacity-40">
                  <span className="material-symbols-outlined text-3xl">credit_card</span>
                  <span className="material-symbols-outlined text-3xl">account_balance</span>
                  <span className="material-symbols-outlined text-3xl">contactless</span>
                  <span className="material-symbols-outlined text-3xl">token</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <div>
                    <h4 className="font-headline font-bold text-sm">Secure Transaction</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Your data is encrypted using 256-bit military grade protection. Built for the electric architect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
