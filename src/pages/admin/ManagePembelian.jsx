import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Edit2, Printer, X, Save, Share2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './Admin.css';
import './Print.css';

const ManagePembelian = () => {
  const { kitabOrders, updateKitabOrderStatus, updateKitabPrices, profilWebData } = useAppContext();
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedItems, setEditedItems] = useState([]);
  
  // Print State
  const [printData, setPrintData] = useState(null);

  const statusOptions = ['Diproses', 'Sudah Ready', 'Sudah Diambil/Dikirim'];

  const handleEditPrices = (order) => {
    setEditingOrder(order);
    setEditedItems(JSON.parse(JSON.stringify(order.items))); // Deep copy
  };

  const handlePriceChange = (id, price) => {
    setEditedItems(editedItems.map(item => 
      item.id === id ? { ...item, hargaSatuan: Number(price) } : item
    ));
  };

  const handleSavePrices = () => {
    updateKitabPrices(editingOrder.id, editedItems);
    setEditingOrder(null);
  };

  const generatePDFOptions = (orderId) => ({
    margin:       [0.5, 0.5, 0.5, 0.5],
    filename:     `Struk_Pesanan_${orderId}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  });

  const handlePrint = (order) => {
    setPrintData(order);
    setTimeout(() => {
      const element = document.querySelector('.print-area');
      html2pdf().set(generatePDFOptions(order.id)).from(element).save().then(() => {
        setPrintData(null);
      });
    }, 500); // give time for the DOM to render images
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleShareWhatsApp = (order) => {
    setPrintData(order);
    setTimeout(async () => {
      const element = document.querySelector('.print-area');
      try {
        const pdfBlob = await html2pdf().set(generatePDFOptions(order.id)).from(element).output('blob');
        const file = new File([pdfBlob], `Struk_Pesanan_${order.id}.pdf`, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Struk Pembelian Bilqolam',
            text: `Berikut adalah struk pesanan kitab untuk ${order.namaLembaga}`,
            files: [file]
          });
        } else {
          // Fallback if browser doesn't support file sharing
          const waText = encodeURIComponent(`*STRUK PESANAN KITAB BILQOLAM*\n\nID: ${order.id}\nNama Pemesan: ${order.namaLembaga}\nTotal Tagihan: ${formatRupiah(order.totalHarga)}\nStatus: ${order.status}\n\nTerima kasih atas pesanan Anda.`);
          const waNumber = order.noHp.replace(/\D/g, '');
          const waUrl = waNumber.startsWith('62') || waNumber.startsWith('+') ? `https://wa.me/${waNumber.replace('+', '')}?text=${waText}` : `https://wa.me/62${waNumber.replace(/^0/, '')}?text=${waText}`;
          window.open(waUrl, '_blank');
        }
      } catch (err) {
        console.error("Share failed", err);
      } finally {
        setPrintData(null);
      }
    }, 500);
  };

  return (
    <div>
      {!printData && (
        <>
          <div className="admin-header-actions">
            <h2 className="admin-page-title">Kelola Pesanan Kitab</h2>
          </div>

          <div className="glass-panel table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Tanggal Pesan</th>
                  <th>Nama Lembaga / Pemesan</th>
                  <th>Total Tagihan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kitabOrders.map(order => (
                  <tr key={order.id}>
                    <td className="font-mono">{order.id}</td>
                    <td>{new Date(order.tanggalPesanan).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div className="font-medium">{order.namaLembaga}</div>
                      <div className="text-sm text-secondary">{order.noHp}</div>
                    </td>
                    <td className="font-medium text-primary">
                      {order.totalHarga > 0 ? formatRupiah(order.totalHarga) : 'Belum Dihitung'}
                    </td>
                    <td>
                      <select 
                        className={`status-select ${
                          order.status === 'Sudah Diambil/Dikirim' ? 'status-done' : 
                          order.status === 'Sudah Ready' ? 'status-ready' : 'status-process'
                        }`}
                        value={order.status}
                        onChange={(e) => updateKitabOrderStatus(order.id, e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" title="Edit Harga" onClick={() => handleEditPrices(order)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon" title="Download PDF" onClick={() => handlePrint(order)}>
                          <Printer size={18} />
                        </button>
                        <button className="btn-icon text-success" title="Kirim WA" onClick={() => handleShareWhatsApp(order)}>
                          <Share2 size={18} color="#25D366" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {kitabOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center" style={{ padding: '3rem' }}>Belum ada data pesanan kitab.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal Edit Harga */}
          {editingOrder && (
            <div className="modal-overlay">
              <div className="modal-content glass-panel">
                <div className="modal-header">
                  <h3>Edit Harga Pesanan - {editingOrder.id}</h3>
                  <button className="btn-icon" onClick={() => setEditingOrder(null)}><X /></button>
                </div>
                <div className="modal-body">
                  <p className="mb-4"><strong>Lembaga:</strong> {editingOrder.namaLembaga}</p>
                  <table className="cart-table w-full">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Harga Satuan (Rp)</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.nama}</td>
                          <td>{item.qty}</td>
                          <td>
                            <input 
                              type="number" 
                              className="form-control py-1 px-2"
                              value={item.hargaSatuan === 0 ? '' : item.hargaSatuan}
                              onChange={(e) => handlePriceChange(item.id, e.target.value)}
                              placeholder="0"
                            />
                          </td>
                          <td>{formatRupiah(item.qty * item.hargaSatuan)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right">
                    <h4>Total: {formatRupiah(editedItems.reduce((acc, curr) => acc + (curr.qty * curr.hargaSatuan), 0))}</h4>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={() => setEditingOrder(null)}>Batal</button>
                  <button className="btn btn-primary" onClick={handleSavePrices}><Save size={18}/> Simpan Harga</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Printable Area */}
      {printData && (
        <div className="print-area">
          <div className="print-header">
            <div className="print-logo">
              <img src="/logo-bilqolam.png" alt="Logo Bilqolam" style={{ maxWidth: '250px', objectFit: 'contain' }} />
            </div>
            <div className="print-company-info" style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>BILQOLAM</h2>
              <p style={{ fontSize: '16px', margin: '0' }}>Pesantren Ilmu Al Quran</p>
              <p style={{ fontSize: '14px', margin: '5px 0' }}>Singosari - Kab. Malang</p>
              {profilWebData?.kontakWa?.length > 0 && (
                <p style={{ fontSize: '14px', margin: '0', fontWeight: 'bold' }}>
                  WA: {profilWebData.kontakWa[0].nomor}
                </p>
              )}
            </div>
          </div>
          
          <div className="print-info-grid">
            <div>
              <p><strong>ID Pesanan:</strong> {printData.id}</p>
              <p><strong>Tanggal:</strong> {new Date(printData.tanggalPesanan).toLocaleDateString('id-ID')}</p>
              <p><strong>Petugas:</strong> Admin Bilqolam</p>
            </div>
            <div>
              <p><strong>Pemesan:</strong> {printData.namaLembaga}</p>
              <p><strong>Alamat:</strong> {printData.alamatLembaga}</p>
              <p><strong>No HP:</strong> {printData.noHp}</p>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Item</th>
                <th>Qty</th>
                <th>Harga Satuan</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {printData.items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.qty}</td>
                  <td>{formatRupiah(item.hargaSatuan)}</td>
                  <td>{formatRupiah(item.qty * item.hargaSatuan)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-right"><strong>Total Tagihan</strong></td>
                <td><strong>{formatRupiah(printData.totalHarga)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div className="print-footer">
            <p>Terima kasih atas pesanan Anda.</p>
            <p>Struk ini adalah bukti pembayaran yang sah.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePembelian;
