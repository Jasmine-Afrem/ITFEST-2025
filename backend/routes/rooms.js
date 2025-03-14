const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get Available Rooms
router.get("/saloane", (req, res) => {
  db.query("SELECT * FROM saloane", (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
});


module.exports = router;
