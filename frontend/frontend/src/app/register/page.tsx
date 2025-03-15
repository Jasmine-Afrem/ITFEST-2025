"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Image from "next/image";
import styled from "styled-components";

interface RegisterForm {
  nume: string;
  prenume: string;
  cnp: string;
  serie_numar_buletin: string;
  cetatenie: string;
  loc_nastere: string;
  adresa: string;
  rol: "Medic" | "Asistenta" | "Receptioner" | "Administrator";
  departament: string;
  specializare: string;
  grad_profesional: string;
  telefon: string;
  email: string;
  parola: string;
  contract_inceput: string;
  contract_sfarsit: string;
  status_angajat: "Activ" | "Concediu" | "Suspendat" | "Inactiv";
}

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #175676;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const LogoContainer = styled.div`
  margin-bottom: 0px;
`;

const FormContainer = styled.div`
  max-width: 600px;
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
  border-radius: 30px;
  padding: 30px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.3) 0px 6px 15px, 
              rgba(133, 189, 215, 0.2) 0px -6px 15px, 
              rgba(133, 189, 215, 0.2) 6px 0px 15px, 
              rgba(133, 189, 215, 0.2) -6px 0px 15px;
  margin-bottom: 10%;
  margin-top: -2rem;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 900;
  font-size: 32px;
  margin-bottom: 4rem;
  background: linear-gradient(45deg, #175676, #4BA3C3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const Form = styled.form`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const FullWidthRow = styled.div`
  grid-column: span 2;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  width: 100%;
  background: #F5F5F5;
  border: 2px solid #CCCCCC;
  padding: 12px;
  border-radius: 20px;
  box-shadow: rgba(207, 240, 255, 0.4) 0px 5px 10px -3px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;

  &::placeholder {
    color: rgb(170, 170, 170);
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

// Custom Input Component to track user input and ensure text stays black
const Input = ({ register, name, placeholder, required, type = "text" }: any) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <StyledInput
      {...register(name, { required })}
      type={type}
      placeholder={placeholder}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      style={{ color: inputValue ? "#333" : "rgb(150, 150, 150)" }} // Keeps text black after typing
    />
  );
};

const StyledSelect = styled.select`
  width: 100%;
  background: #F5F5F5;
  border: 2px solid #CCCCCC;
  padding: 12px;
  border-radius: 20px;
  box-shadow: rgba(207, 240, 255, 0.4) 0px 5px 10px -3px;
  font-size: 16px;
  color: rgb(150, 150, 150);
  transition: all 0.3s ease-in-out;
  appearance: none;

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

const RegisterButton = styled.button`
  display: block;
  width: 35%;
  font-weight: bold;
  background: linear-gradient(45deg, #175676 0%, #4BA3C3 100%);
  color: white;
  padding-block: 15px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: rgba(23, 86, 118, 0.88) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: rgba(23, 86, 118, 0.88) 0px 23px 10px -20px;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: rgba(23, 86, 118, 0.88) 0px 15px 10px -10px;
  }
`;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <PageWrapper>
      <LogoContainer>
        <Image src="/HealthSentinel-Photoroom.png" alt="HealthSentinel Logo" width={300} height={250} />
      </LogoContainer>

      <FormContainer>
        <Title>Register</Title>
        {message && <ErrorMessage>{message}</ErrorMessage>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>Nume</Label>
            <Input register={register} name="nume" placeholder="Nume" required />
          </div>
          <div>
            <Label>Prenume</Label>
            <Input register={register} name="prenume" placeholder="Prenume" required />
          </div>
          <div>
            <Label>CNP</Label>
            <Input register={register} name="cnp" placeholder="CNP" required />
          </div>
          <div>
            <Label>Serie & Nr. Buletin</Label>
            <Input register={register} name="serie_numar_buletin" placeholder="Serie & Nr. Buletin" required />
          </div>
          <div>
            <Label>Cetățenie</Label>
            <Input register={register} name="cetatenie" placeholder="Cetățenie" required />
          </div>
          <div>
            <Label>Loc Naștere</Label>
            <Input register={register} name="loc_nastere" placeholder="Loc Naștere" required />
          </div>
          <div>
            <Label>Adresă</Label>
            <Input register={register} name="adresa" placeholder="Adresă" required />
          </div>

          <FullWidthRow>
            <Label>Rol</Label>
            <StyledSelect {...register("rol", { required: "Required" })}>
              <option value="">Select Role</option>
              <option value="Medic">Medic</option>
              <option value="Asistenta">Asistenta</option>
              <option value="Receptioner">Receptioner</option>
              <option value="Administrator">Administrator</option>
            </StyledSelect>
          </FullWidthRow>

          <div>
            <Label>Departament</Label>
            <Input register={register} name="departament" placeholder="Departament" required />
          </div>
          <div>
            <Label>Specializare</Label>
            <Input register={register} name="specializare" placeholder="Specializare" required />
          </div>
          <div>
            <Label>Grad Profesional</Label>
            <Input register={register} name="grad_profesional" placeholder="Grad Profesional" required />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input register={register} name="telefon" placeholder="Telefon" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input register={register} name="email" type="email" placeholder="Email" required />
          </div>
          <div>
            <Label>Parola</Label>
            <Input register={register} name="parola" type="password" placeholder="Parola" required />
          </div>

          <div>
            <Label>Contract Început</Label>
            <Input register={register} name="contract_inceput" type="date" required />
          </div>
          <div>
            <Label>Contract Sfârșit</Label>
            <Input register={register} name="contract_sfarsit" type="date" required />
          </div>

          <FullWidthRow>
            <Label>Status Angajat</Label>
            <StyledSelect {...register("status_angajat", { required: "Required" })}>
              <option value="">Select Status</option>
              <option value="Activ">Activ</option>
              <option value="Concediu">Concediu</option>
              <option value="Suspendat">Suspendat</option>
              <option value="Inactiv">Inactiv</option>
            </StyledSelect>
          </FullWidthRow>

          <FullWidthRow>
            <RegisterButton type="submit">Register</RegisterButton>
          </FullWidthRow>
        </Form>
      </FormContainer>
    </PageWrapper>
  );
}

