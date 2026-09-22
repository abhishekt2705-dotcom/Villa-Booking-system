import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, Clock, XCircle, CheckCircle2, AlertCircle, ArrowRight, Ban } from 'lucide-react';
import Alert from '../components/Alert';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking #${bookingId}?`)) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setError('');
      setSuccess('');
      await api.put(`/bookings/${bookingId}/cancel`);
      setSuccess(`Booking #${bookingId} was successfully cancelled.`);
      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to cancel booking. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>CANCELLED</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center space-x-1 bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>COMPLETED</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">Review your upcoming and past villa stays</p>
        </div>
        <button
          onClick={() => navigate('/villas')}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-colors"
        >
          Book Another Villa
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-28"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-slate-500 text-sm">You haven't made any villa reservations yet.</p>
          </div>
          <button
            onClick={() => navigate('/villas')}
            className="inline-flex items-center space-x-2 bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:bg-sky-700"
          >
            <span>Explore Available Villas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Booking details */}
              <div className="flex items-start space-x-5">
                <img
                  src={
                    booking.villaImageUrl ||
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={booking.villaName}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-slate-100 hidden sm:block"
                />
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                      Booking #{booking.id}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{booking.villaName}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{booking.villaLocation}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {booking.checkIn} &rarr; {booking.checkOut} ({booking.nights} nights)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Price & Actions */}
              <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Total Paid / Due</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{booking.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>{cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
