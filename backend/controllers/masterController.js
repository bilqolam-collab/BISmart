const prisma = require("../prismaClient");

// ==========================================
// LEMBAGA
// ==========================================
exports.getLembaga = async (req, res) => {
  try {
    const data = await prisma.lembaga.findMany();
    // Parse capaianData JSON string back to object
    const parsedData = data.map(item => ({
      ...item,
      capaian: JSON.parse(item.capaianData)
    }));
    res.json(parsedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLembaga = async (req, res) => {
  try {
    const { nama, alamat, noHp, jumlahSiswa, capaian } = req.body;
    const newData = await prisma.lembaga.create({
      data: {
        nama,
        alamat,
        noHp,
        jumlahSiswa: jumlahSiswa || 0,
        capaianData: JSON.stringify(capaian || {})
      }
    });
    res.status(201).json({ ...newData, capaian: JSON.parse(newData.capaianData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLembaga = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, alamat, noHp, jumlahSiswa, capaian } = req.body;
    const updated = await prisma.lembaga.update({
      where: { id: parseInt(id) },
      data: {
        nama, alamat, noHp, jumlahSiswa,
        capaianData: JSON.stringify(capaian)
      }
    });
    res.json({ ...updated, capaian: JSON.parse(updated.capaianData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLembaga = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting array of ids
    if (ids && ids.length > 0) {
      await prisma.lembaga.deleteMany({
        where: { id: { in: ids.map(id => parseInt(id)) } }
      });
      res.json({ message: "Data deleted successfully" });
    } else {
      res.status(400).json({ error: "No ids provided" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// GURU
// ==========================================
exports.getGuru = async (req, res) => {
  try {
    const data = await prisma.guru.findMany({ include: { lembaga: true } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createGuru = async (req, res) => {
  try {
    const { nama, syahadah, lembagaId } = req.body;
    const newData = await prisma.guru.create({
      data: { nama, syahadah, lembagaId: parseInt(lembagaId) },
      include: { lembaga: true }
    });
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGuru = async (req, res) => {
  try {
    const { ids } = req.body;
    if (ids && ids.length > 0) {
      await prisma.guru.deleteMany({
        where: { id: { in: ids.map(id => parseInt(id)) } }
      });
      res.json({ message: "Data deleted successfully" });
    } else {
      res.status(400).json({ error: "No ids provided" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// SANTRI
// ==========================================
exports.getSantri = async (req, res) => {
  try {
    const data = await prisma.santri.findMany({ include: { lembaga: true } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSantri = async (req, res) => {
  try {
    const { nama, kelas, lembagaId } = req.body;
    const newData = await prisma.santri.create({
      data: { nama, kelas, lembagaId: parseInt(lembagaId) },
      include: { lembaga: true }
    });
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSantri = async (req, res) => {
  try {
    const { ids } = req.body;
    if (ids && ids.length > 0) {
      await prisma.santri.deleteMany({
        where: { id: { in: ids.map(id => parseInt(id)) } }
      });
      res.json({ message: "Data deleted successfully" });
    } else {
      res.status(400).json({ error: "No ids provided" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
