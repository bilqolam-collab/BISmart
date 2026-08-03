import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search } from 'lucide-react';

const DataGuru = () => {
  const { dataGuru } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuru = dataGuru.filter(guru => 
    guru.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guru.lembaga.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Data Guru Bilqolam</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Direktori pengajar metode Bilqolam yang telah terdaftar dan tersertifikasi.
      </p>

      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Cari nama guru atau asal lembaga..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
          <Search size={20} />
        </button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="cart-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Guru</th>
              <th>Asal Lembaga</th>
              <th>Syahadah</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuru.map((guru, idx) => (
              <tr key={guru.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: '500' }}>{guru.nama}</td>
                <td>{guru.lembaga}</td>
                <td>
                  <span className={`badge ${guru.syahadah === 'Syahadah 30 Juz' ? 'badge-done' : guru.syahadah === 'Syahadah Juz Amma' ? 'badge-ready' : 'badge-process'}`}>
                    {guru.syahadah}
                  </span>
                </td>
              </tr>
            ))}
            {filteredGuru.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Data tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataGuru;
