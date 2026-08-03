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
          kontakData: JSON.stringify([{ nama: "Admin", nomor: "08123" }])
        }
      });
    }

    res.json({
      ...data,
      misi: JSON.parse(data.misiData),
      kontakWa: JSON.parse(data.kontakData)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfilWeb = async (req, res) => {
  try {
    const { sejarah, visi, misi, fotoUrl, kontakWa } = req.body;
    
    const updated = await prisma.profilWeb.upsert({
      where: { id: 1 },
      update: {
        sejarah, visi, fotoUrl,
        misiData: JSON.stringify(misi || []),
        kontakData: JSON.stringify(kontakWa || [])
      },
      create: {
        id: 1, sejarah, visi, fotoUrl,
        misiData: JSON.stringify(misi || []),
        kontakData: JSON.stringify(kontakWa || [])
      }
    });

    res.json({
      ...updated,
      misi: JSON.parse(updated.misiData),
      kontakWa: JSON.parse(updated.kontakData)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
