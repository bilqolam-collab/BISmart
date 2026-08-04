import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Trash2, Edit2, X, Save, Upload, Download } from 'lucide-react';
import Papa from 'papaparse';

const ManageProduk = () => {
  const { produkList, addProduk, updateProduk, deleteProduk, addBulkProduk } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: ''
  });

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleOpenAdd = () => {
    setEditingProduk(null);
    setFormData({ nama: '', deskripsi: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (produk) => {
    setEditingProduk(produk);
    setFormData({ nama: produk.nama, deskripsi: produk.deskripsi });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduk(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduk) {
      updateProduk(editingProduk.id, formData);
    } else {
      addProduk(formData);
    }
    handleCloseModal();
  };

  const downloadTemplate = () => {
    const csvContent = "id,nama,deskripsi\nprod-1,Bilqolam Jilid 1,Contoh deskripsi\nprod-2,Buku Prestasi,Contoh buku prestasi";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_produk.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const items = results.data.map(row => ({
            id: row.id || '',
            nama: row.nama || row.Nama || row.NAMA,
            deskripsi: row.deskripsi || row.Deskripsi || row.DESKRIPSI || ''
          })).filter(item => item.nama); // Must have at least 'nama'

          if (items.length === 0) {
            alert("File CSV kosong atau format tidak sesuai. Pastikan ada kolom 'nama'.");
            setIsUploading(false);
            return;
          }

          await addBulkProduk(items);
          alert(`Berhasil mengupload ${items.length} produk.`);
          setIsUploading(false);
        } catch (err) {
          alert("Gagal memproses file: " + err.message);
          setIsUploading(false);
        }
      },
      error: (error) => {
        alert("Gagal membaca file: " + error.message);
        setIsUploading(false);
      }
    });
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Kelola Produk Bilqolam</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tambah, edit, atau hapus item katalog produk Bilqolam beserta deskripsinya.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={downloadTemplate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Template CSV
          </button>
          
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="btn btn-secondary" 
            onClick={() => fileInputRef.current.click()} 
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Upload size={18} /> {isUploading ? 'Mengunggah...' : 'Upload CSV'}
          </button>

          <button className="btn btn-primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Tambah Produk
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table className="cart-table" style={{ width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>No</th>
              <th>Nama Produk / Kitab</th>
              <th>Deskripsi Produk</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produkList.map((produk, idx) => (
              <tr key={produk.id}>
                <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{idx + 1}</td>
                <td>
                  <strong style={{ color: 'var(--primary-color)' }}>{produk.nama}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ID: {produk.id}</div>
                </td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {produk.deskripsi || <em style={{ color: 'var(--text-tertiary)' }}>Tidak ada deskripsi.</em>}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="qty-btn" onClick={() => handleOpenEdit(produk)} title="Edit Produk" style={{ color: 'var(--primary-color)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => { if(confirm(`Apakah Anda yakin ingin menghapus produk "${produk.nama}"?`)) deleteProduk(produk.id) }} title="Hapus Produk">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {produkList.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  Belum ada produk yang terdaftar. Klik "+ Tambah Produk Baru" untuk memulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{
            width: '90%', maxWidth: '500px', padding: '2rem', borderRadius: '16px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>{editingProduk ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Produk / Kitab</label>
                <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} required placeholder="Contoh: Bilqolam Jilid 1" />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Produk</label>
                <textarea name="deskripsi" className="form-control" value={formData.deskripsi} onChange={handleChange} rows={4} placeholder="Tulis rincian atau keterangan isi produk di sini..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={18} /> Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduk;
