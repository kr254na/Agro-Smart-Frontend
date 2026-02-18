import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import FarmsPage from '../pages/FarmsPage';
import SensorsPage from '../pages/SensorsPage';
import AnalysisPage from '../pages/AnalysisPage';
import WeatherPage from '../pages/WeatherPage';
import NotificationsPage from '../pages/NotificationsPage';
import CommunityPage from '../pages/Community';
import MarketplacePage from '../pages/Marketplace';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/Profile';
import Home from '../pages/Home';
import About from '../pages/About';
import FarmDetailPage from '../pages/FarmDetailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure this path is correct

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isDashboardRoute = [
    '/dashboard', '/farms', '/sensors', '/analysis', '/weather', '/community', '/marketplace', '/notifications', '/settings', '/profile'
  ].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Navbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <div className="flex flex-1">
        {isDashboardRoute && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}
        
        <main className={`flex-1 flex flex-col ${isDashboardRoute ? 'lg:pl-64' : ''}`}>
          <div className="flex-grow pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginPage />} />            
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Routes Group */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/farms" element={<FarmsPage />} />
                <Route path="/farms/:id" element={<FarmDetailPage />} />
                <Route path="/sensors" element={<SensorsPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>    
  );
}