/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";

interface LoginForm {
  email: string;
  password: string;
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
  max-width: 400px;
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

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", data);
      const { token, user } = response.data;

      // Store the token for authentication
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");
      // Redirect or handle logged-in user
    } catch (error: any) {
      if (error.response?.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage(error.response?.data?.error || "Login failed.");
      }
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Login</Title>
        {message && <ErrorMessage>{message}</ErrorMessage>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledInput {...register("email", { required: "Email is required" })} type="email" placeholder="Email" />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <StyledInput {...register("password", { required: "Password is required", minLength: 6 })} type="password" placeholder="Password" />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

          <StyledButton type="submit">Login</StyledButton>
        </form>
      </FormContainer>
    </PageWrapper>
  );
}
