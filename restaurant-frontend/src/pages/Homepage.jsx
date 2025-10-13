import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// Import images from assets
import noodles1 from '../assets/noodles1.jpg';
import noodles2 from '../assets/noodles2.jpg';
import noodles4 from '../assets/noodles4.jpg';
import Rice from '../assets/Rice.jpg';
import ramen from '../assets/ramen.jpg';
import food from '../assets/food.jpg';
import chefCooking from '../assets/chefCooking.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  // Clear QR data when user arrives at homepage without QR parameters (Option B)
  useEffect(() => {
    const qrParam = searchParams.get('qr');
    const tableParam = searchParams.get('table');

    // If user arrived without QR parameters, clear any old QR data
    if (!qrParam && !tableParam) {
      const hasQRData = localStorage.getItem('qrTableNumber');
      if (hasQRData) {
        console.log('Homepage: No QR params detected - clearing old QR data');
        localStorage.removeItem('qrTableNumber');
        console.log('✅ Old QR data cleared from homepage');
      }
    }
  }, [searchParams]);

  // Define 3 real combo offers based on actual menu items
  const combos = [
    {
      id: 1,
      name: "Ultimate Ramen Combo",
      description: "Buldak Chicken Ramen + Chicken Soup + Sprite",
      items: [
        { id: "68a69fe228e35b54d0874eb9", name: "Buldak Chicken Ramen", price: 1200, image: "buldakChicken.jpg", category: "Ramen" },
        { id: "68a69fe228e35b54d0874ec9", name: "Chicken Soup", price: 400, image: "chickenSoup.jpg", category: "Soup" },
        { id: "68a69fe228e35b54d0874ecf", name: "Sprite", price: 120, image: "sprite.jpeg", category: "Drinks" }
      ],
      originalPrice: 1720,
      offerPrice: 1400,
      savings: 320,
      emoji: "🍜🥢",
      color: "from-red-500 to-red-700",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
    {
      id: 2,
      name: "Rice Bowl Feast",
      description: "Beef Fried Rice + Beef Soup + Orange Juice",
      items: [
        { id: "68a69fe228e35b54d0874ec7", name: "Beef Fried Rice", price: 1500, image: "beefRice.jpg", category: "Rice" },
        { id: "68a69fe228e35b54d0874ecc", name: "Beef Soup", price: 600, image: "beefSoup.jpg", category: "Soup" },
        { id: "68a69fe228e35b54d0874ed0", name: "Orange Juice", price: 2000, image: "orangeJuice.jpg", category: "Drinks" }
      ],
      originalPrice: 4100,
      offerPrice: 3500,
      savings: 600,
      emoji: "🍚🥩",
      color: "from-amber-400 to-orange-500",
      buttonColor: "bg-amber-500 hover:bg-amber-600"
    },
    {
      id: 3,
      name: "Deluxe Pork Special",
      description: "Cheese Pork Ramen + Pork Fried Rice + Ginger Beer",
      items: [
        { id: "68a69fe228e35b54d0874ec0", name: "Cheese Pork Ramen", price: 1350, image: "cheesePork.jpg", category: "Ramen" },
        { id: "68a69fe228e35b54d0874ec6", name: "Pork Fried Rice", price: 1300, image: "porkRice.jpg", category: "Rice" },
        { id: "68a69fe228e35b54d0874ece", name: "Ginger Beer", price: 350, image: "gingerBeer.png", category: "Drinks" }
      ],
      originalPrice: 3000,
      offerPrice: 2500,
      savings: 500,
      emoji: "🥘🍖",
      color: "from-green-400 to-lime-500",
      buttonColor: "bg-green-500 hover:bg-green-600"
    }
  ];

  const handleOrderCombo = (combo) => {
    // Add all items in the combo to cart
    combo.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        description: `Part of ${combo.name}`
      });
    });

    // Show success message
    alert(`✅ ${combo.name} added to cart!\n\n${combo.items.length} items added successfully.`);

    // Navigate to cart
    navigate('/cart');
  };

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

      {/* Cross-Selling Offers Section - Enhanced */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-red-50 to-orange-50">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header with enhanced styling */}
          <div className="mb-16 text-center">
            <div className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-red-600 bg-red-100 rounded-full animate-bounce">
              🎉 Limited Time Offers
            </div>
            <h2 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Combo Deals</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Save big with our exclusive combo offers! Perfectly paired meals for the best value.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-16 h-1 bg-red-600 rounded-full"></span>
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            </div>
          </div>

          {/* Enhanced combo cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {combos.map((combo, idx) => (
              <div
                key={combo.id}
                className={`relative overflow-hidden transition-all duration-500 transform bg-white shadow-2xl rounded-3xl hover:shadow-3xl hover:-translate-y-3 group ${combo.id === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                style={{animationDelay: `${idx * 0.2}s`}}
              >
                {/* Sparkle effect on hover */}
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/50 via-transparent to-transparent group-hover:opacity-100 pointer-events-none"></div>

                {/* Header section with gradient */}
                <div className={`relative p-8 text-white bg-gradient-to-br ${combo.color} overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-32 h-32 bg-white rounded-full -top-10 -right-10 animate-pulse"></div>
                    <div className="absolute w-24 h-24 bg-white rounded-full -bottom-8 -left-8 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>

                  {/* Savings badge */}
                  <div className="absolute px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg top-4 right-4 animate-bounce">
                    💰 SAVE Rs.{combo.savings}
                  </div>

                  {/* Emoji with animation */}
                  <div className="relative mb-3 text-6xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                    {combo.emoji}
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-2xl font-extrabold drop-shadow-lg">{combo.name}</h3>
                  <p className="text-sm font-medium text-white/90">{combo.description}</p>

                  {/* Decorative wave */}
                  <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 fill-white">
                      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-8">
                  {/* Price section with enhanced styling */}
                  <div className="flex items-center justify-between p-4 mb-6 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Special Price</p>
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                        Rs.{combo.offerPrice}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Was</p>
                      <span className="text-xl font-bold text-gray-400 line-through">Rs.{combo.originalPrice}</span>
                    </div>
                  </div>

                  {/* Items list with icons */}
                  <div className="mb-6">
                    <p className="flex items-center mb-3 text-sm font-bold text-gray-700">
                      <span className="mr-2">📦</span> This Combo Includes:
                    </p>
                    <ul className="space-y-2">
                      {combo.items.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="mr-2 text-green-500">✓</span>
                          <span className="font-medium">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enhanced button with ripple effect */}
                  <button
                    onClick={() => handleOrderCombo(combo)}
                    className={`relative w-full py-4 font-bold text-white transition-all duration-300 transform ${combo.buttonColor} rounded-2xl shadow-lg hover:shadow-2xl group-hover:scale-105 overflow-hidden`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>🛒 Order Now</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    {/* Ripple effect background */}
                    <div className="absolute inset-0 transition-transform duration-300 transform scale-0 bg-white/20 rounded-2xl group-hover:scale-100"></div>
                  </button>

                  {/* Trending indicator for first combo */}
                  {combo.id === 1 && (
                    <div className="flex items-center justify-center gap-1 mt-4 text-xs font-semibold text-orange-600">
                      <span>🔥</span>
                      <span>Most Popular Choice!</span>
                      <span>🔥</span>
                    </div>
                  )}
                </div>

                {/* Corner badge for best value */}
                {combo.id === 2 && (
                  <div className="absolute top-0 left-0">
                    <div className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-br-2xl rounded-tl-3xl shadow-lg">
                      ⭐ BEST VALUE
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Weekend Flash Sale Banner - Compact Version */}
          <div className="relative mt-12 overflow-hidden shadow-xl bg-gradient-to-br from-red-600 via-orange-600 to-red-700 rounded-2xl">
            {/* Background overlay pattern */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

            <div className="relative grid gap-4 p-6 lg:grid-cols-2 lg:gap-6 lg:p-8">
              {/* Left side - Content */}
              <div className="relative z-10 flex flex-col justify-center space-y-3 text-white">
                {/* Animated badge */}
                <div className="inline-flex items-center self-start gap-1 px-3 py-1 text-xs font-bold bg-yellow-400 rounded-full shadow-md text-gray-900 animate-pulse">
                  <span>⭐ WEEKEND SPECIAL</span>
                </div>

                {/* Main heading - Smaller */}
                <div>
                  <h3 className="mb-2 text-2xl font-extrabold leading-tight sm:text-3xl drop-shadow-lg">
                    🎉 Flash Sale!
                  </h3>
                  <p className="text-lg font-bold text-yellow-300 sm:text-xl drop-shadow-md">
                    Up to 25% OFF
                  </p>
                </div>

                {/* Offer details - Compact */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚚</span>
                    <p className="font-medium">FREE Delivery over Rs.2000</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎁</span>
                    <p className="font-medium">Extra 10% OFF on 2+ items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <p className="font-medium">Valid until Sunday!</p>
                  </div>
                </div>

                {/* CTA Button - Smaller */}
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                  <button
                    onClick={() => navigate('/menu')}
                    className="relative px-6 py-3 text-base font-bold text-red-600 transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:scale-105 group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Order Now</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                  <div className="text-xs text-yellow-200">
                    ⚡ Limited time
                  </div>
                </div>
              </div>

              {/* Right side - Food Images Collage */}
              <div className="relative hidden lg:block">
                <div className="relative h-full">
                  {/* Main large image */}
                  <div className="absolute inset-0 z-10 transition-transform duration-500 transform group hover:scale-105">
                    <div className="relative h-full overflow-hidden shadow-2xl rounded-3xl">
                      <img
                        src={ramen}
                        alt="Delicious ramen bowl"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      {/* Floating price tag */}
                      <div className="absolute px-4 py-2 text-lg font-bold text-white bg-red-600 shadow-lg bottom-4 left-4 rounded-xl">
                        Starting from Rs.850
                      </div>
                    </div>
                  </div>

                  {/* Small image top right */}
                  <div className="absolute z-20 transition-all duration-500 transform top-4 -right-4 hover:scale-110 hover:rotate-3">
                    <div className="w-32 h-32 overflow-hidden bg-white border-4 border-white shadow-2xl rounded-2xl">
                      <img
                        src={food}
                        alt="Tasty food"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Animated ping badge */}
                    <div className="absolute flex items-center justify-center w-10 h-10 -top-2 -right-2">
                      <span className="absolute inline-flex w-full h-full bg-yellow-400 rounded-full opacity-75 animate-ping"></span>
                      <span className="relative inline-flex items-center justify-center w-10 h-10 text-xs font-bold bg-yellow-400 rounded-full">
                        HOT
                      </span>
                    </div>
                  </div>

                  {/* Small image bottom left */}
                  <div className="absolute z-20 transition-all duration-500 transform bottom-4 -left-4 hover:scale-110 hover:-rotate-3">
                    <div className="w-40 h-32 overflow-hidden bg-white border-4 border-white shadow-2xl rounded-2xl">
                      <img
                        src={chefCooking}
                        alt="Chef cooking"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Badge */}
                    <div className="absolute px-3 py-1 text-xs font-bold text-white bg-green-500 shadow-lg -bottom-2 -right-2 rounded-xl">
                      Fresh Daily 🌱
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute w-24 h-24 bg-yellow-400 rounded-full -top-8 -left-8 opacity-20 blur-2xl animate-pulse"></div>
                  <div className="absolute w-32 h-32 bg-orange-400 rounded-full -bottom-12 -right-12 opacity-20 blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
              </div>

              {/* Mobile images (visible on smaller screens) */}
              <div className="grid grid-cols-3 gap-4 lg:hidden">
                <div className="relative overflow-hidden shadow-xl rounded-2xl aspect-square">
                  <img src={ramen} alt="Ramen" className="object-cover w-full h-full" />
                </div>
                <div className="relative overflow-hidden shadow-xl rounded-2xl aspect-square">
                  <img src={food} alt="Food" className="object-cover w-full h-full" />
                </div>
                <div className="relative overflow-hidden shadow-xl rounded-2xl aspect-square">
                  <img src={chefCooking} alt="Chef" className="object-cover w-full h-full" />
                </div>
              </div>
            </div>

            {/* Bottom decorative wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-8">
                <path d="M0,50 Q300,80 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}