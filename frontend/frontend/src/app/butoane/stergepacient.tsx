/* eslint-disable @typescript-eslint/no-explicit-any */
// /frontend/frontend/src/app/butoane/stergepacient.tsx

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface Patient {
  id: number;
  nume: string;
  prenume: string;
}

interface StergePacientProps {
  patient: Patient;
  onClose: () => void;
  refreshPatients: () => void;
}

const FormPopup = styled.div`
  color: black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
  z-index: 1001;
  width: 400px;
  text-align: center;
`;

const BlueButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 10px 20px;
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
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 10px;
  transition: background 0.3s ease;
  &:hover {
    background: #d97706;
  }
`;

const StergePacient: React.FC<StergePacientProps> = ({ patient, onClose, refreshPatients }) => {
  const handleDelete = async () => {
    if (!patient?.id) {
      alert("Eroare: ID-ul pacientului este invalid.");
      return;
    }
  
    try {
      const response = await axios.delete(`http://localhost:5000/patients/${patient.id}`);
  
      if (response.status === 200) {
        alert(response.data.message);
        refreshPatients();
        onClose();
      } else {
        alert("Eroare: Nu s-a putut șterge fișa medicală.");
      }
    } catch (error: any) {
      console.error("Eroare la ștergere:", error);
  
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          alert("Pacientul nu a fost găsit.");
        } else if (status === 500) {
          alert("Eroare internă a serverului. Încearcă din nou.");
        } else {
          alert(data.error || "A apărut o eroare necunoscută.");
        }
      } else if (error.request) {
        alert("Serverul nu răspunde. Verifică conexiunea.");
      } else {
        alert("Eroare necunoscută la ștergere.");
      }
    }
  };
  
  return (
    <FormPopup>
      <h3>Ștergere Pacient</h3>
      <p>Ești sigur că vrei să ștergi pacientul {patient.nume} {patient.prenume}?</p>
      <div>
        <BlueButton onClick={handleDelete}>Șterge</BlueButton>
        <OrangeButton onClick={onClose}>Anulează</OrangeButton>
      </div>
    </FormPopup>
  );
};

export default StergePacient;
