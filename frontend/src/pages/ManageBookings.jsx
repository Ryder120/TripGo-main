import React, { useMemo, useState } from "react";
import useMyBookings from "../hooks/useMyBooking";

const ManageBookings = () => {
    const { bookings = [], loading, error } = useMyBookings();
    const [search, setSearch] = useState("");

    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) =>
            [booking.tourTitle, booking.name, booking.status]
                .join(" ")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [bookings, search]);

    if (loading) return <div className="min-h-screen p-8">Loading bookings...</div>;
    if (error) return <div className="min-h-screen p-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Manage Bookings</h1>

                <div className="mb-6">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by tour, customer, or status"
                        className="w-full sm:w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-600"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl shadow-soft border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800">
                    <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-blue-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100">
                            <tr>
                                <th className="px-4 py-3">Booking ID</th>
                                <th className="px-4 py-3">Tour</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6" colSpan="5">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50/40 dark:hover:bg-slate-700">
                                        <td className="px-4 py-3 break-all">{booking._id}</td>
                                        <td className="px-4 py-3">{booking.tourTitle}</td>
                                        <td className="px-4 py-3">{booking.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : booking.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">₹{booking.totalPrice?.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBookings;
