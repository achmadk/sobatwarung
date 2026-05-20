import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Join from "./pages/Join";
import RegisterHub from "./pages/RegisterHub";
import RegisterMember from "./pages/RegisterMember";
import RegisterReseller from "./pages/RegisterReseller";
import RegisterSupplier from "./pages/RegisterSupplier";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bergabung" element={<Join />} />
            <Route path="/daftar-hub" element={<RegisterHub />} />
            <Route path="/daftar-member" element={<RegisterMember />} />
            <Route path="/daftar-reseller" element={<RegisterReseller />} />
            <Route path="/daftar-pemasok" element={<RegisterSupplier />} />
            <Route path="/cara-kerja" element={<HowItWorks />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
