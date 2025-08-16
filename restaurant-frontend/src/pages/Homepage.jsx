import React, { useState, useEffect } from 'react';
import { Star, Heart, Clock, Truck } from 'lucide-react';
import NavBar from '../components/NavBar';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const slides = [
    {
      id: 1,
      title: "Today's Special",
      subtitle: "RAMEN",
      description: "Authentic tonkotsu broth with fresh noodles. Rich, creamy, and absolutely delicious",
      bgColor: "from-orange-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Premium",
      subtitle: "BENTO BOX",
      description: "Complete meal with rice, protein & sides. Perfectly balanced and nutritious",
      bgColor: "from-pink-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=500&h=400&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Fresh",
      subtitle: "CHIRASHI BOWL",
      description: "Assorted sashimi over seasoned rice. Ocean fresh and expertly prepared",
      bgColor: "from-purple-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Chef's Special",
      subtitle: "SUSHI PLATTER",
      description: "Hand-crafted sushi selection. Premium ingredients, traditional technique",
      bgColor: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop&crop=center"
    }
  ];

  const categories = [
    { name: "Ramen", icon: "🍜", color: "from-amber-500 to-orange-500" },
    { name: "Juice", icon: "🥤", color: "from-green-500 to-emerald-500" },
    { name: "Rice", icon: "🍚", color: "from-red-500 to-pink-500" }
  ];

  const recommendedItems = [
    {
      id: 1,
      name: "Tonkotsu Ramen",
      price: "Rs. 1500",
      rating: 4.8,
      time: "25-30 min",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&crop=center",
      description: "Rich pork bone broth with tender noodles",
      category: "ramen"
    },
    {
      id: 2,
      name: "Shoyu Ramen",
      price: "Rs. 1350",
      rating: 4.7,
      time: "20-25 min",
      image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop&crop=center",
      description: "Light soy sauce based broth",
      category: "ramen"
    },
    {
      id: 3,
      name: "Miso Ramen",
      price: "Rs. 1400",
      rating: 4.9,
      time: "25-30 min",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop&crop=center",
      description: "Fermented soybean paste broth",
      category: "ramen"
    },
    {
      id: 4,
      name: "Chicken Teriyaki Bento",
      price: "Rs. 1200",
      rating: 4.6,
      time: "15-20 min",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=400&h=300&fit=crop&crop=center",
      description: "Grilled chicken with teriyaki sauce",
      category: "rice"
    },
    {
      id: 5,
      name: "Salmon Sashimi",
      price: "Rs. 1800",
      rating: 4.9,
      time: "10-15 min",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center",
      description: "Fresh salmon sliced to perfection",
      category: "sushi"
    },
    {
      id: 6,
      name: "Chirashi Bowl",
      price: "Rs. 2000",
      rating: 4.8,
      time: "20-25 min",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop&crop=center",
      description: "Assorted sashimi over seasoned rice",
      category: "rice"
    },
    {
      id: 7,
      name: "Gyoza Dumplings",
      price: "Rs. 800",
      rating: 4.5,
      time: "15-20 min",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop&crop=center",
      description: "Pan-fried pork dumplings",
      category: "appetizer"
    },
    {
      id: 8,
      name: "Tempura Platter",
      price: "Rs. 1600",
      rating: 4.7,
      time: "20-25 min",
      image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&h=300&fit=crop&crop=center",
      description: "Assorted vegetables and shrimp tempura",
      category: "appetizer"
    }
  ];

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const orderFood = (foodType) => {
    alert(`Great choice! Ordering ${foodType}. Redirecting to menu...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* NavBar */}
      <NavBar />
      
      {/* Main Content */}
      <div className="pt-24">
        <main className="max-w-7xl mx-auto px-4 py-10">
          {/* Hero Slideshow */}
          <section className="mb-16">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="h-full flex items-center justify-between px-16">
                    <div className="text-white max-w-lg">
                      <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">
                        {slide.title}
                        <br />
                        <span className="text-6xl">{slide.subtitle}</span>
                      </h2>
                      <p className="text-xl mb-8 opacity-90 leading-relaxed">
                        {slide.description}
                      </p>
                      <button
                        onClick={() => orderFood(slide.subtitle.toLowerCase())}
                        className="bg-white/20 border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg uppercase tracking-wider hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        Order Now
                      </button>
                    </div>
                    <div className="w-80 h-64 rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src={slide.image} 
                        alt={slide.subtitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-white/20 backdrop-blur-sm items-center justify-center text-8xl">
                        🍜
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
              >
                ›
              </button>

              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Recommended</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center text-6xl">
                      🍜
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-200">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4" />
                        <span>Free</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-green-600">{item.price}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#menu" className="text-gray-300 hover:text-green-400 transition-colors">Menu</a></li>
                  <li><a href="#about" className="text-gray-300 hover:text-green-400 transition-colors">About Us</a></li>
                  <li><a href="#contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact</a></li>
                  <li><a href="#delivery" className="text-gray-300 hover:text-green-400 transition-colors">Delivery Info</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-400">Customer Service</h3>
                <ul className="space-y-2">
                  <li><a href="#help" className="text-gray-300 hover:text-green-400 transition-colors">Help Center</a></li>
                  <li><a href="#track" className="text-gray-300 hover:text-green-400 transition-colors">Track Order</a></li>
                  <li><a href="#feedback" className="text-gray-300 hover:text-green-400 transition-colors">Feedback</a></li>
                  <li><a href="#support" className="text-gray-300 hover:text-green-400 transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-400">Connect With Us</h3>
                <ul className="space-y-2">
                  <li><a href="#facebook" className="text-gray-300 hover:text-green-400 transition-colors">Facebook</a></li>
                  <li><a href="#instagram" className="text-gray-300 hover:text-green-400 transition-colors">Instagram</a></li>
                  <li><a href="#twitter" className="text-gray-300 hover:text-green-400 transition-colors">Twitter</a></li>
                  <li><a href="#youtube" className="text-gray-300 hover:text-green-400 transition-colors">YouTube</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-400">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#terms" className="text-gray-300 hover:text-green-400 transition-colors">Terms of Service</a></li>
                  <li><a href="#privacy" className="text-gray-300 hover:text-green-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#cookies" className="text-gray-300 hover:text-green-400 transition-colors">Cookie Policy</a></li>
                  <li><a href="#refund" className="text-gray-300 hover:text-green-400 transition-colors">Refund Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 mt-8">
              <p className="text-center text-gray-400 text-sm">
                &copy; 2023 Your Company Name. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;