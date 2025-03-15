"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import PatientModal from "../components/PatientModal";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 900px;
  margin: auto;
  left 20px:
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background: #1e3a8a;
  color: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const AddPatientButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
`;

const PatientsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
`;

const PatientCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef4444;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease-in-out;

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

interface Patient {
  id: number;
  nume: string;
  prenume: string;
  data_nasterii: string;
  gen: string;
  telefon: string;
  email: string;
  adresa: string;
  cnp: string;
  serie_numar_buletin: string;
  cetatenie: string;
  loc_nastere: string;
  contact_urgent_nume: string;
  contact_urgent_telefon: string;
}

export default function PatientsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/patients/")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const handleDeletePatient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/patients/${id}`);
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <PageContainer>
      <Header>
        <h2>Patients List</h2>
        <AddPatientButton onClick={() => setModalOpen(true)}>+</AddPatientButton>
      </Header>
      <PatientsContainer>
        {patients.map((patient) => (
          <PatientCard key={patient.id}>
            <DeleteButton onClick={() => handleDeletePatient(patient.id)}>×</DeleteButton>
            <h3>
              {patient.nume} {patient.prenume}
            </h3>
            <p>📅 Birth Date: {patient.data_nasterii}</p>
            <p>⚧ Gender: {patient.gen}</p>
            <p>📞 Phone: {patient.telefon}</p>
            <p>✉ Email: {patient.email}</p>
          </PatientCard>
        ))}
      </PatientsContainer>

      {modalOpen && <PatientModal closeModal={() => setModalOpen(false)} refreshPatients={setPatients} />}
    </PageContainer>
  );
}
