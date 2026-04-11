import { useEffect, useState } from "react";
import axios from "axios";

const useMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const currentUser = JSON.parse(localStorage.getItem("user") || "null");

        let allBookings = [];

        // Try to fetch from backend if token exists
        if (token && currentUser?._id) {
          const base =
            import.meta.env.VITE_BACKEND_URL ||
            import.meta.env.VITE_API_URL ||
            "http://localhost:4000";

          try {
            const res = await axios.get(`${base}/api/bookings`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data && res.data.success && res.data.bookings) {
              allBookings = res.data.bookings;
            }
          } catch (err) {
            console.warn(
              "Failed to fetch bookings from server:",
              err.message
            );
          }
        }

        // Also get local bookings
        const localBookings = JSON.parse(
          localStorage.getItem("localBookings") || "[]"
        );

        // Combine server and local bookings
        const combined = [...allBookings, ...localBookings];

        if (combined.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }

        // Filter by current user
        if (currentUser && (currentUser._id || currentUser.email)) {
          const filtered = combined.filter((b) => {
            // Match by userId first
            if (b.userId && currentUser._id) {
              return String(b.userId) === String(currentUser._id);
            }
            // Match by userEmail or email
            const bookingEmail = b.userEmail || b.email;
            if (bookingEmail && currentUser.email) {
              return bookingEmail === currentUser.email;
            }
            return false;
          });

          setBookings(filtered);
        } else {
          // No user logged in - don't show any bookings
          setBookings([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};

export default useMyBookings;