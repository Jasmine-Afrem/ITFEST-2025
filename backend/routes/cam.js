const express = require('express');
const Tesseract = require('tesseract.js');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log("Received image for OCR");
  const { imageBase64 } = req.body;  // Receive the base64 image from frontend

  // Validate if the image is provided
  if (!imageBase64) {A
    console.log("No image provided");
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // Run OCR using Tesseract.js on the provided image
    const result = await Tesseract.recognize(
      imageBase64,  // base64 image sent from frontend
      'ron',  // Language: Romanian
      {
        logger: (m) => console.log(m),  // Log OCR progress
      }
    );

    // Send back the extracted text from the OCR
    res.status(200).json({ text: result.data.text });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: 'OCR processing failed' });
  }
});

router.get('/', async (req, res) => {
  res.json({ message: 'Hello from CAM API' });
});

module.exports = router;
