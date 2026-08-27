const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const { getInventoryStatus } = require('../utils/inventoryStatus');

// Helper to validate request body fields
const validateInventoryInput = (body) => {
  const { name, category, quantity, unit, minimumStock, supplier, price, batchNumber, expiryDate } = body;
  
  if (!name || !category || quantity === undefined || !unit || minimumStock === undefined || !supplier || price === undefined || !batchNumber || !expiryDate) {
    return 'All fields are required';
  }

  if (Number(quantity) < 0) return 'Quantity cannot be negative';
  if (Number(minimumStock) < 0) return 'Minimum stock cannot be negative';
  if (Number(price) < 0) return 'Price cannot be negative';

  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) {
    return 'Invalid expiry date';
  }

  const validCategories = [
    'Consumable',
    'Restorative Material',
    'Endodontic',
    'Prosthodontic',
    'Preventive',
    'Sterilization',
    'Anesthetic',
    'Other'
  ];
  if (!validCategories.includes(category)) {
    return `Category must be one of: ${validCategories.join(', ')}`;
  }

  return null;
};

// @desc    Get all inventory with filters & sorting
// @route   GET /api/inventory
// @access  Authenticated users (Admin/Staff)
const getInventory = async (req, res, next) => {
  try {
    const { search, category, status, sort } = req.query;
    
    // Build Mongoose query object
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    // Build sorting object
    let sortQuery = { createdAt: -1 }; // Default sort
    if (sort === 'expiryDate') {
      sortQuery = { expiryDate: 1 };
    } else if (sort === 'quantity') {
      sortQuery = { quantity: 1 };
    }

    // Fetch items from DB
    let items = await Inventory.find(query).sort(sortQuery);

    // Map the status dynamically for each item
    let formattedItems = items.map(item => {
      const itemStatus = getInventoryStatus(item.quantity, item.minimumStock, item.expiryDate);
      return {
        ...item.toObject(),
        status: itemStatus
      };
    });

    // Apply status filter in memory (since status is dynamic)
    if (status) {
      formattedItems = formattedItems.filter(item => item.status === status);
    }

    res.status(200).json({
      success: true,
      message: 'Inventory fetched successfully',
      data: formattedItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item details
// @route   GET /api/inventory/:id
// @access  Authenticated users (Admin/Staff)
const getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid inventory ID format');
    }

    const item = await Inventory.findById(id);

    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    const itemStatus = getInventoryStatus(item.quantity, item.minimumStock, item.expiryDate);

    res.status(200).json({
      success: true,
      message: 'Inventory item fetched successfully',
      data: {
        ...item.toObject(),
        status: itemStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Admin only
const createInventory = async (req, res, next) => {
  try {
    const errorMsg = validateInventoryInput(req.body);
    if (errorMsg) {
      res.status(400);
      throw new Error(errorMsg);
    }

    const newItem = new Inventory(req.body);
    const savedItem = await newItem.save();

    const itemStatus = getInventoryStatus(savedItem.quantity, savedItem.minimumStock, savedItem.expiryDate);

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: {
        ...savedItem.toObject(),
        status: itemStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Admin only
const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid inventory ID format');
    }

    const errorMsg = validateInventoryInput(req.body);
    if (errorMsg) {
      res.status(400);
      throw new Error(errorMsg);
    }

    const item = await Inventory.findById(id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    const itemStatus = getInventoryStatus(updatedItem.quantity, updatedItem.minimumStock, updatedItem.expiryDate);

    res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: {
        ...updatedItem.toObject(),
        status: itemStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Admin only
const deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid inventory ID format');
    }

    const item = await Inventory.findById(id);
    if (!item) {
      res.status(404);
      throw new Error('Inventory item not found');
    }

    await Inventory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};
