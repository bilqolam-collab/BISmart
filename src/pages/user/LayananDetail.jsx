import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { iconMap } from '../../utils/icons';
import { BookOpen, ArrowLeft, Send, Check } from 'lucide-react';
import './LayananDetail.css';

const LayananDetail = () => {
  const { id } = useParams();
  const { layananList } = useAppContext();
  const program = layananList.find(l => l.id === id);

  if (!program) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Layanan tidak ditemukan</h2>
        <p>Layanan yang Anda cari tidak tersedia atau salah link.</p>
        <Link to="/" className="btn btn-primary mt-4">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Send to Ustadz Rizal Affandi (085755863637)
  const handleRegister = () => {
    const waNumber = '6285755863637';
    const encodedText = encodeURIComponent(program.waMessage);
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} /> Kembali
      </Link>

      <div className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {iconMap[program.icon] || <BookOpen size={48} color="var(--primary-color)" />}
          </div>
          <div>
            <h1 className="text-gradient" style={{ margin: 0, fontSize: '2rem' }}>{program.title}</h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Layanan Pendidikan Bilqolam
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Deskripsi Program</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.05rem' }}>
            {program.desc}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Sasaran Peserta</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>
              {program.sasaran}
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Materi / Layanan</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {program.materi.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <Check size={16} color="var(--primary-color)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Tertarik dengan layanan ini? Silakan ajukan pendaftaran atau konsultasi langsung via WhatsApp.
          </p>
          <button className="btn btn-primary" onClick={handleRegister} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontSize: '1.05rem' }}>
            <Send size={18} /> Hubungi / Daftar via WA
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayananDetail;
