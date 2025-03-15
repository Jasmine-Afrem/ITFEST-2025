"use client";

import styled from "styled-components";

const DashboardContainer = styled.div`
  background-color: #ffffff;
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export default function DashboardPage() {
  return (
    <DashboardContainer>
      <h1>Welcome to the Dashboard</h1>
      <p>Select a tab from the Sidebar</p>
    </DashboardContainer>
  );
}
