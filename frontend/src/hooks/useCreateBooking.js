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

    // Validation: name (letters and spaces only), email (gmail only), phone (10 digits)
    const nameValid = /^[A-Za-z\s]+$/.test(formData.name.trim());
    if (!nameValid) {
      toast.error("Name must contain only letters and spaces.");
      return;
    }

    const gmailValid = /^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(formData.email.trim());
    if (!gmailValid) {
      toast.error("Please use a valid Gmail address (example@gmail.com).");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    const phoneValid = /^\d{10}$/.test(phoneDigits);
    if (!phoneValid) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Get current user to attach userId and email
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    const bookingData = {
      _id: Date.now().toString(),
      ...formData,
      tourTitle: tour.title,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      userId: currentUser?._id || null,
      userEmail: currentUser?.email || formData.email,
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