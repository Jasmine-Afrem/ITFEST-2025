"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  background-color: #dbdbdb;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 99%;
  position: relative;
  border-radius: 20px;
  margin: 2.9rem 1rem 5rem;
`;

/* Date & Time - Top Left Corner */
const DateContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 16px;
  font-weight: 500;
  color: #175676;
  padding: 10px 15px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: rgba(23, 87, 118, 0.2) 3px 6px 12px;
`;

/* Profile Top Right */
const ProfileContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: rgba(23, 87, 118, 0.9);
  border-radius: 25px;
  box-shadow: rgba(23, 87, 118, 0.3) 0px 6px 12px, rgba(23, 87, 118, 0.2) 0px 3px 6px;
  color: white;
`;

/* Grid Wrapper */
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 30px;
  width: 100%;
  max-width: 1300px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    width: 80%;
  }
`;

/* Shared Box Style */
const InfoBox = styled.div`
  background-color: #ededed;
  padding: 20px;
  border-radius: 15px;
  box-shadow: rgba(23, 87, 118, 0.2) 3px 6px 12px;
  width: 100%;
  text-align: center;
`;

const InfoTitle = styled.h3`
  font-size: 20px;
  color: #175676;
  margin-bottom: 10px;
`;

const InfoItem = styled.p`
  font-size: 16px;
  color: #444;
  margin-bottom: 8px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
`;

/* Profile Section */
const ProfileSection = styled(InfoBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LargeProfileImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #175676;
`;

const ProfileDescription = styled.div`
  text-align: center;
  font-size: 18px;
  color: #175676;
  max-width: 450px;
  margin-top: 15px;
`;

/* Badges Section */
const BadgesSection = styled(InfoBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BadgeImage = styled.img`
  width: 50%;
  height: auto;
  object-fit: contain;
`;

/* Bottom Containers */
const BottomContainer = styled.div`
  position: absolute;
  bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #175676;
  padding: 15px;
  background-color: #ededed;
  border-radius: 15px;
  box-shadow: rgba(23, 87, 118, 0.2) 3px 6px 12px;
`;

const HospitalNameContainer = styled(BottomContainer)`
  left: 20px;
`;

const HospitalLocationContainer = styled(BottomContainer)`
  right: 20px;
`;

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState("");
  const recentActivity = [
    "Added a new patient - John Smith",
    "Updated medical records for Jane Doe",
    "Generated weekly patient report",
    "Scheduled an appointment for Dr. Adams",
    "Reviewed latest test results",
  ];
  const announcements = [
    "System maintenance scheduled for March 20, 2025.",
    "New hospital policies updated - Check internal portal.",
    "Fire drill scheduled for March 25, 2025.",
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContainer>
      {/* Date on Top Left */}
      <DateContainer>{currentTime}</DateContainer>

      {/* Profile info in the top-right corner */}
      <ProfileContainer>
        <img src="/def_picture.png" alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
        <div>
          <span style={{ fontSize: "18px", fontWeight: "bold" }}>John Doe</span>
          <br />
          <span style={{ fontSize: "14px", opacity: "0.9" }}>Administrator</span>
        </div>
      </ProfileContainer>

      {/* Grid Layout */}
      <GridWrapper>
        {/* Top Row: Profile & Badges */}
        <ProfileSection>
          <LargeProfileImage src="/def_picture.png" alt="Profile" />
          <ProfileDescription>
            This is a placeholder text about the user. You can add details about John Doe here.
          </ProfileDescription>
        </ProfileSection>

        <BadgesSection>
          <InfoTitle>Badges</InfoTitle>
          <BadgeImage src="/Employee-of-the-Month-Badge-Photoroom.png" alt="Employee of the Month" />
          <p>Employee of the Month</p>
        </BadgesSection>

        {/* Bottom Row: Logs & Announcements */}
        <InfoBox>
          <InfoTitle>User's Recent Activity</InfoTitle>
          {recentActivity.map((activity, index) => (
            <InfoItem key={index}>{activity}</InfoItem>
          ))}
        </InfoBox>

        <InfoBox>
          <InfoTitle>Hospital Announcements</InfoTitle>
          {announcements.map((announcement, index) => (
            <InfoItem key={index}>{announcement}</InfoItem>
          ))}
        </InfoBox>
      </GridWrapper>

      {/* Bottom Containers */}
      <HospitalNameContainer>🏥 Central Health Clinic</HospitalNameContainer>
      <HospitalLocationContainer>📍 1234 Medical Ave, New York, NY</HospitalLocationContainer>
    </DashboardContainer>
  );
}
