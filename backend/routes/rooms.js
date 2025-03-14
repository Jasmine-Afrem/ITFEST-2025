const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Get Available Rooms
router.get("/available", (req, res) => {
  db.query("SELECT * FROM rooms WHERE status = 'available'", (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
});

// Assign Room to Patient
router.post("/assign", (req, res) => {
  const { patientId, roomId } = req.body;
  db.query("UPDATE rooms SET status = 'occupied', patient_id = ? WHERE id = ?", [patientId, roomId], (err) => {
    if (err) return res.status(500).json({ error: "Error updating room" });

    // Notify via WebSocket
    io.emit("roomUpdated", { patientId, roomId });

    res.json({ message: "Room assigned successfully" });
  });
});

module.exports = router;
