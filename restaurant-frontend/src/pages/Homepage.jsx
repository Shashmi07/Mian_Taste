import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Clock, MapPin, Phone, Users, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

// Import your assets
import heroImage from '../assets/home.jpg';
import chineseImage from '../assets/Chineese.jpg';
import ramenImage from '../assets/RamenNoodles.jpg';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      title: "Welcome to",
      subtitle: "MIAN TASTE",
      description: "Experience authentic Korean-Japanese fusion cuisine crafted with passion and tradition",
      bgColor: "from-green-500 to-emerald-600",
      image: heroImage
    },
    {
      id: 2,
      title: "Authentic",
      subtitle: "FLAVORS",
      description: "Every dish tells a story of heritage, quality ingredients, and culinary excellence",
      bgColor: "from-orange-500 to-red-500",
      image: chineseImage
    },
    {
      id: 3,
      title: "Fresh",
      subtitle: "EXPERIENCE",
      description: "From our kitchen to your table - where every meal is a celebration of taste",
      bgColor: "from-purple-500 to-pink-500",
      image: ramenImage
    }
  ];

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award Winning",
      description: "Recognized for excellence in Asian fusion cuisine",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Made with Love",
      description: "Every dish is prepared with care and passion",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Friendly",
      description: "Perfect atmosphere for families and friends",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Fresh Daily",
      description: "Ingredients sourced fresh every morning",
      color: "from-green-400 to-emerald-500"
    }
  ];

  const services = [
    {
      title: "Dine In",
      description: "Experience our warm atmosphere and exceptional service",
      icon: "🍽️",
      action: () => navigate('/table-reservation'),
      buttonText: "Reserve Table"
    },
    {
      title: "Pre-Order",
      description: "Order ahead and skip the wait - your food ready when you arrive",
      icon: "⏰",
      action: () => navigate('/preorder'),
      buttonText: "Pre-Order Now"
    },
    {
      title: "Explore Menu",
      description: "Discover our authentic Korean-Japanese fusion dishes",
      icon: "📖",
      action: () => navigate('/menu'),
      buttonText: "View Menu"
    }
  ];

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <NavBar />
      
      <div className="pt-20">
        {/* Hero Slideshow */}
        <section className="relative h-screen">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Text Content */}
                  <div className="text-white space-y-8">
                    <div className="space-y-4">
                      <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                        {slide.title}
                        <br />
                        <span className="text-6xl lg:text-8xl bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                          {slide.subtitle}
                        </span>
                      </h1>
                      
                      <p className="text-xl lg:text-2xl opacity-90 leading-relaxed max-w-xl">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => navigate('/menu')}
                        className="group bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center"
                      >
                        Explore Menu
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <button
                        onClick={() => navigate('/table-reservation')}
                        className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
                      >
                        Reserve Table
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <div className="w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src={slide.image} 
                        alt={slide.subtitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center space-x-2">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <div>
                          <div className="font-bold text-gray-800">4.9 Rating</div>
                          <div className="text-sm text-gray-600">1000+ Reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Why Choose <span className="text-green-600">Mian Taste</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're passionate about bringing you the finest Korean-Japanese fusion experience with exceptional quality and service
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                How Can We <span className="text-green-600">Serve</span> You?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the perfect way to enjoy our delicious food
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">{service.icon}</div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-8">{service.description}</p>
                    </div>

                    <button
                      onClick={service.action}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {service.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Visit <span className="text-green-600">Our</span> Restaurant
              </h2>
              <p className="text-xl text-gray-600">
                We'd love to welcome you to Mian Taste
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2">
                
                {/* Contact Info */}
                <div className="p-12 text-white space-y-8">
                  <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-lg">Location</div>
                        <div className="opacity-90">364/1, High Level Road<br />Kottawa, Sri Lanka</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-lg">Contact</div>
                        <div className="opacity-90">070 178 3446<br />076 983 1520</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-lg">Hours</div>
                        <div className="opacity-90">Daily: 11:00 AM - 10:00 PM</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/table-reservation')}
                    className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    Reserve Your Table
                  </button>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gradient-to-br from-green-400 to-green-500 p-12 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-24 h-24 mx-auto mb-6 opacity-80" />
                    <h4 className="text-2xl font-bold mb-4">Find Us Here</h4>
                    <p className="text-lg opacity-90">
                      Located in the heart of Kottawa<br />
                      Easy parking available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">
                <span className="text-green-400">Mian Taste</span>
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Where authentic Korean-Japanese flavors meet exceptional hospitality
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <h4 className="text-lg font-bold mb-4 text-green-400">Quick Links</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => navigate('/menu')} className="text-gray-300 hover:text-green-400 transition-colors">Menu</button></li>
                  <li><button onClick={() => navigate('/about')} className="text-gray-300 hover:text-green-400 transition-colors">About Us</button></li>
                  <li><button onClick={() => navigate('/table-reservation')} className="text-gray-300 hover:text-green-400 transition-colors">Reservations</button></li>
                  <li><button onClick={() => navigate('/preorder')} className="text-gray-300 hover:text-green-400 transition-colors">Pre-Order</button></li>
                </ul>
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-bold mb-4 text-green-400">Contact</h4>
                <div className="space-y-2 text-gray-300">
                  <p>070 178 3446</p>
                  <p>076 983 1520</p>
                  <p>364/1, High Level Road, Kottawa</p>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-bold mb-4 text-green-400">Follow Us</h4>
                <div className="flex justify-center space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors cursor-pointer">
                    f
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors cursor-pointer">
                    📷
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors cursor-pointer">
                    🐦
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">
                &copy; 2024 Mian Taste. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;