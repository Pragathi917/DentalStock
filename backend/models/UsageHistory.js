const mongoose = require('mongoose');

const usageHistorySchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'Inventory item ID is required'],
  },
  itemName: {
    type: String,
    required: [true, 'Item name snapshot is required'],
    trim: true,
  },
  quantityUsed: {
    type: Number,
    required: [true, 'Quantity used is required'],
    min: [1, 'Quantity used must be at least 1'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    enum: {
      values: [
        'General Treatment',
        'Cleaning',
        'Extraction',
        'Root Canal',
        'Restoration',
        'Preventive Care',
        'Other'
      ],
      message: '{VALUE} is not a valid purpose',
    }
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt for history logs
});

const UsageHistory = mongoose.model('UsageHistory', usageHistorySchema);

module.exports = UsageHistory;
