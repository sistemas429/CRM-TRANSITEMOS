import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EstadoTicketsPage from './pages/EstadoTicketsPage';
import GenerarTicketPage from './pages/GenerarTicketPage';
import ReportesPage from './pages/ReportesPage';
import AreasPage from './pages/AreasPage';
import UsuariosPage from './pages/UsuariosPage';
import RolesPage from './pages/RolesPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz '/' directamente al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Tu pantalla de login original intacta */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas principales del sistema (protegidas) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Rutas del módulo de tickets */}
          <Route path="/generar-ticket" element={<GenerarTicketPage />} />
          <Route path="/crear-ticket" element={<GenerarTicketPage />} />
          <Route path="/tickets" element={<EstadoTicketsPage />} />
        </Route>

        {/* Rutas exclusivas de admin */}
        <Route element={<AdminRoute />}>
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/roles" element={<RolesPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}




