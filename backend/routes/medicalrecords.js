const express = require("express");
const db = require("../config/db");
const router = express.Router();

// 1️⃣ Creare fișă medicală pentru un pacient
router.post("/add", (req, res) => {
  const { id_pacient, id_medic, diagnostic, tratament, reteta } = req.body;

  db.query(
    "INSERT INTO fise_medicale (id_pacient, id_medic, diagnostic, tratament, reteta) VALUES (?, ?, ?, ?, ?)",
    [id_pacient, id_medic, diagnostic, tratament, reteta],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Eroare la crearea fișei medicale" + err});

      res.json({ message: "Fișă medicală adăugată cu succes", id: result.insertId });
    }
  );
});

// 2️⃣ Obținerea tuturor fișelor medicale ale unui pacient
router.get("/patient/:id_pacient", (req, res) => {
  const { id_pacient } = req.params;

  db.query(
    "SELECT * FROM fise_medicale WHERE id_pacient = ? ORDER BY data_creare DESC",
    [id_pacient],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Eroare la preluarea fișelor medicale" });

      res.json(results);
    }
  );
});

// 3️⃣ Obținerea detaliilor unei fișe medicale
router.get("/:id_fisa", (req, res) => {
  const { id_fisa } = req.params;

  db.query(
    "SELECT * FROM fise_medicale WHERE id = ?",
    [id_fisa],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Eroare la preluarea fișei medicale" });

      if (result.length === 0) {
        return res.status(404).json({ error: "Fișă medicală inexistentă" });
      }

      res.json(result[0]);
    }
  );
});

// 4️⃣ Actualizarea unei fișe medicale
router.put("/update/:id_fisa", (req, res) => {
  const { id_fisa } = req.params;
  const { diagnostic, tratament, reteta } = req.body;

  db.query(
    "UPDATE fise_medicale SET diagnostic = ?, tratament = ?, reteta = ? WHERE id = ?",
    [diagnostic, tratament, reteta, id_fisa],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Eroare la actualizarea fișei medicale" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Fișă medicală inexistentă" });
      }

      res.json({ message: "Fișă medicală actualizată cu succes" });
    }
  );
});

// 5️⃣ Ștergerea unei fișe medicale
router.delete("/delete/:id_fisa", (req, res) => {
  const { id_fisa } = req.params;

  db.query(
    "DELETE FROM fise_medicale WHERE id = ?",
    [id_fisa],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Eroare la ștergerea fișei medicale" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Fișă medicală inexistentă" });
      }

      res.json({ message: "Fișă medicală ștearsă cu succes" });
    }
  );
});

// 6️⃣ Adăugarea unei analize medicale la o fișă medicală
router.post("/analize/add", (req, res) => {
  const { id_fisa_medicala, tip_analiza, rezultat, data_analiza } = req.body;

  db.query(
    "INSERT INTO analize_medicale (id_fisa_medicala, tip_analiza, rezultat, data_analiza) VALUES (?, ?, ?, ?)",
    [id_fisa_medicala, tip_analiza, rezultat, data_analiza],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Eroare la adăugarea analizei medicale" });

      res.json({ message: "Analiză medicală adăugată cu succes", id: result.insertId });
    }
  );
});

// 7️⃣ Obținerea tuturor analizelor medicale pentru o fișă medicală
router.get("/analize/:id_fisa_medicala", (req, res) => {
  const { id_fisa_medicala } = req.params;

  db.query(
    "SELECT * FROM analize_medicale WHERE id_fisa_medicala = ? ORDER BY data_analiza DESC",
    [id_fisa_medicala],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Eroare la preluarea analizelor medicale" });

      res.json(results);
    }
  );
});

module.exports = router;
