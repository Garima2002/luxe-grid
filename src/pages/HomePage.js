import React from 'react';
import { WHATSAPP, fallbackImg } from '../constants';
import Loader from '../components/Loader';
import './HomePage.css';

function Hero({ featImg }) {
  const goShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="hero">
      <div className="hero-grid-bg" />
      <div className="hero-content">
        <p className="hero-eyebrow au">Est. 2026 · Meerut, India</p>
        <h1 className="hero-title au1">Luxury<br /><em>Redefined</em><br />for You</h1>
        <p className="hero-sub au2">Premium jhumkas and jewellery — handpicked and delivered across India.</p>
        <div className="hero-actions au3">
          <button className="btn-gold" onClick={goShop}>Explore Collection</button>
          <a href={`https://wa.me/${WHATSAPP}`} className="btn-ghost" target="_blank" rel="noreferrer">Chat with Us</a>
        </div>
      </div>
      {featImg && (
        <div className="hero-side">
          <img src={featImg} alt="" onError={e => { e.target.style.display = 'none'; }} />
          <div className="hero-side-overlay" />
        </div>
      )}
    </section>
  );
}

function ProductCard({ product, onView, onAddToCart }) {
  const isOOS = product.inStock === false;
  return (
    <article className={`product-card${isOOS ? ' oos' : ''}`} onClick={() => onView(product)}>
      <div className="product-img-wrap">
        <img
          src={product.images?.[0]}
          alt={product.name}
          onError={e => { e.target.src = fallbackImg(product.name); }}
        />
        {/* Desktop hover overlay */}
        <div className="product-overlay">
          <button className="btn-overlay-gold" onClick={e => { e.stopPropagation(); onView(product); }}>View Details</button>
          {!isOOS && <button className="btn-overlay-dark" onClick={e => { e.stopPropagation(); onAddToCart(product, 1); }}>Add to Cart</button>}
        </div>
      </div>

      {isOOS && <span className="oos-tag">Out of Stock</span>}

      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>

        {/* Mobile tap buttons — shown only on phones */}
        {!isOOS && (
          <div className="mobile-card-actions" onClick={e => e.stopPropagation()}>
            <button className="mob-view" onClick={() => onView(product)}>Details</button>
            <button className="mob-add"  onClick={() => onAddToCart(product, 1)}>Add Cart</button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function HomePage({ products, loading, onView, onAddToCart }) {
  return (
    <>
      <Hero featImg={products[0]?.images?.[0]} />

      <section id="shop" className="shop-section">
        <div className="section-header">
          <p className="section-eyebrow">Handpicked · Premium</p>
          <h2 className="section-title">Our Collection</h2>
          <p className="section-sub">{products.length} products available</p>
        </div>
        {loading ? <Loader /> : (
          <div className="product-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} onView={onView} onAddToCart={onAddToCart} />
            ))}
            {!products.length && <div className="empty-state">No products yet. Check back soon!</div>}
          </div>
        )}
      </section>

      <section className="contact-section">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-sub">For orders & queries — message us on WhatsApp</p>
        <a href={`https://wa.me/${WHATSAPP}`} className="btn-gold" target="_blank" rel="noreferrer">💬 Chat on WhatsApp</a>
      </section>
    </>
  );
}
