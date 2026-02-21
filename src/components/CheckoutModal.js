import React, { useState } from 'react';
import { WHATSAPP, buildWhatsAppMsg } from '../constants';
import './CheckoutModal.css';

export default function CheckoutModal({ cart, onClose, onPlaceOrder }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [busy, setBusy] = useState(false);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Please fill in Name, Phone and Address.');
      return;
    }
    setBusy(true);
    await onPlaceOrder(form, total);
    setBusy(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <span className="modal-title">Checkout</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Order Summary */}
          <div className="order-summary">
            <p className="summary-title">Order Summary</p>
            {cart.map(i => (
              <div key={i.id} className="summary-row">
                <span>{i.name} × {i.qty}</span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="Your full name" value={form.name}
              onChange={e => update('name', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input className="form-input" type="tel" placeholder="10-digit mobile number" value={form.phone}
              onChange={e => update('phone', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Address *</label>
            <textarea className="form-input form-textarea" rows={3}
              placeholder="House no, Street, Area, Landmark"
              value={form.address} onChange={e => update('address', e.target.value)} />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="City" value={form.city}
                onChange={e => update('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input className="form-input" placeholder="6-digit pin" value={form.pincode}
                onChange={e => update('pincode', e.target.value)} />
            </div>
          </div>

          <button className="submit-btn" onClick={handleSubmit} disabled={busy}>
            {busy ? 'Placing Order…' : `Place Order · ₹${total}`}
          </button>

          <a
            href={`https://wa.me/${WHATSAPP}?text=${buildWhatsAppMsg(cart, form, total)}`}
            className="wa-btn"
            target="_blank"
            rel="noreferrer"
          >
            💬 Also Confirm on WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
