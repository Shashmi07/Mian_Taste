import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Utensils } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer.jsx';

// Import images from assets
import noodles1 from '../assets/noodles1.jpg';
import noodles2 from '../assets/noodles2.jpg';
import noodles4 from '../assets/noodles4.jpg';
import Rice from '../assets/Rice.jpg';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-5">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Content - Left Column */}
            <div className="order-1 text-center lg:text-left">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your Go-To Spot<br />
                For <span className="text-red-600">Great Food</span> And<br />
                <span className="text-red-600">Good Times</span>
              </h1>
              
              <p className="max-w-lg mx-auto mb-8 text-lg text-gray-600 sm:text-xl lg:mx-0">
                Join Us for Delicious Meals and Memorable Moments!
              </p>
              
              {/* CTA buttons */}
              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <button 
                  onClick={() => window.location.href = '/menu'}
                  className="inline-flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-300 transform bg-red-600 rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl hover:-translate-y-1"
                >
                  <span>Order Now</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/table-reservation'}
                  className="inline-flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-red-600 transition-all duration-300 transform bg-white border-2 border-red-600 rounded-full hover:bg-red-600 hover:text-white hover:shadow-xl hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Reserve Table</span>
                </button>
              </div>
            </div>

            {/* Image Collage - Right Column */}
            <div className="order-2 lg:flex lg:justify-center">
              <div className="w-full max-w-lg">
                {/* Enhanced outer container */}
                <div className="relative p-6 bg-white border border-red-100 shadow-2xl rounded-3xl">
                  
                  {/* Floating elements for visual appeal */}
                  <div className="absolute w-8 h-8 rounded-full -top-2 -right-2 bg-gradient-to-br from-red-400 to-red-600 opacity-70 animate-pulse"></div>
                  <div className="absolute w-6 h-6 rounded-full -bottom-2 -left-2 bg-gradient-to-tr from-red-300 to-red-500 opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
                  
                  {/* Inner grid layout */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Top-left: noodles2 (taller, aspect ratio ~3:4) */}
                    <div className="relative row-span-2 group">
                      <div className="relative overflow-hidden shadow-lg rounded-2xl">
                        <img 
                          src={noodles2} 
                          alt="Authentic Japanese ramen bowl with rich tonkotsu broth, tender chashu pork, and fresh scallions"
                          className="object-cover w-full transition-all duration-500 h-80 group-hover:scale-110 group-hover:brightness-105"
                          width="240"
                          height="320"
                          loading="eager"
                        />
                        {/* Enhanced overlay */}
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:opacity-100"></div>
                        <div className="absolute w-4 h-4 transition-all duration-300 bg-yellow-400 rounded-full opacity-0 top-3 right-3 group-hover:opacity-100 animate-ping"></div>
                      </div>
                    </div>
                    
                    {/* Top-right: enhanced hover effects */}
                    <div className="relative group">
                      <div className="relative overflow-hidden shadow-lg rounded-xl">
                        <img 
                          src={noodles1} 
                          alt="Traditional miso ramen with corn, bamboo shoots, and perfectly seasoned broth"
                          className="object-cover w-full transition-all shadow-md duration-400 h-36 group-hover:scale-110 group-hover:brightness-110 sm:h-40"
                          width="240"
                          height="192"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-red-500/15 to-transparent group-hover:opacity-100"></div>
                        <div className="absolute w-3 h-3 transition-opacity duration-300 bg-red-400 rounded-full opacity-0 -top-1 -right-1 group-hover:opacity-100 animate-bounce"></div>
                      </div>
                    </div>
                    
                    {/* Bottom-right: enhanced effects */}
                    <div className="relative group">
                      <div className="relative overflow-hidden shadow-lg rounded-xl">
                        <img 
                          src={noodles4} 
                          alt="Spicy Korean-style ramen with perfect seasoning"
                          className="object-cover w-full h-32 transition-all shadow-md duration-400 group-hover:scale-110 group-hover:brightness-110 sm:h-36"
                          width="240"
                          height="144"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-bl from-red-500/15 to-transparent group-hover:opacity-100"></div>
                        <div className="absolute w-3 h-3 transition-opacity duration-300 bg-red-400 rounded-full opacity-0 -top-1 -left-1 group-hover:opacity-100 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom spanning image with enhanced styling */}
                  <div className="relative mt-4 group">
                    <div className="relative overflow-hidden shadow-lg rounded-2xl">
                      <img 
                        src={Rice} 
                        alt="Premium rice dishes showcasing authentic Asian flavors"
                        className="object-cover w-full transition-all duration-500 shadow-md h-28 group-hover:scale-105 group-hover:brightness-105 sm:h-32"
                        width="480"
                        height="128"
                        loading="lazy"
                        style={{ aspectRatio: '5/2' }}
                      />
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-700/10 group-hover:opacity-100 duration-400"></div>
                      
                      {/* Corner sparkles */}
                      <div className="absolute w-2 h-2 transition-opacity duration-300 bg-red-300 rounded-full opacity-0 top-2 left-2 group-hover:opacity-100 animate-pulse"></div>
                      <div className="absolute w-2 h-2 transition-opacity duration-300 bg-red-400 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute w-2 h-2 transition-opacity duration-300 bg-red-500 rounded-full opacity-0 bottom-2 left-2 group-hover:opacity-100 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      <div className="absolute w-2 h-2 transition-opacity duration-300 bg-red-600 rounded-full opacity-0 bottom-2 right-2 group-hover:opacity-100 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cross-Selling Offers Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Special <span className="text-red-600">Offers</span> Just for You!
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Don't miss out on these amazing deals and combo offers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Offer 1 - Ultimate Ramen Deal */}
            <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group">
              <div className="relative p-6 text-white bg-gradient-to-br from-red-500 to-red-700">
                <div className="absolute px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-full top-4 right-4">
                  SAVE 30%
                </div>
                <div className="mb-2 text-4xl">🍜🥢</div>
                <h3 className="mb-2 text-xl font-bold">Ultimate Ramen Combo</h3>
                <p className="text-orange-100">Authentic Japanese ramen experience</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">Rs.16.99</span>
                  <span className="text-gray-500 line-through">Rs.24.99</span>
                </div>
                <p className="mb-4 text-gray-600">Choice of Tonkotsu, Miso, or Shoyu ramen + gyoza + fresh juice</p>
                <button className="w-full py-3 font-semibold text-white transition-colors duration-300 transform bg-red-600 hover:bg-red-700 rounded-xl group-hover:scale-105">
                  Order Ramen Deal
                </button>
              </div>
            </div>

            {/* Offer 2 - Fresh Juice Trio */}
            <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group">
              <div className="relative p-6 text-white bg-gradient-to-br from-green-400 to-lime-500">
                <div className="absolute px-3 py-1 text-sm font-bold text-green-900 bg-yellow-500 rounded-full top-4 right-4">
                  FRESH DAILY
                </div>
                <div className="mb-2 text-4xl">🥤🍊🥭</div>
                <h3 className="mb-2 text-xl font-bold">Triple Juice Special</h3>
                <p className="text-green-100">Freshly squeezed goodness</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">Rs.12.99</span>
                  <span className="text-gray-500 line-through">Rs.18.99</span>
                </div>
                <p className="mb-4 text-gray-600">Orange + Mango + Green Apple juice (16oz each) - Perfect for sharing!</p>
                <button className="w-full py-3 font-semibold text-white transition-colors duration-300 transform bg-green-500 hover:green-600 rounded-xl group-hover:scale-105">
                  Order Juice Pack
                </button>
              </div>
            </div>

            {/* Offer 3 - Rice Bowl Feast */}
            <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group md:col-span-2 lg:col-span-1">
              <div className="relative p-6 text-white bg-gradient-to-br from-amber-400 to-orange-500">
                <div className="absolute px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-full top-4 right-4">
                  BEST VALUE
                </div>
                <div className="mb-2 text-4xl">🍚🥩🥬</div>
                <h3 className="mb-2 text-xl font-bold">Rice Bowl Feast</h3>
                <p className="text-amber-100">Complete meal satisfaction</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">Rs.14.99</span>
                  <span className="text-gray-500 line-through">Rs.21.99</span>
                </div>
                <p className="mb-4 text-gray-600">Teriyaki chicken rice bowl + miso soup + side salad + green tea</p>
                <button className="w-full py-3 font-semibold text-white transition-colors duration-300 transform bg-amber-500 hover:bg-amber-600 rounded-xl group-hover:scale-105">
                  Order Rice Bowl
                </button>
              </div>
            </div>
          </div>

          {/* Additional promotional banner */}
          <div className="relative p-8 mt-12 overflow-hidden text-center text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
            <div className="relative z-10">
              <h3 className="mb-4 text-2xl font-bold sm:text-3xl">🎉 Weekend Flash Sale! 🎉</h3>
              <p className="mb-6 text-lg opacity-90">Order 2 or more items and get FREE delivery + 10% off your entire order!</p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="px-8 py-3 font-bold text-orange-500 transition-colors bg-white rounded-full hover:bg-gray-100">
                  Order Now & Save
                </button>
                <span className="text-sm opacity-80">*Valid until Sunday midnight</span>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 bg-white rounded-full opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 bg-white rounded-full opacity-10"></div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}