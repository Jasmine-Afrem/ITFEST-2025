const express = require("express");
const axios = require("axios"); // Add axios to make HTTP requests
const router = express.Router();

// Handle image processing
router.post("/", async (req, res) => {
  const { imageBase64 } = req.body;  // Get the base64 image data

  if (!imageBase64) {
    return res.status(400).json({ error: "No image provided" }); // If no image, return an error
  }

  try {
    // Send the image to the OCR API (ImgOCR example here)
    const apiUrl = "https://www.imgocr.com/api/imgocr_get_text";
    const response = await axios.post(apiUrl, {
      api_key: "44bf430bf52f3b5b85b092b5eb2984d2", // Your API key
      image: imageBase64, // Send the image base64
    });

    if (response.status === 200) {
      const ocrData = response.data;
      return res.json({ text: ocrData.text || "No text found" }); // Send back the extracted text
    } else {
      return res.status(500).json({ error: "OCR API request failed" }); // If OCR API fails
    }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during OCR processing" }); // Handle errors
  }
});

module.exports = router;
