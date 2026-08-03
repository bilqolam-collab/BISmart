import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Download } from 'lucide-react';
import './Admin.css';

const ManageSyahadah = () => {
  const { syahadahList, updateSyahadahStatus } = useAppContext();

  const handleStatusChange = (id, newStatus) => {
    updateSyahadahStatus(id, newStatus);
  };

  const statusOptions = ['Proses Pengerjaan', 'Selesai Pengerjaan', 'Sudah Diambil'];

  return (
    <div>
      <div className="admin-header-actions">
        <h2 className="admin-page-title">Kelola Pengajuan Syahadah</h2>
      </div>

      <div className="glass-panel table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Tracking</th>
              <th>Tanggal</th>
              <th>Nama Pengaju</th>
              <th>Lembaga</th>
              <th>Tingkat Ujian</th>
              <th>Berkas</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {syahadahList.map(item => (
              <tr key={item.id}>
                <td className="font-mono">{item.id}</td>
                <td>{new Date(item.tanggalPengajuan).toLocaleDateString('id-ID')}</td>
                <td>
                  <div className="font-medium">{item.nama}</div>
                  <div className="text-sm text-secondary">{item.noHp}</div>
                </td>
                <td>
                  <div>{item.namaLembaga}</div>
                  <div className="text-sm text-secondary">{item.alamatLembaga}</div>
                </td>
                <td>
                  <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.875rem' }}>
                    {item.tingkatUjian.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </td>
                <td>
                  <button className="btn-icon" title="Download Berkas">
                    <Download size={18} />
                  </button>
                  <span className="text-sm" style={{display:'block'}}>{item.berkas}</span>
                </td>
                <td>
                  <select 
                    className={`status-select ${
                      item.status === 'Sudah Diambil' ? 'status-done' : 
                      item.status === 'Selesai Pengerjaan' ? 'status-ready' : 'status-process'
                    }`}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            
            {syahadahList.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center" style={{ padding: '3rem' }}>Belum ada data pengajuan Syahadah.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSyahadah;
