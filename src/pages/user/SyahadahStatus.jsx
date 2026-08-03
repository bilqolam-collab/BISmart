import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search } from 'lucide-react';
import './Syahadah.css';

const SyahadahStatus = () => {
  const { syahadahList } = useAppContext();
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setHasSearched(true);
    const found = syahadahList.find(s => s.id === searchId || s.namaLembaga.toLowerCase().includes(searchId.toLowerCase()));
    setResult(found || null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Proses Pengerjaan':
        return <span className="badge badge-process">{status}</span>;
      case 'Selesai Pengerjaan':
        return <span className="badge badge-ready">{status}</span>;
      case 'Sudah Diambil':
        return <span className="badge badge-done">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container syahadah-container">
      <div className="form-header text-center">
        <h1 className="text-gradient">Cek Status Syahadah</h1>
        <p>Masukkan ID Tracking atau Nama Lembaga Anda untuk mengecek status pengerjaan syahadah.</p>
      </div>

      <div className="search-box-container">
        <form onSubmit={handleSearch} className="search-form glass-panel">
          <input 
            type="text" 
            className="search-input form-control" 
            placeholder="Masukkan ID Tracking (Misal: SYA-123) atau Nama Lembaga"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button type="submit" className="btn btn-primary search-btn">
            <Search size={20} /> Cari
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="search-result mt-6">
          {result ? (
            <div className="glass-panel result-card slide-up">
              <div className="result-header">
                <h3>{result.namaLembaga}</h3>
                {getStatusBadge(result.status)}
              </div>
              
              <div className="result-details">
                <div className="detail-row">
                  <span className="detail-label">ID Pengajuan</span>
                  <span className="detail-value font-mono">{result.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nama Pengaju</span>
                  <span className="detail-value">{result.nama}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tingkat Ujian</span>
                  <span className="detail-value">{result.tingkatUjian.join(', ')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tanggal Pengajuan</span>
                  <span className="detail-value">{new Date(result.tanggalPengajuan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="progress-tracker mt-6">
                <div className={`progress-step ${['Proses Pengerjaan', 'Selesai Pengerjaan', 'Sudah Diambil'].includes(result.status) ? 'active' : ''}`}>
                  <div className="step-circle">1</div>
                  <span>Proses</span>
                </div>
                <div className={`progress-line ${['Selesai Pengerjaan', 'Sudah Diambil'].includes(result.status) ? 'active' : ''}`}></div>
                <div className={`progress-step ${['Selesai Pengerjaan', 'Sudah Diambil'].includes(result.status) ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <span>Selesai</span>
                </div>
                <div className={`progress-line ${['Sudah Diambil'].includes(result.status) ? 'active' : ''}`}></div>
                <div className={`progress-step ${['Sudah Diambil'].includes(result.status) ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <span>Diambil</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel text-center slide-up" style={{ padding: '3rem' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Data tidak ditemukan</h3>
              <p>Pastikan ID Tracking atau Nama Lembaga yang Anda masukkan sudah benar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SyahadahStatus;
