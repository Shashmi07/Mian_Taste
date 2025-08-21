const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const seedMenuItems = [
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
    price: 1650, 
    category: "ramen",
    image: "SeafoodRamen.jpg", 
    description: "Fresh seafood ramen bowl",
    available: true,
    rating: 4.8,
    preparationTime: 22,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Vegan Ramen", 
    price: 1200, 
    category: "ramen",
    image: "veganRamen.jpeg", 
    description: "Plant-based ramen with vegetables",
    available: true,
    rating: 4.4,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Black Ramen", 
    price: 1400, 
    category: "ramen",
    image: "blackRamen.jpg", 
    description: "Rich black garlic oil ramen",
    available: true,
    rating: 4.5,
    preparationTime: 18,
    spiceLevel: "medium",
    isVegetarian: false
  },
  { 
    name: "Cheese Ramen", 
    price: 1350, 
    category: "ramen",
    image: "cheeseRamen.png", 
    description: "Creamy cheese ramen bowl",
    available: true,
    rating: 4.3,
    preparationTime: 16,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Beef and Pork Ramen", 
    price: 1700, 
    category: "ramen",
    image: "beefandPorkRamen.jpg", 
    description: "Double meat ramen with beef and pork",
    available: true,
    rating: 4.8,
    preparationTime: 25,
    spiceLevel: "medium",
    isVegetarian: false
  },
  { 
    name: "Buldak Chicken", 
    price: 1450, 
    category: "ramen",
    image: "buldakChicken.jpg", 
    description: "Spicy fire chicken ramen",
    available: true,
    rating: 4.6,
    preparationTime: 20,
    spiceLevel: "very-hot",
    isVegetarian: false
  },
  { 
    name: "Buldak Beef", 
    price: 1550, 
    category: "ramen",
    image: "buldakBeef.jpg", 
    description: "Extremely spicy beef ramen",
    available: true,
    rating: 4.7,
    preparationTime: 22,
    spiceLevel: "very-hot",
    isVegetarian: false
  },
  { 
    name: "Buldak Pork", 
    price: 1500, 
    category: "ramen",
    image: "buldakPork.jpg", 
    description: "Fiery pork ramen challenge",
    available: true,
    rating: 4.5,
    preparationTime: 20,
    spiceLevel: "very-hot",
    isVegetarian: false
  },
  { 
    name: "Buldak Beef Pork", 
    price: 1750, 
    category: "ramen",
    image: "buldakBeefPork.jpg", 
    description: "Ultimate spicy meat combination",
    available: true,
    rating: 4.9,
    preparationTime: 25,
    spiceLevel: "very-hot",
    isVegetarian: false
  },
  { 
    name: "Beef Pork Buldak", 
    price: 1750, 
    category: "ramen",
    image: "beefPorkBuldak.jpg", 
    description: "Double meat extra spicy ramen",
    available: true,
    rating: 4.8,
    preparationTime: 25,
    spiceLevel: "very-hot",
    isVegetarian: false
  },
  { 
    name: "Cheese Chicken", 
    price: 1400, 
    category: "ramen",
    image: "cheeseChicken.jpg", 
    description: "Creamy cheese chicken ramen",
    available: true,
    rating: 4.4,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Cheese Pork", 
    price: 1450, 
    category: "ramen",
    image: "cheesePork.jpg", 
    description: "Rich cheese and pork ramen",
    available: true,
    rating: 4.5,
    preparationTime: 20,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Beef Pork", 
    price: 1650, 
    category: "ramen",
    image: "beefPork.jpg", 
    description: "Premium beef and pork ramen",
    available: true,
    rating: 4.7,
    preparationTime: 24,
    spiceLevel: "medium",
    isVegetarian: false
  },
  { 
    name: "Beef Cheese", 
    price: 1600, 
    category: "ramen",
    image: "beefCheese.jpg", 
    description: "Beef ramen with melted cheese",
    available: true,
    rating: 4.6,
    preparationTime: 22,
    spiceLevel: "mild",
    isVegetarian: false
  },

  // Rice Items
  { 
    name: "Egg Rice", 
    price: 850, 
    category: "rice",
    image: "eggRice.png", 
    description: "Fried rice with scrambled eggs",
    available: true,
    rating: 4.2,
    preparationTime: 10,
    spiceLevel: "mild",
    isVegetarian: true
  },
  { 
    name: "Beef Rice", 
    price: 1200, 
    category: "rice",
    image: "beefRice.jpg", 
    description: "Savory beef fried rice",
    available: true,
    rating: 4.5,
    preparationTime: 15,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Pork Rice", 
    price: 1100, 
    category: "rice",
    image: "porkRice.jpg", 
    description: "Delicious pork fried rice",
    available: true,
    rating: 4.3,
    preparationTime: 12,
    spiceLevel: "mild",
    isVegetarian: false
  },
  { 
    name: "Vegetable Rice", 
    price: 750, 
    category: "rice",
    image: "vegetableRice.jpg", 
    description: "Healthy mixed vegetable rice",
    available: true,
    rating: 4.0,
    preparationTime: 8,
    spiceLevel: "mild",
    isVegetarian: true,
    isVegan: true
  },
  { 
    name: "Beef Pork Rice", 
    price: 1350, 
    category: "rice",
    image: "beefPorkRice.jpg", 
    description: "Mixed meat fried rice",
    available: true,
    rating: 4.6,
    preparationTime: 18,
    spiceLevel: "mild",
    isVegetarian: false
  }
];

const directSeed = async () => {
  try {
    console.log('=== DIRECT DATABASE SEEDING ===');
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
    
    console.log('Clearing existing menu items...');
    const deleteResult = await connection.db.collection('menu-items').deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing items`);
    
    console.log('Inserting new menu items...');
    const insertResult = await connection.db.collection('menu-items').insertMany(seedMenuItems);
    console.log(`✅ Inserted ${insertResult.insertedCount} new items`);
    
    console.log('Verifying insertion...');
    const count = await connection.db.collection('menu-items').countDocuments();
    console.log(`✅ Verification: ${count} items now in database`);
    
    if (count > 0) {
      const sampleItems = await connection.db.collection('menu-items').find().limit(3).toArray();
      console.log('Sample items:', sampleItems.map(item => `${item.name} (${item.category}) - $${item.price}`));
    }
    
    await connection.close();
    console.log('🎉 Direct seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Direct seeding failed:', error);
    process.exit(1);
  }
};

directSeed();
