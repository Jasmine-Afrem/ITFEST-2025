"use client";

import Sidebar from "./components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: "250px", padding: "20px" }}>
        {children} {/* This is where the page content changes */}
      </main>
    </div>
  );
}
