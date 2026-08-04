const prisma = require("../prismaClient");

// ==========================================
// PROFIL WEB
// ==========================================
exports.getProfilWeb = async (req, res) => {
  try {
    let data = await prisma.profilWeb.findUnique({ where: { id: 1 } });
    
    // Jika belum ada data, create default
    if (!data) {
      data = await prisma.profilWeb.create({
        data: {
          id: 1,
          sejarah: "Metode Bilqolam dikembangkan sebagai respons atas kebutuhan...",
          visi: "Mencetak generasi Qur'ani yang berakhlak mulia...",
          misiData: JSON.stringify(["Misi 1", "Misi 2"]),
          kontakData: JSON.stringify([{ nama: "Admin", nomor: "08123" }]),
          katalogKitabData: JSON.stringify([
            'Bilqolam jilid 1', 'Bilqolam jilid 2', 'Bilqolam jilid 3', 'Bilqolam jilid 4',
            'Pra bilqolam', 'Buku prestasi', 'Buku pendamping', 'Kitab juz amma + Tajwid',
            'Kitab Ghorib', 'Buku Panduan Bilqolam', 'Bina Ucap', 'Mabadi Tajwid',
            'Ensiklopedia', 'Tajwid', 'Al Quran ukuran sedang', 'Al Quran ukuran besar',
            'Peraga Bilqolam jilid 1', 'Peraga Bilqolam jilid 2', 'Peraga Bilqolam jilid 3',
            'Peraga Bilqolam jilid 4', 'Peraga Pra bilqolam', 'Poster latihan materi jilid'
          ])
        }
      });
    }

    res.json({
      ...data,
      misi: JSON.parse(data.misiData),
      kontakWa: JSON.parse(data.kontakData),
      katalogKitab: JSON.parse(data.katalogKitabData)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfilWeb = async (req, res) => {
  try {
    const { sejarah, visi, misi, fotoUrl, kontakWa, katalogKitab } = req.body;
    
    const updated = await prisma.profilWeb.upsert({
      where: { id: 1 },
      update: {
        sejarah, visi, fotoUrl,
        misiData: JSON.stringify(misi || []),
        kontakData: JSON.stringify(kontakWa || []),
        katalogKitabData: JSON.stringify(katalogKitab || [])
      },
      create: {
        id: 1, sejarah, visi, fotoUrl,
        misiData: JSON.stringify(misi || []),
        kontakData: JSON.stringify(kontakWa || []),
        katalogKitabData: JSON.stringify(katalogKitab || [])
      }
    });

    res.json({
      ...updated,
      misi: JSON.parse(updated.misiData),
      kontakWa: JSON.parse(updated.kontakData),
      katalogKitab: JSON.parse(updated.katalogKitabData)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
