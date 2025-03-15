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

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #175676;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
`;

const Logo = styled.img`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
  height: auto;
`;

const FormContainer = styled.div`
  width: 420px;
  background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
  border-radius: 15px;
  padding: 40px 50px;
  border: 1px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.88) 0px 15px 40px -20px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 900;
  font-size: 34px;
  color: rgb(16, 137, 211);
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const Input = styled.input`
  width: 100%;
  background: white;
  border: none;
  color: black;
  padding: 18px 22px;
  border-radius: 25px;
  margin-top: 20px;
  box-shadow: #cff0ff 0px 5px 5px -5px;
  border-inline: 2px solid transparent;
  font-size: 18px;
  
  

  &::placeholder {
    color: rgb(170, 170, 170);
    border-color: #007bff;
    border-color: #ccc;
  }

  &:focus {
    outline: none;
    border-inline: 2px solid #12b1d1;
    border-color: #007bff;
  }
`;

const ForgotPassword = styled.div`
  display: block;
  margin-top: 10px;
  margin-left: 7.3rem;

  a {
    font-size: 12px;
    color: #0099ff;
    text-decoration: none;
  }
`;

const LoginButton = styled.button`
  display: block;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  background: linear-gradient(45deg, #175676 0%, #4BA3C3 100%);
  color: white;
  padding-block: 18px;
  margin: 25px auto;
  border-radius: 25px;
  box-shadow: rgba(133, 189, 215, 0.88) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 23px 10px -20px;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.88) 0px 15px 10px -10px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SideImage = styled.img`
  width: 750px;
  height: 800px;
  margin-left: 200px;
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

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setMessage("Email sau parola invalida.");
      } else {
        setMessage(error.response?.data?.error || "Login eșuat.");
      }
    }
  };

  return (
    <PageWrapper>
      <Logo src="/HealthSentinel-Photoroom.png" alt="Logo" />
      <ContentWrapper>
        <FormContainer>
          <Title>Login</Title>
          {message && <ErrorMessage>{message}</ErrorMessage>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("email", { required: "Email-ul este necesar" })} type="email" placeholder="Email" />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

            <Input {...register("password", { required: "Parola este necesară", minLength: 6 })} type="password" placeholder="Parola" />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

            <ForgotPassword>
              <a href="#">Ai uitat parola?</a>
            </ForgotPassword>

            <LoginButton type="submit">Login</LoginButton>
          </Form>
        </FormContainer>
        <SideImage src="/Isometric.png" alt="Illustration" />
      </ContentWrapper>
    </PageWrapper>
  );
}
