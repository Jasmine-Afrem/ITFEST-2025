'use client'

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapturePage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  // Capture image from webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageUrl(imageSrc);
    }
  };

  // Send image to the backend for OCR processing
  const handleImageUpload = async () => {
    if (!imageUrl) {
      console.log('No image to send');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/cam', {  // Specify the full backend URL (port 5000)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: imageUrl }), // Send base64 image
      });

      const data = await response.json(); // Parse the response as JSON

      console.log('OCR response:', data); // Log response for debugging

      if (data.text) {
        setExtractedText(data.text);  // Display the extracted text on the frontend
      } else {
        console.error('OCR failed or no text found.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        
        {/* Left side for showing captured image */}
        <div style={{ marginRight: "20px", textAlign: "center" }}>
          {imageUrl && (
            <>
              <h2>Captured Image</h2>
              <img src={imageUrl} alt="Captured" style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "10px" }} />
            </>
          )}
        </div>

        {/* Right side for webcam */}
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Button to capture image */}
          <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
            <button
              onClick={captureImage}
              style={{
                padding: "10px 20px",
                backgroundColor: "green",
                color: "black",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Capture Image
            </button>
          </div>

          {/* Webcam component */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="400px"
            videoConstraints={{
              facingMode: "user",
            }}
            style={{
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      {/* Button to upload and process image */}
      {imageUrl && (
        <button
          onClick={handleImageUpload}
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            marginTop: "20px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          Process Image
        </button>
      )}

      {/* Display extracted text */}
      {extractedText && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>Extracted Text</h2>
          <p>{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapturePage;
