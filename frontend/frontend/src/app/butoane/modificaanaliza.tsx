// /frontend/frontend/src/app/butoane/modificanaliza.tsx

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Analysis {
  id: number;
  id_fisa_medicala: number;
  tip_analiza: string;
  rezultat: string;
  data_analiza: string;
}

interface ModificaAnalizaProps {
  analysis: Analysis;
  onClose: () => void;
  refreshAnalyses: () => void;
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

const ModificaAnaliza: React.FC<ModificaAnalizaProps> = ({ analysis, onClose, refreshAnalyses }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tip_analiza = formData.get('tip_analiza') as string;
    const rezultat = formData.get('rezultat') as string;
    const data_analiza = formData.get('data_analiza') as string;

    axios.put(`http://localhost:5000/medicalrecords/analize/update/${analysis.id}`, {
      tip_analiza,
      rezultat,
      data_analiza
    })
    .then((res) => {
      alert(res.data.message);
      onClose();
      refreshAnalyses();
    })
    .catch((err) => {
      console.error("Error updating analysis:", err);
    });
  };

  return (
    <FormPopup>
      <FormTitle>Modifică Analiză Medicală</FormTitle>
      <form onSubmit={handleSubmit}>
        <label>Tip Analiză:</label>
        <FormInput name="tip_analiza" defaultValue={analysis.tip_analiza} required />
        <label>Rezultat:</label>
        <FormInput name="rezultat" defaultValue={analysis.rezultat} required />
        <label>Data Analiză:</label>
        <FormInput name="data_analiza" type="date" defaultValue={analysis.data_analiza} required />
        <FormButtonsContainer>
          <BlueButton type="submit">Actualizează Analiza</BlueButton>
          <OrangeButton type="button" onClick={onClose}>Anulează</OrangeButton>
        </FormButtonsContainer>
      </form>
    </FormPopup>
  );
};

export default ModificaAnaliza;
