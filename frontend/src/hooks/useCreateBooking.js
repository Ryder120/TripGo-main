import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const useBooking = (tour, navigate) => {
  const { user } = useContext(AppContext);

  const { title = "", price = 0, availableDates = [] } = tour || {};

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
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const newTotal = price * parseInt(formData.travelers || 1, 10);
    setTotalPrice(newTotal);
  }, [formData.travelers, price]);

  useEffect(() => {
    if (tour?.availableDates && tour.availableDates.length > 0) {
      setFormData((prev) => ({
        ...prev,
        travelDate: prev.travelDate || tour.availableDates[0],
      }));
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, email, phone, travelDate, travelers } = formData;

    if (!name || !email || !phone || !travelDate) {
      toast.error("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    const bookingDraft = {
      _id: `local_${Date.now()}`,
      tourId: tour.id,
      tourTitle: tour.title,
      tourPrice: price,
      name,
      email,
      phone,
      travelers: Number(travelers),
      specialRequests: formData.specialRequests,
      travelDate,
      totalPrice,
      status: "confirmed",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      bookingDate: new Date().toISOString(),
    };

    const localBookings = JSON.parse(
      localStorage.getItem("localBookings") || "[]",
    );
    localStorage.setItem(
      "localBookings",
      JSON.stringify([bookingDraft, ...localBookings]),
    );

    toast.info("Booking pending payment. Redirecting to payment...");

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/payment", {
        state: {
          booking: bookingDraft,
        },
      });
    }, 500);
  };

  return {
    formData,
    totalPrice,
    isSubmitting,
    title,
    handleChange,
    handleSubmit,
  };
};

export default useBooking;
