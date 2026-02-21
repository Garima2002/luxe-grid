import React from 'react';
import { fmtDate } from '../constants';
import Loader from '../components/Loader';
import './OrdersPage.css';

export default function OrdersPage({ orders, loading }) {
  const statusClass = s => ({ pending:'st-pending', confirmed:'st-confirmed', shipped:'st-shipped', delivered:'st-delivered' }[s] || 'st-pending');

  if (loading) return <div className="orders-page"><Loader /></div>;

  return (
    <div className="orders-page">
      <div className="orders-wrap">
        <div className="orders-header">
          <p className="orders-eyebrow">Your History</p>
          <h2 className="orders-title">My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>
            <p className="orders-empty-title">No orders yet</p>
            <p className="orders-empty-sub">Your orders will appear here after checkout</p>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr><th>Order #</th><th>Date</th><th>Items</th><th>Customer</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><span className="order-num">{o.id.slice(-6).toUpperCase()}</span></td>
                      <td className="order-date">{fmtDate(o.createdAt)}</td>
                      <td><div className="order-items">{o.items?.map((i,x) => <span key={x}>{i.name} × {i.qty} — ₹{i.price*i.qty}</span>)}</div></td>
                      <td>{o.customer?.name}<br /><span className="order-phone">{o.customer?.phone}</span></td>
                      <td className="order-total">₹{o.total}</td>
                      <td><span className={`order-status ${statusClass(o.status)}`}>{o.status || 'pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            {orders.map(o => (
              <div key={o.id} className="order-card">
                <div className="order-card-row">
                  <div>
                    <div className="order-card-id">#{o.id.slice(-6).toUpperCase()}</div>
                    <div className="order-card-date">{fmtDate(o.createdAt)}</div>
                  </div>
                  <span className={`order-status ${statusClass(o.status)}`}>{o.status || 'pending'}</span>
                </div>
                <div className="order-card-items">
                  {o.items?.map((i,x) => <div key={x}>{i.name} × {i.qty} — ₹{i.price*i.qty}</div>)}
                </div>
                <div className="order-card-footer">
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{o.customer?.name} · {o.customer?.phone}</div>
                  <div className="order-card-total">₹{o.total}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
