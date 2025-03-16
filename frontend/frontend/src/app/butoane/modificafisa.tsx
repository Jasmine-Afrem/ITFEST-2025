// /frontend/frontend/src/app/butoane/modificafisa.tsx

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface MedicalRecord {
  id: number;
  id_pacient: number;
  id_medic: number;
  diagnostic: string;
  tratament: string;
  reteta: string;
}

interface ModificaFisaProps {
  medicalRecord: MedicalRecord;
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
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #2563eb;
  }
`;

const OrangeButton = styled.button`
  background: #f59e0b;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #d97706;
  }
`;

const ModificaFisa: React.FC<ModificaFisaProps> = ({ medicalRecord, onClose, refreshRecords }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const diagnostic = formData.get('diagnostic') as string;
    const tratament = formData.get('tratament') as string;
    const reteta = formData.get('reteta') as string;

    axios.put(`http://localhost:5000/medicalrecords/update/${medicalRecord.id}`, {
      diagnostic,
      tratament,
      reteta
    })
    .then((res) => {
      alert(res.data.message);
      onClose();
      refreshRecords();
    })
    .catch((err) => {
      console.error("Error updating medical record:", err);
    });
  };

  return (
    <FormPopup>
      <FormTitle>Modifică Fișă Medicală</FormTitle>
      <form onSubmit={handleSubmit}>
        <label>Diagnostic:</label>
        <FormInput name="diagnostic" defaultValue={medicalRecord.diagnostic} required />
        <label>Tratament:</label>
        <FormInput name="tratament" defaultValue={medicalRecord.tratament} required />
        <label>Rețetă:</label>
        <FormInput name="reteta" defaultValue={medicalRecord.reteta} required />
        <FormButtonsContainer>
          <BlueButton type="submit">Actualizează Fișa</BlueButton>
          <OrangeButton type="button" onClick={onClose}>Anulează</OrangeButton>
        </FormButtonsContainer>
      </form>
    </FormPopup>
  );
};

export default ModificaFisa;
