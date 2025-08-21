const mongoose = require('mongoose');
const getMenuItemModel = require('../models/MenuItem');
const { connectCustomerDB } = require('../config/customerDatabase');

const seedMenuItems = [
  // Ramen Items
  { 
    name: "Chicken Ramen", 
    price: 1100, 
    category: "ramen",
    image: "chickenRamen.jpg", 
    description: "Bowl of ramen with tender chicken",
    available: true,
    rating: 4.5,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Egg Ramen", 
    price: 950, 
    category: "ramen",
    image: "eggRamen.jpg", 
    description: "Delicious ramen with soft-boiled egg",
    available: true,
    rating: 4.3,
    preparationTime: 12,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Pork Ramen", 
    price: 1300, 
    category: "ramen",
    image: "porkRamen.jpg", 
    description: "Bowl of ramen with juicy pork slices",
    available: true,
    rating: 4.6,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Beef Ramen", 
    price: 1500, 
    category: "ramen",
    image: "beefRamen.jpg", 
    description: "Delicious ramen with flavorful beef slices",
    available: true,
    rating: 4.7,
    preparationTime: 20,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Seafood Ramen", 
    price: 1400, 
    category: "ramen",
    image: "SeafoodRamen.jpg", 
    description: "Fresh seafood in savory ramen broth",
    available: true,
    rating: 4.4,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Vegan Ramen", 
    price: 850, 
    category: "ramen",
    image: "veganRamen.jpeg", 
    description: "Fresh vegetables in light ramen broth",
    available: true,
    rating: 4.2,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Pork and Beef Ramen", 
    price: 1600, 
    category: "ramen",
    image: "beefandPorkRamen.jpg", 
    description: "Bowl of ramen with both pork and beef slices",
    available: true,
    rating: 4.8,
    preparationTime: 22,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Buldak Chicken Ramen", 
    price: 1200, 
    category: "ramen",
    image: "buldakChicken.jpg", 
    description: "Spicy Buldak chicken ramen",
    available: true,
    rating: 4.5,
    preparationTime: 16,
    spiceLevel: "hot",
    isVegetarian: false
  },
  { 
    name: "Buldak Black Ramen", 
    price: 950, 
    category: "ramen",
    image: "blackRamen.jpg", 
    description: "Spicy Buldak black ramen",
    available: true,
    rating: 4.3,
    preparationTime: 14,
    spiceLevel: "very-hot",
    isVegetarian: true
  },
  { 
    name: "Buldak Pork Ramen", 
    price: 1300, 
    category: "ramen",
    image: "buldakPork.jpg", 
    description: "Spicy Buldak pork ramen",
    available: true,
    rating: 4.4,
    preparationTime: 16,
    spiceLevel: "hot",
    isVegetarian: false
  },
  { 
    name: "Buldak Beef Ramen", 
    price: 1400, 
    category: "ramen",
    image: "buldakBeef.jpg", 
    description: "Spicy Buldak beef ramen",
    available: true,
    rating: 4.5,
    preparationTime: 18,
    spiceLevel: "hot",
    isVegetarian: false
  },
  { 
    name: "Buldak Beef and Pork Ramen", 
    price: 1500, 
    category: "ramen",
    image: "beefPorkBuldak.jpg", 
    description: "Spicy Buldak pork and beef ramen",
    available: true,
    rating: 4.6,
    preparationTime: 20,
    spiceLevel: "hot",
    isVegetarian: false
  },
  { 
    name: "Cheese Ramen", 
    price: 1000, 
    category: "ramen",
    image: "cheeseRamen.png", 
    description: "Creamy ramen topped with melted cheese",
    available: true,
    rating: 4.4,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Cheese Chicken Ramen", 
    price: 1250, 
    category: "ramen",
    image: "cheeseChicken.jpg", 
    description: "Delicious cheese ramen with tender chicken",
    available: true,
    rating: 4.6,
    preparationTime: 17,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Cheese Pork Ramen", 
    price: 1350, 
    category: "ramen",
    image: "cheesePork.jpg", 
    description: "Delicious cheese ramen with pork slices",
    available: true,
    rating: 4.5,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Cheese Beef Ramen", 
    price: 1500, 
    category: "ramen",
    image: "beefCheese.jpg", 
    description: "Creamy cheese ramen with flavorful beef",
    available: true,
    rating: 4.7,
    preparationTime: 20,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Cheese Beef and Pork Ramen", 
    price: 1600, 
    category: "ramen",
    image: "beefPork.jpg", 
    description: "Cheese ramen with both beef and pork slices",
    available: true,
    rating: 4.8,
    preparationTime: 22,
    spiceLevel: "mild",
    isVegetarian: false
  },

  // Rice Items
  { 
    name: "Chicken Fried Rice", 
    price: 1100, 
    category: "rice",
    image: "rice.png", 
    description: "Delicious fried rice with chicken",
    available: true,
    rating: 4.4,
    preparationTime: 12,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Vegetable Fried Rice", 
    price: 950, 
    category: "rice",
    image: "vegetableRice.jpg", 
    description: "Fried rice with fresh vegetables",
    available: true,
    rating: 4.2,
    preparationTime: 10,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Egg Fried Rice", 
    price: 950, 
    category: "rice",
    image: "eggRice.png", 
    description: "Golden fried rice with fluffy egg",
    available: true,
    rating: 4.3,
    preparationTime: 10,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Pork Fried Rice", 
    price: 1300, 
    category: "rice",
    image: "porkRice.jpg", 
    description: "Savory rice with pork pieces",
    available: true,
    rating: 4.5,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Beef Fried Rice", 
    price: 1500, 
    category: "rice",
    image: "beefRice.jpg", 
    description: "Fried rice with flavorful beef",
    available: true,
    rating: 4.6,
    preparationTime: 16,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Beef and Pork Fried Rice", 
    price: 1600, 
    category: "rice",
    image: "beefPorkRice.jpg", 
    description: "Tasty mix of beef and pork in fried rice",
    available: true,
    rating: 4.7,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  }
];

// Connect to customer database and seed menu
const seedMenu = async () => {
  try {
    await connectCustomerDB();
    console.log('Connected to customer database');
    
    // Get the MenuItem model
    const MenuItem = getMenuItemModel();
    
    // Wait for the connection to be ready
    const connection = require('../config/customerDatabase').getCustomerConnection();
    if (connection.readyState !== 1) {
      console.log('Waiting for database connection...');
      await new Promise(resolve => {
        connection.on('connected', resolve);
      });
    }
    
    console.log('Database connection ready, starting seeding...');
    
    // Clear existing menu items
    const deleteResult = await MenuItem.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing menu items`);

    // Insert new menu items
    const insertedItems = await MenuItem.insertMany(seedMenuItems);
    console.log(`Successfully inserted ${insertedItems.length} menu items`);
    
    // Verify the insertion
    const count = await MenuItem.countDocuments();
    console.log(`Verification: ${count} items now in database`);

    console.log('Menu seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error in seeding process:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedMenu();