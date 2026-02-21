import React, { useState } from 'react';
import { WHATSAPP, fallbackImg } from '../constants';
import './ProductDetailPage.css';

export default function ProductDetailPage({ product, onBack, onAddToCart }) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  const isOOS = product.inStock === false;
  const waMsg = encodeURIComponent(
    `Hi! I'm interested in *${product.name}* (₹${product.price}). Is it available?`
  );

  return (
    <div className="detail-page">
      {/* Back button bar */}
      <div className="detail-back-bar">
        <button className="back-btn" onClick={onBack}>← Back to Shop</button>
      </div>

      <div className="detail-inner">
        {/* Left: Images */}
        <div className="detail-images">
          <img
            src={product.images?.[activeImg]}
            alt={product.name}
            className="detail-main-img"
            onError={e => { e.target.src = fallbackImg(product.name); }}
          />
          {product.images?.length > 1 && (
            <div className="detail-thumbs">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`detail-thumb${activeImg === i ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  onError={e => { e.target.src = 'https://placehold.co/100x100/f0e8d8/C6A75E?text=+'; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="detail-info">
          <div>
            <p className="detail-brand">Luxe Grid India</p>
            <h1 className="detail-name">{product.name}</h1>
          </div>

          <p className="detail-price">₹{product.price}</p>

          <hr className="detail-divider" />

          <p className="detail-desc">
            {product.description || 'A premium product from Luxe Grid India.'}
          </p>

          <hr className="detail-divider" />

          {!isOOS ? (
            <>
              {/* Quantity */}
              <div>
                <p className="qty-label">Quantity</p>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="detail-actions">
                <button
                  className="detail-add-btn"
                  onClick={() => onAddToCart(product, qty)}
                >
                  Add to Cart
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${waMsg}`}
                  className="detail-wa-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Order on WhatsApp
                </a>
              </div>
            </>
          ) : (
            <p className="oos-label">OUT OF STOCK</p>
          )}

          <ul className="detail-perks">
            <li>✓ Authentic premium products</li>
            <li>✓ Fast delivery across India</li>
            <li>✓ WhatsApp support available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
