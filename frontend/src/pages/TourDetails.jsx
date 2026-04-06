import React, { useState, useContext, useMemo, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, DollarSign, MapPin, Star, ChevronDown, X } from "lucide-react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import tourData from "../assets/data/tour.js";
import { AppContext } from "../context/AppContext";
import ReviewCard from "../components/ReviewCard";

const TourDetails = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const tour = tourData.find((tour) => tour.id === id);
  const calendarRef = useRef(null);

  const [selectedDate, setSelectedDate] = useState(tour?.availableDates?.[0] || new Date().toISOString().split("T")[0]);
  const [selectedImage, setSelectedImage] = useState(tour?.photo || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [reviews, setReviews] = useState(tour?.reviews || []);

  if (!tour) return <div className="text-center py-12">Tour not found</div>;

  const {
    photo,
    title,
    desc,
    price,
    city,
    distance,
    maxGroupSize,
    availableDates,
    duration,
    gallery = [],
  } = tour;

  // Convert available dates to Date objects for calendar validation
  const availableDateObjects = availableDates.map(date => new Date(date));

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isCalendarOpen]);

  const renderStars = (rating) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const reviewToAdd = {
      ...newReview,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [reviewToAdd, ...prev]);
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  const computedAvgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return (reviews.reduce((sum, item) => sum + Number(item.rating), 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const isDateAvailable = (date) => {
    return availableDateObjects.some(
      (availDate) =>
        availDate.getFullYear() === date.getFullYear() &&
        availDate.getMonth() === date.getMonth() &&
        availDate.getDate() === date.getDate()
    );
  };

  const handleCalendarDateChange = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date.toISOString().split("T")[0]);
      setIsCalendarOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white py-10 px-4 sm:px-8">
      <style>{`
        /* Compact Calendar Styling */
        .compact-calendar {
          width: 300px;
        }

        .react-calendar {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.8rem;
          font-family: inherit;
          padding: 0;
        }

        .react-calendar__navigation {
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.25rem;
        }

        .react-calendar__navigation button {
          font-size: 0.75rem;
          padding: 0.4rem 0.5rem;
          min-width: auto;
          cursor: pointer;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #1f2937;
          border-radius: 0.375rem;
          transition: all 0.2s;
          font-weight: 500;
        }

        .dark .react-calendar__navigation button {
          background: #374151;
          border-color: #475569;
          color: #e5e7eb;
        }

        .react-calendar__navigation button:hover:enabled {
          background: #e0e7ff;
          border-color: #3b82f6;
        }

        .dark .react-calendar__navigation button:hover:enabled {
          background: #1e293b;
          border-color: #0ea5e9;
        }

        .react-calendar__navigation__label {
          font-weight: 600;
          font-size: 0.875rem;
          flex: 1;
          text-align: center;
        }

        .react-calendar__month-view {
          width: 100%;
        }

        .react-calendar__month-view__weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .react-calendar__month-view__weekdays__weekday {
          font-weight: 600;
          font-size: 0.7rem;
          color: #6b7280;
          padding: 0.25rem 0;
          text-transform: uppercase;
        }

        .dark .react-calendar__month-view__weekdays__weekday {
          color: #9ca3af;
        }

        .react-calendar__month-view__days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        .react-calendar__tile {
          padding: 0.4rem !important;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.15s;
          color: #1f2937;
          font-weight: 500;
        }

        .dark .react-calendar__tile {
          background: #374151;
          border-color: #475569;
          color: #e5e7eb;
        }

        .react-calendar__tile:enabled:hover {
          background: linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);
          border: 1px solid #3b82f6;
          transform: scale(1.05);
        }

        .dark .react-calendar__tile:enabled:hover {
          background: linear-gradient(135deg, #1e293b 0%, #312e81 100%);
          border: 1px solid #0ea5e9;
        }

        .react-calendar__tile:disabled {
          background: #f3f4f6;
          color: #d1d5db;
          cursor: not-allowed;
          opacity: 0.4;
        }

        .dark .react-calendar__tile:disabled {
          background: #374151;
          color: #6b7280;
        }

        .react-calendar__tile--active {
          background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
          color: white;
          border: 1px solid transparent;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .react-calendar__tile--active:hover {
          background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
        }

        .react-calendar__tile--now {
          border: 2px solid #3b82f6;
          font-weight: bold;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Image */}
        <div className="relative h-96 md:h-[500px] overflow-hidden rounded-3xl shadow-lg">
          <img
            src={selectedImage || photo}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg">
              <span className="inline-flex items-center gap-1 bg-blue-600/80 px-3 py-1 rounded-full">{city}</span>
              <span className="inline-flex items-center gap-1 bg-indigo-600/80 px-3 py-1 rounded-full">{duration} days</span>
              <span className="inline-flex items-center gap-1 bg-purple-600/80 px-3 py-1 rounded-full">{maxGroupSize} max people</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[photo, ...gallery].slice(0, 6).map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={() => {
                setSelectedImage(img);
                setIsModalOpen(true);
              }}
              className="h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover transform hover:scale-110 transition" />
            </button>
          ))}
        </div>

        {/* Image Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-full p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              >
                <X size={24} />
              </button>
              <img src={selectedImage || photo} alt="preview" className="w-full rounded-xl object-contain max-h-96" />
            </div>
          </div>
        )}

        {/* Overview Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tour Info */}
          <div className="space-y-6">
            <div className="text-lg leading-relaxed text-gray-900 dark:text-gray-100">{desc}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                  <DollarSign size={20} className="text-blue-600" />
                  <span className="font-semibold">Price</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">${price.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                  <MapPin size={20} className="text-red-600" />
                  <span className="font-semibold">Distance</span>
                </div>
                <p className="text-xl">{distance} km away</p>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Calendar size={20} className="text-purple-600" />
                <span className="font-semibold">Select Tour Date</span>
              </div>

              {/* Date Input Field */}
              <div className="relative" ref={calendarRef}>
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full p-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex items-center justify-between hover:border-blue-500 dark:hover:border-blue-400 active:border-purple-500 transition cursor-pointer group"
                >
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    {formatDate(selectedDate)}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-300 group-hover:text-blue-600 ${isCalendarOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Calendar */}
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4 z-40 compact-calendar">
                    <ReactCalendar
                      onChange={handleCalendarDateChange}
                      value={new Date(selectedDate)}
                      minDate={new Date()}
                      tileDisabled={({ date }) => !isDateAvailable(date)}
                      maxDetail="month"
                      prevLabel="‹"
                      nextLabel="›"
                      prev2Label={null}
                      next2Label={null}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Average Rating</div>
              <div className="flex gap-1 mb-2">{renderStars(Math.round(computedAvgRating))}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-bold text-lg">{computedAvgRating}</span> / 5.0 ({reviews.length} reviews)
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/booking", { state: { tour, selectedDate } });
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Book This Tour
            </button>
          </div>

          {/* Reviews Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-slate-700 space-y-4 h-fit">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Customer Reviews</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{reviews.length} reviews • avg {computedAvgRating}</p>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="space-y-3 pb-4 border-b border-gray-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Your name"
                value={newReview.name}
                onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <textarea
                rows={3}
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                required
              />
              <div className="flex items-center justify-between gap-3">
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>{val} Stars</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
