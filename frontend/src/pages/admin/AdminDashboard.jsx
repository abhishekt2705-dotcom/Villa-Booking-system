import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Home, Users, CalendarCheck, CheckCircle, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVillas: 0,
    totalCustomers: 0,
    totalBookings: 0,
    confirmedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/bookings'),
      ]);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (err) {
      setError('Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Villas',
      value: stats.totalVillas,
      icon: <Home className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      link: '/admin/villas',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      link: '/admin/customers',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <CalendarCheck className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      link: '/admin/bookings',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      link: '/admin/bookings',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">System performance metrics and villa reservations</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/villas/add"
            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Villa</span>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`bg-white p-6 rounded-3xl border ${card.border} shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <p className="text-3xl font-black text-slate-900">
                {loading ? '...' : card.value}
              </p>
            </div>
            <div className={`p-4 ${card.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/villas"
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-300 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">Villa Management</h3>
            <ArrowRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 text-xs">Create, edit, toggle ACTIVE/INACTIVE status, or delete villas.</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">Booking Management</h3>
            <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 text-xs">Review all reservations and update status (CONFIRMED, CANCELLED, COMPLETED).</p>
        </Link>

        <Link
          to="/admin/customers"
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-lg">Customer Directory</h3>
            <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-slate-500 text-xs">View registered customers and their booking activity history.</p>
        </Link>
      </div>

      {/* Recent Bookings Table Preview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs font-bold text-sky-600 hover:underline">
            View All Bookings &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-slate-400 text-xs text-center py-6">No reservations found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Villa</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-800">#{b.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{b.customerName}</td>
                    <td className="px-4 py-3 text-slate-600">{b.villaName}</td>
                    <td className="px-4 py-3 text-slate-500">{b.checkIn} &rarr; {b.checkOut}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
