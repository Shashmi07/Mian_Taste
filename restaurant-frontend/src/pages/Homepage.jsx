import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';

// Import food images
import heroImage from '../assets/home.jpg';
import chineseImage from '../assets/Chineese.jpg';
import ramenImage from '../assets/RamenNoodles.jpg';
import chickenRamen from '../assets/MenuItems/chickenRamen.jpg';
import beefRamen from '../assets/MenuItems/beefRamen.jpg';
import seafoodRamen from '../assets/MenuItems/SeafoodRamen.jpg';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      title: "Welcome to Mian Taste",
      subtitle: "Authentic Korean-Japanese Fusion",
      image: heroImage
    },
    {
      id: 2,
      title: "Fresh Ramen Daily",
      subtitle: "Made with Premium Ingredients",
      image: chickenRamen
    },
    {
      id: 3,
      title: "Signature Dishes",
      subtitle: "Traditional Recipes, Modern Taste",
      image: beefRamen
    },
    {
      id: 4,
      title: "Seafood Specialties",
      subtitle: "Ocean Fresh Flavors",
      image: seafoodRamen
    },
    {
      id: 5,
      title: "Asian Fusion",
      subtitle: "Where East Meets Flavor",
      image: chineseImage
    }
  ];

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Food Slideshow Header */}
        <section className="relative h-screen overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white max-w-4xl mx-auto px-6">
                  <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-2xl lg:text-3xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/menu')}
                      className="group bg-[#46923c] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#5BC142] transition-colors duration-300 flex items-center justify-center"
                    >
                      View Our Menu
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button
                      onClick={() => navigate('/table-reservation')}
                      className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                    >
                      Reserve Table
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How Would You Like to Order?
              </h2>
              <p className="text-xl text-gray-600">
                Choose your preferred dining experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-6xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Dine In</h3>
                <p className="text-gray-600 mb-8">Experience our cozy atmosphere</p>
                <button
                  onClick={() => navigate('/table-reservation')}
                  className="w-full bg-[#46923c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5BC142] transition-colors duration-300"
                >
                  Reserve Table
                </button>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-6xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pre-Order</h3>
                <p className="text-gray-600 mb-8">Skip the wait, order ahead</p>
                <button
                  onClick={() => navigate('/preorder')}
                  className="w-full bg-[#46923c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5BC142] transition-colors duration-300"
                >
                  Order Now
                </button>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-6xl mb-6">📱</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">QR Menu</h3>
                <p className="text-gray-600 mb-8">Scan & order from your table</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full bg-[#46923c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5BC142] transition-colors duration-300"
                >
                  Browse Menu
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Mian Taste?</h2>
              <p className="text-xl text-gray-600">Experience the difference that makes us special</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-[#46923c] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#5BC142] transition-colors duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fresh Ingredients</h3>
                <p className="text-gray-600 leading-relaxed">We source the finest ingredients daily to ensure every dish meets our high standards of quality and freshness.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-[#46923c] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#5BC142] transition-colors duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Made with Love</h3>
                <p className="text-gray-600 leading-relaxed">Every dish is crafted with passion by our experienced chefs who take pride in delivering authentic flavors.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-[#46923c] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#5BC142] transition-colors duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Family Atmosphere</h3>
                <p className="text-gray-600 leading-relaxed">Our warm and welcoming environment makes every guest feel like part of our extended family.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600">Don't just take our word for it</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Amazing authentic flavors! The ramen here reminds me of my trip to Japan. Best Korean-Japanese fusion in Kottawa!"</p>
                <div className="font-semibold text-gray-900">Sarah M.</div>
                <div className="text-sm text-gray-500">Regular Customer</div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Perfect family restaurant! Kids love the atmosphere and we love the authentic taste. Great service too!"</p>
                <div className="font-semibold text-gray-900">Rajesh P.</div>
                <div className="text-sm text-gray-500">Family Diner</div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"Fresh ingredients, amazing flavors, and reasonable prices. This is our go-to place for Asian cuisine!"</p>
                <div className="font-semibold text-gray-900">Priya L.</div>
                <div className="text-sm text-gray-500">Food Enthusiast</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-[#46923c]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Mian Taste?</h2>
            <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed">
              Join thousands of satisfied customers who have made Mian Taste their favorite dining destination
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/table-reservation')}
                className="bg-white text-[#46923c] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Reserve Your Table
              </button>
              <button
                onClick={() => navigate('/preorder')}
                className="bg-white bg-opacity-20 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#46923c] transition-all duration-300"
              >
                Order for Pickup
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Homepage;