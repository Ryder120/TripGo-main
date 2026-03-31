import React from "react";
import { motion } from "framer-motion";
import TourCard from "../components/TourCard";
import tourData from "../assets/data/tour.js";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Tour = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [location, setLocation] = React.useState("all");
  const [priceRange, setPriceRange] = React.useState([0, 20000]);
  const [duration, setDuration] = React.useState("all");

  const locations = ["all", ...new Set(tourData.map((t) => t.city))];

  const filteredTours = tourData.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === "all" || tour.city === location;
    const matchesPrice =
      tour.price >= priceRange[0] && tour.price <= priceRange[1];
    const matchesDuration =
      duration === "all" ||
      (duration === "short" && tour.duration <= 3) ||
      (duration === "medium" && tour.duration > 3 && tour.duration <= 7) ||
      (duration === "long" && tour.duration > 7);

    return matchesSearch && matchesLocation && matchesPrice && matchesDuration;
  });

  const highRatingTours = tourData.filter((t) => t.avgRating >= 4.5).length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 md:px-10 lg:px-22 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <motion.div
        className="relative bg-cover bg-center bg-no-repeat h-64 sm:h-80 lg:h-96 mb-8 rounded-3xl overflow-hidden shadow-xl"
        style={{ backgroundImage: "url('/tour.jpg')" }}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Explore Tours
        </motion.h1>
      </motion.div>

      <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tours", value: tourData.length },
          { label: "Filtered Tours", value: filteredTours.length },
          { label: "High Rating", value: highRatingTours },
          { label: "Average Price", value: `₹${Math.round(tourData.reduce((a, b) => a + b.price, 0) / tourData.length).toLocaleString()}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/90 dark:bg-slate-800 rounded-xl p-4 shadow-soft border border-gray-200 dark:border-slate-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/90 dark:bg-slate-800 rounded-xl p-5 md:p-6 mb-8 border border-gray-200 dark:border-slate-700 shadow-soft">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search tours"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-300 dark:bg-slate-700"
          />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-300 dark:bg-slate-700"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "all" ? "All locations" : loc}
              </option>
            ))}
          </select>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-300 dark:bg-slate-700"
          >
            <option value="all">All durations</option>
            <option value="short">Short (1-3 days)</option>
            <option value="medium">Medium (4-7 days)</option>
            <option value="long">Long (8+ days)</option>
          </select>
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">Max price</label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full"
            />
            <span className="text-sm font-semibold">₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {filteredTours.map((tour, index) => (
          <motion.div
            key={tour.id}
            initial="hidden"
            animate="visible"
            variants={slideUp}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
          >
            <TourCard tour={tour} />
          </motion.div>
        ))}
      </motion.div>

      {filteredTours.length === 0 && (
        <div className="mt-8 text-center text-gray-500 dark:text-gray-300">
          No tours match the current filters. Change search terms or filters.
        </div>
      )}
    </div>
  );
};

export default Tour;
