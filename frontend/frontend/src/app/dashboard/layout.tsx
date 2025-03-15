"use client";

import Sidebar from "./components/Sidebar";
import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
 
`;

const MainContent = styled.main`
  flex-grow: 0;
  padding: 20px;
  margin-left: 260px; /* Ensures content starts after sidebar */
  width: 100%;
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0; /* Sidebar collapses */
    padding: 10px;
  }
`;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}
