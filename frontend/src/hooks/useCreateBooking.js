import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const useBooking = (tour, navigate) => {
  const { user } = useContext(AppContext);

  const { price = 0, availableDates = [] } = tour || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: 1,
    specialRequests: "",
    travelDate: availableDates[0] || "",
  });

  const [totalPrice, setTotalPrice] = useState(price);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        travelers: 1,
        specialRequests: "",
        travelDate: availableDates[0],
      });
    }
  }, [user]);

  useEffect(() => {
    setTotalPrice(price * formData.travelers);
  }, [formData.travelers, price]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATED FLOW
  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingData = {
      _id: Date.now().toString(),
      ...formData,
      tourTitle: tour.title,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    // 👉 NOT saving yet
    navigate("/payment", { state: { booking: bookingData } });
  };

  return {
    formData,
    totalPrice,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};

export default useBooking;