import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BookOpen, ShoppingBag, Users, CheckCircle } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  const { syahadahList, kitabOrders } = useAppContext();

  const totalSyahadah = syahadahList.length;
  const pendingSyahadah = syahadahList.filter(s => s.status !== 'Sudah Diambil').length;

  const totalPesanan = kitabOrders.length;
  const pendingPesanan = kitabOrders.filter(o => o.status !== 'Sudah Diambil/Dikirim').length;

  return (
    <div>
      <h2 className="admin-page-title">Dashboard Overview</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <p>Total Pengajuan Syahadah</p>
            <h3>{totalSyahadah}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <p>Syahadah Dalam Proses</p>
            <h3>{pendingSyahadah}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <p>Total Pesanan Kitab</p>
            <h3>{totalPesanan}</h3>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <p>Pesanan Belum Selesai</p>
            <h3>{pendingPesanan}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-recent mt-6">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Aktivitas Terbaru</h3>
          <p className="text-secondary mt-2">Pilih menu di sidebar untuk mulai mengelola data pengajuan Syahadah dan Pesanan Kitab.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
