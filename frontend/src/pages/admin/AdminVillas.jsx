import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { PlusCircle, Edit3, Trash2, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import Alert from '../../components/Alert';

const AdminVillas = () => {
  const [villas, setVillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVillas();
  }, []);

  const fetchVillas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/villas');
      setVillas(res.data);
    } catch (err) {
      setError('Failed to fetch villas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVilla = async (villaId, villaName) => {
    if (!window.confirm(`Are you sure you want to delete "${villaName}" (ID #${villaId})?`)) {
      return;
    }

    try {
      setDeletingId(villaId);
      setError('');
      setSuccess('');
      await api.delete(`/admin/villas/${villaId}`);
      setSuccess(`Villa "${villaName}" was deleted successfully.`);
      setVillas((prev) => prev.filter((v) => v.id !== villaId));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to delete villa. Please ensure there are no active dependencies.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Villa Management</h1>
          <p className="text-slate-500 text-sm">Add, edit, manage status, and configure villa properties</p>
        </div>
        <Link
          to="/admin/villas/add"
          className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Villa</span>
        </Link>
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
        ) : villas.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-500 font-medium">No villas found in the database.</p>
            <Link
              to="/admin/villas/add"
              className="inline-flex items-center space-x-2 bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Villa</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Villa</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Price / Night</th>
                  <th className="px-6 py-4">Max Guests</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {villas.map((villa) => (
                  <tr key={villa.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={villa.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=200&q=80'}
                          alt={villa.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="text-xs text-slate-400 font-mono">#{villa.id}</span>
                          <h4 className="font-bold text-slate-900">{villa.name}</h4>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{villa.location}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{villa.pricePerNight?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{villa.maxGuests} Guests</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {villa.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                          <XCircle className="w-3 h-3 text-slate-500" />
                          <span>INACTIVE</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/admin/villas/edit/${villa.id}`)}
                          className="p-2 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 rounded-lg transition-colors"
                          title="Edit Villa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVilla(villa.id, villa.name)}
                          disabled={deletingId === villa.id}
                          className="p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg transition-colors"
                          title="Delete Villa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

export default AdminVillas;
