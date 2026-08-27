import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Feedback from "./components/Feedback";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Equipment from "./pages/Equipment";
import Categories from "./pages/Categories";
import EquipmentDetails from "./pages/EquipmentDetails";

import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Inventory from "./pages/Inventory";
import RentalHistory from "./pages/RentalHistory";
import Maintenance from "./pages/Maintenance";

import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import RentEquipment from "./pages/RentEquipment";

import ScrollToTop from "./components/ScrollToTop";

import MyEquipment from "./pages/MyEquipment";

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <Routes>
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/" element={<Landing />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-equipment" element={<MyEquipment />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/rental-history" element={<RentalHistory />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/equipment/:id/rent" element={<RentEquipment />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
