import { useEffect, useState } from "react";
import axios from "axios";

const useMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const apiBookings = res.data.bookings || [];
        const localBookings = JSON.parse(
          localStorage.getItem("localBookings") || "[]",
        );
        const mergedBookings = [
          ...apiBookings,
          ...localBookings.filter(
            (local) => !apiBookings.some((api) => api._id === local._id),
          ),
        ];

        setBookings(mergedBookings);
        setError("");
      } catch (err) {
        console.error("Error fetching bookings:", err);
        const localBookings = JSON.parse(
          localStorage.getItem("localBookings") || "[]",
        );
        setBookings(localBookings);
        setError("Failed to fetch bookings. Showing local data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};

export default useMyBookings;
