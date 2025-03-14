const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// User Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM staff WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  });
});

// User Registration (Admin Only)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("INSERT INTO staff (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role], 
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error registering user" });
      res.json({ message: "User registered successfully" });
    }
  );
});

module.exports = router;
