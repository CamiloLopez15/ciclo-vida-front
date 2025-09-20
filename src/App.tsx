import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/layout/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CiudadanoDashboard } from './components/dashboard/ciudadano/CiudadanoDashboard';
import { RecicladorDashboard } from './components/dashboard/reciclador/RecicladorDashboard';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = user?.email === 'admin@ciclovida.com';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {isAdmin ? (
          <AdminDashboard />
        ) : user?.type === 'ciudadano' ? (
          <CiudadanoDashboard />
        ) : (
          <RecicladorDashboard />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
