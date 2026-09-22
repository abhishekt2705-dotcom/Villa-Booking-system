import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, Search, MapPin, Users, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import Alert from '../components/Alert';

const HomePage = () => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVillas();
  }, []);

  const fetchVillas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/villas');
      setVillas(res.data);
    } catch (err) {
      setError('Failed to load villas. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      if (checkOut <= checkIn) {
        setError('Check-out date must be after check-in date');
        return;
      }
      navigate(`/villas?checkIn=${checkIn}&checkOut=${checkOut}`);
    } else {
      navigate('/villas');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 backdrop-blur-md border border-sky-400/30 px-4 py-1.5 rounded-full text-xs font-semibold text-sky-200 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-sky-300 text-sky-300" />
            <span>Handpicked Luxury Stays</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Perfect Villa
          </h1>

          <p className="text-lg sm:text-xl text-sky-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            Experience handcrafted holiday villas with private pools, scenic views, and world-class comfort.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white text-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-left"
            >
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
                    setError('');
                  }}
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
                    setError('');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Villas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Villas Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Available Villas</h2>
            <p className="text-slate-500 text-sm mt-1">Discover top-rated villas ready for your next getaway</p>
          </div>
          <button
            onClick={() => navigate('/villas')}
            className="text-sky-600 hover:text-sky-700 font-semibold text-sm flex items-center space-x-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div className="bg-slate-200 h-48 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {villas.slice(0, 4).map((villa) => (
              <div
                key={villa.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={villa.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'}
                    alt={villa.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow">
                    ₹{villa.pricePerNight?.toLocaleString('en-IN')} <span className="text-[10px] text-slate-500 font-normal">/ night</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {villa.name}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-500" />
                        <span>{villa.location}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        <span>{villa.maxGuests} Guests</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/villas/${villa.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ''}`)}
                    className="w-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Instant Date Verification</h3>
            <p className="text-slate-600 text-sm">Real-time backend availability check preventing overlapping or double bookings.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-600/20">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Prime Locations</h3>
            <p className="text-slate-600 text-sm">Premium villas in Goa, Alibaug, Manali, Udaipur and scenic holiday spots.</p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-600/20">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Transparent Pricing</h3>
            <p className="text-slate-600 text-sm">Calculated per-night rates with zero hidden booking commissions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
