const prisma = require("../prismaClient");

// ==========================================
// LAYANAN
// ==========================================
exports.getLayanan = async (req, res) => {
  try {
    const data = await prisma.layanan.findMany();
    res.json(data.map(item => ({ ...item, materi: JSON.parse(item.materiData) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLayanan = async (req, res) => {
  try {
    const { id, title, icon, desc, sasaran, waMessage, materi } = req.body;
    const newData = await prisma.layanan.create({
      data: {
        id: id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title, icon, desc, sasaran, waMessage,
        materiData: JSON.stringify(materi || [])
      }
    });
    res.status(201).json({ ...newData, materi: JSON.parse(newData.materiData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLayanan = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, icon, desc, sasaran, waMessage, materi } = req.body;
    const updated = await prisma.layanan.update({
      where: { id },
      data: {
        title, icon, desc, sasaran, waMessage,
        materiData: JSON.stringify(materi || [])
      }
    });
    res.json({ ...updated, materi: JSON.parse(updated.materiData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLayanan = async (req, res) => {
  try {
    await prisma.layanan.delete({ where: { id: req.params.id } });
    res.json({ message: "Layanan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// PRODUK
// ==========================================
exports.getProduk = async (req, res) => {
  try {
    const data = await prisma.produk.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduk = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const newData = await prisma.produk.create({
      data: {
        id: `prod-${Date.now()}`,
        nama, deskripsi
      }
    });
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;
    const updated = await prisma.produk.update({
      where: { id },
      data: { nama, deskripsi }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduk = async (req, res) => {
  try {
    await prisma.produk.delete({ where: { id: req.params.id } });
    res.json({ message: "Produk deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
