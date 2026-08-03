import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Plus, Trash2, Edit2, Download, Upload, X, Save } from 'lucide-react';
import Papa from 'papaparse';

const ManageMasterData = () => {
  const { 
    dataLembaga, addLembaga, updateLembaga, deleteLembaga, setMassLembaga,
    dataGuru, addGuru, updateGuru, deleteGuru, setMassGuru,
    dataSantri, addSantri, updateSantri, deleteSantri, setMassSantri
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('lembaga'); // lembaga, guru, santri

  // Shared State for Mass Delete
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals State
  const [editLembagaModal, setEditLembagaModal] = useState(null);
  const [editGuruModal, setEditGuruModal] = useState(null);
  const [editSantriModal, setEditSantriModal] = useState(null);

  const fileInputRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (e, dataArray) => {
    if (e.target.checked) {
      setSelectedIds(dataArray.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Yakin ingin menghapus ${selectedIds.length} data terpilih?`)) return;

    if (activeTab === 'lembaga') deleteLembaga(selectedIds);
    else if (activeTab === 'guru') deleteGuru(selectedIds);
    else if (activeTab === 'santri') deleteSantri(selectedIds);
    
    setSelectedIds([]);
  };

  // CSV Templates Generation
  const downloadTemplate = () => {
    let csvContent = "";
    let filename = "";

    if (activeTab === 'lembaga') {
      filename = "Template_Data_Lembaga.csv";
      csvContent = "Nama Lembaga,Alamat,No HP,Jumlah Siswa,Pra Jilid,Jilid 1,Jilid 2,Jilid 3,Jilid 4,Juz Amma,Al Quran 30 Juz,Pasca Al Quran\nContoh TPQ,Jl. Contoh No 1,08123,100,10,10,10,10,10,10,10,10";
    } else if (activeTab === 'guru') {
      filename = "Template_Data_Guru.csv";
      csvContent = "Nama Guru,Asal Lembaga,Syahadah\nUst Fulan,TPQ Contoh,Syahadah 30 Juz";
    } else if (activeTab === 'santri') {
      filename = "Template_Data_Santri.csv";
      csvContent = "Nama Santri,Asal Lembaga,Kelas\nBudi,TPQ Contoh,Jilid 4";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        const data = results.data;
        if (activeTab === 'lembaga') {
          const parsedLembaga = data.map(row => ({
            id: Date.now() + Math.random(),
            nama: row['Nama Lembaga'],
            alamat: row['Alamat'],
            noHp: row['No HP'],
            jumlahSiswa: Number(row['Jumlah Siswa']) || 0,
            capaian: {
              praJilid: Number(row['Pra Jilid']) || 0,
              jilid1: Number(row['Jilid 1']) || 0,
              jilid2: Number(row['Jilid 2']) || 0,
              jilid3: Number(row['Jilid 3']) || 0,
              jilid4: Number(row['Jilid 4']) || 0,
              juzAmma: Number(row['Juz Amma']) || 0,
              alQuran30Juz: Number(row['Al Quran 30 Juz']) || 0,
              pascaAlQuran: Number(row['Pasca Al Quran']) || 0,
            }
          }));
          setMassLembaga(parsedLembaga);
        } else if (activeTab === 'guru') {
          const parsedGuru = data.map(row => ({
            id: Date.now() + Math.random(),
            nama: row['Nama Guru'],
            lembaga: row['Asal Lembaga'],
            syahadah: row['Syahadah'] || 'Belum bersyahadah'
          }));
          setMassGuru(parsedGuru);
        } else if (activeTab === 'santri') {
          const parsedSantri = data.map(row => ({
            id: Date.now() + Math.random(),
            nama: row['Nama Santri'],
            lembaga: row['Asal Lembaga'],
            kelas: row['Kelas']
          }));
          setMassSantri(parsedSantri);
        }
        alert(`${data.length} baris data berhasil diimpor!`);
        e.target.value = null; // Reset input
      }
    });
  };

  // --- Renders ---
  return (
    <div>
      <div className="admin-header-actions">
        <h2 className="admin-page-title">Kelola Master Data</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={downloadTemplate}>
            <Download size={18} /> Download Template Excel
          </button>
          <button className="btn btn-primary" onClick={() => fileInputRef.current.click()}>
            <Upload size={18} /> Upload Data Masal
          </button>
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${activeTab === 'lembaga' ? 'btn-primary' : 'btn-outline'}`} onClick={() => handleTabChange('lembaga')}>Data Lembaga</button>
        <button className={`btn ${activeTab === 'guru' ? 'btn-primary' : 'btn-outline'}`} onClick={() => handleTabChange('guru')}>Data Guru</button>
        <button className={`btn ${activeTab === 'santri' ? 'btn-primary' : 'btn-outline'}`} onClick={() => handleTabChange('santri')}>Data Santri</button>
      </div>

      {/* Action Bar for Mass Delete */}
      {selectedIds.length > 0 && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fef2f2', borderColor: '#ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#b91c1c', fontWeight: '500' }}>{selectedIds.length} baris dipilih</span>
          <button className="btn btn-primary" style={{ backgroundColor: '#ef4444' }} onClick={handleDeleteSelected}>
            <Trash2 size={18} /> Hapus Terpilih
          </button>
        </div>
      )}

      {/* --- TAB LEMBAGA --- */}
      {activeTab === 'lembaga' && (
        <div className="glass-panel table-container">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="btn btn-outline" onClick={() => setEditLembagaModal({ capaian: {} })}><Plus size={18}/> Tambah Lembaga</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" onChange={(e) => toggleSelectAll(e, dataLembaga)} checked={selectedIds.length === dataLembaga.length && dataLembaga.length > 0} />
                </th>
                <th>Nama Lembaga</th>
                <th>Alamat</th>
                <th>No HP</th>
                <th>Jml Siswa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataLembaga.map(lembaga => (
                <tr key={lembaga.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(lembaga.id)} onChange={() => toggleSelect(lembaga.id)} /></td>
                  <td>{lembaga.nama}</td>
                  <td>{lembaga.alamat}</td>
                  <td>{lembaga.noHp}</td>
                  <td>{lembaga.jumlahSiswa}</td>
                  <td>
                    <button className="btn-icon" onClick={() => setEditLembagaModal({...lembaga})}><Edit2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB GURU --- */}
      {activeTab === 'guru' && (
        <div className="glass-panel table-container">
           <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="btn btn-outline" onClick={() => setEditGuruModal({ syahadah: 'Belum bersyahadah' })}><Plus size={18}/> Tambah Guru</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" onChange={(e) => toggleSelectAll(e, dataGuru)} checked={selectedIds.length === dataGuru.length && dataGuru.length > 0} />
                </th>
                <th>Nama Guru</th>
                <th>Asal Lembaga</th>
                <th>Syahadah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataGuru.map(guru => (
                <tr key={guru.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(guru.id)} onChange={() => toggleSelect(guru.id)} /></td>
                  <td>{guru.nama}</td>
                  <td>{guru.lembaga}</td>
                  <td><span className="badge badge-ready">{guru.syahadah}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => setEditGuruModal({...guru})}><Edit2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB SANTRI --- */}
      {activeTab === 'santri' && (
        <div className="glass-panel table-container">
           <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
             <button className="btn btn-outline" onClick={() => setEditSantriModal({})}><Plus size={18}/> Tambah Santri</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" onChange={(e) => toggleSelectAll(e, dataSantri)} checked={selectedIds.length === dataSantri.length && dataSantri.length > 0} />
                </th>
                <th>Nama Santri</th>
                <th>Asal Lembaga</th>
                <th>Kelas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataSantri.map(santri => (
                <tr key={santri.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(santri.id)} onChange={() => toggleSelect(santri.id)} /></td>
                  <td>{santri.nama}</td>
                  <td>{santri.lembaga}</td>
                  <td><span className="badge badge-done">{santri.kelas}</span></td>
                  <td>
                    <button className="btn-icon" onClick={() => setEditSantriModal({...santri})}><Edit2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALS */}
      {editLembagaModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>{editLembagaModal.id ? 'Edit Lembaga' : 'Tambah Lembaga'}</h3>
              <button className="btn-icon" onClick={() => setEditLembagaModal(null)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nama Lembaga</label>
                  <input type="text" className="form-control" value={editLembagaModal.nama || ''} onChange={e => setEditLembagaModal({...editLembagaModal, nama: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Alamat</label>
                  <input type="text" className="form-control" value={editLembagaModal.alamat || ''} onChange={e => setEditLembagaModal({...editLembagaModal, alamat: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">No HP</label>
                  <input type="text" className="form-control" value={editLembagaModal.noHp || ''} onChange={e => setEditLembagaModal({...editLembagaModal, noHp: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah Siswa</label>
                  <input type="number" className="form-control" value={editLembagaModal.jumlahSiswa || 0} onChange={e => setEditLembagaModal({...editLembagaModal, jumlahSiswa: Number(e.target.value)})} />
                </div>
              </div>
              <h4 className="mt-4 mb-4">Rincian Capaian (Opsional)</h4>
              <div className="form-grid">
                {['praJilid', 'jilid1', 'jilid2', 'jilid3', 'jilid4', 'juzAmma', 'alQuran30Juz', 'pascaAlQuran'].map(key => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <input type="number" className="form-control" value={editLembagaModal.capaian?.[key] || 0} onChange={e => setEditLembagaModal({...editLembagaModal, capaian: {...(editLembagaModal.capaian || {}), [key]: Number(e.target.value)}})} />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditLembagaModal(null)}>Batal</button>
              <button className="btn btn-primary" onClick={() => {
                editLembagaModal.id ? updateLembaga(editLembagaModal.id, editLembagaModal) : addLembaga(editLembagaModal);
                setEditLembagaModal(null);
              }}><Save size={18}/> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {editGuruModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{editGuruModal.id ? 'Edit Guru' : 'Tambah Guru'}</h3>
              <button className="btn-icon" onClick={() => setEditGuruModal(null)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Guru</label>
                <input type="text" className="form-control" value={editGuruModal.nama || ''} onChange={e => setEditGuruModal({...editGuruModal, nama: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Asal Lembaga</label>
                <input type="text" className="form-control" value={editGuruModal.lembaga || ''} onChange={e => setEditGuruModal({...editGuruModal, lembaga: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Syahadah</label>
                <select className="form-control" value={editGuruModal.syahadah || 'Belum bersyahadah'} onChange={e => setEditGuruModal({...editGuruModal, syahadah: e.target.value})}>
                  <option value="Belum bersyahadah">Belum bersyahadah</option>
                  <option value="Syahadah Juz Amma">Syahadah Juz Amma</option>
                  <option value="Syahadah 30 Juz">Syahadah 30 Juz</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditGuruModal(null)}>Batal</button>
              <button className="btn btn-primary" onClick={() => {
                editGuruModal.id ? updateGuru(editGuruModal.id, editGuruModal) : addGuru(editGuruModal);
                setEditGuruModal(null);
              }}><Save size={18}/> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {editSantriModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{editSantriModal.id ? 'Edit Santri' : 'Tambah Santri'}</h3>
              <button className="btn-icon" onClick={() => setEditSantriModal(null)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Santri</label>
                <input type="text" className="form-control" value={editSantriModal.nama || ''} onChange={e => setEditSantriModal({...editSantriModal, nama: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Asal Lembaga</label>
                <input type="text" className="form-control" value={editSantriModal.lembaga || ''} onChange={e => setEditSantriModal({...editSantriModal, lembaga: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Kelas</label>
                <input type="text" className="form-control" value={editSantriModal.kelas || ''} onChange={e => setEditSantriModal({...editSantriModal, kelas: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditSantriModal(null)}>Batal</button>
              <button className="btn btn-primary" onClick={() => {
                editSantriModal.id ? updateSantri(editSantriModal.id, editSantriModal) : addSantri(editSantriModal);
                setEditSantriModal(null);
              }}><Save size={18}/> Simpan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageMasterData;
