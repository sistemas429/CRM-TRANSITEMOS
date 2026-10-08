import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { apiFetch } from '../apiClient';
import { ErrorBanner, Loading, EmptyState, StatusBadge, PriorityBadge } from '../components/Feedback';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/tickets/?limit=100');
      if (!res.ok) throw new Error('Request failed with status code ' + res.status);
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalTickets = tickets.length;
  
  const abiertos = tickets.filter(t => (t.status || '').toLowerCase() === 'abierto').length;
  const enProceso = tickets.filter(t => ['en proceso', 'in_progress'].includes((t.status || '').toLowerCase())).length;
  const resueltos = tickets.filter(t => ['resuelto', 'resolved'].includes((t.status || '').toLowerCase())).length;
  const cerrados = tickets.filter(t => ['cerrado', 'closed'].includes((t.status || '').toLowerCase())).length;

  const baja = tickets.filter(t => (t.priority || '').toLowerCase() === 'baja').length;
  const media = tickets.filter(t => (t.priority || '').toLowerCase() === 'media').length;
  const alta = tickets.filter(t => (t.priority || '').toLowerCase() === 'alta').length;
  const urgente = tickets.filter(t => (t.priority || '').toLowerCase() === 'urgente').length;

  const areasMap = tickets.reduce((acc, t) => {
    const areaName = t.area || 'Sin Área';
    acc[areaName] = (acc[areaName] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        {/* ENCABEZADO Y ACCIONES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0b4f78', margin: 0, letterSpacing: '-0.3px' }}>
              📊 Dashboard Ejecutivo
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>
              Tránsito de Mosquera 2026 — Panel administrativo e indicadores generales
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/crear-ticket')}
              style={{ 
                background: '#2563eb', 
                color: '#ffffff', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontWeight: 700, 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,114,188,0.2)'
              }}>
              + Nuevo Ticket
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchTickets}
              style={{ 
                background: 'var(--card-bg, #ffffff)', 
                color: '#198754', 
                border: '1.5px solid #198754', 
                padding: '7px 15px', 
                borderRadius: '6px', 
                fontWeight: 700, 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
              🔄 Actualizar
            </motion.button>
          </div>
        </div>

        {/* MENSAJE DE ALERTA RED */}
        <ErrorBanner message={error} />

        {loading ? (
          <Loading />
        ) : (
          <>
            {/* TARJETAS KPI FLUIDAS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '14px', marginBottom: '20px', width: '100%' }}>
              <KpiCard title="TOTAL TICKETS" count={totalTickets} color="#2563eb" onClick={() => navigate('/tickets')} />
              <KpiCard title="ABIERTOS" count={abiertos} color="#2563eb" onClick={() => navigate('/tickets')} />
              <KpiCard title="EN PROCESO" count={enProceso} color="#2563eb" onClick={() => navigate('/tickets')} />
              <KpiCard title="RESUELTOS" count={resueltos} color="#2563eb" onClick={() => navigate('/tickets')} />
              <KpiCard title="CERRADOS" count={cerrados} color="#2563eb" onClick={() => navigate('/tickets')} />
            </div>

            {/* PANELES DE DIBUJO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginBottom: '20px', width: '100%' }}>
              
              {/* POR ESTADO */}
              <div style={{ background: 'var(--card-bg, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', letterSpacing: '0.5px', margin: 0, textTransform: 'uppercase', textAlign: 'center' }}>POR ESTADO</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, filter: 'drop-shadow(0 6px 10px rgba(2, 62, 138, 0.12))' }}>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={[{ name: 'Abiertos', value: abiertos }, { name: 'En proceso', value: enProceso }, { name: 'Resueltos', value: resueltos }, { name: 'Cerrados', value: cerrados }]} dataKey="value" nameKey="name" innerRadius={30} outerRadius={55} paddingAngle={3} stroke="#fff" strokeWidth={2}>
                        <Cell fill="#2563eb" />
                        <Cell fill="#2563eb" />
                        <Cell fill="#93c5fd" />
                        <Cell fill="#cbd5e1" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d', textAlign: 'center', fontWeight: 700 }}>
                  <span style={{ color: '#0b4f78' }}>• Abiertos: {abiertos}</span> &nbsp;|&nbsp; 
                  <span style={{ color: '#2563eb' }}>• Resueltos: {resueltos}</span>
                </div>
              </div>

              {/* POR PRIORIDAD */}
              <div style={{ background: 'var(--card-bg, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', letterSpacing: '0.5px', margin: 0, textTransform: 'uppercase', textAlign: 'center' }}>POR PRIORIDAD</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '110px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: 'Baja', total: baja }, { name: 'Media', total: media }, { name: 'Alta', total: alta }, { name: 'Urgente', total: urgente }]}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        <Cell fill="#f59e0b" />
                        <Cell fill="#fbbf24" />
                        <Cell fill="#f97316" />
                        <Cell fill="#ef4444" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* POR DEPARTAMENTO */}
              <div style={{ background: 'var(--card-bg, #ffffff)', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', height: '220px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', letterSpacing: '0.5px', margin: '0 0 12px 0', textTransform: 'uppercase', textAlign: 'center' }}>POR DEPARTAMENTO</h3>
                <div style={{ flex: 1, width: '100%' }}>
                  {Object.keys(areasMap).length === 0 ? (
                    <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'center' }}>Sin áreas registradas</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={150}>
                      <BarChart layout="vertical" data={Object.entries(areasMap).map(([area, count]) => ({ name: area, total: count }))} margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#0b6efd" radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

            </div>

            {/* TABLA DE TICKETS RECIENTES */}
            <div style={{ background: 'var(--card-bg, #ffffff)', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', letterSpacing: '0.5px', marginBottom: '16px', textTransform: 'uppercase', textAlign: 'center' }}>TICKETS RECIENTES</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'center', color: '#374151', fontSize: '0.72rem', fontWeight: 800 }}>
                    <th style={{ padding: '8px 10px' }}># ID</th>
                    <th style={{ padding: '8px 10px' }}>TÍTULO</th>
                    <th style={{ padding: '8px 10px' }}>ÁREA</th>
                    <th style={{ padding: '8px 10px' }}>ESTADO</th>
                    <th style={{ padding: '8px 10px' }}>PRIORIDAD</th>
                    <th style={{ padding: '8px 10px' }}>FECHA CREACIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="6"><EmptyState icon="📊" message="No hay tickets registrados en el sistema." /></td>
                    </tr>
                  ) : (
                    tickets.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center', background: '#f8fafc' }}>
                        <td style={{ padding: '12px 10px', fontWeight: 700, color: '#2563eb' }}>#{t.id}</td>
                        <td style={{ padding: '12px 10px', fontWeight: 600, color: '#1e293b' }}>{t.title}</td>
                        <td style={{ padding: '12px 10px', color: '#475569' }}>{t.area || 'N/A'}</td>
                        <td style={{ padding: '12px 10px' }}><StatusBadge status={t.status} /></td>
                        <td style={{ padding: '12px 10px' }}><PriorityBadge priority={t.priority} /></td>
                        <td style={{ padding: '12px 10px', color: '#475569' }}>
                          {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function KpiCard({ title, count, color, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 6px 16px rgba(2, 62, 138, 0.15)' }}
      style={{ background: 'var(--card-bg, #ffffff)', padding: '16px 8px 12px', borderRadius: '10px', borderTop: `3px solid ${color}`, borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', boxSizing: 'border-box', cursor: 'pointer' }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#4b5563', letterSpacing: '0.5px' }}>{title}</div>
      <div style={{ fontSize: '1.9rem', fontWeight: 800, color: color, margin: '4px 0 6px' }}>{count}</div>
      <div onClick={onClick} style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Ver detalles →</div>
    </motion.div>
  );
}








