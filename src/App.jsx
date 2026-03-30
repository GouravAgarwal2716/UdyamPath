import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import ValidationReport from './pages/ValidationReport';
import LearningDashboard from './pages/LearningDashboard';
import ModuleExperience from './pages/ModuleExperience';
import Report from './pages/Report';

// Shared Components
import Navbar from './components/Navbar';
import AICoach from './components/AICoach';
import ResourcesPanel from './components/ResourcesPanel';

// Protected Route stub
function ProtectedRoute({ children }) {
  const { state } = useAppContext();
  // Check if user has completed onboarding
  if (!state.user || !state.idea) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function AppShell({ children, showNav = true }) {
  return (
    <div className="flex flex-col min-h-screen bg-navy text-white">
      {showNav && <Navbar />}
      <div className="flex-1 relative">
        {children}
        <AICoach />
        <ResourcesPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell><Landing /></AppShell>} />
          <Route path="/onboarding" element={<AppShell><Onboarding /></AppShell>} />
          
          <Route path="/validate" element={<ProtectedRoute><AppShell><ValidationReport /></AppShell></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><AppShell><LearningDashboard /></AppShell></ProtectedRoute>} />
          <Route path="/module" element={<ProtectedRoute><AppShell showNav={false}><ModuleExperience /></AppShell></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><AppShell><Report /></AppShell></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
