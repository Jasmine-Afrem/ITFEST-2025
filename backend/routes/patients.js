const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get All Patients
router.get("/", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
});

// Add New Patient
router.post("/create", (req, res) => {
  const { name, dob, blood_type, allergies, emergency_contact } = req.body;
  db.query(
    "INSERT INTO patients (name, dob, blood_type, allergies, emergency_contact) VALUES (?, ?, ?, ?, ?)",
    [name, dob, blood_type, allergies, emergency_contact],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error adding patient" });
      res.json({ message: "Patient added successfully", patientId: result.insertId });
    }
  );
});

module.exports = router;
