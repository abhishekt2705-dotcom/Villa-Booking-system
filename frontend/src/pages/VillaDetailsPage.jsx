import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, Calendar, CheckCircle2, XCircle, ShieldCheck, Sparkles, ArrowLeft, CreditCard } from 'lucide-react';
import Alert from '../components/Alert';

const VillaDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Date selection state
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  // Availability state
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null); // { available, message, nights, totalAmount, pricePerNight }

  // Booking state
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchVilla();
  }, [id]);

  const fetchVilla = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/villas/${id}`);
      setVilla(res.data);

      // If initial dates provided in query parameters, trigger availability check
      const qCheckIn = searchParams.get('checkIn');
      const qCheckOut = searchParams.get('checkOut');
      if (qCheckIn && qCheckOut) {
        checkBackendAvailability(qCheckIn, qCheckOut);
      }
    } catch (err) {
      setError('Failed to load villa details.');
    } finally {
      setLoading(false);
    }
  };

  const checkBackendAvailability = async (inDate = checkIn, outDate = checkOut) => {
    if (!inDate || !outDate) {
      setError('Please select both Check-in and Check-out dates');
      return;
    }

    if (outDate <= inDate) {
      setError('Check-out date must be strictly after Check-in date');
      setAvailabilityResult(null);
      return;
    }

    try {
      setCheckingAvailability(true);
      setError('');
      setAvailabilityResult(null);

      const res = await api.get(`/villas/${id}/availability`, {
        params: { checkIn: inDate, checkOut: outDate },
      });

      setAvailabilityResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error checking availability with the backend'
      );
      setAvailabilityResult(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    checkBackendAvailability();
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/villas/${id}?checkIn=${checkIn}&checkOut=${checkOut}` } } });
      return;
    }

    try {
      setBookingInProgress(true);
      setError('');

      const res = await api.post('/bookings', {
        villaId: villa.id,
        checkIn,
        checkOut,
      });

      setBookingSuccess(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Booking failed. The villa may no longer be available for these dates.'
      );
      // Re-verify availability
      checkBackendAvailability();
    } finally {
      setBookingInProgress(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!villa) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Villa Not Found</h2>
        <button
          onClick={() => navigate('/villas')}
          className="inline-flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Villas</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Villas</span>
      </button>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Success Modal / Banner */}
      {bookingSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-900">Booking Confirmed Successfully!</h2>
          <p className="text-emerald-700 max-w-md mx-auto text-sm">
            Your reservation for <strong>{villa.name}</strong> from <strong>{checkIn}</strong> to <strong>{checkOut}</strong> has been secured with Booking ID <strong>#{bookingSuccess.id}</strong>.
          </p>
          <div className="pt-2 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all"
            >
              View My Bookings
            </button>
            <button
              onClick={() => {
                setBookingSuccess(null);
                setAvailabilityResult(null);
              }}
              className="bg-white border border-emerald-300 text-emerald-800 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-50"
            >
              Book Another Stay
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Villa Media & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Villa Hero Image */}
          <div className="relative h-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-lg bg-slate-100">
            <img
              src={villa.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'}
              alt={villa.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-base font-extrabold text-slate-900 shadow-lg">
              ₹{villa.pricePerNight?.toLocaleString('en-IN')} <span className="text-xs text-slate-500 font-normal">/ night</span>
            </div>
          </div>

          {/* Villa Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-6">
              <h1 className="text-3xl font-extrabold text-slate-900">{villa.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 mt-3">
                <span className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>{villa.location}</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>Up to {villa.maxGuests} Guests</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <Sparkles className="w-4 h-4" />
                  <span>Verified Villa</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About this Villa</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {villa.description || 'Experience comfort, serenity, and luxury at this fully-serviced villa.'}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Type</span>
                <p className="text-xs font-bold text-slate-800">Private Luxury Estate</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Check-In</span>
                <p className="text-xs font-bold text-slate-800">2:00 PM onwards</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Check-Out</span>
                <p className="text-xs font-bold text-slate-800">11:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Availability & Booking Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-24">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Book Your Stay</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{villa.pricePerNight?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ night</span>
              </div>
            </div>

            {/* Date Selection Form */}
            <form onSubmit={handleCheckAvailability} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Check-in Date</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    setAvailabilityResult(null);
                    setError('');
                  }}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>Check-out Date</span>
                </label>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => {
                    setCheckOut(e.target.value);
                    setAvailabilityResult(null);
                    setError('');
                  }}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={checkingAvailability || !checkIn || !checkOut}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
              >
                {checkingAvailability ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Check Availability</span>
                  </>
                )}
              </button>
            </form>

            {/* Availability Result Status */}
            {availabilityResult && (
              <div className="space-y-4 pt-2">
                {availabilityResult.available ? (
                  <div className="space-y-4">
                    {/* Available banner */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Villa is available!</p>
                        <p className="text-xs text-emerald-700">Dates are open for instant booking.</p>
                      </div>
                    </div>

                    {/* Booking Summary Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                      <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                        Booking Summary
                      </h4>
                      <div className="flex justify-between text-slate-600">
                        <span>Villa:</span>
                        <strong className="text-slate-800">{villa.name}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Check-in:</span>
                        <strong className="text-slate-800">{checkIn}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Check-out:</span>
                        <strong className="text-slate-800">{checkOut}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Number of nights:</span>
                        <strong className="text-slate-800">{availabilityResult.nights}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Price per night:</span>
                        <strong className="text-slate-800">₹{villa.pricePerNight?.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-900">Total:</span>
                        <span className="font-extrabold text-lg text-sky-600">
                          ₹{availabilityResult.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Book Now / Confirm Booking Button */}
                    <button
                      onClick={handleConfirmBooking}
                      disabled={bookingInProgress}
                      className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center space-x-2 text-base"
                    >
                      {bookingInProgress ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Confirm Booking</span>
                        </>
                      )}
                    </button>
                    {!isAuthenticated && (
                      <p className="text-[11px] text-center text-slate-400">
                        You will be asked to sign in to confirm this booking.
                      </p>
                    )}
                  </div>
                ) : (
                  /* Unavailable banner */
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Villa is not available for the selected dates.</p>
                      <p className="text-xs text-rose-700 mt-1">
                        Another guest has already reserved this villa during this timeframe. Please try choosing different dates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Real-time backend date overlap protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillaDetailsPage;
