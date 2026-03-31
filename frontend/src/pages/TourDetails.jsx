import React, { useState, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, DollarSign, MapPin, Users, Star } from "lucide-react";
import tourData from "../assets/data/tour.js";
import { AppContext } from "../context/AppContext";
import ReviewCard from "../components/ReviewCard";

const TourDetails = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const tour = tourData.find((tour) => tour.id === id);

  const [selectedDate, setSelectedDate] = useState(tour?.availableDates?.[0] || "");
  const [selectedImage, setSelectedImage] = useState(tour?.photo || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    avgRating,
    duration,
    gallery = [],
  } = tour;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-slate-900 dark:text-white py-10 px-4 sm:px-8">
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
              className="h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700"
            >
              <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover transform hover:scale-110 transition" />
            </button>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 bg-gray-100 dark:bg-slate-800 rounded-full p-2 text-gray-700 dark:text-gray-200"
              >
                Close
              </button>
              <img src={selectedImage || photo} alt="preview" className="w-full rounded-xl object-contain" />
            </div>
          </div>
        )}

        {/* Overview Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Tour Info */}
          <div className="space-y-6">
            <div className="text-lg leading-relaxed text-gray-900 dark:text-gray-100">{desc}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-soft border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                  <DollarSign size={20} />
                  <span className="font-semibold">Price</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">${price.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-soft border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                  <MapPin size={20} />
                  <span className="font-semibold">Distance</span>
                </div>
                <p className="text-xl">{distance} km away</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded-xl border dark:bg-slate-700 focus:ring-2 focus:ring-blue-400"
              >
                {availableDates.map((date, idx) => (
                  <option key={idx} value={date}>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
              <div className="p-3 rounded-xl border bg-white/80 dark:bg-slate-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                <div className="flex gap-1 mt-1">{renderStars(Math.round(computedAvgRating))}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Average {computedAvgRating}</div>
              </div>
            </div>

            <button
              onClick={() => {
                scrollTo(0, 0);
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/booking", { state: { tour } });
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Book This Tour
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-slate-700">
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Customer Reviews</h3>
              <p className="text-gray-500 dark:text-gray-300">{reviews.length} reviews • avg {computedAvgRating}</p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Your name"
                value={newReview.name}
                onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700"
              />
              <textarea
                rows={3}
                placeholder="Write your review"
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700"
              />
              <div className="flex items-center justify-between">
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  className="border rounded-lg px-3 py-2 dark:bg-slate-700"
                >
                  {[5, 4, 3, 2, 1].map((val) => (
                    <option key={val} value={val}>{val} Stars</option>
                  ))}
                </select>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">Submit Review</button>
              </div>
            </form>

            <div className="space-y-3">
              {reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
