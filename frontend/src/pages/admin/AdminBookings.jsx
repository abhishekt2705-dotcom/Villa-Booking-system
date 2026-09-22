import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, User, MapPin, CheckCircle, XCircle, Clock, Filter, AlertCircle } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setError('');
      setSuccess('');
      await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      setSuccess(`Booking #${bookingId} status updated to ${newStatus}.`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update booking status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === 'ALL' ? true : b.status === statusFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Booking Management</h1>
          <p className="text-slate-500 text-sm">View all reservations and update customer booking statuses</p>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-600">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No bookings found matching filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Villa</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-sky-600">
                      #{b.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{b.customerName}</p>
                        <p className="text-xs text-slate-400">{b.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{b.villaName}</span>
                      <span className="block text-xs text-slate-400">{b.villaLocation}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      <div className="space-y-0.5">
                        <span className="block">{b.checkIn} &rarr; {b.checkOut}</span>
                        <span className="text-slate-400">({b.nights} nights)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {b.status === 'CONFIRMED' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {b.status === 'CANCELLED' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {b.status === 'COMPLETED' && <Clock className="w-3 h-3 text-sky-600" />}
                        <span>{b.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {b.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                            disabled={updatingId === b.id}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                            disabled={updatingId === b.id}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            disabled={updatingId === b.id}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
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

export default AdminBookings;
