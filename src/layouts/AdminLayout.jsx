import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileCheck, ShoppingCart, LogOut, Grid, Package } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-panel">
        <div className="sidebar-header">
          <h2 className="sidebar-brand">Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/master-data" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileCheck size={20} />
            Master Data
          </NavLink>
          <NavLink to="/admin/profil" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileCheck size={20} />
            Pengaturan Profil
          </NavLink>
          <NavLink to="/admin/layanan" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Grid size={20} />
            Kelola Layanan
          </NavLink>
          <NavLink to="/admin/produk" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Package size={20} />
            Kelola Produk
          </NavLink>
          <NavLink to="/admin/syahadah" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileCheck size={20} />
            Kelola Syahadah
          </NavLink>
          <NavLink to="/admin/pembelian" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            Pesanan Kitab
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link text-danger" onClick={() => {
            localStorage.removeItem('bismart_token');
            localStorage.removeItem('bismart_admin');
          }}>
            <LogOut size={20} />
            Logout & Kembali
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header glass-panel">
          <h3>Sistem Informasi Bilqolam - Administrator</h3>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
