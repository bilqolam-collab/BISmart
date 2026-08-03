import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { iconMap, availableIcons } from '../../utils/icons';
import { Plus, Trash2, Edit2, X, Save, BookOpen } from 'lucide-react';

const ManageLayanan = () => {
  const { layananList, addLayanan, updateLayanan, deleteLayanan } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLayanan, setEditingLayanan] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    icon: 'BookOpen',
    desc: '',
    sasaran: '',
    materiText: '', // Will be split by newline
    waMessage: ''
  });

  const handleOpenAdd = () => {
    setEditingLayanan(null);
    setFormData({
      title: '',
      icon: 'BookOpen',
      desc: '',
      sasaran: '',
      materiText: '',
      waMessage: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (layanan) => {
    setEditingLayanan(layanan);
    setFormData({
      title: layanan.title,
      icon: layanan.icon,
      desc: layanan.desc,
      sasaran: layanan.sasaran,
      materiText: layanan.materi.join('\n'),
      waMessage: layanan.waMessage
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLayanan(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const materi = formData.materiText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const submissionData = {
      title: formData.title,
      icon: formData.icon,
      desc: formData.desc,
      sasaran: formData.sasaran,
      materi: materi,
      waMessage: formData.waMessage
    };

    if (editingLayanan) {
      updateLayanan(editingLayanan.id, submissionData);
    } else {
      addLayanan(submissionData);
    }

    handleCloseModal();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Kelola Layanan Bilqolam</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tambah, edit, atau hapus menu program layanan beserta isi selengkapnya.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Tambah Layanan Baru
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table className="cart-table" style={{ width: '100%', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>Ikon</th>
              <th>Nama Program</th>
              <th>Sasaran</th>
              <th>Deskripsi Singkat</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {layananList.map((layanan) => (
              <tr key={layanan.id}>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    padding: '0.5rem', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    borderRadius: '8px',
                    color: 'var(--primary-color)'
                  }}>
                    {iconMap[layanan.icon] || <BookOpen size={20} />}
                  </div>
                </td>
                <td>
                  <strong style={{ color: 'var(--primary-color)' }}>{layanan.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ID: {layanan.id}</div>
                </td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{layanan.sasaran}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {layanan.desc}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button className="qty-btn" onClick={() => handleOpenEdit(layanan)} title="Edit Layanan" style={{ color: 'var(--primary-color)' }}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-delete" onClick={() => { if(confirm('Apakah Anda yakin ingin menghapus layanan ini?')) deleteLayanan(layanan.id) }} title="Hapus Layanan">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {layananList.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  Belum ada program layanan yang terdaftar. Klik "+ Tambah Layanan Baru" untuk membuat.
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
            width: '90%', maxWidth: '600px', padding: '2rem', borderRadius: '16px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>{editingLayanan ? 'Edit Program Layanan' : 'Tambah Program Layanan Baru'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nama Program / Layanan</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required placeholder="Contoh: Tahsin Juz Amma" />
              </div>

              <div className="form-group">
                <label className="form-label">Pilih Ikon Representatif</label>
                <select name="icon" className="form-control" value={formData.icon} onChange={handleChange}>
                  {availableIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Layanan</label>
                <textarea name="desc" className="form-control" value={formData.desc} onChange={handleChange} required rows={3} placeholder="Jelaskan secara singkat mengenai program ini..." />
              </div>

              <div className="form-group">
                <label className="form-label">Sasaran Peserta</label>
                <input type="text" name="sasaran" className="form-control" value={formData.sasaran} onChange={handleChange} required placeholder="Contoh: Guru Al-Quran & Pengajar TPQ" />
              </div>

              <div className="form-group">
                <label className="form-label">Materi / Layanan (Satu baris per poin)</label>
                <textarea name="materiText" className="form-control" value={formData.materiText} onChange={handleChange} required rows={4} placeholder="Contoh:&#10;Makharijul Huruf&#10;Hukum Tajwid Dasar&#10;Evaluasi Kelulusan" />
              </div>

              <div className="form-group">
                <label className="form-label">Pesan WhatsApp Otomatis (Saat diklik Daftar)</label>
                <textarea name="waMessage" className="form-control" value={formData.waMessage} onChange={handleChange} required rows={2} placeholder="Contoh: Assalamu'alaikum, saya ingin mendaftar program Tahsin..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={18} /> Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLayanan;
