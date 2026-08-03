import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Home, Info, Book, FileText, Image, MapPin, Phone } from 'lucide-react';
import './UserLayout.css'; // Let's use specific CSS module or just file

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: <Home size={18} /> },
    { name: 'Profil', path: '/profil', icon: <Info size={18} /> },
    { name: 'Pendaftaran', path: '/pendaftaran', icon: <FileText size={18} /> },
    { name: 'Lembaga', path: '/data/lembaga', icon: <Book size={18} /> },
    { name: 'Guru', path: '/data/guru', icon: <Book size={18} /> },
    { name: 'Santri', path: '/data/santri', icon: <Book size={18} /> },
    { name: 'Syahadah', path: '/layanan/syahadah', icon: <BookOpen size={18} /> },
    { name: 'Kitab', path: '/layanan/pembelian', icon: <Book size={18} /> },
  ];

  return (
    <div className="user-layout">
      {/* Navbar */}
      <nav className="navbar glass-panel">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">Bilqolam</span>
            <span className="logo-badge">System</span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link to="/admin" className="btn btn-primary" style={{ marginLeft: '1rem' }}>
              Admin Panel
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="mobile-nav glass-panel">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
             <Link to="/admin" className="mobile-nav-link text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Admin Panel
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', paddingBottom: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#ffffff' }}>Bilqolam Singosari</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              Pusat Informasi & Pelayanan Bilqolam.<br/>
              Berdedikasi untuk mencetak generasi Qur'ani yang berakhlak mulia.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <MapPin size={18} style={{ color: 'var(--primary-color)' }} /> Alamat Kantor
            </h4>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#ffffff' }}>Kantor 1 : Zawiyah Tahfidhil Quran</strong><br/>
                (Gg. 2 Tumapel Pagentan)
              </p>
              <p>
                <strong style={{ color: '#ffffff' }}>Kantor 2 : Pesantren Ilmu Al Quran</strong><br/>
                (Jl Raya Singosari 107)
              </p>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <Phone size={18} style={{ color: 'var(--primary-color)' }} /> Hubungi Kami
            </h4>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>Ust. Khoirul Anwar <br/><span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>0858-5038-0313</span></p>
              <p>Ust. Rizal Affandi <br/><span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>0857-5586-3637</span></p>
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            &copy; 2026 Bilqolam Information System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
