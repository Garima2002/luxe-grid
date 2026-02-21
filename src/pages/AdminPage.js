import React, { useState } from 'react';
import { addProduct, deleteProduct, updateProductStock, updateOrderStatus } from '../firebase/db';
import { fallbackImg, ORDER_STATUSES, fmtDate } from '../constants';
import ImageUploader from '../components/ImageUploader';
import './AdminPage.css';

export default function AdminPage({ products, orders, onRefresh, showToast }) {
  const [tab, setTab] = useState('dashboard');
  const [form, setForm] = useState({
    name: '', price: '', description: '', images: [], inStock: true
  });
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── Add product ── */
  const handleAdd = async () => {
    if (!form.name.trim())   { showToast('Enter a product name', 'error'); return; }
    if (!form.price)         { showToast('Enter a price', 'error'); return; }
    if (!form.images.length) { showToast('Upload at least 1 photo first', 'error'); return; }
    setSaving(true);
    try {
      await addProduct({
        name:        form.name.trim(),
        price:       parseFloat(form.price),
        description: form.description.trim(),
        images:      form.images,
        inStock:     form.inStock,
      });
      console.log("after addProduct");
      setForm({ name: '', price: '', description: '', images: [], inStock: true });
      showToast('Product added successfully! ✅');
      onRefresh();
    } catch (e) {
      console.error('addProduct error:', e);
      // Give a useful message depending on what went wrong
      if (e.message?.includes('PASTE_YOUR')) {
        showToast('Firebase config not set! Open src/firebase/config.js and paste your Firebase keys.', 'error');
      } else if (e.message?.includes('network') || e.message?.includes('offline')) {
        showToast('No internet connection. Check your connection and try again.', 'error');
      } else {
        showToast('Error saving product: ' + e.message, 'error');
      }
    } finally {
      // This ALWAYS runs — even if error — so button never stays stuck
      setSaving(false);
    }
  };

  /* ── Delete product ── */
  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); showToast('Deleted'); onRefresh(); }
    catch (e) { showToast('Error: ' + e.message, 'error'); }
  };

  /* ── Toggle stock ── */
  const handleToggle = async (id, cur) => {
    try { await updateProductStock(id, !cur); onRefresh(); }
    catch (e) { showToast('Error: ' + e.message, 'error'); }
  };

  /* ── Order status ── */
  const handleStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); showToast('Status updated'); onRefresh(); }
    catch (e) { showToast('Error: ' + e.message, 'error'); }
  };

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => !o.status || o.status === 'pending').length;

  const TABS = [
    ['dashboard', '📊', 'Dashboard'],
    ['add',       '➕', 'Add'],
    ['products',  '📦', 'Products'],
    ['orders',    '🗒',  'Orders'],
  ];

  return (
    <div className="admin-page">

      {/* ── Desktop sidebar ── */}
      <nav className="admin-sidebar">
        <div className="sidebar-label">Admin Panel</div>
        {TABS.map(([k,, l]) => (
          <button key={k} className={`sidebar-btn${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="admin-tab-bar">
        {TABS.map(([k, icon, l]) => (
          <button key={k} className={`tab-bar-btn${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>
            <span className="tab-icon">{icon}</span>
            {l}
          </button>
        ))}
      </nav>

      <main className="admin-main">

        {/* ════════════════════════════════
            DASHBOARD
        ════════════════════════════════ */}
        {tab === 'dashboard' && <>
          <h2>Dashboard</h2>
          <div className="stat-grid">
            {[
              [products.length, 'Products'],
              [orders.length, 'Orders'],
              [`₹${revenue}`, 'Revenue'],
              [pending, 'Pending'],
            ].map(([v, l]) => (
              <div key={l} className="stat-card">
                <div className="stat-val">{v}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>

          <div className="admin-card">
            <h3 className="card-subtitle">Recent Orders</h3>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(o => (
                    <tr key={o.id}>
                      <td className="td-id">{o.id.slice(-6).toUpperCase()}</td>
                      <td>{o.customer?.name}<br /><span className="td-muted">{o.customer?.phone}</span></td>
                      <td className="td-items">{o.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td className="td-price">₹{o.total}</td>
                      <td>
                        <select className="status-select" value={o.status || 'pending'}
                          onChange={e => handleStatus(o.id, e.target.value)}>
                          {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {/* ════════════════════════════════
            ADD PRODUCT
        ════════════════════════════════ */}
        {tab === 'add' && <>
          <h2>Add New Product</h2>
          <div className="admin-card">

            {/* Name + Price */}
            <div className="form-grid-2">
              <div className="afield">
                <label className="alabel">Product Name *</label>
                <input className="ainput" placeholder="e.g. Gold Jhumka" value={form.name}
                  onChange={e => upd('name', e.target.value)} />
              </div>
              <div className="afield">
                <label className="alabel">Price (₹) *</label>
                <input className="ainput" type="number" inputMode="decimal"
                  placeholder="e.g. 299" value={form.price}
                  onChange={e => upd('price', e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div className="afield">
              <label className="alabel">Description</label>
              <textarea className="ainput ainput-ta"
                placeholder="e.g. Handcrafted gold-plated jhumkas with meenakari work..."
                value={form.description} onChange={e => upd('description', e.target.value)} />
            </div>

            {/* ── IMAGE UPLOAD ── */}
            <div className="afield">
              <label className="alabel">
                Product Photos *
                <span className="alabel-hint"> — pick from your phone or computer</span>
              </label>
              <ImageUploader
                images={form.images}
                onChange={imgs => upd('images', imgs)}
                showToast={showToast}
              />
            </div>

            {/* In Stock toggle */}
            <div className="toggle-row" style={{ marginTop: 8 }}>
              <label className="toggle">
                <input type="checkbox" checked={form.inStock}
                  onChange={e => upd('inStock', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              <span className="toggle-label">In Stock</span>
            </div>

            <button className="add-prod-btn" onClick={handleAdd} disabled={saving}>
              {saving ? 'Saving…' : 'Add Product to Shop'}
            </button>
          </div>
        </>}

        {/* ════════════════════════════════
            ALL PRODUCTS
        ════════════════════════════════ */}
        {tab === 'products' && <>
          <h2>All Products ({products.length})</h2>
          <div className="admin-products-grid">
            {products.map(p => (
              <div key={p.id} className="admin-product-card">
                <img src={p.images?.[0]} alt={p.name}
                  onError={e => { e.target.src = fallbackImg(p.name); }} />
                <div className="apc-body">
                  <p className="apc-name">{p.name}</p>
                  <p className="apc-price">₹{p.price}</p>
                  <div className="toggle-row" style={{ marginBottom: 10 }}>
                    <label className="toggle">
                      <input type="checkbox" checked={p.inStock !== false}
                        onChange={() => handleToggle(p.id, p.inStock !== false)} />
                      <span className="toggle-slider" />
                    </label>
                    <span className={`toggle-label${p.inStock !== false ? ' stock-on' : ''}`}>
                      {p.inStock !== false ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <button className="del-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))}
            {!products.length && (
              <p style={{ color: '#555', fontFamily: 'Jost', fontSize: 14, gridColumn: '1/-1' }}>
                No products yet. Go to "Add" tab to add your first jhumka!
              </p>
            )}
          </div>
        </>}

        {/* ════════════════════════════════
            ALL ORDERS
        ════════════════════════════════ */}
        {tab === 'orders' && <>
          <h2>All Orders ({orders.length})</h2>
          <div className="admin-card table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>#</th><th>Date</th><th>Customer</th><th>Address</th><th>Items</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="td-id">{o.id.slice(-6).toUpperCase()}</td>
                    <td className="td-date">{fmtDate(o.createdAt)}</td>
                    <td>{o.customer?.name}<br /><span className="td-muted">{o.customer?.phone}</span></td>
                    <td className="td-addr">{o.customer?.address}, {o.customer?.city}</td>
                    <td className="td-items">{o.items?.map(i => `${i.name} ×${i.qty}`).join(', ')}</td>
                    <td className="td-price">₹{o.total}</td>
                    <td>
                      <select className="status-select" value={o.status || 'pending'}
                        onChange={e => handleStatus(o.id, e.target.value)}>
                        {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#555', padding: 32 }}>No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>}

      </main>
    </div>
  );
}
