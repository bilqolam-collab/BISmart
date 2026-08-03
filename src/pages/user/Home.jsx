import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, MapPin, Phone } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { iconMap } from '../../utils/icons';
import './Home.css';

const Home = () => {
  const { layananList, produkList } = useAppContext();

  return (
    <div className="home-page">
      {/* Figures / Tokoh Section (Bagian Atas) */}
      <section className="figures-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Pimpinan & Guru Besar Bilqolam</h2>
            <p>Mengenal tokoh utama pencetus dan pengembang Metode Bilqolam</p>
          </div>
          
          <div className="figures-grid">
            <div className="figure-card glass-panel">
              <div className="figure-image-wrapper">
                <img 
                  src="/kh-basori-alwi.png" 
                  alt="KH.M. Basori Alwi" 
                  className="figure-image" 
                />
              </div>
              <div className="figure-info">
                <h3 className="figure-name">KH.M. Basori Alwi</h3>
                <span className="figure-role">Guru Besar Bilqolam</span>
              </div>
            </div>

            <div className="figure-card glass-panel">
              <div className="figure-image-wrapper">
                <img 
                  src="/kh-anas-basori.png" 
                  alt="KH.M. Anas Basori, Lc., MA." 
                  className="figure-image" 
                />
              </div>
              <div className="figure-info">
                <h3 className="figure-name">KH.M. Anas Basori, Lc., MA.</h3>
                <span className="figure-role">Direktur Bilqolam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title text-gradient">Sistem Informasi Bilqolam</h1>
            <p className="hero-subtitle">
              Pusat Pelayanan, Pendaftaran, dan Pembelian Kitab Metode Bilqolam Singosari - Malang. Membangun generasi Qurani yang berprestasi.
            </p>
            <div className="hero-actions">
              <Link to="/layanan/pembelian" className="btn btn-primary">
                Pesan Kitab Sekarang
              </Link>
              <Link to="/layanan/syahadah" className="btn btn-outline">
                Pengajuan Syahadah
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="glass-card hero-stats">
              <div className="stat-item">
                <h3>500+</h3>
                <p>Lembaga Bergabung</p>
              </div>
              <div className="stat-item">
                <h3>10k+</h3>
                <p>Santri Lulus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Layanan Kami</h2>
            <p>Berbagai layanan pendidikan dan sertifikasi Bilqolam</p>
          </div>
          
          <div className="services-grid">
            {layananList.map((service, index) => (
              <div key={service.id || index} className="service-card glass-panel">
                <div className="service-icon">
                  {iconMap[service.icon] || <BookOpen size={32} />}
                </div>
                <h3>{service.title}</h3>
                <Link to={`/layanan/${service.id}`} className="service-link">
                  Selengkapnya <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Products Section */}
      <section className="products-section" style={{ padding: '5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Katalog Produk & Kitab</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Daftar lengkap produk, kitab suci, buku panduan, dan alat peraga resmi Bilqolam</p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="cart-table" style={{ width: '100%', minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                    <th style={{ width: '250px' }}>Nama Produk / Kitab</th>
                    <th>Deskripsi Rinci</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {produkList.map((produk, idx) => (
                    <tr key={produk.id}>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: '500' }}>{idx + 1}</td>
                      <td>
                        <strong style={{ color: 'var(--primary-color)', fontSize: '1.05rem' }}>{produk.nama}</strong>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {produk.deskripsi || <em style={{ color: 'var(--text-tertiary)' }}>Tidak ada deskripsi.</em>}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Link 
                          to="/layanan/pembelian" 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          Pesan
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {produkList.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Belum ada data produk tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
