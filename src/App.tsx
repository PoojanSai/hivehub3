import { AppProvider, useApp } from '@/context/AppContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Login from '@/components/Login';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isGuest } = useApp();
  
  if (!currentUser && !isGuest) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } 
      />
      {/* Temp Dashboard Route */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <div style={{ padding: 40, color: 'white' }}>
              <h1>Dashboard Placeholder</h1>
              <p>Main landing page for logged-in users will go here.</p>
              <a href="/" style={{ color: 'var(--teal)' }}>Go to Editor</a>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProvider>
  );
}
