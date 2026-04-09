import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import Tour from "./pages/Tour";
import TourDetails from "./pages/TourDetails";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTours from "./pages/ManageTours";
import ManageBookings from "./pages/ManageBookings";
import ManageUsers from "./pages/ManageUsers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Booking from "./pages/Booking";
import Invoice from "./pages/Invoice";
import Payment from "./pages/Payment";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import MyBooking from "./pages/MyBooking";


const App = () => {
  return (
    <div className="flex flex-col min-h-screen px-4 sm:px-8 md:px-10 lg:px-22 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white">
      <ToastContainer theme="dark" position="bottom-right" autoClose={1000} />
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tour />} />
          <Route path="/about" element={<About />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/my-booking" element={<MyBooking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tours" element={<ManageTours />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
