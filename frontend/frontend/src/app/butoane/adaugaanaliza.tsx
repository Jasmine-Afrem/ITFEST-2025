import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

interface AdaugaAnalizaProps {
  id_fisa_medicala: number;
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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const AdaugaAnaliza: React.FC<AdaugaAnalizaProps> = ({ id_fisa_medicala, onClose, refreshAnalyses }) => {
  const [tipAnaliza, setTipAnaliza] = useState("");
  const [rezultat, setRezultat] = useState("");
  const [dataAnaliza, setDataAnaliza] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/medicalrecords/analize/add", {
        id_fisa_medicala,
        tip_analiza: tipAnaliza,
        rezultat,
        data_analiza: dataAnaliza,
      });

      alert(response.data.message);
      refreshAnalyses();
      onClose();
    } catch (err) {
      setError("Eroare la adăugarea analizei medicale. Vă rugăm să încercați din nou.");
      console.error("Error adding analysis:", err);
    }
  };

  return (
    <FormPopup>
      <FormTitle>Adaugă Analiză Medicală</FormTitle>
      <form onSubmit={handleSubmit}>
        <label>Tip Analiză:</label>
        <FormInput
          name="tip_analiza"
          value={tipAnaliza}
          onChange={(e) => setTipAnaliza(e.target.value)}
          required
        />

        <label>Rezultat:</label>
        <FormInput
          name="rezultat"
          value={rezultat}
          onChange={(e) => setRezultat(e.target.value)}
          required
        />

        <label>Data Analiză:</label>
        <FormInput
          name="data_analiza"
          type="date"
          value={dataAnaliza}
          onChange={(e) => setDataAnaliza(e.target.value)}
          required
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormButtonsContainer>
          <BlueButton type="submit">Salvează Analiza</BlueButton>
          <OrangeButton type="button" onClick={onClose}>
            Anulează
          </OrangeButton>
        </FormButtonsContainer>
      </form>
    </FormPopup>
  );
};

export default AdaugaAnaliza;
