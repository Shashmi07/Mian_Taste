import React from 'react';
import { Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#78D860] text-white px-6 py-6 w-full">
      <div className="max-w-[2500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">

        {/* Company Info */}
        <div className="max-w-md">
          <h2 className="text-lg md:text-xl font-semibold mb-1 text-[#FFFFFF]">Grand Minato</h2>
          <p className="text-sm">
            Smart Restaurant Management System that redefines your dining experience. Order,
            reserve, and enjoy the finest culinary delights.
          </p>
        </div>

        {/* Contact Info */}
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-2 text-[#FFFFFF]">Contact Info</h2>

          <div className="space-y-2">
            {/* Address */}
            <p className="text-sm flex items-center justify-center md:justify-start gap-2">
              <MapPin className="text-lg flex-shrink-0" />
              364/1, High Level Road, Kottawa, Sri Lanka
            </p>

            {/* Phone */}
            <p className="text-sm flex items-center justify-center md:justify-start gap-2">
              <Phone className="text-lg flex-shrink-0" />
              <a href="tel:+94769835152" className="hover:underline transition-all duration-200 hover:text-green-100">
                076 983 5152
              </a>
            </p>

            {/* Facebook */}
            <div className="text-sm flex items-center justify-center md:justify-start gap-2">
              <Facebook className="text-lg flex-shrink-0" />
              <a
                href="https://www.facebook.com/share/19WHKFtBRx/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-all duration-200 hover:scale-105 transform"
              >
                Follow us on Facebook
              </a>
            </div>

            {/* Email */}
            <p className="text-sm flex items-center justify-center md:justify-start gap-2">
              <Mail className="text-lg flex-shrink-0" />
              <a
                href="mailto:grandminatocafe@gmail.com"
                className="hover:underline transition-all duration-200 hover:text-green-100"
              >
                grandminatocafe@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-white/30 mt-6 pt-4 text-sm text-center">
        © {new Date().getFullYear()} Mian_Taste. All rights reserved. Built with ❤️ using MERN Stack.
      </div>
    </footer>
  );
};

export default Footer;