import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider }    from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider }     from './contexts/AuthContext';

import ModernNavbar  from './components/ModernNavbar';
import ModernFooter  from './components/ModernFooter';
import ProtectedRoute from './components/ProtectedRoute';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Booking        from './pages/Booking';
import Payment        from './pages/payment';
import Ticket         from './pages/ticket';
import AboutUs        from './pages/aboutus';
import Help           from './pages/help';
import Profile        from './pages/Profile';
import Notifications  from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <ModernNavbar />
            <Routes>
              {/* Public routes */}
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about"    element={<AboutUs />} />
              <Route path="/help"     element={<Help />} />

              {/* Passenger routes — must be logged in */}
              <Route path="/booking" element={
                <ProtectedRoute><Booking /></ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute><Payment /></ProtectedRoute>
              } />
              <Route path="/ticket" element={
                <ProtectedRoute><Ticket /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute><Notifications /></ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
            <ModernFooter />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;