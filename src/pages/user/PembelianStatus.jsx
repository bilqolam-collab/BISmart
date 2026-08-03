import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search } from 'lucide-react';
import './Pembelian.css';

const PembelianStatus = () => {
  const { kitabOrders } = useAppContext();
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setHasSearched(true);
    const found = kitabOrders.find(o => o.id === searchId || o.namaLembaga.toLowerCase().includes(searchId.toLowerCase()));
    setResult(found || null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Diproses':
        return <span className="badge badge-process">{status}</span>;
      case 'Sudah Ready':
        return <span className="badge badge-ready">{status}</span>;
      case 'Sudah Diambil/Dikirim':
        return <span className="badge badge-done">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="container pembelian-container">
      <div className="form-header text-center">
        <h1 className="text-gradient">Cek Status Pesanan Kitab</h1>
        <p>Masukkan ID Pesanan atau Nama Lembaga Anda untuk mengecek status pesanan.</p>
      </div>

      <div className="search-box-container">
        <form onSubmit={handleSearch} className="search-form glass-panel">
          <input 
            type="text" 
            className="search-input form-control" 
            placeholder="Masukkan ID Pesanan (Misal: ORD-123) atau Nama Lembaga"
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
                <div>
                  <h3>{result.namaLembaga}</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ID: {result.id}</span>
                </div>
                {getStatusBadge(result.status)}
              </div>
              
              <div className="order-details-grid">
                <div>
                  <div className="detail-row">
                    <span className="detail-label">Tanggal Pesan</span>
                    <span className="detail-value">{new Date(result.tanggalPesanan).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Rencana Pengambilan</span>
                    <span className="detail-value text-primary font-medium">{new Date(result.tanggalPengambilan).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                
                <div className="invoice-box">
                  <span className="detail-label">Total Tagihan</span>
                  <h2 className="invoice-total">{formatRupiah(result.totalHarga)}</h2>
                  {result.totalHarga === 0 && <span className="text-sm text-secondary">Harga sedang dihitung admin</span>}
                </div>
              </div>

              <div className="mt-6">
                <h4>Detail Item</h4>
                <div className="table-responsive mt-2">
                  <table className="cart-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-right">Harga Satuan</th>
                        <th className="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.nama}</td>
                          <td className="text-center">{item.qty}</td>
                          <td className="text-right">{item.hargaSatuan > 0 ? formatRupiah(item.hargaSatuan) : '-'}</td>
                          <td className="text-right font-medium">{item.hargaSatuan > 0 ? formatRupiah(item.qty * item.hargaSatuan) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="progress-tracker mt-6">
                <div className={`progress-step ${['Diproses', 'Sudah Ready', 'Sudah Diambil/Dikirim'].includes(result.status) ? 'active' : ''}`}>
                  <div className="step-circle">1</div>
                  <span>Diproses</span>
                </div>
                <div className={`progress-line ${['Sudah Ready', 'Sudah Diambil/Dikirim'].includes(result.status) ? 'active' : ''}`}></div>
                <div className={`progress-step ${['Sudah Ready', 'Sudah Diambil/Dikirim'].includes(result.status) ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <span>Ready</span>
                </div>
                <div className={`progress-line ${['Sudah Diambil/Dikirim'].includes(result.status) ? 'active' : ''}`}></div>
                <div className={`progress-step ${['Sudah Diambil/Dikirim'].includes(result.status) ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <span>Diambil/Kirim</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel text-center slide-up" style={{ padding: '3rem' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Pesanan tidak ditemukan</h3>
              <p>Pastikan ID Pesanan atau Nama Lembaga yang Anda masukkan sudah benar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PembelianStatus;
