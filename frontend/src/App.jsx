import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PortalLayout, { RoleGuard } from "./components/PortalLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import AdminAddDoctor from "./pages/AdminAddDoctor";
import AdminDoctorList from "./pages/AdminDoctorList";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorProfile from "./pages/DoctorProfile";

function App() {
  const pageContainer = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8";
  return (
    <>
      <div className={pageContainer}>
        <Navbar />
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div className={pageContainer}>
              <Home />
            </div>
          }
        />
        <Route
          path="/doctors"
          element={
            <div className={pageContainer}>
              <Doctors />
            </div>
          }
        />
        <Route
          path="/doctors/:speciality"
          element={
            <div className={pageContainer}>
              <Doctors />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className={pageContainer}>
              <Login />
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className={pageContainer}>
              <About />
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className={pageContainer}>
              <Contact />
            </div>
          }
        />
        <Route
          path="/my-profile"
          element={
            <div className={pageContainer}>
              <MyProfile />
            </div>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <div className={pageContainer}>
              <MyAppointments />
            </div>
          }
        />
        <Route
          path="/appointment/:docId"
          element={
            <div className={pageContainer}>
              <Appointment />
            </div>
          }
        />
        <Route element={<RoleGuard role="admin" />}>
          <Route path="/admin" element={<PortalLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="doctors/new" element={<AdminAddDoctor />} />
            <Route path="doctors" element={<AdminDoctorList />} />
          </Route>
        </Route>
        <Route element={<RoleGuard role="doctor" />}>
          <Route path="/doctor" element={<PortalLayout role="doctor" />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>
        </Route>
      </Routes>
      <div className={pageContainer}>
        <Footer />
      </div>
    </>
  );
}

export default App;
