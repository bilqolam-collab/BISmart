import React from 'react';

const DataPage = () => {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Data & Informasi</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Pusat data lembaga, guru, santri, dan alur pendaftaran Bilqolam.
      </p>

      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--border-radius-lg)' }}>
        <h2 style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }}>Halaman Dalam Pengembangan</h2>
        <p>Silakan fokus pada fitur <strong>Layanan Syahadah</strong> dan <strong>Layanan Pembelian Kitab</strong> untuk demonstrasi ini.</p>
      </div>
    </div>
  );
};

export default DataPage;
