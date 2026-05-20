import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";
import { LoginPage, RegisterPage } from "./pages/auth/index.js";
import { EtalasePage } from "./pages/etalase/index.js";
import { ResellerDashboard } from "./pages/reseller/index.js";
import { PemasokPortal } from "./pages/pemasok/index.js";
import {
  GroupBuyListPage,
  GroupBuyRoomDetailPage,
  CreateRoomPage,
} from "./pages/group-buy/index.js";
import { ToastProvider, useToast } from "./components/ToastProvider.js";
import { useEffect } from "react";
import type { SyncEvent } from "./services/sync.js";

function SyncEventListener() {
  const { showToast } = useToast();

  useEffect(() => {
    const handleSyncEvent = (event: CustomEvent<SyncEvent>) => {
      const { type } = event.detail;
      if (type === "sync_complete") {
        showToast("Pesanan berhasil disinkronkan", "SUCCESS");
      } else if (type === "sync_failed") {
        showToast("Sinkronisasi gagal. Akan dicoba lagi otomatis.", "ERROR");
      }
    };

    window.addEventListener("sobat-sync-event", handleSyncEvent as EventListener);
    return () => {
      window.removeEventListener("sobat-sync-event", handleSyncEvent as EventListener);
    };
  }, [showToast]);

  return null;
}

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
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

  return children;
}

function AppContent() {
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
      <SyncEventListener />
      <Routes>
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

        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route path="/etalase/:agenId" element={<EtalasePage />} />

        <Route
          path="/group-buy"
          element={
            <ProtectedRoute allowedRoles={["RESELLER", "AGEN_UTAMA", "AGEN_MITRA"]}>
              <GroupBuyListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/group-buy/create"
          element={
            <ProtectedRoute allowedRoles={["AGEN_UTAMA"]}>
              <CreateRoomPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/group-buy/:roomId"
          element={
            <ProtectedRoute allowedRoles={["RESELLER", "AGEN_UTAMA", "AGEN_MITRA"]}>
              <GroupBuyRoomDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reseller/*"
          element={
            <ProtectedRoute allowedRoles={["RESELLER", "AGEN_UTAMA", "AGEN_MITRA"]}>
              <ResellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pemasok/*"
          element={
            <ProtectedRoute allowedRoles={["PEMASOK"]}>
              <PemasokPortal />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
