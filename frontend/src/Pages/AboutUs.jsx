import React from 'react'
import NavBar from '../Components/NavBar';
import { MapPin, Clock, Phone, Mail, Users, Award, Heart } from 'lucide-react';
import ramenImg from '../assets/ramen2.jpeg';
import chef from '../assets/chefCooking.jpg'
import food from '../assets/food.jpg';
import eat from '../assets/eat.jpg';

const AboutUs = () => {
  return (
    <div>
      <NavBar/>
       

        {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 to-red-700 text-white py-24 mt-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Where Every Ramen Tell a Story!  Unwind Slurp Repeat
          </p>
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Grand Minato Restaurant</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Established in 2010, Grand Minato Restaurant has been serving the finest authentic Chinese cuisine for over three decades. Our journey began with a simple vision: to bring the rich flavors and timeless traditions of Chinese cooking to our community.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                From our humble beginnings as a small family restaurant, we have grown into a beloved culinary destination while never losing sight of our core values: exceptional quality, authentic flavors, and warm hospitality.
              </p>
              
            </div>
            <div className="relative">
              <img 
                src={ramenImg} 
                alt="ramenImg" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-red-600 text-white p-6 rounded-lg shadow-lg">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to preserving the authenticity of Chinese cuisine while creating memorable dining experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentic Tradition</h3>
              <p className="text-gray-600 leading-relaxed">
                Every dish is prepared using traditional recipes passed down through generations, ensuring authentic flavors in every bite.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Family Values</h3>
              <p className="text-gray-600 leading-relaxed">
                We treat every guest as family, providing warm hospitality and creating a welcoming atmosphere for all.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
              <Award className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We source only the finest ingredients and maintain the highest standards in food preparation and presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chef Section */}
      <section className="py-20 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={chef} 
                alt="Chef preparing food" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Authentic Taste of China</h2>
              <p className="text-lg mb-6 leading-relaxed opacity-90">
                Welcome to Grand Minato, where authentic Chinese flavors come to life. Our menu is crafted with traditional Cantonese and Szechuan techniques, bringing you the true taste of China. From steaming bowls of ramen and freshly made dumplings to hearty soups and fragrant fried rice, every dish is prepared with care to honor the rich heritage of Chinese cuisine.
              </p>
              <p className="text-lg mb-8 leading-relaxed opacity-90">
                "Cooking is not just about feeding the body, but nourishing the soul. Each dish tells a story of our heritage and culture."
              </p>
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">50+</p>
                  <p className="text-sm">Signature Dishes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">1K+</p>
                  <p className="text-sm">Happy Customers</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dining Experience */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Grand Minato Experience</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step into our elegantly designed dining space where traditional Chinese aesthetics meet modern comfort
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src="https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Elegant dining room" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Elegant Atmosphere</h3>
                <p className="text-gray-600">Traditional Chinese décor with modern touches create an sophisticated dining environment.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={food} 
                alt="Authentic Chinese food" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Flavors</h3>
                <p className="text-gray-600">Classic ramen, dumplings, soups, and fried rice made with time-honored recipes.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img 
                src={eat}
                alt="Fresh ingredients" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Dining</h3>
                <p className="text-gray-600">Every dish reflects the rich heritage of Chinese cuisine.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Grand Minato</h2>
            <p className="text-xl text-gray-600">We look forward to welcoming you to our restaurant</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">361, High Level Rd<br/>Pannipitiya<br/>City State 10230</p>
            </div>
            
            <div className="p-6">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-sun: 12:00-8.30PM </p>
            </div>
            
            <div className="p-6">
              <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600"> (+94)76 983 5152<br/>Reservations<br/>& Takeout Orders</p>
            </div>
            
            <div className="p-6">
              <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@grandminato.com<br/>reservations@grandminato.com</p>
            </div>
          </div>
        </div>
      </section>

      
      
    </div>
  )
}

export default AboutUs
