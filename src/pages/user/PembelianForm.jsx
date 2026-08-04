import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, ShoppingBag, Plus, Minus, Trash2, Clock } from 'lucide-react';
import './Pembelian.css';



const PembelianForm = () => {
  const { addKitabOrder, kitabOrders, produkList } = useAppContext();
  
  const [formData, setFormData] = useState({
    namaLembaga: '',
    alamatLembaga: '',
    noHp: '',
    tanggalPengambilan: ''
  });

  // Gunakan produkList dari context (dari kelola produk)
  const activeKatalog = (produkList && produkList.length > 0) 
    ? produkList.map(p => p.nama) 
    : [
        'Bilqolam jilid 1', 'Bilqolam jilid 2', 'Bilqolam jilid 3', 'Bilqolam jilid 4',
        'Pra bilqolam', 'Buku prestasi', 'Buku pendamping', 'Kitab juz amma + Tajwid',
        'Kitab Ghorib', 'Buku Panduan Bilqolam', 'Bina Ucap', 'Mabadi Tajwid',
        'Ensiklopedia', 'Tajwid', 'Al Quran ukuran sedang', 'Al Quran ukuran besar',
        'Peraga Bilqolam jilid 1', 'Peraga Bilqolam jilid 2', 'Peraga Bilqolam jilid 3',
        'Peraga Bilqolam jilid 4', 'Peraga Pra bilqolam', 'Poster latihan materi jilid'
      ];

  // Inisialisasi state pesanan langsung dari activeKatalog
  const [pesanan, setPesanan] = useState(
    activeKatalog.map((nama, idx) => ({
      id: `kitab-${idx}`,
      nama: nama,
      qty: 0,
      hargaSatuan: 0
    }))
  );

  // Jika data dari API baru masuk, perbarui list
  React.useEffect(() => {
    if (produkList && produkList.length > 0) {
      setPesanan(prev => {
        // Ambil nama item yang sudah ada qty-nya untuk dipertahankan
        const existingPesanan = prev.filter(p => p.qty > 0);
        
        // Buat list baru dari katalog terkini (mengambil nama dari produkList)
        const newPesanan = produkList.map((prod, idx) => {
          const nama = prod.nama;
          const exists = existingPesanan.find(p => p.nama === nama);
          if (exists) return exists;
          return { id: `kitab-${idx}`, nama, qty: 0, hargaSatuan: 0 };
        });

        // Tambahkan item yang mungkin sudah dihapus dari katalog tapi ada qty-nya di pesanan saat ini (opsional)
        const newNames = newPesanan.map(p => p.nama);
        existingPesanan.forEach(p => {
          if (!newNames.includes(p.nama)) newPesanan.push(p);
        });

        return newPesanan;
      });
    }
  }, [produkList]);
  const [selectedKitab, setSelectedKitab] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleUpdateQty = (id, delta) => {
    setPesanan(pesanan.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const validPesanan = pesanan.filter(p => p.qty > 0);
    
    if (validPesanan.length === 0) {
      alert("Pilih minimal 1 kitab untuk dipesan (dengan jumlah lebih dari 0).");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newOrder = addKitabOrder({
        ...formData,
        items: validPesanan
      });
      
      setTrackingId(newOrder.id);
      setIsSuccess(true);
      setIsSubmitting(false);

      // --- LOGIKA NOTIFIKASI WHATSAPP KE 3 NOMOR ---
      const adminNumbers = ['085755863637', '085156905833', '081229971631'];
      const pesananText = validPesanan.map(p => `- ${p.nama} (${p.qty} item)`).join('\n');
      const message = `*Notifikasi Pesanan Kitab Baru*\n\n` +
                      `ID Pesanan: ${newOrder.id}\n` +
                      `Nama Pemesan: ${formData.namaLembaga}\n` +
                      `No HP: ${formData.noHp}\n` +
                      `Alamat: ${formData.alamatLembaga}\n` +
                      `Rencana Pengambilan: ${formData.tanggalPengambilan}\n\n` +
                      `*Daftar Pesanan:*\n${pesananText}\n\n` +
                      `Segera cek dashboard admin untuk memproses pesanan ini.`;

      // Simulasikan pengiriman ke API WA Gateway
      adminNumbers.forEach(num => {
        console.log(`Mengirim notif Pesanan Kitab WA ke ${num}: \n${message}`);
      });

    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="container pembelian-container">
        <div className="glass-panel success-panel">
          <CheckCircle size={64} color="var(--primary-color)" />
          <h2 className="text-gradient">Pesanan Berhasil!</h2>
          <p>Data pesanan kitab Anda telah kami terima dan akan segera diproses.</p>
          <div className="tracking-box">
            <p>ID Pesanan Anda:</p>
            <h3>{trackingId}</h3>
            <p className="text-sm">Gunakan ID ini untuk mengecek status pesanan.</p>
          </div>
          <div className="success-actions">
            <Link to="/layanan/pembelian/status" className="btn btn-primary">Cek Status Sekarang</Link>
            <button className="btn btn-outline" onClick={() => { setIsSuccess(false); setFormData({namaLembaga:'', alamatLembaga:'', noHp:'', tanggalPengambilan:''}); setPesanan(defaultItems); }}>Buat Pesanan Baru</button>
          </div>
        </div>
      </div>
    );
  }

  // Get the most recent 30 orders
  const recentOrders = kitabOrders.slice(0, 30);

  return (
    <div className="container pembelian-container">
      <div className="form-header">
        <h1 className="text-gradient">Pemesanan Kitab Bilqolam</h1>
        <p>Lengkapi form di bawah ini untuk memesan kitab dan perlengkapan lainnya.</p>
      </div>

      <div className="glass-panel form-panel" style={{ marginBottom: '3rem' }}>
        <form onSubmit={handleSubmit}>
          {/* Data Pemesan */}
          <h3 className="section-title">Data Pemesan</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nama Lembaga / Pemesan</label>
              <input type="text" name="namaLembaga" className="form-control" value={formData.namaLembaga} onChange={handleChange} required placeholder="Contoh: TPQ An-Nur" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              <input type="text" name="alamatLembaga" className="form-control" value={formData.alamatLembaga} onChange={handleChange} required placeholder="Alamat pengiriman / domisili" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp / HP</label>
              <input type="tel" name="noHp" className="form-control" value={formData.noHp} onChange={handleChange} required placeholder="08xxxxxxxxxx" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Rencana Tanggal Pengambilan</label>
              <input type="date" name="tanggalPengambilan" className="form-control" value={formData.tanggalPengambilan} onChange={handleChange} required />
            </div>
          </div>

          {/* Daftar Pesanan */}
          <h3 className="section-title mt-6">Daftar Pesanan Kitab</h3>
          


          <div className="cart-container mt-4">
            {pesanan.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={48} color="var(--text-tertiary)" />
                <p>Belum ada kitab yang ditambahkan.</p>
              </div>
            ) : (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Item</th>
                    <th className="text-center">Jumlah (Qty)</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pesanan.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="font-medium">{item.nama}</td>
                      <td>
                        <div className="qty-control">
                          <button type="button" className="qty-btn" onClick={() => handleUpdateQty(item.id, -1)}><Minus size={14}/></button>
                          <span className="qty-value">{item.qty}</span>
                          <button type="button" className="qty-btn" onClick={() => handleUpdateQty(item.id, 1)}><Plus size={14}/></button>
                        </div>
                      </td>
                      <td className="text-center">
                        <button type="button" className="btn-delete" onClick={() => handleUpdateQty(item.id, -item.qty)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="form-actions mt-6" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <Link to="/layanan/pembelian/status" className="link-status">
              Atau cari pesanan dengan ID Pesanan
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Kirim Pesanan'}
            </button>
          </div>
        </form>
      </div>

      {/* Progress Status Section */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <Clock size={24} color="var(--primary-color)" /> Progres Pesanan Terbaru
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="cart-table" style={{ width: '100%', minWidth: '600px' }}>
            <thead>
              <tr>
                <th>Waktu Pesanan</th>
                <th>Nama Pemesan</th>
                <th>Rincian Item</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={order.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(order.tanggalPesanan).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{order.namaLembaga}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Tgl Ambil: {new Date(order.tanggalPengambilan).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td>
                    <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {order.items.slice(0, 2).map((item, i) => (
                        <li key={i}>{item.nama} ({item.qty})</li>
                      ))}
                      {order.items.length > 2 && (
                        <li><em style={{ color: 'var(--primary-color)' }}>+{order.items.length - 2} item lainnya...</em></li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <span className={`badge ${
                      order.status === 'Selesai' ? 'badge-done' : 
                      order.status === 'Siap Diambil' ? 'badge-ready' : 'badge-process'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Belum ada pesanan terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PembelianForm;
