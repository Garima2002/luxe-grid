import React, { useState } from 'react';
import { ADMIN_PASSWORD, LOGO_URL } from '../constants';
import './AdminLoginPage.css';

export default function AdminLoginPage({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
      setErr('');
    } else {
      setErr('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <img src={LOGO_URL} alt="Luxe Grid India" />
        </div>

        <h2 className="login-title">Admin Access</h2>
        <p className="login-sub">Owner-only area</p>

        {err && <div className="login-error">{err}</div>}

        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Enter Admin Panel
        </button>
      </div>
    </div>
  );
}
