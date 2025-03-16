/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from 'next/navigation';

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
  z-index: 99999999;
`;

const ModalContent = styled.div`
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
  border-radius: 15px;
  padding: 50px 50px;
  width: 800px;
  max-height: 50vh; /* Maximum height of the modal */
  overflow-y: auto; /* Makes the modal scrollable */
  border: 1px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.88) 0px 15px 40px -20px;
`;

const Title = styled.h3`
  text-align: center;
  font-weight: 900;
  font-size: 24px;
  margin-bottom: 2.5rem;
  background: linear-gradient(45deg, #175676, #4ba3c3);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Input = styled.input`
  width: 100%;
  background: #F5F5F5;
  border: 2px solid #CCCCCC;
  padding: 12px;
  color:black;
  border-radius: 20px;
  font-size: 16px;
  margin-bottom: 15px;
  box-shadow: rgba(207, 240, 255, 0.4) 0px 5px 10px -3px;
  transition: all 0.3s ease-in-out;

  &::placeholder {
    color: black;
  }

  &:hover {
    border-color: #4BA3C3;
    box-shadow: rgba(75, 163, 195, 0.5) 0px 8px 12px -3px;
  }

  &:focus {
    outline: none;
    border-color: #4BA3C3;
    box-shadow: rgba(75, 163, 195, 0.7) 0px 10px 15px -3px;
  }
`;
const PurpleButton = styled.button`
  display: block;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  background: linear-gradient(45deg, #6e48aa 0%, #9d50bb 100%);
  color: white;
  padding: 16px;
  margin-top: 10px;
  border-radius: 12px;
  box-shadow: rgba(133, 189, 215, 0.88) 0px 10px 8px -6px;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 14px 8px -8px;
  }

  &:active {
    transform: scale(0.97);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 10px 6px -6px;
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  background: linear-gradient(45deg, #175676 0%, #4ba3c3 100%);
  color: white;
  padding: 16px;
  margin-top: 10px;
  border-radius: 12px;
  box-shadow: rgba(133, 189, 215, 0.88) 0px 10px 8px -6px;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 14px 8px -8px;
  }

  &:active {
    transform: scale(0.97);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 10px 6px -6px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 10px;
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

interface PatientModalProps {
  closeModal: () => void;
  refreshPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  initialValues?: Partial<Patient>;
}


export default function PatientModal({ closeModal, refreshPatients, initialValues = {} }: PatientModalProps) {
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
    ...initialValues 
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...initialValues
    }));
  }, [initialValues]);


  const handleSubmit = async () => {
    try {
      const response = await axios.post<{ message: string; patientId: number }>(
        "http://localhost:5000/patients/create",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      // Update patients list with newly added patient
      refreshPatients((prevPatients) => [
        ...prevPatients,
        { id: response.data.patientId, ...formData },
      ]);

      closeModal();
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  const router = useRouter();
  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <Title>Adauga Pacient Nou</Title>
        <Input name="nume" placeholder="First Name" value = {formData.nume} onChange={handleChange} />
        <Input name="prenume" placeholder="Last Name" value = {formData.prenume} onChange={handleChange} />
        <Input name="data_nasterii" type="date" placeholder="Date of Birth" value = {formData.data_nasterii} onChange={handleChange} />
        <Input name="gen" placeholder="Gender" value = {formData.gen} onChange={handleChange} />
        <Input name="telefon" placeholder="Phone" onChange={handleChange} />
        <Input name="email" placeholder="Email" onChange={handleChange} />
        <Input name="adresa" placeholder="Address" value = {formData.adresa} onChange={handleChange} />
        <Input name="cnp" placeholder="CNP" value = {formData.cnp} onChange={handleChange} />
        <Input name="serie_numar_buletin" placeholder="ID Series & Number" value = {formData.serie_numar_buletin} onChange={handleChange} />
        <Input name="cetatenie" placeholder="Nationality" value = {formData.cetatenie} onChange={handleChange} />
        <Input name="loc_nastere" placeholder="Birth Place" value = {formData.loc_nastere} onChange={handleChange} />
        <Input name="contact_urgent_nume" placeholder="Emergency Contact Name" onChange={handleChange} />
        <Input name="contact_urgent_telefon" placeholder="Emergency Contact Phone" onChange={handleChange} />
        <SubmitButton onClick={handleSubmit}>Adauga Pacient</SubmitButton>
        <PurpleButton onClick={() => router.push('/camera')}>
  Capture ID Card
</PurpleButton>
      </ModalContent>
    </ModalOverlay>
  );
}
function onChange(event: ChangeEvent<HTMLInputElement>): void {
  throw new Error("Function not implemented.");
}

