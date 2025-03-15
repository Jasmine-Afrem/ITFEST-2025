"use client";

import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Patient } from "./types"; // ✅ Import the shared type

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const CloseButton = styled.button`
  float: right;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

interface PatientModalProps {
  closeModal: () => void;
  refreshPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

export default function PatientModal({ closeModal, refreshPatients }: PatientModalProps) {
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    nume: "",
    prenume: "",
    data_nasterii: "",
    gen: "",
    telefon: "",
    email: "",
    adresa: "",
    cnp: "",
    serie_numar_buletin: "",
    cetatenie: "",
    loc_nastere: "",
    contact_urgent_nume: "",
    contact_urgent_telefon: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post<{ message: string; patientId: number }>(
        "http://localhost:5000/patients/create",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      refreshPatients((prevPatients) => [
        ...prevPatients,
        { id: response.data.patientId, ...formData },
      ]);

      closeModal();
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>X</CloseButton>
        <h3>Add New Patient</h3>
        <Input name="nume" placeholder="First Name" onChange={handleChange} />
        <Input name="prenume" placeholder="Last Name" onChange={handleChange} />
        <Input name="data_nasterii" type="date" placeholder="Date of Birth" onChange={handleChange} />
        <Input name="gen" placeholder="Gender" onChange={handleChange} />
        <Input name="telefon" placeholder="Phone" onChange={handleChange} />
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <SubmitButton onClick={handleSubmit}>Add Patient</SubmitButton>
      </ModalContent>
    </ModalOverlay>
  );
}
