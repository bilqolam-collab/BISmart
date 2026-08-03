import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Download, Upload, CheckCircle, Clock } from 'lucide-react';
import './Syahadah.css';

const tingkatUjianOptions = [
  'Juz Amma Santri',
  '30 Juz Santri',
  'Tahfidz Santri',
  'Juz Amma Guru',
  '30 Juz Guru'
];

const SyahadahForm = () => {
  const navigate = useNavigate();
  const { addSyahadah, syahadahList } = useAppContext();
  const [formData, setFormData] = useState({
    nama: '',
    noHp: '',
    namaLembaga: '',
    alamatLembaga: '',
    tingkatUjian: [],
    berkas: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, tingkatUjian: [...prev.tingkatUjian, value] }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        tingkatUjian: prev.tingkatUjian.filter(item => item !== value) 
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, berkas: e.target.files[0] ? e.target.files[0].name : null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.tingkatUjian.length === 0) {
      alert("Pilih minimal 1 tingkat ujian.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API Call & WA Notification
    setTimeout(() => {
      const newSyahadah = addSyahadah({
        nama: formData.nama,
        noHp: formData.noHp,
        namaLembaga: formData.namaLembaga,
        alamatLembaga: formData.alamatLembaga,
        tingkatUjian: formData.tingkatUjian,
        berkas: formData.berkas || 'Tidak ada berkas'
      });
      
      setTrackingId(newSyahadah.id);
      setIsSuccess(true);
      setIsSubmitting(false);

      // --- LOGIKA NOTIFIKASI WHATSAPP KE 3 NOMOR ---
      const adminNumbers = ['085755863637', '085156905833', '081229971631'];
      const message = `*Notifikasi Pengajuan Syahadah Baru*\n\n` +
                      `ID: ${newSyahadah.id}\n` +
                      `Nama: ${formData.nama}\n` +
                      `No HP: ${formData.noHp}\n` +
                      `Lembaga: ${formData.namaLembaga}\n` +
                      `Alamat: ${formData.alamatLembaga}\n` +
                      `Tingkat Ujian: ${formData.tingkatUjian.join(', ')}\n\n` +
                      `Segera cek dashboard admin untuk memproses pengajuan ini.`;

      // Jika kita memiliki WhatsApp Gateway API (seperti Fonnte, Watzap, dll):
      adminNumbers.forEach(num => {
        console.log(`Mengirim WA ke ${num}: \n${message}`);
        // Contoh implementasi Fetch API (Disesuaikan dengan provider API nantinya)
        /*
        fetch('https://api.wa-gateway.com/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_API_KEY' },
          body: JSON.stringify({ phone: num, message: message })
        }).catch(err => console.error(err));
        */
      });

      // Sebagai alternatif Frontend sementara (Buka tab WA untuk admin pertama)
      // window.open(`https://wa.me/62${adminNumbers[0].substring(1)}?text=${encodeURIComponent(message)}`, '_blank');

    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="container syahadah-container">
        <div className="glass-panel success-panel">
          <CheckCircle size={64} color="var(--primary-color)" />
          <h2 className="text-gradient">Pengajuan Berhasil!</h2>
          <p>Data pengajuan Syahadah Anda telah kami terima.</p>
          <div className="tracking-box">
            <p>ID Tracking Anda:</p>
            <h3>{trackingId}</h3>
            <p className="text-sm">Simpan ID ini untuk mengecek status pengerjaan.</p>
          </div>
          <div className="success-actions">
            <Link to="/layanan/syahadah/status" className="btn btn-primary">Cek Status Sekarang</Link>
            <button className="btn btn-outline" onClick={() => { setIsSuccess(false); setFormData({...formData, nama:'', noHp:'', tingkatUjian:[], berkas:null}); }}>Buat Pengajuan Baru</button>
          </div>
        </div>
      </div>
    );
  }

  const downloadTemplate = (type) => {
    let headers = [];
    let filename = "";
    if (type === 'santri') {
      headers = ["Nama Peserta", "Nama Ayah", "TTL", "Alamat", "Tingkat", "Nama Lembaga", "Kepala Lembaga"];
      filename = "Template_Syahadah_Santri.csv";
    } else if (type === 'guru') {
      headers = ["Nama", "Nama Ayah", "Nama (Arab) / Opsional", "Nama Ayah (Arab) / Opsional", "TTL", "Alamat (Kec-Kab)", "Tingkat Ujian"];
      filename = "Template_Syahadah_Guru.csv";
    }
    
    const csvContent = "\uFEFF" + headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get the most recent 20 submissions
  const recentSyahadah = syahadahList.slice(0, 20);

  return (
    <div className="container syahadah-container">
      <div className="form-header">
        <h1 className="text-gradient">Pengajuan Syahadah</h1>
        <p>Isi formulir di bawah ini untuk mengajukan syahadah. Pastikan data yang dimasukkan benar.</p>
        
        <div className="templates-grid">
          <div className="download-template-card">
            <div className="template-info">
              <Download size={24} className="text-primary" />
              <div>
                <h4>Template Syahadah Santri</h4>
                <p>Format: Nama peserta, nama ayah, TTL, alamat, tingkat, nama lembaga, kepala lembaga.</p>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => downloadTemplate('santri')}>
              Download Template
            </button>
          </div>

          <div className="download-template-card">
            <div className="template-info">
              <Download size={24} className="text-primary" />
              <div>
                <h4>Template Syahadah Guru</h4>
                <p>Format: Nama, nama ayah, nama & ayah (arab) / opsional, TTL, Alamat (Kec-Kab), tingkat ujian.</p>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => downloadTemplate('guru')}>
              Download Template
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel form-panel" style={{ marginBottom: '3rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nama yang Mengajukan</label>
              <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} required placeholder="Masukkan nama lengkap" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nomor WhatsApp / HP</label>
              <input type="tel" name="noHp" className="form-control" value={formData.noHp} onChange={handleChange} required placeholder="08xxxxxxxxxx" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Nama Lembaga</label>
              <input type="text" name="namaLembaga" className="form-control" value={formData.namaLembaga} onChange={handleChange} required placeholder="Contoh: TPQ Al-Ikhlas" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Alamat Lembaga (Kecamatan - Kabupaten)</label>
              <input type="text" name="alamatLembaga" className="form-control" value={formData.alamatLembaga} onChange={handleChange} required placeholder="Contoh: Singosari - Malang" />
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Tingkat Ujian (Bisa pilih lebih dari 1)</label>
            <div className="checkbox-grid">
              {tingkatUjianOptions.map((option, idx) => {
                const isChecked = formData.tingkatUjian.includes(option);
                return (
                  <label key={idx} className={`checkbox-label ${isChecked ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      value={option}
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span className="custom-checkbox"></span>
                    {option}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Upload Berkas Syahadah (Opsional)</label>
            <div className="file-upload-wrapper">
              <input type="file" id="berkas" className="file-input" onChange={handleFileChange} />
              <label htmlFor="berkas" className="file-upload-box">
                <Upload size={32} />
                <span>{formData.berkas ? formData.berkas : 'Klik atau seret file ke sini'}</span>
              </label>
            </div>
          </div>

          <div className="form-actions mt-6">
            <Link to="/layanan/syahadah/status" className="link-status">
              Atau cari pengajuan spesifik dengan ID Tracking
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Kirim Pengajuan'}
            </button>
          </div>
        </form>
      </div>

      {/* Progress Status Section */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <Clock size={24} color="var(--primary-color)" /> Progres Pengajuan Terbaru
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="cart-table" style={{ width: '100%', minWidth: '600px' }}>
            <thead>
              <tr>
                <th>Waktu Pengajuan</th>
                <th>Nama Lembaga / Pemohon</th>
                <th>Tingkat Ujian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSyahadah.map((item, idx) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(item.tanggalPengajuan).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{item.namaLembaga}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.nama}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {item.tingkatUjian.map((tingkat, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.75rem', padding: '0.15rem 0.5rem', 
                          background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-color)',
                          borderRadius: '4px' 
                        }}>
                          {tingkat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      item.status === 'Selesai / Siap Diambil' ? 'badge-done' : 
                      item.status === 'Sedang Dicetak' ? 'badge-ready' : 'badge-process'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentSyahadah.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Belum ada pengajuan.
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

export default SyahadahForm;
