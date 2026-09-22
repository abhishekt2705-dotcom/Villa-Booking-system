import React from 'react';
import { Home, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
              <Home className="w-4 h-4" />
            </span>
            <span className="text-slate-900 font-bold">Villa<span className="text-sky-600">Book</span></span>
            <span className="text-slate-400 text-sm pl-2">| Full-Stack Villa Booking System</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <Link to="/villas" className="hover:text-sky-600 transition-colors">Villas</Link>
            <Link to="/login" className="hover:text-sky-600 transition-colors">Sign In</Link>
          </div>

          <div className="text-xs text-slate-400 flex items-center">
            Designed for Interview Machine Test &bull; &copy; {new Date().getFullYear()} VillaBook
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
