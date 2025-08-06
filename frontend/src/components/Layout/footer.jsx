import React from 'react';
import { FaFacebook } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-[#78D860] text-white px-6 py-6 w-full">
      <div className="max-w-[2500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">

        {/* Company Info */}
        <div className="max-w-md">
          <h2 className="text-lg md:text-xl font-semibold mb-1 text-[#FFFFFF]">🍽️ Grand Minato</h2>
          <p className="text-sm">
            Smart Restaurant Management System that redefines your dining experience. Order,
            reserve, and enjoy the finest culinary delights.
          </p>
        </div>
        
        {/* Contact Info */}
        <div className="max-w-md">
         <h2 className="text-xl font-semibold mb-2 text-[#FFFFFF]">Contact Info</h2>

         <p className="text-sm">📍 364/1, High Level Road, Kottawa, Sri Lanka</p>

        {/* Clickable phone number */}
         <p className="text-sm">
            📞 <a href="tel:+94769835152" className="hover:underline">076 983 5152</a>
         </p>

        {/* Facebook link */}
        <p className="text-sm flex items-center justify-center md:justify-start gap-4">
            <a
            href="https://www.facebook.com/share/19WHKFtBRx/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
            >
            <FaFacebook className="text-[#1877F2] hover:text-blue-700 cursor-pointer" />
            <span>Facebook Page</span>
            </a>
        </p>

        {/* Clickable email */}
        <p className="text-sm">
            ✉️ <a href="mailto:grandminatocafe@gmail.com" className="hover:underline">grandminatocafe@gmail.com</a>
        </p>

        <p className="text-sm">🕒 Mon–Sun 11:00 AM – 11:00 PM</p>
        </div>
     </div>

        {/* Bottom Line */}
        <div className="border-t border-white/30 mt-6 pt-4 text-sm text-center">
            © {new Date().getFullYear()} Main_Taste. All rights reserved. Built with ❤️ using MERN Stack.
        </div>
    </footer>
  );
};

export default Footer;
