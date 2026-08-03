import React from 'react';
import { BookOpen, Target, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Profil = () => {
  const { profilWebData } = useAppContext();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Profil Lembaga</h1>
      
      {profilWebData.fotoUrl && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img 
            src={profilWebData.fotoUrl} 
            alt="Profil Lembaga" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover', 
              borderRadius: '50%',
              boxShadow: '0 8px 30px rgba(4, 120, 87, 0.15)',
              border: '4px solid var(--primary-color)'
            }} 
          />
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen /> Sejarah & Latar Belakang
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {profilWebData.sejarah}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target /> Visi & Misi
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <strong>Visi:</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{profilWebData.visi}</p>
          <br />
          <strong>Misi:</strong>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            {profilWebData.misi.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle color="#25D366" /> Kontak WhatsApp
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Klik tombol di bawah untuk langsung terhubung dengan pengurus melalui WhatsApp:
        </p>

        <div className="wa-contact-grid">
          {profilWebData.kontakWa.map((kontak, idx) => (
            <a 
              key={idx} 
              href={`https://wa.me/${kontak.nomor.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="wa-contact-card"
            >
              <div className="wa-contact-card-left">
                <div className="wa-icon-badge">
                  <Phone size={22} />
                </div>
                <div>
                  <div className="wa-contact-name">{kontak.nama}</div>
                  <div className="wa-contact-number">{kontak.nomor}</div>
                </div>
              </div>
              <div className="wa-action-badge">
                Chat <ArrowRight size={14} />
              </div>
            </a>
          ))}
          {profilWebData.kontakWa.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>Belum ada kontak yang ditambahkan.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profil;
