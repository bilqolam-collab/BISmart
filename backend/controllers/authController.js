const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

// Setup admin pertama kali jika belum ada (opsional untuk helper)
exports.initAdmin = async (req, res) => {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      
      const admin = await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
          name: "Administrator"
        }
      });
      return res.json({ message: "Admin initial account created", admin });
    }
    res.json({ message: "Admin account already exists" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Auto-seed default admin account if database is empty (e.g., fresh Supabase setup)
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
          name: "Administrator"
        }
      });
    }

    // Cek user
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Cocokkan password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Return JWT
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.admin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getMe = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, username: true, name: true } // Jangan return password
    });
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
