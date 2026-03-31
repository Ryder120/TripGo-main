import React from "react";
import { Link } from "react-router-dom";
import tourData from "../assets/data/tour";
import useMyBookings from "../hooks/useMyBooking";

const AdminHome = () => {
    const { bookings = [], loading } = useMyBookings();
    const totalUsers = 568;
    const totalTours = tourData.length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="animate-pulse text-center p-8 rounded-xl bg-white/80 shadow-xl">
                    <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                    <div className="h-6 w-64 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-28 bg-gray-200 rounded" />
                </div>
            </div>
        );

    return (
        <div className="min-h-screen py-6 px-4 sm:px-8 lg:px-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white transition-colors">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Total Tours", value: totalTours, highlight: "bg-blue-500" },
                        { label: "Total Bookings", value: totalBookings, highlight: "bg-green-500" },
                        { label: "Total Users", value: totalUsers, highlight: "bg-purple-500" },
                        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, highlight: "bg-indigo-500" },
                    ].map((stat) => (
                        <div key={stat.label} className={`p-5 rounded-2xl shadow-soft border border-white/30 ${stat.highlight} text-white`}>
                            <p className="text-sm uppercase opacity-80">{stat.label}</p>
                            <p className="text-3xl font-bold mt-3">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Link to="/admin/tours" className="p-5 bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold">Manage Tours</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">View, edit, and feature tours easily.</p>
                    </Link>
                    <Link to="/admin/bookings" className="p-5 bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold">Manage Bookings</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Approve, cancel, and monitor bookings.</p>
                    </Link>
                    <Link to="/admin/users" className="p-5 bg-white/90 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
                        <h3 className="text-xl font-semibold">Manage Users</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Review active users and permissions.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
