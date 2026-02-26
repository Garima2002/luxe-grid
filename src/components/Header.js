import React, { useState, useEffect } from 'react';
import { LOGO_URL } from '../constants';
import './Header.css';

export default function Header({ setPage, cartCount, openCart, isAdmin, onAdminClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menu on page navigation
  const go = (p) => { setPage(p); setMenuOpen(false); };

  const goShop = () => {
    setPage('home');
    setMenuOpen(false);
    setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const NavLinks = () => (
    <>
      {isAdmin && <span className="admin-badge">Admin</span>}
      <button className="nav-link" onClick={() => go('home')}>Home</button>
      <button className="nav-link" onClick={goShop}>Shop</button>
      {isAdmin &&<button className="nav-link" onClick={() => go('orders')}>My Orders</button>}

      {/* <button className="nav-link" onClick={() => go('orders')}>My Orders</button> */}
      <button className="nav-link" onClick={() => { onAdminClick(); setMenuOpen(false); }}>
        {isAdmin ? 'Exit Admin' : 'Admin'}
      </button>
      <button className="cart-btn" onClick={() => { openCart(); setMenuOpen(false); }}>
        🛍 Cart
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </>
  );

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <img src={LOGO_URL} className="header-logo" alt="Luxe Grid India" onClick={() => go('home')} />

        {/* Desktop nav */}
        <nav className="header-nav">
          <NavLinks />
        </nav>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile full-screen menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <NavLinks />
      </div>
    </>
  );
}
