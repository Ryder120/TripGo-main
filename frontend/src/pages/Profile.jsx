import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import useMyBookings from "../hooks/useMyBooking";
import { toast } from "react-toastify";

const Profile = () => {
    const { user, setUser } = useContext(AppContext);
    const { bookings = [] } = useMyBookings();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    const totalSpent = useMemo(() =>
        bookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0),
        [bookings]
    );

    const handleSave = (e) => {
        e.preventDefault();
        if (!name || !email) {
            toast.error("Please fill out required fields.");
            return;
        }
        const updated = { ...user, name, email, phone };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        toast.success("Profile updated successfully!");
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
                <section className="lg:col-span-1 bg-white/90 dark:bg-slate-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.name || "Traveler"}</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage your profile and booking history from one optimized dashboard.</p>

                    <div className="mt-6 space-y-3">
                        <div className="rounded-lg bg-blue-50 dark:bg-slate-700 px-4 py-3">
                            <div className="text-sm text-blue-800 dark:text-blue-200">Bookings</div>
                            <div className="text-3xl font-bold">{bookings.length}</div>
                        </div>
                        <div className="rounded-lg bg-green-50 dark:bg-slate-700 px-4 py-3">
                            <div className="text-sm text-green-800 dark:text-green-200">Total Spent</div>
                            <div className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</div>
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-2 bg-white/90 dark:bg-slate-800 rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 dark:bg-slate-700"
                            />
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:scale-105 transition">Save Profile</button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Profile;
