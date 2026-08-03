import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Save, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import './Admin.css';

const ManageProfil = () => {
  const { profilWebData, updateProfilWebData } = useAppContext();
  
  const [formData, setFormData] = useState({
    sejarah: '',
    visi: '',
    misi: '',
    fotoUrl: '',
    kontakWa: []
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData({
      sejarah: profilWebData.sejarah,
      visi: profilWebData.visi,
      misi: profilWebData.misi.join('\n'), // join with newline for textarea
      fotoUrl: profilWebData.fotoUrl,
      kontakWa: [...profilWebData.kontakWa]
    });
  }, [profilWebData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKontakChange = (index, field, value) => {
    const newKontak = [...formData.kontakWa];
    newKontak[index][field] = value;
    setFormData(prev => ({ ...prev, kontakWa: newKontak }));
  };

  const addKontak = () => {
    setFormData(prev => ({
      ...prev,
      kontakWa: [...prev.kontakWa, { nama: '', nomor: '' }]
    }));
  };

  const removeKontak = (index) => {
    const newKontak = [...formData.kontakWa];
    newKontak.splice(index, 1);
    setFormData(prev => ({ ...prev, kontakWa: newKontak }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, fotoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      misi: formData.misi.split('\n').filter(m => m.trim() !== '') // split by newline back to array
    };
    updateProfilWebData(dataToSave);
    alert('Data Profil berhasil disimpan!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="admin-page-title" style={{ marginBottom: 0 }}>Pengaturan Profil Tampilan Pengguna</h2>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Foto / Gambar Profil Lembaga</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '150px', height: '150px', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              overflow: 'hidden', border: '1px dashed var(--border-color)'
            }}>
              {formData.fotoUrl ? (
                <img src={formData.fotoUrl} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={40} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
            <div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
              />
              <button 
                className="btn-secondary" 
                onClick={() => fileInputRef.current.click()}
                style={{ marginBottom: '0.5rem' }}
              >
                Pilih Foto
              </button>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Format yang didukung: JPG, PNG. Maksimal 2MB.</p>
              {formData.fotoUrl && (
                <button 
                  className="btn-secondary" 
                  style={{ backgroundColor: 'transparent', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', marginTop: '0.5rem' }}
                  onClick={() => setFormData(prev => ({...prev, fotoUrl: ''}))}
                >
                  Hapus Foto
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sejarah & Latar Belakang</label>
          <textarea 
            name="sejarah" 
            value={formData.sejarah} 
            onChange={handleChange} 
            className="form-input" 
            rows="5"
            style={{ width: '100%', resize: 'vertical' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Visi</label>
          <textarea 
            name="visi" 
            value={formData.visi} 
            onChange={handleChange} 
            className="form-input" 
            rows="3"
            style={{ width: '100%', resize: 'vertical' }}
          ></textarea>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Misi (Pisahkan dengan baris baru / Enter)</label>
          <textarea 
            name="misi" 
            value={formData.misi} 
            onChange={handleChange} 
            className="form-input" 
            rows="5"
            style={{ width: '100%', resize: 'vertical' }}
            placeholder="Contoh:&#10;Misi 1...&#10;Misi 2..."
          ></textarea>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Kontak WhatsApp</label>
            <button onClick={addKontak} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              <Plus size={16} /> Tambah Kontak
            </button>
          </div>
          
          {formData.kontakWa.map((kontak, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Nama / Keterangan</label>
                <input 
                  type="text" 
                  value={kontak.nama} 
                  onChange={(e) => handleKontakChange(index, 'nama', e.target.value)} 
                  className="form-input" 
                  placeholder="Misal: Ust. Khoirul Anwar"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Nomor WhatsApp</label>
                <input 
                  type="text" 
                  value={kontak.nomor} 
                  onChange={(e) => handleKontakChange(index, 'nomor', e.target.value)} 
                  className="form-input" 
                  placeholder="Misal: 085850380313"
                />
              </div>
              <button 
                onClick={() => removeKontak(index)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', marginTop: '1.5rem', padding: '0.5rem' }}
                title="Hapus"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {formData.kontakWa.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Belum ada kontak WhatsApp. Klik tambah kontak.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ManageProfil;
