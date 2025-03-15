'use client';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

// Define types for the extracted data
interface ExtractedData {
  seria?: string;
  nr?: string;
  cnp?: string;
  lastName?: string;
  firstName?: string;
  nationality?: string;
  birthDate?: string;
  sex?: string;
}

const CameraCapturePage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const webcamRef = useRef<Webcam | null>(null);

  const sampleOCRText = `
OUMANIE ROMANT
CARTE D'IDENTITE
ROMANIA
CARTE DE IDENTITATE SERIA XD NR 033695
CNP 5030922204499
C6T3T
IDENTITY CARD
Nume/Nom/Last name
DUDUI
Prenume/Prenom/First name
MARIUS-GEZA
Cetatenie/Nationalite/Nationality
Romana / ROU
Loc nastere/Lieu de naissance Place of birth
Jud.HD Mun.Petroşani
Domiciliu/Adresse/Address Jud.HD Mun.Vulcan
Str.Traian nr.8 bl.Q sc.1 ap.6
412 e HD Emis de/Delivree parissued by
SPCLEP Vulcan
Sex/Sexe/Sex M
Valabilitate/Validite/Validity
13.09.21-22.09.2025
IDROUDUDUI<<MARIUS<GEZA<<<<<<<<<<<<< XD033695<4ROU0309220M250922052044997
`;

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageUrl(imageSrc);
    }
  };

  const handleImageUpload = async () => {
    if (!imageUrl) {
      console.log('No image to send');
      return;
    }
    const imageBase64 = imageUrl.split(',')[1];
    try {
      const response = await axios.post('http://localhost:5000/cam', {
        imageBase64,
      });
      console.log('OCR response:', response.data);
      if (response.data.text) {
        const extracted = extractData(response.data.text);
        setExtractedData(extracted);
      } else {
        console.error('OCR failed or no text found.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleTestSample = () => {
    const extracted = extractData(sampleOCRText);
    setExtractedData(extracted);
  };

  const extractData = (text: string): ExtractedData => {
    const regexPatterns = {
      seria: /SERIA\s*([A-Z0-9]+)/i,
      nr: /NR\s*([A-Z0-9]+)/i,
      cnp: /CNP\s*([0-9]+)/i,
      lastName: /(?:Last name|Nume\/Nom\/Last name)\s*\r?\n\s*([A-Za-z]+)/i,
      firstName: /(?:First name|Prenume\/Prenom\/First name)\s+([\S\s]+?)(?=\s*(?:Cetatenie|Nationalite|Nationality))/i,
      nationality: /(?:Nationality|Cetatenie\/Nationalite\/Nationality)\s*\r?\n\s*([A-Za-z]+)/i,
      // Extract sex from "Sex" or "Sexe" or "Sext"
      sex: /(?:Sex|Sexe|Sext)\s*([M|F])/i,
      // Extract birthdate from the CNP number (next 6 digits after the first number).
      birthDate: /CNP\s*(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/i,
    };

    const data: ExtractedData = {};

    for (const [key, pattern] of Object.entries(regexPatterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        if (key === 'birthDate' && match.length >= 7) {
          const yearPrefix = match[1] === '1' || match[1] === '2' ? '19' : '20';
          const year = yearPrefix + match[2];
          const month = match[3];
          const day = match[4];
          data[key as keyof ExtractedData] = `${year}-${month}-${day}`;
        } else {
          data[key as keyof ExtractedData] = match[1].trim();
        }
      }
    }

    return data;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ marginRight: '20px', textAlign: 'center' }}>
          {imageUrl && (
            <>
              <h2>Captured Image</h2>
              <img src={imageUrl} alt="Captured" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px' }} />
            </>
          )}
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
            <button
              onClick={captureImage}
              style={{
                padding: '10px 20px',
                backgroundColor: 'green',
                color: 'black',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              Capture Image
            </button>
          </div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="400px"
            videoConstraints={{ facingMode: 'user' }}
            style={{ borderRadius: '10px' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {imageUrl && (
          <button
            onClick={handleImageUpload}
            style={{
              padding: '10px 20px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              marginRight: '10px',
            }}
          >
            Process Image
          </button>
        )}
        <button
          onClick={handleTestSample}
          style={{
            padding: '10px 20px',
            backgroundColor: 'purple',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Test Sample Text
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: 'black' }}>
        <h2>Extracted Data</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <strong>SERIA:</strong> {extractedData.seria || 'Not found'}
          </li>
          <li>
            <strong>NR:</strong> {extractedData.nr || 'Not found'}
          </li>
          <li>
            <strong>CNP:</strong> {extractedData.cnp || 'Not found'}
          </li>
          <li>
            <strong>Last Name:</strong> {extractedData.lastName || 'Not found'}
          </li>
          <li>
            <strong>First Name:</strong> {extractedData.firstName || 'Not found'}
          </li>
          <li>
            <strong>Nationality:</strong> {extractedData.nationality || 'Not found'}
          </li>
          <li>
            <strong>Birth Date:</strong> {extractedData.birthDate || 'Not found'}
          </li>
          <li>
            <strong>Sex:</strong> {extractedData.sex || 'Not found'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CameraCapturePage;
