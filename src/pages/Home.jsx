import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Utensils } from 'lucide-react';

export default function GrandMinatoHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating food elements */}
          <div className="absolute w-8 h-8 bg-orange-200 rounded-full top-20 left-10 opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute w-6 h-6 bg-orange-300 rounded-full opacity-50 top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute w-10 h-10 bg-orange-100 rounded-full bottom-40 left-20 opacity-40 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute w-4 h-4 bg-red-200 rounded-full top-60 left-1/4 opacity-60 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        </div>

        <div className="px-4 py-12 mx-auto mt-10 max-w-7xl sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Mobile: Image first */}
            <div className="relative order-1 lg:order-2">
              <div className="relative max-w-md mx-auto lg:max-w-full">
                {/* Main food image placeholder */}
                <div className="relative p-8 shadow-2xl bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl">
                  <div className="relative flex items-center justify-center overflow-hidden aspect-square bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl">
                    {/* Noodle bowl illustration */}
                    
                  </div>
                  
                  {/* Additional floating elements around the main image */}
                  <div className="absolute flex items-center justify-center w-12 h-12 bg-orange-400 rounded-full shadow-lg -top-4 left-8 animate-bounce" style={{ animationDelay: '1.5s' }}>
                    <span className="text-xl text-white">🍤</span>
                  </div>
                  <div className="absolute flex items-center justify-center w-10 h-10 bg-red-400 rounded-full shadow-lg -bottom-6 right-12 animate-bounce" style={{ animationDelay: '2.5s' }}>
                    <span className="text-lg text-white">🧄</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-2 text-center lg:order-1 lg:text-left">
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
                  <span className="text-2xl font-bold text-gray-900">$16.99</span>
                  <span className="text-gray-500 line-through">$24.99</span>
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
                  <span className="text-2xl font-bold text-gray-900">$12.99</span>
                  <span className="text-gray-500 line-through">$18.99</span>
                </div>
                <p className="mb-4 text-gray-600">Orange + Mango + Green Apple juice (16oz each) - Perfect for sharing!</p>
                <button className="w-full py-3 font-semibold text-white transition-colors duration-300 transform bg-green-500 hover:bg-green-600 rounded-xl group-hover:scale-105">
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
                  <span className="text-2xl font-bold text-gray-900">$14.99</span>
                  <span className="text-gray-500 line-through">$21.99</span>
                </div>
                <p className="mb-4 text-gray-600">Teriyaki chicken rice bowl + miso soup + side salad + green tea</p>
                <button className="w-full py-3 font-semibold text-white transition-colors duration-300 transform bg-amber-500 hover:bg-amber-600 rounded-xl group-hover:scale-105">
                  Order Rice Bowl
                </button>
              </div>
            </div>
          </div>

          {/* Additional Ramen + Juice + Rice Combo */}
          <div className="mt-8">
            <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
              <div className="p-6 text-center text-white bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="mb-3 text-5xl">🍜🥤🍚</div>
                <h3 className="mb-2 text-2xl font-bold">Grand Minato Triple Threat</h3>
                <p className="text-purple-100">The ultimate combination - Ramen + Juice + Rice!</p>
              </div>
              <div className="p-6">
                <div className="grid items-center gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <h4 className="mb-2 font-semibold text-gray-900">What You Get:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Premium ramen of choice</li>
                      <li>• Fresh fruit juice (20oz)</li>
                      <li>• Chicken teriyaki rice bowl</li>
                      <li>• Miso soup & salad</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">$26.99</span>
                      <span className="block text-lg text-gray-500 line-through">$38.99</span>
                    </div>
                    <div className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                      Save $12.00!
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="w-full py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl hover:scale-105">
                      Order Triple Threat
                    </button>
                    <p className="mt-2 text-xs text-gray-500">Perfect for 1-2 people</p>
                  </div>
                </div>
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