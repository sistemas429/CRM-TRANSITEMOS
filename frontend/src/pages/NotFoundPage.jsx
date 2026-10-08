import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f1f5f9' }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#0b4f78' }}>404</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>La página que buscas no existe.</p>
      <Link to="/dashboard" style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 700 }}>
        Volver al Dashboard
      </Link>
    </div>
  );
}







