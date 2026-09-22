import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Users, ArrowRight, Search, Filter } from 'lucide-react';
import Alert from '../components/Alert';

const VillasPage = () => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const checkInParam = searchParams.get('checkIn') || '';
  const checkOutParam = searchParams.get('checkOut') || '';

  useEffect(() => {
    fetchVillas();
  }, []);

  const fetchVillas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/villas');
      setVillas(res.data);
    } catch (err) {
      setError('Failed to fetch villas. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const locations = ['ALL', ...new Set(villas.map((v) => v.location))];

  const filteredVillas = villas.filter((villa) => {
    const matchesSearch =
      villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      villa.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === 'ALL' || villa.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Villas</h1>
          <p className="text-slate-500 text-sm mt-1">Explore our exclusive luxury collection across scenic destinations</p>
        </div>

        {checkInParam && checkOutParam && (
          <div className="bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl text-xs font-medium text-sky-800 flex items-center space-x-2">
            <span>Selected Dates: <strong>{checkInParam}</strong> &rarr; <strong>{checkOutParam}</strong></span>
          </div>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by villa name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600">Location:</span>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'ALL' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Villas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4 animate-pulse">
              <div className="bg-slate-200 h-56 rounded-2xl"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredVillas.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-slate-500 font-medium">No villas found matching your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setLocationFilter('ALL');
            }}
            className="text-sky-600 font-bold text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVillas.map((villa) => (
            <div
              key={villa.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img
                  src={villa.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'}
                  alt={villa.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-sm font-extrabold text-slate-900 shadow-md">
                  ₹{villa.pricePerNight?.toLocaleString('en-IN')} <span className="text-xs text-slate-500 font-normal">/ night</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {villa.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 mt-2.5">
                    <span className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>{villa.location}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-sky-600" />
                      <span>{villa.maxGuests} Guests Max</span>
                    </span>
                  </div>
                  {villa.description && (
                    <p className="text-slate-600 text-xs mt-3 line-clamp-2 leading-relaxed">
                      {villa.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/villas/${villa.id}${
                        checkInParam && checkOutParam
                          ? `?checkIn=${checkInParam}&checkOut=${checkOutParam}`
                          : ''
                      }`
                    )
                  }
                  className="w-full bg-slate-900 hover:bg-sky-600 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VillasPage;
