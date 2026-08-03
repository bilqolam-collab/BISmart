const prisma = require("../prismaClient");

// ==========================================
// SYAHADAH
// ==========================================
exports.getSyahadah = async (req, res) => {
  try {
    const data = await prisma.syahadah.findMany({ orderBy: { tanggalPengajuan: 'desc' } });
    res.json(data.map(item => ({ ...item, tingkatUjian: JSON.parse(item.tingkatUjianData) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSyahadah = async (req, res) => {
  try {
    const { nama, noHp, namaLembaga, alamatLembaga, tingkatUjian, berkas } = req.body;
    const newData = await prisma.syahadah.create({
      data: {
        id: `SYA-${Date.now()}`,
        nama, noHp, namaLembaga, alamatLembaga, berkas: berkas || "",
        tingkatUjianData: JSON.stringify(tingkatUjian || [])
      }
    });
    res.status(201).json({ ...newData, tingkatUjian: JSON.parse(newData.tingkatUjianData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSyahadahStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.syahadah.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// KITAB ORDER (PEMBELIAN)
// ==========================================
exports.getOrders = async (req, res) => {
  try {
    const data = await prisma.kitabOrder.findMany({ orderBy: { tanggalPesanan: 'desc' } });
    res.json(data.map(item => ({ ...item, items: JSON.parse(item.itemsData) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { namaLembaga, alamatLembaga, noHp, tanggalPengambilan, items } = req.body;
    let totalHarga = 0;
    if (items) {
      totalHarga = items.reduce((acc, curr) => acc + (curr.qty * curr.hargaSatuan), 0);
    }
    const newData = await prisma.kitabOrder.create({
      data: {
        id: `ORD-${Date.now()}`,
        namaLembaga, alamatLembaga, noHp, tanggalPengambilan, totalHarga,
        itemsData: JSON.stringify(items || [])
      }
    });
    res.status(201).json({ ...newData, items: JSON.parse(newData.itemsData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.kitabOrder.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderPrices = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    const totalHarga = items.reduce((acc, curr) => acc + (curr.qty * curr.hargaSatuan), 0);
    
    const updated = await prisma.kitabOrder.update({
      where: { id },
      data: { 
        totalHarga,
        itemsData: JSON.stringify(items)
      }
    });
    res.json({ ...updated, items: JSON.parse(updated.itemsData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
