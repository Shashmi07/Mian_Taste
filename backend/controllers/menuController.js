const getMenuItemModel = require('../models/MenuItem');

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    console.log('=== GET ALL MENU ITEMS ===');
    const MenuItem = getMenuItemModel();
    console.log('MenuItem model obtained');
    
    const { category, available, search } = req.query;
    let filter = {};

    // Filter by category if provided
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Filter by availability if provided
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Using filter:', filter);
    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    console.log(`Found ${menuItems.length} menu items`);
    console.log('First few items:', menuItems.slice(0, 3).map(item => ({ name: item.name, category: item.category })));
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const { category } = req.params;
    const menuItems = await MenuItem.find({ 
      category: category,
      available: true 
    }).sort({ name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

// Get single menu item
const getMenuItemById = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Error fetching menu item', error: error.message });
  }
};

// Create new menu item (Admin only)
const createMenuItem = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const menuItemData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'image'];
    for (let field of requiredFields) {
      if (!menuItemData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const newMenuItem = new MenuItem(menuItemData);
    const savedMenuItem = await newMenuItem.save();
    
    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem: savedMenuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

// Update menu item (Admin only)
const updateMenuItem = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// Delete menu item (Admin only)
const deleteMenuItem = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const { id } = req.params;
    
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({
      message: 'Menu item deleted successfully',
      menuItem: deletedMenuItem
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};

// Toggle menu item availability (Admin only)
const toggleAvailability = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const { id } = req.params;
    
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    menuItem.available = !menuItem.available;
    const updatedMenuItem = await menuItem.save();
    
    res.json({
      message: `Menu item ${updatedMenuItem.available ? 'enabled' : 'disabled'} successfully`,
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error('Error toggling menu item availability:', error);
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

// Get menu categories
const getCategories = async (req, res) => {
  try {
    const MenuItem = getMenuItemModel();
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getCategories
};
