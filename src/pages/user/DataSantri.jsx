import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search } from 'lucide-react';

const DataSantri = () => {
  const { dataSantri } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSantri = dataSantri.filter(santri => 
    santri.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    santri.lembaga.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Data Santri Bilqolam</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Daftar santri berprestasi dan lulusan tahsin/tahfidz metode Bilqolam.
      </p>

      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Cari nama santri atau asal lembaga..."
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
              <th>Nama Santri</th>
              <th>Asal Lembaga</th>
              <th>Kelas</th>
            </tr>
          </thead>
          <tbody>
            {filteredSantri.map((santri, idx) => (
              <tr key={santri.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: '500' }}>{santri.nama}</td>
                <td>{santri.lembaga}</td>
                <td>
                  <span className="badge badge-ready">
                    {santri.kelas}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSantri.length === 0 && (
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

export default DataSantri;
