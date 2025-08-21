require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.CUSTOMER_MONGO_URI;
const client = new MongoClient(uri);

// Exact items from Menu.jsx - matching the frontend exactly
const menuItems = [
  // Ramen items (17 items)
  { name: "Chicken Ramen", price: "RS.1100", image: "chickenRamen.jpg", description: "Bowl of ramen with tender chicken", category: "Ramen", rating: 4.8, available: true },
  { name: "Egg Ramen", price: "RS.950", image: "eggRamen.jpg", description: "Delicious ramen with soft-boiled egg", category: "Ramen", rating: 4.5, available: true },
  { name: "Pork Ramen", price: "RS.1300", image: "porkRamen.jpg", description: "Bowl of ramen with juicy pork slices", category: "Ramen", rating: 4.9, available: true },
  { name: "Beef Ramen", price: "RS.1500", image: "beefRamen.jpg", description: "Delicious ramen with flavorful beef slices", category: "Ramen", rating: 4.7, available: true },
  { name: "Seafood Ramen", price: "RS.1400", image: "SeafoodRamen.jpg", description: "Fresh seafood in savory ramen broth", category: "Ramen", rating: 4.6, available: true },
  { name: "Vegan Ramen", price: "RS.850", image: "veganRamen.jpeg", description: "Fresh vegetables in light ramen broth", category: "Ramen", rating: 4.3, available: true },
  { name: "Pork and Beef Ramen", price: "RS.1600", image: "beefandPorkRamen.jpg", description: "Bowl of ramen with both pork and beef slices", category: "Ramen", rating: 4.9, available: true },
  { name: "Buldak Chicken Ramen", price: "RS.1200", image: "buldakChicken.jpg", description: "Spicy Buldak chicken ramen", category: "Ramen", rating: 4.8, available: true },
  { name: "Buldak Black Ramen", price: "RS.950", image: "blackRamen.jpg", description: "Spicy Buldak black ramen", category: "Ramen", rating: 4.4, available: true },
  { name: "Buldak Pork Ramen", price: "RS.1300", image: "buldakPork.jpg", description: "Spicy Buldak pork ramen", category: "Ramen", rating: 4.7, available: true },
  { name: "Buldak Beef Ramen", price: "RS.1400", image: "buldakBeef.jpg", description: "Spicy Buldak beef ramen", category: "Ramen", rating: 4.8, available: true },
  { name: "Buldak Beef & Pork Ramen", price: "RS.1500", image: "beefPorkBuldak.jpg", description: "Spicy Buldak pork and beef ramen", category: "Ramen", rating: 4.9, available: true },
  { name: "Cheese Ramen", price: "RS.1000", image: "cheeseRamen.png", description: "Creamy ramen topped with melted cheese", category: "Ramen", rating: 4.6, available: true },
  { name: "Cheese Chicken Ramen", price: "RS.1250", image: "cheeseChicken.jpg", description: "Delicious cheese ramen with tender chicken", category: "Ramen", rating: 4.8, available: true },
  { name: "Cheese Pork Ramen", price: "RS.1350", image: "cheesePork.jpg", description: "Delicious cheese ramen with pork slices", category: "Ramen", rating: 4.7, available: true },
  { name: "Cheese Beef Ramen", price: "RS.1500", image: "beefCheese.jpg", description: "Creamy cheese ramen with flavorful beef", category: "Ramen", rating: 4.9, available: true },
  { name: "Cheese Beef and Pork Ramen", price: "RS.1600", image: "beefPork.jpg", description: "Cheese ramen with both beef and pork slices", category: "Ramen", rating: 4.8, available: true },

  // Rice items (6 items)
  { name: "Chicken Fried Rice", price: "RS.1100", image: "rice.png", description: "Delicious fried rice with chicken", category: "Rice", rating: 4.5, available: true },
  { name: "Vegetable Fried Rice", price: "RS.950", image: "vegetableRice.jpg", description: "Fried rice with fresh vegetables", category: "Rice", rating: 4.2, available: true },
  { name: "Egg Fried Rice", price: "RS.950", image: "eggRice.png", description: "Golden fried rice with fluffy egg", category: "Rice", rating: 4.4, available: true },
  { name: "Pork Fried Rice", price: "RS.1300", image: "porkRice.jpg", description: "Savory rice with pork pieces", category: "Rice", rating: 4.6, available: true },
  { name: "Beef Fried Rice", price: "RS.1500", image: "beefRice.jpg", description: "Fried rice with flavorful beef", category: "Rice", rating: 4.7, available: true },
  { name: "Beef & Pork Fried Rice", price: "RS.1600", image: "beefPorkRice.jpg", description: "Tasty mix of beef and pork in fried rice", category: "Rice", rating: 4.8, available: true },

  // Soup items (4 items)
  { name: "Chicken Soup", price: "RS.400", image: "chickenSoup.jpg", description: "Warm soup with tender chicken", category: "Soup", rating: 4.3, available: true },
  { name: "Pork Soup", price: "RS.500", image: "porkSoup.jpg", description: "Classic pork soup", category: "Soup", rating: 4.4, available: true },
  { name: "Beef and Pork Soup", price: "RS.650", image: "beefPorkSoup.jpg", description: "Soup with mix of pork and beef", category: "Soup", rating: 4.6, available: true },
  { name: "Beef Soup", price: "RS.600", image: "beefSoup.jpg", description: "Beef soup with vegetables", category: "Soup", rating: 4.5, available: true },

  // Drink items (4 items)
  { name: "Coke", price: "RS.120", image: "cocacola.jpg", description: "Cocacola 250ml Bottle", category: "Drinks", rating: 4.2, available: true },
  { name: "Ginger Beer", price: "RS.150", image: "gingerBeer.png", description: "Ginger Beer 250ml Bottle", category: "Drinks", rating: 4.0, available: true },
  { name: "Sprite", price: "RS.120", image: "sprite.jpeg", description: "Sprite 250ml Bottle", category: "Drinks", rating: 4.1, available: true },
  { name: "Orange Juice", price: "RS.200", image: "orangeJuice.jpg", description: "Freshly squeezed orange juice", category: "Drinks", rating: 4.5, available: true },

  // More items (2 items)
  { name: "Wooden Chopsticks", price: "RS.50", image: "wooden.jpg", description: "One wooden chopstick", category: "More", rating: 4.0, available: true },
  { name: "Bamboo Chopsticks", price: "RS.100", image: "bamboo.jpg", description: "One bamboo chopstick", category: "More", rating: 4.3, available: true },
];

async function syncMenuItems() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('customer-dashboard');
    const collection = db.collection('menu-items');
    
    // Clear existing items
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing items`);
    
    // Insert exact items from Menu page
    const insertResult = await collection.insertMany(menuItems);
    console.log(`Inserted ${insertResult.insertedCount} new items`);
    
    // Verify the count by category
    console.log('\nFinal item counts by category:');
    const categories = ['Ramen', 'Rice', 'Soup', 'Drinks', 'More'];
    
    for (const category of categories) {
      const count = await collection.countDocuments({ category });
      console.log(`${category}: ${count} items`);
    }
    
    const totalCount = await collection.countDocuments({});
    console.log(`\nTotal items in database: ${totalCount}`);
    
    console.log('\nDatabase successfully synchronized with Menu page!');
    
  } catch (error) {
    console.error('Error syncing menu items:', error);
  } finally {
    await client.close();
  }
}

syncMenuItems();
