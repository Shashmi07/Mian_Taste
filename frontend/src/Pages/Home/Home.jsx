import React from 'react'
import home from '../../assets/home.jpg';

const Home = () => {
  return (
    <div>
       className="w-full h-50% px-10 py-2"
      style={{
        backgroundImage: `url(${home})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',// containt don't use ,use cover
        backgroundPosition: 'center'
      }}
    </div>
  )
}

export default Home
