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
import MyEquipment from "./pages/MyEquipment";
import AddEquipment from "./pages/AddEquipment";
import EditEquipment from "./pages/EditEquipment";
import OwnerRentalRequests from "./pages/OwnerRentalRequests";
import Profile from "./pages/Profile";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />

        <Route path="/equipment" element={<Equipment />} />

        <Route
          path="/equipment/:id"
          element={<EquipmentDetails />}
        />

        <Route path="/categories" element={<Categories />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/feedback" element={<Feedback />} />

        <Route path="/signin" element={<SignIn />} />

        <Route path="/signup" element={<SignUp />} />

        {/* User pages */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/booking" element={<Booking />} />

        <Route
          path="/rental-history"
          element={<RentalHistory />}
        />

        <Route
          path="/equipment/:id/rent"
          element={<RentEquipment />}
        />

        {/* Owner pages */}
        <Route
          path="/my-equipment"
          element={<MyEquipment />}
        />

        <Route
          path="/add-equipment"
          element={<AddEquipment />}
        />

        <Route
          path="/my-equipment/:id/edit"
          element={<EditEquipment />}
        />

        <Route
          path="/rental-requests"
          element={<OwnerRentalRequests />}
        />

        {/* Existing pages */}
        <Route path="/inventory" element={<Inventory />} />

        <Route
          path="/maintenance"
          element={<Maintenance />}
        />

        <Route path="/privacy" element={<Privacy />} />

        <Route path="/terms" element={<Terms />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;