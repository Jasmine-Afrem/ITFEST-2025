const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get All Rooms with Availability Status and Occupancy Info
router.get("/saloane", (req, res) => {
  const query = `
    SELECT s.*, 
           COUNT(ps.id_pacient) AS pacienti_internati,
           s.capacitate,
           CONCAT(COUNT(ps.id_pacient), '/', s.capacitate) AS ocupare,
           (COUNT(ps.id_pacient) >= s.capacitate) AS isFull
    FROM saloane s
    LEFT JOIN pacienti_saloane ps 
    ON s.id = ps.id_salon AND ps.data_externare IS NULL
    GROUP BY s.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Server error", details: err });

    res.json(results);
  });
});


module.exports = router;
