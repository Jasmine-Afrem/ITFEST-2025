// /frontend/frontend/src/app/butoane/adaugafisa.tsx

import React from "react";
import styled from "styled-components";
import axios from "axios";

interface Patient {
  id: number;
  // alte proprietăți pot fi adăugate după nevoie
}

interface AdaugaFisaProps {
  selectedPatient: Patient;
  onClose: () => void;
  refreshRecords: () => void;
}

const FormPopup = styled.div`
  color: black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 500px;
  height: 500px;
  overflow-y: auto;
`;

const FormTitle = styled.h3`
  margin-bottom: 20px;
`;

const FormInput = styled.input`
  color: black;
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const FormButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const BlueButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }
`;

const OrangeButton = styled.button`
  background: #f59e0b;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #d97706;
    transform: scale(1.05);
  }
`;

const AdaugaFisa: React.FC<AdaugaFisaProps> = ({
  selectedPatient,
  onClose,
  refreshRecords,
}) => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const diagnostic = formData.get("diagnostic") as string;
    const tratament = formData.get("tratament") as string;
    const reteta = formData.get("reteta") as string;

    const medicalRecord = {
      id_pacient: selectedPatient.id,
      id_medic: 5, // Se presupune că ID-ul medicului logat este 5
      diagnostic,
      tratament,
      reteta,
    };

    axios
      .post("http://localhost:5000/medicalrecords/add", medicalRecord)
      .then((res) => {
        alert(res.data.message);
        onClose();
        refreshRecords();
      })
      .catch((err) => console.error("Error adding medical record:", err));
  };

  return (
    <FormPopup>
      <FormTitle>Creare Fişă Medicală</FormTitle>
      <form onSubmit={handleFormSubmit}>
        <label>Diagnostic:</label>
        <FormInput name="diagnostic" required />
        <label>Tratament:</label>
        <FormInput name="tratament" required />
        <label>Reţetă:</label>
        <FormInput name="reteta" required />
        <FormButtonsContainer>
          <BlueButton type="submit">Salvează Fișa</BlueButton>
          <OrangeButton type="button" onClick={onClose}>
            Anulează
          </OrangeButton>
        </FormButtonsContainer>
      </form>
    </FormPopup>
  );
};

export default AdaugaFisa;
