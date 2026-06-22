import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HospitalProvider } from './contexts/HospitalContext';
import { Toaster } from './components/ui/sonner';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';

// Lazy load modules (simulated with simple imports for now)
import Overview from './modules/Overview';
import Registration from './modules/Registration';
import Admission from './modules/Admission';
import WardManagement from './modules/WardManagement';
import Investigations from './modules/Investigations';
import Pharmacy from './modules/Pharmacy';
import Finance from './modules/Finance';
import Mortuary from './modules/Mortuary';
import AuditLog from './modules/AuditLog';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/ward" element={<WardManagement />} />
        <Route path="/investigations" element={<Investigations />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/mortuary" element={<Mortuary />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <Router>
          <AppContent />
          <Toaster position="top-right" richColors />
        </Router>
      </HospitalProvider>
    </AuthProvider>
  );
}

export default App;
