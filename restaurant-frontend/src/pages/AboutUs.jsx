import React from 'react';
import { MapPin, Phone, Mail, Clock, Star, Users, Award, Heart, ChefHat, Utensils, Target, Sparkles } from 'lucide-react';
import NavBar from '../components/NavBar';
import ramenImg from '../assets/RamenNoodles.jpg';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-700 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse delay-300"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold mb-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <Sparkles className="w-4 h-4" />
              Authentic Korean-Japanese Fusion Experience
            </span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to <br />
            <span className="text-yellow-300 drop-shadow-lg font-black">Mian Taste</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-10">
            Where traditional Japanese culinary artistry meets bold Korean flavors, creating an unforgettable dining experience in the heart of Kottawa
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {[
              { number: "5+", label: "Years Experience", icon: Clock },
              { number: "100%", label: "Fresh Daily", icon: Heart },
              { number: "1000+", label: "Happy Customers", icon: Users },
              { number: "2", label: "Cuisine Styles", icon: ChefHat }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Story Content */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" 
                      style={{ backgroundColor: '#46923c', color: 'white' }}>
                  Our Journey
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  From Passion to <span style={{ color: '#46923c' }}>Perfection</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  At Mian Taste, we believe that exceptional food is born from the perfect marriage of 
                  tradition and innovation. Our story began with a simple dream: to bring the authentic 
                  tastes of Korea and Japan to Sri Lanka, without compromising on quality or authenticity.
                </p>
                
                <p>
                  Our head chef spent years training in the bustling kitchens of Tokyo and Seoul, 
                  mastering ancient techniques for crafting the perfect ramen broth and learning 
                  the art of Korean barbecue. This invaluable experience forms the foundation of 
                  every dish we serve.
                </p>
                
                <div className="bg-white rounded-xl p-6 border-l-4 shadow-lg" 
                     style={{ borderLeftColor: '#46923c' }}>
                  <p className="text-lg font-medium text-gray-900 italic">
                    "Every bowl tells a story of dedication, every flavor represents hours of preparation, 
                    and every meal is our way of sharing our passion for authentic Asian cuisine."
                  </p>
                  <p className="text-sm font-semibold mt-2" style={{ color: '#46923c' }}>
                    - Head Chef, Mian Taste
                  </p>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                  <img
                    src={ramenImg}
                    alt="Our Signature Ramen"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Our Signature Bowl</h3>
                  <p className="text-gray-600">Hand-crafted with love and tradition</p>
                  
                  <div className="flex justify-center space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4" style={{ borderColor: '#46923c' }}>
                    <p className="text-sm font-medium" style={{ color: '#46923c' }}>
                      🍜 Rich 12-hour broth • Hand-pulled noodles • Korean spices
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                   style={{ backgroundColor: '#46923c' }}>
                <span className="text-white text-2xl">🍜</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" 
                  style={{ backgroundColor: '#46923c', color: 'white' }}>
              Our Excellence
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Makes Us <span style={{ color: '#46923c' }}>Special</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect blend of tradition, quality, and innovation in every dish we serve
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            
            {/* Feature 1 */}
            <div className="group text-center p-8 rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                   style={{ backgroundColor: '#46923c' }}>
                <Utensils className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentic Fusion</h3>
              <p className="text-gray-600 leading-relaxed">
                Perfect harmony of Korean boldness and Japanese precision, creating unique flavors 
                that honor both culinary traditions while offering something entirely new.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center p-8 rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                   style={{ backgroundColor: '#46923c' }}>
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Only the finest ingredients, prepared fresh daily using traditional techniques 
                perfected through years of training in authentic Asian kitchens.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center p-8 rounded-3xl hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-green-200">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                   style={{ backgroundColor: '#46923c' }}>
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Made with Passion</h3>
              <p className="text-gray-600 leading-relaxed">
                Every dish is crafted with genuine care and passion, from hand-pulled noodles 
                to perfectly balanced broths that simmer for hours to achieve perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" 
                  style={{ backgroundColor: '#46923c', color: 'white' }}>
              Visit Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Us in <span style={{ color: '#46923c' }}>Kottawa</span>
            </h2>
            <p className="text-xl text-gray-600">
              Experience authentic flavors in our welcoming restaurant
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              
              {/* Contact Information */}
              <div className="p-12 lg:p-16">
                <div className="space-y-8">
                  
                  <div className="flex items-start space-x-4 group">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                         style={{ backgroundColor: '#46923c' }}>
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Our Location</h3>
                      <p className="text-gray-600 leading-relaxed">
                        364/1, High Level Road<br />
                        Kottawa, Sri Lanka<br />
                        <span className="text-sm text-gray-500">Easy parking available</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                         style={{ backgroundColor: '#46923c' }}>
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Call Us</h3>
                      <div className="space-y-1">
                        <p className="text-gray-600">
                          <a href="tel:0701783446" className="hover:text-green-600 transition-colors font-semibold">
                            070 178 3446
                          </a>
                        </p>
                        <p className="text-gray-600">
                          <a href="tel:0769831520" className="hover:text-green-600 transition-colors font-semibold">
                            076 983 1520
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                         style={{ backgroundColor: '#46923c' }}>
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Opening Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p><span className="font-semibold">Daily:</span> 11:00 AM - 10:00 PM</p>
                        <p><span className="font-semibold">Delivery:</span> 12:00 PM - 9:30 PM</p>
                        <p className="text-sm text-gray-500">Open 7 days a week</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                         style={{ backgroundColor: '#46923c' }}>
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:grandminatocafe@gmail.com" 
                           className="hover:text-green-600 transition-colors">
                          grandminatocafe@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Panel */}
              <div className="p-12 lg:p-16 text-white relative overflow-hidden"
                   style={{ background: 'linear-gradient(135deg, #46923c, #5BC142)' }}>
                
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
                
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready for an Amazing Experience?</h3>
                  <p className="text-lg opacity-90 mb-10 leading-relaxed">
                    Join us for an authentic Korean-Japanese fusion experience that will leave you craving for more.
                  </p>
                  
                  <div className="space-y-4">
                    <button 
                      onClick={() => window.location.href = '/table-reservation'}
                      className="w-full bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🍽️ Reserve Your Table
                    </button>
                    <button 
                      onClick={() => window.location.href = '/menu'}
                      className="w-full bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105"
                    >
                      🍜 Explore Our Menu
                    </button>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/20">
                    <div className="flex justify-center space-x-1 mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                      ))}
                    </div>
                    <p className="text-sm opacity-90 font-medium">
                      ⭐ Rated 5 stars by 1000+ happy customers
                    </p>
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