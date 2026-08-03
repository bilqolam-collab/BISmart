import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './ErrorBoundary';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/user/Home';
import Profil from './pages/user/Profil';
import DataLembaga from './pages/user/DataLembaga';
import DataGuru from './pages/user/DataGuru';
import DataSantri from './pages/user/DataSantri';
import AlurPendaftaran from './pages/user/AlurPendaftaran';

import SyahadahForm from './pages/user/SyahadahForm';
import SyahadahStatus from './pages/user/SyahadahStatus';
import PembelianForm from './pages/user/PembelianForm';
import PembelianStatus from './pages/user/PembelianStatus';
import LayananDetail from './pages/user/LayananDetail';

// Admin Pages
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSyahadah from './pages/admin/ManageSyahadah';
import ManagePembelian from './pages/admin/ManagePembelian';
import ManageMasterData from './pages/admin/ManageMasterData';
import ManageProfil from './pages/admin/ManageProfil';
import ManageLayanan from './pages/admin/ManageLayanan';
import ManageProduk from './pages/admin/ManageProduk';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="profil" element={<Profil />} />
              
              <Route path="data/lembaga" element={<DataLembaga />} />
              <Route path="data/guru" element={<DataGuru />} />
              <Route path="data/santri" element={<DataSantri />} />
              <Route path="pendaftaran" element={<AlurPendaftaran />} />
              
              {/* Layanan Routes */}
              <Route path="layanan/syahadah" element={<SyahadahForm />} />
              <Route path="layanan/syahadah/status" element={<SyahadahStatus />} />
              
              <Route path="layanan/pembelian" element={<PembelianForm />} />
              <Route path="layanan/pembelian/status" element={<PembelianStatus />} />
              <Route path="layanan/:id" element={<LayananDetail />} />
            </Route>

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="syahadah" element={<ManageSyahadah />} />
              <Route path="pembelian" element={<ManagePembelian />} />
              <Route path="master-data" element={<ManageMasterData />} />
              <Route path="profil" element={<ManageProfil />} />
              <Route path="layanan" element={<ManageLayanan />} />
              <Route path="produk" element={<ManageProduk />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
