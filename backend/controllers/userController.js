const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new staff user
// @route   POST /api/users
// @access  Admin only
const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email and password');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409);
      throw new Error('User already exists with this email');
    }

    // Default to 'staff' if role is omitted or if they try to pass something else.
    // Allow creating staff only to prevent security issues.
    const finalRole = role === 'admin' ? 'admin' : 'staff';

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
    });

    res.status(201).json({
      success: true,
      message: `${finalRole.charAt(0).toUpperCase() + finalRole.slice(1)} user created successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin only
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400);
      throw new Error('Invalid user ID format');
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // 1. Prevent deleting the currently logged-in admin
    if (userId === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot delete your own account');
    }

    // 2. Prevent deleting an admin if they are the only admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        res.status(400);
        throw new Error('Cannot delete the only administrator account in the system');
      }
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createStaff,
  deleteUser,
};
