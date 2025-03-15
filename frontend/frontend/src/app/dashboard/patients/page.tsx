"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import PatientModal from "../components/PatientModal";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddPatientButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

const PatientsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const PatientCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: darkred;
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
}

export default function PatientsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Fetch patients from API
  useEffect(() => {
    axios.get("http://localhost:5000/patients/")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Function to delete a patient
  const handleDeletePatient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/patients/${id}`);
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  //TODO fix this error
  return (
    <>
      <Header>
        <h2>Patients List</h2>
        <AddPatientButton onClick={() => setModalOpen(true)}>+</AddPatientButton>
      </Header>
      <PatientsContainer>
        {patients.map((patient) => (
          <PatientCard key={patient.id}>
            <DeleteButton onClick={() => handleDeletePatient(patient.id)}>-</DeleteButton>
            <h3>{patient.nume} {patient.prenume}</h3>
            <p>Birth Date: {patient.data_nasterii}</p>
            <p>Gender: {patient.gen}</p>
            <p>Phone: {patient.telefon}</p>
            <p>Email: {patient.email}</p>
          </PatientCard>
        ))}
      </PatientsContainer>
      {modalOpen && <PatientModal closeModal={() => setModalOpen(false)} refreshPatients={setPatients} />}
    </>
  );
}
