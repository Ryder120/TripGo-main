import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const fakeQR =
  "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TripGoPayment";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!booking) return <p className="p-10">No booking found</p>;

  const handlePayment = async () => {
    setProcessing(true);
    toast.info("Processing Payment...");

    setTimeout(async () => {
      const updatedBooking = {
        ...booking,
        paymentStatus: "paid",
        status: "confirmed",
        paymentDate: new Date().toISOString(),
      };

      try {
        // 🔥 GET USER FROM LOCAL STORAGE
        const user = JSON.parse(localStorage.getItem("user"));

        // ✅ SAFETY CHECK
        if (!user || !user._id) {
          toast.error("User not logged in properly");
          setProcessing(false);
          return;
        }

        // ✅ SEND CORRECT DATA TO BACKEND
        await axios.post("http://localhost:8000/api/bookings", {
  userId: "67f123abc456def789000000",

  name: "Rajeev",
  email: "test@gmail.com",
  phone: "9999999999",

  travelers: 2,

  tourId: "tour123",
  tourTitle: "Demo Trip",

  totalPrice: 5000,

  travelDate: new Date(),
});

        console.log("✅ Saved to backend");

      } catch (error) {
        console.error(
          "❌ Backend Error:",
          error.response?.data || error.message
        );
        toast.error("Backend save failed");
      }

      // ✅ ALWAYS SAVE LOCALLY
      const existing = JSON.parse(
        localStorage.getItem("localBookings") || "[]"
      );

      localStorage.setItem(
        "localBookings",
        JSON.stringify([updatedBooking, ...existing])
      );

      setSuccess(true);
      setProcessing(false);

      toast.success("Payment Successful!");

      // Redirect after delay
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    }, 4000); // ⏳ delay for real feel
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>

        <p className="mb-2 text-gray-600">
          Booking for:{" "}
          <span className="font-semibold">{booking.tourTitle}</span>
        </p>

        <p className="mb-4 text-lg font-bold text-green-600">
          Amount: ₹{booking.totalPrice}
        </p>

        {!success && (
          <>
            {/* QR Code */}
            <div className="mb-4">
              <p className="text-sm mb-2">Scan & Pay</p>
              <img
                src={fakeQR}
                alt="QR Code"
                className="mx-auto border p-2 rounded"
              />
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                processing
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {processing ? "Processing..." : "Pay Now"}
            </button>
          </>
        )}

        {/* Success UI */}
        {success && (
          <div className="mt-4">
            <h2 className="text-green-600 text-xl font-bold">
              Payment Successful ✅
            </h2>
            <p className="text-gray-600 mt-2">
              Redirecting to My Bookings...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;