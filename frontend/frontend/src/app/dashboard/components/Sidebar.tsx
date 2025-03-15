"use client";

import styled from "styled-components";
import Link from "next/link";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #1e3a8a;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: start;
  position: fixed;
  left: 0;
  top: 0;
`;

const SidebarItem = styled.div`
  padding: 15px;
  width: 100%;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
  &:hover {
    background: #3b82f6;
  }
`;

export default function Sidebar() {
  return (
    <SidebarContainer>
      <h2>HealthSentinel</h2>
      <Link href="/dashboard"><SidebarItem>Dashboard</SidebarItem></Link>
      <Link href="/dashboard/patients"><SidebarItem>Patients</SidebarItem></Link>
      <Link href="/settings"><SidebarItem>Settings</SidebarItem></Link>
      <Link href="/logout"><SidebarItem>Logout</SidebarItem></Link>
    </SidebarContainer>
  );
}
