require('dotenv').config();
const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');

const inventoryData = [
  { name: 'Dental Latex Gloves', category: 'Preventive', quantity: 450, unit: 'boxes', minimumStock: 100, supplier: 'Dental Supplies Ltd', price: 50, batchNumber: 'B-01', expiryDate: new Date('2026-10-22') },
  { name: 'Nitrile Examination Gloves', category: 'Preventive', quantity: 85, unit: 'boxes', minimumStock: 100, supplier: 'MedCare Supplies', price: 65, batchNumber: 'B-02', expiryDate: new Date('2026-12-15') },
  { name: 'Surgical Masks', category: 'Preventive', quantity: 320, unit: 'boxes', minimumStock: 100, supplier: 'SafeMed India', price: 35, batchNumber: 'B-03', expiryDate: new Date('2027-01-18') },
  { name: 'Disposable Patient Bibs', category: 'Preventive', quantity: 75, unit: 'boxes', minimumStock: 100, supplier: 'Dental Essentials', price: 120, batchNumber: 'B-04', expiryDate: new Date('2026-11-30') },
  { name: 'Face Shields', category: 'Preventive', quantity: 60, unit: 'pieces', minimumStock: 50, supplier: 'MedEquip Pvt Ltd', price: 180, batchNumber: 'B-05', expiryDate: new Date('2028-02-10') },
  { name: 'Composite Resin', category: 'Restorative Material', quantity: 28, unit: 'syringes', minimumStock: 30, supplier: 'Dentsply Supplies', price: 850, batchNumber: 'B-06', expiryDate: new Date('2026-09-12') },
  { name: 'Glass Ionomer Cement', category: 'Restorative Material', quantity: 45, unit: 'packs', minimumStock: 20, supplier: 'GC Dental India', price: 620, batchNumber: 'B-07', expiryDate: new Date('2027-05-25') },
  { name: 'Dental Bonding Agent', category: 'Restorative Material', quantity: 18, unit: 'bottles', minimumStock: 20, supplier: '3M Dental', price: 950, batchNumber: 'B-08', expiryDate: new Date('2026-10-08') },
  { name: 'Temporary Filling Material', category: 'Restorative Material', quantity: 35, unit: 'packs', minimumStock: 15, supplier: 'Prime Dental', price: 480, batchNumber: 'B-09', expiryDate: new Date('2027-03-20') },
  { name: 'Dental Etching Gel', category: 'Restorative Material', quantity: 12, unit: 'syringes', minimumStock: 15, supplier: 'DentCare', price: 350, batchNumber: 'B-10', expiryDate: new Date('2026-09-28') },
  { name: 'Local Anesthetic Cartridges', category: 'Anesthetic', quantity: 240, unit: 'cartridges', minimumStock: 100, supplier: 'SeptoDent', price: 18, batchNumber: 'B-11', expiryDate: new Date('2027-11-15') },
  { name: 'Topical Anesthetic Gel', category: 'Anesthetic', quantity: 8, unit: 'tubes', minimumStock: 10, supplier: 'Medico Dental', price: 210, batchNumber: 'B-12', expiryDate: new Date('2026-09-05') },
  { name: 'Anesthetic Syringes', category: 'Anesthetic', quantity: 90, unit: 'pieces', minimumStock: 100, supplier: 'Dental Supplies Ltd', price: 12, batchNumber: 'B-13', expiryDate: new Date('2029-04-18') },
  { name: 'Dental Needles', category: 'Anesthetic', quantity: 420, unit: 'pieces', minimumStock: 150, supplier: 'SafeMed India', price: 8, batchNumber: 'B-14', expiryDate: new Date('2028-06-30') },
  { name: 'Endodontic Files', category: 'Endodontic', quantity: 65, unit: 'sets', minimumStock: 30, supplier: 'EndoCare', price: 1250, batchNumber: 'B-15', expiryDate: new Date('2028-12-10') },
  { name: 'Gutta Percha Points', category: 'Endodontic', quantity: 25, unit: 'packs', minimumStock: 30, supplier: 'EndoCare', price: 450, batchNumber: 'B-16', expiryDate: new Date('2026-10-17') },
  { name: 'Root Canal Sealer', category: 'Endodontic', quantity: 6, unit: 'packs', minimumStock: 10, supplier: 'Dentsply Supplies', price: 1100, batchNumber: 'B-17', expiryDate: new Date('2026-09-03') },
  { name: 'Dental Impression Material', category: 'Prosthodontic', quantity: 40, unit: 'packs', minimumStock: 20, supplier: '3M Dental', price: 780, batchNumber: 'B-18', expiryDate: new Date('2027-02-22') },
  { name: 'Alginate Impression Powder', category: 'Prosthodontic', quantity: 15, unit: 'packs', minimumStock: 20, supplier: 'Dental Essentials', price: 420, batchNumber: 'B-19', expiryDate: new Date('2026-12-14') },
  { name: 'Dental Wax', category: 'Prosthodontic', quantity: 80, unit: 'packs', minimumStock: 25, supplier: 'Prime Dental', price: 150, batchNumber: 'B-20', expiryDate: new Date('2028-08-20') },
  { name: 'Orthodontic Brackets', category: 'Other', quantity: 35, unit: 'sets', minimumStock: 15, supplier: 'OrthoCare India', price: 1500, batchNumber: 'B-21', expiryDate: new Date('2029-07-15') },
  { name: 'Orthodontic Archwires', category: 'Other', quantity: 18, unit: 'packs', minimumStock: 20, supplier: 'OrthoCare India', price: 650, batchNumber: 'B-22', expiryDate: new Date('2028-01-30') },
  { name: 'Dental Polishing Paste', category: 'Preventive', quantity: 7, unit: 'tubes', minimumStock: 10, supplier: 'DentCare', price: 180, batchNumber: 'B-23', expiryDate: new Date('2026-08-25') },
  { name: 'Fluoride Varnish', category: 'Preventive', quantity: 22, unit: 'packs', minimumStock: 15, supplier: 'GC Dental India', price: 550, batchNumber: 'B-24', expiryDate: new Date('2026-09-02') },
  { name: 'Sterilization Pouches', category: 'Sterilization', quantity: 180, unit: 'packs', minimumStock: 100, supplier: 'SteriMed', price: 300, batchNumber: 'B-25', expiryDate: new Date('2029-12-31') },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    // Clear existing inventory
    await Inventory.deleteMany({});
    console.log('Cleared existing inventory items.');

    // Insert new data
    await Inventory.insertMany(inventoryData);
    console.log('Successfully seeded 25 inventory items.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding inventory data failed:', error.message);
    process.exit(1);
  }
};

seedDB();
