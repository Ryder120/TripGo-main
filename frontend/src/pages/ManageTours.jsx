import React, { useState } from "react";
import tourData from "../assets/data/tour";

const ManageTours = () => {
    const [search, setSearch] = useState("");

    const filteredTours = tourData.filter((tour) =>
        tour.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Manage Tours</h1>

                <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tours..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 dark:bg-slate-800 dark:border-slate-600"
                    />
                    <button className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">Add Tour</button>
                </div>

                <div className="overflow-x-auto rounded-xl shadow-soft border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800">
                    <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-blue-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">City</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Rating</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTours.map((tour) => (
                                <tr key={tour.id} className="border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50/40 dark:hover:bg-slate-700">
                                    <td className="px-4 py-3">{tour.id}</td>
                                    <td className="px-4 py-3">{tour.title}</td>
                                    <td className="px-4 py-3">{tour.city}</td>
                                    <td className="px-4 py-3">₹{tour.price.toLocaleString()}</td>
                                    <td className="px-4 py-3">{tour.avgRating}</td>
                                    <td className="px-4 py-3 space-x-2">
                                        <button className="px-3 py-1 rounded-lg bg-yellow-500 text-white">Edit</button>
                                        <button className="px-3 py-1 rounded-lg bg-red-500 text-white">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageTours;
