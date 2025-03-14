"use client";

import { useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Modal from "./PatientModal";

const DashboardContainer = styled.div`
  margin-left: 250px;
  padding: 20px;
`;

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
`;

const mockPatients = [
  { id: 1, name: "John Doe", age: 45, condition: "Diabetes" },
  { id: 2, name: "Jane Smith", age: 30, condition: "Hypertension" },
  { id: 3, name: "Michael Brown", age: 50, condition: "Asthma" },
];

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [patients] = useState(mockPatients);

  return (
    <>
      <Sidebar />
      <DashboardContainer>
        <Header>
          <h2>Available Patients</h2>
          <AddPatientButton onClick={() => setModalOpen(true)}>+</AddPatientButton>
        </Header>
        <PatientsContainer>
          {patients.map((patient) => (
            <PatientCard key={patient.id}>
              <h3>{patient.name}</h3>
              <p>Age: {patient.age}</p>
              <p>Condition: {patient.condition}</p>
            </PatientCard>
          ))}
        </PatientsContainer>
      </DashboardContainer>
      {modalOpen && <Modal closeModal={() => setModalOpen(false)} />}
    </>
  );
}
