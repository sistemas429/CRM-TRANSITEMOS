import React, { useEffect, useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import { apiFetch } from '../apiClient';
import { ErrorBanner, Loading } from '../components/Feedback';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, LineChart, Line, LabelList, ComposedChart, Legend } from 'recharts';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function exportCSV(filename, headers, rows) {
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportesPage() {
  const [porMes, setPorMes] = useState([]);
  const [porArea, setPorArea] = useState([]);
  const [tiempo, setTiempo] = useState(null);
  const [porPrioridad, setPorPrioridad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    setLoading(true);
    setError('');
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        apiFetch('/metrics/tickets-per-month'),
        apiFetch('/metrics/tickets-per-area'),
        apiFetch('/metrics/response-time'),
        apiFetch('/tickets/?limit=100'),
      ]);
      if (!r1.ok || !r2.ok || !r3.ok) throw new Error('No se pudieron cargar las métricas.');
      setPorMes(await r1.json());
      setPorArea(await r2.json());
      setTiempo(await r3.json());
      if (r4.ok) {
        const tickets = await r4.json();
        const counts = {};
        tickets.forEach((t) => { counts[t.priority] = (counts[t.priority] || 0) + 1; });
        setPorPrioridad(Object.entries(counts).map(([name, total]) => ({ name, total })));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <AppLayout>
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#5c7cfa', margin: 0 }}>📈 Reportes y KPIs</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '3px' }}>Métricas generales del sistema de tickets</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchReportes} style={{ background: 'var(--card-bg, #ffffff)', color: '#198754', border: '1.5px solid #198754', padding: '7px 15px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              🔄 Actualizar
            </button>
            <button onClick={() => exportCSV('tickets_por_mes.csv', ['anio', 'mes', 'total'], porMes.map(m => [m.year, m.month, m.total]))} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
              ⬇️ Exportar CSV
            </button>
          </div>
        </div>

        <ErrorBanner message={error} />

        {loading ? (
          <Loading />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
            {/* TICKETS POR MES */}
            <div style={{ background: '#fff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', borderTop: '4px solid #0d6efd' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', marginTop: 0 }}>Tickets por mes</h3>
              {porMes.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Sin datos.</p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <ComposedChart data={porMes.map(m => ({ name: `${MESES[m.month - 1]} ${m.year}`, total: m.total }))}>
                    <defs>
                      <linearGradient id="colorMes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#555' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#555' }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="total" stroke="none" fill="url(#colorMes)" />
                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* TICKETS POR ÁREA */}
            <div style={{ background: '#fff', padding: "12px 14px", borderRadius: '10px', border: '1px solid #e2e8f0', borderTop: '4px solid #0d6efd' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', marginTop: 0 }}>Tickets por área</h3>
              {porArea.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Sin datos.</p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={[...porArea].sort((a,b) => b.total - a.total)} layout="vertical" margin={{ left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#555' }} />
                    <YAxis type="category" dataKey="area" tick={{ fontSize: 12, fill: '#555' }} width={90} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={16}>
                      {[...porArea].sort((a,b) => b.total - a.total).map((entry, idx) => (
                        <Cell key={entry.area} fill={['#0b4f78', '#1d78c8', '#38bdf8', '#a5d8ff', '#0ea5e9', '#7dd3fc', '#bae6fd', '#e0f2fe'][idx % 8]} />
                      ))}
                      <LabelList dataKey="total" position="right" style={{ fontSize: 11, fill: '#333' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* TICKETS POR PRIORIDAD */}
            <div style={{ background: '#fff', padding: "12px 14px", borderRadius: '10px', border: '1px solid #e2e8f0', borderTop: '4px solid #0d6efd' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', marginTop: 0 }}>Tickets por prioridad</h3>
              {porPrioridad.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Sin datos.</p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={porPrioridad}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#555' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#555' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                      {porPrioridad.map((entry, idx) => (
                        <Cell key={entry.name} fill={['#0b4f78', '#1d78c8', '#38bdf8', '#a5d8ff'][idx % 4]} />
                      ))}
                      <LabelList dataKey="total" position="top" style={{ fontSize: 11, fill: '#333' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* TIEMPO DE RESPUESTA */}
            <div style={{ background: '#fff', padding: "12px 14px", borderRadius: '10px', border: '1px solid #e2e8f0', borderTop: '4px solid #0d6efd', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', marginTop: 0 }}>Tiempo promedio de resolución</h3>
              {(() => {
                const horas = tiempo?.average_hours;
                const pct = horas != null ? Math.min((horas / 24) * 100, 100) : 0;
                return (
                  <div style={{ width: "110px", height: "110px", borderRadius: '50%', background: `conic-gradient(#2563eb ${pct}%, #e2e8f0 ${pct}%)`, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 12px' }}>
                    <div style={{ width: '92px', height: '92px', borderRadius: '50%', background: document.body.classList.contains('dark') ? '#1e293b' : '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>{horas != null ? `${horas.toFixed(1)}` : 'N/A'}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>horas</span>
                    </div>
                  </div>
                );
              })()}
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                {tiempo?.resolved_tickets_count ?? 0} ticket(s) resuelto(s) o cerrado(s)
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
















