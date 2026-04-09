import { useEffect, useState } from "react";

const useMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setLoading(true);

      // 🔥 Get local bookings
      const localBookings = JSON.parse(
        localStorage.getItem("localBookings") || "[]"
      );

      setBookings(localBookings);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  return { bookings, loading, error };
};

export default useMyBookings;