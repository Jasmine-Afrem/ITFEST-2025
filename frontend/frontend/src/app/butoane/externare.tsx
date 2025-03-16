// /frontend/frontend/src/app/butoane/externare.tsx

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Patient {
  id: number;
  nume: string;
  prenume: string;
}

interface ExternareProps {
  patient: Patient;
  onClose: () => void;
  refreshPatient: () => void;
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
  width: 400px;
  text-align: center;
`;

const BlueButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 10px;
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
  margin: 10px;
  transition: background 0.3s ease;
  &:hover {
    background: #d97706;
  }
`;

const Externare: React.FC<ExternareProps> = ({ patient, onClose, refreshPatient }) => {
  const handleExternare = () => {
    axios.put(`http://localhost:5000/patientrooms/discharge/${patient.id}`)
    .then((res) => {
      alert(res.data.message);
      onClose();
      refreshPatient();
    })
    .catch((err) => {
      console.error("Error discharging patient:", err);
    });
  };

  return (
    <FormPopup>
      <h3>Externare Pacient</h3>
      <p>Ești sigur că dorești să externi pacientul {patient.nume} {patient.prenume}?</p>
      <div>
        <BlueButton onClick={handleExternare}>Externare</BlueButton>
        <OrangeButton onClick={onClose}>Anulează</OrangeButton>
      </div>
    </FormPopup>
  );
};

export default Externare;
