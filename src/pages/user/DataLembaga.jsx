import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MapPin, Building, Users, Search } from 'lucide-react';

const DataLembaga = () => {
  const { dataLembaga } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLembaga = dataLembaga.filter(l => 
    l.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLembaga = dataLembaga.length;
  const totalSiswa = dataLembaga.reduce((acc, curr) => acc + (curr.jumlahSiswa || 0), 0);
  const wilayah = new Set(dataLembaga.map(l => l.alamat.split(',').pop().trim())).size; // Simple unique region extraction

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Direktori Lembaga Bilqolam</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Daftar lembaga pendidikan yang telah resmi menggunakan kurikulum dan metode Bilqolam.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Building size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '3rem', margin: '0', color: 'var(--text-primary)' }}>{totalLembaga}</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Lembaga Bergabung</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Users size={48} color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '3rem', margin: '0', color: 'var(--text-primary)' }}>{totalSiswa}</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Total Santri Terdaftar</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <MapPin size={48} color="var(--secondary-color)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '3rem', margin: '0', color: 'var(--text-primary)' }}>{wilayah || 1}</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Kota/Kabupaten</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Cari nama lembaga atau alamat..."
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
              <th>Nama Lembaga</th>
              <th>Alamat</th>
              <th className="text-center">Jumlah Siswa</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredLembaga.map((lembaga, idx) => (
              <tr key={lembaga.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{lembaga.nama}</td>
                <td>{lembaga.alamat}</td>
                <td className="text-center font-medium">{lembaga.jumlahSiswa}</td>
                <td className="text-center">
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => alert(`Rincian Capaian ${lembaga.nama}:\nPra Jilid: ${lembaga.capaian?.praJilid || 0}\nJilid 1: ${lembaga.capaian?.jilid1 || 0}\nJilid 2: ${lembaga.capaian?.jilid2 || 0}\nJilid 3: ${lembaga.capaian?.jilid3 || 0}\nJilid 4: ${lembaga.capaian?.jilid4 || 0}\nJuz Amma: ${lembaga.capaian?.juzAmma || 0}\n30 Juz: ${lembaga.capaian?.alQuran30Juz || 0}\nPasca: ${lembaga.capaian?.pascaAlQuran || 0}`)}>
                    Lihat Rincian
                  </button>
                </td>
              </tr>
            ))}
            {filteredLembaga.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Data lembaga tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataLembaga;
