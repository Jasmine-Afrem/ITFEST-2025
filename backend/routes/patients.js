const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get All Patients
router.get("/", (req, res) => {
  db.query("SELECT * FROM pacienti", (err, results) => {
    if (err) return res.status(500).json({ error: "Server error", details: err });

    // Convertim data_nasterii într-un format mai ușor de citit
    const formattedResults = results.map((pacient) => ({
      ...pacient,
      data_nasterii: new Date(pacient.data_nasterii).toISOString().split('T')[0] // Format YYYY-MM-DD
    }));

    res.json(formattedResults);
  });
});

// Get full patient data by ID
router.get("/databyid/:id", (req, res) => {
  const patientId = req.params.id;

  // Query pentru informațiile pacientului
  const patientQuery = `
    SELECT * FROM pacienti WHERE id = ?
  `;

  // Query pentru fișele medicale
  const medicalRecordsQuery = `
    SELECT * FROM fise_medicale WHERE id_pacient = ?
  `;

  // Query pentru analizele medicale
  const medicalTestsQuery = `
    SELECT am.* 
    FROM analize_medicale am
    JOIN fise_medicale fm ON am.id_fisa_medicala = fm.id
    WHERE fm.id_pacient = ?
  `;

  // Query pentru contactele de urgență
  const emergencyContactsQuery = `
    SELECT * FROM contacte_urgenta WHERE id_pacient = ?
  `;

  db.query(patientQuery, [patientId], (err, patientResults) => {
    if (err) return res.status(500).json({ error: "Server error", details: err });
    if (patientResults.length === 0) return res.status(404).json({ error: "Pacientul nu a fost găsit" });

    db.query(medicalRecordsQuery, [patientId], (err, recordsResults) => {
      if (err) return res.status(500).json({ error: "Server error", details: err });

      db.query(medicalTestsQuery, [patientId], (err, testsResults) => {
        if (err) return res.status(500).json({ error: "Server error", details: err });

        db.query(emergencyContactsQuery, [patientId], (err, contactsResults) => {
          if (err) return res.status(500).json({ error: "Server error", details: err });

          res.json({
            pacient: patientResults[0],
            fise_medicale: recordsResults,
            analize_medicale: testsResults,
            contacte_urgenta: contactsResults
          });
        });
      });
    });
  });
});

// Search Patients Not in a Room
router.get("/not-in-room", (req, res) => {
  const query = `
    SELECT p.* 
    FROM pacienti p
    LEFT JOIN pacienti_saloane ps ON p.id = ps.id_pacient AND ps.data_externare IS NULL
    WHERE ps.id_pacient IS NULL
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Server error", details: err });
    res.json(results);
  });
});

// Search Patients by Name
router.get("/search", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Name query parameter is required" });
  }

  const query = "SELECT * FROM pacienti WHERE nume LIKE ? OR prenume LIKE ?";
  const values = [`%${name}%`, `%${name}%`];

  db.query(query, values, (err, results) => {
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
