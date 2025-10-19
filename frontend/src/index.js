import { useState } from "react";                       import "@/App.css";             import {BrowserRouter,       "react-router-dom";           import Dashboard from       "@/pages/Dashboard";      import DTCScanner from  "@/pages/DTCScanner";          import LiveData from ""@/pages/LiveData";
import ECUProgramming from   "@/pages/ECUProgramming";     import VehicleInfo from "@/pages/VehicleInfo";       import BottomNav from  "@/components/BottomNav";     import { Toaster } from "@/components/ui/sonner";      

function App() {
  const [currentPage,          setCurrentPage] =             
useState("dashboard");        

  return (                     
    <div className="App     
min-h-screen pb-20">           
       <Toaster richColors
position="top-center" />      
       <BrowseRouter> 
         <Routes>   
           <Route path="/" 
element={<Dashboard />} />
           <Route path="/dtc"
element={<DTCScanner />} />
           <Route.      
path="/Live-data"       
element={<LiveData />} /> 
           <Route path="/ecu"
element={<ECUProgramming /   >} />         
           <Route
path="/live-date"        
element={<LiveData />} />  
           <Route path=>} />
element={<ECUProgramming / 
>} />     
           <Route
path="/vehicle"    
element={<VehicleInfo />} /> 
           </Route>    
           <BottomNav 
CurrentPage={currentPage}   
setCurrentPage={s 
etCurrentPage} /
>
      </BrowserRouter>       
    </div>              
  );              
}    

export default App;         