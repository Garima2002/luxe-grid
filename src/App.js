import React, { useState, useEffect, useCallback } from 'react';
import { getAll, placeOrder } from './firebase/db';
import { ADMIN_PASSWORD } from './constants';
import { useToast } from './hooks/useToast';

// Components
import Header       from './components/Header';
import CartDrawer   from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast        from './components/Toast';

// Pages
import HomePage         from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage       from './pages/OrdersPage';
import AdminLoginPage   from './pages/AdminLoginPage';
import AdminPage        from './pages/AdminPage';

import './App.css';

export default function App() {
  // ── State ──────────────────────────────────────────
  const [page, setPage]             = useState('home');   // 'home' | 'orders' | 'adminLogin'
  const [detailProduct, setDetail]  = useState(null);     // product being viewed in detail
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loadingP, setLoadingP]     = useState(true);
  const [loadingO, setLoadingO]     = useState(false);
  const [cart, setCart]             = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckout] = useState(false);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const toast = useToast();

  // ── Data fetching ───────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoadingP(true);
    try { setProducts(await getAll('products')); } catch {}
    setLoadingP(false);
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingO(true);
    try { setOrders(await getAll('orders')); } catch {}
    setLoadingO(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (page === 'orders' || isAdmin) loadOrders();
  }, [page, isAdmin, loadOrders]);

  // ── Cart helpers ────────────────────────────────────
  const addToCart = useCallback((product, qty = 1) => {
    setCart(c => {
      const existing = c.find(i => i.id === product.id);
      return existing
        ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
        : [...c, { ...product, qty }];
    });
    toast.show(`${product.name} added to cart!`);
    setCartOpen(true);
  }, [toast]);

  const updateQty = (id, qty) => {
    if (qty < 1) { removeItem(id); return; }
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeItem = id => setCart(c => c.filter(i => i.id !== id));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Place order ─────────────────────────────────────
  const handlePlaceOrder = async (customer, total) => {
    try {
      await placeOrder({
        customer,
        total,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.images?.[0] || '' })),
      });
      setCart([]);
      setCheckout(false);
      setCartOpen(false);
      toast.show('Order placed! We\'ll contact you soon 🎉');
    } catch (e) {
      toast.show('Error placing order: ' + e.message, 'error');
    }
  };

  // ── Admin ───────────────────────────────────────────
  const handleAdminClick = () => {
    if (isAdmin) {
      // Exit admin
      setIsAdmin(false);
      setAdminAuthed(false);
      setPage('home');
    } else if (adminAuthed) {
      setIsAdmin(true);
    } else {
      setPage('adminLogin');
    }
  };

  const handleAdminLogin = () => {
    setAdminAuthed(true);
    setIsAdmin(true);
    setPage('home');
  };

  const navigateTo = (p) => {
    setPage(p);
    setDetail(null);
  };

  // ── Admin login page has its own full-screen layout ─
  if (page === 'adminLogin') {
    return (
      <>
        <AdminLoginPage onLogin={handleAdminLogin} />
        <Toast toasts={toast.toasts} />
      </>
    );
  }

  // ── Normal layout ───────────────────────────────────
  return (
    <div className="app">
      <Header
        setPage={navigateTo}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
        isAdmin={isAdmin}
        onAdminClick={handleAdminClick}
      />

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={() => { setCartOpen(false); setCheckout(true); }}
        />
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckout(false)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* Page Router */}
      {isAdmin ? (
        <AdminPage
          products={products}
          orders={orders}
          onRefresh={() => { loadProducts(); loadOrders(); }}
          showToast={toast.show}
        />
      ) : page === 'orders' ? (
        <OrdersPage orders={orders} loading={loadingO} />
      ) : detailProduct ? (
        <ProductDetailPage
          product={detailProduct}
          onBack={() => setDetail(null)}
          onAddToCart={addToCart}
        />
      ) : (
        <HomePage
          products={products}
          loading={loadingP}
          onView={setDetail}
          onAddToCart={addToCart}
        />
      )}

      {/* Footer (not shown in admin) */}
      {!isAdmin && (
        <footer className="site-footer">
          © 2026 Luxe Grid India · Crafted with care in Meerut, India
        </footer>
      )}

      <Toast toasts={toast.toasts} />
    </div>
  );
}
