import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Customer Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VillasPage from './pages/VillasPage';
import VillaDetailsPage from './pages/VillaDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVillas from './pages/admin/AdminVillas';
import AddVillaPage from './pages/admin/AddVillaPage';
import EditVillaPage from './pages/admin/EditVillaPage';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public & Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/villas" element={<VillasPage />} />
              <Route path="/villas/:id" element={<VillaDetailsPage />} />
              
              {/* Authenticated Customer Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/villas"
                element={
                  <AdminRoute>
                    <AdminVillas />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/villas/add"
                element={
                  <AdminRoute>
                    <AddVillaPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/villas/edit/:id"
                element={
                  <AdminRoute>
                    <EditVillaPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminRoute>
                    <AdminCustomers />
                  </AdminRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
