require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Admin = require('../models/Admin');
const RestaurantSettings = require('../models/RestaurantSettings');
const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();

  // Clear existing
  await Category.deleteMany();
  await MenuItem.deleteMany();

  // Create admin if not exists
  const adminExists = await Admin.findOne({});
  if (!adminExists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@restaurant.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });
    console.log('Admin created');
  }

  // Default settings
  const settingsExists = await RestaurantSettings.findOne({});
  if (!settingsExists) {
    await RestaurantSettings.create({
      restaurantName: 'Spice Garden',
      currency: '₹',
    });
  }

  // Categories
  const cats = await Category.insertMany([
    { name: 'Starters', sortOrder: 1 },
    { name: 'Main Course', sortOrder: 2 },
    { name: 'Drinks', sortOrder: 3 },
    { name: 'Desserts', sortOrder: 4 },
  ]);

  const [starters, main, drinks, desserts] = cats;

  // Menu Items
  await MenuItem.insertMany([
    { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 220, category: starters._id, foodType: 'veg' },
    { name: 'Chicken Wings', description: 'Crispy fried chicken wings', price: 280, category: starters._id, foodType: 'non-veg' },
    { name: 'Veg Spring Rolls', description: 'Crispy rolls with veggie filling', price: 160, category: starters._id, foodType: 'veg' },
    { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 320, category: main._id, foodType: 'non-veg' },
    { name: 'Dal Makhani', description: 'Slow cooked black lentils', price: 220, category: main._id, foodType: 'veg' },
    { name: 'Paneer Butter Masala', description: 'Rich paneer curry', price: 260, category: main._id, foodType: 'veg' },
    { name: 'Mango Lassi', description: 'Sweet yogurt mango drink', price: 90, category: drinks._id, foodType: 'veg' },
    { name: 'Cold Coffee', description: 'Blended iced coffee', price: 110, category: drinks._id, foodType: 'veg' },
    { name: 'Gulab Jamun', description: 'Soft milk dumplings in sugar syrup', price: 80, category: desserts._id, foodType: 'veg' },
    { name: 'Chocolate Brownie', description: 'Warm brownie with ice cream', price: 140, category: desserts._id, foodType: 'veg' },
  ]);

  console.log('✅ Seed complete!');
  process.exit();
};

seed();