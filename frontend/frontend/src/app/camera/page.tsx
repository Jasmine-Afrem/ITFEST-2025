/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const webcamRef = useRef<Webcam | null>(null);

  const samplerOCRText = `
OUMANIE ROMANT
CARTE D'IDENTITE
ROMANIA
CARTE DE IDENTITATE SERIA XD NR 492151
CNP 553952398623
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
      if (response.data.text) {
        const extracted = extractData(response.data.text);
        setExtractedData(extracted);
        if (extracted.sex) {
          router.push(
            `/dashboard/patients?showModal=true/${extracted.firstName}/${extracted.lastName}/${extracted.birthDate}/${extracted.seria}/${extracted.nr}/${extracted.cnp}/${extracted.nationality}`
          );
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleTestSample = () => {
    const extracted = extractData(samplerOCRText);
    setExtractedData(extracted);
    if (extracted.sex) {
      router.push(
        `/dashboard/patients?showModal=true/${extracted.firstName}/${extracted.lastName}/${extracted.birthDate}/${extracted.seria}/${extracted.nr}/${extracted.cnp}/${extracted.nationality}`
      );
    }
  };

  const extractData = (text: string): ExtractedData => {
    const regexPatterns = {
      seria: /SERIA\s*([A-Z0-9]+)/i,
      nr: /NR\s*([A-Z0-9]+)/i,
      cnp: /CNP\s*([0-9]+)/i,
      lastName: /(?:Last name|Nume\/Nom\/Last name)\s*\r?\n\s*([A-Za-z]+)/i,
      firstName: /(?:First name|Prenume\/Prenom\/First name)\s+([\S\s]+?)(?=\s*(?:Cetatenie|Nationalite|Nationality))/i,
      nationality: /(?:Nationality|Cetatenie\/Nationalite\/Nationality)\s*\r?\n\s*([A-Za-z]+)/i,
      sex: /(?:Sex|Sexe|Sext)\s*([M|F])/i,
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
          data.birthDate = `${year}-${month}-${day}`;
        } else {
          data[key as keyof ExtractedData] = match[1].trim();
        }
      }
    }

    return data;
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #4BA3C3, #175676)',
      }}
    >
      {/* Coloana stângă - panoul pentru scanare și date */}
      <div
        style={{
          width: '600px',
          margin: '20px',
          background: '#fff',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Elementele webcam - afișare imagine capturată și webcam, una sub alta */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          {imageUrl && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img
                src={imageUrl}
                alt="Captured"
                style={{
                  maxWidth: '450px',
                  maxHeight: '450px',
                  borderRadius: '10px',
                }}
              />
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="500px"
              videoConstraints={{ facingMode: 'user' }}
              style={{ borderRadius: '10px' }}
            />
          </div>
        </div>

        {/* Butoanele plasate la final */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          {imageUrl && (
            <button
              onClick={handleImageUpload}
              className="customButton"
              style={{ marginRight: '20px' }}
            >
              Proceseaza Imagine
            </button>
          )}
          <button
            onClick={handleTestSample}
            className="customButton"
            style={{ marginRight: '20px' }}
          >
            Test Data
          </button>
          <button
            onClick={captureImage}
            className="customButton"
            style={{ marginTop: '20px' }}
          >
            Captureaza Imaginea
          </button>
        </div>
      </div>

      {/* Coloana dreaptă - embed Spline */}
      <div style={{ flex: 1 }}>
        <iframe
          src="https://my.spline.design/dnaparticles-fb2cf219c5ca1e9415ad5045b77e7ada/"
          frameBorder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>

      <style jsx>{`
        .customButton {
          padding-left: 33px;
          padding-right: 33px;
          padding-bottom: 8px;
          padding-top: 8px;
          border-radius: 9px;
          background: #4BA3C3;
          border: none;
          font-family: inherit;
          text-align: center;
          cursor: pointer;
          transition: 0.5s;
        }
        .customButton:hover {
          box-shadow: 10px 10px 56px -14px #4BA3C3;
        }
        .customButton:active {
          transform: scale(0.97);
          box-shadow: 7px 5px 56px -10px #4BA3C3;
        }
      `}</style>
    </div>
  );
};

export default CameraCapturePage;
