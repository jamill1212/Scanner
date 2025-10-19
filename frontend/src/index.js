import React from "react";
import { useNavigate } from "react-router-dom";

const items = [
  { id: "dashboard", label: "Dashboard", to: "/" },
  { id: "dtc", label: "DTC", to: "/dtc" },
  { id: "live-data", label: "Live", to: "/live-data" },
  { id: "ecu", label: "ECU", to: "/ecu" },
  { id: "vehicle", label: "Vehicle", to: "/vehicle" },
];

export default function BottomNav({ currentPage, setCurrentPage }) {
  const navigate = useNavigate();

  function handleClick(item) {
    setCurrentPage(item.id);
    navigate(item.to);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
      <ul className="flex justify-around items-center p-2">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => handleClick(it)}
              className={`flex flex-col items-center text-sm px-3 py-1 rounded ${
                currentPage === it.id ? "text-blue-600" : "text-gray-600"
              }`}
              aria-current={currentPage === it.id ? "page" : undefined}
            >
              <span className="font-medium">{it.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import DTCScanner from "@/pages/DTCScanner";
import LiveData from "@/pages/LiveData";
import ECUProgramming from "@/pages/ECUProgramming";
import VehicleInfo from "@/pages/VehicleInfo";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="App min-h-screen pb-20">
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dtc" element={<DTCScanner />} />
          <Route path="/live-data" element={<LiveData />} />
          <Route path="/ecu" element={<ECUProgramming />} />
          <Route path="/vehicle" element={<VehicleInfo />} />
        </Routes>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </BrowserRouter>
    </div>
  );
}

export default App;
