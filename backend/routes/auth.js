const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// User Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM utilizatori_sistem WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.parola_hash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      // Retrieve staff details
      db.query(
        'SELECT * FROM personal_spital WHERE id = ?',
        [user.personal_spital_id],
        (err, staffResults) => {
          if (err) return res.status(500).json({ error: 'Server error' });
          const staffDetails = staffResults[0];

          const token = jwt.sign(
            { id: user.id, role: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );
          res.json({ token, user: { ...user, ...staffDetails } });
        }
      );
    }
  );
});

// User Registration (Admin Only)
router.post('/register', async (req, res) => {
  const {
    nume, prenume, cnp, serie_numar_buletin, cetatenie, loc_nastere,
    adresa, rol, departament, specializare, grad_profesional, telefon,
    email, parola, contract_inceput, contract_sfarsit, status_angajat
  } = req.body;

  try {
    // Check if the user already exists
    db.query(
      'SELECT * FROM personal_spital WHERE email = ? OR cnp = ? OR serie_numar_buletin = ? OR telefon = ?',
      [email, cnp, serie_numar_buletin, telefon],
      async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });
        if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(parola, 10);

        // Insert into personal_spital
        db.query(
          'INSERT INTO personal_spital (nume, prenume, cnp, serie_numar_buletin, cetatenie, loc_nastere, adresa, rol, departament, specializare, grad_profesional, telefon, email, parola_hash, contract_inceput, contract_sfarsit, status_angajat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [nume, prenume, cnp, serie_numar_buletin, cetatenie, loc_nastere, adresa, rol, departament, specializare, grad_profesional, telefon, email, hashedPassword, contract_inceput, contract_sfarsit, status_angajat],
          (err, result) => {
            if (err) return res.status(500).json({ error: 'Error registering user' + err });

            const personalSpitalId = result.insertId;

            // Insert into utilizatori_sistem
            db.query(
              'INSERT INTO utilizatori_sistem (username, email, parola_hash, rol, personal_spital_id) VALUES (?, ?, ?, ?, ?)',
              [email, email, hashedPassword, rol, personalSpitalId],
              (err, result) => {
                if (err) return res.status(500).json({ error: 'Error creating system user' });
                res.status(201).json({ message: 'User registered successfully' });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;