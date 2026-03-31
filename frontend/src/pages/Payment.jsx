import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

const fakeQrData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0AQMAAAC369T4AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAFhJREFUKM99wTEBAAAAwqD1T20KP6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL8BD4AAAXJy+3gAAAAASUVORK5CYII=";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(location.state?.booking || null);
    const [isPaying, setIsPaying] = useState(false);
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (!booking) {
            navigate("/tours", { replace: true });
        }
    }, [booking, navigate]);

    if (!booking) return null;

    const handlePayNow = () => {
        if (isPaying || paid) return;

        setIsPaying(true);
        toast.info("Processing payment...");

        setTimeout(() => {
            const updatedBooking = {
                ...booking,
                paymentStatus: "paid",
                status: "confirmed",
                paymentDate: new Date().toISOString(),
            };

            const localBookings = JSON.parse(localStorage.getItem("localBookings") || "[]");
            const replacedBookings = localBookings.map((b) =>
                b._id === updatedBooking._id ? updatedBooking : b
            );
            localStorage.setItem("localBookings", JSON.stringify(replacedBookings));

            setBooking(updatedBooking);
            setPaid(true);
            setIsPaying(false);

            toast.success("Payment Successful. Redirecting to invoice...");
            setTimeout(() => {
                navigate("/invoice", { state: { booking: updatedBooking } });
            }, 700);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-5">
                    Checkout Payment
                </h1>
                <p className="text-gray-600 dark:text-gray-200 mb-8">
                    Please review your booking details and complete payment.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Tour Name</p>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-white">{booking.tourTitle}</h2>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-300">User Name</p>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-white">{booking.name}</h2>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Booking Date</p>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-white">{new Date(booking.bookingDate).toLocaleDateString()}</h2>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Travel Date</p>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-white">{new Date(booking.travelDate).toLocaleDateString()}</h2>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Number of People</p>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-white">{booking.travelers}</h2>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-300">Total Amount</p>
                        <h2 className="font-semibold text-2xl text-teal-600 dark:text-teal-400">₹{booking.totalPrice.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 py-6 border-y border-gray-200 dark:border-slate-700">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Scan to pay</p>
                        <img src={fakeQrData} alt="QR code" className="mx-auto w-48 h-48 rounded-xl border p-2 bg-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-gray-500 text-sm dark:text-gray-300">Payment Total</p>
                        <h3 className="text-4xl font-bold text-gray-800 dark:text-white">₹{booking.totalPrice.toLocaleString()}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Secure checkout with QR payment simulation.</p>
                    </div>
                </div>

                <button
                    onClick={handlePayNow}
                    disabled={isPaying || paid}
                    className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${paid
                            ? "bg-green-500 text-white cursor-default"
                            : isPaying
                                ? "bg-blue-300 text-white cursor-wait"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                        }`}
                >
                    {isPaying ? (
                        <span className="flex items-center justify-center gap-2">
                            Processing <Loader2 className="animate-spin" size={18} />
                        </span>
                    ) : paid ? (
                        <span className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} /> Payment Successful
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <CreditCard size={18} /> Pay Now
                        </span>
                    )}
                </button>

                {paid && (
                    <div className="mt-4 text-center text-green-700 dark:text-green-300 font-semibold">
                        Payment completed! Redirecting to invoice...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payment;
