import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import { LoginPage, RegisterPage } from "./pages/auth/index.js";
import { EtalasePage } from "./pages/etalase/index.js";
import { ResellerDashboard } from "./pages/reseller/index.js";
import { PemasokPortal } from "./pages/pemasok/index.js";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect root to appropriate dashboard or login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/reseller" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Etalase Tetangga — public storefront */}
        <Route path="/etalase/:agenId" element={<EtalasePage />} />

        {/* Reseller dashboard */}
        <Route
          path="/reseller/*"
          element={
            <ProtectedRoute allowedRoles={["RESELLER", "AGEN_UTAMA", "AGEN_MITRA"]}>
              <ResellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Pemasok portal */}
        <Route
          path="/pemasok/*"
          element={
            <ProtectedRoute allowedRoles={["PEMASOK"]}>
              <PemasokPortal />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
