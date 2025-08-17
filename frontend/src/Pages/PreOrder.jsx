// src/App.js
import React from "react";

import noodlesImg from "../assets/spisy.png"; 
import NavBar from "../Components/NavBar";

export default function App() {
  return (
    <div>
      <NavBar />

    <div className="font-sans bg-gray-50 min-h-screen flex items-center justify-center">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-6 py-16 ">
        
        {/* Image */}
        <div> 
          <img
            src={noodlesImg}
            alt="Chinese Noodles"
            className="w-[350px] h-[350px] object-cover rounded-full shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div className="md:ml-16 mt-8 md:mt-0 max-w-lg">
          <p className="text-gray-600 text-lg">Welcome</p>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
            Grand Minato <br /> Restaurant
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Delve into the rich flavors of authentic Chinese cuisine, ready for
            you to savor and enjoy.
          </p>
          <button className="mt-6 px-6 py-2 bg-red-700 text-white font-medium rounded-full shadow-md hover:bg-red-800">
            Learn More
          </button>
        </div>
      </section>
    </div>
    </div>
  );
}
