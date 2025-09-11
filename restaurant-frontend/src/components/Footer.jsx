import React from 'react';
import { Facebook, Mail, MapPin, Phone, Clock, Instagram, Twitter, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-red-500" />
              <h2 className="text-2xl font-bold text-white">Mian Taste</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Authentic Asian cuisine meets modern dining experience. From traditional ramen to fusion delights, every dish tells a story of culinary excellence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/19WHKFtBRx/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/menu" className="block text-gray-400 hover:text-white transition-colors">
                Menu
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/preorder" className="block text-gray-400 hover:text-white transition-colors">
                Pre-Order
              </Link>
              <Link to="/table-reservation" className="block text-gray-400 hover:text-white transition-colors">
                Reservations
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  364/1, High Level Road<br />
                  Kottawa, Sri Lanka
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <a
                  href="tel:+94769835152"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  076 983 5152
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <a
                  href="mailto:grandminatocafe@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  grandminatocafe@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Monday - Sunday</p>
                  <p className="text-white font-medium">09:00 AM - 8:30 PM</p>
                </div>
              </div>
            </div>
           
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Mian Taste. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors underline bg-transparent border-none p-0 cursor-pointer"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors underline bg-transparent border-none p-0 cursor-pointer"
                aria-label="Terms of Service"
              >
                Terms of Service
              </button>
             
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;