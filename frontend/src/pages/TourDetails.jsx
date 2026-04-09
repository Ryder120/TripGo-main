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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white py-12 px-4 sm:px-8">

    <div className="max-w-7xl mx-auto space-y-10">

      {/* HERO SECTION */}
      <div className="relative h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-xl">
        <img
          src={selectedImage || photo}
          alt={title}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-8 left-8 text-white space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>

          <div className="flex flex-wrap gap-3 text-sm md:text-base">
            <span className="px-4 py-1 rounded-full bg-blue-600/80">
              {city}
            </span>

            <span className="px-4 py-1 rounded-full bg-indigo-600/80">
              {duration} Days
            </span>

            <span className="px-4 py-1 rounded-full bg-purple-600/80">
              Max {maxGroupSize} People
            </span>
          </div>
        </div>
      </div>


      {/* IMAGE GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[photo, ...gallery].slice(0, 6).map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedImage(img);
              setIsModalOpen(true);
            }}
            className="h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
          >
            <img
              src={img}
              alt="gallery"
              className="w-full h-full object-cover hover:scale-110 transition duration-300"
            />
          </button>
        ))}
      </div>


      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-10">

        {/* LEFT SECTION */}
        <div className="space-y-8">

          {/* DESCRIPTION */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-3">Tour Overview</h3>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {desc}
            </p>
          </div>


          {/* INFO CARDS */}
          <div className="grid sm:grid-cols-2 gap-6">

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 mb-2">
                <DollarSign className="text-blue-600" />
                <span className="font-semibold">Price</span>
              </div>

              <p className="text-3xl font-bold text-blue-600">
                ${price.toLocaleString()}
              </p>
            </div>


            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 hover:shadow-lg transition">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 mb-2">
                <MapPin className="text-red-500" />
                <span className="font-semibold">Distance</span>
              </div>

              <p className="text-xl font-medium">
                {distance} km away
              </p>
            </div>

          </div>


          {/* DATE SELECT */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">

            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-purple-600" />
              <span className="font-semibold text-lg">Select Tour Date</span>
            </div>

            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-full p-3 border rounded-lg flex items-center justify-between dark:bg-slate-700 hover:border-blue-500 transition"
              >
                <span>{formatDate(selectedDate)}</span>

                <ChevronDown
                  className={`transition ${isCalendarOpen ? "rotate-180" : ""}`}
                />
              </button>


              {isCalendarOpen && (
                <div className="absolute mt-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border z-50">
                  <ReactCalendar
                    onChange={handleCalendarDateChange}
                    value={new Date(selectedDate)}
                    minDate={new Date()}
                    tileDisabled={({ date }) => !isDateAvailable(date)}
                  />
                </div>
              )}
            </div>

          </div>


          {/* RATING */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">

            <p className="text-gray-500 mb-2">Average Rating</p>

            <div className="flex gap-1 mb-2">
              {renderStars(Math.round(computedAvgRating))}
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              <span className="text-xl font-bold">{computedAvgRating}</span> / 5
              ({reviews.length} reviews)
            </p>

          </div>


          {/* BOOK BUTTON */}
          <button
            onClick={() => {
              if (!user) navigate("/login");
              else navigate("/booking", { state: { tour, selectedDate } });
            }}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-xl transition"
          >
            Book This Tour
          </button>

        </div>



        {/* REVIEWS */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 space-y-6 h-fit">

          <div>
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            <p className="text-gray-500 text-sm">
              {reviews.length} reviews • avg {computedAvgRating}
            </p>
          </div>


          {/* REVIEW FORM */}
          <form
            onSubmit={handleAddReview}
            className="space-y-3 border-b pb-5"
          >
            <input
              type="text"
              placeholder="Your name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg dark:bg-slate-700"
              required
            />

            <textarea
              rows={3}
              placeholder="Write your review"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full p-2 border rounded-lg dark:bg-slate-700"
              required
            />

            <div className="flex justify-between items-center">

              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: Number(e.target.value),
                  })
                }
                className="border rounded-lg px-2 py-1 dark:bg-slate-700"
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v}>{v} Stars</option>
                ))}
              </select>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Submit
              </button>

            </div>

          </form>


          {/* REVIEW LIST */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">

            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}

          </div>

        </div>

      </div>
    </div>
  </div>
);
};

export default TourDetails;
