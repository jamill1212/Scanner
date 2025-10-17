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
