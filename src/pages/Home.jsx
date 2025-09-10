import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Utensils } from 'lucide-react';

// If using src/assets imports, uncomment and use these:
// import noodles2 from '../assets/noodles2.jpg';
// import noodles3 from '../assets/noodles3.jpg';
// import noodles4 from '../assets/noodles4.jpg';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="px-4 py-12 mx-auto mt-10 max-w-7xl sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Content - Left Column */}
            <div className="order-1 text-center lg:text-left">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your Go-To Spot<br />
                For <span className="text-orange-500">Great Food</span> And<br />
                <span className="text-orange-500">Good Times</span>
              </h1>
              
              <p className="max-w-lg mx-auto mb-8 text-lg text-gray-600 sm:text-xl lg:mx-0">
                Join Us for Delicious Meals and Memorable Moments!
              </p>
              
              <button className="inline-flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-300 transform bg-orange-500 rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1">
                <span>Order Now</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Image Collage - Right Column */}
            <div className="order-2 lg:flex lg:justify-center">
              <div className="w-full max-w-lg">
                {/* Outer container with background, border, and shadow */}
                <div className="p-5 border-gray-300 shadow-xl border-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl">
                  {/* Inner grid layout */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Top-left: noodles2 (taller, aspect ratio ~3:4) */}
                    <div className="relative row-span-2">
                      <div className="relative overflow-hidden rounded-xl">
                        <img 
                          src="\src\assets\noodles2.jpg" 
                          alt="Authentic Japanese ramen bowl with rich tonkotsu broth, tender chashu pork, and fresh scallions"
                          className="object-cover w-full transition-transform duration-200 shadow-md h-80 hover:scale-105"
                          width="240"
                          height="320"
                          loading="eager"
                        />
                        {/* Subtle decorative overlay */}
                        <div className="absolute inset-0 opacity-6 bg-gradient-to-br from-orange-200 to-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Top-right: noodles3 (shorter, aspect ratio ~4:5) */}
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-xl">
                        <img 
                          src="\src\assets\noodles1.jpg" 
                          alt="Traditional miso ramen with corn, bamboo shoots, and perfectly seasoned broth"
                          className="object-cover w-full transition-transform duration-200 shadow-md h-36 hover:scale-105 sm:h-40"
                          width="240"
                          height="192"
                          loading="lazy"
                        />
                        {/* Subtle decorative overlay */}
                        <div className="absolute inset-0 opacity-7 bg-gradient-to-br from-amber-200 to-transparent"></div>
                      </div>
                    </div>
                    
                    {/* Bottom-right (will be pushed to next row, spanning full width visually) */}
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-xl">
                        <img 
                          src="\src\assets\noodles4.jpg" 
                          alt="noodle"
                          className="object-cover w-full h-32 transition-transform duration-200 shadow-md hover:scale-105 sm:h-36"
                          width="240"
                          height="144"
                          loading="lazy"
                        />
                        {/* Subtle decorative overlay */}
                        <div className="absolute inset-0 opacity-6 bg-gradient-to-br from-red-200 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom spanning image: noodles4 full width */}
                  <div className="relative mt-4">
                    <div className="relative overflow-hidden rounded-xl">
                      <img 
                        src="\src\assets\Rice.jpg" 
                        alt="Premium ramen selection showcasing our signature broths and artisanal toppings"
                        className="object-cover w-full transition-transform duration-200 shadow-md h-28 hover:scale-105 sm:h-32"
                        width="480"
                        height="128"
                        loading="lazy"
                        style={{ aspectRatio: '5/2' }}
                      />
                      {/* Subtle decorative overlay */}
                      <div className="absolute inset-0 opacity-8 bg-gradient-to-r from-purple-200 to-transparent"></div>
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
              Special <span className="text-orange-500">Offers</span> Just for You!
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Don't miss out on these amazing deals and combo offers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Offer 1 - Ultimate Ramen Deal */}
            <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl group">
              <div className="relative p-6 text-white bg-gradient-to-br from-orange-400 to-red-500">
                <div className="absolute px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-full top-4 right-4">
                  SAVE 30%
                </div>
                <div className="mb-2 text-4xl">🍜🥢</div>
                <h3 className="mb-2 text-xl font-bold">Ultimate Ramen Combo</h3>
                <p className="text-orange-100">Authentic Japanese ramen experience</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">Rs .16.99</span>
                  <span className="text-gray-500 line-through">Rs. 24.99</span>
                </div>
                <p className="mb-4 text-gray-600">Choice of Tonkotsu, Miso, or Shoyu ramen + gyoza + fresh juice</p>
                <button className="w-full py-3 font-semibold text-white transition-colors duration-300 transform bg-orange-500 hover:bg-orange-600 rounded-xl group-hover:scale-105">
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
                  <span className="text-2xl font-bold text-gray-900">Rs. 12.99</span>
                  <span className="text-gray-500 line-through">Rs. 18.99</span>
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
                  <span className="text-2xl font-bold text-gray-900">Rs. 14.99</span>
                  <span className="text-gray-500 line-through">Rs. 21.99</span>
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
    </div>
  );
}