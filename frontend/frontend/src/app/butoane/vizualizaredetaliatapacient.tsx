/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import axios from "axios";

interface VizualizareDetaliataPacientProps {
  patientId: number;
  onClose: () => void;
}

const DetailContainer = styled.div`
  color: #333;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: #dc2626;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  top: 35px; /* Moves the button higher */
  right: 20px; /* Keeps it on the right */
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: rgba(220, 38, 38, 0.8) 0px 15px 15px -10px;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: rgba(220, 38, 38, 0.6) 0px 8px 8px -6px;
  }
`;

const SectionTitle = styled.h4`
  margin-top: 20px;
  border-bottom: 3px solid #f59e0b;
  padding-bottom: 5px;
  font-size: 18px;
  color: #f59e0b;
`;

const DataList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const DataItem = styled.li`
  margin-bottom: 8px;
  font-size: 16px;
  color: #555;
  padding: 5px 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePicture = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #175676;
  box-shadow: rgba(75, 163, 195, 0.5) 0px 5px 15px;
  object-fit: cover;
  background-color: #175676;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
`;

const InputLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
  margin-top: 1rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border 0.2s ease-in-out;
  &:focus {
    border-color: #f59e0b;
    outline: none;
  }
`;

const SaveButton = styled.button`
  display: block;
  width: 27%;
  font-weight: bold;
  background: linear-gradient(45deg, #22c55e 0%, #16a34a 100%);
  color: white;
  padding: 12px 12px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: rgba(34, 197, 94, 0.8) 0px 10px 10px -8px;
  border: none;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: rgba(34, 197, 94, 0.8) 0px 15px 15px -10px;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: rgba(34, 197, 94, 0.6) 0px 8px 8px -6px;
  }
`;

const VizualizareDetaliataPacient: React.FC<VizualizareDetaliataPacientProps> = ({ patientId, onClose }) => {
  const [patient, setPatient] = useState<any>(null);
  const [editedFise, setEditedFise] = useState<any>({});
  const [editedAnalize, setEditedAnalize] = useState<any>({});

  useEffect(() => {
    axios.get(`http://localhost:5000/patients/databyid/${patientId}`)
      .then((res) => {
        setPatient(res.data);
        setEditedFise(res.data.fise_medicale.reduce((acc: any, fisa: any) => {
          acc[fisa.id] = { ...fisa };
          return acc;
        }, {}));
        setEditedAnalize(res.data.analize_medicale.reduce((acc: any, analiza: any) => {
          acc[analiza.id] = { ...analiza };
          return acc;
        }, {}));
      })
      .catch((err) => console.error("Error fetching patient details:", err));
  }, [patientId]);

  if (!patient || !patient.pacient) return <DetailContainer>Se încarcă...</DetailContainer>;

  const formatDate = (dateString: string) => {
    if (!dateString) return "Nespecificat";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Nespecificat" : date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChangeFisa = (id: number, field: string, value: string) => {
    setEditedFise((prev: any) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveFisa = (id: number) => {
    axios.put(`http://localhost:5000/medicalrecords/update/${id}`, editedFise[id])
      .then(() => alert("Fișă actualizată"))
      .catch(err => alert("Eroare: " + err));
  };

  return (
    <DetailContainer>
      <HeaderContainer>
        <ProfilePicture src="/def_picture.png" alt="Profile" />
      </HeaderContainer>
      <CloseButton onClick={onClose}>× </CloseButton>
      <SectionTitle>Detalii Pacient</SectionTitle>

      <DataList>
        <DataItem><strong>Nume:</strong> {patient.pacient.nume} {patient.pacient.prenume}</DataItem>
        <DataItem><strong>Data Nașterii:</strong> {formatDate(patient.pacient.data_nasterii)}</DataItem>
        <DataItem><strong>Gen:</strong> {patient.pacient.gen}</DataItem>
        <DataItem><strong>Telefon:</strong> {patient.pacient.telefon}</DataItem>
        <DataItem><strong>Email:</strong> {patient.pacient.email}</DataItem>
        <DataItem><strong>Adresă:</strong> {patient.pacient.adresa}</DataItem>
        <DataItem><strong>CNP:</strong> {patient.pacient.cnp}</DataItem>
        <DataItem><strong>Serie și număr buletin:</strong> {patient.pacient.serie_numar_buletin}</DataItem>
        <DataItem><strong>Naționalitate:</strong> {patient.pacient.cetatenie}</DataItem>
        <DataItem><strong>Loc naștere:</strong> {patient.pacient.loc_nastere}</DataItem>
        <DataItem><strong>Data creare fișă:</strong> {formatDate(patient.pacient.data_creare)}</DataItem>
      </DataList>

      {patient.fise_medicale?.length > 0 && (
        <>
          <SectionTitle>Fișe Medicale</SectionTitle>
          <DataList>
            {patient.fise_medicale.map((fisa: any) => (
              <li key={fisa.id}>
                <InputContainer>
                  <InputLabel>Diagnostic</InputLabel>
                  <InputField
                    value={editedFise[fisa.id]?.diagnostic || ""}
                    onChange={(e) => handleChangeFisa(fisa.id, "diagnostic", e.target.value)}
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel>Tratament</InputLabel>
                  <InputField
                    value={editedFise[fisa.id]?.tratament || ""}
                    onChange={(e) => handleChangeFisa(fisa.id, "tratament", e.target.value)}
                  />
                </InputContainer>
                <InputContainer>
                  <InputLabel>Rețetă</InputLabel>
                  <InputField
                    value={editedFise[fisa.id]?.reteta || ""}
                    onChange={(e) => handleChangeFisa(fisa.id, "reteta", e.target.value)}
                  />
                </InputContainer>
                <SaveButton onClick={() => handleSaveFisa(fisa.id)}>Salvează</SaveButton>
                <hr />
              </li>
            ))}
          </DataList>
        </>
      )}
    </DetailContainer>
  );
};

export default VizualizareDetaliataPacient;
