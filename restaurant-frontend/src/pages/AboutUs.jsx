import React from 'react';
import { MapPin, Phone, Mail, Clock, Star, Users, Award, Heart, ChefHat, Utensils } from 'lucide-react';
import NavBar from '../components/NavBar';
import ramenImg from '../assets/RamenNoodles.jpg';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section - Much More Prominent */}
      <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 pt-24 pb-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <span 
              className="inline-block px-8 py-4 rounded-full text-lg font-bold mb-8 shadow-2xl border-2 border-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#15803d' }}
            >
              ✨ Authentic Korean-Japanese Fusion Experience
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl">
            About <span className="text-yellow-300 drop-shadow-lg">Mian Taste</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/95 max-w-5xl mx-auto leading-relaxed mb-12 font-medium drop-shadow-lg">
            Where traditional Japanese techniques meet Korean flavors in the heart of Kottawa
          </p>

          {/* Stats - Much Larger and More Prominent */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { number: "5+", label: "Years Experience" },
              { number: "100%", label: "Fresh Daily" },
              { number: "1", label: "Japan-Trained Chef" },
              { number: "2", label: "Cuisine Styles" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-yellow-300/30 hover:transform hover:scale-110 hover:-translate-y-2">
                <div className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-lg font-bold text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Enhanced Visibility */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Content - Larger & Bolder */}
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Our Culinary <span className="text-green-600">Journey</span>
              </h2>
              
              <div className="space-y-8">
                <p className="text-2xl text-gray-800 leading-relaxed font-medium">
                  At Mian Taste, we believe that great food tells a story. Our story began with a passion 
                  for authentic Asian cuisine and a dream to bring the perfect fusion of Korean boldness 
                  and Japanese precision to Sri Lanka.
                </p>
                
                <p className="text-2xl text-gray-800 leading-relaxed font-medium">
                  Our head chef trained extensively in Japan, mastering the delicate art of ramen making 
                  and traditional Japanese cooking techniques. Combined with the vibrant, bold flavors of 
                  Korean cuisine, we create dishes that honor both traditions while offering something 
                  uniquely special.
                </p>
                
                <div 
                  className="border-l-8 bg-gradient-to-r from-white to-green-50 p-8 rounded-r-2xl shadow-2xl border-4 border-r-4 border-t-4 border-b-4"
                  style={{ borderLeftColor: '#78D860', borderRightColor: '#e5e7eb', borderTopColor: '#e5e7eb', borderBottomColor: '#e5e7eb' }}
                >
                  <p className="text-2xl font-bold text-gray-900 italic leading-relaxed mb-4">
                    "Every bowl we serve is crafted with the same care and precision you'd find in 
                    the best ramen shops of Tokyo, infused with Korean flavors that excite the palate."
                  </p>
                  <p className="text-lg text-green-700 font-black">- Head Chef, Mian Taste</p>
                </div>
              </div>
            </div>

            {/* Ramen Bowl Image - Much Larger */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-3xl overflow-hidden transform hover:scale-105 transition-transform duration-500 border-4 border-green-200">
                <div className="relative">
                  {/* Ramen Image */}
                  <div className="aspect-square rounded-3xl overflow-hidden mb-8 shadow-2xl">
                    <img
                      src={ramenImg}
                      alt="Authentic Ramen Bowl - Mian Taste Signature"
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Image Caption */}
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-gray-900 mb-4">Our Signature Ramen</h3>
                    <p className="text-xl text-gray-700 mb-6 font-bold">Authentic Japanese-Korean Fusion</p>
                    
                    <div className="flex justify-center mb-6">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400 drop-shadow-lg mx-1" />
                      ))}
                    </div>
                    
                    <div 
                      className="bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-6 border-4 shadow-inner border-green-300"
                    >
                      <p className="text-lg font-black text-green-800">
                        🍜 Hand-pulled noodles in rich, 12-hour simmered broth with Korean spices
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div 
                    className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
                    style={{ backgroundColor: '#78D860' }}
                  >
                    <span className="text-white text-3xl">🍜</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Much More Prominent */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              What Makes Us <span className="text-green-600">Special</span>
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Experience the perfect blend of tradition, quality, and innovation in every dish
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="group text-center hover:transform hover:scale-110 transition-all duration-500 bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-green-100">
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:shadow-2xl transition-all duration-500 border-4 border-green-200"
                style={{ backgroundColor: '#78D860' }}
              >
                <Utensils className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-green-700 transition-colors">Authentic Fusion</h3>
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Masterful blend of Korean and Japanese culinary traditions, creating unique flavors 
                that honor both cultures while offering something completely new.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center hover:transform hover:scale-110 transition-all duration-500 bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-green-100">
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:shadow-2xl transition-all duration-500 border-4 border-green-200"
                style={{ backgroundColor: '#78D860' }}
              >
                <Award className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-green-700 transition-colors">Premium Quality</h3>
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Only the finest ingredients, prepared fresh daily with techniques perfected through 
                years of training in authentic Japanese kitchens.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center hover:transform hover:scale-110 transition-all duration-500 bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-green-100">
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:shadow-2xl transition-all duration-500 border-4 border-green-200"
                style={{ backgroundColor: '#78D860' }}
              >
                <Heart className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-green-700 transition-colors">Made with Love</h3>
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Every dish is crafted with passion and care, from hand-pulled noodles to perfectly 
                seasoned broths that simmer for hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Much More Visible */}
      <section className="py-24 bg-gradient-to-br from-gray-100 to-green-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Visit Us <span className="text-green-600">Today</span>
            </h2>
            <p className="text-2xl text-gray-700 font-medium">
              Located in the heart of Kottawa, ready to serve you authentic flavors
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-3xl overflow-hidden border-4 border-green-200">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Contact Info */}
              <div className="p-12 lg:p-16">
                <div className="space-y-10">
                  
                  <div className="flex items-start space-x-6 group">
                    <div 
                      className="w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border-4 border-green-200"
                      style={{ backgroundColor: '#78D860' }}
                    >
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-2xl mb-3">Location</h3>
                      <p className="text-xl text-gray-700 leading-relaxed font-medium">
                        364/1, High Level Road<br />
                        Kottawa, Sri Lanka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group">
                    <div 
                      className="w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border-4 border-green-200"
                      style={{ backgroundColor: '#78D860' }}
                    >
                      <Phone className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-2xl mb-3">Phone</h3>
                      <p className="text-xl text-gray-700">
                        <a href="tel:0701783446" className="hover:text-green-600 transition-colors font-bold text-2xl block">
                          070 178 3446
                        </a>
                      </p>
                      <p className="text-xl text-gray-700">
                        <a href="tel:0769831520" className="hover:text-green-600 transition-colors font-bold text-2xl block">
                          076 983 1520
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group">
                    <div 
                      className="w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border-4 border-green-200"
                      style={{ backgroundColor: '#78D860' }}
                    >
                      <Clock className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-2xl mb-3">Hours</h3>
                      <div className="text-xl text-gray-700 space-y-2 font-medium">
                        <p><span className="font-black">Daily:</span> 11:00 AM - 10:00 PM</p>
                        <p><span className="font-black">Delivery:</span> 12:00 PM - 9:30 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6 group">
                    <div 
                      className="w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border-4 border-green-200"
                      style={{ backgroundColor: '#78D860' }}
                    >
                      <Mail className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-2xl mb-3">Email</h3>
                      <p className="text-xl text-gray-700">
                        <a 
                          href="mailto:grandminatocafe@gmail.com" 
                          className="hover:text-green-600 transition-colors font-bold text-xl"
                        >
                          grandminatocafe@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Panel - Much More Prominent */}
              <div 
                className="p-12 lg:p-16 text-white flex items-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, #78D860, #5BC142, #4ADE80)` }}
              >
                {/* Enhanced decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-white opacity-10 rounded-full translate-y-18 -translate-x-18"></div>
                
                <div className="text-center w-full relative z-10">
                  <h3 className="text-5xl font-black mb-6 drop-shadow-lg">Ready to Taste?</h3>
                  <p className="text-2xl opacity-95 mb-12 leading-relaxed font-medium">
                    Join us for an authentic Korean-Japanese fusion experience that will delight your senses.
                  </p>
                  
                  <div className="space-y-6">
                    <button 
                      onClick={() => window.location.href = '/table-reservation'}
                      className="w-full bg-white px-8 py-6 rounded-3xl font-black text-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl border-4 border-yellow-300"
                      style={{ color: '#78D860' }}
                    >
                      🍽️ Reserve Table Now
                    </button>
                    <button 
                      onClick={() => window.location.href = '/menu'}
                      className="w-full bg-transparent border-4 border-white text-white px-8 py-6 rounded-3xl font-black text-2xl hover:bg-white transition-all duration-300 transform hover:scale-105"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                        e.target.style.color = '#78D860';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'white';
                      }}
                    >
                      🍜 Explore Menu
                    </button>
                  </div>

                  <div className="mt-12 text-center">
                    <div className="flex justify-center space-x-2 mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-10 h-10 fill-yellow-300 text-yellow-300 drop-shadow-lg" />
                      ))}
                    </div>
                    <p className="text-xl opacity-95 font-bold">⭐ Rated Excellent by 1000+ Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;