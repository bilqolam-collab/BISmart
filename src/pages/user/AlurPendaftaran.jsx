import React from 'react';
import { ClipboardList, BookOpen, GraduationCap, Building } from 'lucide-react';

const AlurPendaftaran = () => {
  const steps = [
    {
      title: 'Pendaftaran Awal',
      desc: 'Lembaga mengisi form pendaftaran secara online atau datang langsung ke pusat Bilqolam di Singosari.',
      icon: <ClipboardList size={32} />
    },
    {
      title: 'Pelatihan Guru',
      desc: 'Utusan guru dari lembaga wajib mengikuti kegiatan standardisasi atau metodologi Bilqolam.',
      icon: <BookOpen size={32} />
    },
    {
      title: 'Sertifikasi / Syahadah',
      desc: 'Guru yang lulus pelatihan akan mendapatkan syahadah (sertifikat mengajar).',
      icon: <GraduationCap size={32} />
    },
    {
      title: 'Pengesahan Lembaga',
      desc: 'Lembaga resmi terdaftar dan berhak menggunakan kurikulum serta memesan kitab metode Bilqolam.',
      icon: <Building size={32} />
    }
  ];

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>Alur Pendaftaran Lembaga</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Panduan langkah demi langkah untuk bergabung bersama Bilqolam.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {steps.map((step, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ 
              backgroundColor: 'rgba(4, 120, 87, 0.1)', 
              color: 'var(--primary-color)',
              width: '80px', height: '80px', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {step.icon}
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  backgroundColor: 'var(--primary-color)', color: 'white', 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem'
                }}>
                  {idx + 1}
                </span>
                {step.title}
              </h3>
              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlurPendaftaran;
