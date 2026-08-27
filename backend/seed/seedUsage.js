require('dotenv').config();
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const UsageHistory = require('../models/UsageHistory');
const User = require('../models/User');

const seedUsageHistory = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    // Clear existing usage logs
    await UsageHistory.deleteMany({});
    console.log('Cleared existing usage logs.');

    // Find the admin user to associate with records
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please run seed:admin first.');
    }

    // Find some of our seeded items to add history logs for
    const gloves = await Inventory.findOne({ name: 'Dental Latex Gloves' });
    const resin = await Inventory.findOne({ name: 'Composite Resin' });
    const masks = await Inventory.findOne({ name: 'Surgical Masks' });

    const usageData = [];

    // 1. Logs for Dental Latex Gloves (Expected average: 500, current stock: 450, recommended: 50)
    if (gloves) {
      usageData.push(
        { inventoryId: gloves._id, itemName: gloves.name, quantityUsed: 450, date: new Date('2026-06-15'), purpose: 'Cleaning', recordedBy: adminUser._id },
        { inventoryId: gloves._id, itemName: gloves.name, quantityUsed: 500, date: new Date('2026-07-20'), purpose: 'Cleaning', recordedBy: adminUser._id },
        { inventoryId: gloves._id, itemName: gloves.name, quantityUsed: 550, date: new Date('2026-08-10'), purpose: 'Cleaning', recordedBy: adminUser._id }
      );
    }

    // 2. Logs for Composite Resin (Expected average: 35, current stock: 28, recommended: 7)
    if (resin) {
      usageData.push(
        { inventoryId: resin._id, itemName: resin.name, quantityUsed: 30, date: new Date('2026-06-10'), purpose: 'Restoration', recordedBy: adminUser._id },
        { inventoryId: resin._id, itemName: resin.name, quantityUsed: 35, date: new Date('2026-07-15'), purpose: 'Restoration', recordedBy: adminUser._id },
        { inventoryId: resin._id, itemName: resin.name, quantityUsed: 40, date: new Date('2026-08-05'), purpose: 'Restoration', recordedBy: adminUser._id }
      );
    }

    // 3. Logs for Surgical Masks
    if (masks) {
      usageData.push(
        { inventoryId: masks._id, itemName: masks.name, quantityUsed: 290, date: new Date('2026-06-08'), purpose: 'General Treatment', recordedBy: adminUser._id },
        { inventoryId: masks._id, itemName: masks.name, quantityUsed: 300, date: new Date('2026-07-12'), purpose: 'General Treatment', recordedBy: adminUser._id },
        { inventoryId: masks._id, itemName: masks.name, quantityUsed: 310, date: new Date('2026-08-18'), purpose: 'General Treatment', recordedBy: adminUser._id }
      );
    }

    if (usageData.length > 0) {
      await UsageHistory.insertMany(usageData);
      console.log(`Seeded ${usageData.length} usage logs.`);
    } else {
      console.log('No matching inventory items found to attach usage logs.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding usage logs failed:', error.message);
    process.exit(1);
  }
};

seedUsageHistory();
