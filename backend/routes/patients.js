const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get All Patients
router.get("/", (req, res) => {
  db.query("SELECT * FROM pacienti", (err, results) => {
    if (err) return res.status(500).json({ error: "Server error", details: err });
    res.json(results);
  });
});

// Add New Patient
router.post("/create", (req, res) => {
  const {
    nume,
    prenume,
    data_nasterii,
    gen,
    telefon,
    email,
    adresa,
    cnp,
    serie_numar_buletin,
    cetatenie,
    loc_nastere,
    contact_urgent_nume,
    contact_urgent_telefon,
  } = req.body;

  db.query(
    "INSERT INTO pacienti (nume, prenume, data_nasterii, gen, telefon, email, adresa, cnp, serie_numar_buletin, cetatenie, loc_nastere, contact_urgent_nume, contact_urgent_telefon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nume,
      prenume,
      data_nasterii,
      gen,
      telefon,
      email,
      adresa,
      cnp,
      serie_numar_buletin,
      cetatenie,
      loc_nastere,
      contact_urgent_nume,
      contact_urgent_telefon,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error adding patient", details: err });
      res.json({ message: "Patient added successfully", patientId: result.insertId });
    }
  );
});

// Delete a Patient by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM pacienti WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error deleting patient", details: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  });
});

module.exports = router;
