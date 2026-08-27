const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Consumable',
        'Restorative Material',
        'Endodontic',
        'Prosthodontic',
        'Preventive',
        'Sterilization',
        'Anesthetic',
        'Other'
      ],
      message: '{VALUE} is not a valid category',
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  batchNumber: {
    type: String,
    required: [true, 'Batch number is required'],
    trim: true,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
  }
}, {
  timestamps: true,
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
