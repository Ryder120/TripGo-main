import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import useMyBookings from "../hooks/useMyBooking";
import { toast } from "react-toastify";
import { User, Mail, Phone, CalendarCheck, IndianRupee } from "lucide-react";

const Profile = () => {
  const { user, setUser } = useContext(AppContext);
  const { bookings = [] } = useMyBookings();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const totalSpent = useMemo(
    () =>
      bookings.reduce(
        (sum, booking) => sum + Number(booking.totalPrice || 0),
        0
      ),
    [bookings]
  );

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill out required fields.");
      return;
    }

    const updatedUser = { ...user, name, email, phone };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 lg:px-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white">
      
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">

        {/* LEFT PROFILE SUMMARY */}
        <section className="lg:col-span-1 bg-white/90 dark:bg-slate-800 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full text-white">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {user?.name || "Traveler"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Personal Dashboard
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Manage your account details and view your booking history in one
            convenient place.
          </p>

          {/* STATS */}
          <div className="space-y-4">

            <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <CalendarCheck className="text-blue-600" />
                <span className="text-sm font-medium">Bookings</span>
              </div>
              <span className="text-xl font-bold">{bookings.length}</span>
            </div>

            <div className="flex items-center justify-between bg-green-50 dark:bg-slate-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <IndianRupee className="text-green-600" />
                <span className="text-sm font-medium">Total Spent</span>
              </div>
              <span className="text-xl font-bold">
                ₹{totalSpent.toLocaleString()}
              </span>
            </div>

          </div>
        </section>

        {/* PROFILE FORM */}
        <section className="lg:col-span-2 bg-white/90 dark:bg-slate-800 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">

          <h2 className="text-2xl font-bold mb-6">
            Profile Details
          </h2>

          <form onSubmit={handleSave} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-700 dark:border-slate-600"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-700 dark:border-slate-600"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Phone size={16} /> Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-700 dark:border-slate-600"
              />
            </div>

            {/* BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
              >
                Save Profile
              </button>
            </div>

          </form>
        </section>

      </div>
    </div>
  );
};

export default Profile;