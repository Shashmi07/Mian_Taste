import React from 'react';
import { MapPin, Phone, Mail, Clock, Star, Users, Award, Heart, ChefHat, Utensils } from 'lucide-react';
import NavBar from '../components/NavBar';
import ramenImg from '../assets/RamenNoodles.jpg';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section - Enhanced but same colors */}
      <section className="relative bg-white pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span 
              className="inline-block px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-sm"
              style={{ backgroundColor: '#F0FDF4', color: '#15803d' }}
            >
              ✨ Authentic Korean-Japanese Fusion
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span style={{ color: '#78D860' }}>Mian Taste</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
            Where traditional Japanese techniques meet Korean flavors in the heart of Kottawa
          </p>

          {/* Stats - Fixed syntax error */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: "5+", label: "Years Experience" },
              { number: "100%", label: "Fresh Daily" },
              { number: "1", label: "Japan-Trained Chef" },
              { number: "2", label: "Cuisine Styles" }
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:transform hover:scale-105">
                <div className="text-3xl font-bold mb-2" style={{ color: '#78D860' }}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Better spacing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Culinary Journey</h2>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  At Mian Taste, we believe that great food tells a story. Our story began with a passion 
                  for authentic Asian cuisine and a dream to bring the perfect fusion of Korean boldness 
                  and Japanese precision to Sri Lanka.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our head chef trained extensively in Japan, mastering the delicate art of ramen making 
                  and traditional Japanese cooking techniques. Combined with the vibrant, bold flavors of 
                  Korean cuisine, we create dishes that honor both traditions while offering something 
                  uniquely special.
                </p>
                
                <div 
                  className="border-l-4 bg-white p-6 rounded-r-xl shadow-md"
                  style={{ borderLeftColor: '#78D860' }}
                >
                  <p className="text-lg font-medium text-gray-800 italic">
                    "Every bowl we serve is crafted with the same care and precision you'd find in 
                    the best ramen shops of Tokyo, infused with Korean flavors that excite the palate."
                  </p>
                  <p className="text-sm text-gray-600 mt-3 font-semibold">- Head Chef, Mian Taste</p>
                </div>
              </div>
            </div>

            {/* Ramen Bowl Image - Enhanced */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <div className="relative">
                  {/* Ramen Image */}
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                    <img
                      src={ramenImg}
                      alt="Authentic Ramen Bowl - Mian Taste Signature"
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Image Caption */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Signature Ramen</h3>
                    <p className="text-gray-600 mb-4 font-medium">Authentic Japanese-Korean Fusion</p>
                    
                    <div className="flex justify-center mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                    
                    <div 
                      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border-2 shadow-inner"
                      style={{ borderColor: '#78D860' }}
                    >
                      <p className="text-sm font-semibold" style={{ color: '#15803d' }}>
                        🍜 Hand-pulled noodles in rich, 12-hour simmered broth with Korean spices
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div 
                    className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                    style={{ backgroundColor: '#78D860' }}
                  >
                    <span className="text-white text-2xl">🍜</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced hover effects */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Us Special</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of tradition, quality, and innovation in every dish
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#F0FDF4' }}
              >
                <Utensils className="w-10 h-10" style={{ color: '#78D860' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors">Authentic Fusion</h3>
              <p className="text-gray-600 leading-relaxed">
                Masterful blend of Korean and Japanese culinary traditions, creating unique flavors 
                that honor both cultures while offering something completely new.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#F0FDF4' }}
              >
                <Award className="w-10 h-10" style={{ color: '#78D860' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Only the finest ingredients, prepared fresh daily with techniques perfected through 
                years of training in authentic Japanese kitchens.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
              <div 
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#F0FDF4' }}
              >
                <Heart className="w-10 h-10" style={{ color: '#78D860' }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors">Made with Love</h3>
              <p className="text-gray-600 leading-relaxed">
                Every dish is crafted with passion and care, from hand-pulled noodles to perfectly 
                seasoned broths that simmer for hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Us Today</h2>
            <p className="text-xl text-gray-600">
              Located in the heart of Kottawa, ready to serve you authentic flavors
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Contact Info */}
              <div className="p-8 lg:p-10">
                <div className="space-y-6">
                  
                  <div className="flex items-start space-x-4 group">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: '#F0FDF4' }}
                    >
                      <MapPin className="w-6 h-6" style={{ color: '#78D860' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Location</h3>
                      <p className="text-gray-600 leading-relaxed">
                        364/1, High Level Road<br />
                        Kottawa, Sri Lanka
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: '#F0FDF4' }}
                    >
                      <Phone className="w-6 h-6" style={{ color: '#78D860' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Phone</h3>
                      <p className="text-gray-600">
                        <a href="tel:0701783446" className="hover:text-green-600 transition-colors font-medium">
                          070 178 3446
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <a href="tel:0769831520" className="hover:text-green-600 transition-colors font-medium">
                          076 983 1520
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: '#F0FDF4' }}
                    >
                      <Clock className="w-6 h-6" style={{ color: '#78D860' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p><span className="font-medium">Daily:</span> 11:00 AM - 10:00 PM</p>
                        <p><span className="font-medium">Delivery:</span> 12:00 PM - 9:30 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: '#F0FDF4' }}
                    >
                      <Mail className="w-6 h-6" style={{ color: '#78D860' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Email</h3>
                      <p className="text-gray-600">
                        <a 
                          href="mailto:grandminatocafe@gmail.com" 
                          className="hover:text-green-600 transition-colors font-medium"
                        >
                          grandminatocafe@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Panel */}
              <div 
                className="p-8 lg:p-10 text-white flex items-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, #78D860, #5BC142)` }}
              >
                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="text-center w-full relative z-10">
                  <h3 className="text-3xl font-bold mb-4">Ready to Taste?</h3>
                  <p className="text-lg opacity-90 mb-8 leading-relaxed">
                    Join us for an authentic Korean-Japanese fusion experience that will delight your senses.
                  </p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => window.location.href = '/table-reservation'}
                      className="w-full bg-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      style={{ color: '#78D860' }}
                    >
                      🍽️ Reserve Table
                    </button>
                    <button 
                      onClick={() => window.location.href = '/menu'}
                      className="w-full bg-transparent border-2 border-white text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-white transition-all duration-300 transform hover:scale-105"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
                        e.target.style.color = '#78D860';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'white';
                      }}
                    >
                      🍜 View Menu
                    </button>
                  </div>

                  <div className="mt-8 text-center">
                    <div className="flex justify-center space-x-1 mb-3">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-6 h-6 fill-yellow-300 text-yellow-300 drop-shadow-sm" />
                      ))}
                    </div>
                    <p className="text-sm opacity-90 font-medium">Rated excellent by our customers</p>
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