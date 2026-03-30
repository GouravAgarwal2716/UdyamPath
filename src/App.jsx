import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import ValidationReport from './pages/ValidationReport';
import ModuleSelection from './pages/ModuleSelection';
import ScenarioExperience from './pages/ScenarioExperience';
import Report from './pages/Report';

// Shared Components
import Navbar from './components/Navbar';
import AICoach from './components/AICoach';
import ResourcesPanel from './components/ResourcesPanel';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#1a1a2e]">
          <Navbar />
          <div className="flex-1 relative pb-16">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/validate" element={<ValidationReport />} />
              <Route path="/modules" element={<ModuleSelection />} />
              <Route path="/scenario" element={<ScenarioExperience />} />
              <Route path="/report" element={<Report />} />
            </Routes>
            <AICoach />
            <ResourcesPanel />
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
