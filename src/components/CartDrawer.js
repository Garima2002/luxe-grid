import React from 'react';
import { WHATSAPP, fallbackImg, buildWhatsAppMsg } from '../constants';
import './CartDrawer.css';

export default function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onCheckout }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <span className="cart-title">Your Cart</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍</div>
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-sub">Add products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="cart-item-img"
                  onError={e => { e.target.src = fallbackImg(item.name); }}
                />
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">₹{item.price} each</span>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(item.id)}>Remove</button>
                </div>
                <span className="cart-item-total">₹{item.price * item.qty}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">₹{total}</span>
            </div>
            <button className="btn-gold-full" onClick={onCheckout}>
              Proceed to Checkout
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${buildWhatsAppMsg(cart, {}, total)}`}
              className="btn-outline-full"
              target="_blank"
              rel="noreferrer"
            >
              💬 Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
