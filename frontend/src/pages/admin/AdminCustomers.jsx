import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, Mail, CalendarCheck } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/customers');
      setCustomers(res.data);
    } catch (err) {
      setError('Failed to load registered customers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Customer Management</h1>
        <p className="text-slate-500 text-sm">Directory of registered customers and their booking activity</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No registered customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4 text-right">Total Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                      #{c.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center space-x-1.5 bg-sky-50 text-sky-700 font-extrabold text-xs px-3 py-1 rounded-full border border-sky-200">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{c.bookingsCount} {c.bookingsCount === 1 ? 'Booking' : 'Bookings'}</span>
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

export default AdminCustomers;
