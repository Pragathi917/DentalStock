require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('Connecting to database for admin seeding...');
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    const name = process.env.ADMIN_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@dentalstock.com';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      console.error('Error: ADMIN_PASSWORD is not defined in environment variables or .env file');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin account with email "${email}" already exists. Seed process skipped.`);
      process.exit(0);
    }

    const adminUser = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();

    console.log('=========================================');
    console.log('Initial Admin User created successfully:');
    console.log(`Name:  ${name}`);
    console.log(`Email: ${email}`);
    console.log('=========================================');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding admin user failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
