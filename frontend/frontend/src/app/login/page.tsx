/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styled from "styled-components";
import { useRouter } from 'next/navigation';
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
  top: 0;
  left: 20px;
  width: 250px;
  height: auto;
  margin-bottom: 2rem;
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
  font-size: 32px;
  margin-bottom: 2.5rem;
  background: linear-gradient(45deg, #175676, #4ba3c3);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const Form = styled.form`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  background: #F5F5F5;
  border: 2px solid #CCCCCC;
  padding: 12px;
  color: #8a8787;
  border-radius: 20px;
  box-shadow: rgba(207, 240, 255, 0.4) 0px 5px 10px -3px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;

  &::placeholder {
    color: #8a8787;
  }

  &:hover {
    border-color: #4BA3C3;
    box-shadow: rgba(75, 163, 195, 0.5) 0px 8px 12px -3px;
  }

  &:focus {
    outline: none;
    color: #8a8787;
    border-color: #4BA3C3;
    box-shadow: rgba(75, 163, 195, 0.7) 0px 10px 15px -3px;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: -5px;
  align-items: center;
  justify-content: center;

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
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", data);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");
      router.push("/dashboard");
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
      <Logo src="/HealthSentinel-Photoroom.png" alt="Logo" width={300} height={250} />
      <ContentWrapper>
        <FormContainer>
          <Title>Login</Title>
          {message && <ErrorMessage>{message}</ErrorMessage>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper>
              <Label htmlFor="email">Email</Label>
              <Input {...register("email", { required: "Email-ul este necesar" })} id="email" type="email" placeholder="Introdu email-ul tău" />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </InputWrapper>

            <InputWrapper>
              <Label htmlFor="password">Parola</Label>
              <Input {...register("password", { required: "Parola este necesară", minLength: 6 })} id="password" type="password" placeholder="Introdu parola" />
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </InputWrapper>

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
