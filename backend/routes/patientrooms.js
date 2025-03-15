const express = require("express");
const db = require("../config/db");

const router = express.Router();

module.exports = (io) => {
  // 1️⃣ Atribuie un pacient la un salon și notifică toți clienții
  router.post("/assign", (req, res) => {
    const { id_pacient, id_salon } = req.body;

    db.query(
      "INSERT INTO pacienti_saloane (id_pacient, id_salon) VALUES (?, ?) ON DUPLICATE KEY UPDATE id_salon = ?, data_internare = CURRENT_TIMESTAMP, data_externare = NULL",
      [id_pacient, id_salon, id_salon],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error assigning patient to room" });

        // 🔥 Trimitem update în timp real la toți clienții conectați
        io.emit("patientMoved", { id_pacient, id_salon });

        res.json({ message: "Patient assigned to room successfully" });
      }
    );
  });

  // 2️⃣ Verifică în ce salon se află un pacient
  router.get("/check/:id_pacient", (req, res) => {
    const { id_pacient } = req.params;

    db.query(
      "SELECT id_salon, data_internare FROM pacienti_saloane WHERE id_pacient = ? AND data_externare IS NULL",
      [id_pacient],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Server error" });

        if (results.length === 0) {
          return res.json({ message: "Patient is not currently assigned to any room" });
        }

        res.json(results[0]);
      }
    );
  });

  // 3️⃣ Obține toți pacienții internați într-un salon
  router.get("/room/:id_salon", (req, res) => {
    const { id_salon } = req.params;

    db.query(
      `SELECT p.id, p.nume, p.prenume, ps.data_internare 
       FROM pacienti_saloane ps
       JOIN pacienti p ON ps.id_pacient = p.id
       WHERE ps.id_salon = ? AND ps.data_externare IS NULL`,
      [id_salon],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Server error" });

        res.json(results);
      }
    );
  });

  // 4️⃣ Externează un pacient și notifică toți clienții
  router.put("/discharge/:id_pacient", (req, res) => {
    const { id_pacient } = req.params;

    db.query(
      "UPDATE pacienti_saloane SET data_externare = CURRENT_TIMESTAMP WHERE id_pacient = ? AND data_externare IS NULL",
      [id_pacient],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Error discharging patient" });

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Patient is not currently assigned to a room" });
        }

        // 🔥 Trimitem update în timp real la toți clienții conectați
        io.emit("patientDischarged", { id_pacient });

        res.json({ message: "Patient discharged successfully" });
      }
    );
  });

  return router;
};
