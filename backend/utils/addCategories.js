const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const additionalMenuItems = [
  // Soup Items
  { 
    name: "Chicken Soup", 
    price: 850, 
    category: "soup",
    image: "chickenSoup.jpg", 
    description: "Warm and comforting chicken soup",
    available: true,
    rating: 4.2,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Beef Soup", 
    price: 950, 
    category: "soup",
    image: "beefSoup.jpg", 
    description: "Rich and hearty beef soup",
    available: true,
    rating: 4.4,
    preparationTime: 20,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Pork Soup", 
    price: 900, 
    category: "soup",
    image: "porkSoup.jpg", 
    description: "Savory pork soup with vegetables",
    available: true,
    rating: 4.3,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Egg Soup", 
    price: 750, 
    category: "soup",
    image: "eggSoup.jpg", 
    description: "Light and fluffy egg drop soup",
    available: true,
    rating: 4.1,
    preparationTime: 10,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Beef Pork Soup", 
    price: 1100, 
    category: "soup",
    image: "beefPorkSoup.jpg", 
    description: "Mixed meat soup with rich flavors",
    available: true,
    rating: 4.5,
    preparationTime: 25,
    spiceLevel: "mild",
    isVegetarian: false
  },

  // Beverage Items
  { 
    name: "Coca Cola", 
    price: 200, 
    category: "beverage",
    image: "cocacola.jpg", 
    description: "Classic refreshing cola drink",
    available: true,
    rating: 4.0,
    preparationTime: 2,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Sprite", 
    price: 200, 
    category: "beverage",
    image: "sprite.jpeg", 
    description: "Crisp lemon-lime soda",
    available: true,
    rating: 4.1,
    preparationTime: 2,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Orange Juice", 
    price: 300, 
    category: "beverage",
    image: "orangeJuice.jpg", 
    description: "Fresh squeezed orange juice",
    available: true,
    rating: 4.3,
    preparationTime: 3,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Ginger Beer", 
    price: 250, 
    category: "beverage",
    image: "gingerBeer.png", 
    description: "Spicy and refreshing ginger beer",
    available: true,
    rating: 4.2,
    preparationTime: 2,
    spiceLevel: "medium",
    isVegetarian: true,
    isVegan: true
  },

  // More Items (Desserts and sides)
  { 
    name: "Mochi Ice Cream", 
    price: 400, 
    category: "more",
    image: "ramen.jpg", // Using default image
    description: "Sweet Japanese ice cream wrapped in mochi",
    available: true,
    rating: 4.6,
    preparationTime: 5,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Gyoza", 
    price: 650, 
    category: "more",
    image: "ramen.jpg", // Using default image
    description: "Pan-fried pork and vegetable dumplings",
    available: true,
    rating: 4.5,
    preparationTime: 12,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Edamame", 
    price: 350, 
    category: "more",
    image: "ramen.jpg", // Using default image
    description: "Steamed and salted young soybeans",
    available: true,
    rating: 4.2,
    preparationTime: 8,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  }
];

const addAdditionalItems = async () => {
  try {
    console.log('=== ADDING ADDITIONAL MENU CATEGORIES ===');
    console.log('Connecting to customer database...');
    
    const connection = await mongoose.createConnection(process.env.CUSTOMER_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await new Promise(resolve => {
      connection.once('connected', () => {
        console.log('✅ Connected to customer database');
        resolve();
      });
    });
    
    console.log('Adding soup, beverage, and more items...');
    const insertResult = await connection.db.collection('menu-items').insertMany(additionalMenuItems);
    console.log(`✅ Added ${insertResult.insertedCount} additional items`);
    
    console.log('Verifying total items...');
    const totalCount = await connection.db.collection('menu-items').countDocuments();
    console.log(`✅ Total items in database: ${totalCount}`);
    
    // Show counts by category
    const categories = ['ramen', 'rice', 'soup', 'beverage', 'more'];
    for (const category of categories) {
      const count = await connection.db.collection('menu-items').countDocuments({ category });
      console.log(`  - ${category}: ${count} items`);
    }
    
    await connection.close();
    console.log('🎉 Additional categories added successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Adding additional items failed:', error);
    process.exit(1);
  }
};

addAdditionalItems();
