"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const SidebarContainer = styled(motion.div)`
  width: 260px;
  height: 80vh;
  background: rgba(23, 87, 118, 0.9); /* Glass effect */
  backdrop-filter: blur(10px);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 15px rgba(11, 57, 84, 0.5);
  position: fixed;
  left: 2vh;
  top: 6vh;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 220px;
    left: 1vh;
    top: 5vh;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1.1;
  gap: 20px; /* Reduce space between items */
  margin-top: 30px;
`;

const SidebarItem = styled(motion.a)`
  display: inline-block;
  padding: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  position: relative;
  justify-content: center;
  align-items: center;

  &::after {
    content: "";
    display: block;
    width: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.8);
    transition: width 0.3s ease-in-out;
    position: absolute;
    left: 50%;
    bottom: -3px;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 100%;
  }
`;


export default function Sidebar() {
  return (
    <SidebarContainer
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <LogoContainer>
        <Image src="/HealthSentinel-Photoroom.png" alt="HealthSentinel Logo" width={300} height={250} />
      </LogoContainer>

      <SidebarMenu>
        <Link href="/dashboard" passHref>
          <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Dashboard
          </SidebarItem>
        </Link>
        <Link href="/dashboard/patients" passHref>
          <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Pacienti
          </SidebarItem>
        </Link>
        <Link href="/dashboard/harta" passHref>
          <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Saloane
          </SidebarItem>
        </Link>
        <Link href="/settings" passHref>
          <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Setari
          </SidebarItem>
        </Link>
        <Link href="/logout" passHref>
          <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Logout
          </SidebarItem>
        </Link>
      </SidebarMenu>
    </SidebarContainer>
  );
}
