
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Invoice from "./Invoice"; // Adjust path if needed
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Download,
  Eye,
  Filter,
  Search,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import useMyBookings from "../hooks/useMyBooking";

const fakeQrData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0AQMAAAC369T4AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAFhJREFUKM99wTEBAAAAwqD1T20KP6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL8BD4AAAXJy+3gAAAAASUVORK5CYII=";

const MyBooking = () => {
  const navigate = useNavigate();
  const { bookings, loading, error } = useMyBookings();
  const [myBookings, setMyBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isPayingInModal, setIsPayingInModal] = useState(false);
  const [paymentSuccessInModal, setPaymentSuccessInModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const invoiceRef = useRef();


  useEffect(() => {
    const generatePdf = async (element) => {
      if (!element) return;

      // Wait briefly to ensure styles/fonts/images are loaded
      await new Promise((res) => setTimeout(res, 300));

      const opts = {
        scale: 2, // increase to improve quality (bigger file)
        useCORS: true,
        allowTaint: true,
        logging: false,
        // set window width/height for accurate rendering if needed
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
      };

      try {
        const canvas = await html2canvas(element, opts);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // add first page
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

        // If content is larger than one page, add extra pages using vertical offsets
        const pageHeight = pdf.internal.pageSize.getHeight();
        let remainingHeight = pdfHeight - pageHeight;

        while (remainingHeight > -0.1) {
          position -= pageHeight; // negative offset to shift image up
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          remainingHeight -= pageHeight;
        }

        // Save file 
        pdf.save(`invoice_${invoiceBooking?._id?.slice(-8) || Date.now()}.pdf`);
      } catch (err) {
        console.error("Failed to generate PDF:", err);
      } finally {
        // cleanup: remove the invoice from DOM
        setInvoiceBooking(null);
      }
    };

    // If invoiceBooking is set and invoiceRef is mounted, generate the PDF
    if (invoiceBooking && invoiceRef.current) {
      generatePdf(invoiceRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceBooking]);

  // Keep local state in sync with the fresh bookings from hook
  useEffect(() => {
    setMyBookings(bookings || []);
  }, [bookings]);

  const saveLocalBooking = (updatedBooking) => {
    const localBookings = JSON.parse(localStorage.getItem("localBookings") || "[]");
    const existingIdx = localBookings.findIndex((b) => b._id === updatedBooking._id);
    if (existingIdx !== -1) {
      localBookings[existingIdx] = { ...localBookings[existingIdx], ...updatedBooking };
    } else {
      localBookings.push(updatedBooking);
    }
    localStorage.setItem("localBookings", JSON.stringify(localBookings));
  };

  const handleSaveBookingEdit = (updatedData) => {
    setMyBookings((prev) =>
      prev.map((booking) =>
        booking._id === updatedData._id ? { ...booking, ...updatedData } : booking,
      ),
    );
    saveLocalBooking(updatedData);
    setEditingBooking(null);
    setEditFormData({});
    setIsPayingInModal(false);
    setPaymentSuccessInModal(false);
  };

  const handlePaymentInModal = () => {
    if (isPayingInModal || paymentSuccessInModal) return;

    setIsPayingInModal(true);
    toast.info("Processing payment...");

    setTimeout(() => {
      const updatedBooking = {
        ...editingBooking,
        paymentStatus: "paid",
        status: "confirmed",
        paymentDate: new Date().toISOString(),
      };

      saveLocalBooking(updatedBooking);
      setEditingBooking(updatedBooking);
      setPaymentSuccessInModal(true);
      setIsPayingInModal(false);
      toast.success("Payment Successful!");

      // Auto close modal after showing success message
      setTimeout(() => {
        handleSaveBookingEdit(updatedBooking);
      }, 1500);
    }, 2500);
  };

  // Trigger download by setting invoiceBooking; useEffect will pick it up
  const handleDownloadInvoice = (booking) => {
    setInvoiceBooking(booking);
  };

  // ---------- rest of your component ----------
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Confirmed",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          label: "Pending",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Cancelled",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          label: "Unknown",
        };
    }
  };

  const filteredBookings =
    myBookings?.filter((booking) => {
      const computedStatus =
        booking.paymentStatus === "paid"
          ? "confirmed"
          : booking.status?.toLowerCase() || "pending";
      const matchesSearch =
        booking.tourTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        computedStatus === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const LoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📅</div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        No bookings found
      </h3>
      <p className="text-gray-600 mb-6">
        {searchTerm || statusFilter !== "all"
          ? "Try adjusting your search or filters"
          : "You haven't made any bookings yet. Start exploring our tours!"}
      </p>
      {(searchTerm || statusFilter !== "all") && (
        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              Your Travel History
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bookings
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage all your travel bookings in one place
          </p>
        </div>

        {/* Search and Filter Section */}
        {bookings && bookings.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search bookings by tour name or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filteredBookings.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {bookings.length}
                </span>{" "}
                bookings
              </p>
            </div>
          </div>
        )}

        {/* Bookings Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          {!bookings || bookings.length === 0 ? (
            <EmptyState />
          ) : filteredBookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking, index) => {
                const computedStatus =
                  booking.paymentStatus === "paid"
                    ? "confirmed"
                    : booking.status?.toLowerCase() || "pending";
                const statusInfo = getStatusInfo(computedStatus);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={booking._id}
                    className="p-6 hover:bg-gray-50/50 transition-colors duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left Section - Tour Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {booking.tourTitle}
                            </h3>
                            <div className="flex items-center space-x-1 text-gray-500 text-sm">
                              <span>Booking ID:</span>
                              <span className="font-mono font-semibold text-blue-600">
                                #{booking._id.slice(-8).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}
                          >
                            <StatusIcon
                              size={16}
                              className={statusInfo.color}
                            />
                            <span
                              className={`text-sm font-semibold ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User size={16} className="text-gray-400" />
                            <div>
                              <div className="text-gray-500">Customer</div>
                              <div className="font-semibold text-gray-800">
                                {booking.name}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Users size={16} className="text-gray-400" />
                            <div>
                              <div className="text-gray-500">Travelers</div>
                              <div className="font-semibold text-gray-800">
                                {booking.travelers} people
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <CreditCard size={16} className="text-gray-400" />
                            <div>
                              <div className="text-gray-500">Total Price</div>
                              <div className="font-bold text-green-600">
                                ₹{booking.totalPrice?.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-gray-400" />
                            <div>
                              <div className="text-gray-500">Booked On</div>
                              <div className="font-semibold text-gray-800">
                                {new Date(booking.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mt-4 flex flex-wrap items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail size={14} />
                            <span>{booking.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone size={14} />
                            <span>{booking.phone}</span>
                          </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <div className="text-sm">
                              <span className="font-semibold text-blue-800">
                                Special Requests:{" "}
                              </span>
                              <span className="text-blue-700">
                                {booking.specialRequests}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-600">Payment:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {booking.paymentStatus ?? "pending"}
                          </span>
                        </div>                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <button
                          onClick={() => navigate("/invoice", { state: { booking } })}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                          <Eye size={16} />
                          <span>View Invoice</span>
                        </button>

                        <button
                          onClick={() => setEditingBooking(booking)}
                          className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 hover:border-yellow-300 text-yellow-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <span>Edit Booking</span>
                        </button>

                        <button
                          className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                          onClick={() => handleDownloadInvoice(booking)}
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Booking Modal */}
        {editingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {paymentSuccessInModal ? "✓ Payment Complete" : editingBooking.paymentStatus === "paid" ? "Edit Booking (Already Paid)" : "Edit Booking"}
                </h3>
                <button
                  onClick={() => {
                    setEditingBooking(null);
                    setEditFormData({});
                    setIsPayingInModal(false);
                    setPaymentSuccessInModal(false);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              {/* Show Success Message */}
              {paymentSuccessInModal && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Payment Successful!</p>
                    <p className="text-sm text-green-700">Status updated to Confirmed</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side - Edit Form */}
                <div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const updatedBooking = {
                        ...editingBooking,
                        travelers: Number(e.target.travelers.value),
                        travelDate: e.target.travelDate.value,
                        specialRequests: e.target.specialRequests.value,
                        paymentStatus: editingBooking.paymentStatus || "pending",
                        status:
                          (editingBooking.paymentStatus === "paid" ? "confirmed" : editingBooking.status?.toLowerCase()) || "pending",
                      };
                      handleSaveBookingEdit(updatedBooking);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tour Name</label>
                      <input
                        value={editingBooking.tourTitle}
                        disabled
                        className="w-full rounded-lg border px-4 py-2 bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Travel Date</label>
                      <input
                        name="travelDate"
                        type="date"
                        defaultValue={editingBooking.travelDate?.split("T")[0] || ""}
                        className="w-full rounded-lg border px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Travelers</label>
                      <input
                        name="travelers"
                        type="number"
                        min="1"
                        defaultValue={editingBooking.travelers || 1}
                        className="w-full rounded-lg border px-4 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                      <textarea
                        name="specialRequests"
                        defaultValue={editingBooking.specialRequests || ""}
                        className="w-full rounded-lg border px-4 py-2 h-20"
                        placeholder="Ask for seat preferences, meals, etc."
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBooking(null);
                          setEditFormData({});
                          setIsPayingInModal(false);
                          setPaymentSuccessInModal(false);
                        }}
                        className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={paymentSuccessInModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Side - Payment Section (if not paid) */}
                {editingBooking.paymentStatus !== "paid" && (
                  <div className="border-l-2 border-gray-200 pl-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 h-full">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">Payment</h4>

                      {/* Payment Details */}
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-green-600">₹{editingBooking.totalPrice?.toLocaleString() || 0}</p>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">Scan to Pay</p>
                          <img
                            src={fakeQrData}
                            alt="QR code"
                            className="w-32 h-32 rounded-lg border-2 border-gray-300 p-2 bg-white mx-auto"
                          />
                        </div>
                      </div>

                      {/* Pay Now Button */}
                      <button
                        onClick={handlePaymentInModal}
                        disabled={isPayingInModal || paymentSuccessInModal}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${paymentSuccessInModal
                            ? "bg-green-500 text-white cursor-default"
                            : isPayingInModal
                              ? "bg-blue-300 text-white cursor-wait"
                              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                          }`}
                      >
                        {isPayingInModal ? (
                          <>
                            Processing <Loader2 className="animate-spin" size={18} />
                          </>
                        ) : paymentSuccessInModal ? (
                          <>
                            <CheckCircle2 size={18} /> Paid
                          </>
                        ) : (
                          <>
                            <CreditCard size={18} /> Pay Now
                          </>
                        )}
                      </button>

                      {paymentSuccessInModal && (
                        <p className="text-center text-sm text-green-700 font-semibold mt-3">
                          Payment successful! Closing...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Show Status when Already Paid */}
                {editingBooking.paymentStatus === "paid" && (
                  <div className="border-l-2 border-gray-200 pl-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 h-full flex flex-col items-center justify-center">
                      <CheckCircle2 size={48} className="text-green-600 mb-2" />
                      <p className="text-lg font-bold text-green-800">Payment Completed</p>
                      <p className="text-sm text-green-700 text-center mt-2">
                        This booking has been paid and confirmed.
                      </p>
                      <div className="mt-4 p-3 bg-white rounded-lg w-full text-center">
                        <p className="text-xs text-gray-600">Amount Paid</p>
                        <p className="text-xl font-bold text-green-600">₹{editingBooking.totalPrice?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {bookings && bookings.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <div className="text-blue-100">Total Bookings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </div>
                <div className="text-blue-100">Confirmed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ₹
                  {bookings
                    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-blue-100">Total Spent</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden/off-screen Invoice for html2canvas */}
      {invoiceBooking && (
        <div
          // DO NOT use display:none — html2canvas won't render it.
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            // Set a fixed width matching your invoice layout for predictable PDF sizing
            width: 800,
            padding: 20,
            background: "white",
          }}
        >
          <div ref={invoiceRef}>
            <Invoice booking={invoiceBooking} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
