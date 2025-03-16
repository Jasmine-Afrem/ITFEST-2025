"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const SidebarContainer = styled(motion.div)`
  width: 270px;
  height: 80vh;
  background: rgba(23, 87, 118, 0.9);
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
  z-index: 2;

  @media (max-width: 768px) {
    width: 220px;
    left: 1vh;
    top: 5vh;
  }
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1.1;
  gap: 20px;
  margin-top: 30px;
`;

const SidebarItem = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  position: relative;
  width: 100%;

  a {
    color: inherit;
    text-decoration: none;
    width: 100%;
    text-align: center;
  }

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
      <Image
        src="/HealthSentinel-Photoroom.png"
        alt="HealthSentinel Logo"
        width={200}
        height={150}
        priority
      />

      <SidebarMenu>
        <Link href="/dashboard" legacyBehavior>
          <a>
            <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Dashboard
            </SidebarItem>
          </a>
        </Link>
        <Link href="/dashboard/patients" legacyBehavior>
          <a>
            <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Pacienti
            </SidebarItem>
          </a>
        </Link>
        <Link href="/dashboard/harta" legacyBehavior>
          <a>
            <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Saloane
            </SidebarItem>
          </a>
        </Link>
        <Link href="/logout" legacyBehavior>
          <a>
            <SidebarItem whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Logout
            </SidebarItem>
          </a>
        </Link>
      </SidebarMenu>
    </SidebarContainer>
  );
}
