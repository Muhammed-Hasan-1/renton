import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Feedback from "./components/Feedback";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        
        <Route path="/feedback" element={<Feedback/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;