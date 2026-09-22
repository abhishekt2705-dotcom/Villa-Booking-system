import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Alert from '../../components/Alert';

const AddVillaPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    pricePerNight: '',
    maxGuests: '4',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim() || !formData.pricePerNight) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/admin/villas', {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxGuests: parseInt(formData.maxGuests, 10),
      });
      navigate('/admin/villas');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to add villa. Please verify inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <Link
        to="/admin/villas"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Villas</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Add New Villa</h1>
          <p className="text-slate-500 text-sm mt-1">Fill out the details to list a new villa</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Villa Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Villa Sunset Bay"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Goa, Alibaug, Manali"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Price Per Night (₹) *
              </label>
              <input
                type="number"
                name="pricePerNight"
                placeholder="5000"
                min="1"
                step="0.01"
                value={formData.pricePerNight}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Max Guests *
              </label>
              <input
                type="number"
                name="maxGuests"
                min="1"
                max="50"
                value={formData.maxGuests}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all font-medium"
              >
                <option value="ACTIVE">ACTIVE (Available for booking)</option>
                <option value="INACTIVE">INACTIVE (Hidden from booking)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the villa, rooms, pool, amenities, and surroundings..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <Link
              to="/admin/villas"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Villa</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVillaPage;
