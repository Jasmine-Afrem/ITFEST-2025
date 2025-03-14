"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
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
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  max-width: 50%;
  background: #a4161a;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  color: white;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #ffcccb;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
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
      const response = await axios.post("http://localhost:5000/auth/register", data);
      setMessage(response.data.message);
    } catch (error: any) {
      if (error.response?.status === 400) {
        setMessage("User already exists. Please check your email, CNP, or phone number.");
      } else {
        setMessage(error.response?.data?.error || "Registration failed.");
      }
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Register</Title>
        {message && <ErrorMessage>{message}</ErrorMessage>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledInput {...register("nume", { required: "Nume is required" })} placeholder="Nume" />
          {errors.nume && <ErrorMessage>{errors.nume.message}</ErrorMessage>}

          <StyledInput {...register("prenume", { required: "Prenume is required" })} placeholder="Prenume" />
          {errors.prenume && <ErrorMessage>{errors.prenume.message}</ErrorMessage>}

          <StyledInput {...register("cnp", { required: "CNP is required", minLength: 13, maxLength: 13 })} placeholder="CNP" />
          {errors.cnp && <ErrorMessage>CNP must be exactly 13 characters</ErrorMessage>}

          <StyledInput {...register("serie_numar_buletin", { required: "Required" })} placeholder="Serie & Numar Buletin" />
          {errors.serie_numar_buletin && <ErrorMessage>Required</ErrorMessage>}

          <StyledInput {...register("cetatenie", { required: "Cetatenie is required" })} placeholder="Cetatenie" />
          {errors.cetatenie && <ErrorMessage>{errors.cetatenie.message}</ErrorMessage>}

          <StyledInput {...register("loc_nastere", { required: "Locul nasterii is required" })} placeholder="Loc Nastere" />
          {errors.loc_nastere && <ErrorMessage>{errors.loc_nastere.message}</ErrorMessage>}

          <StyledInput {...register("adresa", { required: "Adresa is required" })} placeholder="Adresa" />
          {errors.adresa && <ErrorMessage>{errors.adresa.message}</ErrorMessage>}

          <StyledSelect {...register("rol", { required: "Rol is required" })}>
            <option value="">Select Rol</option>
            <option value="Medic">Medic</option>
            <option value="Asistenta">Asistenta</option>
            <option value="Receptioner">Receptioner</option>
            <option value="Administrator">Administrator</option>
          </StyledSelect>
          {errors.rol && <ErrorMessage>{errors.rol.message}</ErrorMessage>}

          <StyledInput {...register("departament", { required: "Departament is required" })} placeholder="Departament" />
          {errors.departament && <ErrorMessage>{errors.departament.message}</ErrorMessage>}

          <StyledInput {...register("specializare", { required: "Specializare is required" })} placeholder="Specializare" />
          {errors.specializare && <ErrorMessage>{errors.specializare.message}</ErrorMessage>}

          <StyledInput {...register("grad_profesional", { required: "Grad profesional is required" })} placeholder="Grad Profesional" />
          {errors.grad_profesional && <ErrorMessage>{errors.grad_profesional.message}</ErrorMessage>}

          <StyledInput {...register("telefon", { required: "Telefon is required" })} placeholder="Telefon" />
          {errors.telefon && <ErrorMessage>{errors.telefon.message}</ErrorMessage>}

          <StyledInput {...register("email", { required: "Email is required" })} type="email" placeholder="Email" />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <StyledInput {...register("parola", { required: "Minimum 6 characters required", minLength: 6 })} type="password" placeholder="Parola" />
          {errors.parola && <ErrorMessage>{errors.parola.message}</ErrorMessage>}

          <StyledInput {...register("contract_inceput", { required: "Required" })} type="date" />
          {errors.contract_inceput && <ErrorMessage>Required</ErrorMessage>}

          <StyledInput {...register("contract_sfarsit", { required: "Required" })} type="date" />
          {errors.contract_sfarsit && <ErrorMessage>Required</ErrorMessage>}

          <StyledSelect {...register("status_angajat", { required: "Required" })}>
            <option value="">Select Status</option>
            <option value="Activ">Activ</option>
            <option value="Concediu">Concediu</option>
            <option value="Suspendat">Suspendat</option>
            <option value="Inactiv">Inactiv</option>
          </StyledSelect>
          {errors.status_angajat && <ErrorMessage>{errors.status_angajat.message}</ErrorMessage>}

          <StyledButton type="submit">Register</StyledButton>
        </form>
      </FormContainer>
    </PageWrapper>
  );
}
